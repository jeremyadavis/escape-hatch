import { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useCall } from '@/context/CallContext';
import CallColors from '@/constants/Colors';
import { VOICE_SCRIPT, SECRET_PRESS_DURATION } from '@/constants/defaults';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Vibration } from 'react-native';

export default function ActiveCallScreen() {
  const { caller, endCall, callState } = useCall();
  const insets = useSafeAreaInsets();
  const [elapsed, setElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const speechActive = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scriptRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Call duration timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Voice playback using TTS as placeholder
  const playScript = useCallback(async () => {
    for (let i = 0; i < VOICE_SCRIPT.length; i++) {
      if (!speechActive.current) break;
      setCurrentLine(i);

      await new Promise<void>((resolve) => {
        Speech.speak(VOICE_SCRIPT[i].text, {
          language: 'en-US',
          pitch: 1.0,
          rate: 0.9,
          onDone: resolve,
          onError: () => resolve(),
        });
      });

      if (!speechActive.current) break;

      // Pause between lines (simulates waiting for user response)
      await new Promise<void>((resolve) => {
        scriptRef.current = setTimeout(resolve, VOICE_SCRIPT[i].pauseAfter);
      });
    }
  }, []);

  useEffect(() => {
    speechActive.current = true;
    // Small delay before "other person" starts talking
    const startDelay = setTimeout(() => {
      playScript();
    }, 2000);

    return () => {
      speechActive.current = false;
      clearTimeout(startDelay);
      if (scriptRef.current) clearTimeout(scriptRef.current);
      Speech.stop();
    };
  }, [playScript]);

  const handleEndCall = () => {
    speechActive.current = false;
    Speech.stop();
    endCall();
  };

  // Secret long-press on mute button to access settings
  const handleMutePressIn = () => {
    endPressTimer.current = setTimeout(() => {
      Vibration.vibrate(50);
      speechActive.current = false;
      Speech.stop();
      router.push('/settings');
    }, SECRET_PRESS_DURATION);
  };

  const handleMutePressOut = () => {
    if (endPressTimer.current) {
      clearTimeout(endPressTimer.current);
      endPressTimer.current = null;
    }
  };

  const handleMuteTap = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isIOS = Platform.OS === 'ios';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      {/* Caller Info + Timer */}
      <View style={styles.topSection}>
        {caller.photo ? (
          <Image source={{ uri: caller.photo }} style={styles.callerPhoto} />
        ) : (
          <View style={styles.callerPhotoPlaceholder}>
            <Text style={styles.callerInitial}>{caller.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.callerName}>{caller.name}</Text>
        <Text style={styles.callTimer}>{formatTime(elapsed)}</Text>
      </View>

      {/* Action Buttons Grid */}
      <View style={styles.gridSection}>
        {isIOS ? (
          <IOSGrid
            isMuted={isMuted}
            isSpeaker={isSpeaker}
            onMuteTap={handleMuteTap}
            onMutePressIn={handleMutePressIn}
            onMutePressOut={handleMutePressOut}
            onSpeakerTap={() => setIsSpeaker(!isSpeaker)}
          />
        ) : (
          <AndroidGrid
            isMuted={isMuted}
            isSpeaker={isSpeaker}
            onMuteTap={handleMuteTap}
            onMutePressIn={handleMutePressIn}
            onMutePressOut={handleMutePressOut}
            onSpeakerTap={() => setIsSpeaker(!isSpeaker)}
          />
        )}
      </View>

      {/* End Call Button */}
      <View style={styles.endCallSection}>
        <Pressable onPress={handleEndCall} style={styles.endCallButton}>
          <Text style={styles.endCallIcon}>📞</Text>
        </Pressable>
        {isIOS && <Text style={styles.endCallLabel}>End</Text>}
      </View>
    </View>
  );
}

interface GridProps {
  isMuted: boolean;
  isSpeaker: boolean;
  onMuteTap: () => void;
  onMutePressIn: () => void;
  onMutePressOut: () => void;
  onSpeakerTap: () => void;
}

function IOSGrid({ isMuted, isSpeaker, onMuteTap, onMutePressIn, onMutePressOut, onSpeakerTap }: GridProps) {
  return (
    <View style={styles.iosGrid}>
      {/* Row 1 */}
      <View style={styles.gridRow}>
        <Pressable
          onPress={onMuteTap}
          onPressIn={onMutePressIn}
          onPressOut={onMutePressOut}
          style={styles.gridItem}
        >
          <View style={[styles.iosGridButton, isMuted && styles.iosGridButtonActive]}>
            <Text style={styles.gridButtonIcon}>🔇</Text>
          </View>
          <Text style={styles.gridButtonLabel}>mute</Text>
        </Pressable>

        <View style={styles.gridItem}>
          <View style={styles.iosGridButton}>
            <Text style={styles.gridButtonIcon}>⌨️</Text>
          </View>
          <Text style={styles.gridButtonLabel}>keypad</Text>
        </View>

        <Pressable onPress={onSpeakerTap} style={styles.gridItem}>
          <View style={[styles.iosGridButton, isSpeaker && styles.iosGridButtonActive]}>
            <Text style={styles.gridButtonIcon}>🔊</Text>
          </View>
          <Text style={styles.gridButtonLabel}>speaker</Text>
        </Pressable>
      </View>

      {/* Row 2 */}
      <View style={styles.gridRow}>
        <View style={styles.gridItem}>
          <View style={styles.iosGridButton}>
            <Text style={styles.gridButtonIcon}>➕</Text>
          </View>
          <Text style={styles.gridButtonLabel}>add call</Text>
        </View>

        <View style={styles.gridItem}>
          <View style={styles.iosGridButton}>
            <Text style={styles.gridButtonIcon}>📹</Text>
          </View>
          <Text style={styles.gridButtonLabel}>FaceTime</Text>
        </View>

        <View style={styles.gridItem}>
          <View style={styles.iosGridButton}>
            <Text style={styles.gridButtonIcon}>👤</Text>
          </View>
          <Text style={styles.gridButtonLabel}>contacts</Text>
        </View>
      </View>
    </View>
  );
}

function AndroidGrid({ isMuted, isSpeaker, onMuteTap, onMutePressIn, onMutePressOut, onSpeakerTap }: GridProps) {
  return (
    <View style={styles.androidGrid}>
      <Pressable
        onPress={onMuteTap}
        onPressIn={onMutePressIn}
        onPressOut={onMutePressOut}
        style={styles.androidGridItem}
      >
        <View style={[styles.androidGridButton, isMuted && styles.androidGridButtonActive]}>
          <Text style={styles.gridButtonIcon}>🔇</Text>
        </View>
        <Text style={styles.androidGridLabel}>Mute</Text>
      </Pressable>

      <View style={styles.androidGridItem}>
        <View style={styles.androidGridButton}>
          <Text style={styles.gridButtonIcon}>⌨️</Text>
        </View>
        <Text style={styles.androidGridLabel}>Keypad</Text>
      </View>

      <Pressable onPress={onSpeakerTap} style={styles.androidGridItem}>
        <View style={[styles.androidGridButton, isSpeaker && styles.androidGridButtonActive]}>
          <Text style={styles.gridButtonIcon}>🔊</Text>
        </View>
        <Text style={styles.androidGridLabel}>Speaker</Text>
      </Pressable>

      <View style={styles.androidGridItem}>
        <View style={styles.androidGridButton}>
          <Text style={styles.gridButtonIcon}>⋮</Text>
        </View>
        <Text style={styles.androidGridLabel}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CallColors.inCallBackground,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Top Section
  topSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  callerPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  callerPhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  callerInitial: {
    fontSize: 32,
    fontWeight: '300',
    color: CallColors.textPrimary,
  },
  callerName: {
    fontSize: Platform.OS === 'ios' ? 20 : 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: CallColors.textPrimary,
    marginBottom: 4,
  },
  callTimer: {
    fontSize: 17,
    color: CallColors.textSecondary,
    fontVariant: ['tabular-nums'],
  },

  // Grid
  gridSection: {
    width: '100%',
    paddingHorizontal: 20,
  },

  // iOS Grid
  iosGrid: {
    gap: 24,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gridItem: {
    alignItems: 'center',
    gap: 6,
    width: 80,
  },
  iosGridButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: CallColors.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iosGridButtonActive: {
    backgroundColor: CallColors.buttonBackgroundActive,
  },
  gridButtonIcon: {
    fontSize: 24,
  },
  gridButtonLabel: {
    fontSize: 13,
    color: CallColors.textSecondary,
    fontWeight: '300',
  },

  // Android Grid
  androidGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  androidGridItem: {
    alignItems: 'center',
    gap: 8,
  },
  androidGridButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CallColors.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidGridButtonActive: {
    backgroundColor: CallColors.buttonBackgroundActive,
  },
  androidGridLabel: {
    fontSize: 12,
    color: CallColors.textSecondary,
  },

  // End Call
  endCallSection: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  endCallButton: {
    width: Platform.OS === 'ios' ? 72 : undefined,
    height: Platform.OS === 'ios' ? 72 : 48,
    borderRadius: Platform.OS === 'ios' ? 36 : 28,
    paddingHorizontal: Platform.OS === 'ios' ? 0 : 60,
    backgroundColor: CallColors.endCallRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallIcon: {
    fontSize: 28,
    color: '#FFF',
    transform: [{ rotate: '135deg' }],
  },
  endCallLabel: {
    fontSize: 15,
    color: CallColors.textPrimary,
  },
});
