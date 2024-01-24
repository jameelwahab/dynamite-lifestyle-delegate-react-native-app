import { colors } from "../../../utilities/colors";

const { StyleSheet } = require("react-native");

export const __styles = StyleSheet.create({
  topBtn: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  tabRootView: {
    backgroundColor: colors.secondaryVariant,
    borderRadius: 10,
    margin: 5
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,

  },
  tabBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "500"
  },
  tabSelector: {
    height: 2,

    borderRadius: 10,
    marginTop: 5
  }
})