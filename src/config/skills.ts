export type SkillIconName = "astro" | "react" | "brain" | "ux" | "python" | "laravel";

export type Skill = {
  title: string;
  description: string;
  icon: SkillIconName;
};

export const skills: Skill[] = [
  {
    title: "Astro",
    description:
      "Fast, content-focused sites with islands architecture and minimal JavaScript by default.",
    icon: "astro",
  },
  {
    title: "React",
    description:
      "Interactive UI with components, state, and ecosystems that scale from prototypes to products.",
    icon: "react",
  },
  {
    title: "Behavioral economical design",
    description:
      "Bias, framing, and choice architecture so interfaces that are made for how people actually decide.",
    icon: "brain",
  },
  {
    title: "UX",
    description:
      "Research, flows, and interface design that reduces friction and builds trust where it matters.",
    icon: "ux",
  },
  {
    title: "Python",
    description:
      "Versatile language for backend services, data analysis, and scripting.",
    icon: "python",
  },
  {
    title: "Laravel (Learning)",
    description:
      "Modern PHP framework for building robust web applications with expressive syntax.",
    icon: "laravel",
  },
];
