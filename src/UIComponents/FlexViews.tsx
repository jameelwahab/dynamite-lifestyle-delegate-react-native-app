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
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse' | undefined;
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
  ml?: number;
}

export const Row: React.FC<RowProps> = ({
  children,
  style,
  alignItems,
  justifyContent,
  paddingHorizontal,
  padding,
  alignSelf,
  flexWrap,
}) => {
  return (
    <View
      style={[
        __styles.row,
        style,
        {
          alignItems,
          justifyContent,
          padding,
          paddingHorizontal,
          alignSelf,
          flexWrap,
        },
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
  ml,
}) => {
  return (
    <View
      style={[
        __styles.flex1,
        {flex},
        style,
        {alignItems, justifyContent, paddingHorizontal: ph, marginLeft: ml},
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
