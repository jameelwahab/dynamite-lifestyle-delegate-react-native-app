import { Text, View, useWindowDimensions, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { icons } from '../../../utilities/icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import ListView from './ListView';
import { fonts } from '../../../utilities/fonts';
import MyInputs from '../../../components/MyInputs';
import Modal from 'react-native-modal'
import { LIST_OF_DEPARTMENTS, SUPPORT_TCIKETS_LIST_BY_TYPE } from '../../../DAL';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import debounce from '../../../functions/debounce';







const TicketsList = ({ navigation }) => {
  const layout = useWindowDimensions();
  const { token, user } = useSelector(selectUser)
  const [index, setIndex] = React.useState(0);
  const [loader, setLoader] = React.useState(0);
  const [list, setList] = useState([])
  const [depList, setDepList] = useState([])
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
    { key: 'waiting', title: 'WAITING', index: 0 },
    { key: 'answered', title: 'ANSWERED', index: 1 },
    { key: 'need_fixes', title: 'NEEDS FIXES', index: 2 },
    { key: 'needs_to_attention', title: 'NEEDS ATTENTION', index: 3 },
    { key: 'reminder', title: 'REMINDERS', index: 4 },
    { key: 'ready_to_close', title: 'READY TO CLOSE', index: 5 },
    { key: 'solved', title: 'CLOSE', index: 6 },
    { key: 'trash', title: 'TRASH', index: 7 },
  ]);


  const getSupportTickets = async (loading = true) => {
    if (loading) {
      setLoader(index)
    }
    setList([])
    let res = await SUPPORT_TCIKETS_LIST_BY_TYPE({
      page: 0,
      body: {
        filter_by: routes[index].key
      },
      searchText: searchText.trim(),
      token,
      navigation
    })

    if (res.code == 200) {
      setLoader(-1)
      setList(res?.support_ticket);
      setbadges({
        waiting: res?.waiting_ticket_count,
        answered: res?.answered_ticket_count,
        need_fixes: res?.need_fixes_count,
        needs_to_attention: res?.need_to_attention_count,
        reminder: res?.reminder_ticket_count,
        ready_to_close: res?.ready_to_close_count,
        solved: res?.solved_ticket_count,
        trash: res?.trash_ticket_count,
      })
    } else {
      setLoader(-1)
    }
  }

  const listOfDepartments = async () => {
    let res = await LIST_OF_DEPARTMENTS({
      token,
      navigation
    })
    if (res.code == 200) {
      setDepList(res.department)
    }
  }

  useEffect(() => {
    listOfDepartments()
  }, [])


  useEffect(() => {
    getSupportTickets()
  }, [index])

  useEffect(() => {
    debounce(() => getSupportTickets(false))
  }, [searchText])

  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled={true}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ backgroundColor: colors.darkSecondary, }}
      tabStyle={{ width: "auto", }}
      renderLabel={({ route, focused, color }) => (
        <>
          <MyText color={focused ? colors.primary : colors.lightText} type='medium' >
            {route.title + " (" + badges[route?.key] + ")"}
          </MyText>
          {route?.key == 'need_fixes' && badges['need_fixes'] > 0 &&
            <View style={__styles.badges} />
          }
        </>
      )}
      gap={10}
    />
  );


  const searchView = useCallback(() => {
    return (
      <View style={{ marginHorizontal: 10, backgroundColor: colors.darkSecondary }}>
        <MyInputs

          leftIcon={icons.search}
          placeholder='Search...'
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          rightIcon={!!searchText.trim() ? icons.crosssWithCircle_20 : icons.noIcon}
          rightIconOnPress={() => setSearchText("")}
        />
      </View>
    )
  }, [searchText])


  const renderScene = ({ route, ...props }) => {
    return <ListView
      user={user}
      refresh={getSupportTickets}
      token={token}
      route={route.key}
      list={index == route.index ? list : []}
      departmentList={depList}
      isLoading={loader == route.index}
      active={index == route.index} />
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

const __styles = StyleSheet.create({
  badges: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.delete,
    position: "absolute",
    top: -8,
    right: -10
  }
})

