export type TaskStatus = "open" | "done";
export type Person = { id: string; name: string; role: "admin" | "member" };
export type Location = { id: string; name: string; description: string; cover: string };
export type Task = {
  id: string;
  title: string;
  description: string;
  locationId: string | null;
  status: TaskStatus;
  createdAt: string;
};
export type TaskUpdate = {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  text: string;
  photo?: string;
};
export type SiteData = {
  version: 1;
  locations: Location[];
  tasks: Task[];
  updates: TaskUpdate[];
  people: Person[];
  currentPersonId: string;
};
