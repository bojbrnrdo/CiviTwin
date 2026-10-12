import {describe,expect,it} from "vitest";
import {MAX_IFC_BYTES,validateIfcFile} from "../src/lib/ifc-validation";
describe("IFC upload preflight",()=>{
 it("accepts an ordinary STEP IFC header",()=>expect(validateIfcFile("sample.IFC",2048,"ISO-10303-21;\nHEADER;")).toBeNull());
 it("rejects non-IFC extension",()=>expect(validateIfcFile("wrong.obj",100,"ISO-10303-21;")).toMatch(/\.ifc/));
 it("rejects invalid header",()=>expect(validateIfcFile("wrong.ifc",100,"NOT AN IFC")).toMatch(/header/));
 it("rejects empty and oversized files",()=>{
  expect(validateIfcFile("empty.ifc",0,"ISO-10303-21;")).not.toBeNull();
  expect(validateIfcFile("huge.ifc",MAX_IFC_BYTES+1,"ISO-10303-21;")).not.toBeNull();
 });
});
