import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { AudioItem as AudioItemType } from '../types';

interface AudioItemProps {
  item: AudioItemType;
  onPress: (item: AudioItemType) => void;
}

export const AudioItem: React.FC<AudioItemProps> = ({ item, onPress }) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card style={styles.card} onPress={() => onPress(item)}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">{item.title}</Text>
          <IconButton
            icon={item.type === 'file' ? 'file-audio' : 'text-box'}
            size={20}
          />
        </View>
        <View style={styles.details}>
          <Text variant="bodySmall">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          {item.duration && (
            <Text variant="bodySmall">{formatDuration(item.duration)}</Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
}); 