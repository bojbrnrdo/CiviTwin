import {describe,it,expect} from "vitest";
import {classifyIfcMaterial} from "../src/lib/ifc-materials";
describe("IFC visual material hints",()=>{
 it("preserves imported material color",()=>expect(classifyIfcMaterial({Name:"Steel beam"},0x123456).color).toBe(0x123456));
 it("classifies explicit material name",()=>expect(classifyIfcMaterial({Description:"Reinforced concrete"},0).kind).toBe("concrete"));
 it("does not infer steel from a generic beam",()=>expect(classifyIfcMaterial({EntityType:"IfcBeam"},0).kind).toBe("generic"));
 it("classifies timber material mention",()=>expect(classifyIfcMaterial({Name:"Wood joist"},0).kind).toBe("timber"));
});
