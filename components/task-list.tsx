"use client";

import Link from "next/link";
import { ArrowRight, Check, ChatCircleText, ClipboardText, CaretRight } from "@phosphor-icons/react";
import { useState } from "react";
import { relativeTime } from "@/lib/domain";
import { useSite } from "./site-provider";
import type { Task } from "@/lib/types";

export function TaskRow({ task, showLocation = false }: { task: Task; showLocation?: boolean }) {
  const { data } = useSite();
  const updates = data.updates.filter(update => update.taskId === task.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const location = data.locations.find(location => location.id === task.locationId);
  return <Link className={`task-row ${task.status === "done" ? "task-done" : ""}`} href={`/tasks/${task.id}`}>
    <span className={`task-state-icon ${task.status}`} aria-label={task.status === "open" ? "Open task" : "Completed task"}>{task.status === "done" ? <Check size={18} weight="bold" /> : <span />}</span>
    <div className="task-row-copy"><h3>{task.title}</h3><div className="task-meta">{showLocation && <span>{location?.name ?? "General"}<span className="meta-dot">·</span></span>}<span>{updates.length ? `Updated ${relativeTime(updates[0].createdAt).toLowerCase()}` : "No updates yet"}</span></div></div>
    <span className="update-count" aria-label={`${updates.length} updates`}><ChatCircleText size={17} />{updates.length}</span><CaretRight size={18} className="row-arrow" />
  </Link>;
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<"open" | "done" | "all">("open");
  const filtered = tasks.filter(task => filter === "all" || task.status === filter);
  return <>
    <div className="list-toolbar"><div className="segmented-control" aria-label="Filter tasks">{(["open", "done", "all"] as const).map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)} className={filter === value ? "selected" : ""}>{value === "done" ? "Completed" : value === "open" ? "Open" : "All"}<span>{tasks.filter(task => value === "all" || task.status === value).length}</span></button>)}</div><span className="list-hint">Tap a task to add an update</span></div>
    <div className="task-list">{filtered.length ? filtered.map(task => <TaskRow key={task.id} task={task} />) : <div className="empty-state"><ClipboardText size={32} /><h3>{filter === "done" ? "No completed tasks yet" : filter === "open" && tasks.length ? "All caught up" : "No tasks here yet"}</h3><p>{tasks.length ? "Switch the filter to see your other tasks." : "Add a task in Admin to get started."}</p>{!tasks.length && <Link href="/admin?tab=tasks" className="button secondary">Create a task <ArrowRight size={18} /></Link>}</div>}</div>
  </>;
}
