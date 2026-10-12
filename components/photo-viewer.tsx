"use client";

import { useRef } from "react";
import { ArrowsOut, X } from "@phosphor-icons/react";

export function PhotoViewer({ src, alt }: { src: string; alt: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button className="timeline-photo" onClick={() => dialog.current?.showModal()} aria-label={`View photo: ${alt}`}><img src={src} alt={alt} /><span><ArrowsOut size={18} />View photo</span></button>
    <dialog ref={dialog} className="photo-dialog" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} aria-label="Update photo"><button type="button" className="icon-button dialog-close" aria-label="Close photo" onClick={() => dialog.current?.close()}><X size={24} /></button><img src={src} alt={alt} /></dialog>
  </>;
}
