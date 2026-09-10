export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  {
    q: 'Apakah ElephantLabs text to speech gratis?',
    a: 'Ya. ElephantLabs adalah tool TTS gratis — Anda bisa mengubah teks jadi suara tanpa biaya, tanpa daftar akun, dan tanpa kartu kredit.'
  },
  {
    q: 'Bagaimana cara mengubah teks jadi suara?',
    a: 'Ketik atau tempel teks (maksimal 2.000 karakter) ke kolom playground, pilih suara AI favorit Anda, lalu tekan tombol play. Audio akan langsung dibacakan di browser.'
  },
  {
    q: 'Apakah perlu daftar akun untuk memakai TTS gratis ini?',
    a: 'Tidak perlu. Converter teks jadi suara ini bisa langsung dipakai — buka halaman, tulis teks, tekan play.'
  },
  {
    q: 'Format file apa yang dihasilkan narator AI gratis ini?',
    a: 'Hasil sintesis berupa audio MP3 yang bisa langsung diputar dan diunduh melalui tombol Download, cocok untuk konten video, podcast, atau materi belajar.'
  },
  {
    q: 'Berapa batas karakter per permintaan?',
    a: 'Setiap permintaan sintesis dibatasi 2.000 karakter. Untuk teks yang lebih panjang, bagi menjadi beberapa bagian lalu gabungkan file MP3-nya.'
  },
  {
    q: 'Bahasa apa saja yang didukung tool teks ke suara gratis ini?',
    a: 'Anda bisa memasukkan teks dalam Bahasa Indonesia maupun Inggris. Pilihan suara AI Flux tersedia dalam berbagai karakter suara berbahasa Inggris yang natural.'
  }
];
