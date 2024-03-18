import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { selectUser } from '../../../redux/reducers/userSlice'
import { GET_PORTAL_USER_LIST, IS_CHAT_EXIST } from '../../../DAL'
import { useSelector } from 'react-redux'
import Tabs from '../../../components/Tabs'
import UserImage from '../../../components/UserImage'
import { colors } from '../../../utilities/colors'
import MyLoader, { SimpleLoader } from '../../../components/MyLoader'
import SearchView from '../../../components/SearchView'
import SimpleTabe from '../../../components/SimpleTabs'
import SimpleTabs from '../../../components/SimpleTabs'
import MyRefreshControl from '../../../components/MyRefreshControl'
import EmptyView from '../../../components/EmptyView'
import FooterLoader from '../../../components/FooterLoader'
import routes from '../../../navigation/routes'


let page = 0;
let cnanLoadMore = false;

const PortalChat = ({ navigation, route }) => {
  const { eventId, eventSlug } = route?.params
  const { token, user } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({
    offline: "0",
    online: "0"
  })
  const [tab, setTab] = useState(0)
  const [searchText, setSearchText] = useState("");
  const [refersher, setRefersher] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);


  const onChatScreen = async (item) => {
    console.log(item)
    setLoader(true)
    let res = await IS_CHAT_EXIST({ token, navigation, memberId: item?._id });
    setLoader(false)
    if (res.code == 200) {
      if (res.is_chat_exist) {
        navigation.navigate(routes.chatMessageList, {
          isOnline: item?.is_online,
          memberId: item?._id,
          firstName: item?.first_name,
          lastName: item?.last_name,
          lastSeen: "",
          profileImage: !!item?.profile_image ? item?.profile_image : "",
          chatId: res?.chat?._id,
          canGoBack: true,
        })
      } else {
        navigation.navigate(routes.chatMessageList, {
          isOnline: item?.is_online,
          memberId: item?._id,
          firstName: item?.first_name,
          lastName: item?.last_name,
          lastSeen: "",
          profileImage: !!item?.profile_image ? item?.profile_image : "",
          chatId: "",
          canGoBack: true,
        })
      }
    }
  }

  const getDataFromServer = async () => {
    let res = await GET_PORTAL_USER_LIST({ navigation, token, slug: eventSlug, searchText: searchText.trim(), status: tab == 0 ? 'online' : "offline" });
    if (res.code == 200) {
      setLoader(false);
      setRefersher(false);
      setFooterLoader(false);
      if (tab == 0) {
        setUsers(page == 0 ? res?.online_member : [...users, ...res?.online_member]);
      } else {
        setUsers(page == 0 ? res?.offline_member : [...users, ...res?.offline_member]);
      }
      setCounts({
        online: res?.total_online_members,
        offline: res?.total_offline_members,
      })

      if (res?.total_page > page) {
        cnanLoadMore = true;
        page += 1;
      } else {
        cnanLoadMore = false
      }
    } else {
      setLoader(false)
    }
  }

  const loadMore = () => {
    if (cnanLoadMore) {
      cnanLoadMore = false;
      setFooterLoader(true);
      getDataFromServer()
    }
  }


  const onSearchPress = () => {
    page = 0;
    cnanLoadMore = false;
    setUsers([])
    setLoader(true);
    getDataFromServer()
  }

  const onRefresh = () => {
    page = 0;
    cnanLoadMore = false;
    setRefersher(true)
    getDataFromServer()
  }



  useEffect(() => {
    page = 0;
    cnanLoadMore = false;
    setUsers([])
    setLoader(true)
    getDataFromServer()
  }, [tab])


  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>

        <SearchView

          search={searchText}
          onChangeText={(val) => setSearchText(val)}
          onSearchPress={onSearchPress}
        />

        <Tabs
          list={[
            {
              title: `ONLINE (${counts.online})`,
              index: 0,
              val: "online",
            },
            {
              title: `OFFLINE (${counts.offline})`,
              index: 1,
              val: "offline",
            },
          ]}
          tab={tab}
          changeTab={setTab} />

      </View>
    )
  }

  const renderUserList = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onChatScreen(item)}
        style={__styles.root}>
        <View>
          <UserImage
            image={item?.profile_image}
            name={item?.first_name}
            backgroundTransparent={true}
            size={35}
          />
          <View style={[__styles.statusView, { backgroundColor: tab == 0 ? colors.online : colors.heart }]} />
        </View>
        <View style={__styles.nameView}>
          <MyText type='medium' >{item?.first_name + " " + item?.last_name}</MyText>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <RootView title={"Event Users"} >

      <View style={{ flex: 1 }}>
        <FlatList
          data={users}
          renderItem={renderUserList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={headerView()}
          stickyHeaderHiddenOnScroll={true}
          stickyHeaderIndices={[0]}
          refreshControl={<MyRefreshControl
            refreshing={refersher}
            onRefresh={onRefresh}
          />}
          onEndReached={loadMore}
          ListEmptyComponent={!loader && <EmptyView />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
        />
      </View>

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default PortalChat

const tablist = [
  {
    title: "ONLINE",
    index: 0,
    val: "online",
  },
  {
    title: "OFFLINE",
    index: 1,
    val: "offline",
  },
]

const __styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    marginTop: 5
  },
  nameView: {
    marginLeft: 10
  },
  statusView: {
    width: 10,
    height: 10,
    borderRadius: 5,

    position: "absolute",
    bottom: 0,
    right: 0
  }
})