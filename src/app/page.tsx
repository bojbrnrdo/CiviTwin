"use client";
import dynamic from "next/dynamic";
import {useState} from "react";
import BeamLab from "@/components/BeamLab";
import IfcWorkspace from "@/components/IfcWorkspace";
import {SAMPLE_ELEMENTS,getElement} from "@/lib/model";
const Scene=dynamic(()=>import("@/components/StructuralScene"),{ssr:false});
export default function Home(){
 const [realistic,setRealistic]=useState(true);
 const [selectedId,setSelectedId]=useState<string|null>(null);
 const [ifcMode,setIfcMode]=useState(false);
 const selected=getElement(selectedId);
 return <main className="app"><header className="top"><div><div className="brand">CiviTwin</div><div className="subtle">BIM + Structural Engineering</div></div><div><button onClick={()=>setIfcMode(x=>!x)}>{ifcMode?"Sample workspace":"IFC Import (experimental)"}</button> <span className="status">Educational alpha</span></div></header>
 {ifcMode?<IfcWorkspace onReturn={()=>setIfcMode(false)}/>:<section className="workspace"><aside className="panel"><h2>Project Explorer</h2><p>Illustrative concrete frame</p><div className="modeltree">{SAMPLE_ELEMENTS.map(e=><button type="button" className="modelitem" aria-pressed={selectedId===e.id} key={e.id} onClick={()=>setSelectedId(e.id)}>{e.name}</button>)}</div><div className="notice">This sample model is procedurally generated, not imported IFC.</div></aside>
 <div className="viewport"><div className="overlay"><strong>Structural Workspace</strong><div className="subtle">Click components to inspect them</div><div className="actions"><button aria-pressed={realistic} onClick={()=>setRealistic(true)}>Realistic</button><button aria-pressed={!realistic} onClick={()=>setRealistic(false)}>Technical</button></div></div><Scene realistic={realistic} selectedId={selectedId} onSelect={setSelectedId}/></div>
 <aside className="panel">{selected?<section><h2>Selected Element</h2><p><strong>{selected.name}</strong></p><p>ID: {selected.id}</p><p>Class: {selected.kind}</p><p>Material: {selected.material}</p><p>Dimensions (m): {selected.dimensionsM.join(" × ")}</p><p>Coordinates (m): {selected.positionM.join(", ")}</p><p>Source: {selected.source}</p><button onClick={()=>setSelectedId(null)}>Clear selection</button></section>:<section><h2>Element Inspector</h2><p>Select a component in the 3D scene or project tree.</p></section>}<hr style={{border:"0",borderTop:"1px solid #304050",margin:"20px 0"}}/><BeamLab/></aside></section>}
 <footer className="foot">CiviTwin · Educational demonstration · Not validated for structural design</footer></main>;
}
