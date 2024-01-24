import { View, Text, Pressable, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { MEMBER_PROFILE } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import moment from 'moment'
import MyLoader from '../../../components/MyLoader'
import MemberView from '../../../components/MemberView'
import { icons } from '../../../utilities/icons'
import { __styles } from './style'
import { colors } from '../../../utilities/colors'
import StatView from './StatView'
import WheelofLife from './WheelofLife'
import QuestionsView from './QuestionsView'
import SubscriptionVIew from './SubscriptionVIew'
import NinetyDaysView from './NinetyDaysView'


const MemberProfile = ({ navigation, route }) => {
  let { token } = useSelector(selectUser);
  const { memberId } = route?.params
  const tabRef = useRef()
  const [loader, setLoader] = useState(false);
  const [member, setMember] = useState(null);
  const [selectedTab, setSelectedTab] = useState(tabs[0].key)

  const geMemberDataFromServer = async () => {
    let startDate = moment().subtract({ year: 1 }).format("YYYY") + "-12-31";
    let endDate = moment().format('YYYY-MM-DD');
    let res = await MEMBER_PROFILE({ token, navigation, memberId: memberId, startDate: startDate, endDate: endDate })
    if (res.code == 200) {

      setMember(res)
      setLoader(false)
    } else {
      setLoader(false)

    }
  }

  useEffect(() => {
    setLoader(true);
    geMemberDataFromServer()
  }, [])

  const topView = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 15 }}>
        <View style={{ flex: 1 }}>
          {!!member?.member && <MemberView member={member?.member} showPhoneNumber />}
        </View>
        <Pressable style={__styles.topBtn}>
          {icons.whatsapp(colors.primary, 22)}
        </Pressable>
        <Pressable style={__styles.topBtn}>
          {icons.message(colors.primary, 22)}
        </Pressable>
      </View>
    )
  }

  const TabView = () => {
    return (
      <View style={{ marginVertical: 10 }}>

        <FlatList
          ref={tabRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  tabRef?.current?.scrollToIndex({ index: index, animated: true });
                  setSelectedTab(item.key)
                }}
                style={{ paddingHorizontal: 10, height: 40, justifyContent: "center" }}>
                <MyText color={colors.primary} type='medium' fontSize={16} >{item.title}</MyText>
                <View style={{ height: 2, width: "100%", marginTop: 2, borderRadius: 10, backgroundColor: item.key == selectedTab ? colors.primary : colors.transparent }} />
              </TouchableOpacity>
            )
          }}
        />

      </View>
    )
  }

  const showScreen = () => {
    return (
      <View>
        {selectedTab == "wol" ?
          <WheelofLife member={member?.member} />
          : selectedTab == "question" ?
            <QuestionsView member={member} />
            : selectedTab == "subscription" ?
              <SubscriptionVIew list={member?.subscribers} />
              : selectedTab == "90days" ?
                <NinetyDaysView member={member} />
                : null}
      </View>
    )
  }

  return (
    <RootView titleView={!!member ? () => topView() : undefined} >
      {!!member &&
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <StatView member={member} />
            {TabView()}
            {showScreen()}
          </ScrollView>
        </View>}
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default MemberProfile

const tabs = [{
  key: "wol",
  title: "Wheel of Life",
},
{
  key: "question",
  title: "Questions",
},
{
  key: "90days",
  title: "90 Days",
},
{
  key: "subscription",
  title: "Subscriptions",
}, {
  key: "daily-dynamite-graph",
  title: "Daily Dynamite Intentions Analysis",
},
{
  key: "calendar",
  title: "Calendar Events",
}
]