export interface CvFrontmatter {
  year: string;
  title: string;
  position: string;
  description?: string;
  casestudies?: string[];
}

export interface CvEntry extends CvFrontmatter {
  kind: "experience" | "education";
  description: string;
}

export function yearSortKey(year: string): number {
  if (/present/i.test(year)) return 9999;

  const years = year.match(/\d{4}/g);
  if (!years?.length) return 0;

  return Math.max(...years.map(Number));
}

export function entriesFromModules(
  modules: Record<string, { frontmatter: CvFrontmatter }>,
  kind: CvEntry["kind"],
): CvEntry[] {
  return Object.values(modules).map((mod) => ({
    ...mod.frontmatter,
    kind,
    description: mod.frontmatter.description ?? "",
  }));
}

export function mergeTimelineEntries(
  experience: CvEntry[],
  education: CvEntry[],
): CvEntry[] {
  return [...experience, ...education].sort(
    (a, b) => yearSortKey(b.year) - yearSortKey(a.year),
  );
}

export function parseCaseStudy(casestudy: string) {
  const match = casestudy.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

  if (!match) {
    return { text: casestudy };
  }

  const [, text, href] = match;
  const resolvedHref = href.startsWith("./")
    ? `/work/${href.replace(/^\.\//, "").replace(/\.mdx?$/, "")}`
    : href;

  return { text, href: resolvedHref };
}
