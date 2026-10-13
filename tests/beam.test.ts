import {describe,it,expect} from "vitest";
import {analyzeSimpleBeam} from "../src/lib/beam";
describe("simply supported prismatic beam under uniform loading",()=>{
 const input={spanM:4,widthMm:250,depthMm:450,modulusGPa:25,loadKNPerM:8};
 it("checks reactions, shear and max moment from closed form",()=>{
  const r=analyzeSimpleBeam(input);
  expect(r.reactionKN).toBeCloseTo(16,10);
  expect(r.maxShearKN).toBeCloseTo(16,10);
  expect(r.maxMomentKNm).toBeCloseTo(16,10);
 });
 it("has zero deflection at both supports and maximum at midspan",()=>{
  const r=analyzeSimpleBeam(input);
  expect(r.deflectionAt(0)).toBeCloseTo(0,10);
  expect(r.deflectionAt(4)).toBeCloseTo(0,10);
  expect(r.deflectionAt(2)).toBeCloseTo(r.maxDeflectionMm,10);
  expect(r.maxDeflectionMm).toBeGreaterThan(0);
 });
 it("scales deflection with load and span to the fourth power",()=>{
  const r=analyzeSimpleBeam(input);
  const twice=analyzeSimpleBeam({...input,loadKNPerM:16});
  expect(twice.maxDeflectionMm/r.maxDeflectionMm).toBeCloseTo(2,10);
  const longer=analyzeSimpleBeam({...input,spanM:8});
  expect(longer.maxDeflectionMm/r.maxDeflectionMm).toBeCloseTo(16,10);
 });
 it("rejects invalid inputs",()=>{
  expect(()=>analyzeSimpleBeam({...input,spanM:0})).toThrow();
  expect(()=>analyzeSimpleBeam({...input,modulusGPa:NaN})).toThrow();
  expect(()=>analyzeSimpleBeam({...input,loadKNPerM:-1})).toThrow();
 });
});
