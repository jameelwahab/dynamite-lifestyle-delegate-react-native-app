import {StyleSheet} from 'react-native';
import {colors} from '../../utilities/colors';

export const __assessmentComponentStyles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondaryVariant,
    borderWidth: 1,
    borderColor: colors.lightText + '22',
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  ratingRootView: {
    marginTop: 10,
    flexDirection: 'row',
  },
  ratingView: {
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30 / 2,
    marginRight: 5,
    borderWidth: 1,
    borderColor: colors.beige,
  },
});
export const __assessmentListStyles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkSecondary,
    paddingBottom: 5,
  },
});

export const __assessmentNotesListStyles = StyleSheet.create({
  itemRootView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  itemNameAndDateView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  threeDotBtnView: {
    backgroundColor: colors.lightPrimary2,
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
export const __assessmentNotesAddEditStyles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
  },
  closeBtnView: {
    height: 40,
    width: 40,
    backgroundColor: colors.lightPrimary2,
    borderRadius: 40 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    marginTop: 15,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    paddingHorizontal: 10,
    marginRight: 10,
  },
  saveButton: {
    paddingHorizontal: 10,
  },
});
