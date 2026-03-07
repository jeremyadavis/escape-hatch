import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { CallState, CallerProfile } from '@/types/call';
import { DEFAULT_CALLER } from '@/constants/defaults';

interface CallContextType {
  callState: CallState;
  caller: CallerProfile;
  setCaller: (caller: CallerProfile) => void;
  triggerCall: () => void;
  answerCall: () => void;
  endCall: () => void;
  scheduledTimer: number | null;
  setScheduledTimer: (seconds: number | null) => void;
}

const CallContext = createContext<CallContextType | null>(null);

const STORAGE_KEY = '@escape_hatch_caller';

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [callState, setCallState] = useState<CallState>('idle');
  const [caller, setCallerState] = useState<CallerProfile>(DEFAULT_CALLER);
  const [scheduledTimer, setScheduledTimerState] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved caller profile
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        try {
          setCallerState(JSON.parse(data));
        } catch {}
      }
    });
  }, []);

  const setCaller = useCallback((profile: CallerProfile) => {
    setCallerState(profile);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, []);

  const triggerCall = useCallback(() => {
    setCallState('ringing');
    router.replace('/incoming-call');
  }, []);

  const answerCall = useCallback(() => {
    setCallState('active');
    router.replace('/active-call');
  }, []);

  const endCall = useCallback(() => {
    setCallState('ended');
    // Brief "call ended" display, then go idle
    setTimeout(() => {
      setCallState('idle');
      router.replace('/');
    }, 1500);
  }, []);

  const setScheduledTimer = useCallback((seconds: number | null) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (seconds === null) {
      setScheduledTimerState(null);
      return;
    }

    setScheduledTimerState(seconds);
    timerRef.current = setTimeout(() => {
      setScheduledTimerState(null);
      timerRef.current = null;
      triggerCall();
    }, seconds * 1000);
  }, [triggerCall]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <CallContext.Provider
      value={{
        callState,
        caller,
        setCaller,
        triggerCall,
        answerCall,
        endCall,
        scheduledTimer,
        setScheduledTimer,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}
