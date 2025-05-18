import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { AudioPlayer } from '../src/components/AudioPlayer';
import { AudioItem } from '../src/types';

export default function Home() {
  const sampleAudio: AudioItem = {
    id: '1',
    title: 'Sample Audio',
    fileUrl: 'https://sveltejs.github.io/assets/music/satie.mp3',
    duration: 180,
    type: 'file',
    createdAt: '',
    tags: []
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Sable Audio
      </Text>
      <AudioPlayer item={sampleAudio} onClose={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
}); 