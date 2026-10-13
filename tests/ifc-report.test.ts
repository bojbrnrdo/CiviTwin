import {describe,expect,it} from "vitest";
import {createIfcAuditReport} from "../src/lib/ifc-report";
describe("IFC audit report",()=>{
 const diagnostics={meshCount:2,elementCount:2,triangleCount:24,bounds:null,warnings:["Unit mapping not verified"]};
 it("sorts element identifiers and preserves properties",()=>{
  const result=createIfcAuditReport({name:"sample.ifc",size:100},{label:"millimetre",metresPerUnit:.001,confidence:"declared"},diagnostics,{"12":{Name:"Beam"},"2":{Name:"Column"}});
  expect(result.elements.map(x=>x.expressId)).toEqual([2,12]);
  expect(result.declaredLengthUnit.metresPerUnit).toBe(.001);
  expect(result.limitations.length).toBeGreaterThan(0);
 });
 it("serializes unknown units without NaN",()=>{
  const result=createIfcAuditReport({name:"bad.ifc",size:10},{label:"Unknown",metresPerUnit:NaN,confidence:"unknown",warning:"Unsupported"},diagnostics,{});
  expect(JSON.parse(JSON.stringify(result)).declaredLengthUnit.metresPerUnit).toBeNull();
 });
});
