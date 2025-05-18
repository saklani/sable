import { Audio } from 'expo-av';

let sound: Audio.Sound | null = null;

export const setupPlayer = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  } catch (error) {
    console.error('Error setting up audio mode:', error);
  }
};

export const playAudio = async (url: string, title: string) => {
  try {
    if (sound) {
      await sound.unloadAsync();
    }
    
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );
    
    sound = newSound;
  } catch (error) {
    console.error('Error playing audio:', error);
  }
};

export const pauseAudio = async () => {
  try {
    if (sound) {
      await sound.pauseAsync();
    }
  } catch (error) {
    console.error('Error pausing audio:', error);
  }
};

export const resumeAudio = async () => {
  try {
    if (sound) {
      await sound.playAsync();
    }
  } catch (error) {
    console.error('Error resuming audio:', error);
  }
};

export const stopAudio = async () => {
  try {
    if (sound) {
      await sound.stopAsync();
    }
  } catch (error) {
    console.error('Error stopping audio:', error);
  }
};

export const seekTo = async (position: number) => {
  try {
    if (sound) {
      await sound.setPositionAsync(position * 1000); // Convert to milliseconds
    }
  } catch (error) {
    console.error('Error seeking:', error);
  }
};

export const setPlaybackRate = async (rate: number) => {
  try {
    if (sound) {
      await sound.setRateAsync(rate, true);
    }
  } catch (error) {
    console.error('Error setting playback rate:', error);
  }
};

export const getPlayerState = async () => {
  try {
    if (!sound) {
      return { state: 'none', position: 0, duration: 0 };
    }

    const status = await sound.getStatusAsync();
    if (!status.isLoaded) {
      return { state: 'none', position: 0, duration: 0 };
    }

    return {
      state: status.isPlaying ? 'playing' : 'paused',
      position: status.positionMillis / 1000, // Convert to seconds
      duration: status.durationMillis ? status.durationMillis / 1000 : 0, // Convert to seconds
    };
  } catch (error) {
    console.error('Error getting player state:', error);
    return { state: 'none', position: 0, duration: 0 };
  }
}; 