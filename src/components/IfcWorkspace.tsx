"use client";
import dynamic from "next/dynamic";
import {useCallback,useState} from "react";
import {validateIfcFile} from "@/lib/ifc-validation";
import {detectIfcLengthUnit,type IfcLengthUnit} from "@/lib/ifc-units";
const IfcScene=dynamic(()=>import("@/components/IfcScene"),{ssr:false});
export default function IfcWorkspace({onReturn}:{onReturn:()=>void}){
 const [file,setFile]=useState<File|null>(null);
 const [selection,setSelection]=useState<number|null>(null);
 const [meta,setMeta]=useState<Record<number,Record<string,string>>>({});
 const [validationError,setValidationError]=useState<string|null>(null);
 const [units,setUnits]=useState<IfcLengthUnit|null>(null);
 const onMetadata=useCallback((value:Record<number,Record<string,string>>)=>setMeta(value),[]);
 const onPick=async(chosen:File|undefined)=>{
  if(!chosen)return;
  setValidationError(null);
  const header=await chosen.slice(0,128).text();
  const issue=validateIfcFile(chosen.name,chosen.size,header);
  if(issue){setValidationError(issue);return;}
  const declaration=await chosen.slice(0,Math.min(chosen.size,1024*1024)).text();
  setUnits(detectIfcLengthUnit(declaration));
  setMeta({});setSelection(null);setFile(chosen);
 };
 return <section className="importworkspace">
 <div className="importtoolbar"><button onClick={onReturn}>Back to sample</button><label className="upload">Import IFC (max 15 MB)<input type="file" accept=".ifc" onChange={e=>{void onPick(e.target.files?.[0]); e.currentTarget.value="";}}/></label><span className="subtle">Processed in your browser; not uploaded to CiviTwin servers.</span></div>
 {validationError&&<div role="alert" className="notice">{validationError}</div>}
 <div className="ifcgrid"><div className="viewport">{file?<IfcScene file={file} selectedId={selection} onSelect={setSelection} onMetadata={onMetadata}/>:<div className="ifcstatus">Choose an IFC file to inspect geometry and properties.</div>}</div><aside className="panel"><h2>IFC Inspector</h2><p>{file?file.name:"No file selected"}</p><p>Parsed elements: {Object.keys(meta).length}</p><p>Declared length unit (preliminary): {units?.label??"Not inspected"}</p>{units?.warning&&<div className="notice">{units.warning}</div>}{selection!==null?Object.entries(meta[selection]??{ExpressID:String(selection)}).map(([k,v])=><p key={k}><strong>{k}:</strong> {v}</p>):<p>Select an imported model component.</p>}<div className="notice">Experimental. IFC units, coordinate placement, geometry and property fidelity require independent model QA. A valid header does not guarantee a safe or supported file.</div></aside></div>
 </section>;
}
