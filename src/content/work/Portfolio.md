---
title: This Portfolio
description: This portfolio was built to showcase my design and UX skills, and show some side projects.
featuredImage: /images/work/portfolio/portfolio-landing.png
logoImage: /images/work/portfolio/portfolio-logo.png
date: 2026-05-05
tags:
  - Astro
  - Personal brand
  - UX
url:
isCompact: false
isLogo: true
challenge: "Create a website that showcased my work in a simple, clear way."
solution: "An Astro site that focus on MDX content collections to allow ease of use."
impact: "A site that represented me and showcased my work effectively."
tools:
  - Astro
  - MDX
  - Vercel
  - Umami
colourLight: "#d9dfd1"
colourDark: "#0f3d2e"
---

## Background

I needed a simple, clear way to show all of my work, plus share some infomation about myself. It also needed to save some information about how people use the site so that I could improve it.

## Early Ideas

I went through so many designs, more than I care to recall. Some had many animations, fancy designs, colours everywhere. But in the end I chose a simple, minimal site.

I took inspiration from **photography sites**, they employ negative space, with one colour so all the focus is on the work (much like [CT Productions](./CaptainTProductions).

## Initial Designs

I used Gemeni to quickly make prototypes of what I had envisioned so that I could see if my idea would work in practice. While non of them truly captured idea, it gave me enough inspiration to create what I wanted myself; a minimalistic site, Lexend font, and subtle greens (no other reason than it being my favourite colour).

## The Build

I decided to use [Astro](https://astro.build/) as it was basic. It doesn't have the complexity of React (only really needed for projects like [J.O.B.S Tracker](./JobsTracker)) but wouldn't be as annoying to build as it would be writing and building every page in plain HTML. The MDX and Content Collections used in Astro made it incredibly easy to set up my case study system.

I then later set up [Umami](https://umami.is/) which made it possible to set up the cookieless tracking I wanted, just to track the bounce rate, where people came from, if they reached certain pages etc.

## Deployment

For deployment I used [Vercel](https://vercel.com). I set up my primary site from my _main_ branch and then my _stage_ branch went to a staging .vercel.app link so I could see how it would turn out, aside from my dev server. It also gave me the opportunity to gather feedback before deploying a possibly bad idea, and make any necessary improvements.

For DNS I used [123Reg](https://123reg.com) at the reccomendation of someone I know. It was very simple to setup, and allowed me to have my custom domain, just to add the personality.

## Final touches

Following the launch, feedback from peers demonstrated the need for further enhancements, e.g., buttons on the carousel(they were lost in a git revert after bugs appeared) upon adding them, it made the carousel easier to use on desktop, as it stopped me from relying on the user knowing to press `Shift + Scroll` to use it.
