import { render, fireEvent } from '@testing-library/react-native';
import { AudioPlayer } from '../AudioPlayer';
import { vi } from 'vitest';

// Mock the audio service
vi.mock('../../services/audioPlayer', () => ({
  setupPlayer: vi.fn(),
  playAudio: vi.fn(),
  pauseAudio: vi.fn(),
  resumeAudio: vi.fn(),
  seekTo: vi.fn(),
  setPlaybackRate: vi.fn(),
  getPlayerState: vi.fn().mockResolvedValue({
    state: 'playing',
    position: 0,
    duration: 100,
  }),
}));

describe('AudioPlayer', () => {
  const mockItem = {
    id: '1',
    title: 'Test Audio',
    type: 'file' as const,
    createdAt: '2024-01-01',
    duration: 100,
    fileUrl: 'https://example.com/audio.mp3',
    tags: ['test'],
  };

  const mockOnClose = vi.fn();

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <AudioPlayer item={mockItem} onClose={mockOnClose} />
    );

    expect(getByText('Test Audio')).toBeTruthy();
    expect(getByTestId('play-pause-button')).toBeTruthy();
    expect(getByTestId('speed-button')).toBeTruthy();
  });

  it('handles play/pause', () => {
    const { getByTestId } = render(
      <AudioPlayer item={mockItem} onClose={mockOnClose} />
    );

    const playPauseButton = getByTestId('play-pause-button');
    fireEvent.press(playPauseButton);
    expect(playPauseButton).toBeTruthy();
  });

  it('handles speed change', () => {
    const { getByTestId } = render(
      <AudioPlayer item={mockItem} onClose={mockOnClose} />
    );

    const speedButton = getByTestId('speed-button');
    fireEvent.press(speedButton);
    expect(speedButton).toBeTruthy();
  });

  it('handles close', () => {
    const { getByTestId } = render(
      <AudioPlayer item={mockItem} onClose={mockOnClose} />
    );

    const closeButton = getByTestId('close-button');
    fireEvent.press(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
}); 