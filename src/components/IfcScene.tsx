"use client";
import {useEffect,useState} from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls,Grid} from "@react-three/drei";
import {loadIfc,type ImportedIfc} from "@/lib/ifc-loader";
export default function IfcScene({file,selectedId,onSelect,onMetadata}:{file:File;selectedId:number|null;onSelect:(id:number|null)=>void;onMetadata:(m:Record<number,Record<string,string>>)=>void}){
 const [model,setModel]=useState<ImportedIfc|null>(null);
 const [error,setError]=useState<string|null>(null);
 useEffect(()=>{
  let cancelled=false;let loaded:ImportedIfc|null=null;
  setModel(null);setError(null);
  (async()=>{try{
   const bytes=new Uint8Array(await file.arrayBuffer());
   loaded=await loadIfc(bytes);
   if(cancelled){loaded.dispose();return;}
   setModel(loaded);onMetadata(loaded.metadata);
  }catch(e){if(!cancelled)setError(e instanceof Error?e.message:"IFC model could not be loaded");}})();
  return()=>{cancelled=true;loaded?.dispose();};
 },[file,onMetadata]);
 return <><Canvas camera={{position:[14,12,14],near:0.01,far:10000}} onPointerMissed={()=>onSelect(null)}>
 <color attach="background" args={["#b8cbd5"]}/><ambientLight intensity={1.3}/><directionalLight position={[10,20,10]} intensity={2}/>
 {model?.meshes.map((m,i)=><mesh key={i} geometry={m.geometry} onClick={e=>{e.stopPropagation();onSelect(m.expressId)}}><meshStandardMaterial color={selectedId===m.expressId?"#f5b459":m.color} side={2}/></mesh>)}
 <Grid infiniteGrid cellSize={1} sectionSize={5} fadeDistance={80}/><OrbitControls makeDefault/></Canvas>
 {error&&<div role="alert" className="ifcstatus">IFC import error: {error}</div>}
 {!model&&!error&&<div className="ifcstatus">Loading IFC geometry…</div>}</>;
}
