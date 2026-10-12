# Geometry fixture notes

`cube-ifc4.ifc` is a hand-authored minimal IFC4 STEP fixture with an IfcBuildingElementProxy using a 2 × 2 m rectangle extruded 2 m along +Z.

**Caution:** Static tests confirm the STEP declarations only. They do not validate whether a production IFC parser can successfully triangulate this fixture, the IFC entity graph is accepted by every viewer, or whether world placement and exported dimensions are correct.

Required before calling the fixture validated:
- Parse with web-ifc and IfcOpenShell independently.
- Confirm one element with nonempty geometry and an approximately 2 × 2 × 2 m bounding box (subject to coordinate conventions).
- Verify selection metadata, repeated imports, cleanup, and rendering in actual desktop browsers.
- Document any schema/parser compatibility issues.

The initial model is not an engineering calculation case.
