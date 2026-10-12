"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Buildings, SquaresFour, SlidersHorizontal, ArrowUpRight, CaretDown, HardHat, Info } from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import { useSite } from "./site-provider";
import { initials } from "@/lib/domain";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const { data, saving, mutate } = useSite();
  const [authorOpen, setAuthorOpen] = useState(false);
  const [error, setError] = useState("");
  const person = data.people.find(person => person.id === data.currentPersonId) ?? data.people[0];
  const nav = <><Link href="/" className={`nav-link ${!isAdmin ? "selected" : ""}`} aria-current={pathname === "/" ? "page" : undefined}><SquaresFour size={22} weight={!isAdmin ? "fill" : "regular"} /><span>Overview</span></Link><Link href="/admin" className={`nav-link ${isAdmin ? "selected" : ""}`} aria-current={isAdmin ? "page" : undefined}><SlidersHorizontal size={22} /><span>Admin</span></Link></>;

  return <div className="app-layout">
    <aside className="sidebar">
      <Link href="/" className="brand" aria-label="Jay’s site log home"><span className="brand-mark">J<span>.</span></span><span>Jay’s<span className="brand-subtitle">SITE LOG</span></span></Link>
      <div className="workspace-label">WORKSPACE</div>
      <nav aria-label="Main navigation">{nav}</nav>
      <div className="sidebar-footer"><div className="site-emblem"><HardHat size={26} /></div><strong>Good work starts here.</strong><p>Keep your site moving,<br />one update at a time.</p><span className="version-label">SITE LOG · V1.0</span></div>
    </aside>
    <div className="main-column">
      <header className="topbar">
        <Link className="mobile-brand" href="/" aria-label="Jay’s site log home"><span className="brand-mark">J<span>.</span></span></Link>
        <div className="project-heading"><Buildings size={20} /><span>Jay’s construction site</span><span className="project-divider">/</span><span className="header-context">{isAdmin ? "Admin" : "Workspace"}</span></div>
        <div className="author-control">
          <button className="author-button" aria-expanded={authorOpen} aria-controls="author-menu" onClick={() => setAuthorOpen(!authorOpen)}><span className="avatar">{initials(person.name)}</span><span className="author-name">{person.name.split(" ")[0]}<small>Demo author</small></span><CaretDown size={14} /></button>
          {authorOpen && <div className="author-menu" id="author-menu"><strong>Choose a demo author</strong><p>This changes attribution only. It is not sign-in.</p>{data.people.map(member => <button key={member.id} className={member.id === person.id ? "active-person" : ""} disabled={saving} onClick={async () => { try { await mutate(current => ({ ...current, currentPersonId: member.id })); setAuthorOpen(false); setError(""); } catch (error) { setError(error instanceof Error ? error.message : "Could not switch author."); } }}><span className="avatar small">{initials(member.name)}</span>{member.name}{member.id === person.id && <span className="selection-dot" />}</button>)}{error && <p role="alert" className="form-error">{error}</p>}</div>}
        </div>
      </header>
      <div className="demo-banner"><Info size={18} /><span><strong>Local demo</strong><span className="banner-divider">·</span>Tasks and photos are saved only in this browser.</span><Link href="/admin#shared-access">About shared access <ArrowUpRight size={14} /></Link></div>
      <main id="main-content" className="page-content">{children}</main>
      <footer className="page-footer"><span>Jay’s site log</span><span>Built for the work on site.</span></footer>
    </div>
    <nav className="mobile-nav" aria-label="Mobile navigation">{nav}</nav>
  </div>;
}
