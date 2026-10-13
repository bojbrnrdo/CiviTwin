# IFC Browser Loader

The app loads the IFC parser's WASM module from **/wasm/** on its own origin.
The `postinstall` step copies the installed `web-ifc` version's binary into `public/wasm/`, avoiding an external CDN dependency and aligning the parser with the installed JS API.

## Checks
- `npm install` should copy `web-ifc.wasm`
- `npm run typecheck`, `npm test`, `npm run build` must pass
- Browser smoke test: import a known valid IFC4 file smaller than 15 MB
- Verify model framing, element selection, GUID metadata and orientation
- Test invalid/non-IFC data, units, large coordinates, empty geometry and corrupt geometry
- Compare bounding boxes and element placement with independently verified BIM viewer

**Important:** CI builds do not prove correct IFC geometry or performance. This importer remains experimental until a representative IFC fixture suite and human browser QA are completed.
