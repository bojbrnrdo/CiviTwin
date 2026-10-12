import {Box3,Vector3} from "three";
import type {ImportedMesh} from "./ifc-loader";

export type ModelDiagnostics={
 meshCount:number; elementCount:number; triangleCount:number;
 bounds:{min:[number,number,number];max:[number,number,number];size:[number,number,number]}|null;
 warnings:string[];
};
export function inspectGeometry(meshes:ReadonlyArray<Pick<ImportedMesh,"geometry"|"expressId">>):ModelDiagnostics{
 const bounds=new Box3(), warnings:string[]=[];
 let triangleCount=0;
 const ids=new Set<number>();
 for(const mesh of meshes){
  ids.add(mesh.expressId);
  const geometry=mesh.geometry;
  const index=geometry.getIndex();
  triangleCount+=index?index.count/3:geometry.getAttribute("position").count/3;
  if(!geometry.boundingBox)geometry.computeBoundingBox();
  if(geometry.boundingBox && !geometry.boundingBox.isEmpty())bounds.union(geometry.boundingBox);
 }
 let box:ModelDiagnostics["bounds"]=null;
 if(!bounds.isEmpty()){
  const min=bounds.min.toArray() as [number,number,number];
  const max=bounds.max.toArray() as [number,number,number];
  const size=bounds.getSize(new Vector3()).toArray() as [number,number,number];
  if([...min,...max,...size].every(Number.isFinite))box={min,max,size};
  else warnings.push("Non-finite geometry bounds detected.");
 }
 if(!box)warnings.push("Model has no usable bounding box.");
 if(triangleCount>500000)warnings.push("High triangle count may impact laptop performance.");
 return {meshCount:meshes.length,elementCount:ids.size,triangleCount,bounds:box,warnings};
}
