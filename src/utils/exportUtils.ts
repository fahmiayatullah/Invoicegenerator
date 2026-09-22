// ==========================================
// EXPORT UTILITIES (Canvas, JPEG 1080, PDF 1080, PDF A4)
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

export const render1080Canvas = async (
  targetElement: HTMLElement,
  setExportLoading?: (loadingText: string | null) => void,
  taskName: string = "Menyiapkan Canvas HD..."
): Promise<HTMLCanvasElement> => {
  if (setExportLoading) setExportLoading(taskName);

  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn("Font readiness skipped:", e);
    }
  }

  const originalZIndex = targetElement.style.zIndex;
  const originalOpacity = targetElement.style.opacity;
  const originalPointerEvents = targetElement.style.pointerEvents;

  targetElement.style.opacity = '1';
  targetElement.style.zIndex = '99998';
  targetElement.style.pointerEvents = 'none';
  targetElement.style.left = '0px';
  targetElement.style.top = '0px';

  await new Promise(r => setTimeout(r, 120));

  const win = window as unknown as WindowWithExportLibs;
  const h2c = win.html2canvas || (win.html2pdf && win.html2pdf().html2canvas);

  if (!h2c) {
    targetElement.style.zIndex = originalZIndex;
    targetElement.style.opacity = originalOpacity;
    targetElement.style.pointerEvents = originalPointerEvents;
    if (setExportLoading) setExportLoading(null);
    throw new Error("Library html2canvas tidak ditemukan.");
  }

  try {
    const canvas = await h2c(targetElement, {
      width: 1080,
      height: 1350,
      windowWidth: 1080,
      windowHeight: 1350,
      scale: 1,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    });
    return canvas;
  } finally {
    targetElement.style.zIndex = originalZIndex;
    targetElement.style.opacity = originalOpacity;
    targetElement.style.pointerEvents = originalPointerEvents;
    if (setExportLoading) setExportLoading(null);
  }
};

export const downloadJPEG1080 = async (
  targetElement: HTMLElement | null,
  invNumber: string,
  setExportLoading: (msg: string | null) => void,
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): Promise<void> => {
  if (!targetElement) {
    showToast("Elemen export tidak ditemukan", "error");
    return;
  }
  const cleanInvNumber = invNumber.trim() || 'PAC_Invoice';
  try {
    const canvas = await render1080Canvas(targetElement, setExportLoading, "Mengenerate JPEG 1080×1350 HD...");
    canvas.toBlob((blob: Blob | null) => {
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
      }, 1000);
      showToast("Gambar JPEG (1080×1350) berhasil diunduh!", "success");
    }, 'image/jpeg', 0.96);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("JPEG Export Error:", err);
    showToast("Gagal memproses JPEG: " + message, "error");
  }
};

export const downloadPDF1080 = async (
  targetElement: HTMLElement | null,
  invNumber: string,
  setExportLoading: (msg: string | null) => void,
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): Promise<void> => {
  if (!targetElement) {
    showToast("Elemen export tidak ditemukan", "error");
    return;
  }
  const cleanInvNumber = invNumber.trim() || 'PAC_Invoice';
  try {
    const canvas = await render1080Canvas(targetElement, setExportLoading, "Mengenerate PDF 1080×1350 Portrait...");
    const imgData = canvas.toDataURL('image/jpeg', 0.96);
    const win = window as unknown as WindowWithExportLibs;
    const JsPDFClass = (win.jspdf && win.jspdf.jsPDF) || win.jsPDF;

    if (!JsPDFClass) {
      showToast("Library jsPDF tidak ditemukan.", "error");
      return;
    }

    const pdf = new JsPDFClass({
      orientation: 'portrait',
      unit: 'px',
      format: [1080, 1350],
      hotfixes: ['px_scaling']
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, 1080, 1350, undefined, 'FAST');
    pdf.save(`${cleanInvNumber}_1080x1350.pdf`);
    showToast("PDF (1080×1350) berhasil diunduh!", "success");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("PDF 1080 Error:", err);
    showToast("Gagal memproses PDF 1080x1350: " + message, "error");
  }
};

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
  const cleanInvNumber = invNumber || 'Invoice';
  const win = window as unknown as WindowWithExportLibs;

  if (typeof win.html2pdf === 'undefined') {
    showToast("Library PDF tidak tersedia. Membuka dialog cetak...", "warning");
    setTimeout(() => window.print(), 400);
    return;
  }

  const opt = {
    margin: 0,
    filename: `${cleanInvNumber}_GagalJadiFilsuf.pdf`,
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
        showToast("PDF A4 berhasil diunduh!", "success");
      })
      .catch((err: unknown) => {
        console.warn("html2pdf processing notice:", err);
        showToast("Gagal menghasilkan file otomatis. Mengalihkan ke Cetak...", "warning");
        setTimeout(() => window.print(), 500);
      });
  } catch (err) {
    console.warn("PDF generator exception:", err);
    showToast("Membuka dialog cetak...", "info");
    setTimeout(() => window.print(), 400);
  }
};

export const printInvoice = (): void => {
  window.print();
};
