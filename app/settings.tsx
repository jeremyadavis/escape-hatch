import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useCall } from '@/context/CallContext';
import { TIMER_PRESETS } from '@/constants/defaults';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { caller, setCaller, setScheduledTimer, scheduledTimer } = useCall();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(caller.name);
  const [label, setLabel] = useState(caller.label);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setCaller({ ...caller, photo: result.assets[0].uri });
    }
  };

  const save = () => {
    setCaller({ ...caller, name: name.trim() || 'Mom', label: label.trim() || 'Mobile' });
    router.back();
  };

  const handleSetTimer = (seconds: number) => {
    setScheduledTimer(seconds);
    Alert.alert('Timer Set', `Call will come in ${seconds / 60} minutes`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleCancelTimer = () => {
    setScheduledTimer(null);
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Pressable onPress={save}>
          <Text style={styles.doneButton}>Done</Text>
        </Pressable>
      </View>

      {/* Caller Photo */}
      <Pressable onPress={pickImage} style={styles.photoSection}>
        {caller.photo ? (
          <Image source={{ uri: caller.photo }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>+</Text>
          </View>
        )}
        <Text style={styles.photoHint}>Tap to change photo</Text>
      </Pressable>

      {/* Caller Name */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Caller Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Mom"
          placeholderTextColor="#666"
          autoCorrect={false}
        />
      </View>

      {/* Caller Label */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Caller Label</Text>
        <TextInput
          style={styles.input}
          value={label}
          onChangeText={setLabel}
          placeholder="Mobile"
          placeholderTextColor="#666"
          autoCorrect={false}
        />
      </View>

      {/* Timer Presets */}
      <View style={styles.timerSection}>
        <Text style={styles.sectionTitle}>Schedule a Call</Text>
        <View style={styles.timerButtons}>
          {TIMER_PRESETS.map((preset) => (
            <Pressable
              key={preset.seconds}
              style={styles.timerButton}
              onPress={() => handleSetTimer(preset.seconds)}
            >
              <Text style={styles.timerButtonText}>{preset.label}</Text>
            </Pressable>
          ))}
        </View>
        {scheduledTimer && (
          <Pressable style={styles.cancelTimerButton} onPress={handleCancelTimer}>
            <Text style={styles.cancelTimerText}>Cancel Timer</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  doneButton: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },

  // Photo
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 36,
    color: '#888',
  },
  photoHint: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
  },

  // Fields
  field: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 14,
    fontSize: 17,
    color: '#FFF',
  },

  // Timer
  timerSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timerButton: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  timerButtonText: {
    fontSize: 17,
    color: '#FFF',
    fontWeight: '500',
  },
  cancelTimerButton: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    alignItems: 'center',
  },
  cancelTimerText: {
    fontSize: 17,
    color: '#FF3B30',
    fontWeight: '500',
  },
});
