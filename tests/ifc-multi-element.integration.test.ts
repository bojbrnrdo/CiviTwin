import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,it,expect} from "vitest";
import {IfcAPI} from "web-ifc";
import {Box3,Vector3} from "three";
import {buildIfcGeometry} from "../src/lib/ifc-geometry";
describe("IFC4 multi-element model integration",()=>{
 it("finds distinct elements at separate locations",async()=>{
  const api=new IfcAPI();await api.Init();
  const model=api.OpenModel(new Uint8Array(readFileSync(resolve("tests/fixtures/multi-element-ifc4.ifc"))));
  try{
   const boxes=new Map<number,Box3>();
   api.StreamAllMeshes(model,mesh=>{
    const box=boxes.get(mesh.expressID)??new Box3();
    for(let i=0;i<mesh.geometries.size();i++){
     const placed=mesh.geometries.get(i);
     const raw=api.GetGeometry(model,placed.geometryExpressID);
     try{
      const shape=buildIfcGeometry(api.GetVertexArray(raw.GetVertexData(),raw.GetVertexDataSize()),api.GetIndexArray(raw.GetIndexData(),raw.GetIndexDataSize()),Array.from(placed.flatTransformation));
      if(shape.boundingBox)box.union(shape.boundingBox);
      shape.dispose();
     }finally{raw.delete();}
    }
    boxes.set(mesh.expressID,box);
   });
   expect(boxes.size).toBe(2);
   expect([...boxes.keys()].sort((a,b)=>a-b)).toEqual([22,33]);
   expect((api.GetLine(model,22,false) as {Name?:{value:string}}).Name?.value).toBe("Element A");
   expect((api.GetLine(model,33,false) as {Name?:{value:string}}).Name?.value).toBe("Element B");
   const centers=[...boxes.values()].map(b=>b.getCenter(new Vector3()).x).sort((a,b)=>a-b);
   expect(centers[0]).toBeCloseTo(10,2);
   expect(centers[1]).toBeCloseTo(16,2);
   for(const b of boxes.values())expect(b.getSize(new Vector3()).x).toBeCloseTo(2,2);
  }finally{api.CloseModel(model);}
 },30000);
});
