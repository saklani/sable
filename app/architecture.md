# Sable Audio - Architecture Documentation

## Overview
Sable Audio is a React Native application built with Expo and Bun, focusing on audio-related functionality. The application follows a modern, modular architecture with clear separation of concerns.

## Tech Stack
- **Framework**: React Native with Expo
- **Runtime**: Bun
- **Language**: TypeScript
- **Navigation**: Expo Router
- **UI Components**: Custom Components
- **State Management**: React Native's built-in state management
- **Storage**: AsyncStorage
- **Audio Handling**: Expo AV
- **Testing**: Vitest

## Project Structure

```
├── app/                    # Expo Router app directory
│   ├── (app)/             # Main app routes
│   ├── (auth)/            # Authentication routes
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── src/
│   ├── api/               # API integration layer
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # Screen components
│   ├── services/         # Business logic services
│   ├── store/            # State management
│   ├── test/             # Test files
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── assets/               # Static assets
└── .expo/               # Expo configuration
```

## Key Architectural Components

### 1. Routing (app/)
- Uses Expo Router for file-based routing
- Implements authentication flow with protected routes
- Follows the new Expo Router directory structure

### 2. Components (src/components/)
- Custom UI components library
- Atomic design system
- Reusable components:
  - Buttons
  - Cards
  - Inputs
  - Typography
  - Layout components
  - Audio player components
  - Navigation components
  - Form components
  - Loading states
  - Error boundaries

### 3. State Management
- Uses React's Context API and hooks for state management
- AsyncStorage for persistent data storage

### 4. Services Layer (src/services/)
- Business logic implementation
- API integration
- Audio processing services

### 5. Type System (src/types/)
- TypeScript interfaces and types
- Ensures type safety across the application

### 6. Testing (src/test/)
- Unit tests using Vitest
- Component testing
- Integration testing

## Data Flow
1. User interactions trigger events in components
2. Events are handled by services
3. Services interact with APIs and local storage
4. State updates flow back to components
5. UI updates reflect the new state

## Security Considerations
- Authentication flow implemented in (auth) routes
- Secure storage for sensitive data
- API security through proper authentication headers

## Performance Considerations
- Lazy loading of routes
- Optimized asset loading
- Efficient state management
- Proper memory management for audio resources

## Development Workflow
- Bun as the package manager and runtime
- TypeScript for type safety
- Expo for development and building
- Vitest for testing 