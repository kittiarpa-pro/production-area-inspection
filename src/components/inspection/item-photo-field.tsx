"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { compressImageFile } from "@/lib/compress-image";
import type { ItemPhoto } from "@/lib/checklist-data";

type Props = {
  photo: ItemPhoto | null;
  onChange: (photo: ItemPhoto | null) => void;
};

export function ItemPhotoField({ photo, onChange }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const compressed = await compressImageFile(file);
      onChange(compressed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "แนบรูปไม่สำเร็จ");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="photo-field">
      <div className="photo-actions">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          disabled={busy}
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="size-3.5" />
          {busy ? "กำลังย่อรูป…" : photo ? "เปลี่ยนรูป" : "เพิ่มรูปภาพ"}
        </Button>
        <span className="photo-optional">ไม่บังคับ</span>
        {photo ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
            aria-label="ลบรูป"
          >
            <Trash2 className="size-3.5" />
            ลบรูป
          </Button>
        ) : null}
      </div>
      {error ? <p className="photo-error">{error}</p> : null}
      {photo ? (
        <figure className="photo-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.dataUrl} alt={`หลักฐาน: ${photo.name}`} />
          <figcaption>{photo.name}</figcaption>
        </figure>
      ) : null}
    </div>
  );
}
