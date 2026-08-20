---
title: Keybind Trainer
description: "A tiny web app that drills keyboard shortcuts the way they're actually used: from action name to key, not key to action."
featuredImage: /images/lab/keybind-trainer/keybind-trainer-cover.svg
date: 2026-08-16
tags:
  - Vanilla JS
  - Neovim
  - Keybinds
isCompact: false
isLogo: false
circleLogo: false
category: tools
tools:
  - Vanilla JS
  - HTML
  - CSS
status: Live
hasLiveDemo: false
url: https://github.com/daniel-c-ward/keybind-game
colourLight: "#e3f5e8"
colourDark: "#12251a"
---

## Background

I switched my editor to Neovim, and the wall you hit first isn't the editing; it's the keybinds. `Ctrl+W` windows, leader sequences, motions that only make sense once they're muscle memory. Watching reference sheets didn't work for me: I'd recognise a shortcut when I *saw* it, but that's not the same as being able to *press* it when I need it.

So I built a tiny trainer with a deliberately backward exercise.

## Early Ideas

The failure mode I wanted to fix is the classic one: flashcards show you a shortcut and you nod along, thinking "yes, of course, `Ctrl+Shift+K` deletes a line." Recognition is cheap. Recall is hard. The exercise that actually builds muscle memory is the reverse: **see the action, press the keys.**

So the app has two modes:

- **Free Practice**: see a shortcut, press it, move on. Good for first exposure.
- **Named Practice**: see the action ("Copy", "Delete Line", "Find files"), and *recall* the shortcut from memory. This is the one that does the work.

Both modes handle multi-key sequences too: a shortcut is either a single chord or an ordered list like `Space → s → f` for "Find files", and the trainer waits for the full sequence.

## Design & Build

The whole thing is three files: an HTML shell, a stylesheet, and a data file plus the app logic. No build step, no framework.

The key design decision was making the data the app's best part. Each program is a **mode**: a name, a description, a list of keybinds (each a shortcut plus the action it performs), and a `named` map for the recall exercise. Adding a new program to practise, or a new keybind to an existing one, is purely a data change, not a code change.

The reference material itself came from my own Neovim config: I generated a full keybind reference document from the Lua config files, grouped by source (motions, windows, LSP and Telescope). The trainer data was derived from that same source, so what I practise is exactly what my editor is configured to do. No drift between the trainer and the real setup.

Sequences were the fiddly part. A mode has mixed single-chord and multi-key shortcuts, and the input handler has to know how long to wait: start matching a multi-key sequence, then accept a single chord, and never swallow a keystroke that starts a second chance at a different binding. Practising forces you to be deliberate about exactly this kind of state handling.

## Outcome & Key takeaways

### Outcome

A small, fast, dependency-free trainer that genuinely improved my recall; the named-practice mode is the difference between *recognising* a keybind in a reference and *reaching* for it in an editor. It works for any program with a defined set of shortcuts, not just Neovim.

### Key takeaways

- **Test recall, not recognition.** The backward exercise (action → keys) is the one that builds real skill. Recognition feels like progress and isn't.
- **Make the data boring.** Separating the drill logic from the keybind data means a new program is a data file, not a feature.
- **One source of truth for the reference.** Deriving both the trainer and the reference doc from the same config file meant practice always matched reality.
- **Small tools deserve to exist.** This is three files and a few evenings, and it made a real difference to a daily-workflow skill.

### Hindsight

Stats are currently just a running score; I'd like proper per-keybind error tracking so the trainer can surface the specific shortcuts you keep missing, and maybe spacing the drills out. And a `--sequence`-style editor mode for the data would make adding programs quicker than hand-editing the file.