"use client";
import {Canvas} from "@react-three/fiber";
import {OrbitControls, ContactShadows, Environment, Grid} from "@react-three/drei";
import {SAMPLE_ELEMENTS, type ModelElement} from "@/lib/model";

function Part({element,realistic,selected,onSelect}:{element:ModelElement;realistic:boolean;selected:boolean;onSelect:(id:string)=>void}){
 const foundation=element.kind==="foundation";
 return <mesh castShadow={!foundation} receiveShadow position={[...element.positionM]} onClick={e=>{e.stopPropagation();onSelect(element.id)}} scale={[...element.dimensionsM]}>
  <boxGeometry args={[1,1,1]}/>
  <meshStandardMaterial color={selected?"#f3b85f":foundation?(realistic?"#7d847c":"#243b4e"):(realistic?"#b8bbb9":"#41acd2")} metalness={realistic?0.05:0.3} roughness={realistic?0.88:0.4}/>
 </mesh>;
}
export default function StructuralScene({realistic,selectedId,onSelect}:{realistic:boolean;selectedId:string|null;onSelect:(id:string|null)=>void}){
 return <Canvas shadows camera={{position:[7,6,9],fov:44,near:0.1,far:150}} gl={{antialias:true}} onPointerMissed={()=>onSelect(null)}>
  <color attach="background" args={[realistic?"#a6b9c3":"#101c2a"]}/>
  <ambientLight intensity={realistic?0.85:1.2}/>
  <directionalLight position={[8,12,6]} intensity={realistic?2.2:1.6} castShadow shadow-mapSize={[2048,2048]}/>
  {SAMPLE_ELEMENTS.map(element=><Part key={element.id} element={element} realistic={realistic} selected={selectedId===element.id} onSelect={onSelect}/>)}
  <Grid position={[0,-0.3,0]} args={[18,18]} cellSize={1} cellThickness={0.5} cellColor="#627484" sectionColor="#4f7f9c" infiniteGrid fadeDistance={24}/>
  {realistic&&<><Environment preset="city"/><ContactShadows position={[0,-0.001,0]} opacity={0.42} scale={14} blur={2.5} far={9}/></>}
  <OrbitControls makeDefault minDistance={4} maxDistance={36} maxPolarAngle={Math.PI/2.02} target={[0,1.3,0]}/>
 </Canvas>;
}
