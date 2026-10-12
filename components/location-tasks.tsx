"use client";

import Link from "next/link";
import { ArrowLeft, Plus, MapPin, ClipboardText } from "@phosphor-icons/react";
import { useSite } from "./site-provider";
import { TaskList } from "./task-list";
import { openTaskCount } from "@/lib/domain";

export function LocationTasks({ locationId = null }: { locationId?: string | null }) {
  const { data } = useSite();
  const location = data.locations.find(location => location.id === locationId);
  if (locationId && !location) return <div className="empty-state"><MapPin size={32} /><h1>Location not found</h1><p>This location may have been removed from your browser’s demo.</p><Link className="button primary" href="/">Back to overview</Link></div>;
  const tasks = data.tasks.filter(task => task.locationId === locationId);
  return <>
    <Link href="/" className="back-link"><ArrowLeft size={18} />Back to overview</Link>
    {location && <div className="location-hero"><img src={location.cover} alt={`Construction area at ${location.name}`} /><span className="hero-label"><MapPin size={16} />SITE LOCATION</span></div>}
    <div className="page-heading detail-heading"><div><div className="eyebrow">{location ? "LOCATION TASKS" : "SITEWIDE WORK"}</div><h1>{location?.name ?? "General tasks"}</h1><p>{location?.description || "Work that isn’t tied to a specific location."}</p></div><Link href={`/admin?tab=tasks${location ? `&location=${location.id}` : ""}`} className="button secondary"><Plus size={18} />Create task</Link></div>
    <div className="section-heading task-section-heading"><div className="section-title"><span className="section-icon"><ClipboardText size={21} /></span><h2>Tasks</h2><span className="count-badge">{openTaskCount(data, locationId)} open</span></div></div>
    <TaskList tasks={tasks} />
  </>;
}
