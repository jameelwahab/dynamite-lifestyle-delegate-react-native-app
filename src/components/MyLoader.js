import { View, Text, ActivityIndicator, Platform } from 'react-native';
import React from 'react';
import { colors } from '../utilities/colors';
import LottieView from "lottie-react-native";


const MyLoader = ({
  enable = false,
  style = {}
}) => {
  if (enable) {
    return (
      <View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            ...style,
          },
        ]}>
        <View style={{
          backgroundColor: colors.secondary,
          borderRadius: 900,
          alignItems: "center", justifyContent: "center"
        }} >
          <LottieView
            source={require("../assets/animations/loader1.json")}
            style={{
              height: 50,
              width: 50,
            }}
            autoPlay
            loop
          />
        </View>
        {/* <ActivityIndicator size={'large'} color={colors.primary} /> */}
      </View>
    );
  }
};

const SimpleLoader = () => {
  return (
    <LottieView
      source={require("../assets/animations/loader1.json")}
      style={{
        height: 30,
        width: 30,
      }}
      autoPlay
      loop
    />
  )
}

export default MyLoader;
export { SimpleLoader }
