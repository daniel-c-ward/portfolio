---
title: Canvas
description: A local diagramming tool where an AI proposes edits as a small DSL and you approve them in the browser.
featuredImage: /images/lab/canvas/canvas-cover.svg
date: 2026-07-29
tags:
  - Fabric.js
  - AI
  - Offline-first
  - DSL
isCompact: false
isLogo: false
circleLogo: false
category: tools
tools:
  - Go
  - Fabric.js
  - HTMX
  - Tailwind
status: In Progress
hasLiveDemo: false
colourLight: "#f3efe8"
colourDark: "#2d2419"
---

## Background

I draw a lot of diagrams: flowcharts, icon-based diagrams and lightweight wireframes. I wanted a tool that was fast, offline, and did exactly what I needed without the account, the cloud sync and the subscription. But building yet another drawing app isn't interesting on its own. The interesting question was: **can an AI agent help you draw, without taking over the canvas?**

Most AI drawing tools let the model scribble directly onto your document. I didn't want that. I wanted an AI whose changes I could see, understand, and undo; cleanly, one batch at a time, like code review but for diagrams. That idea became the whole design.

## Early Ideas

The non-negotiables came first:

- **One Go executable, fully offline.** Serves the front-end and an HTTP API on localhost. No accounts, nothing deployed, zero CDN dependencies.
- **The store is the truth.** A project is a plain-JSON document plus an append-only op log on disk. The canvas rendering layer is a projection, never the source of truth; its serialisation is never persisted.
- **Git is the long-history rewind**; the repo itself gives you version control for free. In-app undo is the short one.
- **AI edits land behind a gate.**

### The gate

An agent never touches the document directly. It proposes edits in a small line-oriented DSL, one op per line, with enums drawn from the app itself:

```
rect x:20 y:20 size:m color:slate
```

The model speaks DSL, not JSON (JSON stays for the HTTP API). A proposal is a **batch**: one message, up to 500 ops, parsed all-or-nothing. It lands as a **pending import**: rendered on the canvas at 56% opacity inside an outline box, and listed in a sidebar. You can pan to it, inspect it, approve it or deny it. Approval applies the batch and writes a checkpoint; denial inverts _that batch's ops only_, so any tweaks you made after it survive. Multiple batches can wait at the same time.

An approved batch undoes as a single undo step; rejecting an AI's work should never feel like untangling a knot the AI tied.

### Undo that survives restarts

Every mutation is an **op** recorded with from→to values, timestamps and author in an append-only log. Undo is op-inverse, 200 ops deep, and the stack rebuilds from the store on every load, so undo works across sessions, mixing your edits and the AI's. Deletions are **tombstones** (kept with a `deletedAt` timestamp) so they can be undone too, pruned at the next checkpoint.

The one rule that makes all of this safe: the server is the _sole writer_. The client keeps a localStorage buffer for speed, but reloads always read the server; the worst case is the debounce window (~1–2 s).

## Design & Build

Work so far has been deliberately design-first. The project has a written vocabulary: doc, op, store, batch, gate, pending import, tombstone and checkpoint. A shared vocabulary is what lets an agent (or a colleague) work on this without re-deriving the rules each time. The non-negotiables above are all documented as explicit constraints.

The front-end prototype is a single self-contained HTML file: Fabric.js canvas, Tailwind styling, toolbars and shape handling, all running with no build step. I deliberately kept it dependency-light so the Go server can embed it wholesale and serve it with zero network access; the "fully offline, single executable" promise depends on the front-end being embeddable.

The build itself is tracked as a small issue backlog, each item written as a behaviour the user can verify: scaffolding the server and projects screen, the DSL interpreter and parse log, the gate and pending imports, connectors with smart boundary gluing, cross-session undo/redo, and bookmarks/export.

## Outcome & Key takeaways

### Outcome

Canvas is at the prototype-plus-design stage. The interactions and persistence model are fully specified: the vocabulary, the gate semantics, the undo model and the atom-of-truth store. The front-end prototype demonstrates the shape-editing experience. The Go server, persistence and the gate are the current build phase.

### Key takeaways

- **Design-first is underrated.** Deciding the harder questions (store vs projection, gate semantics, undo semantics) before writing much code means the build phase is mostly implementation, not re-derivation.
- **Vocabulary is infrastructure.** Naming the concepts precisely made the design decisions expressible and kept the agent and I talking about the same thing: a batch is not a request, and a tombstone is not a deleted object.
- **A gate is what makes AI editing trustworthy.** The ability to see, approve or invert an AI's batch, as a unit, turns "let the AI draw on my canvas" into something I'd happily use.
- **Offline is a feature, not a limitation.** No accounts, no cloud, no CDN: a tool that works forever, served from one binary on localhost, and versioned by the git repo it lives in.

### Hindsight

I want to fix the prototype's CDN dependencies next: the current HTML file loads Fabric and Tailwind from CDNs, which contradicts the offline promise until they're vendored into the binary. The connector routing (obstacle-aware shortest path) is v1.1, but the geometry function is isolated so it can swap in without touching the rest. And the projects screen is deliberately minimal; polish comes after the gate is real.
