function dataUrlMediaType(dataUrl: string): string {
  const match = /^data:([^;,]+)/.exec(dataUrl);
  return match ? match[1] : "application/octet-stream";
}

const BASE64_DATA_URL = /^data:[^,]*;base64,(.*)$/s;

// returns the base64 payload of a "data:...;base64," URL
export function dataUrlToBase64(dataUrl: string): string {
  const match = BASE64_DATA_URL.exec(dataUrl);
  if (!match) {
    throw new Error("Invalid base64 data URL");
  }
  return match[1];
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const binary = atob(dataUrlToBase64(dataUrl));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: dataUrlMediaType(dataUrl) });
}
