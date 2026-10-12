"use client";
import dynamic from "next/dynamic";
import {useCallback,useState} from "react";
import {validateIfcFile} from "@/lib/ifc-validation";
import {detectIfcLengthUnit,type IfcLengthUnit} from "@/lib/ifc-units";
import type {ModelDiagnostics} from "@/lib/model-diagnostics";
import {createIfcAuditReport} from "@/lib/ifc-report";
const IfcScene=dynamic(()=>import("@/components/IfcScene"),{ssr:false});
export default function IfcWorkspace({onReturn}:{onReturn:()=>void}){
 const [file,setFile]=useState<File|null>(null);
 const [viewMode,setViewMode]=useState<"realistic"|"technical">("realistic");
 const [selection,setSelection]=useState<number|null>(null);
 const [meta,setMeta]=useState<Record<number,Record<string,string>>>({});
 const [validationError,setValidationError]=useState<string|null>(null);
 const [units,setUnits]=useState<IfcLengthUnit|null>(null);
 const [diagnostics,setDiagnostics]=useState<ModelDiagnostics|null>(null);
 const onMetadata=useCallback((value:Record<number,Record<string,string>>)=>setMeta(value),[]);
 const onDiagnostics=useCallback((value:ModelDiagnostics)=>setDiagnostics(value),[]);
 const exportReport=()=>{
  if(!file||!diagnostics)return;
  const report=createIfcAuditReport({name:file.name,size:file.size},units,diagnostics,meta);
  const blob=new Blob([JSON.stringify(report,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");link.href=url;link.download="civitwin-ifc-diagnostics.json";link.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 const onPick=async(chosen:File|undefined)=>{
  if(!chosen)return;
  setValidationError(null);
  const header=await chosen.slice(0,128).text();
  const issue=validateIfcFile(chosen.name,chosen.size,header);
  if(issue){setValidationError(issue);return;}
  const declaration=await chosen.slice(0,Math.min(chosen.size,1024*1024)).text();
  setUnits(detectIfcLengthUnit(declaration));
  setMeta({});setDiagnostics(null);setSelection(null);setFile(chosen);
 };
 return <section className="importworkspace">
 <div className="importtoolbar"><button onClick={onReturn}>Back to sample</button><label className="upload">Import IFC (max 15 MB)<input type="file" accept=".ifc" onChange={e=>{void onPick(e.target.files?.[0]); e.currentTarget.value="";}}/></label><span className="subtle">Processed in your browser; not uploaded to CiviTwin servers.</span><button type="button" aria-pressed={viewMode==="realistic"} onClick={()=>setViewMode("realistic")}>Material view</button><button type="button" aria-pressed={viewMode==="technical"} onClick={()=>setViewMode("technical")}>Technical view</button><button type="button" disabled={!diagnostics} onClick={exportReport}>Export diagnostics JSON</button></div>
 {validationError&&<div role="alert" className="notice">{validationError}</div>}
 <div className="ifcgrid"><div className="viewport">{file?<IfcScene file={file} selectedId={selection} onSelect={setSelection} onMetadata={onMetadata} onDiagnostics={onDiagnostics} viewMode={viewMode}/>:<div className="ifcstatus">Choose an IFC file to inspect geometry and properties.</div>}</div><aside className="panel"><h2>IFC Inspector</h2><p>{file?file.name:"No file selected"}</p><p>Parsed elements: {Object.keys(meta).length}</p>{diagnostics&&<section><h2>Geometry Diagnostics</h2><p>Unique element IDs: {diagnostics.elementCount}</p><p>Mesh fragments: {diagnostics.meshCount}</p><p>Triangles: {diagnostics.triangleCount.toLocaleString()}</p><p>Raw coordinate extents: {diagnostics.bounds?.size.map(v=>v.toFixed(3)).join(" × ")??"Unavailable"}</p><p className="subtle">Raw geometry units are not verified physical dimensions.</p>{diagnostics.warnings.map((w,i)=><p key={i} role="status">{w}</p>)}</section>}<p>Declared length unit (preliminary): {units?.label??"Not inspected"}</p>{units?.warning&&<div className="notice">{units.warning}</div>}{selection!==null?Object.entries(meta[selection]??{ExpressID:String(selection)}).map(([k,v])=><p key={k}><strong>{k}:</strong> {v}</p>):<p>Select an imported model component.</p>}<div className="notice">Experimental. IFC units, coordinate placement, geometry and property fidelity require independent model QA. A valid header does not guarantee a safe or supported file.</div></aside></div>
 </section>;
}
