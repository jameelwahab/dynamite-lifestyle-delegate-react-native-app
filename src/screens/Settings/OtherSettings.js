import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native'
import React from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { colors } from '../../utilities/colors'
import { icons } from '../../utilities/icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import routes from '../../navigation/routes'
import crashlytics from '@react-native-firebase/crashlytics';

const OtherSettings = ({ navigation }) => {
  return (
    <RootView
      hideChatIcon
      hideProfile
      hideNotificaitonIcon
      title='Settings'
    >
      <View style={{ paddingHorizontal: 10, flex: 1 }}>
        <ScrollView>
          {SettingsList.map((x, i) => (
            <TouchableOpacity
              onPress={() => navigation.navigate(x.route)}
              id={x._id}
              style={__styles.itemRootView} >
              <View style={__styles.iconView}>{x.icon()}</View>
              <View style={__styles.textView}>
                <MyText fontSize={16} type='medium' >{x.name}</MyText>
              </View>
              <View style={__styles.iconView}>{icons.forwardArrow()}</View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View
          style={{ alignItems: "center" }}>
          <MyText type='light'>Version:<MyText fontSize={18} type='medium' > 1.0.0</MyText></MyText>
        </View>
      </View>
    </RootView>
  )
}

export default OtherSettings

const __styles = StyleSheet.create({
  itemRootView: { marginTop: 10, backgroundColor: colors.secondaryVariant, height: 50, borderRadius: 10, flexDirection: "row", alignItems: 'center' },
  iconView: { height: 50, width: 50, alignItems: "center", justifyContent: "center" },
  textView: { flex: 1 }
})


const SettingsList = [{
  _id: "1",
  name: "Zoom Settings",
  icon: icons.user,
  route: routes.zoomSettings
},
{
  _id: "2",
  name: "Welcome Reminder Settings",
  icon: icons.user,
  route: routes.reminderSettings
},
{
  _id: "3",
  name: "Change Password",
  icon: icons.lock,
  route: routes.changePassword
},
]