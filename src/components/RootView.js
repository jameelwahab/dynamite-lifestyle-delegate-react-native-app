import { View, Text, StyleSheet, StatusBar, SafeAreaView } from 'react-native'
import React from 'react'
import { colors } from '../utilities/colors'
import Header from './Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


const RootView = ({
  title = "",
  subTitle = "",
  hideHambugerMenu = false,
  rightButtonIcon = null,
  rightButtonOnPress = null,
  hideHeader = false,
  noPadding = false,
  showBackButtonOnTop = false,
  hideBackBottomButton = false,
  hideNotificaitonIcon = false,
  hideProfile = false,
  hideChatIcon = false,
  hideSubHeader = false,
  backgroundColor,
  titleView,
  children,
  customBackPress
}) => {
  const { top, bottom, left, right } = useSafeAreaInsets();
  return (
    <View style={[__RootView.root, !!backgroundColor && { backgroundColor },
    !noPadding && { paddingTop: top, paddingBottom: bottom, paddingLeft: left, paddingRight: right }
    ]}>
      <StatusBar backgroundColor={!!backgroundColor ? backgroundColor : colors.darkSecondary} barStyle={"light-content"} />
      {!hideHeader &&
        <Header
          title={title}
          subTitle={subTitle}
          showBackButtonOnTop={showBackButtonOnTop}
          hideHambugerMenu={hideHambugerMenu}
          hideBackBottomButton={hideBackBottomButton}
          rightButtonIcon={rightButtonIcon}
          rightButtonOnPress={rightButtonOnPress}
          hideNotificaitonIcon={hideNotificaitonIcon}
          hideChatIcon={hideChatIcon}
          hideProfile={hideProfile}
          titleView={titleView}
          customBackPress={customBackPress}
          hideSubHeader={hideSubHeader}
        />}
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        {children}
      </View>
    </View>
  )
}

export default RootView

const __RootView = StyleSheet.create({
  root: {
    backgroundColor: colors.darkSecondary,
    flex: 1,
  }
})
