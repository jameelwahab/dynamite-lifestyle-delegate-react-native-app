import {TouchableHighlight, StyleSheet, Text} from 'react-native';
import React from 'react';
import {colors} from '../utilities/colors';
import {icons} from '../utilities/icons';
import {fonts} from '../utilities/fonts';

const FAB = ({onPress, icon, title}) => {
  return (
    <TouchableHighlight
      underlayColor={colors.lightPrimary2}
      onPress={onPress}
      style={!!title ? __style.rootViewForTitle : __style.rootView}>
      <>
        {!!icon ? icon() : icons.plus(colors.black)}
        {!!title && <Text style={__style.title}>{title}</Text>}
      </>
    </TouchableHighlight>
  );
};

export default FAB;

const __style = StyleSheet.create({
  rootView: {
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 3,
  },
  rootViewForTitle: {
    height: 40,
    minWidth: 45,
    borderRadius: 45 / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 3,
    flexDirection: 'row',
    padding: 10,
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: colors.white,
  },
  title: {
    marginLeft: 5,
    fontFamily: fonts.medium,
    letterSpacing: 0.3,
    color: colors.black,
  },
});
