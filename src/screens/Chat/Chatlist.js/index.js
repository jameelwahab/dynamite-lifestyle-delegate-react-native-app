import { View, Text, FlatList, StyleSheet, TouchableHighlight, Keyboard, SafeAreaView, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyLoader from '../../../components/MyLoader'
import MyText from '../../../components/MyText'
import { CHAT_LIST, PORTAL_LIST } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import UserImage from '../../../components/UserImage'
import { S3_URL } from '../../../utilities/constants'
import MyWebview from '../../../components/MyWebview'
import { colors } from '../../../utilities/colors'
import { icons } from '../../../utilities/icons'
import moment from 'moment'
import FAB from '../../../components/FAB'
import EmptyView from '../../../components/EmptyView'
import MyTouchableInput from '../../../components/MyTouchableInput'
import MyInputs from '../../../components/MyInputs'
import debounce from '../../../functions/debounce'
import Modal from 'react-native-modal'
import utilities from '../../../utilities'

const ChatList = ({ navigation }) => {
  const { token, user } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [portalList, setPortalList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [eventId, setEventId] = useState({ ...noneObj })
  const [isPortalModalVisible, setPortalModalVisiblity] = useState(false)


  const api_ChatList = async () => {
    setLoader(true)
    let res = await CHAT_LIST({ navigation, body: { event_id: eventId?._id, search_text: searchText }, token, page: 0 })
    if (res.code == 200) {
      setLoader(false);
      setChatList(res?.chat);
    } else {
      setLoader(false)
    }
  }

  const api_portalList = async () => {
    let res = await PORTAL_LIST({ navigation, token })
    if (res.code == 200) {
      setPortalList([{ ...noneObj }, ...res?.member_dynamite_event]);
    }
  }

  useEffect(() => {
    debounce(api_ChatList)
  }, [searchText, JSON.stringify(eventId)])

  useEffect(() => {
    api_portalList()
  }, [])


  const portalModal = () => {
    return (
      <Modal
        isVisible={isPortalModalVisible}
        onBackButtonPress={() => setPortalModalVisiblity(false)}
        onBackdropPress={() => setPortalModalVisiblity(false)}
        useNativeDriverForBackdrop={true}
        style={{ margin: 0 }}
      >
        <SafeAreaView style={{ marginTop: "auto", backgroundColor: colors.secondary, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <View style={{ height: utilities.screenHeight() * 0.8, }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15,borderBottomWidth:1/3,borderBottomColor:colors.lightText }}>
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
                      style={[{ paddingVertical:12, justifyContent: "center", paddingHorizontal: 10 }, {
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
      <View style={{ backgroundColor: colors.darkSecondary }}>
        <MyTouchableInput
          onPress={() => setPortalModalVisiblity(true)}
          noSpace={true}
          value={eventId.title}
          label='Portals' />
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
    let member = item.member.find(x => x?._id?._id != user._id);
    return (
      <TouchableHighlight
        onPress={() => { }}
        underlayColor={colors.secondary}
      >
        <View style={__style.itemRootView}>
          <UserImage
            image={member?.profile_image}
            name={member?.first_name}
          />

          <View style={__style.seondViewRow}>
            <View style={__style.headerView}>
              <View style={{ flex: 1 }}>
                <MyText fontSize={14} type='medium' >{member?.first_name + " " + member?.last_name}</MyText>
              </View>
              <MyText fontSize={10} color={colors.lightText} >{moment(item?.last_message_date_time).format("DD-MM-YYYY hh:mm A")}</MyText>
            </View>
            <View style={{ marginTop: 3, flexDirection: "row", alignItems: "center" }}>
              {item.message_type != "general" &&
                <View style={{ marginRight: 5 }}>
                  {item.message_type == "image" ? icons.camera(colors.white, 12) :
                    item.message_type == "audio" ? icons.mic(colors.white, 15) :
                      item.message_type == "video" ? icons.playCircle(colors.white, 18) : ""}
                </View>
              }

              <MyText fontSize={12} type='light' numberOfLines={1}>
                {!!item?.last_message ?
                  (item.last_message.replace(/<[^>]+>/g, '').replace(/\*/g, "").replace(/[\])}[{(]/g, " ").slice(0, 70)) :
                  item.message_type == "image" ? "Photo" :
                    item.message_type == 'audio' ? "Audio" :
                      item.message_type == 'video' ? "Video" : ""}

              </MyText>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  return (
    <RootView hideBackBottomButton title='Messages'>

      <View style={{ flex: 1 }}>
        <FlatList
          data={chatList}
          renderItem={renderChatList}
          ItemSeparatorComponent={<View style={__style.separotor} />}
          ListEmptyComponent={!loader && <EmptyView label={"No Chat"} />}
          ListHeaderComponent={headerView()}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          contentContainerStyle={{ paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {portalModal()}
      <FAB
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

const __style = StyleSheet.create({
  itemRootView: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 10,

  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seondViewRow: {
    flex: 1,
    marginHorizontal: 10
  },
  nameAndMsgView: {

  },

  separotor: {
    height: 1 / 3,
    backgroundColor: colors.lightText,
  }
})