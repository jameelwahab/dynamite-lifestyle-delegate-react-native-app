import { View, Text, FlatList, StyleSheet, TouchableHighlight, Keyboard, SafeAreaView, Pressable, TouchableOpacity, Platform, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyLoader, { SimpleLoader } from '../../../components/MyLoader'
import MyText from '../../../components/MyText'
import { CHAT_LIST, GET_BROADCAST_CHAT_LIST, PORTAL_LIST } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import UserImage from '../../../components/UserImage'
import { S3_URL, dateTimeFormat } from '../../../utilities/constants'
import MyWebview from '../../../components/MyWebview'
import { colors } from '../../../utilities/colors'
import { icons } from '../../../utilities/icons'
import moment from 'moment'
import FAB from '../../../components/FAB'
import EmptyView from '../../../components/EmptyView'
import MyTouchableInput from '../../../components/MyTouchableInput'
import debounce from '../../../functions/debounce'
import Modal from 'react-native-modal'
import utilities from '../../../utilities'
import routes from '../../../navigation/routes'
import { decode, decodeEntity } from 'html-entities';
import { isHtml } from '../../../functions/regex'
import Markdown from '@ronradtke/react-native-markdown-display'
import { fonts } from '../../../utilities/fonts'
import { selectSocket } from '../../../redux/reducers/socketSlice'
import { convertTimezone } from '../../../functions/convertTime'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import MyInputs from '../../../components/MyInputs'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'


let page = 0;
let canLoadMore = false;
let firstTime = true;
let isNewChat = false;

const ChatList = ({ navigation, route }) => {
  const { key } = route?.params;
  console.log(key, "key")
  const { token, user } = useSelector(selectUser);
  const { socket } = useSelector(selectSocket);
  const { navbar } = useSelector(selectNavbar);
  const timezone = useSelector(selectTimeZone);
  const [title] = useState(navbar?.find(x => x._id == key)?.title);
  const [loader, setLoader] = useState(true);
  const [footerLoader, setFooterLoader] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [portalList, setPortalList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [eventId, setEventId] = useState({ ...noneObj })
  const [isPortalModalVisible, setPortalModalVisiblity] = useState(false);
  const [tab, setTab] = useState('all')


  const onChatScreen = (item) => {
    navigation.navigate(routes.broadcastChatMessageList, {
      chatName: item?.broadcast_title,
      chatId: item._id,
      refresh
    })
  }

  const api_ChatList = async (newArray = false) => {
    let res = await GET_BROADCAST_CHAT_LIST({
      navigation, body: { search_text: searchText, }, token, page
    })
    if (res.code == 200) {
      if ((chatList.length + res?.broadcasts.length) < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setLoader(false);
      setFooterLoader(false);
      setChatList(newArray ? res?.broadcasts : [...chatList, ...res?.broadcasts]);
      firstTime = false;
    } else {
      setLoader(false)
      setFooterLoader(false);
    }
  }

  const refresh = () => {
    page = 0;
    canLoadMore = false;
    api_ChatList(true);
  }

  const loadmore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      api_ChatList()
    }

  }



  useEffect(() => {
    if (!firstTime) {
      console.log("HI")
      page = 0;
      canLoadMore = false;
      debounce(() => api_ChatList(true))
    }
  }, [searchText])




  useEffect(() => {
    firstTime = true;
    page = 0;
    canLoadMore = false;
    api_ChatList(true)
    // socketEvents();

    return () => {
      page = 0;
      canLoadMore = false;
      isNewChat = false;

    }
  }, [route])


 






  const portalModal = () => {
    return (
      <Modal
        isVisible={isPortalModalVisible}
        onBackButtonPress={() => setPortalModalVisiblity(false)}
        onBackdropPress={() => setPortalModalVisiblity(false)}
        useNativeDriverForBackdrop={true}
        style={{ margin: 0 }}
        animationInTiming={300}
        animationOutTiming={300}
      >
        <SafeAreaView style={{ marginTop: "auto", backgroundColor: colors.secondary, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <View style={{ height: utilities.screenHeight() * 0.8, }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText }}>
              <View>
                <MyText fontSize={18} type='medium' >Portal Events</MyText>
                <MyText color={colors.lightText} fontSize={12}>Select your event from list below</MyText>
              </View>
              <Pressable
                onPress={() => setPortalModalVisiblity(false)}
              >
                {icons.crosssWithCircle()}
              </Pressable>
            </View>

            <View style={{ flex: 1 }}>

              <FlatList
                data={portalList}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setEventId(item);
                        setPortalModalVisiblity(false)
                      }}
                      style={[{ paddingVertical: 12, justifyContent: "center", paddingHorizontal: 10 }, {
                        backgroundColor: eventId?._id == item._id ? colors.secondarySelect : undefined
                      }]} >

                      <MyText>{item?.title}</MyText>

                    </TouchableOpacity>
                  )
                }}
              />

            </View>
          </View>
        </SafeAreaView>

      </Modal>)
  }

  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary, marginVertical: -10 }}>
        {/* <View style={__style.tabsView}>
          <TouchableOpacity
            onPress={() => setTab("all")}
            style={[__style.tabView, tab == "all" && __style.tabSelectedView]}>
            <MyText color={tab == "all" ? colors.primary : undefined}>All</MyText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab("unread")}
            style={[__style.tabView, tab == "unread" && __style.tabSelectedView]}>
            <MyText color={tab == "unread" ? colors.primary : undefined} >Unread</MyText>
          </TouchableOpacity>
        </View>

        <MyTouchableInput
          onPress={() => setPortalModalVisiblity(true)}
          noSpace={true}
          value={eventId.title}
          label='Portals' /> */}
        <MyInputs
          leftIcon={icons.search}
          placeholder='Search...'
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          rightIcon={!!searchText.trim() ? icons.crosssWithCircle_20 : icons.noIcon}
          rightIconOnPress={() => {
            Keyboard.dismiss()
            setSearchText("")
          }}
        />
      </View>)
  }

  const renderChatList = ({ item, index }) => {
    let memberIndex = item?.member.findIndex(x => x?._id?._id != user._id);
    let member, otherUser;
    if (memberIndex == 0) {
      member = item?.member[0];
      otherUser = item?.member[1];
    } else {
      member = item?.member[1];
      otherUser = item?.member[0];
    }

    return (
      <TouchableHighlight
        onPress={() => onChatScreen(item)}
        underlayColor={colors.secondary}>
        <View style={__style.itemRootView}>
          <View style={__style.itemImage}>
            <Image source={icons.broadcast}
              style={{ height: 30, width: 30, }}
            />
          </View>

          <View style={__style.seondViewRow}>
            <View style={__style.headerView}>
              <View style={{ flex: 1 }}>
                <MyText fontSize={14} type='medium' >{item?.broadcast_title}</MyText>
              </View>
              <MyText fontSize={10} color={colors.lightText} >{convertTimezone(item?.latest_message?.createdAt, timezone).format(dateTimeFormat.dateTime)}</MyText>
            </View>
            <View style={{ marginTop: 3, flexDirection: "row", alignItems: "center" }}>

              {item?.last_message_sender == user?._id &&
                <View style={{ marginRight: 5 }}>
                  {!!item?.last_message_status == false || item?.last_message_status == "sent"
                    ? icons.sent(colors.white, 20) :
                    icons.seen(item?.last_message_status == "read" ? colors.primary : colors.white, 20)}
                </View>}

              {item?.latest_message.message_type == "schedule" &&
                <View style={{ marginRight: 5 }}>
                  {icons.clock(colors.white, 12)}
                </View>
              }

              {!!item?.latest_message?.message_content_type && item?.latest_message?.message_content_type != "general" &&
                <View style={{ marginRight: 5 }}>
                  {item?.latest_message.message_content_type == "image" ? icons.camera(colors.white, 12) :
                    item?.latest_message.message_content_type == "audio" ? icons.mic(colors.white, 15) :
                      item?.latest_message.message_content_type == "video" ? icons.playCircle(colors.white, 18) : ""}
                </View>
              }
              <View style={{ flexDirection: "row", flex: 1, height: 18 }}>
                <MyText fontSize={12} type='light' numberOfLines={1} style={{ marginTop: 3, flex: 1 }}>
                  {!!item?.latest_message?.message ?
                    isHtml(item?.latest_message?.message) ?
                      decode(item.last_message.replace(/<[^>]+>/g, '').replace(/\*/g, "").replace(/[\])}[{(]/g, " ").slice(0, 70), { level: "html5" }) :
                      <Markdown style={markdownStyleOther}>
                        {item?.latest_message?.message.replace(/\n/g, "").slice(0, 100)}
                      </Markdown> :
                    item?.latest_message?.message_content_type == "image" ? "Photo" :
                      item?.latest_message?.message_content_type == 'audio' ? "Audio" :
                        item?.latest_message?.message_content_type == 'video' ? "Video" : "No Message Yet"}

                </MyText>
                {otherUser?.unread_message_count > 0 &&
                  <View style={__style.badge}>
                    <MyText fontSize={12} color={colors.black} >
                      {otherUser?.unread_message_count > 99 ? "99+" : otherUser?.unread_message_count}</MyText>
                  </View>}
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }



  return (
    <RootView
      hideBackBottomButton
      title={title}
      hideChatIcon
    >

      <View style={{ flex: 1 }}>
        <FlatList
          data={chatList}
          renderItem={renderChatList}
          ListEmptyComponent={!loader && <EmptyView label={"No Chat"} />}
          ListHeaderComponent={headerView()}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadmore}
          ListFooterComponent={
            <View style={{ height: 50, alignItems: "center", justifyContent: 'center' }}>
              {footerLoader && <SimpleLoader />}
            </View>}
        />
      </View>

      {portalModal()}

      <FAB
        onPress={() => navigation.navigate(routes.broadcastStartNewChat, {
          refresh
        })}
        icon={() => icons.plus(colors.black, 20)}
      />

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default ChatList;
let noneObj = {
  _id: "",
  title: "None"
}

const markdownStyleOther = {
  body: {
    fontFamily: fonts.light,
    color: colors.white,
    margin: 0
  },
  link: {
    textDecorationLine: '',
    color: colors.white,
    fontWeight: '400',

  },
  strong: {
    fontFamily: fonts.regular
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0,
    fontSize: 12
  }
}

const __style = StyleSheet.create({
  itemRootView: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 10,

  },
  itemImage: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center"
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seondViewRow: {
    flex: 1,
    marginHorizontal: 10,
    marginLeft: 13

  },
  nameAndMsgView: {

  },
  tabsView: {
    flexDirection: "row",
    marginBottom: 10
  },
  tabSelectedView: {
    borderColor: colors.primary,
    backgroundColor: colors.lightPrimary3,

  },

  tabView: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.lightPrimary2,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginRight: 10
  },



  separotor: {
    // height: Platform.OS == "android" ? 1 / 2 : 1 / 3,
    backgroundColor: colors.lightText,
  },
  status: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    position: "absolute",
    right: -5,
    bottom: 0
  },
  badge: {
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center", backgroundColor: colors.primary2, borderRadius: 20 / 2,
    marginLeft: 5
  }
})