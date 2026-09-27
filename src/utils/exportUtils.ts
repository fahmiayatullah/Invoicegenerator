// ==========================================
// EXPORT UTILITIES (Canvas, JPEG 1080, PDF 1080, PDF A4)
// ==========================================
//
// ARSITEKTUR EXPORT:
// 1. #invoice-export-1080 → elemen tersembunyi berukuran tepat 1080×1350
// 2. html2canvas → render elemen tersebut ke canvas dengan scale=2 (HiDPI)
// 3. canvas.toBlob / toDataURL → unduh sebagai JPEG atau PDF
//
// KENAPA scale=2?
// - html2canvas scale=2 menghasilkan output 2160×2700 secara internal,
//   kemudian kita resize/crop ke 1080×1350 agar hasil tajam (HiDPI).
// - Tapi karena kita ingin output TEPAT 1080×1350, kita gunakan canvas
//   OffscreenCanvas atau resize setelah render.
// - Solusi yang lebih sederhana: scale=1 dengan windowWidth=1080 dan
//   memastikan elemen benar-benar berukuran 1080px secara DOM.
//
// ==========================================

export interface WindowWithExportLibs extends Window {
  html2canvas?: (element: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
  jspdf?: {
    jsPDF: new (options?: Record<string, unknown>) => JsPdfInstance;
  };
  jsPDF?: new (options?: Record<string, unknown>) => JsPdfInstance;
  html2pdf?: () => Html2PdfChain;
}

export interface JsPdfInstance {
  addImage: (imageData: string, format: string, x: number, y: number, width: number, height: number, alias?: string, compression?: string) => void;
  save: (filename: string) => void;
}

export interface Html2PdfChain {
  set: (options: Record<string, unknown>) => Html2PdfChain;
  from: (element: HTMLElement) => Html2PdfChain;
  save: () => Promise<void>;
  html2canvas?: (element: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
}

// ─── Core Canvas Renderer ────────────────────────────────────────────────────
//
// Fungsi ini merender elemen #invoice-export-1080 menjadi HTMLCanvasElement
// dengan ukuran TEPAT 1080×1350 px.
//
// Strategi:
// 1. Sementara pindahkan elemen ke posisi yang bisa dibaca html2canvas
//    (left: 0, top: -9999px atau left: -9999px tidak masalah, 
//     yang penting opacity bisa diubah)
// 2. Set opacity menjadi 1 sementara (html2canvas tidak bisa render opacity:0)
// 3. html2canvas dengan width:1080, height:1350, scale:1
// 4. Hasil canvas diverifikasi ukurannya
// 5. Jika ukuran canvas tidak tepat, buat canvas baru dan draw dengan ukuran benar

export const render1080Canvas = async (
  targetElement: HTMLElement,
  setExportLoading?: (loadingText: string | null) => void,
  taskName: string = "Menyiapkan Canvas HD..."
): Promise<HTMLCanvasElement> => {
  if (setExportLoading) setExportLoading(taskName);

  // Tunggu semua font selesai dimuat
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn("Font readiness check skipped:", e);
    }
  }

  // Simpan style asli
  const originalStyle = {
    opacity: targetElement.style.opacity,
    position: targetElement.style.position,
    left: targetElement.style.left,
    top: targetElement.style.top,
    zIndex: targetElement.style.zIndex,
    pointerEvents: targetElement.style.pointerEvents,
    visibility: targetElement.style.visibility,
  };

  // Buat elemen terlihat oleh html2canvas
  // Pindah ke posisi yang bisa diakses renderer (off-screen tapi bukan z-index negatif)
  targetElement.style.opacity = '1';
  targetElement.style.position = 'fixed';
  targetElement.style.left = '-9999px';
  targetElement.style.top = '0px';
  targetElement.style.zIndex = '99999';
  targetElement.style.pointerEvents = 'none';
  targetElement.style.visibility = 'visible';

  // Beri waktu browser untuk reflow/repaint
  await new Promise(r => setTimeout(r, 150));

  const win = window as unknown as WindowWithExportLibs;
  const h2c = win.html2canvas;

  if (!h2c) {
    // Restore style
    Object.assign(targetElement.style, originalStyle);
    if (setExportLoading) setExportLoading(null);
    throw new Error("Library html2canvas tidak ditemukan. Pastikan CDN sudah dimuat.");
  }

  try {
    // Render dengan html2canvas
    // scale: 2 untuk kualitas HiDPI, lalu resize ke 1080×1350
    const rawCanvas = await h2c(targetElement, {
      width: 1080,
      height: 1350,
      windowWidth: 1080,
      windowHeight: 1350,
      scale: 2,           // Render 2x untuk ketajaman, lalu resize
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
    });

    // Verifikasi dan resize ke 1080×1350 jika perlu
    // (html2canvas dengan scale=2 menghasilkan 2160×2700)
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 1080;
    finalCanvas.height = 1350;
    const ctx = finalCanvas.getContext('2d');

    if (!ctx) {
      throw new Error("Tidak bisa membuat canvas context 2D.");
    }

    // Draw raw canvas (2160×2700) ke final canvas (1080×1350)
    ctx.drawImage(rawCanvas, 0, 0, rawCanvas.width, rawCanvas.height, 0, 0, 1080, 1350);

    console.log(`✓ Canvas rendered: ${rawCanvas.width}×${rawCanvas.height} → final: 1080×1350`);

    return finalCanvas;

  } finally {
    // Selalu restore style asli
    targetElement.style.opacity = originalStyle.opacity;
    targetElement.style.position = originalStyle.position;
    targetElement.style.left = originalStyle.left;
    targetElement.style.top = originalStyle.top;
    targetElement.style.zIndex = originalStyle.zIndex;
    targetElement.style.pointerEvents = originalStyle.pointerEvents;
    targetElement.style.visibility = originalStyle.visibility;

    if (setExportLoading) setExportLoading(null);
  }
};

// ─── Download JPEG 1080×1350 ─────────────────────────────────────────────────
export const downloadJPEG1080 = async (
  targetElement: HTMLElement | null,
  invNumber: string,
  setExportLoading: (msg: string | null) => void,
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): Promise<void> => {
  if (!targetElement) {
    showToast("Elemen export tidak ditemukan. Coba muat ulang halaman.", "error");
    return;
  }

  const cleanInvNumber = (invNumber || 'PAC_Invoice').trim().replace(/[^a-zA-Z0-9_\-]/g, '_');

  try {
    const canvas = await render1080Canvas(
      targetElement,
      setExportLoading,
      "Membuat gambar JPEG 1080×1350..."
    );

    // Verifikasi ukuran
    if (canvas.width !== 1080 || canvas.height !== 1350) {
      console.warn(`Canvas size mismatch: ${canvas.width}×${canvas.height}, expected 1080×1350`);
    }

    canvas.toBlob(
      (blob: Blob | null) => {
        if (!blob) {
          showToast("Gagal mengompresi gambar JPEG.", "error");
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${cleanInvNumber}_1080x1350.jpg`;
        link.href = url;
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 1500);

        showToast(`✓ Gambar JPEG (1080×1350) berhasil diunduh!`, "success");
      },
      'image/jpeg',
      0.97  // Quality tinggi
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("JPEG Export Error:", err);
    showToast("Gagal membuat JPEG: " + message, "error");
  }
};

// ─── Download PDF 1080×1350 ──────────────────────────────────────────────────
export const downloadPDF1080 = async (
  targetElement: HTMLElement | null,
  invNumber: string,
  setExportLoading: (msg: string | null) => void,
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): Promise<void> => {
  if (!targetElement) {
    showToast("Elemen export tidak ditemukan. Coba muat ulang halaman.", "error");
    return;
  }

  const cleanInvNumber = (invNumber || 'PAC_Invoice').trim().replace(/[^a-zA-Z0-9_\-]/g, '_');

  try {
    const canvas = await render1080Canvas(
      targetElement,
      setExportLoading,
      "Membuat PDF 1080×1350 Portrait..."
    );

    const imgData = canvas.toDataURL('image/jpeg', 0.97);
    const win = window as unknown as WindowWithExportLibs;
    const JsPDFClass = (win.jspdf && win.jspdf.jsPDF) || win.jsPDF;

    if (!JsPDFClass) {
      showToast("Library jsPDF tidak tersedia. Coba unduh JPEG.", "error");
      return;
    }

    // PDF dengan ukuran tepat 1080×1350 px
    const pdf = new JsPDFClass({
      orientation: 'portrait',
      unit: 'px',
      format: [1080, 1350],
      hotfixes: ['px_scaling'],
      compress: true,
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, 1080, 1350, undefined, 'FAST');
    pdf.save(`${cleanInvNumber}_1080x1350.pdf`);

    showToast("✓ PDF (1080×1350) berhasil diunduh!", "success");

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("PDF 1080 Error:", err);
    showToast("Gagal membuat PDF: " + message, "error");
  }
};

// ─── Download PDF A4 (dari preview A4) ──────────────────────────────────────
export const downloadPDF = (
  previewElement: HTMLElement | null,
  invNumber: string,
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): void => {
  if (!previewElement) {
    showToast("Elemen preview invoice tidak ditemukan", "error");
    return;
  }

  showToast("Mengkonversi Invoice ke PDF A4...", "info");
  const cleanInvNumber = (invNumber || 'Invoice').trim().replace(/[^a-zA-Z0-9_\-]/g, '_');
  const win = window as unknown as WindowWithExportLibs;

  if (typeof win.html2pdf === 'undefined') {
    showToast("Library PDF tidak tersedia. Membuka dialog cetak...", "warning");
    setTimeout(() => window.print(), 400);
    return;
  }

  const opt = {
    margin: 0,
    filename: `${cleanInvNumber}_A4.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, allowTaint: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    win.html2pdf()
      .set(opt)
      .from(previewElement)
      .save()
      .then(() => {
        showToast("✓ PDF A4 berhasil diunduh!", "success");
      })
      .catch((err: unknown) => {
        console.warn("html2pdf notice:", err);
        showToast("Gagal PDF otomatis. Mengalihkan ke Cetak...", "warning");
        setTimeout(() => window.print(), 500);
      });
  } catch (err) {
    console.warn("PDF exception:", err);
    showToast("Membuka dialog cetak...", "info");
    setTimeout(() => window.print(), 400);
  }
};

// ─── Print ──────────────────────────────────────────────────────────────────
export const printInvoice = (): void => {
  window.print();
};
