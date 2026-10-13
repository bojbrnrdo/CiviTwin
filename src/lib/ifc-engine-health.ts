export function getIfcWasmUrl(origin: string): string {
  return new URL('/wasm/web-ifc.wasm', origin).href;
}
