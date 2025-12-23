import {StyleSheet} from 'react-native';
import {colors} from '../../../utilities/colors';
import {fonts} from '../../../utilities/fonts';

export const __manageProgrammeAccessStyles = StyleSheet.create({
  flatListStyle: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
  },
  statusView: {
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  statInputStyle: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    borderColor: colors.primary,
    color: colors.text,
    backgroundColor: colors.backgroundLight,
  },
  searchContainer: {
    // marginBottom: 15,
    backgroundColor: colors.darkSecondary,
  },
  selectAllContainer: {
    marginTop: 15,
    marginRight: 10,
  },
});

export const __agreementConfigurationStyles = StyleSheet.create({
  lvlbtnView: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.lightText,
    height: 45,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  levlBtnLabel: {
    backgroundColor: colors.darkSecondary,
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    position: 'absolute',
    top: -8,
    left: 5,
  },
  editor_container: {
    marginTop: 20,
  },
  editor_lable: {
    marginBottom: 5,
  },
});
