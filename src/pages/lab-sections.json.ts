import labSectionConfig from "../data/lab-sections.json";
import { entriesFromGlob, groupBySection, type MdModule } from "../lib/md-entries";

type LabSectionConfig = {
  order: string[];
  sections: Record<string, { label: string; description: string }>;
};

export const prerender = true;

const config = labSectionConfig as LabSectionConfig;
const modules = import.meta.glob<MdModule>("../content/lab/**/*.md", { eager: true });
const items = entriesFromGlob(modules, "lab");
const sections = groupBySection(items).sort(([a], [b]) => {
  const aIndex = config.order.indexOf(a);
  const bIndex = config.order.indexOf(b);

  if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
  if (aIndex === -1) return 1;
  if (bIndex === -1) return -1;
  return aIndex - bIndex;
});

function titleFromKey(key: string): string {
  return key
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export function GET() {
  const body = {
    sections: sections.map(([section, sectionItems]) => ({
      id: section,
      label: config.sections[section]?.label ?? titleFromKey(section),
      description: config.sections[section]?.description,
      items: sectionItems.map((item) => ({
        slug: item.slug,
        title: item.title,
        description: item.description,
        img: item.img,
        tags: item.tags,
      })),
    })),
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
