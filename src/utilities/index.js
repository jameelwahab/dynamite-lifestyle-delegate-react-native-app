const { Platform, Dimensions } = require("react-native");

class Util {
  isAndroid = () => Platform.OS == "android";
  isIOS = () => Platform.OS == "ios";
  screenWidth = () => Dimensions.get("screen").width;
  screenHeight = () => Dimensions.get("screen").height;
  windowWidth = () => Dimensions.get("window").width;
  windowHeight = () => Dimensions.get("window").height;
}

export default new Util();
