"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const Scene = dynamic(() => import("@/components/StructuralScene"), { ssr: false });
export default function Home() {
  const [realistic, setRealistic] = useState(true);
  return <main className="app">
    <header className="top"><div><div className="brand">CiviTwin</div><div className="subtle">BIM • Engineering • Visualization</div></div><div className="status">Educational alpha</div></header>
    <section className="workspace">
      <aside className="panel"><h2>Project Explorer</h2><p>Sample: Reinforced concrete frame</p><ul><li>Foundation</li><li>Four columns</li><li>Connecting beams</li><li>Elevated slab</li></ul><div className="notice">IFC upload and model tree are planned; this is parametric sample geometry, not imported BIM.</div></aside>
      <div className="viewport"><div className="overlay"><strong>Sample Structure</strong><div className="subtle">Drag to orbit • scroll to zoom • right-drag to pan</div><div className="actions"><button aria-pressed={realistic} onClick={() => setRealistic(true)}>Realistic</button><button aria-pressed={!realistic} onClick={() => setRealistic(false)}>Technical</button></div></div><Scene realistic={realistic}/></div>
      <aside className="panel"><h2>Engineering Inspector</h2><p>Four-column reinforced concrete frame, illustrative geometry.</p><h2>Analysis status</h2><p>Not calculated. Structural loads, supports, material properties and validation workflow have not been defined yet.</p><div className="notice">Visual proportions are demonstrative. No construction or safety decisions should be based on this sample.</div></aside>
    </section><footer className="foot">CiviTwin student edition · Not validated for structural design</footer>
  </main>;
}
