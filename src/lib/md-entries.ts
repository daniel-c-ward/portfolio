export interface MdFrontmatter {
  title: string;
  description?: string;
  featuredImage?: string;
  logoImage?: string;
  date?: string | Date;
  tags?: string[];
  url?: string;
  isCompact?: boolean;
  isLogo?: boolean;
  challenge?: string;
  solution?: string;
  impact?: string;
  tools?: string[];
  status?: string;
  labCategory?: string;
  difficulty?: string;
  inspiration?: string;
  hasLiveDemo?: boolean;
  colourLight?: string;
  colourDark?: string;
}

export interface MdModule {
  frontmatter: MdFrontmatter;
  Content: unknown;
}

export interface MdEntry {
  slug: string;
  title: string;
  description?: string;
  featuredImage: string;
  logoImage?: string;
  tags: string[];
  section: string;
  date?: string | Date;
  url?: string;
  isCompact?: boolean;
  isLogo?: boolean;
  challenge?: string;
  solution?: string;
  impact?: string;
  tools: string[];
  status?: string;
  labCategory?: string;
  difficulty?: string;
  inspiration?: string;
  hasLiveDemo?: boolean;
  colourLight?: string;
  colourDark?: string;
}

export interface LabSection {
  slug: string;
  title: string;
  description?: string;
  featuredImage: string;
  items: MdEntry[];
}

const defaultImage = "/images/placeholder-card.svg";

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

export function titleFromKey(key: string): string {
  return key
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export function normaliseSection(
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

export function entriesFromGlob(
  modules: Record<string, MdModule>,
  collection: string,
): MdEntry[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const frontmatter = mod.frontmatter;
      const fallbackSection = sectionFromPath(path, collection);
      const section =
        collection === "lab"
          ? normaliseSection(fallbackSection, fallbackSection)
          : normaliseSection(frontmatter.labCategory, fallbackSection);

      return {
        slug: slugFromPath(path, collection),
        title: frontmatter.title,
        description: frontmatter.description,
        featuredImage: frontmatter.featuredImage ?? defaultImage,
        logoImage: frontmatter.logoImage,
        tags: frontmatter.tags ?? [],
        section,
        date: frontmatter.date,
        url: frontmatter.url,
        isCompact: frontmatter.isCompact,
        isLogo: frontmatter.isLogo,
        challenge: frontmatter.challenge,
        solution: frontmatter.solution,
        impact: frontmatter.impact,
        tools: frontmatter.tools ?? [],
        status: frontmatter.status,
        labCategory: frontmatter.labCategory,
        difficulty: frontmatter.difficulty,
        inspiration: frontmatter.inspiration,
        hasLiveDemo: frontmatter.hasLiveDemo,
        colourLight: frontmatter.colourLight,
        colourDark: frontmatter.colourDark,
      };
    })
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (a.date) return -1;
      if (b.date) return 1;
      return a.title.localeCompare(b.title);
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

export function labSectionsFromEntries(entries: MdEntry[]): LabSection[] {
  return groupBySection(entries)
    .map(([section, items]) => {
      const [firstItem] = items;

      return {
        slug: section,
        title: titleFromKey(section),
        description: firstItem?.description,
        featuredImage: firstItem?.featuredImage ?? defaultImage,
        items,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function sectionCardFromLabSection(section: LabSection): MdEntry {
  return {
    slug: section.slug,
    title: section.title,
    description: section.description,
    featuredImage: section.featuredImage,
    tags: [],
    section: section.slug,
    tools: [],
  };
}
