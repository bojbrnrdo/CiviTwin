import type {BufferGeometry} from "three";
import type {ModelElement} from "./model";

export type ImportedMesh = {id:number; geometry:BufferGeometry; color:number; expressId:number};
export type ImportedIfc = {meshes:ImportedMesh[]; metadata:Record<number,Record<string,string>>;dispose:()=>void};
/**
 * Loads IFC in the browser using web-ifc's WASM runtime.
 * Browser memory is bounded by caller-supplied file size restrictions.
 * IFC-derived quantities/geometry are unverified until model QA.
 */
export async function loadIfc(data:Uint8Array):Promise<ImportedIfc>{
 const IFC=await import("web-ifc");
 const api=new IFC.IfcAPI();
 api.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.74/",true);
 await api.Init();
 const modelId=api.OpenModel(data, IFC.DEFAULT);
 const meshes:ImportedMesh[]=[];
 const metadata:Record<number,Record<string,string>>={};
 const geometries:BufferGeometry[]=[];
 try{
  const {BufferGeometry,BufferAttribute}=await import("three");
  api.StreamAllMeshes(modelId,(mesh)=>{
   const id=mesh.expressID;
   for(let i=0;i<mesh.geometries.size();i++){
    const placed=mesh.geometries.get(i);
    const geometry=api.GetGeometry(modelId,placed.geometryExpressID);
    try{
     const vertex=api.GetVertexArray(geometry.GetVertexData(),geometry.GetVertexDataSize());
     const index=api.GetIndexArray(geometry.GetIndexData(),geometry.GetIndexDataSize());
     const positions=new Float32Array(vertex.length/2);
     const normals=new Float32Array(vertex.length/2);
     for(let j=0;j<vertex.length/6;j++){for(let k=0;k<3;k++){positions[j*3+k]=vertex[j*6+k];normals[j*3+k]=vertex[j*6+3+k];}}
     const g=new BufferGeometry();
     g.setAttribute("position",new BufferAttribute(positions,3));
     g.setAttribute("normal",new BufferAttribute(normals,3));
     g.setIndex(new BufferAttribute(index,1));
     const transform=placed.flatTransformation;
     const {Matrix4}=requireThreeMath();
     const matrix=new Matrix4().fromArray(Array.from(transform));
     g.applyMatrix4(matrix);
     geometries.push(g);
     const c=placed.color;
     const color=((Math.round(c.x*255)&255)<<16)|((Math.round(c.y*255)&255)<<8)|(Math.round(c.z*255)&255);
     meshes.push({id,expressId:id,geometry:g,color});
    }finally{geometry.delete();}
   }
   try{
    const props=api.GetLine(modelId,id,false) as Record<string,unknown>;
    const out:Record<string,string>={ExpressID:String(id),EntityType:String(props?.type??"Unknown")};
    for(const key of ["Name","Description","GlobalId","ObjectType","PredefinedType"]){
      const value=props?.[key] as {value?:unknown}|undefined;
      if(value && value.value!==undefined)out[key]=String(value.value);
    }
    metadata[id]=out;
   }catch{metadata[id]={ExpressID:String(id)};}
  });
  return {meshes,metadata,dispose:()=>{geometries.forEach(g=>g.dispose());api.CloseModel(modelId);}};
 }catch(error){geometries.forEach(g=>g.dispose());api.CloseModel(modelId);throw error;}
}
function requireThreeMath(){return {Matrix4:THREE_Matrix4};}
import {Matrix4 as THREE_Matrix4} from "three";
