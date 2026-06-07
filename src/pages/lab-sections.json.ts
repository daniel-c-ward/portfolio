import {
  entriesFromGlob,
  labSectionsFromEntries,
  type MdModule,
} from "../lib/md-entries";

export const prerender = true;

const modules = import.meta.glob<MdModule>("../content/lab/**/*.md", { eager: true });
const sections = labSectionsFromEntries(entriesFromGlob(modules, "lab"));

export function GET() {
  const body = {
    sections: sections.map((section) => ({
      id: section.slug,
      label: section.title,
      description: section.description,
      featuredImage: section.featuredImage,
      items: section.items.map((item) => ({
        slug: item.slug,
        title: item.title,
        description: item.description,
        featuredImage: item.featuredImage,
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
