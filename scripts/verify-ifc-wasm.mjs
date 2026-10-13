import {readFile,stat} from "node:fs/promises";
import {resolve} from "node:path";

const binaryNames=["web-ifc.wasm","web-ifc-mt.wasm"];
for(const name of binaryNames){
 const source=resolve("node_modules/web-ifc",name);
 const publicCopy=resolve("public/wasm",name);
 const sourceBytes=await readFile(source);
 const outputBytes=await readFile(publicCopy);
 if(sourceBytes.length<4 || !sourceBytes.subarray(0,4).equals(Buffer.from([0,97,115,109]))){
  throw new Error(`Invalid WebAssembly header in source: ${name}`);
 }
 if(!sourceBytes.equals(outputBytes)){
  throw new Error(`IFC WebAssembly public asset missing or mismatched: ${name}`);
 }
 const asset=await stat(publicCopy);
 console.log(`Verified /wasm/${name}: ${asset.size} bytes, exact package match`);
}
