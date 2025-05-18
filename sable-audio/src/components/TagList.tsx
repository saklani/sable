import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Tag } from './Tag';

interface TagListProps {
  tags: string[];
  onTagPress?: (tag: string) => void;
}

export const TagList: React.FC<TagListProps> = ({ tags, onTagPress }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      <View style={styles.tagContainer}>
        {tags.map((tag) => (
          <Tag key={tag} label={tag} onPress={() => onTagPress?.(tag)} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 40,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 4,
  },
}); 