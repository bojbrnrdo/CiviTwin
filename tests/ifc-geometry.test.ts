import {describe,it,expect} from "vitest";
import {buildIfcGeometry} from "../src/lib/ifc-geometry";
describe("IFC geometry adapter",()=>{
 const verts=new Float32Array([0,0,0,0,0,1, 1,0,0,0,0,1, 0,1,0,0,0,1]);
 const indices=new Uint32Array([0,1,2]);
 const matrix=[1,0,0,0, 0,1,0,0, 0,0,1,0, 10,20,30,1];
 it("decodes interleaved normals and transforms positions",()=>{
  const g=buildIfcGeometry(verts,indices,matrix);
  expect(Array.from(g.getAttribute("position").array).slice(0,3)).toEqual([10,20,30]);
  expect(Array.from(g.getAttribute("normal").array).slice(0,3)).toEqual([0,0,1]);
  expect(g.boundingBox?.min.x).toBe(10);
  expect(g.boundingBox?.max.x).toBe(11);
  g.dispose();
 });
 it("rejects malformed arrays and out-of-bounds triangle indices",()=>{
  expect(()=>buildIfcGeometry(new Float32Array([1,2]),indices,matrix)).toThrow();
  expect(()=>buildIfcGeometry(verts,new Uint32Array([0,1,4]),matrix)).toThrow();
  expect(()=>buildIfcGeometry(verts,indices,[1,2])).toThrow();
 });
});
