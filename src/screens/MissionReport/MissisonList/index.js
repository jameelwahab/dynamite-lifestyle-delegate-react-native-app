import { View, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { selectUser } from '../../../redux/reducers/userSlice'
import { GET_MISSION_LIST_BY_MEMBER, } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { colors } from '../../../utilities/colors'
import MemberView from '../../../components/MemberView'
import EmptyView from '../../../components/EmptyView'
import MyRefreshControl from '../../../components/MyRefreshControl'
import routes from '../../../navigation/routes'
import { icons } from '../../../utilities/icons'
import SearchView from '../../../components/SearchView'
import FooterLoader from '../../../components/FooterLoader'
import MyText from '../../../components/MyText'
import StatView from '../../../components/StatView'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import { convertTimezone2 } from '../../../functions/convertTime'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'





const MissisonList = ({ navigation, route }) => {
  const { member, memberId } = route.params
  const { token, } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const [searchText, setSearchText] = useState("")
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [members, setMembers] = useState(member)

  const onMissionList = (mission) => {
    navigation.navigate(routes?.missionReportScreen, {
      missionId: mission?.mission_info?._id,
      memberId: member?._id
    })
  }


  const callAPi = () => {
    setList([])
    setLoader(true);
    getMissionMembersFromServer(true)
  }



  const onRefresh = () => {
    setRefreshing(true)
    getMissionMembersFromServer(true)
  }

  const onSearch = () => {
    setSearching(true)
    getMissionMembersFromServer(true)
  }

  const getMissionMembersFromServer = async (newArray = false) => {
    let res = await GET_MISSION_LIST_BY_MEMBER({
      navigation, token,
      memberId: memberId
    })
    if (res.code == 200) {
      setList(res?.missions);
      setMembers(res?.user_data)
      setLoader(false);
      setRefreshing(false)
    } else {
      setLoader(false)
      setRefreshing(false)
    }
  }


  useEffect(() => {
    callAPi()
  }, [])



  const renderProgress = useCallback(({ item, index }) => {
    return (
      <Pressable onPress={() => onMissionList(item)} style={__styles.itemView}>
        <View style={__styles.row}>
          <View style={{ flex: 1 }}>
            <MyText type='bold' >{item?.mission_info?.title}</MyText>
            {/* <MemberView member={member} /> */}
          </View>
          {icons.forwardArrow()}
        </View>
        <View style={{ marginTop: 5 }}>
          <StatView title={"Badge Level"} value={item?.mission_info?.membership_level_info?.badge_level_info?.title} />
          <StatView title={"Mission Duration"} value={item?.mission_duration + " days"} />
          <StatView title={"Coins Earned"} value={item?.mission_attracted_coins} />
          <StatView title={"Acheivable Coins"} value={item?.mission_reward_coins} />
          <StatView title={"Completed Date"} value={convertTimezone2(item?.mission_completed_date, timezone).format(dateTimeFormat.date)} />
        </View>
      </Pressable>
    )
  }, [JSON.stringify(list)])

  const topView = () => {
    return (
      <View style={__styles.topView}>
        <MemberView member={members} />
      </View>
    )
  }


  const headerView = (item) => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>
        <SearchView
          search={searchText}
          onChangeText={(text) => setSearchText(text)}
          onSearchPress={onSearch}
          loader={searching}
        />

      </View>
    )
  }

  return (
    <RootView titleView={topView} >
      {/* {topView()} */}
      <View style={{ flex: 1 }}>
        <FlatList
          // ListHeaderComponent={headerView()}
          // stickyHeaderIndices={[0]}
          keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 70 }}
          data={list}
          renderItem={renderProgress}
          ListEmptyComponent={!loader && <EmptyView label={'No Mission Report Found'} />}
          refreshControl={<MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
      {/* <FAB onPress={onAddScreen} /> */}
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default MissisonList


const memberTypeObj = {
  "all_members": "all",
  "nurture_members": "nurture"
}


const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,

  },
  topView: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.darkSecondary, paddingBottom: 5
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  }

})