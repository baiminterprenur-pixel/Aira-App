export default function handleMath(text: string): string | null {
  if (typeof text !== "string") return null;
  const raw = text.trim();
  if (!raw) return null;

  if (raw.includes(",")) {
    const parts = raw.split(",");
    const hasil: string[] = [];
    for (const p of parts) {
      const part = p.trim();
      if (!part) continue;
      const h = hitung(part);
      if (h) hasil.push(part + " = " + h.replace("Hasilnya adalah ", ""));
    }
    return hasil.length ? "Hasilnya:\n" + hasil.join("\n") : null;
  }

  if (/^[0-9+\-*/().\s]+$/.test(raw)) return hitung(raw);

  if (raw.toLowerCase().includes("berapa") || raw.toLowerCase().includes("hitung")) {
    const expr = raw.replace(/berapa/gi, "").replace(/hitung/gi, "").trim();
    if (!/\d/.test(expr)) return null;
    return hitung(expr);
  }

  const textNorm = String(text).trim();
  const mathPattern = /(-?\d+(\.\d+)?)(\s*)([+\-*/:])(\s*)(-?\d+(\.\d+)?)/;
  if (mathPattern.test(textNorm)) {
    try {
      const ekspresi = textNorm.replace(/x/g, "*").replace(/:/g, "/");
      const hasil = Function("return " + ekspresi)() as number;
      if (typeof hasil !== "number" || Number.isNaN(hasil)) return null;
      return "Hasilnya adalah " + hasil;
    } catch {
      return null;
    }
  }
  return null;
}

function hitung(expr: string): string | null {
  try {
    const clean = String(expr)
      .replace(/kali/gi, "*").replace(/x/gi, "*")
      .replace(/dibagi/gi, "/").replace(/tambah/gi, "+")
      .replace(/kurang/gi, "-").replace(/\s+/g, "");
    if (!clean) return null;
    if (!/^[0-9+\-*/().]+$/.test(clean)) return null;
    const hasil = Function('"use strict"; return (' + clean + ');')() as number;
    if (typeof hasil !== "number" || Number.isNaN(hasil)) return null;
    return "Hasilnya adalah " + hasil;
  } catch {
    return null;
  }
}
