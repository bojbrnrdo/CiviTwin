export type MaterialHint = {kind:"concrete"|"steel"|"glass"|"timber"|"generic"; color:number; metalness:number; roughness:number; note:string};
export function classifyIfcMaterial(properties:Record<string,string>|undefined,importedColor:number):MaterialHint {
 const text=[properties?.Name,properties?.ObjectType,properties?.Description,properties?.EntityType].filter(Boolean).join(" ").toLowerCase();
 // Hints are deliberately conservative. IFC element types alone do not prove material.
 let kind:MaterialHint["kind"]="generic",metalness=0.08,roughness=0.72;
 if(/\b(concrete|reinforced concrete|rc concrete)\b/.test(text)){kind="concrete";metalness=0.02;roughness=0.88;}
 else if(/\b(steel|metallic|structural steel)\b/.test(text)){kind="steel";metalness=0.68;roughness=0.38;}
 else if(/\b(glass|glazing)\b/.test(text)){kind="glass";metalness=0.05;roughness=0.16;}
 else if(/\b(timber|wood)\b/.test(text)){kind="timber";metalness=0;roughness=0.82;}
 return {kind,color:importedColor,metalness,roughness,note:"Visual appearance heuristic only; does not establish engineering material properties."};
}
