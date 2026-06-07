export const contactInfo = {
  email: "danielward.pw@gmail.com",
  phone: "+441234567890",
  phoneDisplay: "+44 1234 567890",
  github: "daniel-c-ward",
  linkedin: "danielcwarduk/",
  instagram: "anotherdanielward",
} as const;

// Helper to generate social URLs
export const socialUrls = {
  email: `mailto:${contactInfo.email}`,
  github: `https://github.com/${contactInfo.github}`,
  linkedin: `https://www.linkedin.com/in/${contactInfo.linkedin}`,
  instagram: `https://www.instagram.com/${contactInfo.instagram}`,
} as const;
