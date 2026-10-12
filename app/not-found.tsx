import Link from "next/link";
export default function NotFound() { return <div className="empty-state"><span className="eyebrow">JAY’S SITE LOG · 404</span><h1>This area isn’t on the plan</h1><p>Return to your site overview to find your tasks and locations.</p><Link className="button primary" href="/">Back to overview</Link></div>; }
