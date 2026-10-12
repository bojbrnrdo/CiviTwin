import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,it,expect} from "vitest";
import {validateIfcFile} from "../src/lib/ifc-validation";
import {detectIfcLengthUnit} from "../src/lib/ifc-units";
describe("IFC4 fixture preflight",()=>{
 const file=readFileSync(resolve("tests/fixtures/minimal-ifc4.ifc"),"utf8");
 it("contains STEP envelope and declared IFC4 schema",()=>{
  expect(file).toContain("FILE_SCHEMA(('IFC4'))");
  expect(file.trimEnd().endsWith("END-ISO-10303-21;")).toBe(true);
  expect(validateIfcFile("minimal-ifc4.ifc",Buffer.byteLength(file),file.slice(0,128))).toBeNull();
 });
 it("declares metre length units",()=>expect(detectIfcLengthUnit(file).metresPerUnit).toBe(1));
});
