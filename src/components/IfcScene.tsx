"use client";
import {useEffect,useMemo,useState} from "react";
import {Canvas} from "@react-three/fiber";
import {Bounds,OrbitControls,Grid,useBounds} from "@react-three/drei";
import {Box3,Vector3} from "three";
import {loadIfc,type ImportedIfc} from "@/lib/ifc-loader";
import {inspectGeometry,type ModelDiagnostics} from "@/lib/model-diagnostics";

function FitImportedModel({model}:{model:ImportedIfc}){
 const bounds=useBounds();
 const box=useMemo(()=>{
  const result=new Box3();
  model.meshes.forEach(mesh=>{mesh.geometry.computeBoundingBox(); if(mesh.geometry.boundingBox)result.union(mesh.geometry.boundingBox);});
  return result;
 },[model]);
 useEffect(()=>{
  if(!box.isEmpty())bounds.refresh(box).clip().fit();
 },[bounds,box]);
 return null;
}

export default function IfcScene({file,selectedId,onSelect,onMetadata,onDiagnostics}:{file:File;selectedId:number|null;onSelect:(id:number|null)=>void;onMetadata:(m:Record<number,Record<string,string>>)=>void;onDiagnostics:(d:ModelDiagnostics)=>void}){
 const [model,setModel]=useState<ImportedIfc|null>(null);
 const [error,setError]=useState<string|null>(null);
 useEffect(()=>{
  let cancelled=false;let loaded:ImportedIfc|null=null;
  setModel(null);setError(null);
  (async()=>{try{
   const bytes=new Uint8Array(await file.arrayBuffer());
   loaded=await loadIfc(bytes);
   if(cancelled){loaded.dispose();return;}
   if(loaded.meshes.length===0){loaded.dispose();loaded=null;throw new Error("No displayable geometry found in IFC file.");}
   setModel(loaded);onMetadata(loaded.metadata);onDiagnostics(inspectGeometry(loaded.meshes));
  }catch(e){if(!cancelled)setError(e instanceof Error?e.message:"IFC model could not be loaded");}})();
  return()=>{cancelled=true;loaded?.dispose();};
 },[file,onMetadata,onDiagnostics]);
 return <><Canvas camera={{position:[14,12,14],near:0.01,far:10000}} onPointerMissed={()=>onSelect(null)}>
 <color attach="background" args={["#b8cbd5"]}/><ambientLight intensity={1.3}/><directionalLight position={[10,20,10]} intensity={2}/>
 <Bounds margin={1.25}>{model&&<><FitImportedModel model={model}/>{model.meshes.map((m,i)=><mesh key={i} geometry={m.geometry} onClick={e=>{e.stopPropagation();onSelect(m.expressId)}}><meshStandardMaterial color={selectedId===m.expressId?"#f5b459":m.color} side={2} transparent={m.opacity<1} opacity={m.opacity}/></mesh>)}</>}</Bounds>
 <Grid infiniteGrid cellSize={1} sectionSize={5} fadeDistance={80}/><OrbitControls makeDefault/></Canvas>
 {error&&<div role="alert" className="ifcstatus">IFC import error: {error}</div>}
 {!model&&!error&&<div className="ifcstatus">Loading IFC geometry…</div>}</>;
}
