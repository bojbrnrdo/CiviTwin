export type ElementKind = "foundation" | "column" | "beam" | "slab";
export type ModelElement = {
  id: string; name: string; kind: ElementKind; material: string;
  dimensionsM: readonly [number, number, number];
  positionM: readonly [number, number, number];
  source: "sample" | "ifc";
  ifcGuid?: string;
};
export const SAMPLE_ELEMENTS: readonly ModelElement[] = [
  {id:"foundation",name:"Foundation mat",kind:"foundation",material:"Concrete (illustrative)",dimensionsM:[10,0.3,10],positionM:[0,-0.16,0],source:"sample"},
  ...([-2,2] as const).flatMap(x=> ([-2,2] as const).map(z=>({
    id:`column-${x}-${z}`, name:`Column at x=${x}, z=${z}`,
    kind:"column" as const, material:"Concrete (illustrative)",
    dimensionsM:[0.42,3.3,0.42] as const,positionM:[x,1.65,z] as const,source:"sample" as const
  }))),
  ...([-2,2] as const).map(z=>({id:`beam-x-${z}`,name:`X-axis beam at z=${z}`,kind:"beam" as const,material:"Concrete (illustrative)",dimensionsM:[4.42,0.48,0.42] as const,positionM:[0,3.15,z] as const,source:"sample" as const})),
  ...([-2,2] as const).map(x=>({id:`beam-z-${x}`,name:`Z-axis beam at x=${x}`,kind:"beam" as const,material:"Concrete (illustrative)",dimensionsM:[0.42,0.48,4.42] as const,positionM:[x,3.15,0] as const,source:"sample" as const})),
  {id:"slab",name:"Elevated slab",kind:"slab",material:"Concrete (illustrative)",dimensionsM:[4.48,0.18,4.48],positionM:[0,3.47,0],source:"sample"}
];
export function getElement(id:string|null):ModelElement|undefined{return SAMPLE_ELEMENTS.find(e=>e.id===id);}
