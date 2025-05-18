import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message} variant="bodyLarge">
        {message}
      </Text>
      {onRetry && (
        <Button mode="contained" onPress={onRetry} style={styles.button}>
          Retry
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
}); 