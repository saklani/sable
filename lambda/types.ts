export interface AudioItem {
    id: string;
    title: string;
    type: 'file' | 'text';
    createdAt: string;
    duration?: number;
    fileUrl?: string;
    text?: string;
    tags: string[];
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    photo?: string;
  }
  
  export type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
    Auth: undefined;
  }; 