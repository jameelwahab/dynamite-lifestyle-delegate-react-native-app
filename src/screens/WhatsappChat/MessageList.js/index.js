import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  TextInput,
  Image,
  TouchableHighlight,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import RootView from '../../../components/RootView';
import UserImage from '../../../components/UserImage';
import MyText from '../../../components/MyText';
import {convertTimezone} from '../../../functions/convertTime';
import {selectTimeZone} from '../../../redux/reducers/timezoneSlice';
import {useSelector} from 'react-redux';
import {colors} from '../../../utilities/colors';
import {
  ADD_AS_NOTE,
  MESSAGE_LIST_BY_CHAT_ID,
  READ_ALL_MESSAGES,
  WHATSAPP_MESSAGE_LIST,
} from '../../../DAL';
import {selectUser} from '../../../redux/reducers/userSlice';
import MyLoader, {SimpleLoader} from '../../../components/MyLoader';
import utilities from '../../../utilities';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {fonts} from '../../../utilities/fonts';
import {icons} from '../../../utilities/icons';
import Collapsible from 'react-native-collapsible';
import EmptyView from '../../../components/EmptyView';
import OptionModal from '../../../components/OptionModal';
import ImageUploadModal from '../../../components/ImageUploadModal';
import MyImage2 from '../../../components/MyImage2';
import MyImage from '../../../components/MyImage';
import MsgView from './MsgView';
import ImageZoomer from '../../../components/ImageZoomer';
import SendMsgView from './SendMsgView';
import UserView from './UserView';
import {selectSocket} from '../../../redux/reducers/socketSlice';
import ConfirmationModal from '../../../components/ConfirmationModal';
import copyText from '../../../functions/copyText';
import TrackPlayer from 'react-native-track-player';
import routes from '../../../navigation/routes';
import showToast from '../../../functions/showToast';
import TemplateView from './TemplateView';
import isObject from '../../../functions/isObject';

let page = 0;
let canLoadMore = false;
let isNewChat = false;
const MessageList = ({navigation, route}) => {
  const [showTemplateView, setShowTemplateView] = useState(
    !!route?.params?.showTemplate,
  );
  const [member, setMember] = useState(route?.params);
  const insets = useSafeAreaInsets();
  const timezone = useSelector(selectTimeZone);
  const {socket} = useSelector(selectSocket);
  const {token, user, S3_URL} = useSelector(selectUser);
  const [chat, setChat] = useState([]);
  const [tamplates, setTamplates] = useState([]);
  const [loader, setLoader] = useState(false);
  const [footLoader, setFooterLoader] = useState(false);
  const [opitonModal, setOptionModal] = useState({
    isVisible: false,
    opt: '',
    item: null,
    optionList: [],
  });
  const [confirmation, setConfirmation] = useState({
    isVisible: false,
    item: null,
    title: '',
    type: '',
  });
  const [isImageZoomerVisible, setImageZommerVisiblity] = useState('');
  const [edit, setEdit] = useState({msg: '', image: '', id: ''});
  const [isTemplateModalShown, setIsTemplateModalShown] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    isNewChat = false;
    page = 0;
    canLoadMore = false;
    if (!!member?.chatId) {
      setLoader(true);
      getMemberList();
    }
    socketEvents();
    return () => {
      try {
        setChat([]);
        isNewChat = false;
        removeSocketEvents();
        TrackPlayer.pause();
        TrackPlayer.reset();
      } catch (e) {}
    };
  }, []);

  const socketEvents = () => {
    socket.on(
      'whatsapp_chat_message_event_receiver',
      sendMessageReceiverForSender,
    );
    socket.on('whatsapp_message_status', onMessageStatus);
  };

  const removeSocketEvents = () => {
    socket.off(
      'whatsapp_chat_message_event_receiver',
      sendMessageReceiverForSender,
    );
    socket.off('whatsapp_message_status', onMessageStatus);
  };

  const sendMessageReceiverForSender = data => {
    console.log(data, 'data');
    if (isObject(data?.data?.response)) {
      setChat(chat => {
        if (chat.length == 0) {
          route?.params?.refresh?.();
        }
        return [data?.data?.response, ...chat];
      });
    }
    // setMember((member) => { return { ...member, chatId: data?.chat_obj?._id, } })
  };

  const onMessageStatus = data => {
    setChat(chats => {
      let index = chats.findIndex(
        chat => chat?.whatssapp_message_id == data?.whatssapp_message_id,
      );

      if (index > -1) {
        chats.splice(index, 1, {
          ...chats[index],
          status: data?.status,
          failed_reason: data?.failed_reason,
        });
      }
      return [...chats];
    });
  };

  //! //////// APIS
  const loadMore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      getMemberList();
    }
  };

  const getMemberList = async () => {
    let res = await WHATSAPP_MESSAGE_LIST({
      navigation,
      token,
      userId: member?.chatId,
    });
    setLoader(false);
    setFooterLoader(false);

    if (res.code == 200) {
      // if ((chat.length + res?.data        .length) < res?.count) {
      //   page++;
      //   canLoadMore = true;
      // } else {
      //   canLoadMore = false;
      // }
      setTamplates(res?.list_templates);
      setChat([...res?.data?.reverse()]);

      // route?.params?.resetCountToZero?.(member?.chatId);
      route?.params?.refresh?.();
      // readAllMessagesAPI()
    }
  };

  const readAllMessagesAPI = async () => {
    let res = await READ_ALL_MESSAGES({
      token,
      navigation,
      chatId: member?.chatId,
    });
    if (res.code == 200) {
      route?.params?.resetCountToZero?.(member?.chatId);
      route?.params?.refresh?.();
    }
  };

  const api_addAdNote = async msgId => {
    let res = await ADD_AS_NOTE({
      token,
      navigation,
      body: {
        member_id: member?.memberId,
        message_id: msgId,
      },
    });
    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
    }
  };

  const onSelectedTemplate = item => {
    setSelectedTemplate(item);
    setIsTemplateModalShown(false);
  };

  //? /////// ACTIONS

  const optionAction = opt => {
    let item = opitonModal.item;
    setOptionModal({
      ...opitonModal,
      opt: opt.type,
      item: null,
      isVisible: false,
    });

    if (opt.type == 'delete') {
      setTimeout(() => {
        setConfirmation({
          isVisible: true,
          title: 'Are you sure you want to delete this message?',
          item,
          type: 'delete_msg',
        });
      }, 500);
    } else if (opt.type == 'copy') {
      copyText(item.message);
    } else if (opt.type == 'edit') {
      setEdit({
        msg: item.message,
        image: item.image,
        id: item._id,
      });
    } else if (opt.type == 'note') {
      api_addAdNote(item?._id);
    }
  };

  const closeConfirmation = () => {
    setConfirmation({isVisible: false, title: '', item: null, type: ''});
  };

  const deleteMsg = () => {
    if (confirmation.type == 'delete_msg') {
      let item = confirmation.item;
      closeConfirmation();
      const postData = {
        chat_id: member?.chatId,
        message_id: item?._id,
      };
      socket.emit('delete_chat_message', postData);
    }
  };

  const isOtherMember = id => {
    return id == user?._id;
  };

  const openOptionModal = item => {
    let options;
    if (isOtherMember(item.receiver_id)) {
      if (item.message_type == 'image' && !!item?.image) {
        options = msgOptionList
          .slice()
          .filter(x => x.type != 'delete' && x.type != 'edit');
        if (!!item?.message == false) {
          options = options.slice().filter(x => x.type != 'copy');
        }
      } else if (item.message_type == 'audio') {
        return;
      } else {
        options = msgOptionList
          .slice()
          .filter(x => x.type == 'note' || x.type == 'copy');
      }
    } else {
      if (item.message_type == 'image' && !!item?.image) {
        options = [...msgOptionList];
        if (!!item?.message == false) {
          options = options.slice().filter(x => x.type != 'copy');
        }
      } else if (item.message_type == 'audio') {
        options = msgOptionList.slice().filter(x => x.type == 'delete');
      } else {
        options = msgOptionList.slice().filter(x => x.type != 'download');
      }
    }
    setOptionModal({isVisible: true, item: item, opt: '', optionList: options});
  };

  //! AudioMsg
  const [state, updateState] = useState({
    selected_audio: null,
    isPlaying: '',
  });

  const setState = updation => updateState({...state, ...updation});

  const playIconClick = async (audio, id, isMe) => {
    if (audio !== state.selected_audio) {
      await TrackPlayer.pause();
      await TrackPlayer.reset();
      setState({selected_audio: audio, isPlaying: id});

      await TrackPlayer.add({
        id: id,
        url: S3_URL + audio,
      });
      await TrackPlayer.play();
    } else {
      let playerState = await TrackPlayer.getState();
      if (
        playerState === TrackPlayer.STATE_PAUSED ||
        playerState === 'ready' ||
        playerState == 'paused'
      ) {
        await TrackPlayer.play();
        setState({isPlaying: id});
      } else {
        await TrackPlayer.pause();
        setState({isPlaying: ''});
      }
    }
  };

  const stopPlayer = async () => {
    try {
      await TrackPlayer.reset();
    } catch (err) {}
    setState({isPlaying: '', selected_audio: null});
  };

  const sendBtnPress = () => {
    if (!!!selectedTemplate) {
      showToast({title: 'Please select a Template'});
    } else {
      let postData = {
        receiver_id: member?.memberId,
        chat_id: member?.chatId,
        message: selectedTemplate?.name,
        token: token,
        message_type: 'template',
      };

      socket.emit('whatsapp_chat_message_event', postData);
      setSelectedTemplate(null);
      setShowTemplateView(false);
      route?.params?.makeChatAccepted?.(member?.chatId);
    }
  };

  const renderMessages = ({item, index}) => {
    return (
      <MsgView
        state={state}
        setState={setState}
        user={user}
        item={item}
        index={index}
        timezone={timezone}
        onMsgLongPress={() => openOptionModal(item)}
        openImageZommer={() => {
          if (!!item?.image) {
            setImageZommerVisiblity(item?.image);
          }
        }}
        playIconClick={playIconClick}
        stopPlayer={stopPlayer}
        templates={tamplates}
      />
    );
  };

  const onBackPress = () => {
    if (!!route?.params?.canGoBack) {
      navigation.goBack();
    } else {
      route?.params?.resetCountToZero?.(member?.chatId);
      navigation.navigate(routes.whtasappChatList, {
        refresh: isNewChat,
      });
    }
  };

  return (
    <RootView
      titleView={() => <UserView member={member} timezone={timezone} />}
      customBackPress={onBackPress}
      hideChatIcon>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS == 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS == 'ios' ? 100 + insets.top : 0}>
        <View style={{flex: 1}}>
          {/* Flatlist */}
          <View
            style={{
              flex: 1,
              borderTopColor: colors.lightText2,
              borderTopWidth: 1 / 3,
              marginHorizontal: -10,
              paddingHorizontal: 10,
            }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0}
              inverted={chat.length == 0 ? false : true}
              keyExtractor={item => item?._id}
              contentContainerStyle={[
                chat.length == 0 && {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
              data={chat}
              renderItem={renderMessages}
              ListEmptyComponent={
                loader ? (
                  <SimpleLoader size={50} />
                ) : (
                  <EmptyView label={'No Messages'} />
                )
              }
              ListFooterComponent={
                <View style={{height: 50, alignItems: 'center'}}>
                  {footLoader && <SimpleLoader />}
                </View>
              }
              onEndReached={loadMore}
            />
          </View>

          {/* Send Msg View */}
          {showTemplateView ? (
            <TemplateView
              onClearBtnPress={() => setSelectedTemplate(null)}
              onPress={() => setIsTemplateModalShown(true)}
              value={!!selectedTemplate ? selectedTemplate.name : ''}
              sendBtnPress={sendBtnPress}
            />
          ) : (
            <SendMsgView
              clearEdit={() => setEdit({id: '', msg: '', image: ''})}
              edit={edit}
              navigation={navigation}
              receiver={member}
            />
          )}
        </View>
      </KeyboardAvoidingView>

      <OptionModal
        isVisible={isTemplateModalShown}
        optionList={tamplates}
        closeModal={() => setIsTemplateModalShown(false)}
        onSelected={onSelectedTemplate}
        titleKey={'name'}
      />

      <ImageZoomer
        closeModal={() => setImageZommerVisiblity('')}
        url={isImageZoomerVisible}
        visible={!!isImageZoomerVisible}
      />
    </RootView>
  );
};

export default MessageList;

const msgOptionList = [
  {
    icon: icons.copyOulined,
    title: 'Copy',
    type: 'copy',
  },
  {
    icon: icons.edit,
    title: 'Add as Note',
    type: 'note',
  },
  {
    icon: icons.edit,
    title: 'Edit',
    type: 'edit',
  },
  {
    icon: icons.trash,
    title: 'Delete',
    type: 'delete',
  },
];
