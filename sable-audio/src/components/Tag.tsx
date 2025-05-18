import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface TagProps {
  label: string;
  onPress?: () => void;
}

export const Tag: React.FC<TagProps> = ({ label, onPress }) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primaryContainer }]}>
      <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
}); 