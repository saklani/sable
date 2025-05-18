// This is the API schema for Sable Audio

// Authentication
interface AuthResponse {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      photo?: string;
    };
  }
  
  // Audio Generation
  interface GenerateAudioRequest {
    text: string;
    userId: string;
  }
  
  interface GenerateAudioResponse {
    id: string;
    status: 'processing' | 'completed' | 'failed';
    audioUrl?: string;
    error?: string;
  }
  
  // File Upload
  interface UploadFileRequest {
    file: string; // Base64 encoded file
    userId: string;
  }
  
  interface UploadFileResponse {
    id: string;
    status: 'processing' | 'completed' | 'failed';
    text?: string;
    error?: string;
  }
  
  // Audio Management
  interface AudioListResponse {
    items: Array<{
      id: string;
      title: string;
      type: 'file' | 'text';
      createdAt: string;
      duration?: number;
      fileUrl?: string;
      text?: string;
    }>;
    nextToken?: string;
  }
  
  interface DeleteAudioRequest {
    audioId: string;
    userId: string;
  }
  
  // Voice Management
  interface Voice {
    id: string;
    name: string;
    language: string;
    gender: 'male' | 'female';
    previewUrl?: string;
  }
  
  interface ListVoicesResponse {
    voices: Voice[];
  }
  
  // Subscription Management
  interface Subscription {
    id: string;
    userId: string;
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt: string;
  }
  
  interface SubscriptionResponse {
    subscription: Subscription;
  }
  
  // File Management
  interface FileUploadResponse {
    id: string;
    url: string;
    key: string;
  }
  
  // API Endpoints
  const API_ENDPOINTS = {
    // Auth
    GOOGLE_SIGN_IN: '/auth/google',
    SIGN_OUT: '/auth/signout',
    
    // Audio
    GENERATE_AUDIO: '/audio/generate',
    UPLOAD_FILE: '/audio/upload',
    LIST_AUDIO: '/audio/list',
    GET_AUDIO: '/audio/:id',
    DELETE_AUDIO: '/audio/:id',
    
    // Voices
    LIST_VOICES: '/voices',
    GET_VOICE: '/voices/:id',
    
    // Subscription
    GET_SUBSCRIPTION: '/subscription',
    UPDATE_SUBSCRIPTION: '/subscription',
    
    // Files
    UPLOAD_TO_S3: '/files/upload',
    GET_FILE_URL: '/files/:key',
    
    // User
    GET_USER_PROFILE: '/user/profile',
    UPDATE_USER_PROFILE: '/user/profile',
  } as const;
  
  export type {
    AuthResponse,
    GenerateAudioRequest,
    GenerateAudioResponse,
    UploadFileRequest,
    UploadFileResponse,
    AudioListResponse,
    DeleteAudioRequest,
    Voice,
    ListVoicesResponse,
    Subscription,
    SubscriptionResponse,
    FileUploadResponse,
  };
  
  export { API_ENDPOINTS }; 