import * as assert from "assert";
import { formatExifKey, stringifyExifValue } from "../metadata";

suite("formatExifKey", () => {
  test("should format camelCase and snake_case keys", () => {
    assert.strictEqual(formatExifKey("DateTimeOriginal"), "Date Time Original");
    assert.strictEqual(formatExifKey("GPSLatitudeRef"), "Latitude Ref");
    assert.strictEqual(formatExifKey("user_comment"), "User comment");
    assert.strictEqual(formatExifKey("FNumber"), "F Number");
    assert.strictEqual(formatExifKey("ISO100"), "ISO 100");
    assert.strictEqual(formatExifKey("A"), "A");
  });
});

suite("stringifyExifValue", () => {
  test("should stringify primitives", () => {
    assert.strictEqual(stringifyExifValue("key", 123), "123");
    assert.strictEqual(stringifyExifValue("key", "abc"), "abc");
    assert.strictEqual(stringifyExifValue("key", true), "true");
    assert.strictEqual(stringifyExifValue("key", null), "");
  });
  test("should stringify arrays", () => {
    assert.strictEqual(stringifyExifValue("key", [1, 2, 3]), "1, 2, 3");
    assert.strictEqual(stringifyExifValue("key", ["a", "b"]), "a, b");
    assert.strictEqual(
      stringifyExifValue("key", [
        [1, 2],
        [3, 4],
      ]),
      "1, 2, 3, 4",
    );
  });
  test("should stringify objects", () => {
    assert.strictEqual(
      stringifyExifValue("key", { foo: 1, bar: "baz" }),
      "Foo=1, Bar=baz",
    );
    assert.strictEqual(
      stringifyExifValue("key", { a: [1, 2], b: { c: 3 } }),
      "A=1, 2, B=C=3",
    );
  });
});
