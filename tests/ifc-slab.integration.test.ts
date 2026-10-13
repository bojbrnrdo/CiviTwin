import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,it,expect} from "vitest";
import {IfcAPI,IFCBEAM,IFCCOLUMN,IFCSLAB} from "web-ifc";
import {Box3,Vector3} from "three";
import {buildIfcGeometry} from "../src/lib/ifc-geometry";
describe("IFC4 beams columns and slabs",()=>{
 it("parses three distinct structural categories with geometry",async()=>{
  const api=new IfcAPI();await api.Init();
  const model=api.OpenModel(new Uint8Array(readFileSync(resolve("tests/fixtures/structural-with-slab.ifc"))));
  try{
   const found=new Map<number,{type:number;name:string;bounds:Box3}>();
   api.StreamAllMeshes(model,mesh=>{
    const record=api.GetLine(model,mesh.expressID,false) as {type:number;Name?:{value:string}};
    const bounds=new Box3();
    for(let i=0;i<mesh.geometries.size();i++){
     const placed=mesh.geometries.get(i);
     const raw=api.GetGeometry(model,placed.geometryExpressID);
     try{
      const geometry=buildIfcGeometry(api.GetVertexArray(raw.GetVertexData(),raw.GetVertexDataSize()),api.GetIndexArray(raw.GetIndexData(),raw.GetIndexDataSize()),Array.from(placed.flatTransformation));
      if(geometry.boundingBox)bounds.union(geometry.boundingBox);
      geometry.dispose();
     }finally{raw.delete();}
    }
    found.set(mesh.expressID,{type:record.type,name:record.Name?.value??"",bounds});
   });
   expect([...found.keys()].sort((a,b)=>a-b)).toEqual([22,33,43]);
   expect(found.get(22)?.type).toBe(IFCBEAM);
   expect(found.get(33)?.type).toBe(IFCCOLUMN);
   expect(found.get(43)?.type).toBe(IFCSLAB);
   expect(found.get(43)?.name).toBe("Slab C");
   expect(found.get(43)?.bounds.getSize(new Vector3()).x).toBeCloseTo(2,2);
  }finally{api.CloseModel(model);}
 },30000);
});
