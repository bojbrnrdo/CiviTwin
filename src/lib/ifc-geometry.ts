import {BufferAttribute,BufferGeometry,Matrix4} from "three";
/** Converts web-ifc interleaved [px,py,pz,nx,ny,nz] vertices into Three.js geometry. */
export function buildIfcGeometry(vertices:Float32Array,indices:Uint32Array|Uint16Array,transform:ReadonlyArray<number>):BufferGeometry{
 if(vertices.length%6!==0 || transform.length!==16 || indices.length%3!==0 || !vertices.every(Number.isFinite) || !transform.every(Number.isFinite)){
  throw new Error("Invalid IFC geometry buffers or transformation.");
 }
 const vertexCount=vertices.length/6;
 if(vertexCount===0 || indices.length===0 || !indices.every(i=>i<vertexCount))throw new Error("IFC face indices outside geometry.");
 const positions=new Float32Array(vertexCount*3),normals=new Float32Array(vertexCount*3);
 for(let j=0;j<vertexCount;j++)for(let k=0;k<3;k++){
  positions[j*3+k]=vertices[j*6+k];
  normals[j*3+k]=vertices[j*6+3+k];
 }
 const g=new BufferGeometry();
 g.setAttribute("position",new BufferAttribute(positions,3));
 g.setAttribute("normal",new BufferAttribute(normals,3));
 g.setIndex(new BufferAttribute(indices,1));
 g.applyMatrix4(new Matrix4().fromArray(transform));
 g.computeBoundingBox();
 return g;
}
