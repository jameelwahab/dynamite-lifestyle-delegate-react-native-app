import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import React from 'react'
import { DrawerContentScrollView } from '@react-navigation/drawer';
import MyText from '../../components/MyText';
import { colors } from '../../utilities/colors';
import { icons } from '../../utilities/icons';
import { drawerMenuList } from './List';

const index = (props) => {
  const { navigation } = props;


  const changeSideBarScreen = async (screen) => {
    navigation.closeDrawer()
    setTimeout(() => {
      navigation.popToTop()
    }, 200);
  }
  return (
    <DrawerContentScrollView
      style={{ backgroundColor: colors.secondary }}
      {...props}>
      <View style={__styles.logoView}>
        <Image source={icons.missionControl} style={__styles.logo} />
      </View>

      {drawerMenuList.map((x, i) => {
        if (!!x.icon)
          return (
            <Pressable
              key={x.key}
              onPress={() => changeSideBarScreen(x.key)}
              style={[{ backgroundColor: i == props.state.index ? colors.lightPrimary3 : undefined, }, __styles.itemRootView]}>
              <Image source={x?.icon} style={__styles.itemIcon} />
              <MyText
                fontSize={14}
                color={i == props.state.index ? colors.primary : colors.text}
                style={{ marginLeft: 20 }} >{x.name}</MyText>
            </Pressable>
          )
      })}
    </DrawerContentScrollView >
  )
}

export default index;

const __styles = StyleSheet.create({
  logoView: {
    width: "80%", height: 50, alignSelf: "center", marginBottom: 10
  },
  logo: {
    height: "100%",
    width: "100%",
  },
  itemRootView: {
    borderRadius: 10,
    marginHorizontal: 5,
    paddingLeft: 15,
    height: 50,
    flexDirection: "row",
    alignItems: "center"
  },
  itemIcon: {
    height: 30,
    width: 30,
  }
})


