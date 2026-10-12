/** Counts unique IFC elements by the category shown in the inspector. */
export function countIfcCategories(metadata:Record<number,Record<string,string>>):Array<{category:string;count:number}>{
 const counts=new Map<string,number>();
 for(const entry of Object.values(metadata)){
  const category=entry.EntityType?.trim()||"Unknown";
  counts.set(category,(counts.get(category)??0)+1);
 }
 return [...counts].map(([category,count])=>({category,count})).sort((a,b)=>b.count-a.count||a.category.localeCompare(b.category));
}
