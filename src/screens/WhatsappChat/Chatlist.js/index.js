import { View, Text, FlatList, StyleSheet, TouchableHighlight, Keyboard, SafeAreaView, Pressable, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useReducer, useState } from 'react'
import RootView from '../../../components/RootView'
import MyLoader, { SimpleLoader } from '../../../components/MyLoader'
import MyText from '../../../components/MyText'
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
import { WHATSAPP_CHATLIST } from '../../../DAL'



let page = 0;
let canLoadMore = false;
let __firstTime = true;
let isNewChat = false;



const ChatList = ({ navigation }) => {
  const { token, user } = useSelector(selectUser);
  const { socket } = useSelector(selectSocket);
  const timezone = useSelector(selectTimeZone);
  const [loader, setLoader] = useState(true);
  const [footerLoader, setFooterLoader] = useState(false);
  const [chatList, setChatList] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [tab, setTab] = useState('all')


  const onChatScreen = (member, item) => {
    navigation.navigate(routes.whtasappChatMessageList, {
      memberId: member?._id,
      firstName: member?.first_name,
      lastName: member?.last_name,
      profileImage: member?.profile_image,
      showTemplate: member?.whatsapp_chat_status != 'accepted',
      chatId: item._id,
      resetCountToZero,
      refresh,
      makeChatAccepted
    })
  }



  const api_ChatList = async (newArray = false) => {
    let res = await WHATSAPP_CHATLIST({
      navigation, token,
      page: page,
      filter: tab,
      searchText: searchText
    })
    if (res.code == 200) {
      if ((chatList.length + res?.data.length) < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setLoader(false);
      setFooterLoader(false);
      setChatList(newArray ? res?.data : [...chatList, ...res?.data]);
      setTimeout(() => {
        __firstTime = false;
      }, 300);
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
    if (canLoadMore && __firstTime == false) {
      canLoadMore = false;
      setFooterLoader(true);
      api_ChatList(false)
    }

  }



  useEffect(() => {
    if (!__firstTime) {
      page = 0;
      canLoadMore = false;
      debounce(() => api_ChatList(true))
    }
  }, [searchText])

  useEffect(() => {
    if (!__firstTime) {
      page = 0;
      canLoadMore = false;
      setLoader(true);
      setChatList([])
      debounce(() => api_ChatList(true))
    }
  }, [tab])


  useEffect(() => {
    page = 0;
    canLoadMore = false;
    setLoader(true);
    setChatList([])
    api_ChatList()
    socketEvents();

    return () => {
      __firstTime = true;
      page = 0;
      canLoadMore = false;
      isNewChat = false;
      removeSocketEvents()
    }
  }, [])


  const socketEvents = () => {
    socket.on("whatsapp_chat_message_event_receiver", newMsgReceive);
  }

  const removeSocketEvents = () => {

    socket.off("whatsapp_chat_message_event_receiver", newMsgReceive);
  }

  const readMsgSingnal = (data) => {
    if (data.status == "read") {
      setChatList((chatList) => {
        let index = chatList.findIndex(chat => chat._id == data.chat_id);
        if (index > -1) {
          if (chatList[index].last_message_sender == user?._id) {
            chatList[index].last_message_status = "read";
          }
        }
        return [...chatList]
      })
    }

  }

  const newMsgReceive = (data) => {

    if (!!data?.data?.response) {
      let newChatObj = data?.data?.response;
      let list = [];
      let newList = [];
      setChatList((chatList) => {
        list = [...chatList];
        let index = list.findIndex(x => x?._id == newChatObj?.whatssapp_chat);
        if (index > -1) {
          let chatobj = {
            ...list[index],
            last_message: {
              message: newChatObj?.message?.message,
              message_type: newChatObj?.message?.message_type,
              message_id: newChatObj?.whatssapp_message_id,
            },
            last_message_date_time: newChatObj?.createdAt,
            // receiver_info: {
            //   ...list[index].receiver_info,
            //   unread_message_count: newChatObj?.receiver_info?.unread_message_count
            // },
            sender_info: {
              ...list[index].sender_info,
              unread_message_count: list[index]?.sender_info?.unread_message_count + 1
            }
          };
          list.splice(index, 1);
          list = [chatobj, ...list];
          if(list.length==1){
            refresh?.()
          }
        }
        return [...list]
      });
    }

  }



  const resetCountToZero = (chatId) => {
    setChatList((chatList) => {
      let index = chatList.findIndex(x => x._id == chatId);
      if (index > -1) {
        let chatobj = { ...chatList[index] };
        chatobj.sender_info.unread_message_count = 0;
        chatList.splice(index, 1, chatobj);
      }
      return [...chatList]
    })
  }


  const makeChatAccepted = (chatId) => {
    let index = chatList.findIndex(x => x._id == chatId);
    if (index > -1) {
      let chatobj = { ...chatList[index] };
      chatobj.receiver_info.whatsapp_chat_status = "accepted";
      chatList.splice(index, 1, chatobj);
      setChatList([...chatList])
    }
  }






  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>
        <View style={__style.tabsView}>
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

        <View style={{ marginTop: -10, paddingHorizontal: 5 }}>
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
        </View>
      </View>)
  }

  const renderChatList = ({ item, index }) => {
    let otherUser = item?.sender_info;
    let member = item?.receiver_info;


    return (
      <TouchableHighlight
        onPress={() => onChatScreen(member, item)}
        underlayColor={colors.secondary}>
        <View style={__style.itemRootView}>
          <View>
            <UserImage
				      borderWidth={2}
				      borderColor={member?.badge_info?.color_code}
              image={member?.profile_image}
              name={member?.first_name}
            />
            {/* <View style={[__style.status, {
              backgroundColor: member?._id?.is_online ? colors.online : colors.primary2
            }]} /> */}
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
                  {!!item?.last_message?.status == false || item?.last_message?.status == "sent"
                    ? icons.sent(colors.white, 20) :
                    icons.seen(item?.last_message?.status == "read" ? colors.primary : colors.white, 20)}
                </View>}

              {item.message_type != "general" && item.message_type == "template" &&
                <View style={{ marginRight: 5 }}>
                  {item.message_type == "image" ? icons.camera(colors.white, 12) :
                    item.message_type == "audio" ? icons.mic(colors.white, 15) :
                      item.message_type == "video" ? icons.playCircle(colors.white, 18) : ""}
                </View>
              }
              <View style={{ flexDirection: "row", flex: 1 }}>
                <MyText fontSize={12} type='light' numberOfLines={1} style={{ marginTop: 3, flex: 1 }}>
                  {!!item?.last_message?.message ?
                    isHtml(item?.last_message?.message) ?
                      decode(item.last_message?.message.replace(/<[^>]+>/g, '').replace(/\*/g, "").replace(/[\])}[{(]/g, " ").slice(0, 70), { level: "html5" }) :
                      <Markdown style={markdownStyleOther}>
                        {item?.last_message?.message.slice(0, 70)}
                      </Markdown> :
                    item?.last_message?.message_type == "image" ? "Photo" :
                      item?.last_message?.message_type == 'audio' ? "Audio" :
                        item?.last_message?.message_type == 'video' ? "Video" : ""}

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
      title='WHATSAPP CHATS'
      hideChatIcon
    >

      <View style={{ flex: 1 }}>
        <FlatList
          data={chatList}
          renderItem={renderChatList}
          ListEmptyComponent={!loader && <EmptyView label={"No Chat"} />}
          ListHeaderComponent={headerView()}
          stickyHeaderIndices={[0]}
          onEndReachedThreshold={0.5}
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


      <FAB
        onPress={() => navigation.navigate(routes.whtasappStartNewChat, {
          resetCountToZero,
          refresh,
          makeChatAccepted
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
