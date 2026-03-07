import { Platform } from 'react-native';

const ios = {
  callBackground: '#1C1C1E',
  acceptGreen: '#34C759',
  declineRed: '#FF3B30',
  endCallRed: '#FF3B30',
  buttonBackground: 'rgba(255, 255, 255, 0.15)',
  buttonBackgroundActive: 'rgba(255, 255, 255, 0.4)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  inCallBackground: '#000000',
};

const android = {
  callBackground: '#1A1A1A',
  acceptGreen: '#4CAF50',
  declineRed: '#B00020',
  endCallRed: '#B00020',
  buttonBackground: 'rgba(255, 255, 255, 0.12)',
  buttonBackgroundActive: 'rgba(255, 255, 255, 0.3)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  inCallBackground: '#121212',
};

const CallColors = Platform.OS === 'ios' ? ios : android;

export default CallColors;
