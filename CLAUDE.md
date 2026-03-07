# CLAUDE.md

## Project Overview

Escape Hatch — an Expo (React Native) app that simulates a realistic incoming phone call so the user can excuse themselves from unwanted conversations or meetings.

## Tech Stack

- **Framework**: Expo (React Native) with Expo Router for navigation
- **Language**: TypeScript
- **Styling**: React Native StyleSheet (platform-specific styles for iOS/Android native look)
- **Audio**: expo-av for ringtone playback and conversational voice lines
- **Notifications**: expo-notifications for timer/alarm-triggered calls
- **Background**: expo-task-manager for background trigger support

## Project Structure

```
escape-hatch/
├── app/                # Expo Router screens (incoming call, in-call, settings, timer)
├── assets/             # Ringtones, voice audio clips, contact images, fonts
├── components/         # Reusable UI (call buttons, caller ID, timer picker)
├── constants/          # Colors, caller profiles, conversation scripts
├── hooks/              # Custom hooks (useCallSimulation, useTimer, useHardwareTrigger)
├── services/           # Core logic: audio playback, call state machine, trigger manager
└── types/              # TypeScript type definitions
```

## Core Features

1. **Fake Incoming Call Screen** — Must closely mimic native iOS/Android phone UI (platform-specific)
2. **Voice Conversation** — Plays audio responses with natural pauses so the user can talk back
3. **Triggers**:
   - App launch → immediate ring
   - Hardware button sequence (e.g., triple volume press)
   - Timer/alarm — user sets a delay or specific time

## Key Design Decisions

- Platform-specific call UI: use `Platform.OS` to render iOS-style or Android-style call screens
- Call state machine: `idle → ringing → active → ended` with clean transitions
- Voice lines should have natural timing gaps for the user to "respond"
- Ringtone must match the device's native ring style as closely as possible

## Commands

```bash
# Install dependencies
npm install

# Start dev server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Lint
npx expo lint

# Type check
npx tsc --noEmit
```

## Code Conventions

- Use functional components with hooks
- Use TypeScript strict mode
- File naming: kebab-case for files, PascalCase for components
- Keep platform-specific code in `.ios.tsx` / `.android.tsx` files when differences are significant
- Prefer Expo SDK packages over bare React Native community packages
