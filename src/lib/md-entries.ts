export interface MdFrontmatter {
  title: string;
  description?: string;
  featuredImage?: string;
  logoImage?: string;
  date?: string | Date;
  tags?: string[];
  url?: string;
  projectColor?: string;
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
  projectColor?: string;
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
        featuredImage: frontmatter.featuredImage ?? defaultImage,
        logoImage: frontmatter.logoImage,
        tags: frontmatter.tags ?? [],
        section: normaliseSection(frontmatter.labCategory, fallbackSection),
        date: frontmatter.date,
        url: frontmatter.url,
        projectColor: frontmatter.projectColor,
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

export function projectThemeFor(entry: Pick<MdEntry, "projectColor">): Record<string, string> {
  const primary = entry.projectColor?.trim() || "var(--color-primary)";

  return {
    "--project-color": primary,
    "--project-tint": `color-mix(in srgb, ${primary} 12%, var(--color-surface))`,
    "--project-border": `color-mix(in srgb, ${primary} 34%, transparent)`,
    "--project-hover": `color-mix(in srgb, ${primary} 88%, #000)`,
    "--project-on-color": "var(--color-on-primary)",
  };
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
