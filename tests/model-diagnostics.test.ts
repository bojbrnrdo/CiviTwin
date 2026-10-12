import {describe,it,expect} from "vitest";
import {BoxGeometry} from "three";
import {inspectGeometry} from "../src/lib/model-diagnostics";
describe("imported model geometry diagnostics",()=>{
 it("counts unique elements and computes spatial extents",()=>{
  const g=new BoxGeometry(2,4,6);
  g.translate(4,5,6);
  const d=inspectGeometry([{geometry:g,expressId:7},{geometry:g,expressId:7}]);
  expect(d.meshCount).toBe(2);
  expect(d.elementCount).toBe(1);
  expect(d.triangleCount).toBe(24);
  expect(d.bounds?.size).toEqual([2,4,6]);
  g.dispose();
 });
 it("warns on an empty model",()=>{
  const d=inspectGeometry([]);
  expect(d.elementCount).toBe(0);
  expect(d.bounds).toBeNull();
  expect(d.warnings.length).toBeGreaterThan(0);
 });
});
