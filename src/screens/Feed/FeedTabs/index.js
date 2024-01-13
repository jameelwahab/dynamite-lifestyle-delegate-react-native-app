import { View, Text, useWindowDimensions, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { createRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { TabBar, TabView } from 'react-native-tab-view'
import MyText from '../../../components/MyText';
import { colors } from '../../../utilities/colors';
import { useSelector } from 'react-redux';
import { selectSettings } from '../../../redux/reducers/settingSlice';
import HeaderBanner from './HeaderBanner';
import { selectUser } from '../../../redux/reducers/userSlice';
import FeedScreen from '../FeedScreen';
import FeedEvents from '../FeedEvents';
import Leaderboard from '../Leaderboard.js';

const FeedTabs = ({ changeTab, tab }) => {
  const menuRef = useRef()
  const { settings } = useSelector(selectSettings);
  const { user } = useSelector(selectUser);
  // console.log(settings, "settings")

  // useImperativeHandle(ref, () => {
  //   return {
  //     index
  //   }
  // }, [])

  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled={true}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{
        backgroundColor: colors.darkSecondary,
        shadowColor: colors.lightText2,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
      }}
      tabStyle={{ width: "auto", paddingHorizontal: 20 }}
      renderLabel={({ route, focused, color }) => (
        <>
          <MyText color={focused ? colors.primary : colors.lightText} type='medium' >
            {route.title}
          </MyText>
        </>
      )}
    />
  );

  const renderScene = ({ route }) => {
    console.log(route, "route")
    switch (route.index) {
      case 0:
        // setShow(true);
        return null;
      case 1:
        changeTab("ls")
        // setShow(false);
        return null;
      case 2:
        // setShow(false);
        return null;
    }

  }

  return (
    <View style={{ marginHorizontal: -10 }}>
      {!!settings?.the_cosmos_banner_image &&
        <HeaderBanner image={settings?.the_cosmos_banner_image} user={user} />}
      <View style={{ height: 50, marginTop: 10 }}>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={menuRef}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  console.log(menuRef, "menuRef")
                  menuRef?.current?.scrollToIndex({
                    index: index,
                    animated: true
                  })
                  setTimeout(() => {
                    changeTab(index)
                  }, 100);
                }}
                style={{ justifyContent: "center", paddingHorizontal: 10 }}>
                <MyText fontSize={15} type={index == tab ?'medium':'regular'} color={index == tab ? colors.primary2 : colors.lightText} >
                  {item.title}
                </MyText>

                <View style={{ borderRadius: 10, marginTop: 3, height: 3, backgroundColor: index == tab ? colors.primary : colors.transparent }} />
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </View>
  )
}

export default FeedTabs;

const tabs = [
  { title: 'FEEDS', key: 'feed', index: 0 },
  { title: 'NOTICE BOARD & EVENTS', key: 'events', index: 1 },
  { title: 'LEADERBOARD', key: 'leaderboard', index: 2 },
];