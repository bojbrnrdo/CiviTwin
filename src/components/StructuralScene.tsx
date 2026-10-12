"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Grid } from "@react-three/drei";

function Member({ position, scale, realistic }: { position: [number,number,number]; scale: [number,number,number]; realistic: boolean }) {
  return <mesh castShadow receiveShadow position={position} scale={scale}><boxGeometry args={[1,1,1]}/><meshStandardMaterial color={realistic ? "#b8bbb9" : "#41acd2"} metalness={realistic ? 0.05 : 0.3} roughness={realistic ? 0.88 : 0.4}/></mesh>;
}
function Frame({ realistic }: { realistic: boolean }) {
  const x = [-2,2], z = [-2,2];
  return <group>
    {x.flatMap((cx) => z.map((cz) => <Member key={`column-${cx}-${cz}`} realistic={realistic} position={[cx,1.65,cz]} scale={[0.42,3.3,0.42]}/>))}
    {z.map((cz) => <Member key={`beam-x-${cz}`} realistic={realistic} position={[0,3.15,cz]} scale={[4.42,0.48,0.42]}/>)}
    {x.map((cx) => <Member key={`beam-z-${cx}`} realistic={realistic} position={[cx,3.15,0]} scale={[0.42,0.48,4.42]}/>)}
    <Member position={[0,3.47,0]} scale={[4.48,0.18,4.48]} realistic={realistic}/>
    <mesh receiveShadow position={[0,-0.16,0]}><boxGeometry args={[10,0.3,10]}/><meshStandardMaterial color={realistic ? "#7d847c" : "#243b4e"} roughness={0.98}/></mesh>
  </group>;
}
export default function StructuralScene({realistic}:{realistic:boolean}) {
  return <Canvas shadows camera={{position:[7,6,9],fov:44,near:0.1,far:150}} gl={{antialias:true}}>
    <color attach="background" args={[realistic ? "#a6b9c3" : "#101c2a"]}/>
    <ambientLight intensity={realistic ? 0.85 : 1.2}/>
    <directionalLight position={[8,12,6]} intensity={realistic ? 2.2 : 1.6} castShadow shadow-mapSize={[2048,2048]}/>
    <Frame realistic={realistic}/>
    <Grid position={[0,-0.3,0]} args={[18,18]} cellSize={1} cellThickness={0.5} cellColor="#627484" sectionColor="#4f7f9c" infiniteGrid fadeDistance={24}/>
    {realistic && <><Environment preset="city"/><ContactShadows position={[0,-0.001,0]} opacity={0.42} scale={14} blur={2.5} far={9}/></>}
    <OrbitControls makeDefault minDistance={4} maxDistance={36} maxPolarAngle={Math.PI/2.02} target={[0,1.3,0]}/>
  </Canvas>;
}
