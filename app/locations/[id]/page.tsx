import { LocationTasks } from "@/components/location-tasks";
export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LocationTasks locationId={id} />;
}
