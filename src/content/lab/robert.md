---
title: Robert
description: A local, fully-interruptible voice assistant; you can cut it off mid-sentence and it keeps the thought.
featuredImage: /images/lab/robert/robert-cover.svg
date: 2026-08-6
tags:
  - Python
  - AI
  - Voice
  - Local-first
isCompact: false
isLogo: false
circleLogo: false
category: ai
tools:
  - Python
  - faster-whisper
  - Ollama
  - Kokoro
  - openWakeWord
status: In Progress
hasLiveDemo: false
colourLight: "#fdeee0"
colourDark: "#3c2311"
---

## Background

I wanted a voice assistant that behaves like a person you'd actually talk to. That meant one thing above all: **you should be able to interrupt it.** Every assistant I'd used makes you wait until it finishes speaking; if you were wrong or want to change tack, you're stuck listening. That single frustration drove the whole project.

I also wanted it to run entirely on my hardware. No cloud round-trips for my audio, my prompts or my replies. The stack I landed on is whisper for speech-to-text, a local LLM for reasoning, and Kokoro for speech synthesis, all fitting in the 8 GB of VRAM on my machine.

## Early Ideas

The core loop looked simple on paper:

```
mic → VAD → STT (faster-whisper) → LLM (ollama) → TTS (Kokoro) → speaker
```

The complexity lived in the seams. I wanted every stage swappable between local and cloud, and between VAD, push-to-talk and wake word, so the assistant wasn't tied to any one provider. Each became a narrow interface: `InputMode`, `LLM`, and so on, with a local and a cloud implementation each.

But the real design problem was the interrupt loop. What happens when the assistant is mid-sentence and you start talking? Three things need to stay true:

- Playback cuts fast, so it doesn't talk over you.
- The text it had already generated isn't thrown away; being cut off isn't the same as being wrong.
- Your interruption becomes the next user turn, with the assistant's partial answer kept in the session record.

I built that loop first, and I built it test-first.

## Design & Build

### Barge-in semantics

The assistant's own voice can't count as an interruption; it has to be able to speak without stopping itself. So playback uses a dedicated barge-in VAD that resets at every sentence start, with a 0.25 s grace period to ignore the sound of its own sentence onset (self-echo). Anything after that is a genuine interruption: playback cuts, the full generated text is kept and written to the session with `interrupted: true`, and the barge-in becomes the next turn.

The distinction I was careful about: truncating the _audio_ is fine, but truncating the _thought_ isn't. The session record always holds the complete generated reply.

### Sessions

Every turn is appended to a resumable JSONL session file under `~/.robert/sessions/`. You can start a new session, resume the most recent one with `--resume`, or pick one by id. History windowing (40 turns / ~16k tokens) keeps the context fed to the LLM useful.

### The seams

| Concern | Local default                         | Swappable to                                 |
| ------- | ------------------------------------- | -------------------------------------------- |
| Input   | VAD (any speech)                      | PTT, wake word (openWakeWord), scripted demo |
| STT     | faster-whisper (`small`, GPU)         | –                                            |
| LLM     | ollama (`qwen3.5:9b`, `think: false`) | any OpenAI-compatible cloud API              |
| TTS     | Kokoro via `kokoro-onnx`              | –                                            |
| Speaker | `paplay` (native PipeWire)            | sounddevice                                  |

The model choice was itself a measured trade-off. An agentic coding model gave 43-second round trips because of its baked-in reasoning block; `qwen3.5:9b` with thinking disabled answers in about 0.6 s. For a _conversation_ you want the fast one, and it's a config line, not a rewrite.

### Testing

The barge-in behaviour is verified by an integration test that drives the real loop with a fake microphone and fake speaker: it synthesises a question, gets an answer, barges in mid-reply, and asserts the reply was cut, flagged `interrupted`, the barge became a turn, and that turn was answered in turn. That test was the contract the whole loop was built against.

### Hardware lessons

This project taught me a lot of debugging along the way:

- The laptop's internal microphone is broken at the codec/pin level; every capture route returns near-full-scale DC garbage. Measured, documented, and loudly warned about at startup rather than silently failing.
- Raw ALSA playback is a dead end on modern PipeWire systems. `paplay` writes a temp WAV and plays through the system sink, honouring your volume and routing.
- Kokoro has no torch wheels for this Python version; `kokoro-onnx` avoids torch entirely.

Those findings are written up in the README so the next person doesn't rediscover them.

## Outcome & Key takeaways

### Outcome

Robert is a working, interruptible, local voice assistant. With a USB mic in (the built-in one is dead), the loop is genuinely pleasant: whisper → local LLM → Kokoro, all on 8 GB of VRAM, with a `--demo` mode that runs the whole pipeline with a scripted mic for machines without audio hardware.

### Key takeaways

- **Build the interrupt semantics first, test-first.** The loop is the product; everything else is plumbing around it.
- **Seams beat providers.** Because every stage is an interface, the assistant isn't stranded if one model or service changes.
- **The fastest model wins for conversation.** Agentic reasoning models are great for coding tasks and terrible for their latency in dialogue, but swapping is one config line.
- **Document your dead ends.** The mic and PipeWire findings took real time to diagnose; future me gets them free.

### Hindsight

The config is still hardcoded variables rather than a file, which limits the value of all those swappable seams. Next on the list: a real config file with runtime hotkeys to switch input modes, streaming transcription, echo cancellation, and the experiment I'm most curious about: multi-user voice separation with inferred identity.
