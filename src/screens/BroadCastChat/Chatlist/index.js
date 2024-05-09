import { View, Text, FlatList, StyleSheet, TouchableHighlight, Keyboard, SafeAreaView, Pressable, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyLoader, { SimpleLoader } from '../../../components/MyLoader'
import MyText from '../../../components/MyText'
import { CHAT_LIST, PORTAL_LIST } from '../../../DAL'
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


  const onChatScreen = (member, item) => {
    navigation.navigate(routes.broadcastChatMessageList, {
      isOnline: member?._id?.is_online,
      memberId: member?._id?._id,
      firstName: member?.first_name,
      lastName: member?.last_name,
      lastSeen: member?._id?.last_login_activity,
      profileImage: member?.profile_image,
      chatId: item._id,
      resetCountToZero,
      refresh
    })
  }

  const api_ChatList = async (newArray = false) => {
    let res = await CHAT_LIST({
      navigation, body: {
        event_id: eventId?._id,
        search_text: searchText,
        chat_type: tab
      }, token, page
    })
    if (res.code == 200) {
      if ((chatList.length + res?.chat.length) < res?.total_chat_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setLoader(false);
      setFooterLoader(false);
      setChatList(newArray ? res?.chat : [...chatList, ...res?.chat]);
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

  const api_portalList = async () => {
    let res = await PORTAL_LIST({ navigation, token })
    if (res.code == 200) {
      setPortalList([{ ...noneObj }, ...res?.member_dynamite_event]);
    }
  }

  useEffect(() => {
    if (!firstTime) {
      console.log("HI")
      page = 0;
      canLoadMore = false;
      debounce(() => api_ChatList(true))
    }
  }, [searchText, JSON.stringify(eventId)])

  useEffect(() => {
    if (!firstTime) {
      page = 0;
      canLoadMore = false;
      setLoader(true);
      setChatList([])
      debounce(() => api_ChatList(true))
    }
  }, [tab])


  useEffect(() => {
    firstTime = true;
    page = 0;
    canLoadMore = false;
    api_ChatList()
    api_portalList()
    socketEvents();

    return () => {
      page = 0;
      canLoadMore = false;
      isNewChat = false;
      removeSocketEvents()
    }
  }, [])


  const socketEvents = () => {
    socket.on("send_chat_message_event_for_sender", newMsgReceive);
    socket.on("send_chat_message_receiver", newMsgReceive);
    socket.on("update_chat_message_event_for_sender", editMessageReceiver);
    socket.on("update_chat_message_receiver", editMessageReceiver);
    socket.on("delete_chat_message_event_for_sender", deleteMessageReceiver);
    socket.on("delete_chat_message_receiver", deleteMessageReceiver);
    socket.on("member_online", memberOnlineSignal);
    socket.on("member_offline", memberOfflineSignal);
    socket.on("consultant_offline", memberOfflineSignal);
    socket.on("chat_message_status", readMsgSingnal);
  }

  const removeSocketEvents = () => {
    socket.off("send_chat_message_event_for_sender", newMsgReceive);
    socket.off("send_chat_message_receiver", newMsgReceive);
    socket.off("update_chat_message_event_for_sender", editMessageReceiver);
    socket.off("update_chat_message_receiver", editMessageReceiver);
    socket.off("delete_chat_message_event_for_sender", deleteMessageReceiver);
    socket.off("delete_chat_message_receiver", deleteMessageReceiver);
    socket.off("member_online", memberOnlineSignal);
    socket.off("member_offline", memberOfflineSignal);
    socket.off("consultant_offline", memberOfflineSignal);
    socket.off("chat_message_status", readMsgSingnal);
  }

  const readMsgSingnal = (data) => {
    console.log("chat_message_status", data);
    if (data.status == "read") {
      setChatList((chatList) => {
        let index = chatList.findIndex(chat => chat._id == data.chat_id);
        if (index > -1) {
          console.log(chatList[index], "chatObj")
          if (chatList[index].last_message_sender == user?._id) {
            chatList[index].last_message_status = "read";

            console.log(chatList, "read 2")
          }
        }
        return [...chatList]
      })
    }

  }

  const newMsgReceive = (data) => {
    console.log(data, "sendMessageReceiver")
    if (data.code == 200) {
      setChatList((chatList) => {
        let index = chatList.findIndex(x => x?._id == data?.chat_obj?.chat?._id);
        console.log(index, "index")
        if (index > -1) {
          let chatobj = { ...chatList[index] };
          let newChatObj = data?.chat_obj?.chat;
          chatobj = {
            ...chatobj,
            image: newChatObj.image,
            last_message: newChatObj.last_message,
            last_message_date_time: newChatObj.last_message_date_time,
            message_id: newChatObj.message_id,
            updatedAt: newChatObj.updatedAt,
            message_type: newChatObj.message_type,
            member: data?.chat_obj?.member,
            last_message_sender: data?.message_obj?.sender_id,
            last_message_status: data?.message_obj?.status,
          };
          console.log(chatobj, "newchatobj")
          chatList.splice(index, 1, chatobj);
        } else {
          let newChatObj = data?.chat_obj?.chat;
          let chatobj = {
            ...newChatObj,
            member: data?.chat_obj?.member
          }
          chatList.unshift(chatobj);
          console.log(chatList, "chatList")
        }
        return [...chatList]

      })
    }
  }



  const editMessageReceiver = (data) => {
    console.log(data, "editMessageReceiver")
    if (data.code == 200) {
      setChatList((chatList) => {
        let index = chatList.findIndex(x => x?._id == data?.message_obj?.chat_id);
        if (index > -1) {
          let chatobj = { ...chatList[index] };
          let newChatObj = data?.message_obj;
          if (chatobj?.message_id == newChatObj?._id) {
            chatobj = {
              ...chatobj,
              image: newChatObj.image,
              last_message: newChatObj.message,
              last_message_date_time: newChatObj.message_date_time,
              message_id: newChatObj._id,
              updatedAt: newChatObj.updatedAt,
              message_type: newChatObj.message_type,
            }
            chatList.splice(index, 1, chatobj);
            return [...chatList]
          }
          return chatList;
        }
      })
    }

  }



  const deleteMessageReceiver = (data) => {
    console.log(data, "deleteMessageReceiver")
    if (data.code == 200) {
      if (data.is_last_message) {
        setChatList((chatList) => {
          let index = chatList.findIndex(x => x?._id == data?.chat_id);
          if (index > -1) {
            let chatobj = { ...chatList[index] };
            let newChatObj = data?.message_obj;
            chatobj = {
              ...chatobj,
              image: newChatObj.image,
              last_message: newChatObj.message,
              last_message_date_time: newChatObj.message_date_time,
              message_id: newChatObj._id,
              updatedAt: newChatObj.updatedAt,
              message_type: newChatObj.message_type,
            }
            chatList.splice(index, 1, chatobj);
            return [...chatList]
          }
        })
      }
    }
  }


  const memberOnlineSignal = (data) => {
    console.log(data, "memberOnlineSignal")
    setChatList((chatList) => {
      let chatLength = chatList.length;
      for (let i = 0; i < chatLength; i++) {
        if (data.user_id == chatList[i].member[0]._id._id) {
          chatList[i].member[0]._id.is_online = true;
          chatList[i].last_message_status = "delivered";
          return [...chatList]
        }
        else if (data.user_id == chatList[i].member[1]._id._id) {
          chatList[i].member[1]._id.is_online = true;
          chatList[i].last_message_status = "delivered";
          return [...chatList]
        }
      }
      return [...chatList]
    })
  }

  const memberOfflineSignal = (data) => {
    setChatList((chatList) => {
      let chatLength = chatList.length;
      for (let i = 0; i < chatLength; i++) {
        if (data.user_id == chatList[i].member[0]._id._id) {
          chatList[i].member[0]._id.is_online = false;
          return [...chatList]
        }
        else if (data.user_id == chatList[i].member[1]._id._id) {
          chatList[i].member[1]._id.is_online = false
          return [...chatList]
        }
      }
      return [...chatList]
    })

  }


  const resetCountToZero = (chatId) => {
    console.log("resetCountToZero",)
    let index = chatList.findIndex(x => x._id == chatId);
    console.log(index, "index")
    if (index > -1) {
      let chatobj = { ...chatList[index] };
      let memberIndex = chatobj.member.findIndex(x => x._id?._id == user?._id);
      console.log(memberIndex, "memberIndex")
      if (memberIndex > -1) {
        chatobj.member[memberIndex].unread_message_count = 0;
        chatList.splice(index, 1, chatobj);
        setChatList([...chatList])
      }
    }
  }





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
        onPress={() => onChatScreen(member, item)}
        underlayColor={colors.secondary}>
        <View style={__style.itemRootView}>
          <View>
            <UserImage
              image={member?.profile_image}
              name={member?.first_name}
            />
            <View style={[__style.status, {
              backgroundColor: member?._id?.is_online ? colors.online : colors.primary2
            }]} />
          </View>

          <View style={__style.seondViewRow}>
            <View style={__style.headerView}>
              <View style={{ flex: 1 }}>
                <MyText fontSize={14} type='medium' >{member?.first_name + " " + member?.last_name}</MyText>
              </View>
              <MyText fontSize={10} color={colors.lightText} >{convertTimezone(item?.last_message_date_time, timezone).format(dateTimeFormat.dateTime)}</MyText>
            </View>
            <View style={{ marginTop: 3, flexDirection: "row", alignItems: "center" }}>

              {item?.last_message_sender == user?._id &&
                <View style={{ marginRight: 5 }}>
                  {!!item?.last_message_status == false || item?.last_message_status == "sent"
                    ? icons.sent(colors.white, 20) :
                    icons.seen(item?.last_message_status == "read" ? colors.primary : colors.white, 20)}
                </View>}

              {item.message_type != "general" &&
                <View style={{ marginRight: 5 }}>
                  {item.message_type == "image" ? icons.camera(colors.white, 12) :
                    item.message_type == "audio" ? icons.mic(colors.white, 15) :
                      item.message_type == "video" ? icons.playCircle(colors.white, 18) : ""}
                </View>
              }
              <View style={{ flexDirection: "row", flex: 1, height: 18 }}>
                <MyText fontSize={12} type='light' numberOfLines={1} style={{ marginTop: 3, flex: 1 }}>
                  {!!item?.last_message ?
                    isHtml(item?.last_message) ?
                      decode(item.last_message.replace(/<[^>]+>/g, '').replace(/\*/g, "").replace(/[\])}[{(]/g, " ").slice(0, 70), { level: "html5" }) :
                      <Markdown style={markdownStyleOther}>
                        {item?.last_message.replace(/\n/g, "").slice(0, 100)}
                      </Markdown> :
                    item.message_type == "image" ? "Photo" :
                      item.message_type == 'audio' ? "Audio" :
                        item.message_type == 'video' ? "Video" : ""}

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
          resetCountToZero,
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