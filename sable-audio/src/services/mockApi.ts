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

// Mock API service
export const mockApi = {
  auth: {
    signIn: async (email: string, password: string): Promise<User> => {
      const user = mockUsers.find(u => u.email === email);
      if (!user) throw new Error('Invalid credentials');
      return user;
    },

    signUp: async (email: string, password: string, name: string): Promise<User> => {
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) throw new Error('User already exists');
      const newUser = { id: String(mockUsers.length + 1), email, name };
      mockUsers.push(newUser);
      return newUser;
    },

    signOut: async (): Promise<void> => {
      return Promise.resolve();
    },

    getCurrentUser: async (): Promise<User> => {
      return mockUsers[0];
    },
  },

  audio: {
    listItems: async (): Promise<AudioItem[]> => {
      return mockAudioItems;
    },

    getItem: async (id: string): Promise<AudioItem> => {
      const item = mockAudioItems.find(i => i.id === id);
      if (!item) throw new Error('Item not found');
      return item;
    },

    createItem: async (item: Omit<AudioItem, 'id' | 'createdAt'>): Promise<AudioItem> => {
      const newItem = {
        ...item,
        id: String(mockAudioItems.length + 1),
        createdAt: new Date().toISOString(),
      };
      mockAudioItems.push(newItem);
      return newItem;
    },

    updateItem: async (id: string, updates: Partial<AudioItem>): Promise<AudioItem> => {
      const index = mockAudioItems.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Item not found');
      mockAudioItems[index] = { ...mockAudioItems[index], ...updates };
      return mockAudioItems[index];
    },

    deleteItem: async (id: string): Promise<void> => {
      const index = mockAudioItems.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Item not found');
      mockAudioItems.splice(index, 1);
    },

    generateAudio: async (text: string): Promise<AudioItem> => {
      const newItem = {
        id: String(mockAudioItems.length + 1),
        title: text.slice(0, 50) + '...',
        type: 'file' as const,
        createdAt: new Date().toISOString(),
        text,
        tags: ['generated'],
      };
      mockAudioItems.push(newItem);
      return newItem;
    },
  },
}; 