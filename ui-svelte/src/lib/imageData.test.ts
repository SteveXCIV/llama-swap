import { describe, it, expect } from "vitest";
import { dataUrlToBase64, dataUrlToBlob } from "./imageData";

const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNgYGAAAAAEAAH2FzhVAAAAAElFTkSuQmCC";
const PNG_DATA_URL = `data:image/png;base64,${PNG_BASE64}`;

describe("dataUrlToBase64", () => {
  it("strips the data URL prefix", () => {
    expect(dataUrlToBase64(PNG_DATA_URL)).toBe(PNG_BASE64);
  });

  it("returns an empty string for a data URL with no payload", () => {
    expect(dataUrlToBase64("data:image/png;base64,")).toBe("");
  });

  it("throws when there is no comma separator", () => {
    expect(() => dataUrlToBase64("not-a-data-url")).toThrow();
  });

  it("throws for an arbitrary string that merely contains a comma", () => {
    expect(() => dataUrlToBase64("hello,world")).toThrow();
  });

  it("throws for a non-base64 data URL", () => {
    expect(() => dataUrlToBase64("data:text/plain,hello")).toThrow();
  });
});

describe("dataUrlToBlob", () => {
  it("decodes a data URL into a Blob with the correct media type", () => {
    const blob = dataUrlToBlob(PNG_DATA_URL);
    expect(blob.type).toBe("image/png");
    expect(blob.size).toBe(atob(PNG_BASE64).length);
  });

  it("preserves the original bytes", async () => {
    const blob = dataUrlToBlob(PNG_DATA_URL);
    const bytes = new Uint8Array(await blob.arrayBuffer());

    const binary = atob(PNG_BASE64);
    const expected = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      expected[i] = binary.charCodeAt(i);
    }
    expect(bytes).toEqual(expected);
  });

  it("falls back to application/octet-stream when the media type is absent", () => {
    const blob = dataUrlToBlob(`data:;base64,${PNG_BASE64}`);
    expect(blob.type).toBe("application/octet-stream");
  });
});
