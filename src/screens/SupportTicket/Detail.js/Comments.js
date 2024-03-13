import { View, Text, Pressable, TouchableOpacity, ScrollView, Image, TouchableHighlight, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { MyButton } from '../../../components/MyButton'
import MyText from '../../../components/MyText'
import { icons } from '../../../utilities/icons'
import UserImage from '../../../components/UserImage'
import { colors } from '../../../utilities/colors'
import moment from 'moment'
import MyWebview from '../../../components/MyWebview'
import downloadImage from '../../../functions/downloadImage'
import MyImage from '../../../components/MyImage'
import { S3_URL } from '../../../utilities/constants'
import Editor from '../../../components/Editor'
import { useNavigation } from '@react-navigation/native'
import routes from '../../../navigation/routes'
import OptionModal from '../../../components/OptionModal'
import { DELETE_TICKET_COMMENT } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import ConfirmationModal from '../../../components/ConfirmationModal'
import showToast from '../../../functions/showToast'
import ImageZoomer from '../../../components/ImageZoomer'
import EmptyView from '../../../components/EmptyView'
import { convertTimezone } from '../../../functions/convertTime'
const Comments = ({ commentsList, ticket, user, autoMessages, addMessage, listRoute, timezone, isMine }) => {
  const { token } = useSelector(selectUser)
  const navigation = useNavigation()
  console.log(listRoute, "listRoute")
  const [modalImage, setModalImage] = useState("")
  const [comments, setComments] = useState(commentsList)
  const [msgOptionModal, setMsgOptionModal] = useState({ isVisible: false, selectedItem: null })
  const [isConfirmationModalVisible, setConfirmationModalVisibility] = useState(false)


  const actionOfMsgOptions = (selectedOpt) => {
    if (selectedOpt.type == "delete") {
      // deleteMessage(msgOptionModal.selectedItem);

      setMsgOptionModal({ ...msgOptionModal, isVisible: false })
      setTimeout(() => {
        setConfirmationModalVisibility(true)
      }, 400);
    } else if (selectedOpt.type == "edit") {
      navigation.navigate(routes.supportTicketReply, {
        autoResonderMsgs: autoMessages,
        ticketId: ticket?._id,
        msg: msgOptionModal.selectedItem,
        isMine,
        updateMsg
      });
      setMsgOptionModal({ isVisible: false, selectedItem: null })
    }
  }


  const updateMsg = (msg) => {
    console.log(msg, "updateMsg")
    let index = comments.findIndex(x => x._id === msg._id);
    if (index > -1) {
      comments.splice(index, 1, msg);
      setComments([...comments]);
    }
  }

  const api_deleteMessage = async (msg) => {
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

  const deleteMessage = async () => {
    console.log(msgOptionModal.selectedItem, "msgOptionModal.selectedItem")
    await api_deleteMessage(msgOptionModal.selectedItem)
    setMsgOptionModal({ selectedItem: null, isVisible: false })
    setConfirmationModalVisibility(false);


  }


  useEffect(() => {
    setComments(commentsList)
  }, [commentsList])


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
            <MyText fontSize={10} color={colors.lightText} type='medium' >{convertTimezone(item.updatedAt, timezone).fromNow()}</MyText>
          </View>
          {((item?.action_user_info?.action_id == user?._id) || isMine) &&
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
              style={{
                backgroundColor: colors.secondaryVariant, height: 200, borderRadius: 10, marginBottom: 15,
                shadowColor: "#FFF",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,

                elevation: 2,
              }}>
              <Pressable onPress={() => setModalImage(x?.thumbnail_1)}>
                <MyImage source={{ uri: S3_URL + x?.thumbnail_1 }} style={{ height: 150, width: "100%" }}
                  imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, }} />
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


  const headerView = () => {
    return (
      <View style={{ marginHorizontal: 50, paddingTop: 10 }}>
        <MyButton
          onPress={() =>
            navigation.navigate(routes.supportTicketReply, {
              autoResonderMsgs: autoMessages,
              ticketId: ticket?._id,
              isMine,
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

  const headerView1 = () => {
    return (
      <View style={{}}>
        <Editor height={100} />
      </View>
    )
  }

  const filterTheOptions = (options) => {
    if (listRoute == "solved" || listRoute == "trash") {
      if (!!isMine) {
        return options.slice().filter(x => x.type != "edit");
      } else {
        if (msgOptionModal?.selectedItem?.action_user_info?.action_id == user?._id) {
          return options.slice().filter(x => x.type != "edit");
        }

      }
    }
    else return options

  }


  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{ paddingVertical: 20 }}
          inverted={comments.length == 0 ? false : true}
          data={comments}
          renderItem={renderMsg}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() =>
            <EmptyView label={"No comments"} />
          }
        // ListHeaderComponent={!!ticket && headerView}

        />
      </View>
      <View >
        {!!ticket && (listRoute != 'solved' && listRoute != "trash") && headerView()}
      </View>

      <OptionModal
        optionList={filterTheOptions(msgOptionList)}
        closeModal={() => setMsgOptionModal({ isVisible: false, selectedItem: null })}
        onSelected={(opt) => actionOfMsgOptions(opt)}
        isVisible={msgOptionModal?.isVisible} />

      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        title={"Are you sure you want to delete this message?"}
        onAgree={deleteMessage}
        closeModal={() => setConfirmationModalVisibility(false)}
      />

      <ImageZoomer
        closeModal={() => setModalImage("")}
        visible={!!modalImage}
        url={modalImage}

      />
    </View>
  )
}

export default Comments

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