import React from 'react';
import {StyleSheet, View, ViewStyle, StyleProp} from 'react-native';
import {theme} from '../../theme';
import {SafeAreaView} from 'react-native-safe-area-context';

type ScreenProps = {
  children: React.ReactNode;
  testID?: string;
  contentStyle?: StyleProp<ViewStyle>;
};

export const Screen: React.FC<ScreenProps> = ({
  children,
  testID,
  contentStyle,
}) => (
  <View testID={testID} style={styles.safeArea}>
    <View style={[styles.content, contentStyle]}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
});
