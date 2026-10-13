export const MAX_IFC_BYTES = 15 * 1024 * 1024;
export function validateIfcFile(name:string, size:number, header:string):string|null {
 if (!name.toLowerCase().endsWith(".ifc")) return "Only .ifc STEP files are supported.";
 if (!Number.isFinite(size) || size<=0 || size>MAX_IFC_BYTES) return "IFC file must be larger than zero and no more than 15 MB.";
 if (!header.trimStart().toUpperCase().startsWith("ISO-10303-21;")) return "This file does not have a valid IFC STEP header (ISO-10303-21).";
 return null;
}
