import {describe,it,expect} from "vitest";
import {countIfcCategories} from "../src/lib/ifc-categories";
describe("IFC category counts",()=>{
 it("counts each express ID exactly once and sorts by frequency",()=>{
  expect(countIfcCategories({10:{EntityType:"IfcBeam"},20:{EntityType:"IfcSlab"},30:{EntityType:"IfcBeam"}}))
   .toEqual([{category:"IfcBeam",count:2},{category:"IfcSlab",count:1}]);
 });
 it("keeps missing categories explicit",()=>{
  expect(countIfcCategories({1:{},2:{EntityType:" "}})).toEqual([{category:"Unknown",count:2}]);
 });
});
