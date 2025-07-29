import * as vscode from "vscode";
import { WorkspaceConfiguration } from "./config";
import { stringifyExifValue, type Metadata } from "./metadata";

export function renderHtml(
  metadata: Metadata,
  imgUri: vscode.Uri,
  settings: WorkspaceConfiguration,
): string {
  const fileSectionHtml = renderFileInfoSection(metadata.file);
  const exifSectionHtml = metadata.exif ? renderExifSection(metadata.exif) : "";
  const gpsSectionHtml = metadata.gps ? renderGpsSection(metadata.gps) : "";
  const noExifSectionHtml =
    !metadata.gps && !metadata.exif ? "<p>No EXIF data found.</p>" : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(metadata.file.name)}</title>
      <style>
        body {
          font-family: ${settings.fontFamily};
          font-size: ${settings.fontSize}px;
          color: var(--vscode-editor-foreground);
          background-color: var(--vscode-editor-background);
          padding: 1em;
          margin: 0;
        }
        .image-preview {
          margin-bottom: 1em;
        }
        .section {
          margin-bottom: 2em;
        }
        .section-title {
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 0.5em;
          padding-bottom: 0.25em;
          border-bottom: 1px solid #ccc;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
        }
        .info-table th,
        .info-table td {
          text-align: left;
          padding: 0.25em 0.5em;
          border-bottom: 1px solid #eee;
        }
        .info-table th {
          font-weight: bold;
          background-color: var(--vscode-editor-lineHighlightBackground);
          width: 200px;
        }
        .info-table td {
          word-break: break-all;
        }
        .json-data {
          padding: 1em;
          border-radius: 4px;
          white-space: pre-wrap;
          background-color: var(--vscode-editor-lineHighlightBackground);
          overflow-x: auto;
        }
      </style>
    </head>
    <body>
      <img src="${imgUri}" class="image-preview" alt="${escapeHtml(metadata.file.name)}" />

      <div class="section">
        ${fileSectionHtml}
      </div>

      ${exifSectionHtml}
      ${gpsSectionHtml}
      ${noExifSectionHtml}

      <div class="section">
        <div class="section-title">Data (JSON)</div>
        <div class="json-data">${escapeHtml(JSON.stringify(createFormattedData(metadata), null, 2))}</div>
      </div>
    </body>
    </html>
    `;
}

function escapeHtml(str: string): string {
  return str.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] || c,
  );
}

function createFormattedData(metadata: Metadata): any {
  const formatted: any = {
    file: metadata.file,
  };

  if (metadata.exif) {
    formatted.exif = {};
    for (const [key, value] of Object.entries(metadata.exif)) {
      formatted.exif[key] = stringifyExifValue(key, value);
    }
  }

  if (metadata.gps) {
    formatted.gps = {};
    for (const [key, value] of Object.entries(metadata.gps)) {
      formatted.gps[key] = stringifyExifValue(key, value);
    }
  }

  return formatted;
}

export function renderSection(title: string, entries: string[][]): string {
  return `
    <div class="section">
      <div class="section-title">${title}</div>
      <table class="info-table">
        ${entries
          .map(
            ([key, value]) => `
          <tr>
            <th>${escapeHtml(key)}</th>
            <td>${escapeHtml(value)}</td>
          </tr>
        `,
          )
          .join("")}
      </table>
    </div>
  `;
}

export function renderFileInfoSection(file: Metadata["file"]): string {
  const entries = [
    ["File Name", file.name],
    ["Format", file.format || "Unknown"],
    ["Size", file.size],
  ];

  if (file.width && file.height) {
    entries.push(["Resolution", `${file.width} x ${file.height}`]);
  }
  return renderSection("File Infomation", entries);
}

export function renderExifSection(exifData: Record<string, any>): string {
  const entries = Object.entries(exifData).map(([key, value]) => {
    const formattedKey = formatExifKey(key);
    return [formattedKey, stringifyExifValue(key, value)];
  });
  return renderSection("EXIF Data", entries);
}

export function renderGpsSection(gpsData: Record<string, any>): string {
  const entries = Object.entries(gpsData).map(([key, value]) => {
    const formattedKey = formatExifKey(key);
    return [formattedKey, stringifyExifValue(key, value)];
  });
  return renderSection("GPS Data", entries);
}

export function formatExifKey(key: string): string {
  // Remove GPS prefix for GPS keys
  if (key.startsWith("GPS")) {
    key = key.slice(3);
  }

  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-zA-Z])([0-9]+)/g, "$1 $2")
    .replace(/^./, (m) => m.toUpperCase());
}
