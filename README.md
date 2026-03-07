# Escape Hatch

A React Native (Expo) app that simulates an incoming phone call, giving you a believable excuse to leave awkward conversations, meetings, or any situation you'd rather not be in.

## How It Works

1. **Trigger a fake call** using one of several methods (see below)
2. Your phone rings with a realistic incoming call screen that mimics your device's native phone app
3. "Answer" the call and have a convincing fake conversation — the app plays realistic voice responses with natural conversational phrases
4. Excuse yourself and walk away

## Features

- **Realistic Incoming Call UI** — Mimics the native iOS/Android phone app so it looks like a genuine call
- **Conversational Voice Playback** — Plays pre-recorded or generated voice lines with standard conversation phrases so you can talk back and appear engaged
- **Multiple Trigger Methods:**
  - **Open the App** — Simply launch the app and the call starts ringing
  - **Hardware Button Sequence** — Trigger a call by pressing a button combo (e.g., triple-press the volume button) without needing to open the app
  - **Timer / Alarm** — Set a delay (e.g., "call me in 5 minutes") or schedule a specific time for the call to come in

## Tech Stack

- [Expo](https://expo.dev) (React Native)

## Getting Started

### Prerequisites

- Node.js (LTS)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator, Android Emulator, or a physical device with [Expo Go](https://expo.dev/go)

### Installation

```bash
git clone https://github.com/<your-org>/escape-hatch.git
cd escape-hatch
npm install
```

### Running the App

```bash
npx expo start
```

Then open the app on your device or emulator using the QR code or Expo Go.

## Project Structure

```
escape-hatch/
├── app/                # Expo Router screens
├── assets/             # Images, audio files, fonts
├── components/         # Reusable UI components
├── constants/          # App-wide constants and config
├── hooks/              # Custom React hooks
└── services/           # Call simulation, audio, trigger logic
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT
