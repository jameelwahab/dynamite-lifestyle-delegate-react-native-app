import {StyleSheet} from 'react-native';
import {colors} from '../../../utilities/colors';

export const __transactionListStyles = StyleSheet.create({
  topView: {
    paddingHorizontal: 10,
  },

  headerView: {
    backgroundColor: colors.darkSecondary,
  },
  itemRootView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 5,
  },
  succeededBadge: {
    backgroundColor: colors.green + '33',
  },
  pdfLinkContainer: {
    alignSelf: 'flex-start',
  },
  hitSlop: {
    left: 5,
    top: 5,
    bottom: 5,
    right: 5,
  },
});

export const __transactionFilterStyles = StyleSheet.create({
  scrollContent: {
    paddingTop: 10,
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  buttonSpacing: {
    marginLeft: 15,
  },
  btn: {
    paddingHorizontal: 10,
    height: 35,
  },
  filterButtonText: {
    color: colors.black,
  },
  clearbtnView: {
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 5,
  },
});
