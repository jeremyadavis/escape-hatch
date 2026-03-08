# Escape Hatch

A React Native (Expo) app that simulates an incoming phone call, giving you a believable excuse to leave awkward conversations, meetings, or any situation you'd rather not be in.

## How It Works

1. **Open the app** — it immediately starts ringing with a realistic incoming call screen
2. **Answer the call** — tap accept and have a convincing fake conversation with voice responses
3. **Excuse yourself** — end the call whenever you're ready

## Features

- **Realistic Incoming Call UI** — Platform-specific screens that closely mimic native iOS and Android phone apps
- **Voice Conversation** — Text-to-speech plays natural conversational lines with pauses so you can talk back
- **Auto-Ring on Launch** — Simply open the app and the call starts immediately
- **Timer Presets** — Schedule a call for 2, 5, or 10 minutes from now
- **Configurable Caller** — Set the caller name, photo, and label
- **Hidden Settings** — Long-press the mute button for 5 seconds to access settings (invisible to onlookers)
- **Call Duration Timer** — Shows a running timer during active calls for added realism

## Tech Stack

- [Expo](https://expo.dev) (React Native) with Expo Router
- TypeScript
- expo-speech for voice playback
- expo-image-picker for caller photo
- AsyncStorage for settings persistence

## Getting Started

```bash
npm install
npx expo start
```

## Project Structure

```
escape-hatch/
├── app/                # Screens (incoming call, active call, settings)
├── assets/             # Images, audio files, fonts
├── components/         # Reusable UI components
├── constants/          # Colors, defaults, voice scripts
├── context/            # React Context (call state management)
├── hooks/              # Custom React hooks
├── services/           # Audio, notification services
└── types/              # TypeScript type definitions
```

## License

MIT
