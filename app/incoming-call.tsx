import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Vibration, Image, Animated } from 'react-native';
import { useCall } from '@/context/CallContext';
import CallColors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function IncomingCallScreen() {
  const { caller, answerCall, endCall } = useCall();
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Vibrate on mount (simulates ringing)
  useEffect(() => {
    const pattern = [0, 1000, 1000]; // wait, vibrate, pause
    const interval = setInterval(() => {
      Vibration.vibrate(pattern);
    }, 3000);
    Vibration.vibrate(pattern);

    return () => {
      clearInterval(interval);
      Vibration.cancel();
    };
  }, []);

  // Pulse animation on the accept button
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const isIOS = Platform.OS === 'ios';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      {/* Caller Info */}
      <View style={styles.callerSection}>
        {caller.photo ? (
          <Image source={{ uri: caller.photo }} style={styles.callerPhoto} />
        ) : (
          <View style={styles.callerPhotoPlaceholder}>
            <Text style={styles.callerInitial}>{caller.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.callerName}>{caller.name}</Text>
        <Text style={styles.callerLabel}>{caller.label}</Text>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonSection}>
        {isIOS ? (
          <IOSButtons onAccept={answerCall} onDecline={endCall} pulseAnim={pulseAnim} />
        ) : (
          <AndroidButtons onAccept={answerCall} onDecline={endCall} pulseAnim={pulseAnim} />
        )}
      </View>
    </View>
  );
}

function IOSButtons({
  onAccept,
  onDecline,
  pulseAnim,
}: {
  onAccept: () => void;
  onDecline: () => void;
  pulseAnim: Animated.Value;
}) {
  return (
    <View style={styles.iosButtonContainer}>
      {/* Top row: Remind Me / Message */}
      <View style={styles.iosSecondaryRow}>
        <View style={styles.iosSecondaryButton}>
          <View style={styles.iosSecondaryIcon}>
            <Text style={styles.iosSecondaryIconText}>🔔</Text>
          </View>
          <Text style={styles.iosSecondaryLabel}>Remind Me</Text>
        </View>
        <View style={styles.iosSecondaryButton}>
          <View style={styles.iosSecondaryIcon}>
            <Text style={styles.iosSecondaryIconText}>💬</Text>
          </View>
          <Text style={styles.iosSecondaryLabel}>Message</Text>
        </View>
      </View>

      {/* Bottom row: Decline / Accept */}
      <View style={styles.iosMainRow}>
        <Pressable onPress={onDecline} style={styles.iosActionButton}>
          <View style={[styles.iosCallButton, styles.iosDeclineButton]}>
            <Text style={styles.iosCallButtonIcon}>✕</Text>
          </View>
          <Text style={styles.iosButtonLabel}>Decline</Text>
        </Pressable>

        <Pressable onPress={onAccept} style={styles.iosActionButton}>
          <Animated.View style={[styles.iosCallButton, styles.iosAcceptButton, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.iosCallButtonIcon}>📞</Text>
          </Animated.View>
          <Text style={styles.iosButtonLabel}>Accept</Text>
        </Pressable>
      </View>
    </View>
  );
}

function AndroidButtons({
  onAccept,
  onDecline,
  pulseAnim,
}: {
  onAccept: () => void;
  onDecline: () => void;
  pulseAnim: Animated.Value;
}) {
  return (
    <View style={styles.androidButtonContainer}>
      {/* Swipe-style pill indicator */}
      <View style={styles.androidPill}>
        <Pressable onPress={onDecline} style={styles.androidPillSide}>
          <View style={[styles.androidCircleButton, styles.androidDecline]}>
            <Text style={styles.androidButtonIcon}>✕</Text>
          </View>
          <Text style={styles.androidPillLabel}>Decline</Text>
        </Pressable>

        <Pressable onPress={onAccept} style={styles.androidPillSide}>
          <Animated.View style={[styles.androidCircleButton, styles.androidAccept, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.androidButtonIcon}>📞</Text>
          </Animated.View>
          <Text style={styles.androidPillLabel}>Answer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CallColors.callBackground,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Caller Info
  callerSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  callerPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  callerPhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  callerInitial: {
    fontSize: 48,
    fontWeight: '300',
    color: CallColors.textPrimary,
  },
  callerName: {
    fontSize: Platform.OS === 'ios' ? 34 : 28,
    fontWeight: Platform.OS === 'ios' ? '300' : 'bold',
    color: CallColors.textPrimary,
    marginBottom: 6,
  },
  callerLabel: {
    fontSize: Platform.OS === 'ios' ? 17 : 14,
    color: CallColors.textSecondary,
  },

  buttonSection: {
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 20,
  },

  // iOS Buttons
  iosButtonContainer: {
    gap: 30,
  },
  iosSecondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iosSecondaryButton: {
    alignItems: 'center',
    gap: 6,
  },
  iosSecondaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CallColors.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iosSecondaryIconText: {
    fontSize: 22,
  },
  iosSecondaryLabel: {
    fontSize: 13,
    color: CallColors.textSecondary,
  },
  iosMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iosActionButton: {
    alignItems: 'center',
    gap: 8,
  },
  iosCallButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iosDeclineButton: {
    backgroundColor: CallColors.declineRed,
  },
  iosAcceptButton: {
    backgroundColor: CallColors.acceptGreen,
  },
  iosCallButtonIcon: {
    fontSize: 28,
    color: '#FFF',
  },
  iosButtonLabel: {
    fontSize: 15,
    color: CallColors.textPrimary,
  },

  // Android Buttons
  androidButtonContainer: {
    alignItems: 'center',
  },
  androidPill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  androidPillSide: {
    alignItems: 'center',
    gap: 10,
  },
  androidCircleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidDecline: {
    backgroundColor: CallColors.declineRed,
  },
  androidAccept: {
    backgroundColor: CallColors.acceptGreen,
  },
  androidButtonIcon: {
    fontSize: 24,
    color: '#FFF',
  },
  androidPillLabel: {
    fontSize: 14,
    color: CallColors.textSecondary,
  },
});
