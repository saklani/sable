import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../types/navigation';
import { useAudioStore } from '../store';

export default function CreateAudioScreen() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { addItem, setLoading, setError } = useAudioStore();

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const newItem = await api.generateAudio('text', text);
      addItem(newItem);
      navigation.goBack();
    } catch (error: any) {
      setError(error.message || 'Failed to create audio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          mode="outlined"
          label="Enter text to convert to speech"
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={8}
          style={styles.textInput}
        />
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!text.trim() || isLoading}
          style={styles.submitButton}
        >
          Generate Audio
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  textInput: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
}); 