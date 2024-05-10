import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import routes from '../../../navigation/routes'
import { GET_BROADCAST_CHAT_DETAIL } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import UserImage from '../../../components/UserImage'
import MemberView from '../../../components/MemberView'
import MyLoader, { SimpleLoader } from '../../../components/MyLoader'
import { colors } from '../../../utilities/colors'
import { icons } from '../../../utilities/icons'
import EmptyView from '../../../components/EmptyView'

let page = 0;
let canLoadMore = false;
const BroadcastDetail = ({ navigation, route }) => {
  const { chatId } = route?.params
  const { token } = useSelector(selectUser);
  const [chatName, setChatName] = useState("")
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [broadcast, setBroadcast] = useState(null);

  useEffect(() => {
    page = 0;
    canLoadMore = false;
    setLoader(true);
    getBroadcastDetailFromServer(true)
  }, [route])


  const loadMore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true)
      getBroadcastDetailFromServer()
    }
  }

  const getBroadcastDetailFromServer = async (newArray = false) => {
    let res = await GET_BROADCAST_CHAT_DETAIL({ navigation, token, chatId, page })
    // setLoader(false);
    // setFooterLoader(false)

    if (res.code == 200) {
      let length = newArray ? res?.broadcast_members.length : list.length + res?.broadcast_members.length;
      console.log(length < res?.total_count, "length < res?.total_count")
      if (length < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }

      setChatName(res?.broadcast?.broadcast_title)
      setList(newArray ? res?.broadcast_members : [...list, ...res?.broadcast_members]);
      setBroadcast(res?.broadcast)
      setLoader(false);
      setFooterLoader(false);
    }
  }


  const listview = ({ item, index }) => {
    return <View style={{ backgroundColor: colors.secondary, borderRadius: 10, padding: 10, marginTop: 10 }}>
      <MemberView
        member={item}
        size={35}
        titleSize={14}
      />
    </View>

  }

  const topView = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 10 }}>
        <View style={{ flex: 1 }}>
          <MyText isHeading>{chatName}</MyText>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(routes.broadcastStartNewChat, {
            broadcast,
            setChatName: route?.params?.setChatName
          })}
          style={{ borderRadius: 25 / 2, height: 25, width: 25, backgroundColor: colors.primary, alignItems: "center", justifyContent: 'center' }}>
          {icons.editpencil(colors.black, 18)}
        </TouchableOpacity>

      </View>
    )
  }


  return (
    <RootView
      titleView={topView}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          renderItem={listview}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          ListEmptyComponent={!loader && <EmptyView label={"No Member Found!"} />}
          ListFooterComponent={
            <View style={{ height: 50, alignItems: "center" }}>
              {footerLoader && <SimpleLoader />}
            </View>
          }
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default BroadcastDetail