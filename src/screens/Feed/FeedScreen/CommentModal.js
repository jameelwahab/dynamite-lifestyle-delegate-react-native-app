import { View, Text, SafeAreaView, StyleSheet, FlatList, Pressable, TouchableOpacity, TextInput, ActivityIndicator, Platform, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Modal from 'react-native-modal';
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
import { ADD_COMMENT, ADD_COMMENT_V2, COMMENT_LIKE_ACTIONS, DELETE_COMMENT, EDIT_COMMENT, EDIT_COMMENT_V2, GET_CHILD_COMMENT_LIST, GET_DELEGATES_LIST_FROM_SERVER_FOR_MENTION_V1 } from '../../../DAL';
import ConfirmationModal from '../../../components/ConfirmationModal';
import LikeModalForComments from './LikeModalForComments';
import ImageUploadModal from '../../../components/ImageUploadModal';
import MyImage from '../../../components/MyImage';
import { S3_URL } from '../../../utilities/constants';
import ImageZoomer from '../../../components/ImageZoomer';
import Collapsible from 'react-native-collapsible';
import MemberView from '../../../components/MemberView';
import FeedText from '../../../components/FeedText';
import breakReference from '../../../functions/breakReference';
import numFormatter from '../../../functions/numFormatter';


let commentCursor = {
  start: 0,
  end: 0
};


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
  updateFeedItemsSpecificField,
  socketEmittersForAction,
  isCosmos,
  isNoteMainFeed,
  eventId,
  feedCreatedFor,
  onCommentMessagePress
}) => {
  console.log(user, "user")
  const cmtTextInputRef = useRef();
  const likeModalRef = useRef();
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [imageModalVisibility, setImageModalVisibility] = useState(false)
  const [isLoading, setLoader] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedReplyComment, setSelectedReplyComment] = useState(null);
  const [selectedCommentFor, setSelectedCommentFor] = useState("");
  const [imageForZoom, setImageForZoom] = useState("")
  const [confirmation, setConfirmation] = useState({
    title: "",
    selectedItem: null,
    isVisible: false,
  })
  const [options, setOptions] = useState({
    isVisible: false,
    selectedItem: null,
  });

  const [delegateList, setDelegateList] = useState([]);
  const [isMentionListVisible, setIsMentionListVisible] = useState(false);
  const [isMentionListLoading, setMentionListLoading] = useState(false);
  const [mentionList, setMentionList] = useState([]);
  const [_at_index, set_at_index] = useState(-1);
  const [childCommentLoader, setChildCommentLoader] = useState({});

  const onMessagePress = (item) => {
    onCommentMessagePress?.(item)
  }

  useEffect(() => {

    let text = commentText;
    if (text[commentCursor?.start] == "@" || text == "@") {
      // let _at_index = !!commentCursor?.start ? commentCursor?.start : 0;
      let _at_index = !!text[commentCursor?.start] ? commentCursor?.start : 0;
      set_at_index(_at_index)
      setIsMentionListVisible(true);
      getTheDelegateListFromServer(extractSubstring(text, _at_index))
    }

    if ((text[_at_index] != "@") && isMentionListVisible == true) {
      setIsMentionListVisible(false);
      set_at_index(-1)
    }
    if (isMentionListVisible) {
      getTheDelegateListFromServer(extractSubstring(text))
    }

    if (text.trim() == "" && mentionList.length > 0) {
      setMentionList([])
    }

  }, [commentText])

  useEffect(() => {
    if (isMentionListVisible == false) {
      getTheDelegateListFromServer("");
    }
  }, [isMentionListVisible])


  function extractSubstring(str, sIndex) {

    let startIndex;

    if (!!sIndex) {
      startIndex = sIndex
    } else {
      startIndex = _at_index + 1;
    }
    let endIndex = commentCursor?.start;
    string = str.substring(startIndex, (endIndex + 1));
    if (string[0] == '@') {
      string = string.substring(1);
    }
    return string
  }

  function replaceSubstring(str, startIndex, endIndex, replacement) {
    if (startIndex > str.length - 1) {
      return str; // If indices are out of bounds or invalid, return the original string
    }
    let str1 = str.substring(0, startIndex) + replacement;
    if (endIndex != -1) {
      str1 += str.substring(endIndex);
    }
    return str1
  }


  const replaceString = (str, index, replacement) => {
    // if (index > str.length - 1) {
    //   return str;
    // }
    // let endINdex = getSubstringToSpaceEndIndex(str, _at_index);
    let endINdex = commentCursor.start
    return replaceSubstring(str + " ", index, endINdex, replacement)

  }



  const chnageTheIndexes = (text, oldText) => {
    let cursorPosition = commentCursor?.start;

    if (mentionList.length > 0) {
      let diff = text.length - oldText.length;
      let list = [...mentionList]
      let index = list.findIndex(x => cursorPosition > x?.offset && cursorPosition < (x?.offset + x?.length));
      if (index > -1) {
        list.splice(index, 1)
      }
      list.forEach((item, index) => {
        if (cursorPosition <= item?.offset) {
          item.offset = item?.offset + diff
        }
      })
      setMentionList([...list])
    }

  }


  const textHandler = (text) => {
    if (text.trim() == "" || text.trim().length == 1 && mentionList.length > 0) {
      setMentionList([])
    }
    chnageTheIndexes(text, commentText)
    setCommentText(text)

  }

  const onPressOnMentions = (obj) => {
    let index = _at_index < 0 ? 0 : _at_index;
    let diff = extractSubstring(commentText, index).length;
    mentionList.forEach((item) => {
      if (index < item.offset) {
        item.offset = item.offset + (`${obj?.first_name} ${obj?.last_name}`.trim().length - diff)
      }
    })

    let arr = [...mentionList, {
      ...obj,
      offset: index,
      length: `${obj?.first_name} ${obj?.last_name}`.trim().length
    }];
    arr.sort((a, b) => a.offset - b.offset);

    setMentionList(arr);

    setIsMentionListVisible(false);
    setDelegateList([]);
    setCommentText(replaceString(commentText, index, `${obj?.first_name} ${obj?.last_name}`.trim()));
    set_at_index(-1)
  }

  const replaceAndHighlight = str => {
    let parts = [];
    let lastIndex = 0;


    mentionList.forEach(user => {
      let startIndex = user?.offset;
      let endIndex = user?.offset + user?.length
      if (lastIndex < startIndex) {
        parts.push(str.slice(lastIndex, startIndex));
      }
      parts.push(<Text style={__style.mentionUserText} >{str.substring(startIndex, endIndex)}</Text>);
      lastIndex = endIndex;
    });

    if (lastIndex < str.length) {
      parts.push(str.slice(lastIndex));
    }

    return parts
  }

  const getTheDelegateListFromServer = async (text) => {
    setMentionListLoading(true);
    console.log(feedCreatedFor, "feedCreatedFor")
    let res = await GET_DELEGATES_LIST_FROM_SERVER_FOR_MENTION_V1({
      navigation, token, data: {
        search_text: text,
        community_levels: !isNoteMainFeed ? [feedCreatedFor] : undefined,
        event_id: isNoteMainFeed ? eventId : undefined,
        list_type: isCosmos ? "the_cosmos" : "the_source",
      }
    });
    setMentionListLoading(false);
    if (res.code == 200) {
      setDelegateList(res?.users)
      if (res?.users > 0) {
        setIsMentionListVisible(true)
      }
    }
  }



  useEffect(() => {
    setLoader(false)
  }, [isVisible])

  const onAgreePress = () => {
    deleteCommentFromServer(confirmation?.selectedItem);
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
      if (item?.image?.thumbnail_1) {
        setCommentImage(item?.image?.thumbnail_1)
      }
      setMentionList(!!item?.mentioned_users ? breakReference(item?.mentioned_users) : [])
      setSelectedCommentFor("edit")
      setCommentText(item?.message + " ");
      setTimeout(() => {
        cmtTextInputRef?.current?.focus()
      }, 500);
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
      socketEmittersForAction(res?.action_response)
      // if (!!commentForlike?.parent_comment) {
      //   setComments((obj) => {
      //     let parentIndex = obj.list.findIndex(cmt => cmt?._id == commentForlike?.parent_comment);
      //     let newObj = {
      //       ...obj.list[parentIndex].child_comment[index],
      //       is_liked: res?.action_response?.is_liked,
      //       like_count: res?.action_response?.comment_like_count
      //     };
      //     obj.list[parentIndex].child_comment.splice(index, 1, newObj);
      //     return { ...obj };
      //   })
      // } else {
      //   setComments((obj) => {
      //     let newObj = {
      //       ...obj.list[index],
      //       is_liked: res?.action_response?.is_liked,
      //       like_count: res?.action_response?.comment_like_count
      //     };
      //     obj.list.splice(index, 1, newObj);
      //     return { ...obj };
      //   })
      // }
    } else {

    }
  }

  const deleteCommentFromServer = async (comment) => {

    setLoader(true);
    let res = await DELETE_COMMENT({ token, navigation, commentId: comment?._id })
    if (res.code == 200) {
      socketEmittersForAction(res?.action_response,
        !!comment?.parent_comment ? "delete_comment_reply" : "delete_comment",
        { comment: comment?._id }
      )
      showToast({ title: res?.message, type: "success" });
      setLoader(false);
      setCommentText("");
      // setComments(obj => {
      //   let index = obj.list.findIndex(comment => comment._id == commentId);
      //   if (index > -1) {
      //     obj.list.splice(index, 1);
      //   } else {
      //     let newComment = res?.action_response?.comment;
      //     let index2 = obj.list.findIndex(comment => comment._id == newComment?._id);
      //     if (index2 > -1) {
      //       obj.list[index2].child_comment = newComment.child_comment
      //     }
      //   }
      //   console.log(obj, "obj")
      //   return { ...obj };
      // })
      setSelectedComment(null);
      setSelectedReplyComment(null);
      // updateFeedItemsSpecificField?.(res?.action_response?.feed?._id, { comment_count: res?.action_response?.feed?.comment_count })
    } else {
      setLoader(false);
    }
  }

  const updateComentToServer = async () => {
    setLoader(true);
    let fd = new FormData();
    fd.append("message", commentText);
    fd.append("mentioned_users", JSON.stringify(mentionList));
    if (!!commentImage && !!commentImage?.uri) {
      fd.append("image", commentImage);
    } else if (!!selectedComment?.image?.thumbnail_1 && !!commentImage == false) {
      fd.append("is_image_deleted", true);
    }
    let res = await EDIT_COMMENT_V2({ token, navigation, commentId: selectedComment?._id, formData: fd })
    if (res.code == 200) {

      // if (!!res.action_response) {
      //   let socketData = {
      //     action: "feed_mentioned",
      //     feed_id: res.action_response?.feed._id,
      //     token: token,
      //     creator_id: user?._id,
      //     action_by: user?._id,
      //     action_response: res.action_response,
      //   };
      //   socket.emit("comment_mention_user_event_trigger", socketData);
      // }
      socketEmittersForAction(res?.action_response,
        !!selectedComment?.parent_comment ? "edit_comment_reply" : "edit_comment",
        { comment: selectedComment?._id }
      )
      showToast({ title: res?.message, type: "success" });
      setLoader(false);
      setCommentText("");
      setCommentImage(null)
      set_at_index(-1);
      setMentionListLoading(false);
      setIsMentionListVisible(false)
      setMentionList([])
      commentCursor = {
        start: 0,
        end: 0
      }
      let editedComment = res?.action_response?.comment;


      // if (!!editedComment?.parent_comment) {

      //   setComments(obj => {
      //     let index = obj.list.findIndex(comment => comment._id == editedComment?.parent_comment);
      //     if (index > -1) {
      //       let childCommentIndex = obj.list[index].child_comment.findIndex(childComment => childComment?._id == editedComment?._id);
      //       if (childCommentIndex > -1)
      //         obj.list[index].child_comment.splice(childCommentIndex, 1, editedComment);
      //     }
      //     return { ...obj };
      //   })

      // } else {
      //   setComments(obj => {
      //     let index = obj.list.findIndex(comment => comment._id == editedComment?._id);
      //     if (index > -1) {
      //       obj.list.splice(index, 1, editedComment);
      //     }
      //     return { ...obj };
      //   })
      // }

      setSelectedComment(null);
      setSelectedCommentFor("")
    } else {
      setLoader(false);
    }
  }

  const addComentToServer = async () => {
    setLoader(true);

    // let body;
    // body = { feed: feedId, message: commentText.trim() };

    // if (!!selectedComment) {
    //   body = {
    //     ...body,
    //     parent_comment: selectedComment?._id
    //   }
    // }
    // console.log(!!selectedComment, 'check')
    // console.log(body, "body", selectedComment)
    let action = "add_comment";
    let formData = new FormData();
    formData.append("feed", feedId);
    formData.append("message", commentText);
    formData.append("mentioned_users", JSON.stringify(mentionList));
    if (!!selectedComment) {
      formData.append("parent_comment", selectedComment?._id);
      action = "add_comment_reply"
    }
    if (!!commentImage) {
      formData.append("image", commentImage);
    }

    let res = await ADD_COMMENT_V2({ token, navigation, formData })
    if (res.code == 200) {
      if (!!selectedComment) {
        socketEmittersForAction(res?.action_response, action)
      } else {
        socketEmittersForAction(res?.action_response, action, {

        })
      }
      showToast({ title: res?.message, type: "success" });
      setLoader(false);
      // if (!!res?.action_response?.parent_comment) {
      //   setComments(obj => {
      //     let index = obj.list.findIndex(obj => obj._id == res?.action_response?.parent_comment);
      //     if (index > -1) {
      //       obj.list[index].child_comment.unshift(res?.action_response?.comment)
      //     }
      //     return { ...obj }
      //   })
      // } else {
      //   setComments(obj => ({
      //     ...obj,
      //     list: [res?.action_response?.comment, ...obj.list]
      //   }))
      // }
      setCommentText("");
      setCommentImage(null);
      setSelectedComment(null);
      setSelectedReplyComment(null);
      setSelectedCommentFor("");
      set_at_index(-1);
      setMentionListLoading(false);
      setIsMentionListVisible(false)
      setMentionList([])
      commentCursor = {
        start: 0,
        end: 0
      }
      // updateFeedItemsSpecificField?.(res?.action_response?.feed?._id, { comment_count: res?.action_response?.feed?.comment_count })
    } else {
      setLoader(false);
    }
  }

  const sendBtnClick = () => {
    if (!!commentText.trim() == false && !!commentImage == false) {
      showToast({ body: "Please enter comment or select image to send", })
      return
    }

    if (!!selectedComment && selectedCommentFor == "edit") {
      updateComentToServer()
    } else {
      addComentToServer()
    }

  }

  const getReplyingName = () => {
    let rUser = null
    if (selectedReplyComment) {
      rUser = selectedReplyComment?.user_info_action_for
    } else {
      rUser = selectedComment?.user_info_action_for
    }
    if (rUser?.action_id == user?._id) {
      return "Yourself"
    } else {
      return rUser?.name
    }
  }

  const onChildCommentPress = (comment, parentComment) => {
    let mUser = comment?.user_info_action_for;

    if (mUser?.action_id != user?._id) {
      let obj = {
        first_name: mUser.name.substring(0, mUser.name.indexOf(' ')),
        last_name: mUser.name.substring(mUser.name.indexOf(' ') + 1),
        _id: mUser?.action_id,
      }
      if (!!feedCreatedFor) {
        obj['community_level'] = feedCreatedFor
      }
      if (mUser?.profile_image) {
        obj['profile_image'] = mUser?.profile_image
      }

      console.log(obj, "user obj")
      while (mentionList.length > 0) {
        mentionList.pop()
      }

      onPressOnMentions(obj)
    } else {
      setMentionList([])
      setCommentText("")
    }
  }
  const viewMoreReplies = async (parentComment) => {
    let loadedChildComments = parentComment.child_comment.length;
    let totalChildComments = parentComment?.child_comments_count;
    let childCommnetPage = 0;
    if (totalChildComments - loadedChildComments) {
      let remainder = loadedChildComments % 10;
      if (remainder == 0) {
        childCommnetPage = Math.ceil(loadedChildComments / 10);
      }
    }

    setChildCommentLoader((val) => ({
      ...val,
      [parentComment?._id]: true
    }))

    let res = await GET_CHILD_COMMENT_LIST({
      token, navigation,
      page: childCommnetPage,
      feedId: feedId,
      parentCommentId: parentComment?._id
    })
    if (res.code == 200) {
      setComments((obj) => {
        obj.list.map(comment => {
          if (comment._id == parentComment?._id) {
            comment["child_comment"] = childCommnetPage == 0 ? [...res?.comment] : [...comment?.child_comment, ...res?.comment];
            // comment["child_comments_count"] = comment.child_comment.length + res.comment.length
          }
          console.log(obj, "obj")
        })
        return { ...obj }
      })
      delete childCommentLoader[parentComment?._id]
      setChildCommentLoader({ ...childCommentLoader })
    } else {
      Alert.alert("Error", res?.message)
      delete childCommentLoader[parentComment?._id]
      setChildCommentLoader({ ...childCommentLoader })
    }
  }


  const commentView = (item, index, isChild, parentComment) => {

    let childCommentCount = 0;
    let childCommentArray = [];
    let lastChildIndex = parentComment?.child_comment.length > 0 ? parentComment?.child_comment.length - 1 : 0;
    if (isChild) {
      childCommentCount = parentComment?.child_comments_count
      childCommentArray = parentComment?.child_comment
    } else {
      childCommentCount = item?.child_comments_count
      childCommentArray = item?.child_comment
    }

    return (
      <View key={item?._id}>
        <View style={[__style.commentView, {
          marginLeft: isChild ? "10%" : undefined, backgroundColor:
            ((!!selectedReplyComment == true && selectedReplyComment?._id == item?._id) || (!!selectedReplyComment == false && selectedComment?._id == item?._id)) ?
              colors.lightPrimary2 : colors.secondarySelect
        }]}>
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

            {((user?._id == item?.user_info_action_for?.action_id) || (!isCosmos && !isNoteMainFeed && user?.is_super_delegate)) &&
              <TouchableOpacity
                onPress={() => setOptions({ isVisible: true, selectedItem: item })}
                style={__style.menuIconBtn}>
                {icons.threeDots(colors.primary, 12)}
              </TouchableOpacity>}
            <View>

            </View>
          </View>
          {!!item?.message &&
            <View style={{ marginTop: 5 }}>
              <FeedText list={!!item?.mentioned_users ? breakReference(item?.mentioned_users) : []} text={item?.message} />
            </View>
          }

          {!!item?.image?.thumbnail_1 &&
            <Pressable
              onPress={() => setImageForZoom(item?.image?.thumbnail_1)}
              style={[__style.selectedCommentImageView, { marginLeft: 0, marginBottom: 5 }]}>
              <MyImage
                source={{ uri: S3_URL + item?.image?.thumbnail_1 }}
                style={{ height: '100%', width: '100%' }}
              />
            </Pressable>}

          <View style={[__style.commentActionView, { marginTop: 5, }]}>
            <View style={[__style.commentActionView,]}>
              <TouchableOpacity
                onPress={() => onLikePress(item, index,)}
                style={__style.actionBtnView}>
                <MyText color={item?.is_liked ? colors.primary : colors.text} fontSize={13} type='medium' >{item?.is_liked ? "Liked" : "Like"}</MyText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (isChild) {
                    setCommentImage(null)
                    // setCommentText("")
                    // setMentionList([])
                    setSelectedComment(parentComment);
                    setSelectedReplyComment(item)
                    setSelectedCommentFor("reply");
                    onChildCommentPress(item, parentComment);
                    cmtTextInputRef?.current?.focus();
                  } else {
                    setSelectedComment(item);
                    setSelectedReplyComment(null)
                    setCommentImage(null)
                    setCommentText("");
                    setMentionList([])
                    setSelectedCommentFor("reply");
                    cmtTextInputRef?.current?.focus();
                  }
                }
                }
                style={[__style.actionBtnView, { marginLeft: 10 }]}>
                <MyText type='medium' color={colors.text} fontSize={13} >{"Reply"}</MyText>
              </TouchableOpacity>
            </View>
            {item?.like_count > 0 &&
              <Pressable
                onPress={() => {
                  likeModalRef?.current?.openLikeModal(item?._id)
                }}
                style={__style.commentActionView}>
                <View style={__style.likeView}>
                  {icons.heartFilled(colors.heart, 15)}
                </View>
                <View style={[__style.likeView, { marginLeft: 2 }]}>
                  <MyText>{numFormatter(item?.like_count, 1)}</MyText>
                </View>
              </Pressable>}




            {childCommentCount > 0 && ((childCommentArray.length - childCommentCount) < 0) && ((!isChild && childCommentArray.length <= 0) || (isChild && (lastChildIndex == index))) &&
              <>
                {childCommentLoader[isChild ? parentComment?._id : item?._id] ?
                  <SimpleLoader size={20} /> :
                  <Pressable
                    onPress={() => viewMoreReplies(isChild ? parentComment : item)}
                    style={__style.commentActionView}>
                    <View style={[__style.likeView]}>
                      <MyText fontSize={12} underlined color={colors.primary} >{isChild ? `View More Replies` : `View ${numFormatter(childCommentCount - childCommentArray.length, 1)} Replies`}</MyText>
                    </View>
                  </Pressable>}
              </>}
          </View>
        </View>
        {!!item?.child_comment && Array.isArray(item?.child_comment) && item?.child_comment.map((item2, index2) => commentView(item2, index2, true, item))}

      </View>
    )
  }

  const resetStates = () => {
    setCommentText("");
    setSelectedComment(null);
    setSelectedReplyComment(null);
    setSelectedCommentFor("");
    setCommentImage(null)
    setDelegateList([])
    setIsMentionListVisible(false);
    setMentionListLoading(false);
    setMentionList([])
    set_at_index(-1)
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
      onModalShow={() => {
        if (focus && Platform.OS == "android") {
          setTimeout(() => {
            cmtTextInputRef?.current?.focus()
          }, 1000);
        }
      }}
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
                renderItem={({ item, index }) => commentView(item, index, false, null)}
                ListEmptyComponent={!loader && <EmptyView label={"No comment exist"} />}
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
              />
            </View>
            <View style={__style.shadow}>

              <Collapsible collapsed={!isMentionListVisible} >
                <View style={{ maxHeight: 120, minHeight: 70 }}>
                  {delegateList.length > 0 ?
                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      contentContainerStyle={{ padding: 10 }}>
                      {delegateList.map((item) =>
                        <TouchableOpacity
                          onPress={() => onPressOnMentions(item)}
                          style={{ paddingVertical: 4 }}>
                          <MemberView
                            secondText={!isCosmos && !isNoteMainFeed ? ` (${item?.community_level})` : ""}
                            size={30}
                            titleSize={12}
                            member={item}
                            customImage={item?.image?.thumbnail_1}
                            hideEmail />
                        </TouchableOpacity>)}
                    </ScrollView>
                    : isMentionListLoading &&
                    <View style={{ alignItems: "center", justifyContent: "center", height: 100 }}>
                      <SimpleLoader size={50} />
                    </View>}
                </View>
              </Collapsible>

              <View style={__style.commentUpperView}>

                {!!commentImage &&
                  <Pressable
                    onPress={() => setImageForZoom(!!commentImage?.uri ? commentImage?.uri : commentImage)}>
                    <View style={__style.selectedCommentImageView}>

                      <MyImage
                        source={{
                          uri: !!commentImage?.uri ? commentImage?.uri : S3_URL + commentImage
                        }}
                        style={{ width: "100%", height: "100%", }}
                      />
                    </View>
                    <Pressable
                      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                      onPress={() => setCommentImage(null)}
                      style={__style.removeImageBtnView}>
                      {icons.crosss()}
                    </Pressable>
                  </Pressable>}

                {!!selectedComment &&
                  <View
                    style={__style.commentUpperViewOptions}>
                    <MyText
                      type='bold'
                      color={colors.lightText2}
                    >{selectedCommentFor == "edit" ?
                      <Text>{"Editing"}</Text> :
                      selectedCommentFor == "reply" ?
                        <Text style={{ fontFamily: fonts.regular }} >{"Replying to "}
                          <Text style={{ fontFamily: fonts.bold, }} >{getReplyingName()}</Text>
                        </Text> : null}
                      <Text>{"  •  "}</Text>
                      <MyText
                        color={colors.white}
                        fontSize={15}
                        onPress={() => {
                          setSelectedComment(null);
                          setSelectedReplyComment(null);
                          setCommentText("");
                          setCommentImage(null)
                          setSelectedCommentFor("");
                          cmtTextInputRef?.current?.blur()
                        }}
                        type='bold'>{"Cancel"}</MyText></MyText>

                  </View>}


              </View>


              <View style={__style.inputRootView}>


                <View style={__style.textInputView}>
                  <TouchableOpacity
                    onPress={() => setImageModalVisibility(true)}
                    style={__style.addImageBtn}>
                    {icons.addPciture()}
                  </TouchableOpacity>
                  <TextInput
                    ref={cmtTextInputRef}
                    style={__style.input}
                    selectionColor={colors.selection}
                    cursorColor={colors.white}
                    multiline={true}
                    // value={commentText}
                    // onChangeText={(text) => setCommentText(text)}
                    onChangeText={textHandler}
                    textAlignVertical="center"
                    placeholder='Write a comment...'
                    placeholderTextColor={colors.placeholder}
                    keyboardAppearance="dark"
                    autoFocus={Platform.OS == "ios" ? focus : false}
                    focusable={true}
                    autoCorrect={false}
                    autoCapitalize='none'
                    autoComplete="off"
                    editable={!isLoading}
                    onSelectionChange={(e) => {
                      commentCursor = e.nativeEvent.selection
                    }}
                  >
                    <Text style={[{
                      color: colors.white,
                      fontFamily: fonts.regular,
                      includeFontPadding: false
                    }]} >
                      {replaceAndHighlight(commentText, mentionList)}
                    </Text>
                  </TextInput>
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
          user={user}
          onMessagePress={onMessagePress}
        />

        <ImageUploadModal
          closeModal={() => setImageModalVisibility(false)}
          onImagePicked={(image) => setCommentImage(image)}
          isVisible={imageModalVisibility}
        />

        <ImageZoomer
          visible={!!imageForZoom}
          closeModal={() => setImageForZoom("")}
          url={imageForZoom}
          noUrl={!!imageForZoom && (imageForZoom?.includes("file") || imageForZoom?.includes("react-native-image-crop-picker"))}
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
  commentUpperView: { flexDirection: "row", alignItems: "flex-end" },
  commentUpperViewOptions: { paddingHorizontal: 10, paddingTop: 8, marginBottom: -5, flex: 1 },
  commentView: {
    backgroundColor: colors.secondarySelect,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 5,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 5

  },

  removeImageBtnView: {
    width: 20, height: 20,
    borderRadius: 25 / 2,
    backgroundColor: colors.delete,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: -8, top: 2
  },
  selectedCommentImageView: { width: 90, height: 60, borderRadius: 12, marginLeft: 10, overflow: "hidden", marginTop: 10, marginBottom: -5 },

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
    alignItems: "center",
    justifyContent: "space-between",
  },

  inputRootView: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 10
  },
  textInputView: {
    minHeight: 40,
    backgroundColor: "#1c2131",
    // borderWidth:0.5,
    // borderColor:colors.white,
    marginHorizontal: 10,
    borderRadius: 10,
    maxHeight: 80,
    padding: 5,
    flex: 1,
    flexDirection: "row",

  },
  addImageBtn: {
    justifyContent: "flex-start",
    marginTop: 5,
    paddingHorizontal: 5
  },
  input: {
    color: colors.white,
    fontFamily: fonts.regular,
    margin: 0,
    padding: 0,
    flex: 1,
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
    // borderWidth: 0.5, borderColor: colors.lightPrimary2,
    borderRadius: 999, height: 20,
    //  width: 20,
    alignItems: 'center', justifyContent: "center"
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
  },
  mentionUserText: {
    backgroundColor: colors.lightPrimary3,
    color: colors.primary
  }
})