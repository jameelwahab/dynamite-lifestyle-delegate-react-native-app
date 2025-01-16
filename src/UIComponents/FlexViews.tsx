import {View, Text, StyleSheet, ViewStyle, FlexAlignType} from 'react-native';
import React, {ReactNode} from 'react';

interface RowProps {
  children: ReactNode;
  style?: ViewStyle;
  paddingHorizontal?: number;
  padding?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignSelf?: FlexAlignType;
}

interface FlexProps {
  children: ReactNode;
  style?: ViewStyle;
  flex?: number | undefined;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  ph?: number;
}

export const Row: React.FC<RowProps> = ({
  children,
  style,
  alignItems,
  justifyContent,
  paddingHorizontal,
  padding,
  alignSelf,
}) => {
  return (
    <View
      style={[
        __styles.row,
        style,
        {alignItems, justifyContent, padding, paddingHorizontal, alignSelf},
      ]}>
      {children}
    </View>
  );
};

export const Flex: React.FC<FlexProps> = ({
  children,
  style,
  alignItems,
  justifyContent,
  flex,
  ph,
}) => {
  return (
    <View
      style={[
        __styles.flex1,
        {flex},
        style,
        {alignItems, justifyContent, paddingHorizontal: ph},
      ]}>
      {children}
    </View>
  );
};

const __styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  flex1: {},
});
