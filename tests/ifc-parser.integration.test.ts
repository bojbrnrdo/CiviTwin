import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,it,expect} from "vitest";
import {IfcAPI} from "web-ifc";

describe("web-ifc parser geometry integration",()=>{
 it("opens an IFC4 fixture and triangulates its proxy geometry",async()=>{
  const api=new IfcAPI();
  api.SetWasmPath(resolve("node_modules/web-ifc")+"/");
  await api.Init();
  const bytes=new Uint8Array(readFileSync(resolve("tests/fixtures/cube-ifc4.ifc")));
  const model=api.OpenModel(bytes);
  try {
   let meshCount=0;
   let triangleCount=0;
   api.StreamAllMeshes(model,mesh=>{
    meshCount++;
    for(let i=0;i<mesh.geometries.size();i++){
     const item=mesh.geometries.get(i);
     const geometry=api.GetGeometry(model,item.geometryExpressID);
     try{triangleCount+=geometry.GetIndexDataSize()/3;}finally{geometry.delete();}
    }
   });
   expect(meshCount).toBeGreaterThan(0);
   expect(triangleCount).toBeGreaterThan(0);
  }finally{api.CloseModel(model);}
 },30000);
});
