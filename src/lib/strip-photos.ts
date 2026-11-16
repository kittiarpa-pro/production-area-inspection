import type { InspectionForm } from "./checklist-data";

/** Drop image bytes before network upload — sheets store name/has_photo only. */
export function formWithoutPhotoBytes(form: InspectionForm): InspectionForm {
  const items = Object.fromEntries(
    Object.entries(form.items).map(([id, answer]) => [
      id,
      {
        ...answer,
        photo: answer.photo
          ? { name: answer.photo.name, dataUrl: "" }
          : null,
      },
    ]),
  );
  return { ...form, items };
}
