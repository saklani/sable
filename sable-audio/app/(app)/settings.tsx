import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleSignOut = () => {
    // TODO: Implement sign out
    router.replace('/(auth)');
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Preferences</List.Subheader>
        <List.Item
          title="Notifications"
          description="Enable push notifications"
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          )}
        />
        <List.Item
          title="Dark Mode"
          description="Enable dark mode"
          right={() => (
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
            />
          )}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Profile"
          description="View and edit your profile"
          left={props => <List.Icon {...props} icon="account" />}
          onPress={() => {}}
        />
        <List.Item
          title="Subscription"
          description="Manage your subscription"
          left={props => <List.Icon {...props} icon="star" />}
          onPress={() => {}}
        />
      </List.Section>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleSignOut}
          style={styles.button}
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginTop: 8,
  },
}); 