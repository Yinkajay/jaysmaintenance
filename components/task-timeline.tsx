"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChatCircleText, MapPin, PaperPlaneTilt, ArrowCounterClockwise } from "@phosphor-icons/react";
import { useSite } from "./site-provider";
import { addTaskUpdate, initials } from "@/lib/domain";
import { PhotoInput } from "./photo-input";
import { PhotoViewer } from "./photo-viewer";

export function TaskTimeline({ taskId }: { taskId: string }) {
  const { data, saving, mutate } = useSite();
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const task = data.tasks.find(task => task.id === taskId);
  if (!task) return <div className="empty-state"><ChatCircleText size={32} /><h1>Task not found</h1><p>This task may have been removed from your browser’s demo.</p><Link href="/" className="button primary">Back to overview</Link></div>;
  const location = data.locations.find(location => location.id === task.locationId);
  const back = location ? `/locations/${location.id}` : "/general";
  const person = data.people.find(person => person.id === data.currentPersonId) ?? data.people[0];
  const updates = data.updates.filter(update => update.taskId === taskId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  async function post(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) { setError("Write a short update before posting."); return; }
    setError(""); setNotice("");
    try {
      await mutate(current => addTaskUpdate(current, { id: crypto.randomUUID(), taskId, authorId: person.id, authorName: person.name, createdAt: new Date().toISOString(), text, ...(photo ? { photo } : {}) }));
      setText(""); setPhoto(""); setNotice("Update saved in this browser.");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save your update."); }
  }
  async function toggleStatus() {
    setError(""); setNotice("");
    try { await mutate(current => ({ ...current, tasks: current.tasks.map(item => item.id === taskId ? { ...item, status: item.status === "open" ? "done" : "open" } : item) })); setNotice(task?.status === "open" ? "Task marked complete." : "Task reopened."); }
    catch (error) { setError(error instanceof Error ? error.message : "Could not update task status."); }
  }

  return <>
    <Link href={back} className="back-link"><ArrowLeft size={18} />Back to {location?.name ?? "general tasks"}</Link>
    <div className="task-detail-heading"><Link href={back} className="task-location-label"><MapPin size={15} />{location?.name ?? "General tasks"}<ArrowUpRight size={14} /></Link><div className="task-title-line"><h1>{task.title}</h1><span className={`status-badge ${task.status}`}>{task.status === "done" && <Check size={14} />}{task.status === "open" ? "Open" : "Completed"}</span></div><p>{task.description || "Add an update below to keep the team informed."}</p><button className="button secondary status-action" disabled={saving} onClick={() => void toggleStatus()}>{task.status === "open" ? <Check size={18} /> : <ArrowCounterClockwise size={18} />}{task.status === "open" ? "Mark complete" : "Reopen task"}</button></div>
    <div className="timeline-layout"><section className="timeline-section" aria-labelledby="timeline-heading"><div className="section-heading"><div className="section-title"><h2 id="timeline-heading">Update timeline</h2><span className="muted-count">{updates.length}</span></div><span className="small-muted">Newest first</span></div>
      {updates.length ? <div className="timeline">{updates.map(update => <article key={update.id} className="timeline-entry"><span className={`avatar timeline-avatar color-${data.people.findIndex(person => person.id === update.authorId) % 3}`}>{initials(update.authorName)}</span><div className="timeline-entry-body"><div className="update-heading"><strong>{update.authorName}</strong><time dateTime={update.createdAt}>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(update.createdAt))}</time></div><p className="update-text">{update.text}</p>{update.photo && <PhotoViewer src={update.photo} alt={`Site photo added by ${update.authorName}`} />}</div></article>)}</div> : <div className="empty-state timeline-empty"><ChatCircleText size={32} /><h3>The first update starts here</h3><p>Share what’s been done or what needs attention. Add a photo if it helps.</p></div>}
    </section><section className="update-composer" aria-labelledby="composer-heading"><div className="composer-title"><span className="section-icon"><ChatCircleText size={21} /></span><h2 id="composer-heading">Add an update</h2></div><div className="posting-as"><span className="avatar small">{initials(person.name)}</span><div>Posting as <strong>{person.name}</strong><small>Demo author · no authentication</small></div></div><form onSubmit={post}><label htmlFor="update-text">What’s happening on site?</label><textarea id="update-text" value={text} onChange={event => setText(event.target.value)} placeholder="Work completed, progress, or anything that needs attention…" rows={5} maxLength={1000} required disabled={saving} /><div className="character-count">{text.length} / 1,000</div><PhotoInput value={photo} onChange={setPhoto} onBusy={setPhotoBusy} disabled={saving} label="Photo (optional)" />{error && <p role="alert" className="form-error">{error}</p>}{notice && <p role="status" className="form-success">{notice}</p>}<button className="button primary post-button" type="submit" disabled={saving || photoBusy}>{saving ? "Saving update…" : "Post update"}<PaperPlaneTilt size={19} /></button><p className="local-save-note">Saved on this device, in this browser.</p></form></section></div>
  </>;
}
