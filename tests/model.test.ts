import {describe,it,expect} from "vitest";
import {SAMPLE_ELEMENTS,getElement} from "../src/lib/model";
describe("sample BIM model metadata",()=>{
 it("contains unique identifiers",()=>expect(new Set(SAMPLE_ELEMENTS.map(e=>e.id)).size).toBe(SAMPLE_ELEMENTS.length));
 it("has only finite positive dimensions",()=>{for(const e of SAMPLE_ELEMENTS){expect(e.dimensionsM.every(x=>Number.isFinite(x)&&x>0)).toBe(true);expect(e.positionM.every(Number.isFinite)).toBe(true);}});
 it("looks up a selected element",()=>{expect(getElement("slab")?.kind).toBe("slab");expect(getElement("missing")).toBeUndefined();expect(getElement(null)).toBeUndefined();});
 it("has exactly four sample columns",()=>expect(SAMPLE_ELEMENTS.filter(e=>e.kind==="column")).toHaveLength(4));
});
