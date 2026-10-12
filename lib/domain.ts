import type { SiteData, TaskUpdate } from "./types";

export function openTaskCount(data: SiteData, locationId: string | null) {
  return data.tasks.filter(task => task.locationId === locationId && task.status === "open").length;
}

export function addTaskUpdate(data: SiteData, update: TaskUpdate): SiteData {
  if (!data.tasks.some(task => task.id === update.taskId)) throw new Error("This task no longer exists.");
  if (!data.people.some(person => person.id === update.authorId)) throw new Error("Choose a demo author before adding an update.");
  if (!update.text.trim()) throw new Error("Write a short update before posting.");
  if (update.text.trim().length > 1000) throw new Error("Keep your update under 1,000 characters.");
  return { ...data, updates: [...data.updates, { ...update, text: update.text.trim() }] };
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase();
}

export function relativeTime(date: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));
}
