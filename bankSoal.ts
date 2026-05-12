export interface Soal {
  id: string;
  pertanyaan: string;
  pilihan: [string, string, string];
  jawaban: 0 | 1 | 2;
  sesi: 1 | 2 | 3 | 4 | 5;
}

export interface SoalSolo {
  id: string;
  pertanyaan: string;
  pilihan: [string, string, string];
  jawaban: 0 | 1 | 2;
  tingkat: "mudah" | "sedang" | "sulit";
  paket: 1 | 2 | 3 | 4 | 5;
}

// =========================================================
// SOAL MULTIPLAYER — BABAK 1 (60 soal, ambil 30)
// =========================================================
export const bankSoal: Soal[] = [
  { id: "s1-01", pertanyaan: "Apa nama ibukota baru Indonesia yang sedang dibangun?", pilihan: ["Palangkaraya", "Nusantara", "Samarinda"], jawaban: 1, sesi: 1 },
  { id: "s1-02", pertanyaan: "Siapa presiden pertama Republik Indonesia?", pilihan: ["Soeharto", "Soekarno", "Habibie"], jawaban: 1, sesi: 1 },
  { id: "s1-03", pertanyaan: "Berapa jumlah provinsi di Indonesia saat ini?", pilihan: ["34", "36", "38"], jawaban: 2, sesi: 1 },
  { id: "s1-04", pertanyaan: "Apa semboyan nasional Indonesia?", pilihan: ["Pancasila Sakti", "Bhinneka Tunggal Ika", "Garuda Nusantara"], jawaban: 1, sesi: 1 },
  { id: "s1-05", pertanyaan: "Indonesia merdeka pada tanggal berapa?", pilihan: ["17 Agustus 1945", "1 Juni 1945", "28 Oktober 1928"], jawaban: 0, sesi: 1 },
  { id: "s1-06", pertanyaan: "Pulau terbesar di Indonesia adalah...", pilihan: ["Jawa", "Sumatera", "Kalimantan"], jawaban: 2, sesi: 1 },
  { id: "s1-07", pertanyaan: "Berapakah hasil dari 15 × 8?", pilihan: ["100", "110", "120"], jawaban: 2, sesi: 1 },
  { id: "s1-08", pertanyaan: "Mata uang resmi Indonesia adalah...", pilihan: ["Dollar", "Rupiah", "Ringgit"], jawaban: 1, sesi: 1 },
  { id: "s1-09", pertanyaan: "Bunga nasional 'Puspa Bangsa' Indonesia adalah...", pilihan: ["Anggrek Bulan", "Melati Putih", "Rafflesia Arnoldii"], jawaban: 1, sesi: 1 },
  { id: "s1-10", pertanyaan: "Lembaga yang bertugas membuat undang-undang di Indonesia adalah...", pilihan: ["BPK", "KPK", "DPR"], jawaban: 2, sesi: 1 },
  { id: "s1-11", pertanyaan: "Danau terbesar di Indonesia adalah...", pilihan: ["Danau Toba", "Danau Sentani", "Danau Poso"], jawaban: 0, sesi: 1 },
  { id: "s1-12", pertanyaan: "Berapa sila dalam Pancasila?", pilihan: ["3", "4", "5"], jawaban: 2, sesi: 1 },
  { id: "s1-13", pertanyaan: "Apa kepanjangan dari BUMDes?", pilihan: ["Badan Usaha Milik Desa", "Badan Usaha Mandiri Desa", "Badan Umum Masyarakat Desa"], jawaban: 0, sesi: 1 },
  { id: "s1-14", pertanyaan: "Hewan lambang negara Indonesia adalah...", pilihan: ["Komodo", "Burung Elang Jawa", "Garuda"], jawaban: 2, sesi: 1 },
  { id: "s1-15", pertanyaan: "Ibu kota provinsi Sumatera Selatan adalah...", pilihan: ["Jambi", "Bengkulu", "Palembang"], jawaban: 2, sesi: 1 },
  { id: "s1-16", pertanyaan: "Berapa hasil dari 25 + 37?", pilihan: ["52", "60", "62"], jawaban: 2, sesi: 1 },
  { id: "s1-17", pertanyaan: "Warna bendera Indonesia adalah...", pilihan: ["Merah putih biru", "Merah putih", "Merah putih hijau"], jawaban: 1, sesi: 1 },
  { id: "s1-18", pertanyaan: "Bahasa resmi negara Indonesia adalah...", pilihan: ["Jawa", "Melayu", "Indonesia"], jawaban: 2, sesi: 1 },
  { id: "s1-19", pertanyaan: "Gunung tertinggi di Indonesia adalah...", pilihan: ["Gunung Rinjani", "Gunung Kerinci", "Gunung Puncak Jaya"], jawaban: 2, sesi: 1 },
  { id: "s1-20", pertanyaan: "Siapa yang menulis lagu 'Halo-Halo Bandung'?", pilihan: ["W.R. Supratman", "Ismail Marzuki", "Kusbini"], jawaban: 1, sesi: 1 },
  { id: "s1-21", pertanyaan: "Berapa hari dalam bulan Februari tahun kabisat?", pilihan: ["27", "28", "29"], jawaban: 2, sesi: 1 },
  { id: "s1-22", pertanyaan: "Sungai terpanjang di Indonesia adalah...", pilihan: ["Sungai Kapuas", "Sungai Mahakam", "Sungai Musi"], jawaban: 0, sesi: 1 },
  { id: "s1-23", pertanyaan: "Apa nama rumah adat Sumatera Selatan?", pilihan: ["Rumah Gadang", "Rumah Limas", "Rumah Betang"], jawaban: 1, sesi: 1 },
  { id: "s1-24", pertanyaan: "Berapa hasil dari 100 ÷ 4?", pilihan: ["20", "25", "30"], jawaban: 1, sesi: 1 },
  { id: "s1-25", pertanyaan: "Lagu kebangsaan Indonesia adalah...", pilihan: ["Padamu Negeri", "Bagimu Negeri", "Indonesia Raya"], jawaban: 2, sesi: 1 },
  { id: "s1-26", pertanyaan: "Siapa yang menjadi presiden Indonesia ke-7?", pilihan: ["Susilo Bambang Yudhoyono", "Joko Widodo", "Megawati"], jawaban: 1, sesi: 1 },
  { id: "s1-27", pertanyaan: "Alat musik tradisional dari Jawa yang dipukul adalah...", pilihan: ["Angklung", "Gamelan", "Sasando"], jawaban: 1, sesi: 1 },
  { id: "s1-28", pertanyaan: "Berapa hasil dari 9 × 9?", pilihan: ["72", "79", "81"], jawaban: 2, sesi: 1 },
  { id: "s1-29", pertanyaan: "Indonesia terletak di antara dua samudra, yaitu...", pilihan: ["Atlantik dan Hindia", "Pasifik dan Hindia", "Arktik dan Pasifik"], jawaban: 1, sesi: 1 },
  { id: "s1-30", pertanyaan: "Makanan khas Sumatera Selatan yang terkenal adalah...", pilihan: ["Rendang", "Pempek", "Soto Banjar"], jawaban: 1, sesi: 1 },
  // Tambahan 30 soal
  { id: "s1-31", pertanyaan: "Berapa jumlah pulau di Indonesia (perkiraan)?", pilihan: ["13.000", "17.000", "22.000"], jawaban: 1, sesi: 1 },
  { id: "s1-32", pertanyaan: "Siapa presiden Indonesia ke-6?", pilihan: ["Susilo Bambang Yudhoyono", "Megawati", "Habibie"], jawaban: 0, sesi: 1 },
  { id: "s1-33", pertanyaan: "Gunung berapi paling aktif di Indonesia adalah...", pilihan: ["Gunung Merapi", "Gunung Bromo", "Gunung Krakatau"], jawaban: 0, sesi: 1 },
  { id: "s1-34", pertanyaan: "Berapa hasil dari 8 × 7?", pilihan: ["48", "56", "64"], jawaban: 1, sesi: 1 },
  { id: "s1-35", pertanyaan: "Ibu kota provinsi Jawa Barat adalah...", pilihan: ["Bandung", "Cirebon", "Bogor"], jawaban: 0, sesi: 1 },
  { id: "s1-36", pertanyaan: "Buah khas Indonesia yang berbau tajam adalah...", pilihan: ["Mangga", "Durian", "Rambutan"], jawaban: 1, sesi: 1 },
  { id: "s1-37", pertanyaan: "Berapa hasil dari 45 + 28?", pilihan: ["71", "73", "75"], jawaban: 1, sesi: 1 },
  { id: "s1-38", pertanyaan: "Apa kepanjangan dari TNI?", pilihan: ["Tentara Nasional Indonesia", "Tenaga Nasional Indonesia", "Tentara Negara Indonesia"], jawaban: 0, sesi: 1 },
  { id: "s1-39", pertanyaan: "Senjata tradisional dari Jawa adalah...", pilihan: ["Rencong", "Keris", "Mandau"], jawaban: 1, sesi: 1 },
  { id: "s1-40", pertanyaan: "Ibu kota provinsi Sulawesi Selatan adalah...", pilihan: ["Kendari", "Makassar", "Manado"], jawaban: 1, sesi: 1 },
  { id: "s1-41", pertanyaan: "Berapa hasil dari 3 × 15 + 5?", pilihan: ["45", "50", "55"], jawaban: 1, sesi: 1 },
  { id: "s1-42", pertanyaan: "Bangunan bersejarah yang menjadi ikon Jakarta adalah...", pilihan: ["Tugu Muda", "Monas", "Tugu Pahlawan"], jawaban: 1, sesi: 1 },
  { id: "s1-43", pertanyaan: "Tanaman penghasil minyak yang banyak ditanam di Sumatera adalah...", pilihan: ["Tebu", "Kelapa Sawit", "Karet"], jawaban: 1, sesi: 1 },
  { id: "s1-44", pertanyaan: "Berapa hasil dari 72 ÷ 8?", pilihan: ["8", "9", "10"], jawaban: 1, sesi: 1 },
  { id: "s1-45", pertanyaan: "Alat musik petik tradisional dari Kalimantan adalah...", pilihan: ["Kolintang", "Sape", "Angklung"], jawaban: 1, sesi: 1 },
  { id: "s1-46", pertanyaan: "Apa kepanjangan dari RT?", pilihan: ["Rukun Tetangga", "Rukun Terkecil", "Rukun Tempat"], jawaban: 0, sesi: 1 },
  { id: "s1-47", pertanyaan: "Berapa hasil dari 2 × 2 × 2 × 2?", pilihan: ["8", "12", "16"], jawaban: 2, sesi: 1 },
  { id: "s1-48", pertanyaan: "Pakaian tradisional perempuan Jawa adalah...", pilihan: ["Baju Bodo", "Kebaya", "Baju Kurung"], jawaban: 1, sesi: 1 },
  { id: "s1-49", pertanyaan: "Selat yang memisahkan Jawa dan Bali adalah...", pilihan: ["Selat Sunda", "Selat Bali", "Selat Lombok"], jawaban: 1, sesi: 1 },
  { id: "s1-50", pertanyaan: "Berapa hasil dari 13 × 4?", pilihan: ["48", "50", "52"], jawaban: 2, sesi: 1 },
  { id: "s1-51", pertanyaan: "Presiden Indonesia ke-5 adalah...", pilihan: ["Habibie", "Gus Dur", "Megawati"], jawaban: 2, sesi: 1 },
  { id: "s1-52", pertanyaan: "Ibu kota provinsi Sumatera Utara adalah...", pilihan: ["Pekanbaru", "Medan", "Padang"], jawaban: 1, sesi: 1 },
  { id: "s1-53", pertanyaan: "Berapa jumlah hari dalam bulan Oktober?", pilihan: ["29", "30", "31"], jawaban: 2, sesi: 1 },
  { id: "s1-54", pertanyaan: "Makanan khas Betawi adalah...", pilihan: ["Pempek", "Kerak Telor", "Gudeg"], jawaban: 1, sesi: 1 },
  { id: "s1-55", pertanyaan: "Berapa hasil dari 100 × 0?", pilihan: ["0", "10", "100"], jawaban: 0, sesi: 1 },
  { id: "s1-56", pertanyaan: "Ibu kota provinsi Sulawesi Utara adalah...", pilihan: ["Gorontalo", "Manado", "Palu"], jawaban: 1, sesi: 1 },
  { id: "s1-57", pertanyaan: "Tarian tradisional dari Papua adalah...", pilihan: ["Saman", "Serimpi", "Yospan"], jawaban: 2, sesi: 1 },
  { id: "s1-58", pertanyaan: "Berapa jumlah sisi segi delapan?", pilihan: ["6", "7", "8"], jawaban: 2, sesi: 1 },
  { id: "s1-59", pertanyaan: "Apa nama kerajinan khas Palembang terbuat dari benang emas?", pilihan: ["Tenun", "Ukiran", "Songket"], jawaban: 2, sesi: 1 },
  { id: "s1-60", pertanyaan: "Berapa hasil dari 6 + 6 × 6?", pilihan: ["72", "42", "36"], jawaban: 1, sesi: 1 },

  // ===== BABAK 2 (40 soal, ambil 20) =====
  { id: "s2-01", pertanyaan: "Siapa presiden Indonesia yang pertama kali dipilih langsung oleh rakyat?", pilihan: ["Megawati", "Habibie", "Susilo Bambang Yudhoyono"], jawaban: 2, sesi: 2 },
  { id: "s2-02", pertanyaan: "Kecamatan Keluang berada di kabupaten mana?", pilihan: ["Banyuasin", "Musi Banyuasin", "Ogan Ilir"], jawaban: 1, sesi: 2 },
  { id: "s2-03", pertanyaan: "Berapakah hasil dari 144 ÷ 12?", pilihan: ["10", "11", "12"], jawaban: 2, sesi: 2 },
  { id: "s2-04", pertanyaan: "Lagu 'Padamu Negeri' diciptakan oleh...", pilihan: ["W.R. Supratman", "Kusbini", "Ismail Marzuki"], jawaban: 1, sesi: 2 },
  { id: "s2-05", pertanyaan: "Proklamasi kemerdekaan Indonesia dibacakan di...", pilihan: ["Istana Merdeka, Jakarta", "Lapangan Ikada, Jakarta", "Jl. Pegangsaan Timur No. 56, Jakarta"], jawaban: 2, sesi: 2 },
  { id: "s2-06", pertanyaan: "Program bantuan sosial tunai bersyarat pemerintah untuk keluarga miskin adalah...", pilihan: ["PKH", "BPJS", "KIP"], jawaban: 0, sesi: 2 },
  { id: "s2-07", pertanyaan: "Berapa lama masa jabatan kepala desa menurut UU Desa No. 6 Tahun 2014?", pilihan: ["4 tahun", "5 tahun", "6 tahun"], jawaban: 2, sesi: 2 },
  { id: "s2-08", pertanyaan: "Planet yang paling dekat dengan Matahari adalah...", pilihan: ["Venus", "Mars", "Merkurius"], jawaban: 2, sesi: 2 },
  { id: "s2-09", pertanyaan: "Berapa jumlah tulang pada tubuh manusia dewasa?", pilihan: ["186", "196", "206"], jawaban: 2, sesi: 2 },
  { id: "s2-10", pertanyaan: "Tarian tradisional dari Aceh yang terkenal adalah...", pilihan: ["Saman", "Jaipong", "Kecak"], jawaban: 0, sesi: 2 },
  { id: "s2-11", pertanyaan: "Berapakah hasil dari 17 × 13?", pilihan: ["201", "211", "221"], jawaban: 2, sesi: 2 },
  { id: "s2-12", pertanyaan: "Sidang yang menghasilkan Pancasila sebagai dasar negara adalah...", pilihan: ["BPUPKI", "PPKI", "Konstituante"], jawaban: 0, sesi: 2 },
  { id: "s2-13", pertanyaan: "Kain tradisional khas Palembang adalah...", pilihan: ["Batik Mega Mendung", "Songket Palembang", "Ulos Batak"], jawaban: 1, sesi: 2 },
  { id: "s2-14", pertanyaan: "Berapa persen kandungan oksigen di udara?", pilihan: ["10%", "21%", "30%"], jawaban: 1, sesi: 2 },
  { id: "s2-15", pertanyaan: "Sila ke-3 Pancasila berbunyi...", pilihan: ["Kemanusiaan yang adil dan beradab", "Kerakyatan yang dipimpin oleh hikmat", "Persatuan Indonesia"], jawaban: 2, sesi: 2 },
  { id: "s2-16", pertanyaan: "Apa kepanjangan dari SKTM dalam administrasi desa?", pilihan: ["Surat Keterangan Tidak Mampu", "Surat Keputusan Tata Masyarakat", "Surat Keterangan Tanah Masyarakat"], jawaban: 0, sesi: 2 },
  { id: "s2-17", pertanyaan: "Berapa hasil dari 250 + 175 - 80?", pilihan: ["325", "335", "345"], jawaban: 2, sesi: 2 },
  { id: "s2-18", pertanyaan: "Negara yang berbatasan langsung dengan Indonesia di Kalimantan adalah...", pilihan: ["Malaysia saja", "Brunei saja", "Malaysia dan Brunei"], jawaban: 2, sesi: 2 },
  { id: "s2-19", pertanyaan: "Sistem pemerintahan Indonesia adalah...", pilihan: ["Monarki", "Parlementer", "Presidensial"], jawaban: 2, sesi: 2 },
  { id: "s2-20", pertanyaan: "Luas wilayah daratan Indonesia sekitar...", pilihan: ["1,9 juta km²", "3,2 juta km²", "5,2 juta km²"], jawaban: 0, sesi: 2 },
  // Tambahan 20 soal babak 2
  { id: "s2-21", pertanyaan: "Sungai yang membelah kota Palembang adalah...", pilihan: ["Sungai Ogan", "Sungai Musi", "Sungai Komering"], jawaban: 1, sesi: 2 },
  { id: "s2-22", pertanyaan: "Berapa hasil dari 18 × 7 - 26?", pilihan: ["90", "100", "110"], jawaban: 1, sesi: 2 },
  { id: "s2-23", pertanyaan: "Pahlawan nasional dari Sulawesi Selatan adalah...", pilihan: ["Sultan Hasanuddin", "Teuku Umar", "Pangeran Antasari"], jawaban: 0, sesi: 2 },
  { id: "s2-24", pertanyaan: "Provinsi dengan julukan 'Bumi Sriwijaya' adalah...", pilihan: ["Jambi", "Sumatera Selatan", "Lampung"], jawaban: 1, sesi: 2 },
  { id: "s2-25", pertanyaan: "Presiden Indonesia ke-4 adalah...", pilihan: ["Megawati", "Abdurrahman Wahid", "Habibie"], jawaban: 1, sesi: 2 },
  { id: "s2-26", pertanyaan: "Berapa persen bila menabung Rp450.000 dari gaji Rp3.000.000?", pilihan: ["10%", "12,5%", "15%"], jawaban: 2, sesi: 2 },
  { id: "s2-27", pertanyaan: "Bank sentral Indonesia adalah...", pilihan: ["BCA", "Bank Indonesia", "BRI"], jawaban: 1, sesi: 2 },
  { id: "s2-28", pertanyaan: "Berapa hasil dari 3/5 dari 400?", pilihan: ["200", "240", "280"], jawaban: 1, sesi: 2 },
  { id: "s2-29", pertanyaan: "Penyakit paru-paru yang disebabkan oleh bakteri adalah...", pilihan: ["DBD", "Tuberkulosis (TBC)", "Malaria"], jawaban: 1, sesi: 2 },
  { id: "s2-30", pertanyaan: "Masa jabatan bupati/walikota di Indonesia adalah...", pilihan: ["4 tahun", "5 tahun", "6 tahun"], jawaban: 1, sesi: 2 },
  { id: "s2-31", pertanyaan: "Berapa hasil dari √225?", pilihan: ["13", "14", "15"], jawaban: 2, sesi: 2 },
  { id: "s2-32", pertanyaan: "Program kartu untuk peserta didik kurang mampu adalah...", pilihan: ["PKH", "KIP (Kartu Indonesia Pintar)", "BLT"], jawaban: 1, sesi: 2 },
  { id: "s2-33", pertanyaan: "Cabang olahraga yang paling berprestasi Indonesia di Olimpiade adalah...", pilihan: ["Sepakbola", "Bulu Tangkis", "Renang"], jawaban: 1, sesi: 2 },
  { id: "s2-34", pertanyaan: "Berapa jumlah anggota DPD RI dari setiap provinsi?", pilihan: ["2", "4", "6"], jawaban: 1, sesi: 2 },
  { id: "s2-35", pertanyaan: "Berapa hasil dari 2,5 × 1,2?", pilihan: ["2,8", "3,0", "3,2"], jawaban: 1, sesi: 2 },
  { id: "s2-36", pertanyaan: "Organisasi PBB yang menangani kesehatan dunia adalah...", pilihan: ["UNICEF", "WHO", "UNESCO"], jawaban: 1, sesi: 2 },
  { id: "s2-37", pertanyaan: "Apa kepanjangan ADD di pemerintahan desa?", pilihan: ["Alokasi Dana Desa", "Anggaran Dana Desa", "Alokasi Dana Daerah"], jawaban: 0, sesi: 2 },
  { id: "s2-38", pertanyaan: "Berapa hasil dari 12% dari Rp500.000?", pilihan: ["Rp50.000", "Rp60.000", "Rp70.000"], jawaban: 1, sesi: 2 },
  { id: "s2-39", pertanyaan: "Wayang yang terbuat dari kulit dimainkan dengan bayangan adalah...", pilihan: ["Wayang Golek", "Wayang Kulit", "Wayang Wong"], jawaban: 1, sesi: 2 },
  { id: "s2-40", pertanyaan: "Berapa lama masa jabatan anggota DPR Indonesia?", pilihan: ["4 tahun", "5 tahun", "6 tahun"], jawaban: 1, sesi: 2 },

  // ===== BABAK 3 (20 soal, ambil 10) =====
  { id: "s3-01", pertanyaan: "Siapa yang menulis lagu kebangsaan 'Indonesia Raya'?", pilihan: ["Kusbini", "W.R. Supratman", "Chairil Anwar"], jawaban: 1, sesi: 3 },
  { id: "s3-02", pertanyaan: "Berapa persen dana desa wajib untuk ketahanan pangan mulai 2023?", pilihan: ["10%", "15%", "20%"], jawaban: 2, sesi: 3 },
  { id: "s3-03", pertanyaan: "Luas sawah 3,5 ha, produksi 4,8 ton/ha, berapa total panen?", pilihan: ["15,4 ton", "16,4 ton", "16,8 ton"], jawaban: 2, sesi: 3 },
  { id: "s3-04", pertanyaan: "Perjanjian yang mengakui kedaulatan Indonesia 27 Desember 1949 adalah...", pilihan: ["Perjanjian Renville", "Perjanjian Linggajati", "KMB (Konferensi Meja Bundar)"], jawaban: 2, sesi: 3 },
  { id: "s3-05", pertanyaan: "Berapakah nilai akar kuadrat dari 625?", pilihan: ["20", "23", "25"], jawaban: 2, sesi: 3 },
  { id: "s3-06", pertanyaan: "UU yang mengatur tentang desa di Indonesia adalah...", pilihan: ["UU No. 5 Tahun 1979", "UU No. 22 Tahun 1999", "UU No. 6 Tahun 2014"], jawaban: 2, sesi: 3 },
  { id: "s3-07", pertanyaan: "Berapa hasil dari 2³ + 3² + 4¹?", pilihan: ["19", "21", "23"], jawaban: 1, sesi: 3 },
  { id: "s3-08", pertanyaan: "Pahlawan nasional dari Sumatera Selatan yang berjuang melawan Belanda adalah...", pilihan: ["Cut Nyak Dien", "Sultan Mahmud Badaruddin II", "Teuku Umar"], jawaban: 1, sesi: 3 },
  { id: "s3-09", pertanyaan: "Kecepatan motor 60 km/jam, berapa km dalam 2,5 jam?", pilihan: ["120 km", "140 km", "150 km"], jawaban: 2, sesi: 3 },
  { id: "s3-10", pertanyaan: "Sumber utama pendanaan desa dari pemerintah pusat adalah...", pilihan: ["Dana Desa", "APBN Desa", "PNPM Mandiri"], jawaban: 0, sesi: 3 },
  // Tambahan 10 soal babak 3
  { id: "s3-11", pertanyaan: "Berapa hasil dari (2+3)³?", pilihan: ["100", "125", "150"], jawaban: 1, sesi: 3 },
  { id: "s3-12", pertanyaan: "Lembaga yang menguji undang-undang di Indonesia adalah...", pilihan: ["Mahkamah Agung", "Mahkamah Konstitusi", "Komisi Yudisial"], jawaban: 1, sesi: 3 },
  { id: "s3-13", pertanyaan: "Berapa persen APBN yang diwajibkan untuk pendidikan?", pilihan: ["10%", "20%", "30%"], jawaban: 1, sesi: 3 },
  { id: "s3-14", pertanyaan: "Penyakit yang disebabkan kekurangan vitamin C adalah...", pilihan: ["Rabun Senja", "Skorbut", "Rakitis"], jawaban: 1, sesi: 3 },
  { id: "s3-15", pertanyaan: "KPK dari 15, 20, dan 25 adalah...", pilihan: ["100", "150", "300"], jawaban: 2, sesi: 3 },
  { id: "s3-16", pertanyaan: "ROI setahun jika modal Rp10 juta dan laba Rp800.000/bulan adalah...", pilihan: ["86%", "96%", "100%"], jawaban: 1, sesi: 3 },
  { id: "s3-17", pertanyaan: "Asas yang menyatakan warga negara berkedudukan sama di hadapan hukum adalah...", pilihan: ["Asas Legalitas", "Equality before the law", "Presumption of Innocence"], jawaban: 1, sesi: 3 },
  { id: "s3-18", pertanyaan: "Sidang BPUPKI lanjutan yang membahas rancangan UUD berlangsung pada...", pilihan: ["28 Mei – 1 Juni 1945", "10–17 Juli 1945", "18 Agustus 1945"], jawaban: 1, sesi: 3 },
  { id: "s3-19", pertanyaan: "Berapa hasil dari 5% dari Rp4.000.000?", pilihan: ["Rp150.000", "Rp200.000", "Rp250.000"], jawaban: 1, sesi: 3 },
  { id: "s3-20", pertanyaan: "Apa kepanjangan RPJM Desa?", pilihan: ["Rencana Pelaksanaan Jasa Masyarakat", "Rencana Pembangunan Jangka Menengah Desa", "Rencana Pengelolaan Jalan Milik Desa"], jawaban: 1, sesi: 3 },

  // ===== BABAK 4 (20 soal, ambil 8) =====
  { id: "s4-01", pertanyaan: "KPK dari 12 dan 18 adalah...", pilihan: ["24", "36", "48"], jawaban: 1, sesi: 4 },
  { id: "s4-02", pertanyaan: "Siapa yang menandatangani naskah Proklamasi Indonesia?", pilihan: ["Soekarno saja", "Soekarno dan Hatta", "Soekarno, Hatta, dan Subardjo"], jawaban: 1, sesi: 4 },
  { id: "s4-03", pertanyaan: "Apa kepanjangan BPD dalam pemerintahan desa?", pilihan: ["Badan Permusyawaratan Desa", "Badan Pengelola Dana", "Badan Perwakilan Daerah"], jawaban: 0, sesi: 4 },
  { id: "s4-04", pertanyaan: "Luas permukaan kubus dengan sisi 5 cm adalah...", pilihan: ["75 cm²", "125 cm²", "150 cm²"], jawaban: 2, sesi: 4 },
  { id: "s4-05", pertanyaan: "Berapa hasil dari 3/4 + 5/6?", pilihan: ["1 7/12", "1 1/2", "1 5/12"], jawaban: 0, sesi: 4 },
  { id: "s4-06", pertanyaan: "Operasi militer Indonesia untuk merebut Irian Barat adalah...", pilihan: ["Operasi Dwikora", "Operasi Trikora", "Operasi Seroja"], jawaban: 1, sesi: 4 },
  { id: "s4-07", pertanyaan: "Kebun persegi panjang 120 m × 80 m. Berapa kelilingnya?", pilihan: ["200 m", "400 m", "9.600 m"], jawaban: 1, sesi: 4 },
  { id: "s4-08", pertanyaan: "Dokumen rencana pembangunan jangka menengah di desa adalah...", pilihan: ["RPJM Desa", "APBD Desa", "Peraturan Desa"], jawaban: 0, sesi: 4 },
  { id: "s4-09", pertanyaan: "PPN yang berlaku di Indonesia sejak 2022 adalah...", pilihan: ["10%", "11%", "12%"], jawaban: 1, sesi: 4 },
  { id: "s4-10", pertanyaan: "FPB dari 72 dan 108 adalah...", pilihan: ["18", "36", "54"], jawaban: 1, sesi: 4 },
  { id: "s4-11", pertanyaan: "Jumlah anggota DPR RI saat ini adalah...", pilihan: ["500", "575", "600"], jawaban: 1, sesi: 4 },
  { id: "s4-12", pertanyaan: "Total sudut interior segi lima beraturan adalah...", pilihan: ["450°", "540°", "630°"], jawaban: 1, sesi: 4 },
  { id: "s4-13", pertanyaan: "Berapa hasil dari (3+√9)³ - 2⁴?", pilihan: ["180", "200", "216"], jawaban: 1, sesi: 4 },
  { id: "s4-14", pertanyaan: "Inflasi 5%/tahun, harga barang Rp100.000 setelah 3 tahun menjadi...", pilihan: ["Rp115.000", "Rp115.762", "Rp116.000"], jawaban: 1, sesi: 4 },
  { id: "s4-15", pertanyaan: "Hukum Newton III menyatakan...", pilihan: ["Benda diam tetap diam", "Gaya = massa × percepatan", "Setiap aksi ada reaksi yang sama besar"], jawaban: 2, sesi: 4 },
  { id: "s4-16", pertanyaan: "Panjang diagonal persegi dengan sisi 10 cm adalah...", pilihan: ["10√2 cm (≈14,1 cm)", "15 cm", "20 cm"], jawaban: 0, sesi: 4 },
  { id: "s4-17", pertanyaan: "Apa kepanjangan BPJS?", pilihan: ["Badan Penyelenggara Jaminan Sosial", "Badan Perlindungan Jasa Sosial", "Badan Pendanaan Jaminan Sosial"], jawaban: 0, sesi: 4 },
  { id: "s4-18", pertanyaan: "Berapa nilai x jika 2x² - 8 = 0?", pilihan: ["x = ±2", "x = ±4", "x = 2"], jawaban: 0, sesi: 4 },
  { id: "s4-19", pertanyaan: "Volume kerucut r=7cm, t=12cm adalah... (π=22/7)", pilihan: ["616 cm³", "924 cm³", "1.232 cm³"], jawaban: 0, sesi: 4 },
  { id: "s4-20", pertanyaan: "Sensus penduduk di Indonesia diadakan setiap...", pilihan: ["5 tahun", "10 tahun", "15 tahun"], jawaban: 1, sesi: 4 },

  // ===== BABAK 5 FINAL (12 soal, ambil 5) =====
  { id: "s5-01", pertanyaan: "Pasal UUD 1945 yang mengatur Hak Asasi Manusia adalah...", pilihan: ["Pasal 27-34", "Pasal 28A-28J", "Pasal 30-37"], jawaban: 1, sesi: 5 },
  { id: "s5-02", pertanyaan: "Jumlah minimal KK untuk mendirikan desa baru adalah...", pilihan: ["200 KK", "500 KK", "100 KK"], jawaban: 0, sesi: 5 },
  { id: "s5-03", pertanyaan: "Luas lingkaran r=7cm adalah... (π=22/7)", pilihan: ["44 cm²", "154 cm²", "308 cm²"], jawaban: 1, sesi: 5 },
  { id: "s5-04", pertanyaan: "Lembaga yang mengawasi keuangan negara Indonesia adalah...", pilihan: ["KPK", "BPK", "OJK"], jawaban: 1, sesi: 5 },
  { id: "s5-05", pertanyaan: "Berapa hasil dari (√144 × √25) + 5²?", pilihan: ["75", "80", "85"], jawaban: 2, sesi: 5 },
  { id: "s5-06", pertanyaan: "Tokoh yang digelari 'Bapak Koperasi Indonesia' adalah...", pilihan: ["Soekarno", "Mohammad Hatta", "Sri Sultan Hamengkubuwono IX"], jawaban: 1, sesi: 5 },
  { id: "s5-07", pertanyaan: "Berapa hasil dari 2⁵ × 3²?", pilihan: ["256", "288", "320"], jawaban: 1, sesi: 5 },
  { id: "s5-08", pertanyaan: "Nilai dari sin²(30°) + cos²(30°) adalah...", pilihan: ["0,5", "1", "1,5"], jawaban: 1, sesi: 5 },
  { id: "s5-09", pertanyaan: "Anggaran desa Rp2 miliar, 30% untuk infrastruktur. Berapa anggarannya?", pilihan: ["Rp400 juta", "Rp600 juta", "Rp800 juta"], jawaban: 1, sesi: 5 },
  { id: "s5-10", pertanyaan: "Laporan pertanggungjawaban kepala desa kepada BPD disebut...", pilihan: ["Pertanggungjawaban", "LKPJ", "Musyawarah Desa"], jawaban: 1, sesi: 5 },
  { id: "s5-11", pertanyaan: "Berapa banyak bilangan prima antara 1 dan 30?", pilihan: ["8", "10", "12"], jawaban: 1, sesi: 5 },
  { id: "s5-12", pertanyaan: "Komoditas ekspor utama Kabupaten Musi Banyuasin adalah...", pilihan: ["Kelapa Sawit", "Minyak Bumi dan Gas Alam", "Batu Bara"], jawaban: 1, sesi: 5 },
];

// =========================================================
// SOAL SOLO — 5 PAKET × 3 TINGKAT × 10 SOAL = 150 SOAL
// =========================================================
export const bankSoalSolo: SoalSolo[] = [

  // ===== PAKET 1: 🎲 CAMPURAN (15 mudah, 15 sedang, 15 sulit) =====
  { id: "p1-m01", pertanyaan: "Siapa presiden Indonesia ke-8 (2024–2029)?", pilihan: ["Joko Widodo", "Prabowo Subianto", "Anies Baswedan"], jawaban: 1, tingkat: "mudah", paket: 1 },
  { id: "p1-m02", pertanyaan: "Berapa hasil dari 7 + 8 × 2?", pilihan: ["30", "22", "23"], jawaban: 2, tingkat: "mudah", paket: 1 },
  { id: "p1-m03", pertanyaan: "Desa Mekar Sari berada di kecamatan...", pilihan: ["Bayung Lencir", "Keluang", "Sungai Lilin"], jawaban: 1, tingkat: "mudah", paket: 1 },
  { id: "p1-m04", pertanyaan: "Apa warna dasar bendera Indonesia?", pilihan: ["Merah-Putih", "Merah-Putih-Biru", "Merah-Putih-Hijau"], jawaban: 0, tingkat: "mudah", paket: 1 },
  { id: "p1-m05", pertanyaan: "Berapa hasil dari 50 - 17?", pilihan: ["30", "33", "37"], jawaban: 1, tingkat: "mudah", paket: 1 },
  { id: "p1-m06", pertanyaan: "Hari kemerdekaan Indonesia diperingati setiap tanggal...", pilihan: ["17 Juli", "17 Agustus", "17 September"], jawaban: 1, tingkat: "mudah", paket: 1 },
  { id: "p1-m07", pertanyaan: "Makanan khas Sumatera Selatan yang terbuat dari ikan adalah...", pilihan: ["Rendang", "Pempek", "Gudeg"], jawaban: 1, tingkat: "mudah", paket: 1 },
  { id: "p1-m08", pertanyaan: "Berapa kaki yang dimiliki seekor laba-laba?", pilihan: ["6", "8", "10"], jawaban: 1, tingkat: "mudah", paket: 1 },
  { id: "p1-m09", pertanyaan: "Planet terbesar dalam tata surya adalah...", pilihan: ["Saturnus", "Yupiter", "Uranus"], jawaban: 1, tingkat: "mudah", paket: 1 },
  { id: "p1-m10", pertanyaan: "Berapa hasil dari 12 × 12?", pilihan: ["120", "144", "132"], jawaban: 1, tingkat: "mudah", paket: 1 },
  { id: "p1-m11", pertanyaan: "Samudra di sebelah barat Indonesia adalah...", pilihan: ["Samudra Pasifik", "Samudra Hindia", "Samudra Atlantik"], jawaban: 1, tingkat: "mudah", paket: 1 },
  { id: "p1-m12", pertanyaan: "Berapa jumlah hari dalam satu tahun biasa?", pilihan: ["354", "365", "366"], jawaban: 1, tingkat: "mudah", paket: 1 },
  { id: "p1-m13", pertanyaan: "Hewan yang hanya ada di Indonesia bagian timur dan dilindungi adalah...", pilihan: ["Harimau Sumatera", "Komodo", "Orangutan"], jawaban: 1, tingkat: "mudah", paket: 1 },
  { id: "p1-m14", pertanyaan: "Berapa hasil dari 200 ÷ 8?", pilihan: ["20", "25", "30"], jawaban: 1, tingkat: "mudah", paket: 1 },
  { id: "p1-m15", pertanyaan: "Ibu kota Indonesia yang lama adalah...", pilihan: ["Bandung", "Jakarta", "Yogyakarta"], jawaban: 1, tingkat: "mudah", paket: 1 },

  { id: "p1-s01", pertanyaan: "Berapa 15% dari Rp200.000?", pilihan: ["Rp25.000", "Rp30.000", "Rp35.000"], jawaban: 1, tingkat: "sedang", paket: 1 },
  { id: "p1-s02", pertanyaan: "Siapa Wakil Presiden Indonesia 2024–2029?", pilihan: ["Mahfud MD", "Gibran Rakabuming Raka", "Ma'ruf Amin"], jawaban: 1, tingkat: "sedang", paket: 1 },
  { id: "p1-s03", pertanyaan: "Apa kepanjangan NPWP?", pilihan: ["Nomor Pokok Warga Pajak", "Nomor Pokok Wajib Pajak", "Nomor Pajak Warga Pemukiman"], jawaban: 1, tingkat: "sedang", paket: 1 },
  { id: "p1-s04", pertanyaan: "Berapa tahun sekali pemilihan umum presiden di Indonesia?", pilihan: ["4 tahun", "5 tahun", "6 tahun"], jawaban: 1, tingkat: "sedang", paket: 1 },
  { id: "p1-s05", pertanyaan: "Jumlah sudut dalam segitiga adalah...", pilihan: ["90°", "180°", "360°"], jawaban: 1, tingkat: "sedang", paket: 1 },
  { id: "p1-s06", pertanyaan: "Masa jabatan anggota DPR Indonesia adalah...", pilihan: ["4 tahun", "5 tahun", "6 tahun"], jawaban: 1, tingkat: "sedang", paket: 1 },
  { id: "p1-s07", pertanyaan: "'Swasembada pangan' artinya...", pilihan: ["Impor pangan dari luar", "Mencukupi kebutuhan pangan sendiri", "Ekspor pangan ke luar negeri"], jawaban: 1, tingkat: "sedang", paket: 1 },
  { id: "p1-s08", pertanyaan: "Berapa 3/5 dari 150?", pilihan: ["75", "80", "90"], jawaban: 2, tingkat: "sedang", paket: 1 },
  { id: "p1-s09", pertanyaan: "Lembaga yang menerbitkan KTP adalah...", pilihan: ["Kantor Kelurahan", "Dukcapil", "Kantor Imigrasi"], jawaban: 1, tingkat: "sedang", paket: 1 },
  { id: "p1-s10", pertanyaan: "Keliling lingkaran r=7 cm adalah... (π=22/7)", pilihan: ["44 cm", "22 cm", "88 cm"], jawaban: 0, tingkat: "sedang", paket: 1 },
  { id: "p1-s11", pertanyaan: "Penyakit yang disebabkan nyamuk Aedes aegypti adalah...", pilihan: ["Malaria", "Demam Berdarah (DBD)", "Tipes"], jawaban: 1, tingkat: "sedang", paket: 1 },
  { id: "p1-s12", pertanyaan: "Berapa hasil dari 18² - 15²?", pilihan: ["89", "99", "109"], jawaban: 1, tingkat: "sedang", paket: 1 },
  { id: "p1-s13", pertanyaan: "Program kredit modal usaha untuk masyarakat kecil adalah...", pilihan: ["UMKM Mandiri", "KUR (Kredit Usaha Rakyat)", "BLT"], jawaban: 1, tingkat: "sedang", paket: 1 },
  { id: "p1-s14", pertanyaan: "Sila ke-4 Pancasila berbunyi...", pilihan: ["Persatuan Indonesia", "Kerakyatan yang dipimpin oleh hikmat...", "Keadilan sosial bagi seluruh rakyat"], jawaban: 1, tingkat: "sedang", paket: 1 },
  { id: "p1-s15", pertanyaan: "Jumlah kabupaten/kota di Sumatera Selatan adalah...", pilihan: ["13", "17", "15"], jawaban: 1, tingkat: "sedang", paket: 1 },

  { id: "p1-u01", pertanyaan: "Persentase kenaikan dari Rp800.000 ke Rp1.000.000 adalah...", pilihan: ["20%", "25%", "30%"], jawaban: 1, tingkat: "sulit", paket: 1 },
  { id: "p1-u02", pertanyaan: "Berapa hasil dari 2⁵ × 3²?", pilihan: ["256", "288", "320"], jawaban: 1, tingkat: "sulit", paket: 1 },
  { id: "p1-u03", pertanyaan: "FPB dari 84 dan 120 adalah...", pilihan: ["12", "24", "36"], jawaban: 0, tingkat: "sulit", paket: 1 },
  { id: "p1-u04", pertanyaan: "Tokoh yang bergelar 'Bapak Koperasi Indonesia' adalah...", pilihan: ["Soekarno", "Mohammad Hatta", "Djuanda"], jawaban: 1, tingkat: "sulit", paket: 1 },
  { id: "p1-u05", pertanyaan: "Tabungan Rp5 juta bunga 6%/tahun, setelah 2 tahun (bunga sederhana)...", pilihan: ["Rp5.600.000", "Rp5.618.000", "Rp5.300.000"], jawaban: 0, tingkat: "sulit", paket: 1 },
  { id: "p1-u06", pertanyaan: "Apa kepanjangan RPJM Desa?", pilihan: ["Rencana Pelaksanaan Jasa Masyarakat", "Rencana Pembangunan Jangka Menengah Desa", "Rencana Pengelolaan Jalan Milik Desa"], jawaban: 1, tingkat: "sulit", paket: 1 },
  { id: "p1-u07", pertanyaan: "Berapa hasil dari log₁₀(1000)?", pilihan: ["2", "3", "4"], jawaban: 1, tingkat: "sulit", paket: 1 },
  { id: "p1-u08", pertanyaan: "Penemu vaksin cacar pertama kali adalah...", pilihan: ["Louis Pasteur", "Edward Jenner", "Alexander Fleming"], jawaban: 1, tingkat: "sulit", paket: 1 },
  { id: "p1-u09", pertanyaan: "Jumlah sudut dalam segi enam beraturan adalah...", pilihan: ["540°", "720°", "900°"], jawaban: 1, tingkat: "sulit", paket: 1 },
  { id: "p1-u10", pertanyaan: "Perjanjian yang mengakhiri konfrontasi Indonesia-Malaysia (1966) adalah...", pilihan: ["Perjanjian Bangkok", "Perjanjian Jakarta", "Perjanjian Kuala Lumpur"], jawaban: 0, tingkat: "sulit", paket: 1 },
  { id: "p1-u11", pertanyaan: "Jika p=3 dan q=4, berapa nilai 2p² + 3q?", pilihan: ["28", "30", "34"], jawaban: 1, tingkat: "sulit", paket: 1 },
  { id: "p1-u12", pertanyaan: "UUD 1945 disahkan pada tanggal...", pilihan: ["17 Agustus 1945", "18 Agustus 1945", "1 Juni 1945"], jawaban: 1, tingkat: "sulit", paket: 1 },
  { id: "p1-u13", pertanyaan: "Luas permukaan bola r=7 cm adalah... (π=22/7)", pilihan: ["154 cm²", "616 cm²", "308 cm²"], jawaban: 1, tingkat: "sulit", paket: 1 },
  { id: "p1-u14", pertanyaan: "Pengawas sektor keuangan (bank, asuransi, pasar modal) adalah...", pilihan: ["BI (Bank Indonesia)", "OJK (Otoritas Jasa Keuangan)", "BPK"], jawaban: 1, tingkat: "sulit", paket: 1 },
  { id: "p1-u15", pertanyaan: "Berapa hasil dari KPK(15, 20, 30)?", pilihan: ["30", "60", "90"], jawaban: 1, tingkat: "sulit", paket: 1 },

  // ===== PAKET 2: 🏛️ SEJARAH & PAHLAWAN =====
  { id: "p2-m01", pertanyaan: "Siapa yang membacakan teks Proklamasi kemerdekaan Indonesia?", pilihan: ["Mohammad Hatta", "Soekarno", "Ahmad Subardjo"], jawaban: 1, tingkat: "mudah", paket: 2 },
  { id: "p2-m02", pertanyaan: "Kapan peristiwa Sumpah Pemuda?", pilihan: ["20 Mei 1908", "28 Oktober 1928", "17 Agustus 1945"], jawaban: 1, tingkat: "mudah", paket: 2 },
  { id: "p2-m03", pertanyaan: "Pahlawan yang berjuang untuk emansipasi wanita Indonesia adalah...", pilihan: ["Cut Nyak Dien", "R.A. Kartini", "Martha Christina Tiahahu"], jawaban: 1, tingkat: "mudah", paket: 2 },
  { id: "p2-m04", pertanyaan: "Soekarno dan Hatta dibawa para pemuda ke mana sebelum proklamasi?", pilihan: ["Bandung", "Rengasdengklok", "Yogyakarta"], jawaban: 1, tingkat: "mudah", paket: 2 },
  { id: "p2-m05", pertanyaan: "Organisasi nasional pertama Indonesia yang berdiri pada 1908 adalah...", pilihan: ["Sarekat Islam", "Budi Utomo", "Indische Partij"], jawaban: 1, tingkat: "mudah", paket: 2 },
  { id: "p2-m06", pertanyaan: "Siapa yang menulis buku 'Habis Gelap Terbitlah Terang'?", pilihan: ["Dewi Sartika", "R.A. Kartini", "Moh. Yamin"], jawaban: 1, tingkat: "mudah", paket: 2 },
  { id: "p2-m07", pertanyaan: "Hari Pahlawan Nasional Indonesia diperingati setiap tanggal...", pilihan: ["10 Oktober", "10 November", "28 Oktober"], jawaban: 1, tingkat: "mudah", paket: 2 },
  { id: "p2-m08", pertanyaan: "Pahlawan wanita yang berjuang melawan Belanda di Aceh adalah...", pilihan: ["Cut Nyak Dien", "R.A. Kartini", "Nyi Ageng Serang"], jawaban: 0, tingkat: "mudah", paket: 2 },
  { id: "p2-m09", pertanyaan: "Berapa lama (kira-kira) Indonesia dijajah Belanda?", pilihan: ["200 tahun", "300 tahun", "350 tahun"], jawaban: 2, tingkat: "mudah", paket: 2 },
  { id: "p2-m10", pertanyaan: "Pendiri pesantren dan pahlawan nasional dari Jawa Timur adalah...", pilihan: ["K.H. Ahmad Dahlan", "K.H. Hasyim Asy'ari", "Kiai Mojo"], jawaban: 1, tingkat: "mudah", paket: 2 },

  { id: "p2-s01", pertanyaan: "Siapa tokoh yang merumuskan Pancasila pada 1 Juni 1945?", pilihan: ["Soepomo", "Moh. Yamin", "Soekarno"], jawaban: 2, tingkat: "sedang", paket: 2 },
  { id: "p2-s02", pertanyaan: "Berapa lama Perang Diponegoro berlangsung?", pilihan: ["3 tahun", "5 tahun", "7 tahun"], jawaban: 1, tingkat: "sedang", paket: 2 },
  { id: "p2-s03", pertanyaan: "Presiden RI ke-3 adalah...", pilihan: ["Megawati", "Habibie", "Gus Dur"], jawaban: 1, tingkat: "sedang", paket: 2 },
  { id: "p2-s04", pertanyaan: "Sistem yang memaksa rakyat menanam tanaman ekspor untuk Belanda adalah...", pilihan: ["Kerja Rodi", "Tanam Paksa", "Sewa Tanah"], jawaban: 1, tingkat: "sedang", paket: 2 },
  { id: "p2-s05", pertanyaan: "Pahlawan yang dikenal sebagai 'Bung Tomo' yang berjuang di Surabaya adalah...", pilihan: ["Sutomo", "Soedjono", "Mohammad Toha"], jawaban: 0, tingkat: "sedang", paket: 2 },
  { id: "p2-s06", pertanyaan: "PM Indonesia pertama adalah...", pilihan: ["Djuanda Kartawidjaja", "Sutan Syahrir", "Hatta"], jawaban: 1, tingkat: "sedang", paket: 2 },
  { id: "p2-s07", pertanyaan: "Peristiwa pemberontakan komunis di Indonesia pada 1965 adalah...", pilihan: ["PRRI", "G30S/PKI", "DI/TII"], jawaban: 1, tingkat: "sedang", paket: 2 },
  { id: "p2-s08", pertanyaan: "Presiden Indonesia ke-4 adalah...", pilihan: ["Megawati", "Habibie", "Abdurrahman Wahid"], jawaban: 2, tingkat: "sedang", paket: 2 },
  { id: "p2-s09", pertanyaan: "Isi Sumpah Pemuda yang ke-3 adalah...", pilihan: ["Bertanah air satu", "Berbangsa satu", "Menjunjung bahasa persatuan Indonesia"], jawaban: 2, tingkat: "sedang", paket: 2 },
  { id: "p2-s10", pertanyaan: "Tokoh yang dikenal sebagai 'Bapak Pendidikan Indonesia' adalah...", pilihan: ["Wahidin Sudirohusodo", "Ki Hajar Dewantara", "Mohammad Syafei"], jawaban: 1, tingkat: "sedang", paket: 2 },

  { id: "p2-u01", pertanyaan: "Ketua BPUPKI yang bertugas merumuskan dasar negara adalah...", pilihan: ["Soepomo", "Radjiman Wedyodiningrat", "Moh. Yamin"], jawaban: 1, tingkat: "sulit", paket: 2 },
  { id: "p2-u02", pertanyaan: "Operasi militer Belanda yang menyerang Indonesia pada 21 Juli 1947 adalah...", pilihan: ["Agresi Militer I", "Operasi Kraai", "Agresi Militer II"], jawaban: 0, tingkat: "sulit", paket: 2 },
  { id: "p2-u03", pertanyaan: "Kapan Indonesia resmi diakui kedaulatannya oleh Belanda?", pilihan: ["17 Agustus 1945", "27 Desember 1949", "15 Agustus 1950"], jawaban: 1, tingkat: "sulit", paket: 2 },
  { id: "p2-u04", pertanyaan: "Gerakan separatisme di Sulawesi pada 1958 adalah...", pilihan: ["DI/TII", "PRRI/Permesta", "PKI"], jawaban: 1, tingkat: "sulit", paket: 2 },
  { id: "p2-u05", pertanyaan: "Gubernur Jenderal VOC yang mendirikan Batavia pada 1619 adalah...", pilihan: ["Pieter Both", "Jan Pieterszoon Coen", "Antonio van Diemen"], jawaban: 1, tingkat: "sulit", paket: 2 },
  { id: "p2-u06", pertanyaan: "'Supersemar' adalah singkatan dari...", pilihan: ["Surat Perintah Sebelas Maret", "Surat Mandat Sebelas Maret", "Surat Perintah Maret"], jawaban: 0, tingkat: "sulit", paket: 2 },
  { id: "p2-u07", pertanyaan: "Tahun berapa Indonesia masuk sebagai anggota PBB?", pilihan: ["1945", "1950", "1955"], jawaban: 1, tingkat: "sulit", paket: 2 },
  { id: "p2-u08", pertanyaan: "Di provinsi mana Perang Padri terjadi?", pilihan: ["Sumatera Selatan", "Sumatera Barat", "Sumatera Utara"], jawaban: 1, tingkat: "sulit", paket: 2 },
  { id: "p2-u09", pertanyaan: "Jumlah anggota PPKI (Panitia Persiapan Kemerdekaan Indonesia) adalah...", pilihan: ["21", "27", "33"], jawaban: 1, tingkat: "sulit", paket: 2 },
  { id: "p2-u10", pertanyaan: "Yang membantu merumuskan teks proklamasi bersama Soekarno adalah...", pilihan: ["Hatta dan Ahmad Subardjo", "Hatta dan Soepomo", "Sjahrir dan Hatta"], jawaban: 0, tingkat: "sulit", paket: 2 },

  // ===== PAKET 3: 🗺️ GEOGRAFI & ALAM INDONESIA =====
  { id: "p3-m01", pertanyaan: "Pulau paling timur di Indonesia adalah...", pilihan: ["Maluku", "Papua", "Sulawesi"], jawaban: 1, tingkat: "mudah", paket: 3 },
  { id: "p3-m02", pertanyaan: "Ibu kota provinsi Jawa Timur adalah...", pilihan: ["Malang", "Surabaya", "Sidoarjo"], jawaban: 1, tingkat: "mudah", paket: 3 },
  { id: "p3-m03", pertanyaan: "Berapa jumlah provinsi di pulau Sumatera?", pilihan: ["8", "10", "12"], jawaban: 1, tingkat: "mudah", paket: 3 },
  { id: "p3-m04", pertanyaan: "Selat yang memisahkan Jawa dan Bali adalah...", pilihan: ["Selat Sunda", "Selat Bali", "Selat Lombok"], jawaban: 1, tingkat: "mudah", paket: 3 },
  { id: "p3-m05", pertanyaan: "Gunung tertinggi di Pulau Jawa adalah...", pilihan: ["Gunung Merapi", "Gunung Semeru", "Gunung Bromo"], jawaban: 1, tingkat: "mudah", paket: 3 },
  { id: "p3-m06", pertanyaan: "Samudra di sebelah timur Indonesia adalah...", pilihan: ["Samudra Hindia", "Samudra Pasifik", "Samudra Atlantik"], jawaban: 1, tingkat: "mudah", paket: 3 },
  { id: "p3-m07", pertanyaan: "Sungai terpanjang di Pulau Kalimantan adalah...", pilihan: ["Sungai Mahakam", "Sungai Barito", "Sungai Kapuas"], jawaban: 2, tingkat: "mudah", paket: 3 },
  { id: "p3-m08", pertanyaan: "Berapa jumlah pulau besar di Indonesia?", pilihan: ["3", "4", "5"], jawaban: 2, tingkat: "mudah", paket: 3 },
  { id: "p3-m09", pertanyaan: "Danau terbesar di Sumatera adalah...", pilihan: ["Danau Maninjau", "Danau Toba", "Danau Singkarak"], jawaban: 1, tingkat: "mudah", paket: 3 },
  { id: "p3-m10", pertanyaan: "Kota Palembang terletak di pulau...", pilihan: ["Jawa", "Kalimantan", "Sumatera"], jawaban: 2, tingkat: "mudah", paket: 3 },

  { id: "p3-s01", pertanyaan: "Ibu kota provinsi Kalimantan Timur adalah...", pilihan: ["Balikpapan", "Samarinda", "Banjarmasin"], jawaban: 1, tingkat: "sedang", paket: 3 },
  { id: "p3-s02", pertanyaan: "Gunung Rinjani terletak di...", pilihan: ["Bali", "Lombok", "Sumbawa"], jawaban: 1, tingkat: "sedang", paket: 3 },
  { id: "p3-s03", pertanyaan: "Selat yang memisahkan Sumatera dan Jawa adalah...", pilihan: ["Selat Sunda", "Selat Bali", "Selat Malaka"], jawaban: 0, tingkat: "sedang", paket: 3 },
  { id: "p3-s04", pertanyaan: "Gunung berapi di Sumatera Selatan adalah...", pilihan: ["Gunung Kerinci", "Gunung Dempo", "Gunung Leuser"], jawaban: 1, tingkat: "sedang", paket: 3 },
  { id: "p3-s05", pertanyaan: "Taman Nasional Komodo terletak di...", pilihan: ["Nusa Tenggara Barat", "Nusa Tenggara Timur", "Bali"], jawaban: 1, tingkat: "sedang", paket: 3 },
  { id: "p3-s06", pertanyaan: "Sungai terpanjang di Sumatera Selatan adalah...", pilihan: ["Sungai Ogan", "Sungai Komering", "Sungai Musi"], jawaban: 2, tingkat: "sedang", paket: 3 },
  { id: "p3-s07", pertanyaan: "Puncak tertinggi di Pulau Papua adalah...", pilihan: ["Puncak Trikora", "Puncak Jaya", "Puncak Mandala"], jawaban: 1, tingkat: "sedang", paket: 3 },
  { id: "p3-s08", pertanyaan: "Jumlah kabupaten di Sumatera Selatan adalah...", pilihan: ["11", "13", "15"], jawaban: 1, tingkat: "sedang", paket: 3 },
  { id: "p3-s09", pertanyaan: "Pulau yang terkenal sebagai destinasi wisata Hindu di Indonesia adalah...", pilihan: ["Lombok", "Bali", "Flores"], jawaban: 1, tingkat: "sedang", paket: 3 },
  { id: "p3-s10", pertanyaan: "Kabupaten di Sumatera Selatan yang terkenal penghasil minyak bumi adalah...", pilihan: ["Banyuasin", "Musi Banyuasin", "Ogan Komering Ilir"], jawaban: 1, tingkat: "sedang", paket: 3 },

  { id: "p3-u01", pertanyaan: "Garis pantai Indonesia panjangnya sekitar...", pilihan: ["54.000 km", "81.000 km", "108.000 km"], jawaban: 2, tingkat: "sulit", paket: 3 },
  { id: "p3-u02", pertanyaan: "Berapa lempeng tektonik utama yang bertemu di Indonesia?", pilihan: ["2", "3", "4"], jawaban: 1, tingkat: "sulit", paket: 3 },
  { id: "p3-u03", pertanyaan: "Gunung tertinggi Indonesia terletak di...", pilihan: ["Papua", "Sumatera", "Kalimantan"], jawaban: 0, tingkat: "sulit", paket: 3 },
  { id: "p3-u04", pertanyaan: "Selat yang paling strategis secara ekonomi di Indonesia adalah...", pilihan: ["Selat Lombok", "Selat Sunda", "Selat Malaka"], jawaban: 2, tingkat: "sulit", paket: 3 },
  { id: "p3-u05", pertanyaan: "Indonesia terletak di zona seismik yang disebut...", pilihan: ["Sabuk Alpide", "Cincin Api Pasifik", "Zona Hotspot Hawaii"], jawaban: 1, tingkat: "sulit", paket: 3 },
  { id: "p3-u06", pertanyaan: "Kawasan laut di antara Kalimantan, Sulawesi, Maluku, dan Papua adalah...", pilihan: ["Laut Jawa", "Laut Flores", "Laut Banda"], jawaban: 2, tingkat: "sulit", paket: 3 },
  { id: "p3-u07", pertanyaan: "Luas wilayah Sumatera Selatan sekitar...", pilihan: ["71.592 km²", "81.592 km²", "91.592 km²"], jawaban: 2, tingkat: "sulit", paket: 3 },
  { id: "p3-u08", pertanyaan: "Situs peninggalan Kerajaan Sriwijaya di Palembang adalah...", pilihan: ["Bukit Seguntang", "Muaro Jambi", "Candi Borobudur"], jawaban: 0, tingkat: "sulit", paket: 3 },
  { id: "p3-u09", pertanyaan: "Rata-rata gempa yang terjadi di Indonesia per tahun sekitar...", pilihan: ["1.000", "3.000", "5.000"], jawaban: 2, tingkat: "sulit", paket: 3 },
  { id: "p3-u10", pertanyaan: "Kerajaan Hindu-Buddha terbesar yang berdiri di Sumatera adalah...", pilihan: ["Mataram", "Majapahit", "Sriwijaya"], jawaban: 2, tingkat: "sulit", paket: 3 },

  // ===== PAKET 4: 🔢 MATEMATIKA & SAINS =====
  { id: "p4-m01", pertanyaan: "Berapa hasil dari 6 + 6 × 6?", pilihan: ["72", "42", "36"], jawaban: 1, tingkat: "mudah", paket: 4 },
  { id: "p4-m02", pertanyaan: "Berapa hasil dari 1.000 - 365?", pilihan: ["625", "635", "645"], jawaban: 1, tingkat: "mudah", paket: 4 },
  { id: "p4-m03", pertanyaan: "5 adalah berapa persen dari 20?", pilihan: ["15%", "20%", "25%"], jawaban: 2, tingkat: "mudah", paket: 4 },
  { id: "p4-m04", pertanyaan: "Harga 1 kg beras Rp12.000, berapa harga 3 kg?", pilihan: ["Rp32.000", "Rp34.000", "Rp36.000"], jawaban: 2, tingkat: "mudah", paket: 4 },
  { id: "p4-m05", pertanyaan: "Berapa hasil dari 45 ÷ 9?", pilihan: ["4", "5", "6"], jawaban: 1, tingkat: "mudah", paket: 4 },
  { id: "p4-m06", pertanyaan: "Bangun datar yang semua sisinya sama dan memiliki 4 sudut siku-siku adalah...", pilihan: ["Persegi Panjang", "Persegi", "Belah Ketupat"], jawaban: 1, tingkat: "mudah", paket: 4 },
  { id: "p4-m07", pertanyaan: "Berapa hasil dari 3² + 4²?", pilihan: ["23", "25", "27"], jawaban: 1, tingkat: "mudah", paket: 4 },
  { id: "p4-m08", pertanyaan: "Kolam panjang 8 m dan lebar 5 m. Berapa luasnya?", pilihan: ["30 m²", "40 m²", "50 m²"], jawaban: 1, tingkat: "mudah", paket: 4 },
  { id: "p4-m09", pertanyaan: "Berapa jumlah menit dalam 2,5 jam?", pilihan: ["120", "145", "150"], jawaban: 2, tingkat: "mudah", paket: 4 },
  { id: "p4-m10", pertanyaan: "Zat gizi yang berfungsi sebagai sumber energi utama adalah...", pilihan: ["Protein", "Karbohidrat", "Vitamin"], jawaban: 1, tingkat: "mudah", paket: 4 },

  { id: "p4-s01", pertanyaan: "Jika p=5 dan q=3, berapa nilai p² - q²?", pilihan: ["14", "16", "18"], jawaban: 1, tingkat: "sedang", paket: 4 },
  { id: "p4-s02", pertanyaan: "Volume balok 10cm × 5cm × 4cm adalah...", pilihan: ["150 cm³", "200 cm³", "250 cm³"], jawaban: 1, tingkat: "sedang", paket: 4 },
  { id: "p4-s03", pertanyaan: "Petani punya 2,5 ha sawah, 1 ha menghasilkan 5 ton. Total panen?", pilihan: ["10 ton", "12,5 ton", "15 ton"], jawaban: 1, tingkat: "sedang", paket: 4 },
  { id: "p4-s04", pertanyaan: "KPK dari 8 dan 12 adalah...", pilihan: ["16", "20", "24"], jawaban: 2, tingkat: "sedang", paket: 4 },
  { id: "p4-s05", pertanyaan: "Berapa hasil dari (7+3) × (10-4)?", pilihan: ["40", "50", "60"], jawaban: 2, tingkat: "sedang", paket: 4 },
  { id: "p4-s06", pertanyaan: "Diskon 25% untuk baju Rp200.000. Berapa yang dibayar?", pilihan: ["Rp125.000", "Rp150.000", "Rp175.000"], jawaban: 1, tingkat: "sedang", paket: 4 },
  { id: "p4-s07", pertanyaan: "Panjang sisi persegi jika luasnya 196 cm² adalah...", pilihan: ["12 cm", "14 cm", "16 cm"], jawaban: 1, tingkat: "sedang", paket: 4 },
  { id: "p4-s08", pertanyaan: "Berapa hasil dari 1/3 + 1/4 + 1/6?", pilihan: ["2/3", "3/4", "5/6"], jawaban: 1, tingkat: "sedang", paket: 4 },
  { id: "p4-s09", pertanyaan: "Keuntungan 20% dari modal Rp2.000.000 adalah...", pilihan: ["Rp200.000", "Rp400.000", "Rp600.000"], jawaban: 1, tingkat: "sedang", paket: 4 },
  { id: "p4-s10", pertanyaan: "Planet yang berputar mengelilingi matahari disebut...", pilihan: ["Satelit", "Planet", "Komet"], jawaban: 1, tingkat: "sedang", paket: 4 },

  { id: "p4-u01", pertanyaan: "Berapa hasil dari 5! (5 faktorial)?", pilihan: ["60", "100", "120"], jawaban: 2, tingkat: "sulit", paket: 4 },
  { id: "p4-u02", pertanyaan: "Volume tabung diameter 14cm tinggi 10cm adalah... (π=22/7)", pilihan: ["1.210 cm³", "1.540 cm³", "2.200 cm³"], jawaban: 1, tingkat: "sulit", paket: 4 },
  { id: "p4-u03", pertanyaan: "Jumlah deret aritmatika: 2+4+6+8+...+20 adalah...", pilihan: ["100", "110", "120"], jawaban: 1, tingkat: "sulit", paket: 4 },
  { id: "p4-u04", pertanyaan: "Tabungan Rp1.000.000 bunga majemuk 10%/tahun, setelah 2 tahun...", pilihan: ["Rp1.100.000", "Rp1.200.000", "Rp1.210.000"], jawaban: 2, tingkat: "sulit", paket: 4 },
  { id: "p4-u05", pertanyaan: "Berapa nilai x jika 3x + 7 = 22?", pilihan: ["4", "5", "6"], jawaban: 1, tingkat: "sulit", paket: 4 },
  { id: "p4-u06", pertanyaan: "Luas segitiga alas 12 cm dan tinggi 8 cm adalah...", pilihan: ["36 cm²", "48 cm²", "96 cm²"], jawaban: 1, tingkat: "sulit", paket: 4 },
  { id: "p4-u07", pertanyaan: "Berapa nilai dari 2⁴ + 3³ + 5² × 2?", pilihan: ["81", "93", "107"], jawaban: 1, tingkat: "sulit", paket: 4 },
  { id: "p4-u08", pertanyaan: "Kereta 90 km/jam menempuh 315 km. Berapa lama perjalanan?", pilihan: ["3 jam", "3 jam 30 menit", "4 jam"], jawaban: 1, tingkat: "sulit", paket: 4 },
  { id: "p4-u09", pertanyaan: "Berapa nilai dari log₂(64)?", pilihan: ["5", "6", "7"], jawaban: 1, tingkat: "sulit", paket: 4 },
  { id: "p4-u10", pertanyaan: "Beli 50 kg beras Rp10.000/kg, jual Rp12.500/kg. Keuntungan?", pilihan: ["Rp100.000", "Rp125.000", "Rp150.000"], jawaban: 1, tingkat: "sulit", paket: 4 },

  // ===== PAKET 5: 🌾 DESA, BUDAYA & KEHIDUPAN =====
  { id: "p5-m01", pertanyaan: "Kepala pemerintahan di tingkat desa disebut...", pilihan: ["Lurah", "Kepala Desa", "Camat"], jawaban: 1, tingkat: "mudah", paket: 5 },
  { id: "p5-m02", pertanyaan: "Tarian tradisional yang berasal dari Bali adalah...", pilihan: ["Saman", "Kecak", "Reog"], jawaban: 1, tingkat: "mudah", paket: 5 },
  { id: "p5-m03", pertanyaan: "Apa kepanjangan dari RT di lingkungan perumahan?", pilihan: ["Rukun Tempat", "Rukun Tetangga", "Rukun Tunggal"], jawaban: 1, tingkat: "mudah", paket: 5 },
  { id: "p5-m04", pertanyaan: "Pakaian tradisional perempuan khas Jawa adalah...", pilihan: ["Baju Bodo", "Kebaya", "Baju Kurung"], jawaban: 1, tingkat: "mudah", paket: 5 },
  { id: "p5-m05", pertanyaan: "Kerajinan khas Palembang yang terbuat dari benang emas adalah...", pilihan: ["Tenun", "Ukiran", "Songket"], jawaban: 2, tingkat: "mudah", paket: 5 },
  { id: "p5-m06", pertanyaan: "Festival nasional yang diperingati setiap 17 Agustus adalah...", pilihan: ["Hari Pahlawan", "HUT Kemerdekaan RI", "Hari Batik"], jawaban: 1, tingkat: "mudah", paket: 5 },
  { id: "p5-m07", pertanyaan: "Alat musik petik tradisional dari NTT adalah...", pilihan: ["Sape", "Sasando", "Kecapi"], jawaban: 1, tingkat: "mudah", paket: 5 },
  { id: "p5-m08", pertanyaan: "Batik adalah kain tradisional yang berasal dari pulau...", pilihan: ["Sumatera", "Jawa", "Bali"], jawaban: 1, tingkat: "mudah", paket: 5 },
  { id: "p5-m09", pertanyaan: "Sistem kerja bersama secara sukarela dalam masyarakat desa disebut...", pilihan: ["Gotong Royong", "Arisan", "Musyawarah"], jawaban: 0, tingkat: "mudah", paket: 5 },
  { id: "p5-m10", pertanyaan: "Apa kepanjangan dari BUMDes?", pilihan: ["Badan Usaha Milik Desa", "Badan Usaha Mandiri Desa", "Badan Umum Masyarakat Desa"], jawaban: 0, tingkat: "mudah", paket: 5 },

  { id: "p5-s01", pertanyaan: "Program pemerintah yang memberikan dana langsung kepada desa adalah...", pilihan: ["BLT", "Dana Desa", "APBD"], jawaban: 1, tingkat: "sedang", paket: 5 },
  { id: "p5-s02", pertanyaan: "Lembaga permusyawaratan tertinggi di desa adalah...", pilihan: ["LKMD", "BPD (Badan Permusyawaratan Desa)", "LPMD"], jawaban: 1, tingkat: "sedang", paket: 5 },
  { id: "p5-s03", pertanyaan: "Upacara adat suku Toraja saat ada yang meninggal adalah...", pilihan: ["Rambu Solo", "Ma'nene", "Ngaben"], jawaban: 0, tingkat: "sedang", paket: 5 },
  { id: "p5-s04", pertanyaan: "Masa jabatan kepala desa setiap periode adalah...", pilihan: ["4 tahun", "5 tahun", "6 tahun"], jawaban: 2, tingkat: "sedang", paket: 5 },
  { id: "p5-s05", pertanyaan: "Motif batik dari Yogyakarta yang terkenal adalah...", pilihan: ["Batik Kawung", "Batik Parang", "Batik Mega Mendung"], jawaban: 1, tingkat: "sedang", paket: 5 },
  { id: "p5-s06", pertanyaan: "Dokumen keuangan tahunan di tingkat desa adalah...", pilihan: ["APBD", "APBDes", "APBN"], jawaban: 1, tingkat: "sedang", paket: 5 },
  { id: "p5-s07", pertanyaan: "Tari Kancet adalah tarian adat dari...", pilihan: ["Sumatera", "Kalimantan", "Papua"], jawaban: 1, tingkat: "sedang", paket: 5 },
  { id: "p5-s08", pertanyaan: "Apa kepanjangan dari APBDes?", pilihan: ["Anggaran Pendapatan Belanja Desa", "Anggaran Pembangunan Blok Desa", "Alokasi Pengelolaan Budget Desa"], jawaban: 0, tingkat: "sedang", paket: 5 },
  { id: "p5-s09", pertanyaan: "Tarian tradisional Sumatera Selatan yang terkenal secara nasional adalah...", pilihan: ["Tari Tanggai", "Tari Gending Sriwijaya", "Tari Pendet"], jawaban: 1, tingkat: "sedang", paket: 5 },
  { id: "p5-s10", pertanyaan: "Musyawarah perencanaan pembangunan di tingkat desa disebut...", pilihan: ["Musyawarah Desa", "Musrenbangdes", "RPJM Desa"], jawaban: 1, tingkat: "sedang", paket: 5 },

  { id: "p5-u01", pertanyaan: "Pasal UUD 1945 yang mengatur tentang pemerintahan desa adalah...", pilihan: ["Pasal 18 ayat 1", "Pasal 18B ayat 2", "Pasal 33"], jawaban: 1, tingkat: "sulit", paket: 5 },
  { id: "p5-u02", pertanyaan: "Jumlah maksimal masa jabatan kepala desa adalah...", pilihan: ["2 kali", "3 kali", "4 kali"], jawaban: 1, tingkat: "sulit", paket: 5 },
  { id: "p5-u03", pertanyaan: "Persentase maksimum belanja pegawai dalam APBDes adalah...", pilihan: ["20%", "30%", "40%"], jawaban: 1, tingkat: "sulit", paket: 5 },
  { id: "p5-u04", pertanyaan: "Pendiri Kerajaan Sriwijaya yang pertama diketahui adalah...", pilihan: ["Parameswara", "Dapunta Hyang Sri Jayanasa", "Raja Kertanegara"], jawaban: 1, tingkat: "sulit", paket: 5 },
  { id: "p5-u05", pertanyaan: "Jumlah anggota minimum BPD (Badan Permusyawaratan Desa) adalah...", pilihan: ["3 orang", "5 orang", "7 orang"], jawaban: 1, tingkat: "sulit", paket: 5 },
  { id: "p5-u06", pertanyaan: "Program kredit modal usaha murah yang didukung pemerintah untuk desa adalah...", pilihan: ["BLT", "KUR (Kredit Usaha Rakyat)", "PKH"], jawaban: 1, tingkat: "sulit", paket: 5 },
  { id: "p5-u07", pertanyaan: "Sumber daya alam Musi Banyuasin yang menjadi komoditas ekspor utama adalah...", pilihan: ["Kelapa Sawit", "Minyak Bumi dan Gas Alam", "Batu Bara"], jawaban: 1, tingkat: "sulit", paket: 5 },
  { id: "p5-u08", pertanyaan: "Kerajaan Sriwijaya adalah kerajaan bercorak...", pilihan: ["Hindu", "Buddha", "Islam"], jawaban: 1, tingkat: "sulit", paket: 5 },
  { id: "p5-u09", pertanyaan: "Dana Desa wajib dialokasikan minimum berapa persen untuk pemberdayaan masyarakat?", pilihan: ["20%", "30%", "40%"], jawaban: 1, tingkat: "sulit", paket: 5 },
  { id: "p5-u10", pertanyaan: "Situs bersejarah kerajaan Sriwijaya yang terletak di Palembang adalah...", pilihan: ["Bukit Seguntang", "Candi Borobudur", "Candi Muaro Jambi"], jawaban: 0, tingkat: "sulit", paket: 5 },
];

// =========================================================
// HELPER FUNCTIONS
// =========================================================

function acakPilihan<T extends { pilihan: [string, string, string]; jawaban: 0 | 1 | 2 }>(soal: T): T {
  const urutan = [0, 1, 2].sort(() => Math.random() - 0.5) as [number, number, number];
  const pilihanBaru = urutan.map((i) => soal.pilihan[i]) as [string, string, string];
  const jawabanBaru = urutan.indexOf(soal.jawaban) as 0 | 1 | 2;
  return { ...soal, pilihan: pilihanBaru, jawaban: jawabanBaru };
}

export function getSoalUntukSesi(sesi: 1 | 2 | 3 | 4 | 5): Soal[] {
  const soalSesi = bankSoal.filter((s) => s.sesi === sesi);
  const shuffled = [...soalSesi].sort(() => Math.random() - 0.5);
  const jumlah =
    sesi === 1 ? 30 :
    sesi === 2 ? 20 :
    sesi === 3 ? 10 :
    sesi === 4 ? 8 :
    5;
  return shuffled.slice(0, jumlah).map(acakPilihan);
}

export function getSoalSolo(
  tingkat: "mudah" | "sedang" | "sulit",
  jumlah: number,
  paket?: 1 | 2 | 3 | 4 | 5
): SoalSolo[] {
  const filtered = paket
    ? bankSoalSolo.filter((s) => s.tingkat === tingkat && s.paket === paket)
    : bankSoalSolo.filter((s) => s.tingkat === tingkat);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, jumlah).map(acakPilihan);
}

export const DURASI_SOAL: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 30, 2: 25, 3: 20, 4: 15, 5: 10,
};

export const DURASI_BARENG: Record<"mudah" | "sedang" | "sulit", number> = {
  mudah: 5, sedang: 6, sulit: 7,
};

export const MAKS_LOLOS: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 15, 2: 8, 3: 5, 4: 3, 5: 3,
};

export const DURASI_SOLO: Record<"mudah" | "sedang" | "sulit", number> = {
  mudah: 4, sedang: 4, sulit: 4,
};

export const JUMLAH_SOLO: Record<"mudah" | "sedang" | "sulit", number> = {
  mudah: 10, sedang: 12, sulit: 15,
};
