import { View, Text, Pressable, Image, StyleSheet, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerContentScrollView } from '@react-navigation/drawer';
import MyText from '../../components/MyText';
import { colors } from '../../utilities/colors';
import { icons } from '../../utilities/icons';
import { drawerMenuList } from './List';
import Collapsible from 'react-native-collapsible';
import { selectNavbar } from '../../redux/reducers/navbarSlice';
import { useSelector } from 'react-redux';

const index = (props) => {
  const { navigation, state } = props;
  const { navbar } = useSelector(selectNavbar);
  const [isCollapsed, setCollapsed] = useState([]);


  const toggleCollapse = (item) => {
    let index = isCollapsed.findIndex(x => x == item.value);
    if (index > -1) {
      isCollapsed.splice(index, 1);
    } else {
      isCollapsed.push(item.value);
    }
    setCollapsed([...isCollapsed])
  }

  const findCollapsed = (item) => {
    return isCollapsed.includes(item.value)
  }

  const changeSideBarScreen = async (screen) => {

    if (!!screen.collapsible) {
      toggleCollapse(screen)
    } else {
      navigation.closeDrawer()
      setTimeout(() => {
        console.log(navigation, state, "navigation")
        navigation.jumpTo(screen.key)
      }, 200);
    }
  }


  const optionView = (item, index) => {
    return (
      <Pressable
        key={item.value}
        onPress={() => changeSideBarScreen(item)}
        style={[{ backgroundColor: index == props.state.index && item.collapsible == false ? colors.lightPrimary3 : undefined, }, __styles.itemRootView]}>
        <Image source={item?.icon} style={__styles.itemIcon} />
        <View style={{ flex: 1 }}>
          <MyText
            fontSize={14}
            color={index == props.state.index && item.collapsible == false ? colors.primary : colors.text}
            style={{ marginLeft: 20 }} >{item.title}</MyText>
        </View>
        {item.collapsible &&
          <View style={{ paddingRight: 10 }}>
            {!findCollapsed(item) ? icons.upwardArrow() : icons.downwardArrow()}
          </View>}
      </Pressable>
    )
  }

  const nestedOptionView = (item, index, parentItem) => {
    return (
      <Collapsible collapsed={findCollapsed(parentItem)}>
        <Pressable
          key={item.value}
          onPress={() => changeSideBarScreen(item)}
          style={[{ backgroundColor: index == props.state.index ? colors.lightPrimary3 : undefined, }, __styles.itemRootView, __styles.nestedView]}>
          <Image source={item?.icon} style={__styles.itemIcon} />
          <MyText
            fontSize={14}
            color={index == props.state.index ? colors.primary : colors.text}
            style={{ marginLeft: 20 }} >{item.title}</MyText>
        </Pressable>
      </Collapsible>
    )
  }

  return (
    <DrawerContentScrollView
      style={{ backgroundColor: colors.secondary }}
      {...props}>
      <View style={__styles.logoView}>
        <Image source={icons.missionControl} style={__styles.logo} />
      </View>

      {navbar.map((x, i) => {
        if (!!x.icon)
          return (
            <View>
              {optionView(x, i)}
              {!!x?.nestedmenu && x?.nestedmenu.map((y, j) => nestedOptionView(y, i, x))}
            </View >
          )
      })}
    </DrawerContentScrollView >
  )
}

export default index;

const __styles = StyleSheet.create({
  logoView: {
    width: "80%", height: 50, alignSelf: "center", marginBottom: 10,
    marginTop: Platform.OS == "android" ? 10 : 0
  },
  logo: {
    height: "100%",
    width: "100%",
  },
  itemRootView: {
    borderRadius: 10,
    marginHorizontal: 5,
    paddingLeft: 15,
    height: 45,
    flexDirection: "row",
    alignItems: "center"
  },
  itemIcon: {
    height: 25,
    width: 25,
  },
  nestedView: {
    paddingLeft: "12%"
  }
})


