import React from 'react';
import { IconButton as PaperIconButton } from 'react-native-paper';
import type { IconButtonProps } from 'react-native-paper';

interface CustomIconButtonProps extends Omit<IconButtonProps, 'icon'> {
  icon: string;
}

export const IconButton: React.FC<CustomIconButtonProps> = (props) => {
  return <PaperIconButton {...props} />;
}; 