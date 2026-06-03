function oklabToRgb(L: number, a: number, b: number, alpha: number = 1): string {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const gamma = (c: number) => {
    if (c <= 0.0031308) return 12.92 * c;
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.05;
  };

  const rVal = Math.round(Math.max(0, Math.min(1, gamma(r_lin))) * 255);
  const gVal = Math.round(Math.max(0, Math.min(1, gamma(g_lin))) * 255);
  const bVal = Math.round(Math.max(0, Math.min(1, gamma(b_lin))) * 255);

  return `rgba(${rVal}, ${gVal}, ${bVal}, ${alpha})`;
}

function labToRgb(L: number, a: number, b: number, alpha: number = 1): string {
  const Xn = 0.95047;
  const Yn = 1.00000;
  const Zn = 1.08883;

  let fy = (L + 16) / 116;
  let fx = fy + a / 500;
  let fz = fy - b / 200;

  const e = 0.008856;
  const k = 903.3;

  let xr = fx * fx * fx > e ? fx * fx * fx : (116 * fx - 16) / k;
  let yr = L > 8 ? Math.pow((L + 16) / 116, 3) : L / k;
  let zr = fz * fz * fz > e ? fz * fz * fz : (116 * fz - 16) / k;

  let X = xr * Xn;
  let Y = yr * Yn;
  let Z = zr * Zn;

  let r_lin = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  let g_lin = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  let b_lin = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;

  const gamma = (c: number) => {
    if (c <= 0.0031308) return 12.92 * c;
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.05;
  };

  const rVal = Math.round(Math.max(0, Math.min(1, gamma(r_lin))) * 255);
  const gVal = Math.round(Math.max(0, Math.min(1, gamma(g_lin))) * 255);
  const bVal = Math.round(Math.max(0, Math.min(1, gamma(b_lin))) * 255);

  return `rgba(${rVal}, ${gVal}, ${bVal}, ${alpha})`;
}

function lchToRgb(L: number, C: number, H: number, alpha: number = 1): string {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  return labToRgb(L, a, b, alpha);
}

function oklchToRgb(L: number, C: number, H: number, alpha: number = 1): string {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  return oklabToRgb(L, a, b, alpha);
}

export function convertColorString(str: string): string {
  if (!str || typeof str !== 'string') return str;

  // 1. oklch
  const oklchRegex = /oklch\(\s*([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+(?:deg|rad|grad|turn)?)(?:\s*\/\s*([0-9.]+%?))?\s*\)/gi;
  let newStr = str.replace(oklchRegex, (match, pL, pC, pH, pA) => {
    const L = pL.endsWith('%') ? parseFloat(pL) / 100 : parseFloat(pL);
    const C = pC.endsWith('%') ? parseFloat(pC) / 100 : parseFloat(pC);
    let H = parseFloat(pH);
    if (pH.endsWith('rad')) H = (parseFloat(pH) * 180) / Math.PI;
    if (pH.endsWith('grad')) H = (parseFloat(pH) * 360) / 400;
    if (pH.endsWith('turn')) H = parseFloat(pH) * 360;

    let alpha = 1;
    if (pA) {
      alpha = pA.endsWith('%') ? parseFloat(pA) / 100 : parseFloat(pA);
    }
    return oklchToRgb(L, C, H, alpha);
  });

  // 2. oklab
  const oklabRegex = /oklab\(\s*([0-9.]+%?)\s+([-0-9.]+%?)\s+([-0-9.]+%?)(?:\s*\/\s*([0-9.]+%?))?\s*\)/gi;
  newStr = newStr.replace(oklabRegex, (match, pL, pa, pb, pA) => {
    const L = pL.endsWith('%') ? parseFloat(pL) / 100 : parseFloat(pL);
    const a = pa.endsWith('%') ? parseFloat(pa) / 100 : parseFloat(pa);
    const b = pb.endsWith('%') ? parseFloat(pb) / 100 : parseFloat(pb);

    let alpha = 1;
    if (pA) {
      alpha = pA.endsWith('%') ? parseFloat(pA) / 100 : parseFloat(pA);
    }
    return oklabToRgb(L, a, b, alpha);
  });

  // 3. lab
  const labRegex = /lab\(\s*([0-9.]+%?)\s+([-0-9.]+%?)\s+([-0-9.]+%?)(?:\s*\/\s*([0-9.]+%?))?\s*\)/gi;
  newStr = newStr.replace(labRegex, (match, pL, pa, pb, pA) => {
    const L = pL.endsWith('%') ? parseFloat(pL) : parseFloat(pL);
    const a = pa.endsWith('%') ? parseFloat(pa) : parseFloat(pa);
    const b = pb.endsWith('%') ? parseFloat(pb) : parseFloat(pb);

    let alpha = 1;
    if (pA) {
      alpha = pA.endsWith('%') ? parseFloat(pA) / 100 : parseFloat(pA);
    }
    return labToRgb(L, a, b, alpha);
  });

  // 4. lch
  const lchRegex = /lch\(\s*([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+(?:deg|rad|grad|turn)?)(?:\s*\/\s*([0-9.]+%?))?\s*\)/gi;
  newStr = newStr.replace(lchRegex, (match, pL, pC, pH, pA) => {
    const L = pL.endsWith('%') ? parseFloat(pL) : parseFloat(pL);
    const C = pC.endsWith('%') ? parseFloat(pC) : parseFloat(pC);
    let H = parseFloat(pH);
    if (pH.endsWith('rad')) H = (parseFloat(pH) * 180) / Math.PI;
    if (pH.endsWith('grad')) H = (parseFloat(pH) * 360) / 400;
    if (pH.endsWith('turn')) H = parseFloat(pH) * 360;

    let alpha = 1;
    if (pA) {
      alpha = pA.endsWith('%') ? parseFloat(pA) / 100 : parseFloat(pA);
    }
    return lchToRgb(L, C, H, alpha);
  });

  return newStr;
}
