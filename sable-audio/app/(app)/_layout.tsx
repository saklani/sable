import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { setupPlayer } from '../../src/services/audioPlayer';

export default function AppLayout() {
  useEffect(() => {
    setupPlayer();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
} 