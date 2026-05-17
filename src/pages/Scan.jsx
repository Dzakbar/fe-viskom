import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scanNutritionLabel } from '../services/api';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const readFileAsDataUrl = (file) => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.readAsDataURL(file);
  })
);

export default function Scan() {
  const navigate = useNavigate();
  const uploadInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');

    if (!file.type.startsWith('image/')) {
      setSelectedFile(null);
      setPreviewUrl('');
      setError('File harus berupa gambar.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setSelectedFile(null);
      setPreviewUrl('');
      setError('Ukuran gambar maksimal 10MB.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSelectedFile(file);
      setPreviewUrl(dataUrl);
    } catch (readError) {
      setSelectedFile(null);
      setPreviewUrl('');
      setError(readError.message);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError('Pilih foto label nutrisi terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await scanNutritionLabel(selectedFile);
      navigate('/result', {
        state: {
          nutrition: response.data,
          imagePreview: previewUrl,
          fileName: selectedFile.name,
        },
      });
    } catch (scanError) {
      setError(scanError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-start py-section-gap px-margin-page max-w-3xl mx-auto w-full pt-24">
      {/* Header Text */}
      <div className="text-center mb-stack-lg w-full">
        <h2 className="font-display text-display text-on-surface mb-2">Pindai Produk</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Unggah foto label nutrisi untuk mendapatkan analisis kesehatan instan.</p>
      </div>
      
      {/* Upload Container */}
      <div className="w-full bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-stack-lg flex flex-col gap-stack-md">
        
        {/* Dashed Upload Area */}
        <label className="upload-area-dashed w-full h-64 flex flex-col items-center justify-center gap-stack-md bg-surface-container-low/30 hover:bg-surface-container-low/50 transition-colors cursor-pointer group">
          <input
            ref={uploadInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          {previewUrl ? (
            <div className="w-full h-full relative">
              <img
                src={previewUrl}
                alt="Preview label nutrisi"
                className="w-full h-full object-contain rounded-lg"
              />
              <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-white/90 px-4 py-2 text-left shadow-sm">
                <p className="font-label-bold text-label-bold text-on-surface truncate">{selectedFile?.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Klik area ini untuk mengganti gambar</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[40px]">cloud_upload</span>
              </div>
              <div className="text-center">
                <p className="font-headline-md text-headline-md text-on-surface mb-1">Upload foto label</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Mendukung format JPG, PNG up to 10MB</p>
              </div>
            </>
          )}
        </label>

        {/* Secondary Action: Camera */}
        <input
          ref={cameraInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="w-full py-4 bg-tertiary-container/30 text-on-tertiary-container font-headline-md text-headline-md flex items-center justify-center gap-2 rounded-xl hover:bg-tertiary-container/50 transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">photo_camera</span>
          Foto dengan kamera
        </button>

        {error && (
          <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-error font-body-md text-body-md">
            {error}
          </div>
        )}

        {/* Primary Execution Button */}
        <button 
          onClick={handleScan}
          disabled={loading || !selectedFile}
          className={`w-full py-5 bg-primary text-on-primary font-headline-md text-headline-md flex items-center justify-center gap-2 rounded-xl mt-stack-md shadow-lg hover:shadow-xl transition-all ${loading ? 'opacity-70 cursor-wait' : selectedFile ? 'hover:bg-primary-container active:scale-95 group' : 'opacity-50 cursor-not-allowed'}`}
        >
          {loading ? (
             <span className="material-symbols-outlined animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">center_focus_weak</span>
          )}
          {loading ? 'Memproses...' : 'Deteksi'}
        </button>
      </div>

      {/* Instructional Tip */}
      <div className="mt-section-gap bg-surface-container-high/50 p-stack-md rounded-xl border border-outline-variant/20 flex gap-4 items-start w-full mb-12">
        <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>info</span>
        <div>
          <p className="font-label-bold text-label-bold text-on-surface">Tips untuk hasil terbaik</p>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Pastikan label nutrisi terlihat jelas, tidak terpotong, dan memiliki pencahayaan yang cukup saat difoto.</p>
        </div>
      </div>
    </main>
  );
}
