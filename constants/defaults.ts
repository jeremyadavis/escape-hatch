import { CallerProfile, TimerPreset } from '@/types/call';

export const DEFAULT_CALLER: CallerProfile = {
  name: 'Mom',
  photo: null,
  label: 'Mobile',
};

export const TIMER_PRESETS: TimerPreset[] = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
];

export const VOICE_SCRIPT = [
  { id: 'greeting', text: 'Hey! How are you?', pauseAfter: 3500 },
  { id: 'filler1', text: "Yeah so I was calling because I wanted to ask you something real quick.", pauseAfter: 4000 },
  { id: 'filler2', text: "Uh huh, right, right.", pauseAfter: 3000 },
  { id: 'filler3', text: "Oh for sure, that makes total sense.", pauseAfter: 5000 },
  { id: 'goodbye', text: "Alright well I will let you go. Talk to you later!", pauseAfter: 2000 },
];

// Secret gesture: long-press duration in ms to open settings
export const SECRET_PRESS_DURATION = 5000;
