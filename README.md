# ElephantLabs — TTS Gratis: Ubah Teks Jadi Suara

Landing page + playground **text-to-speech gratis** (Astro + Tailwind CSS).
Ketik teks → pilih suara AI Deepgram Flux → play → download MP3.
Login memakai akun koncoweb via **Neon Auth** untuk membuka 36 suara.

**Live:** https://elephantlabs.web.id · **Repo:** https://github.com/koncoweb/elephantlabs

## Fitur

- Hero ala ElevenLabs + playground TTS fungsional (`POST /api/speech`)
- 3 suara gratis anonim · 36 suara penuh untuk user login (Neon Auth)
- Rate limit 1x generate + modal iklan membership (timer 5 detik)
- Halaman bilingual (EN/ID): About, Privacy, Security, Contact, Text to Speech
- SEO: meta/OG/canonical, JSON-LD (FAQPage, SoftwareApplication), sitemap, robots

## Prasyarat

- Node.js 20+ (disarankan 22) + npm
- Akun GitHub, [Neon](https://console.neon.tech) (proyek `koncowebportal`, Auth aktif), dan [OpenRouter](https://openrouter.ai) (API key)

## Mulai (Fork → Clone → Dev)

```bash
# 1. Fork https://github.com/koncoweb/elephantlabs di GitHub (tombol Fork),
#    lalu clone hasil fork-mu:
git clone https://github.com/<username-mu>/elephantlabs.git
cd elephantlabs

# 2. Env (jangan pernah commit file ini):
cp .env.example .env
# isi di .env:
#   OPENROUTER_API_KEY=...
#   PUBLIC_NEON_AUTH_URL=https://<endpoint>.neonauth.<region>.aws.neon.tech/neondb/auth

# 3. Install & jalan:
npm install
npm run dev      # → http://localhost:4321
```

| Skrip          | Fungsi                              |
| -------------- | ----------------------------------- |
| `npm run dev`  | Dev server (http://localhost:4321)  |
| `npm run build`| Build production (`dist/`)          |
| `npm run preview` | Pratinjau hasil build lokal      |

> Setelah menambah domain baru (localhost port lain / domain produksi),
> daftarkan ke Neon Auth trusted domains atau login error `invalid domain`:
> `npx neon@latest neon-auth domain add https://domain-baru.com --project-id <id>`

## Development dengan AI IDE (dari hasil fork)

Alur umumnya sama di semua AI IDE: fork → clone → buka folder di IDE → biarkan AI agent membaca kode → minta perubahan → verifikasi `npm run build`.

### Cursor

1. Fork & clone repo (lihat di atas), lalu **File → Open Folder** ke `elephantlabs`.
2. Buka Chat (`Ctrl+L`) / Agent (`Ctrl+I`), pastikan mode **Agent**.
3. Contoh prompt: *"Tambahkan halaman pricing bilingual mengikuti gaya DocPage yang ada, lalu verifikasi dengan npm run build."*
4. Review diff di panel Source Control sebelum commit.

### Antigravity (Google)

1. Fork & clone, buka folder di Antigravity.
2. Gunakan **Agent Manager**: pilih model → tugaskan task (mis. *"fix responsive hero di mobile"*).
3. Untuk misi paralel (mis. konten EN + ID), jalankan beberapa agent sekaligus lalu gabungkan hasilnya.
4. Cek **Artifacts/Previews** bila tersedia sebelum push.

### OpenCode

1. Fork & clone, jalankan `opencode` di folder proyek.
2. OpenCode otomatis membaca `package.json`/struktur Astro — langsung perintahkan, mis. *"tambahkan FAQ baru dan update sitemap"*.
3. Install Neon skills bila bekerja dengan database/auth:
   ```bash
   npx neon@latest skills --agent opencode -s neon -s neon-postgres -y
   ```

### AI IDE lain (Windsurf, Copilot, Zed, Gemini CLI, Codex …)

1. Fork & clone seperti biasa.
2. Buka folder di IDE tersebut dan aktifkan asisten AI-nya (Cascade / Copilot Chat / Agent Panel / perintah CLI-nya).
3. Beri konteks eksplisit bila agent butuh: *"Proyek Astro 4 + Tailwind v4, adapter Netlify, auth via @neondatabase/neon-js ke Neon Auth koncowebportal."*
4. Aturan main yang disarankan untuk agent: jangan commit secret (`.env` sudah di-gitignore), selalu jalankan `npm run build` setelah mengubah kode, dan uji endpoint `POST /api/speech` untuk perubahan TTS.

## Struktur Proyek

```
src/
  pages/            # index, login, text-to-speech, about, privacy, security, contact, sitemap.xml
  pages/api/        # POST /api/speech (proxy OpenRouter + gate login)
  components/       # Navbar, Hero, TtsPlayground, Faq, Footer, DocPage, SeoSections
  data/             # voices.ts (36 suara), faq.ts
  lib/auth.ts       # client Neon Auth (@neondatabase/neon-js)
  layouts/Layout.astro  # SEO meta, canonical, JSON-LD
public/             # logo, modaliklan.png, robots.txt, og.svg
netlify.toml        # config deploy Netlify
```

## Deploy ke Netlify

Repo ini **siap Netlify** (`netlify.toml` + adapter `@astrojs/netlify`).

1. Netlify Dashboard → **Add new site → Import an existing project** → pilih fork/repo GitHub.
2. Build settings (biasanya terisi otomatis):
   - Base directory: *(kosong)*
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Site settings → Environment variables**, tambahkan:
   - `OPENROUTER_API_KEY`
   - `PUBLIC_NEON_AUTH_URL`
4. **Deploy site**. Ulangi langkah 2–3 untuk setiap environment (preview/production) bila perlu value berbeda.
5. Setelah domain final diketahui (mis. `elephantlabs.web.id`), daftarkan sebagai trusted domain Neon Auth (lihat catatan di atas).

## Deploy ke Vercel

Adapter saat ini Netlify — untuk Vercel, tukar adapter dulu:

```bash
npm uninstall @astrojs/netlify
npm install @astrojs/vercel
```

```js
// astro.config.mjs — ganti import & adapter:
import vercel from '@astrojs/vercel';
// adapter: vercel(),
```

Lalu:

1. Push perubahan ke GitHub.
2. Vercel Dashboard → **Add New → Project** → import repo.
   - Framework preset: **Astro** (otomatis)
   - Build command: `npm run build` · Output directory: `dist`
3. **Settings → Environment Variables**, tambahkan `OPENROUTER_API_KEY` dan `PUBLIC_NEON_AUTH_URL` (untuk Production + Preview).
4. **Deploy**. Daftarkan domain Vercel (`*.vercel.app` / custom) ke Neon Auth trusted domains agar login tetap jalan.

## Keamanan

- `.env` tidak di-commit (sudah di `.gitignore`). Contoh kosong ada di `.env.example`.
- API key OpenRouter & Neon hanya di server/env — tidak pernah dikirim ke browser.
- Bila key pernah bocor (tertempel di chat/log), segera **rotate** di dashboard masing-masing.
