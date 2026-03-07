import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Text, Vibration } from 'react-native';
import { useCall } from '@/context/CallContext';
import { router } from 'expo-router';
import { SECRET_PRESS_DURATION } from '@/constants/defaults';

export default function IdleScreen() {
  const { triggerCall, callState, scheduledTimer } = useCall();
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showHint, setShowHint] = useState(false);
  const hasTriggered = useRef(false);

  // Auto-trigger call on first app launch
  useEffect(() => {
    if (!hasTriggered.current && callState === 'idle' && !scheduledTimer) {
      hasTriggered.current = true;
      // Small delay to let the app fully render
      const t = setTimeout(() => {
        triggerCall();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [callState, triggerCall, scheduledTimer]);

  const handlePressIn = () => {
    pressTimer.current = setTimeout(() => {
      Vibration.vibrate(50);
      setShowHint(false);
      router.push('/settings');
    }, SECRET_PRESS_DURATION);
  };

  const handlePressOut = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleTap = () => {
    if (!scheduledTimer) {
      triggerCall();
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handleTap}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {scheduledTimer && (
        <View style={styles.timerIndicator}>
          <Text style={styles.timerDot}>●</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  timerIndicator: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  timerDot: {
    color: 'rgba(255, 255, 255, 0.05)',
    fontSize: 8,
  },
});
