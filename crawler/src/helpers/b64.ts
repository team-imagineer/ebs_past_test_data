export function encodeToBase64(s: string) {
  return Buffer.from(s).toString('base64');
}

export function decodeFromBase64(s: string) {
  return Buffer.from(s, 'base64').toString();
}
