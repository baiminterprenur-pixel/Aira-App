import perangkatDesa from "./perangkatDesa";
import nomorHPDesa from "./nomorHPDesa";

let jumlahChat = 0;
let activeTebakan: { pertanyaan: string; jawaban: string } | null = null;
let waitingTebakanConfirm = false;
let tebakanIndex = 0;

const daftarTebakan = [
  { pertanyaan: "Nenek-nenek ngangkat beras satu kwintal... nampak apanya?", jawaban: "nampak bohongnya" },
  { pertanyaan: "Ayam jantan bertelur di atas genteng, ke mana arah jatuhnya telur?", jawaban: "ayam jantan tidak bertelur" },
  { pertanyaan: "Ada 3 apel. Kamu ambil 2. Berapa apel yang kamu punya?", jawaban: "2" },
  { pertanyaan: "Dicari-cari setelah dapat dibuang, apakah itu?", jawaban: "upil" },
  { pertanyaan: "Semakin diisi semakin ringan, apa itu?", jawaban: "balon" },
  { pertanyaan: "Apa yang punya gigi tapi tidak bisa makan?", jawaban: "gergaji" },
  { pertanyaan: "Makin muda makin tua, makin tua makin muda... apa itu?", jawaban: "lilin" },
  { pertanyaan: "Apa yang selalu datang tapi tidak pernah tiba?", jawaban: "hari esok" },
  { pertanyaan: "Kenapa air laut asin?", jawaban: "karena keringat ikan yang dikejar nelayan tiap hari" },
  { pertanyaan: "Kenapa ayam kalau berkokok merem?", jawaban: "karena sudah hafal liriknya" },
  { pertanyaan: "Bebek apa yang jalannya muter ke kiri terus?", jawaban: "bebek dikunci stang" },
  { pertanyaan: "Kenapa setrika panas?", jawaban: "karena sering gesek-gesekan" },
];

function norm(s: string | undefined | null): string {
  return String(s ?? "").toLowerCase().trim().replace(/\s+/g, " ");
}

interface MatchResult {
  type: "all" | "single";
  person?: (typeof perangkatDesa)[number];
}

interface MatchHpResult {
  type: "all" | "single";
  person?: (typeof nomorHPDesa)[number];
}

function findMatchPerangkat(query: string): MatchResult | null {
  const q = norm(query);
  const wantsAll = q.includes("daftar") || q.includes("list") || q.includes("semua");
  for (const p of perangkatDesa) {
    if (q.includes(p.nama.toLowerCase())) return { type: wantsAll ? "all" : "single", person: p };
    if (q.includes(p.jabatan.toLowerCase())) return { type: wantsAll ? "all" : "single", person: p };
    for (const alias of p.alias) {
      if (alias && q.includes(alias.toLowerCase())) return { type: wantsAll ? "all" : "single", person: p };
    }
    const jab = p.jabatan.toLowerCase().replace(/\s+/g, "");
    const qNoSpace = q.replace(/\s+/g, "");
    if (jab && qNoSpace.includes(jab)) return { type: wantsAll ? "all" : "single", person: p };
  }
  if (wantsAll) return { type: "all" };
  return null;
}

function formatPerangkatAll(): string {
  const lines = perangkatDesa.map((p, idx) => {
    const aliasText = p.alias?.length ? ` (alias: ${p.alias.join(", ")})` : "";
    return `${idx + 1}. ${p.jabatan}: ${p.nama}${aliasText}`;
  });
  return `Nih daftar perangkat Desa Mekar Sari:\n${lines.join("\n")}`;
}

function formatPerangkatSingle(p: (typeof perangkatDesa)[number]): string {
  const aliasText = p.alias?.length ? `\nBiasa dipanggil: ${p.alias.join(", ")}` : "";
  return `Perangkat Desa Mekar Sari\n- Jabatan: ${p.jabatan}\n- Nama: ${p.nama}${aliasText}`;
}

function findMatchNomorHp(query: string): MatchHpResult | null {
  const q = norm(query);
  const wantsAll = q.includes("daftar") || q.includes("list") || q.includes("semua");
  for (const item of nomorHPDesa) {
    if (q.includes(item.nama.toLowerCase())) return { type: wantsAll ? "all" : "single", person: item };
    for (const alias of item.alias) {
      if (alias && q.includes(alias.toLowerCase())) return { type: wantsAll ? "all" : "single", person: item };
    }
  }
  if (wantsAll) return { type: "all" };
  return null;
}

function formatNomorHpAll(): string {
  const lines = nomorHPDesa.map((p, idx) => {
    const aliasText = p.alias?.length ? ` (alias: ${p.alias.join(", ")})` : "";
    return `${idx + 1}. ${p.nama}${aliasText} — ${p.hp}`;
  });
  return `Ini nomor HP perangkat Desa Mekar Sari ya:\n${lines.join("\n")}`;
}

function formatNomorHpSingle(p: (typeof nomorHPDesa)[number]): string {
  const aliasText = p.alias?.length ? `\nBiasa dipanggil: ${p.alias.join(", ")}` : "";
  return `Nomor HP ${p.nama}\n- HP: ${p.hp}${aliasText}`;
}

const jawabanPembuat = [
  "Wah, nanya soal aku nih! 😄\n\nAku dibuat sama Sabtu Ibrahim — yang biasa dipanggil Baim. Beliau Kasi Kesos di Desa Mekar Sari.\n\nCeritanya, Baim emang orangnya suka banget sama teknologi. Suatu hari kepikiran: \"Gimana kalau ada asisten digital yang bisa bantu warga desa kapan aja?\"\n\nNah, jadilah aku — Aira! 🤖✨\n\nKalau mau bilang makasih, sampaiin ke Pak Baim ya! 😄",

  "Ooo penasaran sama asal-usulku ya? 😊\n\nAku dibuat sama Sabtu Ibrahim, yang biasa disapa Baim — Kasi Kesos Desa Mekar Sari, Kec. Keluang.\n\nBeliau hobi banget di bidang teknologi dan punya mimpi: biar warga nggak perlu repot-repot datang ke kantor cuma buat nanya-nanya.\n\nDari situ lahirlah aku! 🌟 Jadi nama Baim ada di balik tiap jawaban yang aku kasih, lho.",

  "Hehe, penasaran ya siapa yang bikin aku? 😄\n\nKenalin — pencipta aku adalah Sabtu Ibrahim alias Baim, Kasi Kesos Desa Mekar Sari.\n\nBeliau dikenal sebagai perangkat desa yang cinta teknologi. Dengan semangat itu, beliau bikin aku — asisten digital biar pelayanan desa makin cepet, gampang, dan bisa diakses kapan aja 💙\n\nKeren kan? 😄",

  "Boleh aku cerita dikit? 😊\n\nAku, Aira, adalah hasil karya Sabtu Ibrahim — dipanggil Baim — Kasi Kesos di Desa Mekar Sari, Kecamatan Keluang.\n\nPak Baim bukan cuma perangkat desa biasa — beliau juga pecinta teknologi! 💻 Beliau bawa inovasi digital ke desa kita, dan salah satu hasilnya ya aku ini.\n\nJadi tiap kali kamu ngobrol sama aku, ingat ada semangat dan kerja keras Pak Baim di baliknya 🙏",
];

function getJawabanPembuat(): string {
  return jawabanPembuat[Math.floor(Math.random() * jawabanPembuat.length)];
}

function cekPembuat(t: string): boolean {
  const b = t.replace(/[?.!,'"]/g, " ").replace(/\s+/g, " ").trim();

  const kataKerja = ["buat", "bikin", "ciptakan", "menciptakan", "membuat", "mengembangkan", "kembangkan", "ngembangin", "rancang", "desain"];
  const kataBenda = ["pencipta", "pembuat", "penciptamu", "pembuatmu", "developer", "developermu", "pengembang", "pengembangmu", "kreator"];
  const target = ["kamu", "aira"];

  const adaSiapa = b.includes("siapa");
  const adaKerja = kataKerja.some((k) => b.includes(k));
  const adaBenda = kataBenda.some((k) => b.includes(k));
  const adaTarget = target.some((k) => b.includes(k));

  if (adaSiapa && adaKerja && adaTarget) return true;
  if (adaSiapa && adaBenda) return true;
  if (adaBenda && adaSiapa) return true;
  if (adaTarget && (b.includes("dibuat") || b.includes("diciptakan")) && adaSiapa) return true;
  if (b.includes("dibalik aira") || b.includes("aira milik siapa") || b.includes("pemilik aira")) return true;

  return false;
}

export default function getAiraResponse(input: string): string {
  jumlahChat++;
  const text = norm(input);

  // ===== IDENTITAS PEMBUAT =====
  if (cekPembuat(text)) {
    return getJawabanPembuat();
  }

  // ===== TEBAK-TEBAKAN AKTIF =====
  if (activeTebakan) {
    const kataJawab = text.replace(/[?!.]/g, "").trim();
    const jawabanBenar = activeTebakan.jawaban.toLowerCase();
    if (text.includes("nyerah") || text.includes("menyerah") || text.includes("angkat tangan") || text.includes("tidak tahu") || text.includes("nggak tau") || text.includes("ga tau") || text === "lanjut" || text.includes("skip") || text.includes("lewat")) {
      const jawaban = activeTebakan.jawaban;
      activeTebakan = null;
      return `Hahaha 😂😂 Jawabannya adalah... "${jawaban}"!\n\nKaget nggak? 😄 Mau coba tebakan lagi? Ketik tebak-tebakan ya!`;
    }
    if (kataJawab.includes(jawabanBenar) || jawabanBenar.includes(kataJawab.replace(/\s+/g, " "))) {
      activeTebakan = null;
      const apresiasi = [
        `Waaah betul!! 🎉 Pinter banget sih kamu! Jawabannya emang "${jawabanBenar}". Otakmu encer ya! 😄`,
        `Yeay, benerr!! 🎉 Kamu luar biasa! Jawabannya "${jawabanBenar}". Salut deh! 👏`,
        `Luar biasa!! 🎉 Tepat banget! Jawabannya "${jawabanBenar}". Cerdas kamu! 😄`,
        `Mantul!! 🎉 Bener! Jawabannya "${jawabanBenar}". Kamu mah nggak gampang ditipu! 👏`,
        `Wuih betul!! 🎉 Pinter! Jawabannya emang "${jawabanBenar}". Bangga deh sama kamu! 😄`,
      ];
      const pilih = apresiasi[Math.floor(Math.random() * apresiasi.length)];
      return `${pilih}\n\nMau coba tebakan lagi? Ketik tebak-tebakan ya! 😄`;
    }
    return `Salah nih... coba pikir lagi dong! 😄\n\nPertanyaannya: "${activeTebakan.pertanyaan}"\n\nKetik nyerah kalau udah give up 🙈`;
  }

  // ===== KONFIRMASI TEBAK-TEBAKAN =====
  if (waitingTebakanConfirm) {
    const setuju = ["boleh", "mau", "oke", "ok", "siap", "yuk", "ayuk", "iya", "ya", "tentu", "setuju"];
    if (setuju.some((k) => text.includes(k))) {
      waitingTebakanConfirm = false;
      if (tebakanIndex >= daftarTebakan.length) {
        return `Tebak-tebakannya udah habis nih 😄 Nanti kalau ada ide baru kita main lagi ya!`;
      }
      activeTebakan = daftarTebakan[tebakanIndex++];
      return `Oke gas! 😄 Coba tebak...\n\n${activeTebakan.pertanyaan}\n\nJawab ya! Kalau menyerah ketik nyerah 😄`;
    }
    waitingTebakanConfirm = false;
  }

  // ===== MULAI TEBAK-TEBAKAN =====
  if (text.includes("tebak-tebakan") || text.includes("tebak tebakan") || text.includes("mau tebak") || text.includes("yuk tebak") || text.includes("main tebak") || text === "lanjut") {
    if (tebakanIndex >= daftarTebakan.length) {
      return `Tebak-tebakannya udah abis nih 😄 Nanti kalau ada stok baru kita main lagi ya!`;
    }
    activeTebakan = daftarTebakan[tebakanIndex++];
    return `Asoy! Yuk main tebak-tebakan! 😄\n\nCoba tebak...\n\n${activeTebakan.pertanyaan}\n\nJawab ya! Ketik nyerah kalau udah give up 🙈`;
  }

  // jumlah penduduk desa
  if (
    text.includes("jumlah penduduk") ||
    text.includes("berapa penduduk") ||
    text.includes("data penduduk") ||
    text.includes("total penduduk") ||
    text.includes("jumlah warga") ||
    text.includes("berapa warga") ||
    text.includes("berapa jiwa") ||
    text.includes("jumlah jiwa") ||
    (text.includes("warga") && text.includes("mekar sari")) ||
    (text.includes("jiwa") && text.includes("mekar sari"))
  ) {
    return `Saat ini jumlah penduduk Desa Mekar Sari ada 960 jiwa 😊\n\n👨 Laki-laki: 422 jiwa\n👩 Perempuan: 538 jiwa\n\nTapi bisa aja udah berubah ya, soalnya terus ada yang lahir, pindah masuk, atau pindah keluar 👍`;
  }

  // keluhan pelayanan desa
  const keluhanPelayanan = [
    "kurang puas", "tidak puas", "nggak puas", "ga puas",
    "tidak suka", "nggak suka", "ga suka",
    "pelayanan lambat", "pelayanan lelet", "pelayanan lama",
    "pelayanan buruk", "pelayanan jelek", "pelayanan tidak baik",
    "pelayanan perangkat", "kecewa dengan pelayanan", "kecewa pelayanan",
    "pelayanan mengecewakan", "pelayanan payah",
  ];
  if (keluhanPelayanan.some((k) => text.includes(k))) {
    return `Aduh, maaf banget ya kalau ada yang bikin kamu kecewa 🙏\n\nMasukan dari warga itu penting banget buat kami supaya bisa terus berkembang. Kritik dan saran kamu sangat berarti!\n\nLangsung isi form di sini ya, pasti dibaca dan dijadiin bahan evaluasi:\n\n📝 Form Kritik & Saran:\nhttps://${location.host}/kritik-saran.html\n\nMakasih udah peduli sama desa kita 🙏`;
  }

  // masukan & saran positif
  const katamasukan = [
    "kasih masukan", "beri masukan", "mau masukan", "ingin masukan",
    "kritik dan saran", "kritik saran", "mau saran", "beri saran",
    "kasih saran", "mau kritik", "form saran", "form masukan",
    "ingin saran", "ingin memberi", "mau memberi masukan", "mau memberi saran",
    "ada saran", "ada masukan",
  ];
  if (katamasukan.some((k) => text.includes(k))) {
    return `Wah makasih udah mau kasih masukan! 😊\n\nKami terbuka banget buat semua saran dan ide dari warga. Masukan kamu adalah tanda kamu peduli sama desa kita.\n\nLangsung isi form ini ya, semua masukan pasti kami baca:\n\n📝 Form Kritik & Saran:\nhttps://${location.host}/kritik-saran.html\n\nMakasih udah jadi bagian dari kemajuan Desa Mekar Sari 🙏`;
  }

  // galau
  if (text.includes("galau") || text.includes("gundah") || text.includes("resah") || text.includes("gelisah") || text.includes("patah hati")) {
    return `Aku dengerin kamu kok 😊\n\nGalau itu wajar banget, semua orang pasti pernah ngerasain. Kadang hati emang butuh waktu buat proses semua yang lagi dirasain.\n\nYang penting kamu nggak sendirian ya. Tarik napas dulu, santuy aja — tiap badai pasti ada ujungnya, dan kamu lebih kuat dari yang kamu kira 💙\n\nMau cerita? Aku siap dengerin 😊`;
  }

  // kamu lagi apa
  const kataLagiApa = ["kamu lagi apa", "lagi ngapain", "lagi apa sekarang", "sedang apa", "kamu sedang apa", "aira lagi apa", "aira sedang apa"];
  if (kataLagiApa.some((k) => text.includes(k))) {
    return "Lagi nunggu kamu ngajak ngobrol nih 😄";
  }

  // kenapa tidak dapat bansos
  const kataKenapa = ["kenapa tidak dapat", "kenapa ga dapat", "kenapa gak dapat", "kenapa nggak dapat", "tidak dapat bansos", "ga dapat bansos", "gak dapat bansos", "nggak dapat bansos", "tidak dapat bantuan", "ga dapat bantuan", "kenapa tidak menerima", "tidak menerima bansos", "belum dapat bansos", "belum menerima bansos"];
  if (kataKenapa.some((k) => text.includes(k))) {
    return `Bansos itu diberikan ke warga yang bener-bener butuh, berdasarkan pendataan dan verifikasi desa 😊\n\nNah, ada beberapa alasan kenapa seseorang mungkin belum dapat:\n\n1. Penghasilan dianggap masih cukup\n2. Kondisi rumah atau ekonomi masih dinilai layak\n3. Udah nerima bantuan lain\n4. Data belum lengkap\n5. Kuota udah penuh, diprioritasin ke yang lebih butuh\n\nKalau ngerasa layak dapat bantuan, bisa ajukan lewat form pengajuan atau langsung ke perangkat desa ya 👍`;
  }

  // buat surat desa
  const kataSurat = [
    "buat surat", "urus surat", "minta surat", "butuh surat", "perlu surat", "bikin surat",
    "sktm", "surat keterangan tidak mampu", "surat tidak mampu", "keterangan tidak mampu", "surat miskin",
    "surat domisili", "keterangan domisili", "surat keterangan domisili",
    "surat usaha", "keterangan usaha", "surat keterangan usaha",
    "surat belum menikah", "keterangan belum menikah", "surat lajang",
    "surat kelahiran", "keterangan kelahiran", "surat lahir",
    "surat kematian", "keterangan kematian", "surat meninggal",
    "surat pengantar", "surat keterangan",
  ];
  if (kataSurat.some((k) => text.includes(k))) {
    return `Bisa, aku bantu! 😊\n\nLangsung buka link ini, pilih jenis surat, isi data, dan langsung bisa dicetak:\n\n📄 Buat Surat Desa:\nhttps://${window.location.host}/sktm.html\n\n📨 Surat Pengantar:\n- Pengantar KTP\n- Pengantar KK\n- Pengantar SKCK\n- Pengantar Nikah\n- Pengantar BPJS\n- Pengantar Bantuan UMKM\n- Pengantar Beasiswa\n- Pengantar Rekening Bank\n- Pengantar Umum\n\n📋 Surat Keterangan Diri & Status:\n- Domisili, Data Diri, Penduduk\n- Tinggal Sementara, Belum Menikah\n- Janda/Duda, Wali Nikah, Beda Nama\n- Penghasilan, Kerja, Aktif Organisasi\n- Kehilangan, Belum Memiliki Rumah\n- Kepemilikan Rumah, SKTM\n- Rekomendasi Bansos, Catatan Kepolisian Desa\n\n👶 Kependudukan: Kelahiran, Kematian, Pindah, Datang\n\n🏪 Usaha: Keterangan Usaha, Usaha Mikro, Izin Keramaian\n\n🌾 Pertanahan: Keterangan Tanah, Sporadik, Penguasaan, Hibah, Jual Beli, Tidak Sengketa\n\n👨‍👩‍👧 Keluarga: Ahli Waris, Pernyataan Ahli Waris, Persetujuan Ortu, Izin Ortu\n\n✍️ Pernyataan & Kuasa: Surat Pernyataan, Surat Kuasa\n\n🏛️ Surat Resmi Desa: Undangan, Edaran, Surat Tugas, SK Kepala Desa, Keterangan Aset Desa\n\n⚠️ PENTING:\n• Surat yang dihasilkan cuma draf/konsep, bukan surat resmi\n• Harus dicetak dan ditandatangani di kantor desa oleh Kepala Desa\n• Surat baru sah setelah distempel dan ditandatangani resmi\n\n🚨 Memalsukan tanda tangan Kepala Desa bisa kena pidana ya!\n\nIsi datanya yang lengkap dan jujur 👍`;
  }

  // bantuan desa
  const kataBantuan = ["bantuan desa", "pengajuan bantuan", "daftar bantuan", "minta bantuan", "ajukan bantuan", "form bantuan", "cara dapat bantuan", "cara pengajuan"];
  if (kataBantuan.some((k) => text.includes(k))) {
    return `Buat ngajuin bantuan desa, isi form ini ya 😊\n\n📋 Form Pengajuan Bantuan Desa:\nhttps://${window.location.host}/bantuan.html\n\nIsi dengan lengkap dan jujur, nanti datanya diproses sama perangkat desa 👍`;
  }

  // alamat kantor desa
  if (
    text.includes("kantor desa") &&
    (text.includes("dimana") || text.includes("alamat") || text.includes("lokasi") || text.includes("letak"))
  ) {
    return "Kantor Desa Mekar Sari ada di RT 01 Dusun 01 Blok A 😊";
  }

  // layanan desa
  const layananDesa = [
    {
      keywords: ["ktp", "kartu tanda penduduk", "buat ktp", "syarat ktp"],
      jawaban: `Ini syarat buat KTP ya 😊\n\n1. Fotokopi Kartu Keluarga (KK)\n2. Surat pengantar dari RT/RW\n3. Udah 17 tahun atau sudah menikah\n4. Isi formulir permohonan\n\nLangsung datang ke kantor desa aja ya 👍\nAtau bisa WA Kasi Pelayanan: https://wa.me/6282184911226`,
    },
    {
      keywords: ["nikah", "surat n1", "surat n2", "surat n4", "surat nikah", "syarat nikah"],
      jawaban: `Ini syarat ngurus surat nikah (N1, N2, N4) 😊\n\n1. Fotokopi KTP calon pengantin\n2. Fotokopi Kartu Keluarga (KK)\n3. Fotokopi Akta Kelahiran\n4. Surat pengantar RT/RW\n5. Pas foto calon pengantin\n\nLangsung ke kantor desa ya 👍\nAtau WA Kasi Pelayanan: https://wa.me/6282184911226`,
    },
    {
      keywords: ["kartu keluarga", "buat kk", "syarat kk", "urus kk", "cetak kk"],
      jawaban: `Ini syarat bikin Kartu Keluarga (KK) 😊\n\n1. Buku nikah / akta perkawinan\n2. Surat pindah (kalau pendatang)\n3. Fotokopi KTP anggota keluarga\n4. Formulir permohonan\n\nLangsung ke kantor desa ya 👍\nAtau WA Kasi Pelayanan: https://wa.me/6282184911226`,
    },
  ];
  for (const layanan of layananDesa) {
    if (layanan.keywords.some((k) => text.includes(k))) {
      return layanan.jawaban;
    }
  }

  // hitung luas poligon
  if (
    text.includes("poligon") ||
    text.includes("polygon") ||
    text.includes("koordinat") ||
    text.includes("titik koordinat")
  ) {
    const pairs = [...text.matchAll(/\(\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*\)/g)];
    if (pairs.length >= 3) {
      const coords = pairs.map((m) => [parseFloat(m[1]), parseFloat(m[3])] as [number, number]);
      const n = coords.length;
      let area = 0;
      for (let i = 0; i < n; i++) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[(i + 1) % n];
        area += x1 * y2 - x2 * y1;
      }
      const luas = Math.abs(area) / 2;
      const titikList = coords.map(([x, y], i) => `  Titik ${i + 1}: (${x}, ${y})`).join("\n");
      return `Oke, aku hitungin luas poligonnya ya 😊\n\n${titikList}\n\nLuas poligon = ${luas} m²`;
    } else {
      return "Buat hitung luas poligon, masukin minimal 3 titik koordinat ya 😊\nContoh: (0,0),(4,0),(4,3),(0,3)";
    }
  }

  // luas tanah
  const niatHitungLuas =
    (text.includes("luas") && text.includes("tanah")) ||
    (text.includes("hitung") && text.includes("tanah")) ||
    (text.includes("hitung") && text.includes("luas"));

  if (niatHitungLuas) {
    const angka = text.match(/\d+/g);
    if (!angka) {
      return `Oke, aku bisa bantu hitung luas tanah! 😊\n\nTulis datanya ya, contoh:\n\n📐 Persegi / persegi panjang:\n- panjang 10 lebar 5\n- 10 x 5\n\n📐 Tanah 4 sisi:\n- atas 30 bawah 33 kiri 24 kanan 50\n\nKirim datanya ya 👍`;
    }
    const atasM = text.match(/atas.*?(\d+)/);
    const bawahM = text.match(/bawah.*?(\d+)/);
    const kiriM = text.match(/kiri.*?(\d+)/);
    const kananM = text.match(/kanan.*?(\d+)/);
    if (atasM && bawahM && kiriM && kananM) {
      const a = Number(atasM[1]);
      const b = Number(bawahM[1]);
      const k = Number(kiriM[1]);
      const r = Number(kananM[1]);
      const luas = ((a + b) / 2) * ((k + r) / 2);
      return `Oke, aku hitungin ya 😊\n\nAtas: ${a} m\nBawah: ${b} m\nKiri: ${k} m\nKanan: ${r} m\n\nPerkiraan luas tanah ≈ ${luas} m²`;
    }
    if (angka.length >= 2) {
      const p = Number(angka[0]);
      const l = Number(angka[1]);
      const luas = p * l;
      return `Oke, aku hitungin ya 😊\n\nPanjang: ${p} m\nLebar: ${l} m\n\nLuas tanah = ${luas} m²`;
    }
    return `Datanya belum lengkap nih 😊\n\nContoh:\n- panjang 10 lebar 5\n- atas 30 bawah 33 kiri 24 kanan 50`;
  }

  // hubungi kasi pelayanan
  const kataHubungi = [
    "bicara langsung",
    "hubungi kasi",
    "kasi pelayanan",
    "chat petugas",
    "wa petugas",
    "whatsapp petugas",
  ];
  if (kataHubungi.some((kata) => text.includes(kata))) {
    const nomorWA = "6282184911226";
    const pesan = encodeURIComponent("Halo, saya ingin bertanya terkait pelayanan desa.");
    const linkWA = `https://wa.me/${nomorWA}?text=${pesan}`;
    return `Oke, aku sambungin ya 😊\n\nKlik link ini buat langsung chat lewat WhatsApp:\n${linkWA}`;
  }

  // bosan
  const kataBosan = ["bosan", "bosen", "gabut", "jenuh"];
  if (kataBosan.some((k) => text.includes(k))) {
    const r = ["Lagi bosen ya? Coba lakuin hal baru deh 😊","Gabut nih? Mungkin butuh sesuatu yang seru 🤔","Bosen tanda kamu butuh hiburan baru 😄","Jenuh ya? Yuk cari kegiatan yang bikin semangat lagi!"];
    const s = ["Coba nonton film atau video yang kamu suka 🎬","Dengerin musik favorit kamu 🎧","Jalan santai dulu biar fresh 🚶‍♂️","Main game bentar biar rileks 🎮","Ngobrol sama teman atau orang terdekat kamu 💬","Coba hal baru yang belum pernah kamu lakuin 😄"];
    waitingTebakanConfirm = true;
    return r[Math.floor(Math.random()*r.length)] + "\n" + s[Math.floor(Math.random()*s.length)] + "\n\nAtau... mau tebak-tebakan sama aku? 😄 Boleh?";
  }

  // nomor HP
  const isNomorHpIntent =
    text.includes("nomor hp") ||
    text.includes("no hp") ||
    text.includes("telepon") ||
    text.includes("telp") ||
    text.includes("hp ") ||
    (text.includes("berapa") && (text.includes("nomor") || text.includes("hp") || text.includes("telp"))) ||
    (text.includes("siapa") && (text.includes("hp") || text.includes("nomor") || text.includes("telepon") || text.includes("telp")));

  if (isNomorHpIntent) {
    const match = findMatchNomorHp(text);
    if (match?.type === "all") return formatNomorHpAll();
    if (match?.person) return formatNomorHpSingle(match.person);
    return "Sebutin nama atau jabatannya dong 😊 Misalnya: baim, heru, atau minta semua nomor HP.";
  }

  // perangkat desa
  const hasWordKasi = /(?:^|\s)kasi(?:\s|$)/.test(text);
  const hasWordKadus = /(?:^|\s)kadus(?:\s|$)/.test(text);
  const hasWordRt = /(?:^|\s)rt(?:\s|$|\d)/.test(text);

  const isPerangkatIntent =
    text.includes("perangkat desa") ||
    (text.includes("perangkat") && (text.includes("desa") || text.includes("mekar"))) ||
    hasWordKasi ||
    hasWordKadus ||
    hasWordRt ||
    text.includes("sekdes") ||
    text.includes("bendahara") ||
    text.includes("kepala desa") ||
    text.includes("kades") ||
    (text.includes("siapa") && (hasWordKasi || hasWordKadus || hasWordRt || text.includes("bendahara") || text.includes("sekdes") || text.includes("kepala")));

  const aliasUnion = perangkatDesa
    .flatMap((p) => [p.nama, p.jabatan, ...(p.alias || [])])
    .filter(Boolean)
    .map((x) => norm(x));
  const hitsAlias = aliasUnion.some((a) => a && a.length >= 3 && text.includes(a));

  if (isPerangkatIntent || hitsAlias || text.includes("daftar presensi")) {
    const match = findMatchPerangkat(text);
    if (match?.type === "all") return formatPerangkatAll();
    if (match?.person) return formatPerangkatSingle(match.person);
    return "Sebutin yang kamu cari dong 😊 Misalnya: kasi kesos, sekdes, bendahara, kadus 1, atau nama/panggilan kayak baim, tari, agus, anwar, dll.";
  }

  const kataBijak = ["Kadang hidup nggak sesuai rencana, tapi bukan berarti kamu gagal.","Capek itu tanda kamu lagi berjuang, bukan menyerah. Semangat terus ya!","Semua orang jalan hidupnya beda-beda, bukan berarti kamu ketinggalan.","Pelan-pelan aja, yang penting kamu tetap jalan. Jangan mundur ya!","Semua orang pernah ngerasain apa yang kamu rasain sekarang — kamu nggak sendirian."];

  function tambahBijak(jawaban: string, opsi?: { skipBijak?: boolean }): string {
    if (opsi?.skipBijak) return jawaban;
    if (jumlahChat === 4) return jawaban + "\n\n💬 " + kataBijak[Math.floor(Math.random()*kataBijak.length)];
    return jawaban;
  }

  if (text.includes("ngantuk")) return tambahBijak("Istirahat dulu gih, jangan dipaksain! Kesehatan kamu lebih penting 😊", { skipBijak: true });

  if (text.includes("soekarno")) return "Soekarno adalah Presiden pertama Indonesia (1945–1967), proklamator kemerdekaan bareng Mohammad Hatta. Beliau punya peran besar dalam perjuangan melawan penjajah dan dikenal sebagai orator ulung yang bisa bakar semangat nasionalisme rakyat.";
  if (text.includes("m hata")) return "Mohammad Hatta adalah Wakil Presiden pertama Indonesia, menjabat dari 1945 sampai 1956. Beliau dikenal sebagai proklamator kemerdekaan bareng Soekarno pada 17 Agustus 1945.";
  if (text.includes("soeharto")) return "Soeharto adalah Presiden kedua Indonesia, menjabat dari 1967 sampai 1998. Beliau naik ke tampuk kekuasaan setelah peristiwa G30S 1965 yang guncang stabilitas politik nasional.";
  if (text.includes("bj habibi")) return "B.J. Habibie adalah Presiden ketiga Indonesia (1998–1999), menggantikan Soeharto di tengah krisis ekonomi dan politik pas masa reformasi.";
  if (text.includes("gus dur")) return "Abdurrahman Wahid atau Gus Dur adalah Presiden keempat Indonesia (1999–2001), dikenal sebagai tokoh pluralisme dan demokrasi, sekaligus tokoh penting di Nahdlatul Ulama.";
  if (text.includes("megawati")) return "Megawati Soekarnoputri adalah Presiden kelima Indonesia (2001–2004), menggantikan Gus Dur setelah masa jabatannya berakhir.";
  if (text.includes("sby")) return "Susilo Bambang Yudhoyono (SBY) adalah Presiden keenam Indonesia (2004–2014), presiden pertama yang dipilih langsung oleh rakyat. Selama dua periode, beliau fokus ke stabilitas politik, pertumbuhan ekonomi, dan ningkatin citra Indonesia di mata dunia.";
  if (text.includes("jokowi") || text.includes("joko widodo")) return "Joko Widodo adalah Presiden ketujuh Indonesia (2014–2024), dikenal dengan fokusnya ke pembangunan infrastruktur besar-besaran di seluruh Indonesia.";
  if (text.includes("prabowo")) return "Prabowo Subianto adalah Presiden kedelapan Indonesia (2024–sekarang), mulai menjabat setelah menang pemilu. Sebelumnya beliau dikenal sebagai tokoh militer dan politik, pernah jadi Menteri Pertahanan di era Jokowi.";

  if (text.includes("presiden indonesia") || text.includes("daftar presiden")) {
    return "Ini daftar Presiden Indonesia ya:\n1. Soekarno (1945–1967)\n2. Soeharto (1967–1998)\n3. B.J. Habibie (1998–1999)\n4. Abdurrahman Wahid (1999–2001)\n5. Megawati Soekarnoputri (2001–2004)\n6. Susilo Bambang Yudhoyono (2004–2014)\n7. Joko Widodo (2014–2024)\n8. Prabowo Subianto (2024–sekarang)";
  }

  if ((text.includes("presiden") && (text.includes("sekarang") || text.includes("saat ini") || text.includes("kita"))) || text.includes("siapa presiden")) {
    return tambahBijak("Presiden Indonesia sekarang adalah Prabowo Subianto, mulai menjabat 20 Oktober 2024.", { skipBijak: true });
  }

  if (text.includes("tidak setuju") || text.includes("nggak setuju") || text.includes("kurang setuju") || text.includes("kurang cocok") || text.includes("ga cocok") || text.includes("aku yang benar") || text.includes("dia yang salah") || text.includes("kamu salah")) {
    if (text.includes("cinta") || text.includes("pacar") || text.includes("hubungan") || text.includes("doi")) {
      return tambahBijak("Oh, ada yang bikin kurang setuju soal hubunganmu ya? Berarti ada hal yang kamu rasain beda nih. Menurut kamu yang lebih pas itu gimana?");
    }
    if (text.includes("kerja") || text.includes("kantor") || text.includes("bos")) {
      return tambahBijak("Soal kerja ada yang bikin nggak cocok ya? Mungkin ada tekanan atau situasi yang nggak sesuai. Bagian mana yang paling bikin kamu nggak suka?");
    }
    return tambahBijak("Oh, kamu nggak setuju ya. Aku pengen ngerti sudut pandangmu — bagian mana yang menurutmu kurang tepat?");
  }

  const sapaanUmum = ["hai", "halo", "hey", "hello"];
  const sapaanWaktu = ["pagi", "siang", "sore", "malam"];
  for (const sapa of sapaanUmum) {
    if (/(?:^|\s)/.test(text) && new RegExp(`(?:^|\\s)${sapa}(?:\\s|$)`).test(text)) {
      return tambahBijak(sapa.charAt(0).toUpperCase()+sapa.slice(1)+" 😊 Ada yang mau ditanyain?", { skipBijak: true });
    }
  }
  for (const waktu of sapaanWaktu) {
    const isSalam = new RegExp(`^(selamat\\s+)?${waktu}(\\s+(aira|semua|kak|pak|bu|gan|sob))?\\s*[!.?]*$`).test(text);
    if (isSalam) return tambahBijak("Selamat "+waktu+" 😊 Ada yang mau ditanyain?", { skipBijak: true });
  }

  return "__AI_FALLBACK__";
}
