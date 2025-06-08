import pako from "pako";

export const compressToBase64 = (jsonStr) =>
  btoa(String.fromCharCode(...pako.deflate(jsonStr)));

export const decompressFromBase64 = (base64Str) => {
  const binary = atob(base64Str);
  const compressed = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return pako.inflate(compressed, { to: "string" });
};

export const truncate = (str, maxLen = 30) =>
  str.length > maxLen ? str.slice(0, maxLen - 3) + "..." : str;
