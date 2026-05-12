interface Perangkat {
  jabatan: string;
  nama: string;
  alias: string[];
}

const perangkatDesa: Perangkat[] = [
  { jabatan: "kepala desa", nama: "Susanto", alias: ["kades santo", "pak santo"] },
  { jabatan: "sekdes", nama: "Aprista Mentari", alias: ["mba tari", "tari"] },
  { jabatan: "bendahara", nama: "Syarif Hidayatulah", alias: ["sayrif", "syarif"] },
  { jabatan: "kaur perencanaan", nama: "Heru Yansyah", alias: ["heru"] },
  { jabatan: "kasi kesos", nama: "Sabtu Ibrahim", alias: ["baim"] },
  { jabatan: "kasi pemerintahan", nama: "Burhan", alias: [] },
  { jabatan: "kasi pelayanan", nama: "M Rifaldi Agustianda", alias: ["agus"] },
  { jabatan: "kadus 1", nama: "Khoirul Anwar", alias: ["pak anwar"] },
  { jabatan: "kadus 2", nama: "Marji Nur Herdianto", alias: ["pak marji"] },
  { jabatan: "kadus 3", nama: "Andrian Saputra", alias: ["rian", "andrian", "rian oneng"] },
  { jabatan: "rt 1", nama: "Sutisna", alias: ["kang tisna"] },
  { jabatan: "rt 2", nama: "Dede Wasidin", alias: ["dede"] },
  { jabatan: "rt 3", nama: "Andre Seswanto", alias: [] },
  { jabatan: "rt 4", nama: "Sunardi", alias: ["cakdi"] },
  { jabatan: "rt 5", nama: "Herianto", alias: ["mang heri"] },
  { jabatan: "rt 6", nama: "Kobri", alias: [] },
];

export default perangkatDesa;
