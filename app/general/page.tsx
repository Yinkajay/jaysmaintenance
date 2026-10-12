import type { Metadata } from "next";
import { LocationTasks } from "@/components/location-tasks";
export const metadata: Metadata = { title: "General tasks" };
export default function GeneralPage() { return <LocationTasks />; }
