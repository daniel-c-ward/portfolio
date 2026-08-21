---
title: Astro Membership Demo
description: "A proof of concept showing Astro can serve tiered membership content, where the server decides what each user sees before any HTML is generated."
featuredImage: ""
date: 2026-08-20
tags:
  - Astro
  - SSR
  - Content Gating
  - Membership
isCompact: false
isLogo: false
circleLogo: false
category: tools
tools:
  - Astro
  - TypeScript
  - Node
status: Live
hasLiveDemo: true
url: ""
colourLight: "#f6f4ef"
colourDark: "#1b1814"
---

## Background

I wanted to prove that Astro could power a membership site with real server-side content gating, not the kind where premium content sits in the HTML and JavaScript "hides" it with a CSS class. The kind where the server checks a cookie, decides what you're allowed to see, and only renders that. If you're not logged in as a Pro member, the Pro content simply doesn't exist in the response; no view-source trick, no DevTools hack, no print-to-PDF leak.

Most membership site demos I'd seen either used a full-stack framework that obscures the gating logic, or relied on client-side checks that aren't actually secure. I wanted something small enough to read in one sitting, where every piece of the access control chain is visible and obvious.

## Early Ideas

The first question was whether Astro, which is known for shipping zero JS by default, could handle the server-side membership logic cleanly. Astro does support SSR through adapters, so the pieces were there: middleware for global gating, server-rendered pages that read cookies, and content collections with a `level` field in frontmatter.

I considered several approaches:

- A full auth system with login forms, password hashing, and session tables
- A simple role-based cookie with no real accounts, just tier selection
- Client-side gating with `localStorage` and JavaScript overlays

The full auth system would have distracted from the actual point, which is the gating architecture. Client-side gating is the exact anti-pattern I wanted to disprove. So I went with the simple cookie approach: pick a tier, the server writes an HttpOnly cookie, and every page checks it before rendering.

## Design & Build

### The access model

Three tiers: Free, Pro, Premium. Each is a rank (1, 2, 3), and a user can access any content at their rank or below. The check is a single comparison: `LEVEL_RANK[user] >= LEVEL_RANK[required]`. That's the whole permission system.

### The middleware gate

Astro's middleware runs before any page renders. The global gate checks for the membership cookie; if it's missing, the visitor gets redirected to `/login`. The login page and API endpoints are exempt. This means unauthenticated visitors never even reach the content pages, let alone receive their HTML.

### Server-rendered content

Each post in the content collection has a `level` field in its frontmatter (`free`, `pro`, or `premium`). When a page renders, it reads the cookie, fetches the post, checks access, and either renders the full content or shows a `BlockedView` component that explains what tier is needed. The content is never fetched or rendered for users who can't access it.

### The cookie

HttpOnly, `sameSite: lax`, 30-day expiry, path-scoped. No JavaScript can read it. No client-side code checks membership; every decision happens on the server. The cookie is set by a simple POST endpoint that accepts a tier name and writes it.

### What it demonstrates

- **Middleware as the gate**: one central check, not sprinkled through every component.
- **Content collections with access levels**: frontmatter drives the gating, so adding a new tier-gated post is just a markdown file.
- **Server-side rendering as a security feature**: the content literally isn't in the response for unauthorized users.
- **Clean separation**: `access.ts` has the logic, `middleware.ts` has the gate, pages have the rendering. Each is small and obvious.

## Outcome & Key takeaways

### Outcome

The demo works. Twelve posts across three tiers, a login page, tier-specific listing pages, and a per-post detail page. The design is intentional too: warm paper tones, Fraunces display type, a hairline grid, and metal-tier theming (bronze, silver, gold) that gives each level a visual identity. It doesn't look like a throwaway prototype.

### Key takeaways

- **Server-side gating is simpler than people think.** The whole access control system is one middleware file, one utility function, and a cookie. No auth library, no session store, no complexity.
- **Astro handles this well.** SSR with middleware gives you the control you need without the overhead of a heavier framework. Content collections with frontmatter-driven access levels are a natural fit.
- **The anti-pattern is common for a reason.** Client-side gating is easier to build, which is why so many demos do it. But it doesn't work; the moment the content is in the HTML, it's public.
- **Design matters for proof-of-concept work.** A demo that looks polished is taken more seriously than one that looks abandoned. The visual design here took real effort and it shows.

### Hindsight

The login page openly says "no real account system," which is honest but could be framed better as a deliberate architectural choice rather than an incomplete feature. The tier-specific listing pages are somewhat redundant; they're all minor variations of the same template. And there's no public landing page that explains the concept before routing to login; unauthenticated visitors see the tier picker immediately, which doesn't sell what the demo is about.

If I were extending this, I'd add that public landing page, a comparison section showing what client-side gating looks like versus this approach, and maybe a deployable version so people can try it without cloning the repo. The architecture is solid; the wrapper around it could use the same care.
