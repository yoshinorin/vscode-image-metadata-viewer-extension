import * as assert from "assert";
import * as path from "path";
import sharp from "sharp";
import * as fs from "node:fs/promises";
import { extract } from "../metadata";

suite("Image Info Logic Test Suite", () => {
  const asset = (name: string) =>
    path.join(__dirname, "../../src/test/assets/" + name);

  test("extract returns basic info for a PNG", async () => {
    const buf = await fs.readFile(asset("example.png"));
    const meta = await sharp(buf).metadata();
    const metadata = await extract(asset("example.png"), buf, meta);

    // Test basic file information
    assert.strictEqual(metadata.file.name, "example.png");
    assert.strictEqual(metadata.file.format, "png");
    assert.ok(typeof metadata.file.size === "string");
    assert.ok(metadata.file.size.length > 0);
    assert.ok(metadata.file.width && metadata.file.width > 0);
    assert.ok(metadata.file.height && metadata.file.height > 0);

    // Test JSON structure
    assert.ok(typeof metadata === "object");
    assert.ok(typeof metadata.file === "object");
  });

  test("extract returns all EXIF and GPS values for JPEG", async () => {
    const buf = await fs.readFile(asset("example.jpg"));
    const meta = await sharp(buf).metadata();
    const metadata = await extract(asset("example.jpg"), buf, meta);

    // Test basic file information
    assert.strictEqual(metadata.file.name, "example.jpg");
    assert.strictEqual(metadata.file.format, "jpeg");
    assert.ok(typeof metadata.file.size === "string");
    assert.ok(metadata.file.size.length > 0);

    // Test EXIF presence
    assert.ok(metadata.exif);
    assert.ok(Object.keys(metadata.exif).length > 0);

    // Test specific EXIF fields
    const exif = metadata.exif!;
    assert.ok(exif.Make || exif.make, "Should have camera make");
    assert.ok(exif.Model || exif.model, "Should have camera model");
    assert.ok(exif.Software || exif.software, "Should have software info");
    assert.ok(
      exif.ImageDescription || exif.imageDescription || exif.Description,
      "Should have image description",
    );

    // Test GPS presence
    assert.ok(metadata.gps);
    assert.ok(Object.keys(metadata.gps).length > 0);

    // Test specific GPS fields
    const gps = metadata.gps!;
    assert.ok(gps.GPSLatitude || gps.Latitude, "Should have latitude");
    assert.ok(gps.GPSLongitude || gps.Longitude, "Should have longitude");
    assert.ok(gps.GPSAltitude || gps.Altitude, "Should have altitude");

    // Test JSON serialization
    const jsonString = JSON.stringify(metadata);
    assert.ok(jsonString.length > 0);
  });

  test("extract returns basic info for a GIF", async () => {
    const buf = await fs.readFile(asset("example.gif"));
    const meta = await sharp(buf).metadata();
    const metadata = await extract(asset("example.gif"), buf, meta);

    assert.strictEqual(metadata.file.name, "example.gif");
    assert.strictEqual(metadata.file.format, "gif");
    assert.ok(typeof metadata.file.size === "string");
    assert.ok(metadata.file.size.length > 0);
  });

  test("extract returns basic info for a WEBP", async () => {
    const buf = await fs.readFile(asset("example.webp"));
    const meta = await sharp(buf).metadata();
    const metadata = await extract(asset("example.webp"), buf, meta);

    assert.strictEqual(metadata.file.name, "example.webp");
    assert.strictEqual(metadata.file.format, "webp");
    assert.ok(typeof metadata.file.size === "string");
    assert.ok(metadata.file.size.length > 0);
  });

  test("extract returns basic info for a TIFF", async () => {
    const buf = await fs.readFile(asset("example.tiff"));
    const meta = await sharp(buf).metadata();
    const metadata = await extract(asset("example.tiff"), buf, meta);

    assert.strictEqual(metadata.file.name, "example.tiff");
    assert.strictEqual(metadata.file.format, "tiff");
    assert.ok(typeof metadata.file.size === "string");
    assert.ok(metadata.file.size.length > 0);
  });
});
