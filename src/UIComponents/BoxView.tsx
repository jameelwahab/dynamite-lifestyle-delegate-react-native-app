import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import { colors } from '../utilities/colors';
// import colors from '../colors';

interface BoxProps {
  children: ReactNode;
  style?: ViewStyle;
}

const BoxView: React.FC<BoxProps> = ({children, style}) => {
  return <View style={[__styles.root, style]}>{children}</View>;
};

export default BoxView;

const __styles = StyleSheet.create({
  root: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
});
