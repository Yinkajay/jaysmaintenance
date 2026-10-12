"use client";

import { useRef, useState } from "react";
import { Camera, UploadSimple, X } from "@phosphor-icons/react";
import { preparePhoto } from "@/lib/photo";

export function PhotoInput({ value, onChange, onBusy, disabled = false, label = "Attach a photo" }: { value: string; onChange: (value: string) => void; onBusy?: (busy: boolean) => void; disabled?: boolean; label?: string }) {
  const camera = useRef<HTMLInputElement>(null);
  const upload = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  async function select(file?: File) {
    if (!file) return;
    setError("");
    setProcessing(true);
    onBusy?.(true);
    try { onChange(await preparePhoto(file)); }
    catch (error) { setError(error instanceof Error ? error.message : "Could not attach this photo."); }
    finally { setProcessing(false); onBusy?.(false); }
  }
  return <div className="photo-input">
    {value && <div className="photo-preview"><img src={value} alt="Photo ready to attach" /><button type="button" className="icon-button remove-photo" disabled={disabled || processing} onClick={() => onChange("")} aria-label="Remove attached photo"><X size={20} /></button></div>}
    <div className="photo-buttons"><span className="photo-label">{label}</span><button className="button secondary" type="button" disabled={disabled || processing} onClick={() => camera.current?.click()}><Camera size={19} />Take photo</button><button className="button secondary" type="button" disabled={disabled || processing} onClick={() => upload.current?.click()}><UploadSimple size={19} />Upload</button></div>
    <input ref={camera} type="file" accept="image/*" capture="environment" className="visually-hidden" tabIndex={-1} onChange={event => { void select(event.target.files?.[0]); event.target.value = ""; }} aria-label="Take a photo with your camera" />
    <input ref={upload} type="file" accept="image/*" className="visually-hidden" tabIndex={-1} onChange={event => { void select(event.target.files?.[0]); event.target.value = ""; }} aria-label="Upload a photo" />
    {processing && <div className="photo-processing" role="status"><div className="skeleton skeleton-line" />Preparing your photo…</div>}
    {error && <p className="form-error" role="alert">{error}</p>}
  </div>;
}
