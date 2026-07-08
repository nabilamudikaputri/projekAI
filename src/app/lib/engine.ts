import { DiagnosaResult, Masalah, Rule } from "./data";

/**
 * Forward Chaining inference dengan perhitungan tingkat keyakinan (confidence).
 * Untuk setiap rule dihitung rasio gejala yang dipilih user terhadap total gejala
 * pada rule. Setiap masalah diwakili oleh rule dengan kecocokan terbaik, lalu
 * seluruh masalah diurutkan (ranking) berdasarkan persentase kecocokan.
 */
export function forwardChaining(
  selectedGejala: string[],
  rules: Rule[],
  masalahList: Masalah[],
): DiagnosaResult[] {
  const selected = new Set(selectedGejala);
  const bestByMasalah = new Map<string, DiagnosaResult>();

  for (const rule of rules) {
    const matched = rule.if.filter((g) => selected.has(g));
    if (matched.length === 0) continue;

    const ratio = matched.length / rule.if.length;
    const persentase = Math.round(ratio * 100);
    const masalah = masalahList.find((m) => m.kode === rule.then);
    if (!masalah) continue;

    const existing = bestByMasalah.get(rule.then);
    const isBetter =
      !existing ||
      persentase > existing.persentase ||
      (persentase === existing.persentase &&
        matched.length > existing.matchedGejala.length);

    if (isBetter) {
      bestByMasalah.set(rule.then, {
        masalahKode: masalah.kode,
        masalahNama: masalah.nama,
        solusi: masalah.solusi,
        matchedGejala: matched,
        ruleGejala: rule.if,
        ruleKode: [rule.kode],
        persentase,
      });
    } else if (existing && persentase === existing.persentase) {
      if (!existing.ruleKode.includes(rule.kode)) existing.ruleKode.push(rule.kode);
    }
  }

  return Array.from(bestByMasalah.values()).sort(
    (a, b) => b.persentase - a.persentase,
  );
}
