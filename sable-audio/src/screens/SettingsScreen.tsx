import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Button, useTheme, Divider } from 'react-native-paper';
import { useAuthStore } from '../store';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function SettingsScreen() {
  const theme = useTheme();
  const { user, setUser, setLoading, setError, isLoading } = useAuthStore();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      // await GoogleSignin.signOut();
      setUser(null);
    } catch (error: any) {
      setError(error.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    // TODO: Implement upgrade flow
    console.log('Upgrade to Pro');
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title={user?.name || 'User'}
          description={user?.email}
          left={props => <List.Icon {...props} icon="account" />}
        />
        <Divider />
        <List.Item
          title="Sign Out"
          left={props => <List.Icon {...props} icon="logout" />}
          onPress={handleSignOut}
          disabled={isLoading}
        />
      </List.Section>

      <View style={styles.upgradeSection}>
        <Button
          mode="contained"
          onPress={handleUpgrade}
          style={styles.upgradeButton}
          icon="star"
        >
          Upgrade to Pro
        </Button>
        <List.Item
          title="Pro Features"
          description="Unlimited audio generation, advanced playback controls, and more"
          left={props => <List.Icon {...props} icon="crown" />}
        />
      </View>

      <List.Section>
        <List.Subheader>App Settings</List.Subheader>
        <List.Item
          title="Notifications"
          left={props => <List.Icon {...props} icon="bell" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Storage"
          left={props => <List.Icon {...props} icon="folder" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="About"
          left={props => <List.Icon {...props} icon="information" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  upgradeSection: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#fff',
  },
  upgradeButton: {
    marginBottom: 16,
  },
}); 