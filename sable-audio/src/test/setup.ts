import '@testing-library/jest-native/extend-expect';

// Mock react-native-track-player
vi.mock('react-native-track-player', () => ({
  State: {
    Playing: 'playing',
    Paused: 'paused',
    Stopped: 'stopped',
  },
  setupPlayer: vi.fn(),
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  seekTo: vi.fn(),
  setRate: vi.fn(),
  getState: vi.fn(),
  getPosition: vi.fn(),
  getDuration: vi.fn(),
})); 