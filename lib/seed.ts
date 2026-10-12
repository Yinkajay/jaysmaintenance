import type { SiteData } from "./types";

/** Replace these examples before first use, or start empty from Admin. */
export function createSampleData(): SiteData {
  const today = new Date();
  const ago = (hours: number) => new Date(today.getTime() - hours * 3_600_000).toISOString();
  const task = (id: string, title: string, description: string, locationId: string | null, status: "open" | "done" = "open") => ({ id, title, description, locationId, status, createdAt: ago(48) });
  return {
    version: 1,
    people: [
      { id: "amara", name: "Amara Okafor", role: "admin" },
      { id: "tunde", name: "Tunde Bello", role: "member" },
      { id: "kemi", name: "Kemi Adebayo", role: "member" },
    ],
    currentPersonId: "amara",
    locations: [
      { id: "main-building", name: "Main building", description: "Structure & concrete works", cover: "/images/main-building.jpg" },
      { id: "east-wing", name: "East wing", description: "Blockwork & interior works", cover: "/images/east-wing.jpg" },
      { id: "service-yard", name: "Service yard", description: "External works & drainage", cover: "/images/service-yard.jpg" },
      { id: "gatehouse", name: "Gatehouse", description: "Entrance & perimeter works", cover: "/images/gatehouse.jpg" },
    ],
    tasks: [
      task("materials", "Check incoming materials", "Check delivered quantities against the order. Add a photo of any damaged items before they are moved.", null),
      task("safety", "Complete the site safety walk", "Check access routes, signage and protective equipment. Record anything the team needs to fix.", null),
      task("equipment", "Inspect tools and equipment", "Inspect shared tools before use and set aside anything that needs a repair.", null),
      task("slab", "Prepare first floor slab", "Check the formwork and reinforcement before arranging the concrete pour.", "main-building"),
      task("columns", "Check ground floor columns", "Review column alignment and record any areas that need attention.", "main-building"),
      task("stairs", "Finish staircase formwork", "Complete and inspect the staircase formwork ready for the next pour.", "main-building"),
      task("blocks", "Complete partition blockwork", "Finish the remaining internal partitions and check door openings.", "east-wing"),
      task("conduits", "Install electrical conduits", "Confirm conduit routes before plastering starts.", "east-wing"),
      task("drainage", "Set out drainage route", "Mark the drainage line and confirm levels before excavation.", "service-yard"),
      task("gate", "Prepare gate foundation", "Check the foundation dimensions against the drawing.", "gatehouse"),
      task("fence", "Inspect perimeter fencing", "Walk the perimeter and confirm that temporary fencing is secure.", "gatehouse", "done"),
    ],
    updates: [
      { id: "u1", taskId: "materials", authorId: "tunde", authorName: "Tunde Bello", createdAt: ago(2), text: "Cement and reinforcement have arrived. Quantities checked against the delivery note. Still waiting on the timber." },
      { id: "u2", taskId: "safety", authorId: "kemi", authorName: "Kemi Adebayo", createdAt: ago(4), text: "Access routes are clear. Added a barrier beside the open trench in the service yard." },
      { id: "u3", taskId: "slab", authorId: "amara", authorName: "Amara Okafor", createdAt: ago(23), text: "Formwork is in place. Please check the reinforcement spacing before we call for an inspection.", photo: "/images/main-building.jpg" },
      { id: "u4", taskId: "slab", authorId: "tunde", authorName: "Tunde Bello", createdAt: ago(3), text: "Reinforcement check is underway. The north edge needs two additional spacers." },
      { id: "u5", taskId: "blocks", authorId: "kemi", authorName: "Kemi Adebayo", createdAt: ago(5), text: "Two partitions are complete. We will finish the remaining door openings next." },
      { id: "u6", taskId: "fence", authorId: "tunde", authorName: "Tunde Bello", createdAt: ago(25), text: "All panels checked and secured. Perimeter inspection complete." },
    ],
  };
}
