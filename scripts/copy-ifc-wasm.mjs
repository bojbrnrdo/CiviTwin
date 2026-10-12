import {mkdir,copyFile,readdir,stat} from "node:fs/promises";
import {resolve,join} from "node:path";

const source=resolve("node_modules/web-ifc");
const destination=resolve("public/wasm");
await mkdir(destination,{recursive:true});
const entries=await readdir(source);
const wasmFiles=entries.filter(name=>/^web-ifc(?:-mt)?\.wasm$/.test(name));
if(!wasmFiles.includes("web-ifc.wasm")) throw new Error("Expected web-ifc.wasm missing from installed web-ifc package");
for(const name of wasmFiles){
 const file=join(source,name);
 const info=await stat(file);
 if(info.size===0)throw new Error(`Empty WASM binary: ${name}`);
 await copyFile(file,join(destination,name));
 console.log(`Copied ${name} (${info.size} bytes) into public/wasm`);
}
