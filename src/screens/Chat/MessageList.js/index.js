import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, StatusBar, Platform, TextInput, Image, TouchableHighlight, Pressable, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import UserImage from '../../../components/UserImage';
import MyText from '../../../components/MyText';
import { convertTimezone } from '../../../functions/convertTime';
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice';
import { useSelector } from 'react-redux';
import { colors } from '../../../utilities/colors';
import { MESSAGE_LIST_BY_CHAT_ID } from '../../../DAL';
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

let page = 0;
let canLoadMore = false;

const MessageList = ({ navigation, route }) => {
  const member = route?.params;
  const insets = useSafeAreaInsets();
  const timezone = useSelector(selectTimeZone);
  const { token, user } = useSelector(selectUser);
  const [chat, setChat] = useState([]);
  const [loader, setLoader] = useState(true);
  const [footLoader, setFooterLoader] = useState(false);
  const [opitonModal, setOptionModal] = useState({ isVisible: false, opt: "", item: null, optionList: [] });
  const [isImageZoomerVisible, setImageZommerVisiblity] = useState("");


  useEffect(() => {
    page = 0;
    canLoadMore = false;
    getMemberList()
  }, [])

  const loadMore = () => {
    if (canLoadMore) {
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
      let totalMessagesTillNow = res?.message.length + chat.length;
      page++;
      if (res?.count > totalMessagesTillNow) {
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }

      setChat([...chat, ...res?.message.reverse()])
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
      } else {
        options = msgOptionList.slice().filter(x => x.type == 'note' || x.type == 'copy');
      }
    } else {
      if (item.message_type == "image" && !!item?.image) {
        options = [...msgOptionList];
        if (!!item?.message == false) {
          options = options.slice().filter(x => x.type != 'copy');
        }
      } else if (item.message_type == "general") {
        options = msgOptionList.slice().filter(x => x.type != 'download');
      }
    }
    setOptionModal({ isVisible: true, item: item, opt: "", optionList: options })
  }


  const renderMessages = ({ item, index }) => {
    return (
      <MsgView
        user={user}
        item={item}
        index={index}
        timezone={timezone}
        onMsgLongPress={() => openOptionModal(item)}
        openImageZommer={() => { if (!!item?.image) { setImageZommerVisiblity(item?.image) } }}
      />
    )
  }


  return (
    <RootView
      titleView={() => <UserView member={member} timezone={timezone} />}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, }}
        behavior={Platform.OS == "ios" ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS == "ios" ? (100 + insets.top) : 0}>
        <View style={{ flex: 1 }}>

          {/* Flatlist */}
          <View style={{ flex: 1 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              inverted={chat.length == 0 ? false : true}
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
          <SendMsgView />


        </View>
      </KeyboardAvoidingView>


      {/* Modal Components */}
      <OptionModal
        isVisible={opitonModal.isVisible}
        optionList={opitonModal.optionList}
        closeModal={() => setOptionModal({ isVisible: false, opt: "", item: null })}
        onSelected={(opt) => setOptionModal({ ...opitonModal, opt: opt.type, isVisible: false, })}

      />


      <ImageZoomer
        closeModal={() => setImageZommerVisiblity("")}
        url={isImageZoomerVisible}
        visible={!!isImageZoomerVisible}

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


