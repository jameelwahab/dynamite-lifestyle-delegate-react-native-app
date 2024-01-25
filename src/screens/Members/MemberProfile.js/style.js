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

export const calendarStyles = StyleSheet.create({
  typeView: {
    flexDirection: "row",  borderWidth: 1, borderColor: colors.primary, borderRadius: 5,
    marginBottom: 10
  },
  typeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  typeDivider: {
    width: 1,
    height: "100%",
    backgroundColor: colors.primary
  },
  selectedText: {
    backgroundColor: colors.primary
  }
})