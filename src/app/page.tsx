"use client";
import dynamic from "next/dynamic";
import {useState} from "react";
import BeamLab from "@/components/BeamLab";
const Scene=dynamic(()=>import("@/components/StructuralScene"),{ssr:false});
export default function Home(){
 const [realistic,setRealistic]=useState(true);
 return <main className="app"><header className="top"><div><div className="brand">CiviTwin</div><div className="subtle">Photorealistic BIM + Structural Engineering</div></div><div className="status">Educational alpha</div></header>
 <section className="workspace"><aside className="panel"><h2>Project Explorer</h2><p>Illustrative concrete frame</p><ul><li>Foundation</li><li>4 columns</li><li>Connecting beams</li><li>Elevated slab</li></ul><div className="notice">The 3D sample is not an IFC model. BIM imports will be integrated separately.</div></aside>
 <div className="viewport"><div className="overlay"><strong>Structural Workspace</strong><div className="subtle">Drag to orbit · scroll to zoom · right-drag to pan</div><div className="actions"><button aria-pressed={realistic} onClick={()=>setRealistic(true)}>Realistic</button><button aria-pressed={!realistic} onClick={()=>setRealistic(false)}>Technical</button></div></div><Scene realistic={realistic}/></div>
 <aside className="panel"><BeamLab/></aside></section><footer className="foot">CiviTwin · Educational demonstration only · No validated full-frame structural analysis</footer></main>;
}
