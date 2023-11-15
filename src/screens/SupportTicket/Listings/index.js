import { Text, View, useWindowDimensions, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import { icons } from '../../../utilities/icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import ListView from './ListView';
import { fonts } from '../../../utilities/fonts';
import MyInputs from '../../../components/MyInputs';
import Modal from 'react-native-modal'







const TicketsList = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [badges, setbadges] = useState({
    waiting: 0,
    answer: 3,
    need_fixed: 0,
    need_attention: 4,
    reminders: 2,
    ready_to_close: 0,
    closed: 0,
    trash: 0,
  })
  const [routes] = React.useState([
    { key: 'waiting', title: 'WAITING' },
    { key: 'answer', title: 'ANSWERED' },
    { key: 'need_fixed', title: 'NEEDS FIXES' },
    { key: 'need_attention', title: 'NEEDS ATTENTION' },
    { key: 'reminders', title: 'REMINDERS' },
    { key: 'ready_to_close', title: 'READY TO CLOSE' },
    { key: 'closed', title: 'CLOSE' },
    { key: 'trash', title: 'TRASH' },
  ]);


  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled={true}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ backgroundColor: colors.darkSecondary, }}
      tabStyle={{ width: "auto", }}
      renderLabel={({ route, focused, color }) => (
        <MyText color={focused ? colors.primary : colors.lightText} type='medium' >
          {route.title + " (" + badges[route?.key] + ")"}
        </MyText>
      )}
      gap={10}
    />
  );


  const searchView = () => {
    return (
      <View style={{ marginHorizontal: 10, backgroundColor: colors.darkSecondary }}>
        <MyInputs
          rightIcon={icons.search}
          placeholder='Search...'
        />
      </View>
    )
  }


  const renderScene = ({ route, ...props }) => {
    switch (route.key) {
      case 'waiting':
        return <ListView {...props} />

      case 'answer':
        return <ListView {...props} />

      case 'need_fixed':
        return <ListView {...props} />

      case 'need_attention':
        return <ListView {...props} />

      case 'ready_to_close':
        return <ListView {...props} />

      case 'reminders':
        return <ListView {...props} />

      case 'closed':
        return <ListView {...props} />

      case 'trash':
        return <ListView {...props} />

      default:
        return null;
    }
  }






  return (
    <RootView
      rightButtonIcon={icons.handPromise}
      hideBackBottomButton={true}
      title='Support Tickets'
    >
      {searchView()}
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(index) => setIndex(index)}
        initialLayout={{ width: layout.width }}

      />

    </RootView>
  )

}

export default TicketsList

