const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const scanNutritionLabel = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_BASE_URL}/api/scan`, {
    method: 'POST',
    body: formData,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.status === 'error') {
    const message =
      payload?.message ||
      payload?.detail ||
      'Gagal memproses gambar. Pastikan backend ML sedang berjalan.';
    throw new Error(message);
  }

  return payload;
};
