import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,it,expect} from "vitest";
import {IfcAPI,IFCBEAM,IFCCOLUMN} from "web-ifc";
describe("IFC4 structural element classification",()=>{
 it("imports separate beams and columns with stable IDs",async()=>{
  const api=new IfcAPI();await api.Init();
  const model=api.OpenModel(new Uint8Array(readFileSync(resolve("tests/fixtures/structural-elements-ifc4.ifc"))));
  try{
   const ids=new Set<number>();
   api.StreamAllMeshes(model,mesh=>ids.add(mesh.expressID));
   expect([...ids].sort((a,b)=>a-b)).toEqual([22,33]);
   const beam=api.GetLine(model,22,false) as {type:number;Name?:{value:string}};
   const column=api.GetLine(model,33,false) as {type:number;Name?:{value:string}};
   expect(beam.type).toBe(IFCBEAM);
   expect(column.type).toBe(IFCCOLUMN);
   expect(beam.Name?.value).toBe("Beam A");
   expect(column.Name?.value).toBe("Column B");
  }finally{api.CloseModel(model);}
 },30000);
});
