# Matt Pocock's AI-Assisted Development Workflow — Research Findings

> **Researched:** 2026-07-22  
> **Primary sources consulted:** GitHub repos (mattpocock/skills, mattpocock/sandcastle), YouTube channel (Matt Pocock, AI Engineer), aihero.dev, X/Twitter (@mattpocockuk), LinkedIn, workshop transcripts

---

## 1. Overview: Who Is Matt Pocock?

Matt Pocock is a TypeScript educator (creator of **Total TypeScript**), former Vercel and Stately engineer, and a leading voice in AI-assisted software engineering. He runs [AI Hero](https://www.aihero.dev/), publishes a newsletter with ~60,000 subscribers, and maintains the most-starred AI coding skills repository on GitHub (mattpocock/skills — 181K+ stars as of July 2026).

His core thesis: **Software engineering fundamentals are not obsolete in the age of AI—they are the leverage layer that determines whether AI agents amplify your capabilities or multiply technical debt.** [Source: GitHub README](https://github.com/mattpocock/skills)

---

## 2. The Core Thesis

> "Bad codebases make bad agents. If you have a garbage codebase you're going to get garbage out of the agent working in that codebase." — Matt Pocock [Source: Workshop](https://www.youtube.com/watch?v=-QFHIoCo-Ko)

Pocock argues that AI does not make engineering discipline obsolete. Instead, it makes discipline *more* important because AI agents amplify both good and bad patterns. His workflow is built on adapting classic software engineering principles (from Brooks, Ousterhout, The Pragmatic Programmer, Fowler, Beck) to the unique constraints of LLMs.

---

## 3. Smart Zone vs. Dumb Zone — The Foundational Constraint

The single most important concept underpinning everything Pocock builds:

- **Smart zone**: ~0–100K tokens. LLMs reason sharply, maintain attention relationships, produce quality output.
- **Dumb zone**: Beyond ~100K tokens. Attention degradation sets in (quadratic O(n²) scaling). Models make sloppy errors, hallucinate, forget earlier context.
- **Vendor context window expansions are misleading**: When vendors announce larger windows (e.g., 1M tokens), they are "shipping more dumb zone." The expanded context is useful for *retrieval* but not for *reasoning*. [Source: Workshop](https://www.youtube.com/watch?v=-QFHIoCo-Ko)

**Every workflow decision Pocock makes is optimized around staying inside the smart zone.** That means short, focused sessions with clean context resets rather than endlessly compacted threads.

---

## 4. The Seven Phases of AI-Assisted Development

Pocock's canonical workflow is documented in [My 7 Phases Of AI Development](https://www.aihero.dev/my-7-phases-of-ai-development):

| Phase | Purpose | Key Deliverable | Human/Agent Ratio |
|-------|---------|----------------|-------------------|
| 1. Idea | Define what you want to build | Problem statement | Human-led |
| 2. Research (optional) | Explore external dependencies | RESEARCH.md asset | Human + Agent |
| 3. Prototype (optional) | Test design and UX ideas | Working prototype | Human-led (taste) |
| 4. PRD | Document the end state | Product requirements doc | Human + Agent |
| 5. Kanban Board | Break work into tickets | Task list with dependencies | Human-led (review) |
| 6. Execution | Build the implementation | Working code | Agent-led (AFK) |
| 7. QA | Verify completed work | QA plan + feedback | Human-led (review) |

Phases alternate between **human-led** (judgment, decisions, commitments) and **agent-led** (execution, generation, verification). This deliberate alternation is the key pattern — not full automation, not full manual.

---

## 5. Key Principles, Techniques, and Patterns

### 5.1 The Grill Session — Alignment Before Code

The /grill-me skill (and its codebase-aware sibling /grill-with-docs) is Pocock's signature technique. Before any code is written, the agent is forced to interrogate the human relentlessly — typically **40–100 questions** — about every aspect of the planned work.

The prompt instructs the agent:
> "Before writing any code, ask me at least 40 questions to ensure you fully understand the requirements, edge cases, architecture constraints, performance requirements, testing strategy, and integration points. Do not stop asking questions until you can articulate the complete solution back to me and I confirm we have shared understanding."

**What it produces**: Not a plan, but a *shared design concept* — the human and the agent reach the same mental model of what's being built. Pocock draws on Frederick Brooks (The Mythical Man-Month) here: everyone building something together must hold the same mental model. [Source: GitHub README](https://github.com/mattpocock/skills) / [Source: Workshop](https://www.youtube.com/watch?v=-QFHIoCo-Ko)

He distinguishes two variants:
- /grill-me — for non-code/product ideation (no existing codebase)
- /grill-with-docs — for codebase work; also builds a shared language document (CONTEXT.md) and writes Architecture Decision Records (ADRs)

### 5.2 Shared Language (CONTEXT.md)

Derived from Domain-Driven Design's *ubiquitous language* concept. During a grilling session, the agent maintains a CONTEXT.md file that captures concise domain terminology.

**Example from Pocock's own repo:**
- BEFORE: "There's a problem when a lesson inside a section of a course is made 'real' (i.e. given a spot in the file system)"
- AFTER: "There's a problem with the materialization cascade"

This concision pays off session after session — fewer tokens wasted re-explaining domain concepts. [Source: GitHub README](https://github.com/mattpocock/skills#2-the-agent-is-way-too-verbose)

### 5.3 PRD as Destination Document

The /to-spec and /write-a-prd skills synthesize the grilling conversation into a structured Product Requirements Document. Pocock doesn't even read it — "LLMs summarize well, and after a grilling session the shared design concept is already in place, so the PRD is just that concept written down." [Source: TalksIntel summary](https://talksintel.ai/ai-ml/conferences/aie-eu-2026/full-walkthrough-workflow-for-ai-coding-matt-pocock/)

PRD sections typically include: problem statement, proposed solution, success criteria, user stories, technical constraints, out of scope, dependencies, testing strategy, rollout plan. [Source: explainx.ai](https://explainx.ai/blog/matt-pocock-ai-coding-real-engineers-workshop-2026)

### 5.4 Vertical Slices (Tracer Bullets) > Horizontal Layers

This is perhaps the most operationally important pattern. Pocock rejects the AI's natural tendency to build in horizontal layers (database first → API → frontend) because it delays integrated feedback until the very end.

Instead, he advocates **vertical slices** (tracer bullets, from The Pragmatic Programmer): thin end-to-end strips of functionality that cut through all layers (schema, API, UI, tests) and leave something visible at the end. The first vertical slice should include "schema changes, some new service, and a minimal representation on the front end."

**Why it matters:**
1. **Fast feedback**: Every issue produces a testable result immediately
2. **Parallelization**: Independent vertical slices can be worked on simultaneously by different agents
3. **Partial failure resilience**: If one slice fails, others still ship [Source: Workshop](https://www.youtube.com/watch?v=-QFHIoCo-Ko)

### 5.5 Kanban Board (Not Sequential Plans)

After the PRD, /to-tickets decomposes the work into independently grabbable tickets with explicit **blocking relationships** (forming a DAG — directed acyclic graph).

Pocock strongly prefers a Kanban board to sequential multi-phase plans:
> "A sequential plan can really only be picked up by one agent. A well-structured Kanban board can be picked up by several." [Source: Workshop](https://www.youtube.com/watch?v=-QFHIoCo-Ko)

Each ticket gets classified as **HITL** (Human In The Loop — needs judgment) or **AFK** (Away From Keyboard — safe for autonomous implementation). [Source: explainx.ai](https://explainx.ai/blog/matt-pocock-ai-coding-real-engineers-workshop-2026)

### 5.6 TDD with AI (Red-Green-Refactor)

Pocock's /tdd skill implements a strict red-green-refactor loop:

1. **Red**: Write a failing test first (proves the test is valid)
2. **Green**: Implement code to pass the test
3. **Refactor**: Clean up implementation

**Why this works with AI**: "Give them a vague problem and they'll produce code that superficially works but doesn't actually solve your requirements. Give them a failing test and they'll produce code that provably solves the problem you specified." — Matt Pocock [Source: explainx.ai](https://explainx.ai/blog/matt-pocock-ai-coding-real-engineers-workshop-2026)

Tests act as specifications that agents can verify against. This prevents "cheating" — writing tests that trivially pass the implementation.

### 5.7 AFK (Away From Keyboard) Agents

Pocock classifies work into HITL vs AFK:

| Classification | Meaning | Example |
|---|---|---|
| HITL | Requires human judgment, architecture decisions | "Should we cache or recompute?" |
| AFK | Well-defined implementation, clear criteria | "Add email validation per spec" |

AFK work requires: clear specification (failing test or detailed criteria), no architectural decisions, isolated scope, obvious validation, low risk. [Source: explainx.ai](https://explainx.ai/blog/matt-pocock-ai-coding-real-engineers-workshop-2026)

The **day shift / night shift** metaphor: human plans during the day (HITL), agents execute autonomously at night (AFK).

### 5.8 The Ralph Loop

The **Ralph Wiggum loop** (named after the Simpsons character) is a deceptively simple bash loop pattern:

`ash
for ((i=1; i<=; i++)); do
  claude --permission-mode acceptEdits -p "@PRD.md @progress.txt \
    1. Find the highest-priority task and implement it. \
    2. Run tests and type checks. \
    3. Update progress.txt. \
    4. Commit. \
    ONLY WORK ON ONE TASK. \
    If complete, output <promise>COMPLETE</promise>."
done
`

Key characteristics:
- **Fresh context on every iteration** (critical for staying in smart zone)
- State lives in files (PRD.md, progress.txt, git history)
- The agent reads state, picks one task, ships it, commits, exits
- The loop repeats until all tasks are complete [Source: Getting Started With Ralph](https://www.aihero.dev/getting-started-with-ralph) / [Source: Ralph Wiggum YouTube](https://www.youtube.com/watch?v=_IK18goX4X8)

Pocock explicitly warns against Anthropic's official Ralph plugin because "it uses a hook-based mechanism inside a single session, which means it still suffers from context rot. The plain bash loop is superior." [Source: LazyRalph](https://lazyralph.com/blog/ralph-wiggum-loop/)

### 5.9 Deep Modules Architecture

Drawing from John Ousterhout's *A Philosophy of Software Design*, Pocock argues that **module depth** is the single biggest lever on agent output quality.

- **Deep modules**: Small interface, rich internal implementation. Easy for agents to reason about, clean test boundaries.
- **Shallow modules**: Many small files with tangled dependencies. Hard for agents to navigate, unclear test boundaries.

His /improve-codebase-architecture skill scans a repo for shallow modules and suggests deepening opportunities, producing a visual HTML report. [Source: GitHub README](https://github.com/mattpocock/skills)

### 5.10 Sandcastle — Parallel AFK Agent Orchestration

[Sandcastle](https://github.com/mattpocock/sandcastle) is the production-grade evolution of the Ralph loop. A TypeScript library for orchestrating AI coding agents in isolated sandboxes.

**Key features:**
- sandcastle.run() — single-function invocation
- **Provider-agnostic**: Docker, Podman, Vercel (Firecracker microVMs), or 
oSandbox()
- **Branch strategies**: Head (direct), Merge-to-head (temp branch), Branch (named branch)
- **Templates**: blank, simple-loop, sequential-reviewer, parallel-planner, parallel-planner-with-review
- **Structured output** via Output.object() with Zod/Valibot schema validation
- **Hooks system** for lifecycle events (onWorktreeReady, onSandboxReady)
- **Dynamic context** via ` !command ` expressions in prompts
- **Completion signal** (<promise>COMPLETE</promise>) for early termination

**Parallel workflow** (from the parallel-planner-with-review template):
1. **Planner agent** examines backlog, finds unblocked issues, produces a plan
2. **Implementation agents** each run in their own Docker sandbox on separate branches
3. **Reviewer agents** check output in fresh context
4. **Merger agent** resolves conflicts and merges back to main

Pocock: "I built this because I wanted a simple TypeScript function that I could run and just say, 'Run this prompt inside this sandbox using this agent.'" [Source: Sandcastle YouTube](https://www.youtube.com/watch?v=E5-QK3CDVQM)

### 5.11 Two-Axis Code Review

The /code-review skill operates on two independent axes run as parallel sub-agents:

1. **Standards axis**: Does the code follow the repo's coding standards + Martin Fowler smell baseline?
2. **Spec axis**: Does the code faithfully implement the originating issue/PRD?

Running these in parallel sub-agents is deliberate: "If you do it in the main agent, it means the main agent already wrote the code and agents are often really bad at editing code they've just written." [Source: Tutorial video](https://www.youtube.com/watch?v=M6mYodf0dJM)

### 5.12 Progressive Disclosure (AGENTS.md / CLAUDE.md)

Pocock advocates for minimal AGENTS.md files using **progressive disclosure**:
> "The ideal AGENTS.md file should be as small as possible."

His guidance:
- One-sentence project description
- Package manager (if not npm)
- Non-standard build/typecheck commands
- Everything else → separate files referenced via markdown links

This respects the "instruction budget" — frontier models can follow ~150-200 instructions with reasonable consistency. [Source: A Complete Guide To AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md)

---

## 6. How It Differs From Other Popular AI Workflows

### vs. "Vibe Coding" / Prompt-and-Hope
**Pocock's approach**: Structured, disciplined, engineering-fundamentals-first. Explicit phases, alignment before coding, TDD, code review.
**Vibe coding**: Just prompt and iterate until it looks right. No alignment, no planning, no review.
**Pocock's critique**: "Skipping alignment and going straight to specs-to-code is vibe coding by another name." [Source: Workshop](https://www.youtube.com/watch?v=-QFHIoCo-Ko)

### vs. GSD (Get Shit Done)
**Pocock's approach**: Small, composable skills that the developer controls. You edit them, adapt them, own them.
**GSD**: Full-process framework that owns the entire pipeline.
**Pocock's critique**: "Approaches like GSD, BMAD, and Spec-Kit try to help by owning the process. But while doing so, they take away your control and make bugs in the process hard to resolve." [Source: GitHub README](https://github.com/mattpocock/skills)

### vs. Spec-Kit (GitHub)
**Pocock's approach**: Vertical slices with blocking relationships as a DAG; parallel execution.
**Spec-Kit**: More sequential spec → code pipeline.
**Key difference**: Pocock's skills focus on human-led alignment before spec-writing, whereas Spec-Kit focuses on the spec-to-code bridge. [Source: Workshop](https://www.youtube.com/watch?v=-QFHIoCo-Ko)

### vs. Anthropic's Official Ralph Plugin
**Pocock's approach**: Plain bash loop that spawns a fresh agent process each iteration (full context reset).
**Anthropic's plugin**: Uses Stop hooks inside a single session (doesn't fully reset context).
**Pocock's critique**: The official plugin "doesn't actually reset context between iterations... the plain bash loop is superior." [Source: LazyRalph](https://lazyralph.com/blog/ralph-wiggum-loop/)

### vs. Cursor's Built-in Agent
**Pocock's approach**: Tool-agnostic — his skills work with Claude Code, Codex, Cursor, Copilot, etc. He uses Claude Code personally.
**Key difference**: Most Cursor workflows are chat-based and session-continuous. Pocock's skills enforce session boundaries (clear between tickets) to stay in the smart zone.

### vs. Other Skill Collections
**Pocock's approach**: Skills.sh installer (editable copies) OR managed Claude Code plugin (read-only auto-updating bundle). Splits skills into user-invoked (orchestration) and model-invoked (reusable discipline).
**Others**: Often monolithic, single-tool, or proprietary. [Source: GitHub README](https://github.com/mattpocock/skills)

---

## 7. Tools & Infrastructure

| Tool | Purpose | Link |
|------|---------|------|
| **mattpocock/skills** | 20+ agent skills for real engineering workflow | [GitHub](https://github.com/mattpocock/skills) |
| **mattpocock/sandcastle** | TypeScript library for parallel AFK agents in sandboxes | [GitHub](https://github.com/mattpocock/sandcastle) |
| **AI Hero** | Educational platform and newsletter | [aihero.dev](https://www.aihero.dev/) |
| **Total TypeScript** | TypeScript course | [totaltypescript.com](https://totaltypescript.com) |
| **Claude Code** | Pocock's primary coding agent (Opus 4.8 for planning, Sonnet for implementation, Opus for review) | — |
| **Dictionary of AI Coding** | AI coding jargon explained | [GitHub](https://github.com/mattpocock/dictionary-of-ai-coding) |

---

## 8. Summary: The Four Failure Modes (and Their Fixes)

Pocock's entire skill set addresses four common failure modes:

| # | Failure Mode | Fix | Skills |
|---|-------------|-----|--------|
| 1 | Agent didn't do what I wanted | Alignment via grilling | /grill-me, /grill-with-docs |
| 2 | Agent is too verbose | Shared language (CONTEXT.md) | /grill-with-docs, /domain-modeling |
| 3 | Code doesn't work | Feedback loops (types, tests, TDD) | /tdd, /diagnosing-bugs |
| 4 | Codebase becomes a ball of mud | Design every day | /improve-codebase-architecture, /codebase-design |

[Source: GitHub README](https://github.com/mattpocock/skills)

---

## 9. Key Quotes

> "Software engineering fundamentals matter more than ever. These skills are my best effort at condensing these fundamentals into repeatable practices, to help you ship the best apps of your career." — [GitHub README](https://github.com/mattpocock/skills)

> "Smart zone vs dumb zone. As a session grows, each token's attention budget is spread across more competitors. The signal on any one meaningful relationship shrinks; noise from irrelevant context crowds in." — [AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/attention-degradation)

> "I believe that being conscious about the context window that you're using, the tokens that you're using is essential to using AI well." — [Tutorial Video](https://www.youtube.com/watch?v=M6mYodf0dJM)

> "Focus on optimizing the AI harness rather than solely on the AI model. Your skills are the ceiling to what AI can do." — [Sozai Transcript](https://sozai.app/transcript/matt-pocock-agentic-engineering-workflow/)

> "The quality of feedback loops establishes the ceiling for AI output quality." — [Sean Weldon analysis](https://www.sean-weldon.com/blog/2026-04-27-workflow-for-ai-coding-matt-pocock)

---

*End of research findings.*
