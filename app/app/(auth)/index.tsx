import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const router = useRouter();

  const handleSignIn = () => {
    // TODO: Implement sign in
    router.replace('/(app)');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Welcome to Sable Audio
      </Text>
      <Button
        mode="contained"
        onPress={handleSignIn}
        style={styles.button}
      >
        Sign In
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
}); 