import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AudioPlayer } from '../../../src/components/AudioPlayer';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { ErrorMessage } from '../../../src/components/ErrorMessage';
import { api } from '../../../src/services/api';
import { AudioItem } from '../../../src/types';

export default function AudioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<AudioItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    loadAudioItem();
  }, [id]);

  const loadAudioItem = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const audioItem = await api.getAudio(id);
      setItem(audioItem);
    } catch (error: any) {
      setError(error.message || 'Failed to load audio item');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading audio details..." />;
  }

  if (error || !item) {
    return <ErrorMessage message={error || 'Audio not found'} onRetry={loadAudioItem} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {item.title}
        </Text>
        <Text variant="bodyLarge" style={styles.type}>
          {item.type === 'text' ? 'Text to Speech' : 'Audio File'}
        </Text>
        <Text variant="bodyMedium" style={styles.date}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tags}>
            {item.tags.map((tag) => (
              <Text key={tag} style={[styles.tag, { backgroundColor: theme.colors.primaryContainer }]}>
                {tag}
              </Text>
            ))}
          </View>
        )}
        {item.type === 'file' && (
          <AudioPlayer item={item} onClose={() => {}} />
        )}
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.button}
        >
          Back to List
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  type: {
    marginBottom: 8,
    color: '#666',
  },
  date: {
    marginBottom: 16,
    color: '#666',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
}); 