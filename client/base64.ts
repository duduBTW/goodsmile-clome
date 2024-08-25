export function encodeBase64(input: string) {
  return btoa(input);
}

export function decodeBase64(encoded: string) {
  return atob(encoded);
}
