import {StyleSheet} from 'react-native';
import {colors} from '../../../utilities/colors';

export const __commissionCounterBoxStyle = StyleSheet.create({
  box: {
    aspectRatio: 1,
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBox: {
    height: 50,
    width: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    marginTop: 10,
    textAlign: 'center',
  },
  subTitleText: {
    marginTop: 2,
    textAlign: 'center',
    paddingHorizontal: 3,
  },
});
