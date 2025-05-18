import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { AudioItem } from '../types';
import { Button } from './Button';

interface AudioListProps {
  items: AudioItem[];
  onItemPress: (item: AudioItem) => void;
  onPlayPress: (item: AudioItem) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const AudioList = ({ items, onItemPress, onPlayPress, onRefresh, isLoading }: AudioListProps) => {
  const renderItem = ({ item }: { item: AudioItem }) => (
    <TouchableOpacity style={styles.card} onPress={() => onItemPress(item)}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>
          {item.type === 'text' ? 'Text to Speech' : 'Audio File'}
        </Text>
        <Text style={styles.date}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      {item.type === 'file' && (
        <Button
          title="Play"
          onPress={() => onPlayPress(item)}
          style={styles.playButton}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshing={isLoading}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  playButton: {
    marginLeft: 12,
    minWidth: 80,
  },
}); 