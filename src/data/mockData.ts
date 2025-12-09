export const MOCK_VIDEO = {
  id: 'video-123',
  title: 'Belajar Fundamental JavaScript dalam 10 Menit',
  channel: 'Web Programming UNPAS',
  thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=1000',
  duration: '12:45'
};

export const MOCK_QUIZ_FULL = [
  {
    id: 1,
    question: "Apa fungsi dari keyword 'const' dalam JavaScript?",
    options: [
      "Membuat variabel yang nilainya bisa diubah",
      "Membuat variabel konstan yang nilainya tidak bisa diubah kembali",
      "Membuat fungsi baru",
      "Mengimpor library eksternal"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "Manakah tipe data primitif di bawah ini?",
    options: [
      "Object",
      "Array",
      "Boolean",
      "Function"
    ],
    correct: 2
  },
  {
    id: 3,
    question: "Apa output dari console.log(1 + '1')?",
    options: [
      "2",
      "11",
      "Error",
      "undefined"
    ],
    correct: 1
  }
];

export const MOCK_QUIZ_PARTIAL = [
  {
    id: 1,
    question: "Berdasarkan menit 00:00 - 05:00, bagaimana cara mendeklarasikan variabel yang aman?",
    options: [
      "Selalu gunakan var",
      "Gunakan let atau const untuk scope block",
      "Tidak perlu menggunakan keyword",
      "Gunakan global variable"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "Apa perbedaan var dan let yang dijelaskan pada menit ke-3?",
    options: [
      "Tidak ada perbedaan",
      "Var memiliki function scope, Let memiliki block scope",
      "Let lebih lambat dari Var",
      "Var hanya untuk angka"
    ],
    correct: 1
  }
];

export const MOCK_ESSAY_DATA = [
  {
    id: 1,
    question: "Jelaskan dengan kata-katamu sendiri apa itu Hoisting dalam JavaScript dan berikan contoh kasusnya!",
    referenceContext: "Hoisting adalah perilaku default JavaScript di mana deklarasi variabel dan fungsi dipindahkan ke bagian paling atas scope sebelum kode dieksekusi.",
    keyPoints: [
      "Hoisting memindahkan deklarasi ke atas scope",
      "Fungsi bisa dipanggil sebelum dideklarasikan",
      "Variabel dengan var di-hoist tapi nilainya undefined"
    ]
  },
  {
    id: 2,
    question: "Mengapa kita sebaiknya menggunakan '===' daripada '==' saat melakukan perbandingan? Jelaskan risikonya.",
    referenceContext: "'===' adalah strict equality operator yang mengecek nilai dan tipe data, sedangkan '==' melakukan type coercion yang bisa menyebabkan hasil tidak terduga.",
    keyPoints: [
      "'===' mengecek nilai DAN tipe data",
      "'==' melakukan type coercion otomatis",
      "Type coercion bisa menyebabkan bug tak terduga"
    ]
  }
];
