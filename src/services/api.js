// src/services/api.js

/**
 * Simulasi mengirim gambar label nutrisi ke backend Machine Learning (misal: FastAPI/Flask).
 * Nantinya ini akan diganti dengan implementasi asli menggunakan axios atau fetch.
 */
export const scanNutritionLabel = async (imageFile, userConfig) => {
  // Simulasi network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulasi hasil kembalian dari backend (berupa JSON)
  // Ini contoh jika yang di-upload ternyata minuman yang agak tinggi gula.
  return {
    status: 'success',
    data: {
      energi: 150, // kkal
      gula: 12, // gram (akan terdeteksi sebagai 'D' / Paling Tinggi)
      garam: 45, // mg (akan terdeteksi sebagai 'A' / Paling Rendah)
      lemakJenuh: 2 // gram (akan terdeteksi sebagai 'A' / Paling Rendah)
    }
  };
};
