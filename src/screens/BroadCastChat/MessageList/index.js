import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, StatusBar, Platform, TextInput, Image, TouchableHighlight, Pressable, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import UserImage from '../../../components/UserImage';
import MyText from '../../../components/MyText';
import { convertTimezone } from '../../../functions/convertTime';
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice';
import { useSelector } from 'react-redux';
import { colors } from '../../../utilities/colors';
import { ADD_AS_NOTE, EDIT_SCHEDULE_BROADCAST_MESSAGE, GET_BROADCAST_MESSAGE_LIST, MESSAGE_LIST_BY_CHAT_ID, READ_ALL_MESSAGES } from '../../../DAL';
import { selectUser } from '../../../redux/reducers/userSlice';
import MyLoader, { SimpleLoader } from '../../../components/MyLoader';
import utilities from '../../../utilities';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts } from '../../../utilities/fonts';
import { icons } from '../../../utilities/icons';
import Collapsible from 'react-native-collapsible';
import EmptyView from '../../../components/EmptyView';
import OptionModal from '../../../components/OptionModal';
import ImageUploadModal from '../../../components/ImageUploadModal';
import MyImage2 from '../../../components/MyImage2';
import { S3_URL } from '../../../utilities/constants';
import MyImage from '../../../components/MyImage';
import MsgView from './MsgView';
import ImageZoomer from '../../../components/ImageZoomer';
import SendMsgView from './SendMsgView';
import UserView from './UserView';
import { selectSocket } from '../../../redux/reducers/socketSlice';
import ConfirmationModal from '../../../components/ConfirmationModal';
import copyText from '../../../functions/copyText';
import TrackPlayer from 'react-native-track-player'
import routes from '../../../navigation/routes';
import showToast from '../../../functions/showToast';
import InfoModal from '../../../components/InfoModal';

let page = 0;
let canLoadMore = false;
let isNewChat = false;
const MessageList = ({ navigation, route }) => {
  const { chatName: name1, chatId } = route?.params;
  const [member, setMember] = useState(route?.params);
  const [chatName, setChatName] = useState(name1)
  const ref_infoModal = useRef()
  const insets = useSafeAreaInsets();
  const timezone = useSelector(selectTimeZone);
  const { socket } = useSelector(selectSocket);
  const { token, user } = useSelector(selectUser);
  const [chat, setChat] = useState([]);
  const [loader, setLoader] = useState(false);
  const [footLoader, setFooterLoader] = useState(false);
  const [opitonModal, setOptionModal] = useState({ isVisible: false, opt: "", item: null, optionList: [] });
  const [confirmation, setConfirmation] = useState({ isVisible: false, item: null, title: "", type: "" })
  const [isImageZoomerVisible, setImageZommerVisiblity] = useState("");
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    console.log(chatName, "chatName")
  }, [chatName])
  
  useEffect(() => {
    isNewChat = false
    page = 0;
    canLoadMore = false;
    if (!!member?.chatId) {
      setLoader(true)
      getMemberList();
    }
    // socketEvents()
    return () => {
      try {
        setChat([])
        isNewChat = false
        // removeSocketEvents();
        TrackPlayer.pause()
        TrackPlayer.reset()
      } catch (e) {
        console.log(e, "error")
      }
    }
  }, [])





  //! //////// APIS
  const loadMore = () => {
    if (canLoadMore) {
      console.log("onEndRech")
      canLoadMore = false;
      setFooterLoader(true);
      getMemberList()
    }
  }

  const getMemberList = async () => {
    let res = await GET_BROADCAST_MESSAGE_LIST({ navigation, token, chatId })
    setLoader(false);
    setFooterLoader(false)

    if (res.code == 200) {
      setChat(res?.broadcast_message.reverse())
    }
  }



  const deleteMsgToServer = async (messageId) => {
    closeConfirmation?.()
    setLoader(true)
    let res = await EDIT_SCHEDULE_BROADCAST_MESSAGE({ token, navigation, chatId, messageId });
    if (res.code == 200) {
      showToast({ type: "success", title: res?.message });
      setChat((list) => {
        let index = list.findIndex(x => x._id == messageId);
        if (index > -1) {
          list.splice(index, 1);
        }
        return [...list]
      })
    } else {
      setSendMsgLoader(false);
    }
  }

  //? /////// ACTIONS

  const optionAction = (opt) => {
    let item = opitonModal.item
    setOptionModal({ ...opitonModal, opt: opt.type, item: null, isVisible: false, })


    if (opt.type == 'delete') {
      console.log("delete")
      setTimeout(() => {
        setConfirmation({ isVisible: true, title: "Are you sure you want to delete this message?", item, type: "delete_msg" });
      }, 600);
    }
    else if (opt.type == 'copy') {
      copyText(item.message)
    }
    else if (opt.type == 'edit') {
      setEdit(item)
    }
  }

  const closeConfirmation = () => {
    setConfirmation({ isVisible: false, title: "", item: null, type: "" });
  }

  const deleteMsg = () => {
    if (confirmation.type == "delete_msg") {
      let item = confirmation.item
      deleteMsgToServer(item._id)
    }
  }


  const openOptionModal = (item) => {
    let options;
    if (item?.message_type == "schedule") {

      if (item?.message_content_type == "audio") {
        options = msgOptionListSchedule.slice().filter(x => x.key == "delete")
      } else {
        options = [...msgOptionListSchedule]
      }
    } else {
      options = [...msgOptionList]
      // options = [...msgOptionListSchedule]
    }
    setOptionModal({ isVisible: true, item: item, opt: "", optionList: options })
  }


  //! AudioMsg
  const [state, updateState] = useState({
    selected_audio: null,
    isPlaying: ""
  });

  const setState = (updation) => updateState({ ...state, ...updation });



  const playIconClick = async (audio, id, isMe) => {


    if (audio !== state.selected_audio) {
      await TrackPlayer.pause();
      await TrackPlayer.reset()
      setState({ selected_audio: audio, isPlaying: id });
      console.log(S3_URL + audio, "audio")
      await TrackPlayer.add({
        id: id,
        url: S3_URL + audio,
      });
      await TrackPlayer.play()

    }
    else {
      let playerState = await TrackPlayer.getState();
      // console.log(await TrackPlayer.getActiveTrack(), 'state')
      if (playerState === TrackPlayer.STATE_PAUSED || playerState === "ready" || playerState == "paused") {
        await TrackPlayer.play();
        setState({ isPlaying: id });
      }
      else {
        await TrackPlayer.pause();
        setState({ isPlaying: "" })
      }
    }
  }

  const stopPlayer = async () => {
    try {
      await TrackPlayer.reset()
    }
    catch (err) {
      console.log(err, "err")
    }
    setState({ isPlaying: "", selected_audio: null })
  }



  const renderMessages = useCallback(({ item, index }) => {
    return (
      <MsgView
        infoRef={ref_infoModal}
        state={state}
        setState={setState}
        user={user}
        item={item}
        index={index}
        timezone={timezone}
        onMsgLongPress={() => openOptionModal(item)}
        openImageZommer={() => { if (!!item?.image) { setImageZommerVisiblity(item?.image) } }}
        playIconClick={playIconClick}
        stopPlayer={stopPlayer}
      />
    )
  }, [JSON.stringify(chat), state])

  const onBackPress = () => {
    if (!!route?.params?.canGoBack) {
      navigation.goBack()
    } else {
      navigation.navigate(routes.broadcastChatList, {
        refresh: isNewChat
      })
    }
  }

  return (
    <RootView
      titleView={() => <UserView
        chatId={chatId}
        navigation={navigation}
        chatName={chatName}
        setChatName={setChatName}
      />}
      customBackPress={onBackPress}
      hideChatIcon
    >
      <KeyboardAvoidingView
        style={{ flex: 1, }}
        behavior={Platform.OS == "ios" ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS == "ios" ? (100 + insets.top) : 0}>
        <View style={{ flex: 1 }}>

          {/* Flatlist */}
          <View style={{ flex: 1, borderTopColor: colors.lightText2, borderTopWidth: 1 / 3, marginHorizontal: -10, paddingHorizontal: 10 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0}
              inverted={chat.length == 0 ? false : true}
              keyExtractor={(item) => item?._id}
              contentContainerStyle={[chat.length == 0 && { flex: 1, alignItems: 'center', justifyContent: "center" }]}
              data={chat}
              renderItem={renderMessages}
              ListEmptyComponent={loader ? <SimpleLoader size={50} /> : <EmptyView label={"No Messages"} />}
              ListFooterComponent={
                <View style={{ height: 50, alignItems: "center" }}>
                  {footLoader && <SimpleLoader />}
                </View>
              }
              onEndReached={loadMore}
            />
          </View>


          {/* Send Msg View */}
          <SendMsgView
            clearEdit={() => setEdit(null)}
            edit={edit}
            navigation={navigation}
            receiver={member}
            chatId={chatId}
            setChat={setChat}
          />


        </View>
      </KeyboardAvoidingView>


      {/* Modal Components */}
      <OptionModal
        isVisible={opitonModal.isVisible}
        optionList={opitonModal.optionList}
        closeModal={() => setOptionModal({ isVisible: false, opt: "", item: null })}
        onSelected={optionAction}

      />


      <ImageZoomer
        closeModal={() => setImageZommerVisiblity("")}
        url={isImageZoomerVisible}
        visible={!!isImageZoomerVisible}
      />

      <ConfirmationModal
        closeModal={closeConfirmation}
        isVisible={confirmation.isVisible}
        onAgree={deleteMsg}
        title={confirmation.title}
      />

      <InfoModal
        ref={ref_infoModal}
      />
    </RootView>
  )
}

export default MessageList;

const msgOptionList = [
  {
    icon: icons.copyOulined,
    title: "Copy",
    type: "copy"
  },
]

const msgOptionListSchedule = [
  {
    icon: icons.copyOulined,
    title: "Copy",
    type: "copy"
  },
  {
    icon: icons.edit,
    title: "Edit",
    type: "edit"
  },
  {
    icon: icons.trash,
    title: "Delete",
    type: "delete"
  },
]


