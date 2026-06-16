import {StyleSheet, StatusBar} from 'react-native';
import {colors} from './colors';
import {fonts} from './fonts';
export const main = StyleSheet.create({
  root: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  padding10: {
    padding: 10,
  },

  boxView: {
    borderRadius: 10,
    backgroundColor: colors.boxColor,
    marginTop: 10,
    overflow: 'hidden',
  },

  miniDesc: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 15,
    color: colors.lightText,
    includeFontPadding: false,
  },

  description: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 20,
    color: colors.lightText,
    includeFontPadding: false,
  },
  description2: {
    fontFamily: 'Montserrat-Regular',
    color: colors.lightText,
    includeFontPadding: false,
    fontSize: 14,
    lineHeight: 20,
  },

  descriptionWhite: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 20,
    color: colors.white,
    includeFontPadding: false,
  },

  title: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    lineHeight: 20,
    color: colors.white,
    includeFontPadding: false,
    letterSpacing: 0.5,
  },
  hitSlop: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  },
  hitSlop15: {
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
  },
  hitSlop20: {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
  },
  titleGolden: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    lineHeight: 20,
    color: colors.primary2,
    includeFontPadding: false,
  },
  regular: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.white,
    includeFontPadding: false,
  },

  regularGolden: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Montserrat-Regular',
    color: colors.primary2,
    includeFontPadding: false,
  },

  heading: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    lineHeight: 20,
    color: colors.primary2,
    includeFontPadding: false,
  },

  headingWhite: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    lineHeight: 20,
    color: colors.white,
    includeFontPadding: false,
  },

  topHeading: {
    fontSize: 24,
    fontFamily: 'Montserrat-SemiBold',
    lineHeight: 30,
    color: colors.white,
    includeFontPadding: false,
  },

  bigWhiteHeading: {
    fontSize: 24,
    fontFamily: 'Montserrat-SemiBold',
    lineHeight: 30,
    color: colors.white,
    includeFontPadding: false,
  },

  webViewdescription: {
    fontFamily: 'Montserrat-Regular',
    lineHeight: 20,
    fontSize: 14,
    color: colors.silver,
    margin: 0,
  },
});

export const textSize = {
  min: 11,
  description: 13,
  regular: 14,
  title: 16,
  heading: 18,
};
