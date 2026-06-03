export type SkillIconName = "astro" | "react" | "brain" | "ux";

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
      "Bias, framing, and choice architecture so interfaces respect how people actually decide.",
    icon: "brain",
  },
  {
    title: "UX",
    description:
      "Research, flows, and interface design that reduce friction and build trust where it matters.",
    icon: "ux",
  },
];
