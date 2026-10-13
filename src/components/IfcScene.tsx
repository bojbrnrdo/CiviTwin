"use client";
import {useEffect,useMemo,useState} from "react";
import {Canvas} from "@react-three/fiber";
import {Bounds,OrbitControls,Grid,useBounds} from "@react-three/drei";
import {Box3} from "three";
import {loadIfc,type ImportedIfc} from "@/lib/ifc-loader";
import {inspectGeometry,type ModelDiagnostics} from "@/lib/model-diagnostics";
import {classifyIfcMaterial} from "@/lib/ifc-materials";

function FitImportedModel({model,selectedId,isolateSelected,categoryFilter,fitRequest}:{model:ImportedIfc;selectedId:number|null;isolateSelected:boolean;categoryFilter:string;fitRequest:{target:"model"|"selection";sequence:number}}){
 const bounds=useBounds();
 const box=useMemo(()=>{
  const result=new Box3();
  model.meshes.filter(mesh=>fitRequest.target==="model"||(fitRequest.target==="selection"&&selectedId!==null?mesh.expressId===selectedId:(!isolateSelected||selectedId===null||mesh.expressId===selectedId)&&(categoryFilter==="All"||model.metadata[mesh.expressId]?.EntityType===categoryFilter))).forEach(mesh=>{mesh.geometry.computeBoundingBox(); if(mesh.geometry.boundingBox)result.union(mesh.geometry.boundingBox);});
  return result;
 },[model,selectedId,isolateSelected,categoryFilter,fitRequest]);
 useEffect(()=>{
  if(!box.isEmpty())bounds.refresh(box).clip().fit();
 },[bounds,box]);
 return null;
}

export default function IfcScene({file,selectedId,onSelect,onMetadata,onDiagnostics,onImportError,viewMode,showGrid,categoryFilter,isolateSelected,fitRequest}:{file:File;selectedId:number|null;onSelect:(id:number|null)=>void;onMetadata:(m:Record<number,Record<string,string>>)=>void;onDiagnostics:(d:ModelDiagnostics)=>void;onImportError:()=>void;viewMode:"realistic"|"technical";showGrid:boolean;categoryFilter:string;isolateSelected:boolean;fitRequest:{target:"model"|"selection";sequence:number}}){
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
   const diagnostics=inspectGeometry(loaded.meshes);
   if(cancelled){loaded.dispose();loaded=null;return;}
   setModel(loaded);onMetadata(loaded.metadata);onDiagnostics(diagnostics);
  }catch(e){loaded?.dispose();loaded=null;if(!cancelled){setModel(null);onImportError();setError(e instanceof Error?e.message:"IFC model could not be loaded");}}})().catch(e=>{loaded?.dispose();loaded=null;if(!cancelled){onImportError();setError(e instanceof Error?e.message:"Unexpected IFC import failure");}});
  return()=>{cancelled=true;loaded?.dispose();};
 },[file,onMetadata,onDiagnostics,onImportError]);
 return <><Canvas camera={{position:[14,12,14],near:0.01,far:10000}} onPointerMissed={()=>onSelect(null)}>
 <color attach="background" args={[viewMode==="realistic"?"#b8cbd5":"#101d2c"]}/><ambientLight intensity={viewMode==="realistic"?1.3:1.8}/><directionalLight position={[10,20,10]} intensity={viewMode==="realistic"?2.1:1.2}/><directionalLight position={[-9,8,-5]} intensity={viewMode==="realistic"?0.65:0.3}/>
 <Bounds margin={1.25}>{model&&<><FitImportedModel model={model} selectedId={selectedId} isolateSelected={isolateSelected} categoryFilter={categoryFilter} fitRequest={fitRequest}/>{model.meshes.filter(m=>(!isolateSelected||selectedId===null||m.expressId===selectedId)&&(categoryFilter==="All"||model.metadata[m.expressId]?.EntityType===categoryFilter)).map((m,i)=>{const material=classifyIfcMaterial(model.metadata[m.expressId],m.color);return <mesh key={i} geometry={m.geometry} onClick={e=>{e.stopPropagation();onSelect(m.expressId)}}><meshStandardMaterial color={selectedId===m.expressId?"#f5b459":viewMode==="realistic"?material.color:"#58bfed"} metalness={viewMode==="realistic"?material.metalness:0.25} roughness={viewMode==="realistic"?material.roughness:0.48} side={2} transparent={m.opacity<1} opacity={m.opacity}/></mesh>})}</>}</Bounds>
 {showGrid&&<Grid infiniteGrid cellSize={1} sectionSize={5} fadeDistance={80}/>}<OrbitControls makeDefault/></Canvas>
 {error&&<div role="alert" className="ifcstatus">IFC import error: {error}</div>}
 {!model&&!error&&<div className="ifcstatus">Loading IFC geometry…</div>}</>;
}
