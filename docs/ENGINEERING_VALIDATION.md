# Engineering Verification and Validation Plan

## Mandatory disclaimer
CiviTwin currently contains no validated structural solver. Realistic rendering is not evidence of engineering correctness.

## Analysis gating criteria
For each supported structural analysis case, document:
1. Scope, degrees of freedom, dimensionality and element formulations.
2. Supported material behavior, limitations, stiffness assumptions and sign conventions.
3. Input units, conversions, precision and physical plausibility constraints.
4. Loads, combinations, restraints, connections, stability checks and boundary conditions.
5. Numerical solver version, configuration, convergence criteria and reproducibility.
6. Benchmarks using closed-form solutions and independently verified reference software.
7. Tolerances for forces, reactions, displacements and member stresses.
8. Independent peer review by a qualified structural engineer for professional use.
9. Standards applicability by jurisdiction and design-code edition, independently reviewed.
10. Complete traceable reports, test records and known limitations.

## Before adding any failure simulation
Do not map a generic stress threshold to an apparent physical collapse. A failure animation must be explicitly marked illustrative unless a separately validated failure mechanics model supports it.

## BIM quality gates
Test valid and invalid IFC inputs, schema version, units, element mapping, original GUID stability, geometry fidelity, classification, property preservation, access controls and file size limits. Do not assume imported BIM geometries define an analytical FE model.

## Status
All validation activities above are future requirements; no professional structural use is authorized.
