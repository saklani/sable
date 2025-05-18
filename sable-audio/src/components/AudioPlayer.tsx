import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, ProgressBar, useTheme } from 'react-native-paper';
import { AudioItem } from '../types';
import {
  playAudio,
  pauseAudio,
  resumeAudio,
  seekTo,
  setPlaybackRate,
  getPlayerState,
  setupPlayer,
} from '../services/audioPlayer';

interface AudioPlayerProps {
  item: AudioItem;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ item, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(item.duration || 0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const theme = useTheme();

  useEffect(() => {
    const initializePlayer = async () => {
      await setupPlayer();
      const audioUrl = item.fileUrl || 'https://sveltejs.github.io/assets/music/satie.mp3';
      await playAudio(audioUrl, item.title);
      setIsPlaying(true);
    };

    initializePlayer();

    const interval = setInterval(async () => {
      const { state, position, duration: trackDuration } = await getPlayerState();
      setCurrentTime(position);
      setDuration(trackDuration);
      setIsPlaying(state === 'playing');
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [item]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pauseAudio();
    } else {
      await resumeAudio();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = async () => {
    const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
    await setPlaybackRate(newRate);
  };

  const handleSeek = async (value: number) => {
    setCurrentTime(value);
    await seekTo(value);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text variant="titleMedium" numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <IconButton
          icon="close"
          size={24}
          onPress={onClose}
          testID="close-button"
        />
      </View>

      <View style={styles.controls}>
        <ProgressBar
          progress={currentTime / duration}
          style={styles.slider}
        />
        <View style={styles.timeContainer}>
          <Text variant="bodySmall">{formatTime(currentTime)}</Text>
          <Text variant="bodySmall">{formatTime(duration)}</Text>
        </View>

        <View style={styles.buttons}>
          <IconButton
            icon={isPlaying ? 'pause' : 'play'}
            size={24}
            onPress={handlePlayPause}
            testID="play-pause-button"
          />
          <IconButton
            icon="speedometer"
            size={24}
            onPress={handleSpeedChange}
            testID="speed-button"
          />
          <Text variant="bodySmall" style={styles.speedText}>
            {playbackRate}x
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  controls: {
    marginBottom: 8,
  },
  slider: {
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: {
    marginLeft: 8,
  },
}); 