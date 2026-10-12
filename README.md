# CiviTwin

**Photorealistic BIM and Civil Engineering Simulation Platform**

CiviTwin is an open-source, browser-first, educational engineering platform architected toward professional-grade BIM interoperability and structural visualization.

> **Safety:** This software is under development. Structural analysis must not be used for construction or life-safety decisions unless the implemented use case, loads, boundary conditions, numerical results, and applicable design-code checks have been independently validated by qualified engineers.

## Goals
- Public, laptop/desktop-friendly photorealistic 3D viewer with a technical visualization mode
- IFC-based BIM model inspection, metadata, units, and model revisions
- Parametric beam, frame, building and bridge educational demonstrations
- Solver-backed engineering analysis with traceable inputs, units, assumptions, and results
- Quantity takeoff, costs, and construction-phase visualizations
- User accounts, project persistence, private models, and optional public demo projects

## Architecture
- **Web app:** Next.js, TypeScript, React Three Fiber, Three.js, browser-side PBR rendering
- **BIM:** IFC parsing pipeline with explicit supported versions and fixtures; preserve element IDs and properties
- **Data:** Supabase Auth, PostgreSQL with RLS, object storage with authorization controls (subject to free tier)
- **Engineering:** Versioned deterministic analysis contracts; simple verified educational beam calculations first, optional Python/OpenSeesPy workers for advanced analysis
- **Deployment:** Vercel Hobby for *non-commercial student demonstration* and local engineering compute
- **CI:** lint, type checks, tests, reference verification and security checks

## Product principles
1. Separate visual rendering, BIM topology/metadata, and analytical structural models.
2. Never infer structural support conditions or analysis readiness solely from IFC geometry.
3. Clearly label illustrative crack/collapse animation; never misrepresent it as a validated failure prediction.
4. Record unit systems, material data, load case, solver version, calculation assumptions and tolerances with every result.
5. For every professional-oriented feature: benchmark against analytical solutions and independently verified datasets; require qualified-engineer review before professional use.
6. Keep browser compute bounded, imports safe, and user data isolated.
7. Keep the student deployment free of mandatory paid infrastructure.

## Planned code organization

```text
apps/web/                      Next.js UI, 3D viewport, project workspace
packages/renderer/             Visualization modes, controls, camera, PBR assets
packages/bim/                  IFC import, model metadata, geometry adapters
packages/engineering/          Units, load cases, calculation contracts
packages/quantity/             Reproducible takeoff and cost estimation
services/solver/               Optional local Python structural analysis
supabase/migrations/           Database schema, RLS, indexes
tests/fixtures/                Sample IFC/analysis inputs and expected outcomes
docs/                          Requirements, architecture, verification & validation
.github/workflows/             Continuous integration
```

## Roadmap
1. Functional and performant public project viewer + structural sample model
2. Interactive BIM element inspection, IFC imports and realistic material mode
3. Auth, database, model versioning, save/load and access control
4. Verified beam and 2D frame teaching scenarios with engineering diagrams
5. Construction phase sequencing, quantity takeoff and reproducible reports
6. Wider BIM interoperability and independently validated advanced solver workflows

## Status
Architecture and repository bootstrap. Features above are planned, not yet released.
