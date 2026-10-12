import {BufferAttribute,BufferGeometry,Matrix4} from "three";

/** Converts web-ifc interleaved [px,py,pz,nx,ny,nz] vertex data to transformed Three.js geometry. */
export function buildIfcGeometry(vertices:Float32Array,indices:Uint32Array|Uint16Array,transform:ReadonlyArray<number>):BufferGeometry{
 const count=vertices.length/6;
 if(vertices.length===0 || vertices.length%6!==0 || indices.length===0 || indices.length%3!==0 ||
    transform.length!==16 || !vertices.every(Number.isFinite) || !transform.every(Number.isFinite) ||
    !indices.every(i=>i<count)){
  throw new Error("Invalid IFC geometry buffers, indices, or transformation.");
 }
 const matrix=new Matrix4().fromArray(transform);
 if(Math.abs(matrix.determinant())<1e-12)throw new Error("IFC geometry transformation is singular.");
 const positions=new Float32Array(count*3),normals=new Float32Array(count*3);
 for(let j=0;j<count;j++)for(let k=0;k<3;k++){
  positions[j*3+k]=vertices[j*6+k];
  normals[j*3+k]=vertices[j*6+3+k];
 }
 const g=new BufferGeometry();
 try{
  g.setAttribute("position",new BufferAttribute(positions,3));
  g.setAttribute("normal",new BufferAttribute(normals,3));
  g.setIndex(new BufferAttribute(indices,1));
  g.applyMatrix4(matrix);
  g.computeBoundingBox();
  const bb=g.boundingBox;
  if(!bb || ![bb.min.x,bb.min.y,bb.min.z,bb.max.x,bb.max.y,bb.max.z].every(Number.isFinite)){
   throw new Error("IFC geometry has non-finite transformed coordinates.");
  }
  return g;
 }catch(error){g.dispose();throw error;}
}
