import { Text, View, useWindowDimensions, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { icons } from '../../../utilities/icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import ListView from './ListView';
import { fonts } from '../../../utilities/fonts';
import MyInputs from '../../../components/MyInputs';
import Modal from 'react-native-modal'
import { SUPPORT_TCIKETS_LIST_BY_TYPE } from '../../../DAL';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';







const TicketsList = ({ navigation }) => {
  const layout = useWindowDimensions();
  const { token } = useSelector(selectUser)
  const [index, setIndex] = React.useState(0);
  const [loader, setLoader] = React.useState(-1);
  const [list, setList] = useState([])
  const [searchText, setSearchText] = useState("")
  const [badges, setbadges] = useState({
    waiting: 0,
    answered: 0,
    need_fixes: 0,
    needs_to_attention: 0,
    reminder: 0,
    ready_to_close: 0,
    closed: 0,
    trash: 0,
  })
  const [routes] = React.useState([
    { key: 'waiting', title: 'WAITING' },
    { key: 'answered', title: 'ANSWERED' },
    { key: 'need_fixes', title: 'NEEDS FIXES' },
    { key: 'needs_to_attention', title: 'NEEDS ATTENTION' },
    { key: 'reminder', title: 'REMINDERS' },
    { key: 'ready_to_close', title: 'READY TO CLOSE' },
    { key: 'solved', title: 'CLOSE' },
    { key: 'trash', title: 'TRASH' },
  ]);


  getSupportTickets = async () => {
    setLoader(index)
    setList([])
    let res = await SUPPORT_TCIKETS_LIST_BY_TYPE({
      page: 0,
      body: {
        filter_by: routes[index].key
      },
      searchText: "",
      token,
      navigation
    })

    if (res.code == 200) {
      setLoader(-1)
      setList(res?.support_ticket);
      setbadges({
        waiting: res?.waiting_ticket_count,
        answered: 0,
        need_fixes: 0,
        needs_to_attention: 0,
        reminder: res?.reminder_ticket_count,
        ready_to_close: 0,
        solved: res?.solved_ticket_count,
        trash: 0,
      })
    } else {
      setLoader(-1)
    }
  }

  useEffect(() => {
    getSupportTickets()
  }, [index])

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
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
    )
  }


  const renderScene = ({ route, ...props }) => {
    switch (route.key) {
      case 'waiting':
        return <ListView list={index == 0 ? list : []} isLoading={loader == 0} active={index == 0} />

      case 'answered':
        return <ListView list={index == 1 ? list : []} isLoading={loader == 1} active={index == 1} />

      case 'need_fixes':
        return <ListView list={index == 2 ? list : []} isLoading={loader == 2} active={index == 2} />

      case 'needs_to_attention':
        return <ListView list={index == 3 ? list : []} isLoading={loader == 3} active={index == 3} />


      case 'reminder':
        return <ListView list={index == 4 ? list : []} isLoading={loader == 4} active={index == 4} />

      case 'ready_to_close':
        return <ListView list={index == 5 ? list : []} isLoading={loader == 5} active={index == 5} />

      case 'solved':
        return <ListView list={index == 6 ? list : []} isLoading={loader == 6} active={index == 6} />

      case 'trash':
        return <ListView list={index == 7 ? list : []} isLoading={loader == 7} active={index == 7} />

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

