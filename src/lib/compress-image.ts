/** Resize/compress an image file to a JPEG data URL for draft storage. */
export function compressImageFile(
  file: File,
  options: { maxEdge?: number; quality?: number } = {},
): Promise<{ dataUrl: string; name: string }> {
  const maxEdge = options.maxEdge ?? 1280;
  const quality = options.quality ?? 0.72;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("กรุณาเลือกไฟล์รูปภาพเท่านั้น"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("อ่านไฟล์รูปไม่สำเร็จ"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("เปิดรูปภาพไม่สำเร็จ"));
      img.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("ไม่รองรับการย่อรูปบนเบราว์เซอร์นี้"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve({ dataUrl, name: file.name });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
