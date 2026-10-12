/** Conservative IFC STEP length-unit detection for educational diagnostics.
 * Never silently assume geometry coordinates are metres.
 * Conversion-based units and conflicting assignments remain unsupported.
 */
export type IfcLengthUnit = {label:string; metresPerUnit:number; confidence:"declared"|"unknown"; warning?:string};
const factors:Record<string,number>={MILLI:1e-3,CENTI:1e-2,DECI:1e-1,DECA:10,HECTO:100,KILO:1000};
export function detectIfcLengthUnit(step:string):IfcLengthUnit{
 const unknown=(warning:string):IfcLengthUnit=>({label:"Unknown",metresPerUnit:NaN,confidence:"unknown",warning});
 const matches=[...step.matchAll(/IFCSIUNIT\s*\(\s*\*\s*,\s*\.LENGTHUNIT\.\s*,\s*(\$|\.[A-Z]+\.)\s*,\s*\.METRE\.\s*\)/gi)];
 const conversion=/IFCCONVERSIONBASEDUNIT(?:WITHOFFSET)?\s*\(/i.test(step);
 if(matches.length!==1||conversion)return unknown("Missing, conflicting, or conversion-based length units. Manual BIM verification required.");
 const prefix=matches[0][1].toUpperCase().replaceAll(".","");
 if(prefix==="$")return {label:"metre",metresPerUnit:1,confidence:"declared"};
 const factor=factors[prefix];
 if(factor===undefined)return unknown("Unrecognized SI unit prefix.");
 return {label:prefix.toLowerCase()+"metre",metresPerUnit:factor,confidence:"declared"};
}
