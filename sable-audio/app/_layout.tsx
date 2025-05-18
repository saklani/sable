import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function RootLayout() {
  // TODO: Check if user is authenticated
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return <Redirect href="/(app)" />;
} 