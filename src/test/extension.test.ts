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
    const imageInfo = await extract(asset("example.png"), buf, meta);

    // Test basic file information
    assert.strictEqual(imageInfo.file.name, "example.png");
    assert.strictEqual(imageInfo.file.format, "png");
    assert.ok(typeof imageInfo.file.size === "string");
    assert.ok(imageInfo.file.size.length > 0);
    assert.ok(imageInfo.file.width && imageInfo.file.width > 0);
    assert.ok(imageInfo.file.height && imageInfo.file.height > 0);

    // Test JSON structure
    assert.ok(typeof imageInfo === "object");
    assert.ok(typeof imageInfo.file === "object");
  });

  test("extract returns all EXIF and GPS values for JPEG", async () => {
    const buf = await fs.readFile(asset("example.jpg"));
    const meta = await sharp(buf).metadata();
    const imageInfo = await extract(asset("example.jpg"), buf, meta);

    // Test basic file information
    assert.strictEqual(imageInfo.file.name, "example.jpg");
    assert.strictEqual(imageInfo.file.format, "jpeg");
    assert.ok(typeof imageInfo.file.size === "string");
    assert.ok(imageInfo.file.size.length > 0);

    // Test EXIF presence
    assert.ok(imageInfo.exif);
    assert.ok(Object.keys(imageInfo.exif).length > 0);

    // Test specific EXIF fields
    const exif = imageInfo.exif!;
    assert.ok(exif.Make || exif.make, "Should have camera make");
    assert.ok(exif.Model || exif.model, "Should have camera model");
    assert.ok(exif.Software || exif.software, "Should have software info");
    assert.ok(
      exif.ImageDescription || exif.imageDescription || exif.Description,
      "Should have image description",
    );

    // Test GPS presence
    assert.ok(imageInfo.gps);
    assert.ok(Object.keys(imageInfo.gps).length > 0);

    // Test specific GPS fields
    const gps = imageInfo.gps!;
    assert.ok(gps.GPSLatitude || gps.Latitude, "Should have latitude");
    assert.ok(gps.GPSLongitude || gps.Longitude, "Should have longitude");
    assert.ok(gps.GPSAltitude || gps.Altitude, "Should have altitude");

    // Test JSON serialization
    const jsonString = JSON.stringify(imageInfo);
    assert.ok(jsonString.length > 0);
    const parsed = JSON.parse(jsonString);
    assert.deepStrictEqual(parsed, imageInfo);
  });

  test("extract returns basic info for a GIF", async () => {
    const buf = await fs.readFile(asset("example.gif"));
    const meta = await sharp(buf).metadata();
    const imageInfo = await extract(asset("example.gif"), buf, meta);

    assert.strictEqual(imageInfo.file.name, "example.gif");
    assert.strictEqual(imageInfo.file.format, "gif");
    assert.ok(typeof imageInfo.file.size === "string");
    assert.ok(imageInfo.file.size.length > 0);
  });

  test("extract returns basic info for a WEBP", async () => {
    const buf = await fs.readFile(asset("example.webp"));
    const meta = await sharp(buf).metadata();
    const imageInfo = await extract(asset("example.webp"), buf, meta);

    assert.strictEqual(imageInfo.file.name, "example.webp");
    assert.strictEqual(imageInfo.file.format, "webp");
    assert.ok(typeof imageInfo.file.size === "string");
    assert.ok(imageInfo.file.size.length > 0);
  });

  test("extract returns basic info for a TIFF", async () => {
    const buf = await fs.readFile(asset("example.tiff"));
    const meta = await sharp(buf).metadata();
    const imageInfo = await extract(asset("example.tiff"), buf, meta);

    assert.strictEqual(imageInfo.file.name, "example.tiff");
    assert.strictEqual(imageInfo.file.format, "tiff");
    assert.ok(typeof imageInfo.file.size === "string");
    assert.ok(imageInfo.file.size.length > 0);
  });
});
