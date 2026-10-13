import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,it,expect} from "vitest";
import {detectIfcLengthUnit} from "../src/lib/ifc-units";
import {validateIfcFile} from "../src/lib/ifc-validation";
describe("IFC4 geometry fixture metadata",()=>{
 const file=readFileSync(resolve("tests/fixtures/cube-ifc4.ifc"),"utf8");
 it("passes STEP preflight and declares IFC4",()=>{
  expect(validateIfcFile("cube-ifc4.ifc",Buffer.byteLength(file),file.slice(0,128))).toBeNull();
  expect(file).toContain("FILE_SCHEMA(('IFC4'))");
 });
 it("has a declared 2 m extrusion and rectangular profile",()=>{
  expect(file).toMatch(/IFCRECTANGLEPROFILEDEF\(\.AREA\.,'Square',#15,2\.,2\.\)/);
  expect(file).toMatch(/IFCEXTRUDEDAREASOLID\(#16,#11,#17,2\.\)/);
  expect(file).toContain("IFCBUILDINGELEMENTPROXY(");
  expect(detectIfcLengthUnit(file).metresPerUnit).toBe(1);
 });
});
