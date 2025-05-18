import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
import { useAuthStore } from '../store';
// import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export default function AuthScreen() {
  const { setUser, setLoading, setError, isLoading, error } = useAuthStore();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock successful sign in for now
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        photo: 'https://example.com/photo.jpg',
      });
      
      // Commented out Google Sign-In implementation
      /*
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      
      if (!idToken) {
        throw new Error('No ID token present');
      }

      const { user, token } = await api.signInWithGoogle(idToken);
      setUser(user);
      */
      
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Signing in..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to Sable Audio
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your personal audio generation assistant
        </Text>
        
        {error && <ErrorMessage message={error} onRetry={handleGoogleSignIn} />}

        <Button
          mode="contained"
          onPress={handleGoogleSignIn}
          style={styles.googleButton}
          icon="google"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.7,
  },
  googleButton: {
    width: '100%',
    maxWidth: 300,
  },
}); 