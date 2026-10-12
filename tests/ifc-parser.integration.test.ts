import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,it,expect} from "vitest";
import {IfcAPI} from "web-ifc";
import {buildIfcGeometry} from "../src/lib/ifc-geometry";
import {Box3,Vector3} from "three";

describe("web-ifc parser geometry integration",()=>{
 it("opens an IFC4 fixture and triangulates its proxy geometry",async()=>{
  const api=new IfcAPI();
  await api.Init();
  const bytes=new Uint8Array(readFileSync(resolve("tests/fixtures/cube-ifc4.ifc")));
  const model=api.OpenModel(bytes);
  try {
   let meshCount=0;
   let triangleCount=0;
   const bounds=new Box3();
   api.StreamAllMeshes(model,mesh=>{
    meshCount++;
    for(let i=0;i<mesh.geometries.size();i++){
     const item=mesh.geometries.get(i);
     const geometry=api.GetGeometry(model,item.geometryExpressID);
     try{
      triangleCount+=geometry.GetIndexDataSize()/3;
      const vertices=api.GetVertexArray(geometry.GetVertexData(),geometry.GetVertexDataSize());
      const indices=api.GetIndexArray(geometry.GetIndexData(),geometry.GetIndexDataSize());
      const shape=buildIfcGeometry(vertices,indices,Array.from(item.flatTransformation));
      if(shape.boundingBox)bounds.union(shape.boundingBox);
      shape.dispose();
     }finally{geometry.delete();}
    }
   });
   expect(meshCount).toBeGreaterThan(0);
   expect(triangleCount).toBeGreaterThan(0);
   expect(bounds.isEmpty()).toBe(false);
   const size=bounds.getSize(new Vector3());
   expect(size.x).toBeCloseTo(2,2);
   expect(size.y).toBeCloseTo(2,2);
   expect(size.z).toBeCloseTo(2,2);
  }finally{api.CloseModel(model);}
 },30000);
 it("applies a nested IFC object placement to world-space bounding coordinates",async()=>{
  const api=new IfcAPI();
  await api.Init();
  const bytes=new Uint8Array(readFileSync(resolve("tests/fixtures/offset-cube-ifc4.ifc")));
  const model=api.OpenModel(bytes);
  try{
   const bounds=new Box3();
   api.StreamAllMeshes(model,mesh=>{
    for(let i=0;i<mesh.geometries.size();i++){
     const item=mesh.geometries.get(i);
     const geometry=api.GetGeometry(model,item.geometryExpressID);
     try{
      const vertices=api.GetVertexArray(geometry.GetVertexData(),geometry.GetVertexDataSize());
      const indices=api.GetIndexArray(geometry.GetIndexData(),geometry.GetIndexDataSize());
      const shape=buildIfcGeometry(vertices,indices,Array.from(item.flatTransformation));
      if(shape.boundingBox)bounds.union(shape.boundingBox);
      shape.dispose();
     }finally{geometry.delete();}
    }
   });
   expect(bounds.isEmpty()).toBe(false);
   expect(bounds.min.x).toBeCloseTo(9,2);
   // web-ifc maps IFC (X,Y,Z) to viewer (X,Z,-Y) in this parser configuration.
   expect(bounds.min.y).toBeCloseTo(30,2);
   expect(bounds.min.z).toBeCloseTo(-21,2);
   expect(bounds.max.x).toBeCloseTo(11,2);
   expect(bounds.max.y).toBeCloseTo(32,2);
   expect(bounds.max.z).toBeCloseTo(-19,2);
  }finally{api.CloseModel(model);}
 },30000);
});
