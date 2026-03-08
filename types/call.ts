export type CallState = 'idle' | 'ringing' | 'active' | 'ended';

export interface CallerProfile {
  name: string;
  photo: string | null;
  label: string; // "Mobile", "iPhone", "Work", etc.
}

export interface TimerPreset {
  label: string;
  seconds: number;
}
