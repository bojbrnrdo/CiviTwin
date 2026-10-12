"use client";
import {useMemo,useState} from "react";
import {analyzeSimpleBeam, type BeamInput} from "@/lib/beam";
const defaults:BeamInput={spanM:4,widthMm:250,depthMm:450,modulusGPa:25,loadKNPerM:8};
const labels:Record<keyof BeamInput,string>={spanM:"Span (m)",widthMm:"Width (mm)",depthMm:"Depth (mm)",modulusGPa:"E (GPa)",loadKNPerM:"Uniform load (kN/m)"};
export default function BeamLab(){
 const [inputs,setInputs]=useState<BeamInput>(defaults);
 const result=useMemo(()=>{try{return {value:analyzeSimpleBeam(inputs),error:null}}catch(e){return {value:null,error:e instanceof Error?e.message:"Invalid input"}}},[inputs]);
 return <section aria-label="Educational beam analysis"><h2>Beam Calculation Lab</h2><p>Simply supported beam · uniform load · elastic response.</p>
 {(Object.keys(defaults) as (keyof BeamInput)[]).map(key=><label className="formrow" key={key}>{labels[key]}<input type="number" min="0" step="any" value={inputs[key]} onChange={e=>setInputs(prev=>({...prev,[key]:e.target.value===""?NaN:Number(e.target.value)}))}/></label>)}
 {result.error?<div role="alert" className="notice">{result.error}</div>:result.value&&<div className="results" aria-live="polite">
 <strong>Analytical results</strong><p>Maximum moment: {result.value.maxMomentKNm.toFixed(2)} kN·m</p><p>Maximum shear: {result.value.maxShearKN.toFixed(2)} kN</p><p>Midspan deflection: {result.value.maxDeflectionMm.toFixed(3)} mm</p>
 <svg viewBox="0 0 300 75" role="img" aria-label="Illustrative beam deflection curve" style={{width:"100%"}}><line x1="10" y1="12" x2="290" y2="12" stroke="#9bb3c5" strokeWidth="3"/><polyline fill="none" stroke="#e8aa53" strokeWidth="3" points={Array.from({length:41},(_,i)=>{const x=inputs.spanM*i/40;const ratio=result.value!.maxDeflectionMm>0?result.value!.deflectionAt(x)/result.value!.maxDeflectionMm:0;return `${10+280*i/40},${12+Math.min(48,ratio*48)}`}).join(" ")}/></svg>
 <p className="subtle">Diagram vertically exaggerated for visibility. Not linked to the 3D frame.</p></div>}
 <div className="notice">Educational formula only. No reinforcement, cracking, second-order effects, load combinations, or design-code verification. No structural pass/fail is asserted.</div>
 </section>
}
