import type {ModelDiagnostics} from "./model-diagnostics";
import type {IfcLengthUnit} from "./ifc-units";

export type IfcAuditReport={
  format:"civitwin-ifc-diagnostic-v1";
  file:{name:string;bytes:number};
  declaredLengthUnit:{label:string;metresPerUnit:number|null;confidence:string;warning:string|null};
  diagnostics:ModelDiagnostics;
  elements:{expressId:number;properties:Record<string,string>}[];
  limitations:string[];
};
export function createIfcAuditReport(file:{name:string;size:number},units:IfcLengthUnit|null,diagnostics:ModelDiagnostics,metadata:Record<number,Record<string,string>>):IfcAuditReport{
 const elements=Object.entries(metadata).map(([id,properties])=>({expressId:Number(id),properties:{...properties}})).filter(x=>Number.isSafeInteger(x.expressId)).sort((a,b)=>a.expressId-b.expressId);
 return {
  format:"civitwin-ifc-diagnostic-v1",
  file:{name:file.name,bytes:file.size},
  declaredLengthUnit:{label:units?.label??"Unknown",metresPerUnit:units&&Number.isFinite(units.metresPerUnit)?units.metresPerUnit:null,confidence:units?.confidence??"unknown",warning:units?.warning??null},
  diagnostics,
  elements,
  limitations:[
   "Experimental browser-generated metadata report, not certified BIM verification.",
   "Raw geometry coordinates are not independently verified physical dimensions.",
   "Structural analysis, design compliance and load-bearing safety are not assessed."
  ]
 };
}
