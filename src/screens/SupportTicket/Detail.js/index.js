import { View, Text, FlatList, Image, Pressable, TouchableHighlight, Alert } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { icons } from '../../../utilities/icons'
import { colors } from '../../../utilities/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import OptionModal from '../../../components/OptionModal'
import { CALLBACK_TYPE } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture'
import { MyButton } from '../../../components/MyButton'
import routes from '../../../navigation/routes'
import Collapsible from 'react-native-collapsible';
import { fonts } from '../../../utilities/fonts'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'
import { DELETE_TICKET_COMMENT, SUPPORT_TCIKET_DETAIL } from '../../../DAL'
import UserImage from '../../../components/UserImage'
import moment from 'moment'
import MyWebview, { MyWebView4 } from '../../../components/MyWebview'
import { S3_URL } from '../../../utilities/constants'
import downloadImage from '../../../functions/downloadImage'
import ImageZoomer from '../../../components/ImageZoomer'
import showToast from '../../../functions/showToast'

let autoMessages = [];
const TicketDetail = ({ navigation, route }) => {
  const flatlistRef = useRef();
  const { _id } = route?.params?.ticket;
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const { token, user } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);


  const [msgOptionModal, setMsgOptionModal] = useState({ isVisible: false, selectedItem: null })
  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false)
  const [modalImage, setModalImage] = useState("")


  const api_ticketDetail = async () => {
    let res = await SUPPORT_TCIKET_DETAIL({
      token, navigation,
      ticketId: _id
    });
    if (res.code == 200) {
      autoMessages = res.auto_responder_message;
      setLoader(false)
      setTicket(res?.support_ticket)
      setComments(res?.support_ticket?.comment.reverse())
    } else {
      setLoader(false)
    }
  }

  const addMessage = (msg) => {
    comments.unshift(msg);
    setComments([...comments]);
    // flatlistRef?.current?.scrollToIndex({ index: 0, animated: true })
  }

  const updateMsg = (msg) => {
    console.log(msg, "updateMsg")
    let index = comments.findIndex(x => x._id === msg._id);
    if (index > -1) {
      comments.splice(index, 1);
      setComments([...comments]);
    }
  }

  const actionOfMsgOptions = (selectedOpt) => {
    if (selectedOpt.type == "delete") {
      deleteMessage(msgOptionModal.selectedItem);
      setMsgOptionModal({ isVisible: false, selectedItem: null })
    } else if (selectedOpt.type == "edit") {
      navigation.navigate(routes.supportTicketReply, {
        autoResonderMsgs: autoMessages,
        ticketId: ticket?._id,
        msg: msgOptionModal.selectedItem,

        updateMsg
      });
      setMsgOptionModal({ isVisible: false, selectedItem: null })
    }
  }

  const deleteMessage = (msg) => {
    const api_deleteMessage = async () => {
      let res = await DELETE_TICKET_COMMENT({ token, navigation, commentId: msg._id });
      if (res.code == 200) {
        showToast({ title: res.message, type: "success" })
        let index = comments.findIndex(x => x._id === msg._id);
        if (index > -1) {
          comments.splice(index, 1);
          setComments([...comments]);
        }
      }
    }

    Alert.alert("Are you sure you want to delete this message?", "", [
      { text: "No" },
      { text: "Yes", onPress: api_deleteMessage }
    ]);


  }

  useEffect(() => {
    autoMessages = [];
    api_ticketDetail()
  }, []);





  const renderMsg = useCallback(({ item, index }) => {
    return (
      <View style={{ padding: 10, marginBottom: 10, }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <UserImage
            image={item?.action_user_info?.profile_image}
            name={item?.action_user_info?.action_name}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <MyText type='medium'  >{item?.action_user_info?.action_name}</MyText>
            <MyText fontSize={10} color={colors.lightText} type='medium' >{moment(item.updatedAt).fromNow()}</MyText>
          </View>
          {item?.action_user_info?.action_id == user?._id &&
            <TouchableHighlight
              underlayColor={colors.secondary}
              onPress={() => setMsgOptionModal({ isVisible: true, selectedItem: item })}
              style={{ height: 35, width: 35, alignItems: "center", justifyContent: "center", borderRadius: 35 / 2 }}>
              {icons.threeDots()}
            </TouchableHighlight>}
        </View>

        <View style={{ marginTop: 10 }}>
          <MyWebview
            html={item?.message}
          />
        </View>


        <View style={{ marginTop: 10 }}>
          {!!item?.comment_image && item?.comment_image.map((x, i) => (
            <View

              key={x?.thumbnail_1}
              style={{ backgroundColor: colors.secondaryVariant, height: 200, borderRadius: 10, overflow: "hidden", marginBottom: 15 }}>
              <Pressable onPress={() => setModalImage(x?.thumbnail_1)}>
                <Image source={{ uri: S3_URL + x?.thumbnail_1 }} style={{ height: 150, width: "100%" }} />
              </Pressable>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ height: "100%", aspectRatio: 1, alignItems: "center", justifyContent: "center" }}>
                  <Image opacity={0.7} source={icons.photo} style={{ height: 25, width: 25 }} />
                </View>

                <View style={{ height: "100%", aspectRatio: 1, alignItems: "center", justifyContent: "center" }}>
                  <TouchableOpacity
                    onPress={() => downloadImage(S3_URL + x?.thumbnail_1)}
                    style={{ height: 35, width: 35, alignItems: "center", justifyContent: "center", backgroundColor: colors.lightPrimary3, borderRadius: 35 / 2 }}>
                    {icons.download()}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    )

  }, [JSON.stringify(comments)])

  const footerView = () => {
    return (
      <View>
        <View style={{ marginBottom: 10 }}>
          <MyButton
            invert
            textStyle={{ fontFamily: fonts.regular, textTransform: "capitalize" }}
            title={"Internal Notes"} />
        </View>

        <View style={{ marginBottom: 10, backgroundColor: colors.secondary, padding: 10, borderRadius: 10 }}>

          {!!ticket?.subject &&
            <MyText type='medium' fontSize={18} color={colors.primary}>
              {ticket?.subject}
            </MyText>}

          {!!ticket?.description &&
            <View style={{ marginTop: 5 }}>
              <MyText type='medium' fontSize={12} color={colors.lightText2}>
                {ticket?.description}
              </MyText>
            </View>}

          <View style={{ marginTop: 5 }}>
            <MyText fontSize={12} color={colors.primary}>
              {"Created Date : "}<Text style={{ color: colors.lightText2 }} > {moment(ticket?.createdAt).format("DD-MM-YYYY hh:mm A")}</Text>
            </MyText>
            <MyText fontSize={12} color={colors.primary}>
              {"Responded Time : "}<Text style={{ color: colors.lightText2 }}>  {moment(ticket?.updatedAt).format("DD-MM-YYYY hh:mm A")}</Text>
            </MyText>
          </View>
        </View>
      </View>
    )
  }

  const headerView = () => {
    return (
      <View style={{ marginHorizontal: 50 }}>
        <MyButton
          onPress={() =>
            navigation.navigate(routes.supportTicketReply, {
              autoResonderMsgs: autoMessages,
              ticketId: ticket?._id,
              addMessage
            })}
          style={{ borderRadius: 100 }}
          textStyle={{}}
          leftIcon={icons.reply}
          title='Reply'
          invert={true} />
      </View>
    )
  }

  const topView = () => {
    if (!!ticket) {
      return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
          <View style={{ flex: 1 }}>
            <MyText>{`${ticket?.member?.first_name} ${ticket?.member?.last_name} (${ticket?.member?.email})`}</MyText>
          </View>
          <TouchableOpacity
            onPress={() => setIsOptionModalVisible(true)}
            style={{ height: 30, width: 30, borderRadius: 30 / 2, backgroundColor: colors.lightPrimary3, alignItems: "center", justifyContent: "center" }}>
            {icons.threeDots()}
          </TouchableOpacity>
        </View>
      )
    }
  }




  return (
    <RootView titleView={topView}  >
      <View style={{ flex: 1 }}>
        {!!ticket && footerView()}
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatlistRef}
            contentContainerStyle={{ paddingVertical: 20 }}
            inverted={true}
            data={comments}

            renderItem={renderMsg}
            keyExtractor={(item) => item._id}
            // stickyHeaderIndices={[0]}
            // stickyHeaderHiddenOnScroll={true}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={!!ticket && headerView}
          // ListFooterComponent={!!ticket && footerView}
          // ItemSeparatorComponent={<View style={{ height: 0.1, backgroundColor: colors.lightText2 }} />}
          />
        </View>
      </View>
      <MyLoader enable={loader} />

      <OptionModal
        optionList={msgOptionList}
        closeModal={() => setMsgOptionModal({ isVisible: false, selectedItem: null })}
        onSelected={(opt) => actionOfMsgOptions(opt)}
        isVisible={msgOptionModal?.isVisible} />

      <OptionModal
        optionList={OptionList}
        closeModal={() => setIsOptionModalVisible(false)}
        onSelected={() => setIsOptionModalVisible(false)}
        isVisible={isOptionModalVisible} />

      <ImageZoomer
        closeModal={() => setModalImage("")}
        visible={modalImage}
        url={modalImage}

      />
    </RootView>
  )
}

export default TicketDetail;

const msgOptionList = [{
  icon: icons.edit,
  title: "Edit",
  type: "edit"

},
{
  icon: icons.trash,
  title: "Delete",
  type: "delete"
}]

const OptionList = [{
  icon: icons.tick,
  title: "Mark Resolve"
},
{
  icon: icons.copy,
  title: "Copy Password"
}]

