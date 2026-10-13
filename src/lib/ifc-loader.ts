import {BufferGeometry} from "three";
import {buildIfcGeometry} from "./ifc-geometry";
import {getIfcWasmUrl} from "./ifc-engine-health";
export type ImportedMesh={id:number;geometry:BufferGeometry;color:number;opacity:number;expressId:number};
export type ImportedIfc={meshes:ImportedMesh[];metadata:Record<number,Record<string,string>>;dispose:()=>void};
export async function loadIfc(data:Uint8Array):Promise<ImportedIfc>{
 const IFC=await import("web-ifc");const api=new IFC.IfcAPI();
 // Use the full browser origin: relative WASM paths can resolve against the bundled JS asset URL.
 const wasmDirectory=new URL("/wasm/",window.location.origin).href;
 api.SetWasmPath(wasmDirectory,true);
 try {
  const response=await fetch(getIfcWasmUrl(window.location.origin),{method:"GET",cache:"no-store"});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const prefix=new Uint8Array(await response.arrayBuffer()).slice(0,4);
  if(prefix.length!==4||prefix[0]!==0||prefix[1]!==97||prefix[2]!==115||prefix[3]!==109)throw new Error("Invalid WASM response");
 }catch(error){throw new Error(`IFC rendering engine could not load /wasm/web-ifc.wasm (${error instanceof Error?error.message:"network error"}). Verify Vercel static assets.`);}
 try{await api.Init((file)=>new URL(file,wasmDirectory).href,true);}catch(error){throw new Error(`IFC rendering engine failed to initialize: ${error instanceof Error?error.message:String(error)}`);}
 let modelId:number;
 try{modelId=api.OpenModel(data);}catch(error){throw new Error(`Unable to open IFC model: ${error instanceof Error?error.message:String(error)}`);}
 const meshes:ImportedMesh[]=[],metadata:Record<number,Record<string,string>>={},geometries:BufferGeometry[]=[];
 try{
  api.StreamAllMeshes(modelId,mesh=>{
   const id=mesh.expressID;
   for(let i=0;i<mesh.geometries.size();i++){
    const placed=mesh.geometries.get(i),geometry=api.GetGeometry(modelId,placed.geometryExpressID);
    try{
     const v=api.GetVertexArray(geometry.GetVertexData(),geometry.GetVertexDataSize());
     const indices=api.GetIndexArray(geometry.GetIndexData(),geometry.GetIndexDataSize());
     const g=buildIfcGeometry(v,indices,Array.from(placed.flatTransformation));
     geometries.push(g);
     const c=placed.color;
     const channel=(v:number)=>Math.max(0,Math.min(255,Math.round(v*255)));
     const color=(channel(c.x)<<16)|(channel(c.y)<<8)|channel(c.z);
     meshes.push({id,expressId:id,geometry:g,color,opacity:Math.max(0,Math.min(1,c.w))});
    }finally{geometry.delete();}
   }
   try{
    const props=api.GetLine(modelId,id,false) as Record<string,unknown>;
    const typeCode=typeof props?.type==="number"?props.type:null;
    const typeNames:Record<number,string>={[IFC.IFCBEAM]:"IfcBeam",[IFC.IFCCOLUMN]:"IfcColumn",[IFC.IFCSLAB]:"IfcSlab",[IFC.IFCWALL]:"IfcWall",[IFC.IFCFOOTING]:"IfcFooting",[IFC.IFCBUILDINGELEMENTPROXY]:"IfcBuildingElementProxy"};
    const out:Record<string,string>={ExpressID:String(id),EntityType:typeCode===null?"Unknown":(typeNames[typeCode]??`IFC type ${typeCode}`)};
    for(const key of ["Name","Description","GlobalId","ObjectType","PredefinedType"]){
     const value=props?.[key] as {value?:unknown}|undefined;
     if(value && value.value!==undefined)out[key]=String(value.value);
    }
    metadata[id]=out;
   }catch{metadata[id]={ExpressID:String(id)};}
  });
  let disposed=false;
  return {meshes,metadata,dispose:()=>{if(disposed)return;disposed=true;geometries.forEach(g=>g.dispose());api.CloseModel(modelId);}};
 }catch(error){geometries.forEach(g=>g.dispose());api.CloseModel(modelId);throw error;}
}
