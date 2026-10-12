import { Suspense } from "react";
import type { Metadata } from "next";
import { Admin } from "@/components/admin";
export const metadata: Metadata = { title: "Site admin" };
export default function AdminPage() { return <Suspense fallback={<div className="skeleton skeleton-card" aria-label="Loading Admin" />}><Admin /></Suspense>; }
