const MAX_FILE_BYTES = 12 * 1024 * 1024;

/** Resize phone photos before putting them in local IndexedDB. */
export async function preparePhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") throw new Error("Choose a JPG, PNG, WebP or another supported photo.");
  if (file.size > MAX_FILE_BYTES) throw new Error("Choose a photo smaller than 12 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Photo processing is unavailable in this browser.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch (error) {
    if (error instanceof Error && error.message.includes("unavailable")) throw error;
    throw new Error("This photo could not be opened. Try a JPG or PNG. For HEIC photos, export as JPG first.");
  } finally {
    URL.revokeObjectURL(url);
  }
}
