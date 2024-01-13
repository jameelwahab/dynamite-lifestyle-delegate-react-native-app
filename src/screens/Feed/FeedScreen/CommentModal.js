import { View, Text, SafeAreaView, StyleSheet, FlatList, Pressable, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import Modal from 'react-native-modal';
import utilities from '../../../utilities';
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import CollapsibleText from '../../../components/CollapsibleText';
import UserImage from '../../../components/UserImage';
import { convertTimezone } from '../../../functions/convertTime';
import { icons } from '../../../utilities/icons';
import { fonts } from '../../../utilities/fonts';
import EmptyView from '../../../components/EmptyView';
import MyLoader, { SimpleLoader } from '../../../components/MyLoader';
import Toast from 'react-native-toast-message';
import FooterLoader from '../../../components/FooterLoader';
import OptionModal from '../../../components/OptionModal';
import showToast from '../../../functions/showToast';
import { ADD_COMMENT, COMMENT_LIKE_ACTIONS, DELETE_COMMENT, EDIT_COMMENT } from '../../../DAL';
import ConfirmationModal from '../../../components/ConfirmationModal';
import LikeModalForComments from './LikeModalForComments';

const CommentModal = ({
  isVisible,
  closeModal,
  comments = [],
  timezone,
  user,
  loader,
  focus,
  showLikesOfComments,
  onEndReached,
  footerLoader,
  token,
  navigation,
  feedId,
  setComments,
  updateFeedItemsSpecificField
}) => {
  console.log(feedId, "feedId")
  const cmtTextInputRef = useRef();
  const likeModalRef = useRef();
  const [commentText, setCommentText] = useState("");
  const [isLoading, setLoader] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedCommentFor, setSelectedCommentFor] = useState("");
  const [confirmation, setConfirmation] = useState({
    title: "",
    selectedItem: null,
    isVisible: false,
  })
  const [options, setOptions] = useState({
    isVisible: false,
    selectedItem: null,
  });

  const onAgreePress = () => {
    deleteCommentFromServer(confirmation?.selectedItem?._id);
    setConfirmation({
      isVisible: false,
      selectedItem: null,
      text: "",
    })
  }

  const onSelectOption = (action) => {
    let item = options?.selectedItem
    setOptions({ isVisible: false, selectedItem: null })
    if (action?.type == "edit") {
      setSelectedComment(item);
      setSelectedCommentFor("edit")
      setCommentText(item?.message);
      cmtTextInputRef?.current?.focus()
    } else if (action?.type == "delete") {
      setTimeout(() => {
        setConfirmation({
          title: "Are you sure you want to delete this comment?",
          isVisible: true,
          selectedItem: item
        })
      }, 500);
    }

  }

  const onLikePress = async (commentForlike, index) => {
    console.log(commentForlike, "commentForlike")
    if (!!commentForlike?.parent_comment) {
      setComments((obj) => {
        let parentIndex = obj.list.findIndex(cmt => cmt?._id == commentForlike?.parent_comment);
        let newObj = {
          ...obj.list[parentIndex].child_comment[index],
          is_liked: !commentForlike?.is_liked,
        };
        obj.list[parentIndex].child_comment.splice(index, 1, newObj);
        return { ...obj };
      })
    }
    else {
      setComments((obj) => {
        let newObj = {
          ...obj.list[index],
          is_liked: !commentForlike?.is_liked,
        };
        obj.list.splice(index, 1, newObj);
        return { ...obj };
      })
    }

    let res = await COMMENT_LIKE_ACTIONS({
      token, navigation, body: {
        action: commentForlike?.is_liked ? "commentunlike" : "commentlike",
        comment: commentForlike?._id,
        feed: feedId
      }
    });
    if (res?.code == 200) {
      if (!!commentForlike?.parent_comment) {
        setComments((obj) => {
          let parentIndex = obj.list.findIndex(cmt => cmt?._id == commentForlike?.parent_comment);
          let newObj = {
            ...obj.list[parentIndex].child_comment[index],
            is_liked: res?.action_response?.is_liked,
            like_count: res?.action_response?.comment_like_count
          };
          obj.list[parentIndex].child_comment.splice(index, 1, newObj);
          return { ...obj };
        })
      } else {
        setComments((obj) => {
          let newObj = {
            ...obj.list[index],
            is_liked: res?.action_response?.is_liked,
            like_count: res?.action_response?.comment_like_count
          };
          obj.list.splice(index, 1, newObj);
          return { ...obj };
        })
      }
    } else {

    }
  }

  const deleteCommentFromServer = async (commentId) => {
    console.log(commentId, "commentId")
    setLoader(true);
    let res = await DELETE_COMMENT({ token, navigation, commentId: commentId })
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
      setLoader(false);
      setCommentText("");
      setComments(obj => {
        let index = obj.list.findIndex(comment => comment._id == commentId);
        if (index > -1) {
          obj.list.splice(index, 1);
        } else {
          let newComment = res?.action_response?.comment;
          let index2 = obj.list.findIndex(comment => comment._id == newComment?._id);
          if (index2 > -1) {
            obj.list[index2].child_comment = newComment.child_comment
          }
        }
        console.log(obj, "obj")
        return { ...obj };
      })
      setSelectedComment(null);
      updateFeedItemsSpecificField?.(res?.action_response?.feed?._id, { comment_count: res?.action_response?.feed?.comment_count })
    } else {
      setLoader(false);
    }
  }

  const updateComentToServer = async () => {
    setLoader(true);
    let fd = new FormData();
    fd.append("message", commentText.trim());
    let res = await EDIT_COMMENT({ token, navigation, commentId: selectedComment?._id, formData: fd })
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
      setLoader(false);
      setCommentText("");
      let editedComment = res?.action_response?.comment;


      if (!!editedComment?.parent_comment) {

        setComments(obj => {
          let index = obj.list.findIndex(comment => comment._id == editedComment?.parent_comment);
          if (index > -1) {
            let childCommentIndex = obj.list[index].child_comment.findIndex(childComment => childComment?._id == editedComment?._id);
            if (childCommentIndex > -1)
              obj.list[index].child_comment.splice(childCommentIndex, 1, editedComment);
          }
          return { ...obj };
        })

      } else {
        setComments(obj => {
          let index = obj.list.findIndex(comment => comment._id == editedComment?._id);
          if (index > -1) {
            obj.list.splice(index, 1, editedComment);
          }
          return { ...obj };
        })
      }

      setSelectedComment(null);
      setSelectedCommentFor("")
    } else {
      setLoader(false);
    }
  }

  const addComentToServer = async () => {
    setLoader(true);

    let body;
    body = { feed: feedId, message: commentText.trim() };

    if (!!selectedComment) {
      body = {
        ...body,
        parent_comment: selectedComment?._id
      }
    }
    console.log(!!selectedComment, 'check')
    console.log(body, "body", selectedComment)


    let res = await ADD_COMMENT({ token, navigation, body })
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
      setLoader(false);
      if (!!res?.action_response?.parent_comment) {
        setComments(obj => {
          let index = obj.list.findIndex(obj => obj._id == res?.action_response?.parent_comment);
          if (index > -1) {
            obj.list[index].child_comment.unshift(res?.action_response?.comment)
          }
          return { ...obj }
        })
      } else {
        setComments(obj => ({
          ...obj,
          list: [res?.action_response?.comment, ...obj.list]
        }))
      }
      setCommentText("");
      setSelectedComment(null);
      setSelectedCommentFor("");
      updateFeedItemsSpecificField?.(res?.action_response?.feed?._id, { comment_count: res?.action_response?.feed?.comment_count })
    } else {
      setLoader(false);
    }
  }

  const sendBtnClick = () => {
    if (commentText.trim() == "") {
      showToast({ body: "Please enter comment", })
      return
    }

    if (!!selectedComment && selectedCommentFor == "edit") {
      updateComentToServer()
    } else {
      addComentToServer()
    }

  }

  const commentView = (item, index, isChild) => {
    return (
      <View key={item?._id}>
        <View style={[__style.commentView, { marginLeft: isChild ? "10%" : undefined, backgroundColor: selectedComment?._id == item?._id ? colors.lightPrimary2 : colors.secondarySelect }]}>
          <View style={__style.profiletView}>
            <UserImage
              image={item?.user_info_action_for?.profile_image}
              name={item?.user_info_action_for?.name}
              size={30}
              backgroundTransparent
            />

            <View style={__style.profiletNameView}>
              <MyText fontSize={13} type='bold' >{item?.user_info_action_for?.name}</MyText>
              <View style={{ marginTop: 3 }}>
                <MyText color={colors.lightText2} fontSize={10}>{convertTimezone(item?.comment_date_time, timezone).format("DD MMM YYYY [at] hh:mm A")}</MyText>
              </View>
            </View>
            {user?._id == item?.user_info_action_for?.action_id &&
              <TouchableOpacity
                onPress={() => setOptions({ isVisible: true, selectedItem: item })}
                style={__style.menuIconBtn}>
                {icons.threeDots(colors.primary, 12)}
              </TouchableOpacity>}
            <View>

            </View>
          </View>
          <CollapsibleText>{item?.message}</CollapsibleText>

          <View style={[__style.commentActionView, { marginTop: 5 }]}>
            <View style={[__style.commentActionView, { flex: 1 }]}>
              <TouchableOpacity
                onPress={() => onLikePress(item, index,)}
                style={__style.actionBtnView}>
                <MyText color={item?.is_liked ? colors.primary : colors.text} fontSize={13} type='medium' >{item?.is_liked ? "Liked" : "Like"}</MyText>
              </TouchableOpacity>
              {!isChild &&
                <TouchableOpacity
                  onPress={() => {
                    setSelectedComment(item);
                    setSelectedCommentFor("reply");
                    cmtTextInputRef?.current?.focus();
                  }}
                  style={[__style.actionBtnView, { marginLeft: 10 }]}>
                  <MyText type='medium' color={colors.text} fontSize={13} >{"Reply"}</MyText>
                </TouchableOpacity>}
            </View>
            {item?.like_count > 0 &&
              <Pressable
                onPress={() => {
                  // console.log(likeModalRef?.current, "likeModalRef?.current")
                  likeModalRef?.current?.openLikeModal(item?._id)
                }}
                style={__style.commentActionView}>
                <View style={__style.likeView}>
                  {icons.heartFilled(colors.heart, 15)}
                </View>
                <View style={[__style.likeView, { marginLeft: -2 }]}>
                  <MyText>{item?.like_count}</MyText>
                </View>
              </Pressable>}

          </View>
        </View>
        {!!item?.child_comment && Array.isArray(item?.child_comment) && item?.child_comment.map((item2, index2) => commentView(item2, index2, true))}

      </View>
    )
  }

  const resetStates = () => {
    setCommentText("");
    setSelectedComment(null);
    setSelectedCommentFor("")

  }

  const commentModal = () => (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      hasBackdrop={false}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500}
      animationOutTiming={500}
      avoidKeyboard={true}
      onModalHide={resetStates}
      hideModalContentWhileAnimating={true}
      style={{ margin: 0, }}>
      <SafeAreaView style={{ flex: 1 }} >
        <View style={__style.rootView}>
          <View style={__style.headingView}>
            <View>
              <MyText fontSize={18} type='medium' >Comments</MyText>
              {/* <MyText color={colors.lightText} fontSize={12}>Select your country from list below</MyText> */}
            </View>
            <Pressable onPress={closeModal}>
              {icons.crosssWithCircle()}
            </Pressable>
          </View>

          <View style={{ flex: 1 }}>
            <View pointerEvents={isLoading ? "none" : "auto"} style={{ flex: 1 }}>
              <FlatList
                data={comments}
                keyboardShouldPersistTaps="always"
                keyExtractor={(item) => item?._id}
                renderItem={({ item, index }) => commentView(item, index, false)}
                ListEmptyComponent={!loader && <EmptyView label={"No comment exist"} />}
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
              />
            </View>
            <View style={__style.shadow}>
              <View>
                {!!selectedComment &&
                  <View
                    style={{ paddingHorizontal: 10, paddingTop: 8, marginBottom: -5 }}>
                    <MyText
                      type='bold'
                      color={colors.lightText2}
                    >{selectedCommentFor == "edit" ?
                      <Text>{"Editing"}</Text> :
                      selectedCommentFor == "reply" ?
                        <Text style={{ fontFamily: fonts.regular }} >{"Replying to "}
                          <Text style={{ fontFamily: fonts.bold, }} >{selectedComment?.user_info_action_for?.name}</Text>
                        </Text> : null}
                      <Text>{"  •  "}</Text>
                      <MyText
                        color={colors.white}
                        fontSize={15}
                        onPress={() => {
                          setSelectedComment(null);
                          setCommentText("");
                          setSelectedCommentFor("");
                          cmtTextInputRef?.current?.blur()
                        }}
                        type='bold'>{"cancel"}</MyText></MyText>

                  </View>}



              </View>
              <View style={__style.inputRootView}>

                <View style={__style.textInputView}>
                  <TextInput
                    ref={cmtTextInputRef}
                    style={__style.input}
                    selectionColor={colors.selection}
                    multiline={true}
                    value={commentText}
                    onChangeText={(text) => setCommentText(text)}
                    textAlignVertical="top"
                    placeholder='Write a comment...'
                    placeholderTextColor={colors.placeholder}
                    keyboardAppearance="dark"
                    autoFocus={focus}
                    autoCorrect={false}
                    autoCapitalize='none'
                    autoComplete="off"
                    editable={!isLoading}
                  />
                </View>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={sendBtnClick}
                  style={__style.btnView}>
                  {isLoading ?
                    <ActivityIndicator color={"white"} /> :
                    icons.send(colors.white, 18)}
                </TouchableOpacity>
              </View>
            </View>
            <MyLoader enable={loader} />
          </View>
        </View>

        {isVisible && <Toast />}
        <OptionModal
          optionList={commentsOptionList}
          isVisible={options.isVisible}
          closeModal={() => setOptions({ isVisible: false, selectedItem: null })}
          onSelected={onSelectOption}
        />

        <ConfirmationModal
          isVisible={confirmation?.isVisible}
          onAgree={onAgreePress}
          title={confirmation?.title}
          closeModal={() => setConfirmation({ isVisible: false, title: "", selectedItem: null })}
        />

        <LikeModalForComments
          ref={likeModalRef}
          navigation={navigation}
          token={token}
          timezone={timezone}
        />
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: colors.secondaryVariant }} />
    </Modal>
  )

  return (
    <View>
      {commentModal()}
    </View>
  )
}

export default CommentModal;

const commentsOptionList = [{
  icon: icons.edit,
  title: "Edit",
  type: "edit"

},
{
  icon: icons.trash,
  title: "Delete",
  type: "delete"
}]

const __style = StyleSheet.create({
  rootView: {
    marginTop: "auto",
    // height: fle,
    // width: "100%",
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.secondaryVariant,
  },
  headingView: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText
  },
  commentView: {
    backgroundColor: colors.secondarySelect,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 5,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 5

  },
  profiletView: {
    flexDirection: "row",
    alignItems: "center"
  },
  profiletNameView: {
    marginLeft: 10,
    flex: 1
  },
  actionBtnView: {
    paddingRight: 10,
    paddingVertical: 5
  },

  menuIconBtn: {
    height: 22,
    width: 22,
    backgroundColor: colors.lightPrimary3,
    borderRadius: 22 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  commentActionView: {
    flexDirection: "row",
    alignItems: "center"
  },

  inputRootView: { flexDirection: "row", alignItems: "flex-end", paddingVertical: 10 },
  textInputView: {
    minHeight: 40,
    backgroundColor: colors.secondary,
    marginHorizontal: 10,
    borderRadius: 10,
    maxHeight: 80,
    padding: 5,
    flex: 1
  },
  input: {
    color: colors.white,
    fontFamily: fonts.regular,
    margin: 0,
    padding: 0,
  },
  btnView: {
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    marginRight: 10,
    marginBottom: 2.5
  },
  likeView: {
    borderWidth: 0.5, borderColor: colors.lightPrimary2, borderRadius: 999, height: 20, width: 20, alignItems: 'center', justifyContent: "center"
  },
  shadow: {
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: colors.secondaryVariant
  }
})