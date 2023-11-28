import { Platform } from "react-native";

export const colors = {
  primary: "#f6bd4b",
  primary2: "#EDBF60",
  lightPrimary2: '#F6BD4B33',
  lightPrimary3: '#F6BD4B1F',
  secondary: "#1F2536",
  darkSecondary: "#131825",
  secondaryVariant: '#252d41',
  secondarySelect:"#2f3851",
  border: "#43464A",
  selection: Platform.select({ android: "#3D4250", ios: "#FFFFFF" }),
  text: "#FFFFFF",
  white: "#FFFFFF",
  black: "#000000",
  lightText: "#8c9aa6",
  lightText2: "#bec6da",
  placeholder: "#637381",
  delete: "#ff3333",
  transparent: "#FFFFFF00",
  grey: "#696969"
}