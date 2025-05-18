import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'icon';

interface ButtonProps {
  onPress: () => void;
  title?: string;
  variant?: ButtonVariant;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const Button = ({ 
  onPress, 
  title, 
  variant = 'primary',
  icon,
  style, 
  textStyle, 
  disabled 
}: ButtonProps) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'icon':
        return styles.icon;
      default:
        return styles.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'icon':
        return styles.iconText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button,
        getVariantStyle(),
        style,
        disabled && styles.disabled
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      {icon ? (
        <Text style={[styles.iconText, textStyle]}>{icon}</Text>
      ) : (
        <Text style={[styles.text, getTextColor(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  icon: {
    backgroundColor: 'transparent',
    padding: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#007AFF',
  },
  iconText: {
    color: '#007AFF',
    fontSize: 24,
  },
  disabled: {
    opacity: 0.5,
  },
}); 