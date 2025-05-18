import { AudioItem, User } from '../types';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    photo: 'https://example.com/photo.jpg',
  },
];

const mockAudioItems: AudioItem[] = [
  {
    id: '1',
    title: 'Sample Audio 1',
    type: 'file',
    createdAt: new Date().toISOString(),
    duration: 120,
    fileUrl: 'https://sveltejs.github.io/assets/music/satie.mp3',
    tags: ['music', 'sample'],
  },
  {
    id: '2',
    title: 'Sample Text 1',
    type: 'text',
    createdAt: new Date().toISOString(),
    text: 'This is a sample text content',
    tags: ['text', 'sample'],
  },
];

// Mock database operations
export const mockDb = {
  users: {
    findById: async (id: string): Promise<User | null> => {
      return mockUsers.find(user => user.id === id) || null;
    },
    findByEmail: async (email: string): Promise<User | null> => {
      return mockUsers.find(user => user.email === email) || null;
    },
    create: async (user: Omit<User, 'id'>): Promise<User> => {
      const newUser = { ...user, id: String(mockUsers.length + 1) };
      mockUsers.push(newUser);
      return newUser;
    },
  },
  audioItems: {
    findAll: async (userId: string): Promise<AudioItem[]> => {
      return mockAudioItems;
    },
    findById: async (id: string): Promise<AudioItem | null> => {
      return mockAudioItems.find(item => item.id === id) || null;
    },
    create: async (item: Omit<AudioItem, 'id' | 'createdAt'>): Promise<AudioItem> => {
      const newItem = {
        ...item,
        id: String(mockAudioItems.length + 1),
        createdAt: new Date().toISOString(),
      };
      mockAudioItems.push(newItem);
      return newItem;
    },
    update: async (id: string, updates: Partial<AudioItem>): Promise<AudioItem | null> => {
      const index = mockAudioItems.findIndex(item => item.id === id);
      if (index === -1) return null;
      mockAudioItems[index] = { ...mockAudioItems[index], ...updates };
      return mockAudioItems[index];
    },
    delete: async (id: string): Promise<boolean> => {
      const index = mockAudioItems.findIndex(item => item.id === id);
      if (index === -1) return false;
      mockAudioItems.splice(index, 1);
      return true;
    },
  },
}; 