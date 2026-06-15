import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import { colors } from '../utilities/colors.js';
// import colors from '../colors';

interface DividerProps {
  height?: number;
  bgColor?: string;
  mt?: number;
  mb?: number;
}
const Divider: React.FC<DividerProps> = ({
  height = 1,
  bgColor = colors.border,
  mt,
  mb,
}) => {
  return (
    <View
      style={[
        {
          height: height,
          backgroundColor: bgColor,
          marginTop: mt,
          marginBottom: mb,
        } as ViewStyle,
      ]}
    />
  );
};

export default Divider;

const __styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.border,
  },
});
