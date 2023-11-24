import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import { colors } from '../utilities/colors'
import Header from './Header'


const RootView = ({
  title = "",
  hideHambugerMenu = false,
  rightButtonIcon = null,
  rightButtonOnPress = null,
  hideHeader = false,
  showBackButtonOnTop = false,
  hideBackBottomButton = false,
  hideNotificaitonIcon = false,
  hideProfile = false,
  hideChatIcon = false,
  backgroundColor,
  titleView,
  children
}) => {
  return (
    <SafeAreaView style={[__RootView.root, !!backgroundColor && { backgroundColor }]}>
      <StatusBar backgroundColor={!!backgroundColor ? backgroundColor : colors.darkSecondary} barStyle={"light-content"} />
      {!hideHeader &&
        <Header
          title={title}
          showBackButtonOnTop={showBackButtonOnTop}
          hideHambugerMenu={hideHambugerMenu}
          hideBackBottomButton={hideBackBottomButton}
          rightButtonIcon={rightButtonIcon}
          rightButtonOnPress={rightButtonOnPress}
          hideNotificaitonIcon={hideNotificaitonIcon}
          hideChatIcon={hideChatIcon}
          hideProfile={hideProfile}
          titleView={titleView}

        />}
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        {children}
      </View>
    </SafeAreaView>
  )
}

export default RootView

const __RootView = StyleSheet.create({
  root: {
    backgroundColor: colors.darkSecondary,
    flex: 1,
  }
})