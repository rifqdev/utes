# Panduan Kontribusi

Kami sangat terbuka untuk kontribusi dari siapa saja! Berikut langkah-langkah untuk menjadi kontributor:

## 1. Fork Repository

Klik tombol "Fork" di pojok kanan atas halaman repository ini untuk membuat salinan repository ke akun GitHub Anda.

## 2. Clone Repository

```bash
# Clone repository hasil fork Anda
git clone https://github.com/rifqdev/utes.git
cd utes
```

## 3. Setup Environment

```bash
# Install dependencies
pnpm install

# Copy file environment (jika ada)
cp .env.example .env

# Jalankan development server
pnpm dev
```

## 4. Buat Branch Baru

```bash
# Buat branch dengan nama yang deskriptif
git checkout -b feature/nama-fitur
# atau
git checkout -b fix/nama-bug
```

## 5. Lakukan Perubahan

- Tulis kode yang bersih dan mudah dipahami
- Ikuti struktur project yang sudah ada (lihat [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md))
- Pastikan kode mengikuti konvensi TypeScript dan React
- Test perubahan Anda secara menyeluruh

## 6. Commit Perubahan

```bash
# Add file yang diubah
git add .

# Commit dengan pesan yang jelas
git commit -m "feat: menambahkan fitur X"
# atau
git commit -m "fix: memperbaiki bug Y"
```

### Format Commit Message

- `feat:` untuk fitur baru
- `fix:` untuk perbaikan bug
- `docs:` untuk perubahan dokumentasi
- `style:` untuk perubahan formatting
- `refactor:` untuk refactoring kode
- `test:` untuk menambahkan test
- `chore:` untuk maintenance

## 7. Push ke GitHub

```bash
git push origin feature/nama-fitur
```

## 8. Buat Pull Request

1. Buka repository Anda di GitHub
2. Klik tombol "Compare & pull request"
3. Berikan judul dan deskripsi yang jelas tentang perubahan Anda
4. Submit pull request

## Panduan Kontribusi

### Code Style

- Gunakan TypeScript dengan strict mode
- Ikuti konvensi penamaan yang konsisten
- Gunakan ESLint dan Prettier untuk formatting

### Components

- Buat komponen yang reusable dan modular
- Pisahkan logic dan presentasi
- Gunakan TypeScript interfaces untuk props

### Naming Conventions

- **PascalCase**: untuk komponen React (`Button.tsx`, `QuizCard.tsx`)
- **camelCase**: untuk fungsi dan variabel (`handleClick`, `userData`)
- **UPPER_CASE**: untuk konstanta (`API_URL`, `MAX_ATTEMPTS`)

### Comments

- Tambahkan komentar untuk logika yang kompleks
- Gunakan JSDoc untuk fungsi yang kompleks
- Hindari komentar yang redundan

### Responsive Design

- Pastikan UI responsive di berbagai ukuran layar
- Gunakan Tailwind CSS breakpoints (`sm:`, `md:`, `lg:`)
- Test di mobile, tablet, dan desktop

## Butuh Bantuan?

Jika Anda memiliki pertanyaan atau butuh bantuan, silakan:

- Buka issue baru untuk diskusi
- Hubungi maintainer melalui issue atau discussion
- Lihat dokumentasi di [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

Terima kasih telah berkontribusi! 🎉
