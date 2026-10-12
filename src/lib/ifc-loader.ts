import {BufferGeometry} from "three";
import {buildIfcGeometry} from "./ifc-geometry";
export type ImportedMesh={id:number;geometry:BufferGeometry;color:number;opacity:number;expressId:number};
export type ImportedIfc={meshes:ImportedMesh[];metadata:Record<number,Record<string,string>>;dispose:()=>void};
export async function loadIfc(data:Uint8Array):Promise<ImportedIfc>{
 const IFC=await import("web-ifc");const api=new IFC.IfcAPI();
 api.SetWasmPath("/wasm/");
 await api.Init();
 const modelId=api.OpenModel(data);
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
