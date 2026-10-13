/** Educational Euler–Bernoulli beam: simply supported, full-span uniform line load.
 * SI units internally: m, N, Pa. Linear elastic, small-deflection, prismatic beam.
 * Does NOT perform concrete cracking, reinforcement, shear capacity or code design checks.
 */
export type BeamInput = {spanM:number;widthMm:number;depthMm:number;modulusGPa:number;loadKNPerM:number};
export type BeamResult = {inertiaM4:number;maxMomentKNm:number;maxShearKN:number;maxDeflectionMm:number;reactionKN:number;deflectionAt:(xM:number)=>number};
export function analyzeSimpleBeam(p: BeamInput): BeamResult {
  const {spanM:L,widthMm,depthMm,modulusGPa,loadKNPerM}=p;
  if (![L,widthMm,depthMm,modulusGPa,loadKNPerM].every(Number.isFinite) || L<=0 || widthMm<=0 || depthMm<=0 || modulusGPa<=0 || loadKNPerM<0 || L>100 || widthMm>10000 || depthMm>10000 || modulusGPa>1000 || loadKNPerM>1e6) {
    throw new Error("Inputs must be finite and within the documented positive educational ranges.");
  }
  const b=widthMm/1000, h=depthMm/1000, E=modulusGPa*1e9, w=loadKNPerM*1000, I=b*h**3/12;
  const maxDeflectionM=5*w*L**4/(384*E*I);
  return {
    inertiaM4:I, maxMomentKNm:(w*L**2/8)/1000,
    maxShearKN:(w*L/2)/1000, reactionKN:(w*L/2)/1000,
    maxDeflectionMm:maxDeflectionM*1000,
    deflectionAt:(x:number)=>{
      if(!Number.isFinite(x)||x<0||x>L) throw new Error("Position outside beam span");
      return (w*x*(L**3-2*L*x**2+x**3)/(24*E*I))*1000;
    }
  };
}
