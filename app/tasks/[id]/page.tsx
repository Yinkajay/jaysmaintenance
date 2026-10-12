import { TaskTimeline } from "@/components/task-timeline";
export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TaskTimeline taskId={id} />;
}
