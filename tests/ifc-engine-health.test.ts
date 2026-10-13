import {describe,it,expect} from 'vitest';
import {getIfcWasmUrl} from '../src/lib/ifc-engine-health';

describe('IFC engine asset path',()=>{
 it('uses the current origin',()=>{
  expect(getIfcWasmUrl('https://preview.example.com')).toBe('https://preview.example.com/wasm/web-ifc.wasm');
 });
});
