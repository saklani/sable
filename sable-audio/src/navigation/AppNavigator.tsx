import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AuthScreen from '../screens/AuthScreen';
import AudioDetailScreen from '../screens/AudioDetailScreen';
import CreateAudioScreen from '../screens/CreateAudioScreen';
import { useAuthStore } from '../store';
import { IconButton } from '../components/IconButton';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          animation: 'slide_from_right',
          animationDuration: 200,
        }}
      >
        {!user ? (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                title: 'My Library',
                headerRight: () => (
                  <IconButton
                    icon="cog"
                    onPress={() => navigation.navigate('Settings')}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                title: 'Settings',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="AudioDetail"
              component={AudioDetailScreen}
              options={({ route }) => ({
                title: route.params.item.title,
                animation: 'slide_from_right',
              })}
            />
            <Stack.Screen
              name="CreateAudio"
              component={CreateAudioScreen}
              options={{
                title: 'Create Audio',
                animation: 'slide_from_right',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 