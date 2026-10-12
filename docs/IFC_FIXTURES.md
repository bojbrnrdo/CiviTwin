# IFC4 Test Fixtures

`minimal-ifc4.ifc` is a tiny STEP-format IFC4 **metadata fixture** with a project, unit assignment and representation context. It deliberately has **no physical geometry**.

It is suitable only for format-header and unit-detection smoke tests. It cannot validate the geometry renderer or constitute a real-world BIM compatibility test.

## Real geometry validation needed
1. Obtain a licensed/redistributable reference IFC4 building model.
2. Verify known GUIDs, model bounding boxes, axes, material colors and geometry counts against an independent IFC tool.
3. Run actual imports in Chrome, Edge and Safari on laptop devices.
4. Profile memory, web-ifc WASM initialization and repeated uploads.
5. Add reproducible browser smoke tests after establishing a valid fixture and expected outcomes.

Do not classify the importer as production-ready solely because CI passes.
