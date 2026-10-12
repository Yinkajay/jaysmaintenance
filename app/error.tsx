"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) { return <div className="empty-state"><h1>We couldn’t open this screen</h1><p>Your saved site data is still in this browser. Please try again.</p><button className="button primary" onClick={reset}>Try again</button><Link className="text-link" href="/">Back to overview</Link></div>; }
