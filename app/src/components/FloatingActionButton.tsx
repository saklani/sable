import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Animated } from 'react-native';
import { Button } from './Button';

interface FloatingActionButtonProps {
  onAction: (action: string) => void;
}

export const FloatingActionButton = ({ onAction }: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleDialog = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const handleAction = (action: string) => {
    onAction(action);
    toggleDialog();
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.fab}
        onPress={toggleDialog}
      >
        <Text style={styles.fabIcon}>{isOpen ? '✕' : '+'}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={toggleDialog}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleDialog}
        >
          <Animated.View 
            style={[
              styles.dialog,
              {
                transform: [{
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                }],
                opacity: animation,
              },
            ]}
          >
            <Button
              title="Upload File"
              variant="secondary"
              onPress={() => handleAction('upload')}
              style={styles.dialogButton}
            />
            <Button
              title="Text to Speech"
              variant="secondary"
              onPress={() => handleAction('tts')}
              style={styles.dialogButton}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxWidth: 300,
  },
  dialogButton: {
    marginVertical: 8,
  },
}); 