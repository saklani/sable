import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { setupPlayer } from "../../src/services/audioPlayer";
import { Button } from "../../src/components/Button";

export default function AppLayout() {
  useEffect(() => {
    setupPlayer();
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerRight: () => (
            <Button
              icon="⚙️"
              onPress={() => {
                router.push("/(app)/settings");
              }}
            />
          ),
        }}
      />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
