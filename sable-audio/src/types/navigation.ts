import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AudioItem } from './index';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Auth: undefined;
  AudioDetail: {
    item: AudioItem;
  };
  CreateAudio: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>; 