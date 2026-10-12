import {describe,it,expect} from "vitest";
import {detectIfcLengthUnit} from "../src/lib/ifc-units";
describe("IFC STEP length-unit diagnostics",()=>{
 it("recognizes declared metres",()=>expect(detectIfcLengthUnit("#8=IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.);").metresPerUnit).toBe(1));
 it("recognizes millimetres",()=>expect(detectIfcLengthUnit("#8=IFCSIUNIT(*,.LENGTHUNIT.,.MILLI.,.METRE.);").metresPerUnit).toBe(0.001));
 it("rejects conversion-based units rather than assuming metres",()=>expect(detectIfcLengthUnit("#2=IFCCONVERSIONBASEDUNIT(...);").confidence).toBe("unknown"));
 it("rejects conflicting declarations",()=>expect(detectIfcLengthUnit("#1=IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.);#2=IFCSIUNIT(*,.LENGTHUNIT.,.MILLI.,.METRE.);").confidence).toBe("unknown"));
 it("does not guess when absent",()=>expect(detectIfcLengthUnit("ISO-10303-21;").confidence).toBe("unknown"));
});
