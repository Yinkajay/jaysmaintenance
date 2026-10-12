"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, MapPin, ClipboardText, Users, PencilSimple, Check, LockKey, Database, ArrowRight } from "@phosphor-icons/react";
import { useSite } from "./site-provider";
import { PhotoInput } from "./photo-input";
import { initials, openTaskCount } from "@/lib/domain";
import type { Location, Task } from "@/lib/types";

type Tab = "locations" | "tasks" | "people";

export function Admin() {
  const query = useSearchParams();
  const initialTab = query.get("tab");
  const [tab, setTab] = useState<Tab>(initialTab === "tasks" || initialTab === "people" ? initialTab : "locations");
  const { data, saving, mutate } = useSite();
  const [reset, setReset] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetNotice, setResetNotice] = useState("");

  return <>
    <Link href="/" className="back-link"><ArrowLeft size={18} />Back to overview</Link>
    <div className="page-heading"><div><div className="eyebrow">SET UP YOUR SITE</div><h1>Site admin<span className="heading-period">.</span></h1><p>The right places. The right work. Ready for your team.</p></div><span className="demo-label">Demo admin · unrestricted</span></div>
    <div className="admin-tabs" aria-label="Admin sections">{([{ id: "locations", label: "Locations", icon: MapPin }, { id: "tasks", label: "Tasks", icon: ClipboardText }, { id: "people", label: "People & access", icon: Users }] as const).map(item => <button type="button" key={item.id} className={tab === item.id ? "selected" : ""} aria-pressed={tab === item.id} onClick={() => setTab(item.id)}><item.icon size={19} />{item.label}</button>)}</div>
    {tab === "locations" && <LocationAdmin />}
    {tab === "tasks" && <TaskAdmin initialLocation={query.get("location")} />}
    {tab === "people" && <PeopleAdmin />}
    <section id="shared-access" className="shared-access" aria-labelledby="shared-heading"><div className="shared-heading"><span className="section-icon"><LockKey size={22} /></span><div><div className="eyebrow">BEFORE YOUR TEAM USES THIS</div><h2 id="shared-heading">Make it a shared site</h2></div></div><p>This version stores tasks, updates and photos only in this browser. Clearing browser data removes them. Other devices and tabs don’t sync, and demo authors and Admin have no access protection.</p><div className="setup-points"><div><Database size={22} /><h3>Connect a backend</h3><p>Use a shared database for tasks and updates, plus private file storage for photos.</p></div><div><Users size={22} /><h3>Create accounts privately</h3><p>The admin creates each account with its own PIN. No public sign-up. Verify hashed PINs on the server, with rate limits and secure sessions.</p></div><div><LockKey size={22} /><h3>Protect every action</h3><p>Check membership and admin permissions on the server. Restrict photo access and validate uploads.</p></div></div><p className="setup-reference">Implementation plan and data model are in <code>README.md</code> and <code>docs/backend-plan.md</code>.</p></section>
    <section className="reset-section"><div><h3>Make these examples your own</h3><p>Edit the sample locations and tasks above, or clear them and start fresh. This affects only this browser.</p></div>{!reset ? <button className="button secondary" onClick={() => setReset(true)}>Start with an empty site</button> : <div className="reset-confirm"><p>Remove all locations, tasks, updates and photos? The demo roster will stay. This cannot be undone.</p><div><button className="button danger" disabled={saving} onClick={async () => { setResetError(""); try { await mutate(current => ({ ...current, locations: [], tasks: [], updates: [] })); setReset(false); setResetNotice("Site cleared. Add your first location or general task above."); } catch (error) { setResetError(error instanceof Error ? error.message : "Could not clear local data."); } }}>Clear local site</button><button className="button secondary" disabled={saving} onClick={() => setReset(false)}>Keep my site</button></div></div>}{resetError && <p className="form-error" role="alert">{resetError}</p>}{resetNotice && <p className="form-success" role="status">{resetNotice}</p>}</section>
    <p className="admin-footnote">{data.tasks.length} tasks · {data.locations.length} locations · Saved in this browser</p>
  </>;
}

function LocationAdmin() {
  const { data, saving, mutate } = useSite();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  function edit(location: Location) { setEditingId(location.id); setName(location.name); setDescription(location.description); setCover(location.cover); setError(""); setNotice(""); document.getElementById("location-name")?.focus(); }
  function clear() { setEditingId(null); setName(""); setDescription(""); setCover(""); setError(""); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    if (!name.trim()) return setError("Give this location a name.");
    if (!cover) return setError("Add a cover photo for this location.");
    try {
      await mutate(current => {
        if (current.locations.some(location => location.id !== editingId && location.name.toLowerCase() === name.trim().toLowerCase())) throw new Error("A location with this name already exists.");
        const location: Location = { id: editingId ?? crypto.randomUUID(), name: name.trim(), description: description.trim(), cover };
        return { ...current, locations: editingId ? current.locations.map(item => item.id === editingId ? location : item) : [...current.locations, location] };
      });
      setNotice(editingId ? "Location updated." : "Location added. You can now create tasks for it."); clear();
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save this location."); }
  }
  return <div className="admin-layout"><section className="admin-form-panel"><div className="panel-heading"><h2>{editingId ? "Edit location" : "Add a location"}</h2><p>Give each work area a name and a clear cover photo.</p></div><form onSubmit={save}><label htmlFor="location-name">Location name</label><input id="location-name" placeholder="e.g. North block" maxLength={80} value={name} onChange={event => setName(event.target.value)} required disabled={saving} /><label htmlFor="location-description">Short description <span>(optional)</span></label><input id="location-description" placeholder="e.g. Foundations & structural works" maxLength={140} value={description} onChange={event => setDescription(event.target.value)} disabled={saving} /><label>Cover photo</label><PhotoInput value={cover} onChange={setCover} onBusy={setPhotoBusy} disabled={saving} label="JPG, PNG or WebP · up to 12 MB" />{error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success" role="status">{notice}</p>}<div className="form-actions"><button className="button primary" disabled={saving || photoBusy} type="submit">{saving ? "Saving…" : editingId ? "Save location" : "Add location"}{editingId ? <Check size={18} /> : <Plus size={18} />}</button>{editingId && <button type="button" className="button secondary" disabled={saving || photoBusy} onClick={clear}>Cancel edit</button>}</div></form></section><section className="admin-existing"><div className="section-heading"><h2>Your locations</h2><span className="muted-count">{data.locations.length}</span></div>{data.locations.length ? <div className="admin-item-list">{data.locations.map(location => <article className="admin-location-item" key={location.id}><img src={location.cover} alt={location.name} /><div><Link href={`/locations/${location.id}`}>{location.name}</Link><p>{openTaskCount(data, location.id)} open tasks</p></div><button className="icon-button" disabled={saving || photoBusy} aria-label={`Edit ${location.name}`} onClick={() => edit(location)}><PencilSimple size={19} /></button></article>)}</div> : <div className="empty-state"><MapPin size={30} /><h3>No locations yet</h3><p>Add your first work area using the form.</p></div>}</section></div>;
}

function TaskAdmin({ initialLocation }: { initialLocation: string | null }) {
  const { data, saving, mutate } = useSite();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationId, setLocationId] = useState(data.locations.some(location => location.id === initialLocation) ? initialLocation! : "");
  const [status, setStatus] = useState<"open" | "done">("open");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  function clear() { setEditingId(null); setTitle(""); setDescription(""); setStatus("open"); setError(""); }
  function edit(task: Task) { setEditingId(task.id); setTitle(task.title); setDescription(task.description); setLocationId(task.locationId ?? ""); setStatus(task.status); setError(""); setNotice(""); document.getElementById("task-title")?.focus(); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    if (!title.trim()) return setError("Give this task a title.");
    try {
      await mutate(current => {
        if (locationId && !current.locations.some(location => location.id === locationId)) throw new Error("Choose an existing location, or General tasks.");
        const task: Task = { id: editingId ?? crypto.randomUUID(), title: title.trim(), description: description.trim(), locationId: locationId || null, status, createdAt: current.tasks.find(item => item.id === editingId)?.createdAt ?? new Date().toISOString() };
        return { ...current, tasks: editingId ? current.tasks.map(item => item.id === editingId ? task : item) : [...current.tasks, task] };
      });
      setNotice(editingId ? "Task updated." : "Task added. Add another to prepare your task list."); clear();
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save this task."); }
  }
  return <div className="admin-layout"><section className="admin-form-panel"><div className="panel-heading"><h2>{editingId ? "Edit task" : "Create a task"}</h2><p>Add tasks ahead of the work. Choose a location or keep them general.</p></div><form onSubmit={save}><label htmlFor="task-title">Task title</label><input id="task-title" value={title} placeholder="e.g. Inspect roof reinforcement" maxLength={120} onChange={event => setTitle(event.target.value)} required disabled={saving} /><label htmlFor="task-description">Details <span>(optional)</span></label><textarea id="task-description" rows={4} maxLength={1000} value={description} placeholder="What needs to be done?" onChange={event => setDescription(event.target.value)} disabled={saving} /><label htmlFor="task-location">Location</label><select id="task-location" value={locationId} onChange={event => setLocationId(event.target.value)} disabled={saving}><option value="">General tasks · no specific location</option>{data.locations.map(location => <option key={location.id} value={location.id}>{location.name}</option>)}</select>{editingId && <><label htmlFor="task-status">Status</label><select id="task-status" value={status} onChange={event => setStatus(event.target.value as "open" | "done")} disabled={saving}><option value="open">Open</option><option value="done">Completed</option></select></>}{error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success" role="status">{notice}</p>}<div className="form-actions"><button className="button primary" disabled={saving} type="submit">{saving ? "Saving…" : editingId ? "Save task" : "Create task"}{editingId ? <Check size={18} /> : <Plus size={18} />}</button>{editingId && <button className="button secondary" type="button" disabled={saving} onClick={clear}>Cancel edit</button>}</div></form></section><section className="admin-existing"><div className="section-heading"><h2>Your tasks</h2><span className="muted-count">{data.tasks.length}</span></div>{data.tasks.length ? <div className="admin-item-list">{data.tasks.map(task => <article className="admin-task-item" key={task.id}><span className={`task-state-icon ${task.status}`}>{task.status === "done" ? <Check size={17} /> : <span />}</span><div><Link href={`/tasks/${task.id}`}>{task.title}</Link><p>{data.locations.find(location => location.id === task.locationId)?.name ?? "General tasks"} · {task.status === "done" ? "Completed" : "Open"}</p></div><button className="icon-button" disabled={saving} aria-label={`Edit ${task.title}`} onClick={() => edit(task)}><PencilSimple size={19} /></button></article>)}</div> : <div className="empty-state"><ClipboardText size={30} /><h3>No tasks yet</h3><p>Create a general task or choose a location.</p></div>}</section></div>;
}

function PeopleAdmin() {
  const { data, saving, mutate } = useSite();
  const [name, setName] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    if (!name.trim()) return setError("Enter a name for this demo member.");
    try { await mutate(current => ({ ...current, people: [...current.people, { id: crypto.randomUUID(), name: name.trim(), role }] })); setName(""); setNotice("Demo member added. Choose them from the author menu to try update attribution."); }
    catch (error) { setError(error instanceof Error ? error.message : "Could not save this member."); }
  }
  return <div className="admin-layout"><section className="admin-form-panel"><div className="panel-heading"><h2>Add a demo member</h2><p>Try individual update attribution. This creates a local roster entry, not a user account.</p></div><form onSubmit={save}><label htmlFor="member-name">Full name</label><input id="member-name" value={name} onChange={event => setName(event.target.value)} maxLength={80} required disabled={saving} placeholder="Team member’s name" /><label htmlFor="member-role">Planned role</label><select id="member-role" value={role} onChange={event => setRole(event.target.value as "member" | "admin")} disabled={saving}><option value="member">Member</option><option value="admin">Admin</option></select><div className="pin-notice"><LockKey size={22} /><div><strong>PIN setup needs a backend</strong><p>Individual PINs must be verified securely on the server. PIN collection is unavailable in this demo.</p></div></div>{error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success" role="status">{notice}</p>}<button className="button primary" disabled={saving} type="submit">Add demo member <Plus size={18} /></button></form></section><section className="admin-existing"><div className="section-heading"><h2>Demo roster</h2><span className="muted-count">{data.people.length}</span></div><div className="admin-item-list">{data.people.map(person => <article className="admin-person-item" key={person.id}><span className="avatar">{initials(person.name)}</span><div><strong>{person.name}</strong><p>{person.role === "admin" ? "Planned admin" : "Planned member"} · No PIN configured</p></div></article>)}</div><p className="roster-note">Roles are planning labels. The demo does not enforce permissions.</p><Link href="#shared-access" className="text-link">Read the shared access plan <ArrowRight size={17} /></Link></section></div>;
}
