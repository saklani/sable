import { AudioItem, User } from '../types';
import { mockAudioItems } from '../utils/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ListAudioParams {
  page: number;
  limit: number;
}

export const api = {
  // Auth
  async signInWithGoogle(token: string): Promise<{ user: User; token: string }> {
    await delay(1000);
    if (Math.random() < 0.1) {
      throw new ApiError(401, 'Invalid credentials');
    }
    return {
      user: {
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        photo: 'https://example.com/photo.jpg',
      },
      token: 'mock-jwt-token',
    };
  },

  // Audio
  async listAudio(params?: ListAudioParams): Promise<AudioItem[]> {
    await delay(800);
    if (Math.random() < 0.1) {
      throw new ApiError(500, 'Failed to fetch audio items');
    }
    
    if (!params) {
      return mockAudioItems;
    }

    const { page, limit } = params;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Simulate pagination with mock data
    return mockAudioItems.slice(startIndex, endIndex);
  },

  async generateAudio(type: 'file' | 'text', data: string): Promise<AudioItem> {
    await delay(2000);
    if (Math.random() < 0.1) {
      throw new ApiError(400, 'Invalid input data');
    }
    return {
      id: Date.now().toString(),
      title: type === 'text' ? data.slice(0, 30) + '...' : 'Uploaded Audio',
      type,
      createdAt: new Date().toISOString(),
      ...(type === 'file' ? { fileUrl: 'https://example.com/audio.mp3' } : { text: data }),
    };
  },

  async deleteAudio(id: string): Promise<void> {
    await delay(500);
    if (Math.random() < 0.1) {
      throw new ApiError(404, 'Audio not found');
    }
  },
}; 