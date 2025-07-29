import * as path from "path";
import { type Metadata as SharpMetadata } from "sharp";
import exifReader from "exif-reader";

export interface Metadata {
  file: {
    name: string;
    format: string | undefined;
    size: string;
    width?: number;
    height?: number;
  };
  exif?: Record<string, any>;
  gps?: Record<string, any>;
}

function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000;
    unitIndex++;
  }

  const formatted = unitIndex === 0 ? size.toString() : size.toFixed(1);
  return `${formatted} ${units[unitIndex]}`;
}

export async function extract(
  imgPath: string,
  buf: Buffer,
  meta: SharpMetadata,
): Promise<Metadata> {
  const metadata: Metadata = {
    file: {
      name: path.basename(imgPath),
      format: meta.format,
      size: formatFileSize(buf.length),
      width: meta.width,
      height: meta.height,
    },
  };

  if (!meta.exif) {
    return metadata;
  }

  try {
    const exif = exifReader(meta.exif);

    // Extract EXIF data
    const exifData: Record<string, any> = {};
    const gpsData: Record<string, any> = {};

    const exifKeys = ["0th", "Image", "Exif", "Photo", "Interop", "1st"];
    const gpsKeys = ["GPS", "GPSInfo"];

    // Process EXIF sections
    for (const key of exifKeys) {
      const dict = exif[key as keyof typeof exif] as any;
      if (dict && typeof dict === "object") {
        Object.assign(exifData, dict);
      }
    }

    // Process GPS sections
    for (const key of gpsKeys) {
      const dict = exif[key as keyof typeof exif] as any;
      if (dict && typeof dict === "object") {
        Object.assign(gpsData, dict);
      }
    }

    if (Object.keys(exifData).length > 0) {
      metadata.exif = exifData;
    }

    if (Object.keys(gpsData).length > 0) {
      metadata.gps = gpsData;
    }
  } catch (ex) {
    // Keep hasExif true but don't include parsed data
    console.error("Failed to parse EXIF data:", ex);
  }

  return metadata;
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

export function stringifyExifValue(key: string, val: any): string {
  if (val == null) return "";

  if (val instanceof Buffer || val instanceof Uint8Array) {
    try {
      if (key == "Components Configuration") {
        const components = Array.from(val);
        const names = ["", "Y", "Cb", "Cr", "R", "G", "B"];
        const componentNames = components.map(
          (c) => names[c] || `Unknown(${c})`,
        );
        return componentNames.join(", ");
      }

      const decoded = Buffer.from(val).toString("utf8");
      const printable = decoded.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();
      return printable || "[Binary Data]";
    } catch {
      return "[Binary Data]";
    }
  }

  if (
    typeof val === "string" ||
    typeof val === "number" ||
    typeof val === "boolean"
  ) {
    return String(val);
  }
  if (Array.isArray(val)) {
    return val.map((item) => stringifyExifValue(key, item)).join(", ");
  }
  if (typeof val === "object") {
    return Object.entries(val)
      .map(([k, v]) => `${formatExifKey(k)}=${stringifyExifValue(k, v)}`)
      .join(", ");
  }
  return String(val);
}
