import { AudioItem } from '../types';

// Generate 30 mock items
export const mockAudioItems: AudioItem[] = Array.from({ length: 30 }, (_, index) => ({
  id: (index + 1).toString(),
  title: `Audio Item ${index + 1}`,
  type: index % 2 === 0 ? 'file' : 'text',
  createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(), // Each item is 1 day older
  ...(index % 2 === 0
    ? {
        duration: Math.floor(Math.random() * 1800) + 60, // Random duration between 1-30 minutes
        fileUrl: `https://example.com/audio${index + 1}.mp3`,
      }
    : {
        text: `This is the text content for audio item ${index + 1}. It contains some sample text that would be converted to speech.`,
      }),
})); 