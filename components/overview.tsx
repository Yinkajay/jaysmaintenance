"use client";

import Link from "next/link";
import { ArrowRight, MapPin, ClipboardText, Plus, ArrowUpRight } from "@phosphor-icons/react";
import { openTaskCount } from "@/lib/domain";
import { useSite } from "./site-provider";
import { TaskRow } from "./task-list";

export function Overview() {
  const { data } = useSite();
  const general = data.tasks.filter(task => task.locationId === null && task.status === "open");
  return <>
    <div className="page-heading"><div><div className="eyebrow"><span className="tiny-square" /> YOUR SITE, AT A GLANCE</div><h1>Site overview<span className="heading-period">.</span></h1><p>The day’s work. All in one place.</p></div><Link href="/admin?tab=tasks" className="button secondary heading-action"><Plus size={18} />Create task</Link></div>
    <section className="general-section" aria-labelledby="general-heading">
      <div className="section-heading"><div className="section-title"><span className="section-icon"><ClipboardText size={21} /></span><h2 id="general-heading">General tasks</h2><span className="count-badge">{openTaskCount(data, null)} open</span></div><Link className="text-link" href="/general">View all <ArrowRight size={17} /></Link></div>
      <p className="section-description">Sitewide work that isn’t tied to a location.</p>
      <div className="task-list home-tasks">{general.length ? general.slice(0, 3).map(task => <TaskRow key={task.id} task={task} />) : <div className="compact-empty"><ClipboardText size={24} /><div><strong>{data.tasks.some(task => task.locationId === null) ? "All general tasks are complete" : "No general tasks yet"}</strong><p>Create sitewide tasks in Admin, or view completed tasks.</p></div><Link href="/general" className="text-link">Open tasks <ArrowRight size={18} /></Link></div>}</div>
    </section>
    <section aria-labelledby="locations-heading" className="locations-section">
      <div className="section-heading"><div className="section-title"><span className="section-icon"><MapPin size={21} /></span><h2 id="locations-heading">Locations</h2><span className="muted-count">{data.locations.length}</span></div><Link className="text-link" href="/admin?tab=locations"><Plus size={17} />Add location</Link></div>
      <p className="section-description">Choose an area to see what’s happening.</p>
      {data.locations.length ? <div className="location-grid">{data.locations.map((location, index) => {
        const count = openTaskCount(data, location.id);
        return <Link className="location-card" href={`/locations/${location.id}`} key={location.id}><div className="location-image"><img src={location.cover} alt={`Construction area at ${location.name}`} /><span className="location-number">{String(index + 1).padStart(2, "0")}</span><span className={`image-count ${!count ? "complete" : ""}`}><span />{count} open {count === 1 ? "task" : "tasks"}</span><span className="location-open"><ArrowUpRight size={20} /></span></div><div className="location-card-copy"><h3>{location.name}</h3><p>{location.description || "View tasks and site updates"}</p><ArrowRight size={20} /></div></Link>;
      })}</div> : <div className="empty-state"><MapPin size={32} /><h3>Your site starts here</h3><p>Add your first location and a cover photo in Admin.</p><Link href="/admin?tab=locations" className="button primary"><Plus size={18} />Add a location</Link></div>}
    </section>
    <div className="overview-note"><span className="note-line" /><p>A clear picture of the work.<br /><strong>One update at a time.</strong></p><span className="note-line" /></div>
  </>;
}
