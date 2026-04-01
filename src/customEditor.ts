import * as vscode from "vscode";
import sharp from "sharp";
import * as fs from "node:fs/promises";
import { extract } from "./metadata";
import { getWorkspaceConfiguration } from "./config";
import * as view from "./view";

export class ImageDocument implements vscode.CustomDocument {
  constructor(readonly uri: vscode.Uri) {}
  dispose(): void {}
}

export class ImageMetadataEditorProvider
  implements vscode.CustomReadonlyEditorProvider<ImageDocument>
{
  static readonly viewType = "image-metadata-viewer.customEditor";

  async openCustomDocument(
    uri: vscode.Uri,
    _openContext: vscode.CustomDocumentOpenContext,
    _token: vscode.CancellationToken,
  ): Promise<ImageDocument> {
    return new ImageDocument(uri);
  }

  async resolveCustomEditor(
    document: ImageDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken,
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: false,
      localResourceRoots: [vscode.Uri.joinPath(document.uri, "..")],
    };

    const filePath = document.uri.fsPath;
    try {
      const buf = await fs.readFile(filePath);
      const meta = await sharp(buf).metadata();
      const metadata = await extract(filePath, buf, meta);
      const imgUri = webviewPanel.webview.asWebviewUri(document.uri);
      const workspaceConfiguration = getWorkspaceConfiguration();
      webviewPanel.webview.html = view.renderHtml(
        metadata,
        imgUri,
        workspaceConfiguration,
      );
    } catch (err) {
      vscode.window.showErrorMessage(
        "Failed to read image metadata: " +
          (err instanceof Error ? err.message : String(err)),
        { modal: false },
      );
    }
  }
}

export async function syncEditorAssociations(enabled: boolean): Promise<void> {
  const config = vscode.workspace.getConfiguration();
  const current = config.get<Record<string, string>>(
    "workbench.editorAssociations",
    {},
  );
  const updated = { ...current };
  let changed = false;

  const imagePatterns = [
    "*.png",
    "*.jpg",
    "*.jpeg",
    "*.gif",
    "*.bmp",
    "*.webp",
    "*.tif",
    "*.tiff",
  ];

  const skipped: string[] = [];

  for (const pattern of imagePatterns) {
    if (enabled) {
      const existing = updated[pattern];
      if (existing && existing !== ImageMetadataEditorProvider.viewType) {
        skipped.push(pattern);
      } else if (existing !== ImageMetadataEditorProvider.viewType) {
        updated[pattern] = ImageMetadataEditorProvider.viewType;
        changed = true;
      }
    } else if (updated[pattern] === ImageMetadataEditorProvider.viewType) {
      delete updated[pattern];
      changed = true;
    }
  }

  if (skipped.length > 0) {
    vscode.window.showWarningMessage(
      `The following patterns already have a custom editor association and were not overwritten: ${skipped.join(", ")}`,
    );
  }

  if (changed) {
    await config.update(
      "workbench.editorAssociations",
      updated,
      vscode.ConfigurationTarget.Global,
    );
  }
}
