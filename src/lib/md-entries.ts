export interface MdFrontmatter {
  title: string;
  img?: string;
  section?: string;
  tags?: string[];
  description?: string;
  url?: string;
  order?: number;
  date?: string | Date;
  logo?: boolean;
}

import type { MarkdownInstance } from "astro";

export type MdModule = MarkdownInstance<MdFrontmatter>;

export interface MdEntry {
  slug: string;
  title: string;
  description?: string;
  img: string;
  tags: string[];
  section: string;
  url?: string;
  order: number;
  date?: string | Date;
  logo: boolean;
}

const defaultImage = "/images/placeholder.svg";

export function slugFromPath(path: string, collection: string): string {
  return (
    path
      .replace(/\\/g, "/")
      .split(`/content/${collection}/`)[1]
      ?.replace(/\.mdx?$/, "") ?? ""
  );
}

function sectionFromPath(path: string, collection: string): string {
  const slug = slugFromPath(path, collection);
  const [section] = slug.split("/");
  return section || "uncategorised";
}

function normaliseSection(
  section: string | undefined,
  fallback: string,
): string {
  return (section || fallback)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normaliseUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url) || /^\/\//.test(url)) {
    return url;
  }
  return `https://${url}`;
}

export function entriesFromGlob(
  modules: Record<string, MdModule>,
  collection: string,
): MdEntry[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const frontmatter = mod.frontmatter;
      const fallbackSection = sectionFromPath(path, collection);

      return {
        slug: slugFromPath(path, collection),
        title: frontmatter.title,
        description: frontmatter.description,
        img: frontmatter.img ?? defaultImage,
        tags: frontmatter.tags ?? [],
        url: normaliseUrl(frontmatter.url),
        section: normaliseSection(frontmatter.section, fallbackSection),
        order: frontmatter.order ?? 0,
        date: frontmatter.date,
        logo: frontmatter.logo ?? (
          path.toLowerCase().includes("logo") ||
          (frontmatter.img && frontmatter.img.toLowerCase().includes("logo"))
        ) ?? false,
      };
    })
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return (a.title || "").localeCompare(b.title || "");
    });
}

export function groupBySection(entries: MdEntry[]): [string, MdEntry[]][] {
  const groups = new Map<string, MdEntry[]>();

  for (const entry of entries) {
    const group = groups.get(entry.section) ?? [];
    group.push(entry);
    groups.set(entry.section, group);
  }

  return Array.from(groups.entries());
}
