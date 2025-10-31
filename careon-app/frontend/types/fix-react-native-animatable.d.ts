// frontend/types/fix-react-native-animatable.d.ts
declare module 'react-native-animatable' {
  import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';
  export type DefaultStyle = ViewStyle | TextStyle | ImageStyle;
  const Animatable: any;
  export const View: any;
  export const Text: any;
  export const Image: any;
  export function createAnimatableComponent<T>(component: T): T;
  export default Animatable;
}
