import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, IconButton, useTheme } from 'react-native-paper';
import { AudioItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

interface AudioDetailScreenProps {
  route: {
    params: {
      item: AudioItem;
    };
  };
}

export default function AudioDetailScreen({ route }: AudioDetailScreenProps) {
  const { item } = route.params;
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handlePlayPause = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement actual audio playback
      setIsPlaying(!isPlaying);
    } catch (err: any) {
      setError(err.message || 'Failed to play audio');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading audio..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>
              {item.title}
            </Text>
            <IconButton
              icon={isPlaying ? 'pause' : 'play'}
              size={24}
              onPress={handlePlayPause}
              style={[
                styles.playButton,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            />
          </View>

          <View style={styles.details}>
            <Text variant="bodyMedium" style={styles.date}>
              Created: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            {item.duration && (
              <Text variant="bodyMedium">
                Duration: {Math.floor(item.duration / 60)}:
                {(item.duration % 60).toString().padStart(2, '0')}
              </Text>
            )}
          </View>

          {item.type === 'text' && (
            <View style={styles.textContent}>
              <Text variant="bodyLarge">{item.text}</Text>
            </View>
          )}

          {item.type === 'file' && (
            <View style={styles.fileContent}>
              <Text variant="bodyMedium">Audio File</Text>
              <Text variant="bodySmall" style={styles.fileUrl}>
                {item.fileUrl}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    marginRight: 16,
  },
  playButton: {
    margin: 0,
  },
  details: {
    marginBottom: 16,
  },
  date: {
    opacity: 0.7,
    marginBottom: 8,
  },
  textContent: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  fileContent: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  fileUrl: {
    opacity: 0.7,
    marginTop: 8,
  },
}); 