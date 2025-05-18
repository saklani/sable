import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Dialog, Button, TextInput, Text } from 'react-native-paper';

interface CreateAudioDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (type: 'file' | 'text', data: string) => void;
}

export const CreateAudioDialog: React.FC<CreateAudioDialogProps> = ({
  visible,
  onDismiss,
  onSubmit,
}) => {
  const [text, setText] = useState('');

  const handleFileUpload = () => {
    // TODO: Implement file upload
    console.log('File upload clicked');
  };

  const handleTextSubmit = () => {
    if (text.trim()) {
      onSubmit('text', text);
      setText('');
      onDismiss();
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Create New Audio</Dialog.Title>
        <Dialog.Content>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleFileUpload}
              style={styles.button}
            >
              Upload File
            </Button>
            <Text style={styles.orText}>OR</Text>
            <TextInput
              mode="outlined"
              label="Enter text"
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={4}
              style={styles.textInput}
            />
            <Button
              mode="contained"
              onPress={handleTextSubmit}
              disabled={!text.trim()}
              style={styles.button}
            >
              Generate from Text
            </Button>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    gap: 16,
  },
  button: {
    marginVertical: 8,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 8,
  },
  textInput: {
    marginVertical: 8,
  },
}); 