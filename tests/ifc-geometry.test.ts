import {describe,it,expect} from "vitest";
import {buildIfcGeometry} from "../src/lib/ifc-geometry";
describe("IFC geometry adapter",()=>{
 const verts=new Float32Array([0,0,0,0,0,1,1,0,0,0,0,1,0,1,0,0,0,1]);
 const faces=new Uint32Array([0,1,2]);
 const identity=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
 it("preserves local geometry and applies world-space translation",()=>{
  const g=buildIfcGeometry(verts,faces,[1,0,0,0,0,1,0,0,0,0,1,0,10,20,30,1]);
  expect(Array.from(g.getAttribute("position").array).slice(0,3)).toEqual([10,20,30]);
  expect(g.boundingBox?.max.x).toBe(11);g.dispose();
 });
 it("transforms normals correctly for rotations",()=>{
  const g=buildIfcGeometry(verts,faces,[1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,1]);
  const normal=g.getAttribute("normal");
  expect(normal.getY(0)).toBeCloseTo(-1);
  expect(normal.getZ(0)).toBeCloseTo(0);
  g.dispose();
 });
 it("rejects malformed geometry and singular transforms",()=>{
  expect(()=>buildIfcGeometry(new Float32Array([1,2]),faces,identity)).toThrow();
  expect(()=>buildIfcGeometry(verts,new Uint32Array([0,1,99]),identity)).toThrow();
  expect(()=>buildIfcGeometry(verts,faces,[1,2])).toThrow();
  expect(()=>buildIfcGeometry(verts,faces,new Array(16).fill(0))).toThrow(/singular/);
 });
});
