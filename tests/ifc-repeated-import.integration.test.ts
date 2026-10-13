import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,it,expect} from "vitest";
import {IfcAPI} from "web-ifc";
import {buildIfcGeometry} from "../src/lib/ifc-geometry";
import {Box3} from "three";

describe("repeated IFC model import lifecycle",()=>{
 it("opens, reads, and closes several models without sharing stale element IDs",async()=>{
  const api=new IfcAPI();
  await api.Init();
  const fixtures=[
   {file:"cube-ifc4.ifc",ids:[22]},
   {file:"structural-with-slab.ifc",ids:[22,33,43]},
   {file:"cube-ifc4.ifc",ids:[22]}
  ];
  for(const fixture of fixtures){
   const bytes=new Uint8Array(readFileSync(resolve("tests/fixtures",fixture.file)));
   const model=api.OpenModel(bytes);
   try{
    const ids=new Set<number>();
    const bounds=new Box3();
    api.StreamAllMeshes(model,mesh=>{
     ids.add(mesh.expressID);
     for(let i=0;i<mesh.geometries.size();i++){
      const placed=mesh.geometries.get(i);
      const raw=api.GetGeometry(model,placed.geometryExpressID);
      try{
       const geometry=buildIfcGeometry(api.GetVertexArray(raw.GetVertexData(),raw.GetVertexDataSize()),api.GetIndexArray(raw.GetIndexData(),raw.GetIndexDataSize()),Array.from(placed.flatTransformation));
       if(geometry.boundingBox)bounds.union(geometry.boundingBox);
       geometry.dispose();
      }finally{raw.delete();}
     }
    });
    expect([...ids].sort((a,b)=>a-b)).toEqual(fixture.ids);
    expect(bounds.isEmpty()).toBe(false);
   }finally{api.CloseModel(model);}
  }
 },30000);
});
