---
title: comms-cli
description: A CLI tool for managing the comms hub and pi agents
featuredImage: /images/lab/comms-cli/comms-cli-cover.png
logoImage: /images/lab/comms-cli/comms-cli-logo.png
date: 2026-08-10
tags:
  - Go
  - CLI
  - pi
  - Open Source
url: https://github.com/daniel-c-ward/comms-cli
isCompact: false
isLogo: true
circleLogo: true
category: tools
tools:
  - Go
  - pi
  - Typescript
status: Live
hasLiveDemo: false
colourLight: "#e3f3fc"
colourDark: "#151c3d"
---

## Background

I wanted to build something that allowed me to connect AI agents. **pi** is my AI agent framework, and a **hub** is the message broker that agents use to talk to each other. I didn't like the lack of control I had over subagents and what they returned to my main agent, bloating the context with mostly useless information. This also let me talk directly to the agent that had received the delegated task, so I could clarify what was intended.

## Early Ideas

The concept was:

- A server allowing pi agents to send and receive messages
- An extension to allow pi's tui to show the other agents

I started by exploring what pi agent data was available through the hub API, and what commands would be most useful. I sketched out a simple design: a `comms status` command that shows hub health and agent cards, plus basic serve/start/stop commands.

I considered several approaches:

- A simple Go binary that wraps the pi CLI
- Building on top of the existing pi extension system
- Creating a standalone tool that could be independent

I went with Go because it compiled to a single binary, and made distribution easy. The initial prototype was just a `comms status` command that pinged the local hub and displayed agent information.

## Design & Build

I built **comms-cli** in Go, aiming for a small binary that could be installed with `go install`. Key design decisions: Key design decisions:

- **Hub-first approach**: The CLI talks to a comms hub running locally or remotely. The hub manages agent state, so the CLI just displays it.
- **Agent cards**: Each agent gets a compact card showing name, model, context usage, and queue depth - inspired by dashboard UIs I've used previously.
- **Subcommands**: `serve`, `start`, `stop`, `status`, and `join` provide the full lifecycle management.

### Key components

- **Hub integration**: The CLI connects to the comms hub (via HTTP) and reads the current agent roster and hub health.
- **Status command**: Shows a summary of hub health plus individual agent cards with their current state.
- **Setup command**: `comms setup` auto-discovers the pi config files on disk, installs the comms extension into pi's auto-discovery directory, and smoke-verifies it loads.

### Challenges

One known issue (tracked as [#11](https://github.com/daniel-c-ward/comms-cli/issues/11)): prompts can be silently dropped when a slow consumer's stream fills, even while still being marked delivered. This is marked p0 on the roadmap, and multi-machine and TLS support are also planned.

## Hosting & Deployment

Since comms-cli is a CLI tool, there's no traditional hosting - it runs locally on your machine. However:

- **Installation**: `go install github.com/daniel-c-ward/comms-cli/cmd/comms@latest` puts the binary in your PATH
- **Setup**: Run `comms setup` to install the comms extension into pi and verify it loads
- **Usage**: The hub runs locally by default (loopback). For multi-machine setups, TLS and remote hub configuration are on the roadmap

The project is hosted on GitHub at https://github.com/daniel-c-ward/comms-cli, where issues, discussions, and contributions are welcome.

## Outcome & Key takeaways

### Outcome

At time of writing, comms-cli is on **v0.1.0** - a pre-1.0 release where breaking changes are expected between releases. It's primarily tested on Linux, with macOS and Windows built in CI but not yet runtime-tested. The tool is being used in my own workflow to quickly check hub health and agent status without leaving the terminal.

### Key takeaways

- Building a Go CLI from scratch was a great way to learn about binary distribution, environment detection, and hub integration.
- The `comms setup` command proved essential for lowering the barrier to entry - automating the extension discovery and verification saves users time.
- Having a public repo with "good first issue" labels has been effective for attracting contributions; the project has already had several small PRs from the community.
- The known prompt-dropping issue is a good reminder that real-time communication systems need back-pressure handling, and I'm looking forward to tackling it in the next release.

### Hindsight

In hindsight, I would:

- I should have integrated CI testing sooner. It would have saved many hours of googling many problems.
- I should have started using headless virtual machines earlier to speed up cross-OS development.

I'm pleased with where comms-cli is at for a 0.1.0 release, and I'm looking forward to iterating on it as my free time grows and I integrate it further into my workflow.
