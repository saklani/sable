import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AudioList } from '../../src/components/AudioList';
import { FloatingActionButton } from '../../src/components/FloatingActionButton';
import { mockApi } from '../../src/services/mockApi';
import { AudioItem } from '../../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const [items, setItems] = useState<AudioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const audioItems = await mockApi.audio.listItems();
      setItems(audioItems);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleItemPress = (item: AudioItem) => {
    router.push(`/audio/${item.id}`);
  };

  const handlePlayPress = (item: AudioItem) => {
    // TODO: Implement audio playback
    console.log('Play audio:', item);
  };

  const handleFABAction = (action: string) => {
    switch (action) {
      case 'upload':
        // TODO: Implement file upload
        console.log('Upload file');
        break;
      case 'tts':
        // TODO: Implement text to speech
        console.log('Text to speech');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <AudioList
        items={items}
        onItemPress={handleItemPress}
        onPlayPress={handlePlayPress}
        onRefresh={loadItems}
        isLoading={isLoading}
      />
      <FloatingActionButton onAction={handleFABAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
}); 