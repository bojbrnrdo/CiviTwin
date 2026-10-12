"use client";
import dynamic from "next/dynamic";
import {useCallback,useState} from "react";
const IfcScene=dynamic(()=>import("@/components/IfcScene"),{ssr:false});
export default function IfcWorkspace({onReturn}:{onReturn:()=>void}){
 const [file,setFile]=useState<File|null>(null);
 const [selection,setSelection]=useState<number|null>(null);
 const [meta,setMeta]=useState<Record<number,Record<string,string>>>({});
 const onMetadata=useCallback((value:Record<number,Record<string,string>>)=>setMeta(value),[]);
 return <section className="importworkspace">
 <div className="importtoolbar"><button onClick={onReturn}>Back to sample</button><label className="upload">Import IFC file (maximum 15 MB)<input type="file" accept=".ifc" onChange={e=>{
  const chosen=e.target.files?.[0];
  if(!chosen)return;
  if(!chosen.name.toLowerCase().endsWith(".ifc")||chosen.size>15*1024*1024||chosen.size===0){alert("Choose a nonempty IFC file smaller than 15 MB");return;}
  setMeta({});setSelection(null);setFile(chosen);
 }}/></label><span className="subtle">Browser-only: file is not uploaded to a server.</span></div>
 <div className="ifcgrid"><div className="viewport">{file?<IfcScene file={file} selectedId={selection} onSelect={setSelection} onMetadata={onMetadata}/>:<div className="ifcstatus">Choose an IFC file to inspect geometry and element metadata.</div>}</div><aside className="panel"><h2>IFC Element Inspector</h2>{selection!==null?Object.entries(meta[selection]??{ExpressID:String(selection)}).map(([k,v])=><p key={k}><strong>{k}:</strong> {v}</p>):<p>Select a model component.</p>}<div className="notice">Experimental IFC importer. Coordinate origin, units, and model fidelity must be verified before engineering use. Large files may exceed device memory.</div></aside></div>
 </section>;
}
