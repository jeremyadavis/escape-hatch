import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CallProvider } from '@/context/CallContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <CallProvider>
      <StatusBar style="light" hidden />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: '#000' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="incoming-call" />
        <Stack.Screen name="active-call" />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </CallProvider>
  );
}
