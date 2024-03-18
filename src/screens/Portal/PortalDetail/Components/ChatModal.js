import { View, Text, StyleSheet, SafeAreaView, Pressable, FlatList, TouchableOpacity, TextInput, Platform } from 'react-native'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Modal from 'react-native-modal';
import MyText from '../../../../components/MyText';
import { colors } from '../../../../utilities/colors';
import { icons } from '../../../../utilities/icons';
import { GET_PORTAL_CHAT_LIST, GET_PORTAL_EXISTING_CHAT_BY_VIDEO_ID, UPLOAD_FILE_FOR_CHAT } from '../../../../DAL';
import MyLoader, { SimpleLoader } from '../../../../components/MyLoader';
import { load } from 'react-native-track-player/lib/trackPlayer';
import CollapsibleText from '../../../../components/CollapsibleText';
import UserImage from '../../../../components/UserImage';
import { convertTimezone } from '../../../../functions/convertTime';
import { S3_URL, dateTimeFormat } from '../../../../utilities/constants';
import { MenuButton } from '../../../../components/MyButton';
import MyImage from '../../../../components/MyImage';
import ImageZoomer from '../../../../components/ImageZoomer';
import OptionModal from '../../../../components/OptionModal';
import { fonts } from '../../../../utilities/fonts';
import ImageUploadModal from '../../../../components/ImageUploadModal';
import ResponsiveImage2 from '../../../../components/ResponsiveImage2';
import openUrl from '../../../../functions/openUrl';
import { useSelector } from 'react-redux';
import { selectSocket } from '../../../../redux/reducers/socketSlice';
import LikeModal from './LikeModal';
import showToast from '../../../../functions/showToast';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import Toast from 'react-native-toast-message';
import EmptyView from '../../../../components/EmptyView';


let page = 0;
let canLoadMore = false;

const ChatModal = ({ isVisible, closeModal, token, navigation, videoId, timezone, purchaseLink, linkImage, eventId, user }) => {
  const { socket } = useSelector(selectSocket);
  const likeModalRef = useRef();
  const chatListRef = useRef();
  const inputRef = useRef();
  const isLive = !!eventId == true;
  const [list, setList] = useState([]);
  const [pinList, setPinList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [imageZoomer, setImageZoomer] = useState("");
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    item: null,
  })
  const [text, setText] = useState("");
  const [image, setImage] = useState("")
  const [inputModalVisibility, setInputModalVisibility] = useState(false)
  const [imageModalVisibility, setImageModalVisibility] = useState(false)
  const [sendMsgLoader, setsendMsgLoader] = useState(false)
  const [confirmationsModal, setConfirmationsModal] = useState({
    isVisible: false,
    item: null,
    title: ""
  })
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [selectedCommentFor, setSelectedCommentFor] = useState("");
  const [showScroller, setShowScroller] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);

  useEffect(() => {
    return () => {
      onModalHide()
    }
  }, [])
  const socketEvents = () => {




    socket.emit("live_event_room", eventId);

    socket.on("live_event_message_receiver", async (data) => {
      console.log('On socket message receive', data)


      setList((list) => {
        if (!!data?.parent_message) {
          let index = list.findIndex(x => x._id == data?.parent_message);
          console.log(index, "index")
          if (index > -1) {
            if (!!list[index]?.replies) {
              list[index].replies = [...list[index]?.replies, data?.comment_id]
            } else {
              list[index].replies = [data?.comment_id]
            }
          }
        } else {
          list.unshift(data?.comment_id)
        }
        return [...list]
      })
    });

    socket.on("live_event_message_update_receiver", (data) => {
      console.log('On socket update receive', data)
      setList((list) => {
        if (!!data?.comment_id?.parent_message) {
          let parentIndex = list.findIndex(x => x._id == data?.comment_id?.parent_message);
          if (parentIndex != -1) {
            let replies = list[parentIndex].replies;
            let childIndex = replies.findIndex(x => x._id == data?.comment_id?._id)
            if (childIndex != -1) {
              list[parentIndex].replies.splice(childIndex, 1, {
                ...list[parentIndex].replies[childIndex],
                message: data?.comment_id?.message,
                file_url: data?.comment_id?.file_url,
              });
            }
          }

        }
        else {

          let index = list.findIndex(x => x?._id == data?.comment_id?._id);
          if (index > -1) {
            list.splice(index, 1, data?.comment_id);
          }
        }
        return [...list]
      })

      setPinList((list) => {
        if (!(!!data?.comment_id?.parent_message)) {
          let index = list.findIndex(x => x._id == data?.comment_id?._id);
          if (index > -1) {
            list.splice(index, 1, data?.comment_id);
          }
        }
        return [...list]
      })
    });

    socket.on("live_event_message_delete_receiver", (data) => {
      console.log('On socket delete message', data)
      setList((list) => {
        list.forEach((x, i) => {
          if (x._id == data.comment_id) {
            list.splice(i, 1);
          } else if (!!x?.replies && Array.isArray(x?.replies)) {
            x.replies.forEach((y, j) => {
              if (y._id == data.comment_id) {
                x.replies.splice(j, 1);
              }
            })
          }
        })


        return [...list]
      })

      setPinList((list) => {
        list.forEach((x, i) => {
          if (x._id == data.comment_id) {
            list.splice(i, 1);
          }
        })
        return [...list]
      })





    });

    socket.on("make_message_featured_unfeatured_receiver", (data) => {
      console.log("On make_message_featured_unfeatured_receiver --->\n", data)
      getLiveChatFromServer()
    });

    socket.on("live_event_message_like_receiver", (data) => {
      console.log("On live_event_message_like_receiver --->\n", data)
      setList(list => {
        if (!!data?.parent_message == false) {
          let index = list.findIndex(x => x._id == data.comment_id);
          if (index > -1) {
            if (user._id == data.member._id) {
              list[index].is_liked = data.action == "like" ? true : false;
            }
            if (data.action == "like") {
              list[index].like_count++;
            } else {
              list[index].like_count--;
            }
          }
        } else {
          let parentIndex = list.findIndex(x => x._id == data.parent_message);
          if (parentIndex > -1) {
            let childIndex = list[parentIndex].replies.findIndex(x => x._id == data.comment_id);
            if (childIndex > -1) {
              if (user._id == data.member._id) {
                list[parentIndex].replies[childIndex].is_liked = data.action == "like" ? true : false;
              }
              if (data.action == "like") {
                list[parentIndex].replies[childIndex].like_count++;
              } else {
                list[parentIndex].replies[childIndex].like_count--;
              }
            }
          }
        }

        return [...list]
      })
      setPinList((list) => {
        if (!!data?.parent_message == false) {
          let index = list.findIndex(x => x._id == data.comment_id);
          if (index > -1) {
            if (user._id == data.member._id) {
              list[index].is_liked = data.action == "like" ? true : false;
            }
            if (data.action == "like") {
              list[index].like_count++;
            } else {
              list[index].like_count--;
            }
          }
        }
        return [...list]
      })

    });


  }

  const offSocketEvents = () => {
    if (!!socket) {
      socket.off("live_event_message_receiver");
      socket.off("live_event_message_update_receiver");
      socket.off("live_event_message_delete_receiver");
      socket.off("make_message_featured_unfeatured_receiver");
      socket.off("live_event_message_like_receiver");
    }
  }

  const onSelectedOption = (opt) => {
    console.log(opt, "opt")
    let { item } = optionModal;
    setOptionModal({ isVisible: false, item: null });

    if (opt.type == "delete") {
      setTimeout(() => {
        setConfirmationsModal({
          isVisible: true,
          title: "Are you sure you want to delete this message?",
          item: item
        })
      }, 550);
    }
    else if (opt.type == "edit") {
      setSelectedMsg(item);
      setSelectedCommentFor("edit")
      setText(item?.message);
      setImage(item?.file_url);
      setTimeout(() => {
        openInputModal()
      }, 550);
    } else if (opt.type == "pin" || opt.type == "unpin") {
      pinUnpinComment(item)
    }
  }

  const onConfirmAgree = () => {
    let { item } = confirmationsModal;

    setConfirmationsModal({
      isVisible: false,
      title: "",
      item: null
    })

    setTimeout(() => {
      deleteComment(item?._id);
    }, 300);
  }

  const getLiveChatFromServer = async () => {

    let res = await GET_PORTAL_CHAT_LIST({ token, navigation, videoId });
    if (res.code == 200) {
      setList(res?.dynamite_event_category_video_chat.reverse());
      setPinList(res?.dynamite_event_category_video_featured_chat);
    }
    setLoader(false);
  }

  const getOldChatFromServer = async () => {
    let res = await GET_PORTAL_EXISTING_CHAT_BY_VIDEO_ID({ token, navigation, videoId, page: 0 });
    if (res.code == 200) {
      setList(page == 0 ? res?.dynamite_event_category_video_chat : [...list, ...res?.dynamite_event_category_video_chat]);
      setPinList(res?.dynamite_event_category_video_featured_chat);
      if (res.total_pages > page) {
        canLoadMore = true;
        page = page + 1;
      } else {
        canLoadMore = false;
      }



    }
    setFooterLoader(false);
    setLoader(false);
  }

  const loadMore = () => {
    if (!isLive && canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      getOldChatFromServer();
    }
  }

  const enableEocketEvents = () => {
    socketEvents()

    socket.on("disconnect", () => {
      offSocketEvents()
    })

    socket.on("connect", () => {
      socketEvents()
    })
  }

  const onModalShow = () => {
    setLoader(true);
    if (isLive) {
      getLiveChatFromServer()
      enableEocketEvents()
    } else {
      getOldChatFromServer()
    }
  }

  const onModalHide = () => {
    console.log("onModalHide")
    setList([]);
    setPinList([]);
    setLoader(false);
    setText("");
    setSelectedMsg(null);
    setImage("")
    offSocketEvents()
    setShowScroller(false)
  }

  const uploadImage = async () => {
    let fd = new FormData()
    fd.append("image", image);
    let res = await UPLOAD_FILE_FOR_CHAT({ token, navigation, file: fd });
    if (res.code === 200) {
      return res.image_path
    }
  }


  const deleteComment = (id) => {

    socket.emit("live_event_message_delete", {
      comment_id: id,
      event_id: eventId,
      action_by: "consultant"
    });

  }


  const likeChatComment = (item, isChild) => {
    console.log(item, "item");
    console.log(user, "user")
    let socketObj = {
      event_id: eventId,
      video_id: videoId,
      comment_id: item._id,
      member: {
        _id: user?._id,
        first_name: user?.first_name,
        last_name: user?.last_name,
        profile_image: !!user?.image?.thumbnail_1 ? user?.image?.thumbnail_1 : "",
      },
      action_by: "consultant"
    }
    if (isChild) {
      socketObj['parent_message'] = item.parent_message;
    }

    console.log("like Chat sent", socketObj)
    socket.emit("live_event_message_like", socketObj)
  }

  const pinUnpinComment = (comment) => {
    const event_id = eventId;

    socket.emit("make_message_featured_unfeatured", {
      comment_id: comment?._id,
      event_id,
      is_featured: !comment.is_featured,
      action_by: "consultant"
    });
  }

  const sendMsg = async () => {
    if (text.trim() === '') {
      showToast({ body: "Please write something to comment.", title: "Alert" })
      return;
    }
    setsendMsgLoader(true);

    let file_url = "";
    if (!!image.uri) {
      file_url = await uploadImage()
      if (!!file_url == false) {
        setsendMsgLoader(false);
        return
      }
    } else if (!!image) {
      file_url = image
    }


    let socketObj = {
      event_id: eventId,
      video_id: videoId,
      message: text.trim(),
      file_url,
      member: {
        _id: user?._id,
        first_name: user?.first_name,
        last_name: user?.last_name,
        profile_image: !!user?.image?.thumbnail_1 ? user?.image?.thumbnail_1 : "",
      },
      action_by: "consultant"
    }
    let socketEventString = "live_event_message";
    if (!!selectedMsg && selectedCommentFor == "edit") {
      socketEventString = "live_event_message_update";
      socketObj["comment_id"] = selectedMsg?._id;
    } else if (!!selectedMsg && selectedCommentFor == "reply") {
      socketObj.member.parent_message = selectedMsg?._id;
      socketObj.parent_message = selectedMsg?._id;
    }
    socket.emit(socketEventString, socketObj);
    console.log(socketEventString, socketObj)

    setsendMsgLoader(false);
    setText("");
    setImage("");
    setInputModalVisibility(false);
    setSelectedCommentFor("");
    setSelectedMsg(null)

  }


  const openInputModal = () => {
    setInputModalVisibility(true)
    setTimeout(() => {
      inputRef?.current?.focus()
    }, 300);
  }

  const filterOptions = (list) => {

    if (!!optionModal?.item?.parent_message) {
      return list.slice().filter(x => x.type != "pin" && x.type != "unpin")

    } else if (!!optionModal?.item && optionModal?.item?.is_featured) {
      return list.slice().filter(x => x.type != "pin")

    } else {
      return list.slice().filter(x => x.type != "unpin")

    }


  }



  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.find(x => x.index == 0)) {
      setShowScroller(false)
    } else {
      setShowScroller(true)
    }
  }, [])

  const InputModal = () => {
    return (
      <Modal
        isVisible={inputModalVisibility}
        onBackdropPress={() => setInputModalVisibility(false)}
        onBackButtonPress={() => setInputModalVisibility(false)}
        useNativeDriverForBackdrop={true}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={200}
        avoidKeyboard
        style={{ margin: 0 }}>

        <SafeAreaView style={{ marginTop: "auto", backgroundColor: colors.darkSecondary }}>
          {inputView(true)}

        </SafeAreaView>
        {inputModalVisibility && <Toast />}
      </Modal>)
  }

  const inputView = (forModal) => {
    return (
      <View style={__style.sendMsgView}>
        <View style={{ flexDirection: "row", alignItems: "flex-end", }}>
          {!!image &&
            <View style={{ width: 80, }}>
              <View style={__style.selectedImageView}>
                <MyImage
                  source={{ uri: !!image?.uri ? image?.uri : S3_URL + image }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
              <TouchableOpacity
                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                onPress={() => setImage("")}
                style={__style.removeImage}>
                {icons.crosss(colors.white, 18)}
              </TouchableOpacity>
            </View>
          }


          {!!selectedMsg &&
            <View
              style={__style.commentUpperViewOptions}>
              <MyText
                type='bold'
                color={colors.lightText2}
              >{selectedCommentFor == "edit" ?
                <Text>{"Editing"}</Text> :
                selectedCommentFor == "reply" ?
                  <Text style={{ fontFamily: fonts.regular }} >{"Replying to "}
                    <Text style={{ fontFamily: fonts.bold, }} >{selectedMsg?.member?.first_name}</Text>
                  </Text> : null}
                <Text>{"  •  "}</Text>
                <MyText
                  color={colors.white}
                  fontSize={15}
                  onPress={() => {
                    setSelectedMsg(null);
                    setText("");
                    setImage("")
                    setSelectedCommentFor("");
                    inputRef?.current?.blur()
                    setInputModalVisibility(false)
                  }}
                  type='bold'>{"Cancel"}</MyText></MyText>

            </View>}
        </View>
        <View style={__style.sendMsgViewTextWithButton}>



          <View style={__style.inputView}>
            <TouchableOpacity
              onPress={() => setImageModalVisibility(true)}
              style={__style.attachmentBtnView}>
              {icons.attachment(colors.primary, 17)}
            </TouchableOpacity>
            {forModal ?
              <TextInput
                style={__style.sendMsgTextView}
                placeholder={selectedCommentFor == "reply" ? 'Write a reply...*' : 'Write a comment...*'}
                placeholderTextColor={colors.lightGrey}
                multiline={true}
                selectionColor={colors.selection}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect={false}
                value={text}
                onChangeText={(val) => setText(val)}
                keyboardAppearance={"dark"}
                textAlignVertical="center"
                ref={inputRef}
              /> :
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={openInputModal}>
                <TextInput
                  pointerEvents="none"
                  style={__style.sendMsgTextView}
                  placeholder={selectedCommentFor == "reply" ? 'Write a reply...*' : 'Write a comment...*'}
                  placeholderTextColor={colors.lightGrey}
                  multiline={true}
                  selectionColor={colors.selection}
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={false}
                  value={text}
                  keyboardAppearance={"dark"}
                  textAlignVertical="center"
                />
              </TouchableOpacity>
            }
            {/* <View style={__style.sendMsgTextView}>
            <MyText color={colors.lightGrey} >Write a comment...*</MyText>
          </View> */}
          </View>

          <TouchableOpacity
            onPress={sendMsg}
            style={__style.sendMsgBtnView}>
            {sendMsgLoader ?
              <SimpleLoader />
              : icons.send(colors.primary, 20)}
          </TouchableOpacity>

          <ImageUploadModal
            closeModal={() => setImageModalVisibility(false)}
            onImagePicked={(image) => setImage(image)}
            isVisible={imageModalVisibility}

          />
        </View>
      </View>
    )
  }

  const commentView = (item, index, isChild, pinned = false) => {
    return (
      <View
        key={item?._id}>
        <View style={[__style.commentView, { marginLeft: isChild ? "10%" : undefined }]}>
          <View style={__style.profileView}>
            <UserImage
              image={item?.member?.profile_image}
              name={item?.member?.first_name}
              backgroundTransparent={true}
              size={30}
            />

            <View style={__style.profileNameView}>
              <View style={{ flexDirection: "row" }}>
                <MyText type='medium'>{item?.member?.first_name + " " + item?.member?.last_name + "  "}</MyText>
                {pinned ? icons.pin(colors.white) : ""}
              </View>
              <MyText fontSize={10} color={colors.lightGrey} type='medium' >{convertTimezone(item?.createdAt, timezone).format(dateTimeFormat.dateTime)}</MyText>
            </View>
            {isLive ?
              <MenuButton
                size={20}
                onPress={() => setOptionModal({ isVisible: true, item: item })}
              /> :
              item?.like_count > 0 ?
                <TouchableOpacity
                  onPress={() => likeModalRef?.current?.openLikeModal?.(item?._id, "event")}
                  style={[__style.actionsBtn]}>
                  {icons.heartFilled(colors.heart, 18)}
                  <MyText> {item?.like_count}</MyText>
                </TouchableOpacity> :
                null
            }
          </View>
          <CollapsibleText>{item?.message}</CollapsibleText>
          {!!item.file_url &&
            <Pressable
              onPress={() => setImageZoomer(item.file_url)}
              style={__style.image}>
              <MyImage
                source={{ uri: S3_URL + item.file_url }}
                style={{ height: "100%", width: "100%" }}
              />
            </Pressable>}

          {isLive && <View style={[__style.actionsRow, { marginTop: 10 }]}>

            <View style={[__style.actionsRow, { flex: 1 }]}>
              <TouchableOpacity
                onPress={() => likeChatComment(item, isChild)}
                style={__style.actionsBtn}>
                {item?.is_liked ? icons.heartFilled(colors.heart, 18) : icons.heartUnfilled(colors.primary, 18)}
                <MyText>
                  {item?.is_liked ? " Liked" : " Like"}
                </MyText>
              </TouchableOpacity>
              {!isChild && !item?.is_featured &&
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCommentFor("reply");
                    setSelectedMsg(item);
                    openInputModal()
                  }}
                  style={[__style.actionsBtn, { marginLeft: 30 }]}>
                  {icons.comment(colors.primary, 18)}
                  <MyText> Reply</MyText>
                </TouchableOpacity>}
            </View>
            {item?.like_count > 0 &&
              <TouchableOpacity
                onPress={() => likeModalRef?.current?.openLikeModal?.(item?._id, "event")}
                style={[__style.actionsBtn]}>
                {icons.heartFilled(colors.heart, 18)}
                <MyText> {item?.like_count}</MyText>
              </TouchableOpacity>}
          </View>}
        </View>
        {item?.replies && item?.replies.map((item2, index2) => commentView(item2, index2, true))}
      </View>
    )
  }
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={400}
      hasBackdrop={false}
      coverScreen={false}
      onModalShow={onModalShow}
      onModalHide={onModalHide}
      hideModalContentWhileAnimating={true}
      style={{ margin: 0 }}>
      <SafeAreaView style={__style.root}>
        <View style={__style.innerRoot}>
          <View style={__style.header}>
            <MyText fontSize={20} type='bold' >
              {isLive ? "Live Chat" : "Chat"}
            </MyText>
            <Pressable
              onPress={closeModal}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              {icons.crosssWithCircle(colors.white, 30)}
            </Pressable>
          </View>

          <View style={{ flex: 1 }}>
            {!!purchaseLink ?
              <TouchableOpacity onPress={() => openUrl(S3_URL + purchaseLink)}>
                <ResponsiveImage2 uri={S3_URL + linkImage} />
              </TouchableOpacity> :
              pinList.length > 0 &&
              <View style={__style.pinnedView}>
                <FlatList
                  nestedScrollEnabled={true}
                  data={pinList}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => commentView(item, index, false, true)}

                />
                <View style={{ height: 1, backgroundColor: colors.golden, }} />
              </View>

            }

            <View style={{ flex: 1 }}>
              <FlatList
                contentContainerStyle={{ paddingVertical: 10 }}
                data={list}
                renderItem={({ item, index }) => commentView(item, index, false)}
                inverted={isLive ? true : false}
                ref={chatListRef}
                onViewableItemsChanged={onViewableItemsChanged}
                onEndReached={loadMore}
                ListEmptyComponent={!loader && !isLive && <EmptyView />}
                ListFooterComponent={<View style={{ height: 50 }}>
                  {footerLoader && <SimpleLoader />}
                </View>}


              />
              {showScroller && isLive &&
                <Pressable onPress={() => {
                  chatListRef?.current?.scrollToIndex({
                    animated: true,
                    index: 0
                  })
                }}
                  style={__style.scrollToBottomView}>
                  <MyText color={colors.black} >Scroll to Bottom </MyText>
                  {icons.downArrow(colors.black, 18)}
                </Pressable>}
            </View>

            {isLive ? inputView(false) : undefined}

          </View>


          <ImageZoomer
            closeModal={() => setImageZoomer("")}
            url={imageZoomer}
            visible={!!imageZoomer}

          />

          <OptionModal
            isVisible={optionModal?.isVisible}
            onSelected={onSelectedOption}
            closeModal={() => setOptionModal({ isVisible: false, item: null })}
            optionList={filterOptions(OptionList)}
          />

          {InputModal()}

          <LikeModal
            ref={likeModalRef}
            navigation={navigation}
            token={token}
            timezone={timezone}
          />

          <ConfirmationModal
            closeModal={() => setConfirmationsModal({ isVisible: false, item: null, title: "" })}
            isVisible={confirmationsModal?.isVisible}
            onAgree={onConfirmAgree}
            title={confirmationsModal?.title}
          />

          <MyLoader enable={loader} />
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default ChatModal;

const __style = StyleSheet.create({
  pinnedView: { maxHeight: 130, borderBottomWidth: 1, borderBottomColor: colors.primary },
  root: {
    backgroundColor: colors.secondary,
    marginTop: "auto",
    flex: 0.68,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

  },
  innerRoot: {
    flex: 1,
    // paddingHorizontal: 10,
    // paddingTop: 10,

  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.secondary,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    height: 50,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  commentView: {
    backgroundColor: colors.secondarySelect,
    marginTop: 10,
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 10
  },
  profileView: {
    flexDirection: "row",
    paddingVertical: 5
  },
  profileNameView: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "center"
  },
  actionsRow: {

    flexDirection: "row",

  },
  actionsBtn: {
    flexDirection: "row",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 5
  },
  sendMsgView: {
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  sendMsgViewTextWithButton: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  inputView: {
    minHeight: 40,
    maxHeight: 70,
    backgroundColor: colors.secondarySelect,
    borderRadius: 20,
    flex: 1,
    flexDirection: "row",

  },
  sendMsgBtnView: {
    height: 40,
    width: 40,
    backgroundColor: colors.lightPrimary3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40 / 2,
    marginLeft: 5,
    marginBottom: 5
  },
  attachmentBtnView: {
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 45 / 2,
  },
  sendMsgTextView: {
    flex: 1,
    fontFamily: fonts.regular,
    paddingTop: 12,
    color: colors.white
  },
  selectedImageView: {
    width: 80,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10
  },
  removeImage: {
    backgroundColor: colors.delete,
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20 / 2,
    position: "absolute",
    top: -8,
    right: -8
  },
  commentUpperViewOptions: { paddingHorizontal: 10, flex: 1, paddingBottom: 10, },
  scrollToBottomView: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 20,
    position: "absolute",
    bottom: 10
  }
})

const OptionList = [
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
  {
    icon: icons.pin,
    title: "Pin",
    type: "pin"
  },
  {
    icon: icons.pin,
    title: "Unpin",
    type: "unpin"
  },
]
