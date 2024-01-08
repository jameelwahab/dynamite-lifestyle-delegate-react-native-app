import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, StatusBar, Platform, TextInput, Image, TouchableHighlight, Pressable, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import UserImage from '../../../components/UserImage';
import MyText from '../../../components/MyText';
import { convertTimezone } from '../../../functions/convertTime';
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice';
import { useSelector } from 'react-redux';
import { colors } from '../../../utilities/colors';
import { ADD_AS_NOTE, MESSAGE_LIST_BY_CHAT_ID, READ_ALL_MESSAGES } from '../../../DAL';
import { selectUser } from '../../../redux/reducers/userSlice';
import MyLoader, { SimpleLoader } from '../../../components/MyLoader';
import utilities from '../../../utilities';
import MyInputs from '../../../components/MyInputs';
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

let page = 0;
let canLoadMore = false;
let isNewChat = false;
const MessageList = ({ navigation, route }) => {
  console.log(route?.params)
  const [member, setMember] = useState(route?.params);
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
  const [edit, setEdit] = useState({ msg: "", image: "", id: "", })



  useEffect(() => {
    isNewChat = false
    page = 0;
    canLoadMore = false;
    if (!!member?.chatId) {
      setLoader(true)
      getMemberList();
    }
    socketEvents()
    return () => {
      try {
        console.log("return")
        setChat([])
        isNewChat = false
        removeSocketEvents();
        TrackPlayer.pause()
        TrackPlayer.reset()
      } catch (e) {
        console.log(e, "error")
      }
    }
  }, [])

  const socketEvents = () => {
    socket.on("send_chat_message_event_for_sender", sendMessageReceiverForSender);
    socket.on("update_chat_message_event_for_sender", editMessageReceiverForSender);
    socket.on("delete_chat_message_event_for_sender", deleteMessageReceiverForSender);
    socket.on("send_chat_message_receiver", sendMessageReceiver);
    socket.on("update_chat_message_receiver", editMessageReceiver);
    socket.on("delete_chat_message_receiver", deleteMessageReceiver);
    socket.on("chat_message_status", readMsgSingnal);
  }

  const removeSocketEvents = () => {
    socket.off("send_chat_message_event_for_sender", sendMessageReceiverForSender);
    socket.off("update_chat_message_event_for_sender", editMessageReceiverForSender);
    socket.off("delete_chat_message_event_for_sender", deleteMessageReceiverForSender);
    socket.off("send_chat_message_receiver", sendMessageReceiver);
    socket.off("update_chat_message_receiver", editMessageReceiver);
    socket.off("delete_chat_message_receiver", deleteMessageReceiver);
    socket.off("chat_message_status", readMsgSingnal);
  }


  const readMsgSingnal = (data) => {
    console.log("chat_message_status", data);
    if (data.status == "read") {
      setChat((chatList) => {
        chatList.map((chat) => chat.status = "read");
        return [...chatList]
      })
    }

  }

  const sendMessageReceiverForSender = (data) => {
    console.log(data, "sendMessageReceiverForSender")
    setChat((chat) => [data?.message_obj, ...chat])
    setMember((member) => { return { ...member, chatId: data?.chat_obj?._id, } })
  }

  const sendMessageReceiver = (data) => {
    console.log(data, "sendMessageReceiver")
    setChat((chat) => [data?.message_obj, ...chat])
  }

  const editMessageReceiverForSender = (data) => {
    console.log(data, "editMessageReceiverForSender")
    if (data.code == 200) {
      setChat((chat) => {
        let index = chat.findIndex(x => x?._id == data?.message_obj?._id);
        if (index > -1) {
          chat.splice(index, 1, data?.message_obj);
          return [...chat]
        }
      })
    }

  }

  const editMessageReceiver = (data) => {
    console.log(data, "editMessageReceiver")
    if (data.code == 200) {
      setChat((chat) => {
        let index = chat.findIndex(x => x?._id == data?.message_obj?._id);
        if (index > -1) {
          chat.splice(index, 1, data?.message_obj);
          return [...chat]
        }
      })
    }
  }

  const deleteMessageReceiverForSender = (data) => {
    console.log(data, "deleteMessageReceiverForSender")
    if (data.code == 200) {
      setChat((chat) => {
        let index = chat.findIndex(x => x?._id == data?.message_id);
        if (index > -1) {
          chat.splice(index, 1);
          return [...chat]
        }
      })
    }
  }

  const deleteMessageReceiver = (data) => {
    console.log(data, "deleteMessageReceiver");
    if (data.code == 200) {
      setChat((chat) => {
        let index = chat.findIndex(x => x?._id == data?.message_id);
        if (index > -1) {
          chat.splice(index, 1);
          return [...chat]
        }
      })
    }
  }


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
    let res = await MESSAGE_LIST_BY_CHAT_ID({ navigation, token, chatId: member?.chatId, page })
    setLoader(false);
    setFooterLoader(false)

    if (res.code == 200) {
      if ((chat.length + res?.message.length) < res?.count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }

      setChat([...chat, ...res?.message.reverse()])
      readAllMessagesAPI()
    }
  }

  const readAllMessagesAPI = async () => {
    let res = await READ_ALL_MESSAGES({ token, navigation, chatId: member?.chatId });
    if (res.code == 200) {
      route?.params?.resetCountToZero?.(member?.chatId)
    }
  }

  const api_addAdNote = async (msgId) => {
    let res = await ADD_AS_NOTE({
      token, navigation, body: {
        member_id: member?.memberId,
        message_id: msgId,
      }
    })
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" })
    }
  }


  //? /////// ACTIONS

  const optionAction = (opt) => {
    console.log(opt, "msgAction")
    let item = opitonModal.item
    console.log(item, "msgAction")
    setOptionModal({ ...opitonModal, opt: opt.type, item: null, isVisible: false, })


    if (opt.type == 'delete') {
      setTimeout(() => {
        setConfirmation({ isVisible: true, title: "Are you sure you want to delete this message?", item, type: "delete_msg" });
      }, 500);
    }
    else if (opt.type == 'copy') {
      copyText(item.message)
    }
    else if (opt.type == 'edit') {
      setEdit({
        msg: item.message,
        image: item.image,
        id: item._id
      })
    } else if (opt.type == 'note') {
      api_addAdNote(item?._id);
    }
  }

  const closeConfirmation = () => {
    setConfirmation({ isVisible: false, title: "", item: null, type: "" });
  }

  const deleteMsg = () => {
    if (confirmation.type == "delete_msg") {
      let item = confirmation.item
      closeConfirmation();
      const postData = {
        chat_id: member?.chatId,
        message_id: item?._id
      };
      socket.emit("delete_chat_message", postData);
    }
  }



  const isOtherMember = (id) => {
    return id == user?._id;
  }


  const openOptionModal = (item) => {
    let options;
    if (isOtherMember(item.receiver_id)) {
      if (item.message_type == "image" && !!item?.image) {
        options = msgOptionList.slice().filter(x => x.type != 'delete' && x.type != 'edit');
        if (!!item?.message == false) {
          options = options.slice().filter(x => x.type != 'copy');
        }
      } else if (item.message_type == "audio") {
        return
      } else {
        options = msgOptionList.slice().filter(x => x.type == 'note' || x.type == 'copy');
      }
    } else {
      if (item.message_type == "image" && !!item?.image) {
        options = [...msgOptionList];
        if (!!item?.message == false) {
          options = options.slice().filter(x => x.type != 'copy');
        }
      }
      else if (item.message_type == "audio") {
        options = msgOptionList.slice().filter(x => x.type == 'delete');
      } else {
        options = msgOptionList.slice().filter(x => x.type != 'download');
      }
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



  const renderMessages = ({ item, index }) => {
    return (
      <MsgView
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
  }

  const onBackPress = () => {
    navigation.navigate(routes.chatList, {
      refresh: isNewChat
    })
  }

  return (
    <RootView
      titleView={() => <UserView member={member} timezone={timezone} />}
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
            clearEdit={() => setEdit({ id: "", msg: "", image: "" })}
            edit={edit}
            navigation={navigation}
            receiver={member}
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
  {
    icon: icons.edit,
    title: "Add as Note",
    type: "note"
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


