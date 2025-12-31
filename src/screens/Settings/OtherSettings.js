import {View, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import {colors} from '../../utilities/colors';
import {icons} from '../../utilities/icons';
import {STRINGS} from '../../utilities/strings';
import {TouchableOpacity} from 'react-native-gesture-handler';
import routes from '../../navigation/routes';

const OtherSettings = ({navigation}) => {
  return (
    <RootView
      hideChatIcon
      hideProfile
      hideNotificaitonIcon
      title={STRINGS.OTHER_SETTINGS.title}>
      <View style={__styles.container}>
        <ScrollView>
          {SettingsList.map((x, i) => (
            <TouchableOpacity
              onPress={() => navigation.navigate(x.route)}
              id={x._id}
              style={__styles.itemRootView}>
              <View style={__styles.iconView}>{x.icon()}</View>
              <View style={__styles.textView}>
                <MyText fontSize={16} type="medium">
                  {x.name}
                </MyText>
              </View>
              <View style={__styles.iconView}>{icons.forwardArrow()}</View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={__styles.versionContainer}>
          <MyText type="light">
            {STRINGS.OTHER_SETTINGS.version}
            <MyText fontSize={18} type="medium">
              {' '}
              {STRINGS.OTHER_SETTINGS.versionNumber}
            </MyText>
          </MyText>
        </View>
      </View>
    </RootView>
  );
};

export default OtherSettings;

const __styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1,
  },
  itemRootView: {
    marginTop: 10,
    backgroundColor: colors.secondaryVariant,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconView: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textView: {flex: 1},
  versionContainer: {
    alignItems: 'center',
  },
});

const SettingsList = [
  {
    _id: '1',
    name: STRINGS.OTHER_SETTINGS.zoomSettings,
    icon: icons.user,
    route: routes.zoomSettings,
  },
  {
    _id: '2',
    name: STRINGS.OTHER_SETTINGS.welcomeReminderSettings,
    icon: icons.user,
    route: routes.reminderSettings,
  },
  {
    _id: '3',
    name: STRINGS.OTHER_SETTINGS.feedKeywords,
    icon: icons.user,
    route: routes.feedKeywords,
  },
  // {
  // 		_id: "4",
  // 		name: "Schedule Notifications",
  // 		icon: ()=>icons.notification(colors.primary),
  // 		route: routes.scheduleNotifications,
  // },
  {
    _id: '5',
    name: STRINGS.OTHER_SETTINGS.changePassword,
    icon: icons.lock,
    route: routes.changePassword,
  },
];
