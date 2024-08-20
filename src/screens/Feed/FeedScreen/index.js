import { View, Text, FlatList } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyLoader, { SimpleLoader } from '../../../components/MyLoader'
import { GET_FEED_LIST, GET_COMMENT_LIST, GET_LIKE_LIST, GET_COMMENT_LIKES_LIST, FEED_ACTIONS, DELETE_FEED_POST, FEED_LIKE_ACTIONS, GET_FEED_EXTRA_DATA, IS_CHAT_EXIST, GET_FEED_DETAIL } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import FeedView from './FeedView'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import { selectSettings } from '../../../redux/reducers/settingSlice'
import CommentModal from './CommentModal'
import LikeModal from './LikeModal'
import OptionModal from '../../../components/OptionModal'
import { icons } from '../../../utilities/icons'
import ConfirmationModal from '../../../components/ConfirmationModal'
import showToast from '../../../functions/showToast'
import AddPost from './AddPost'
import { selectSocket } from '../../../redux/reducers/socketSlice'
import { useNavigation } from '@react-navigation/native'
import FeedTabs from '../FeedTabs'
import FeedEvents from '../FeedEvents'
import Leaderboard from '../Leaderboard.js'
import EmptyView from '../../../components/EmptyView'
import { colors } from '../../../utilities/colors'
import routes from '../../../navigation/routes'
import ScheduleModal from './ScheduleModal'
import Header from '../../../components/Header'
import AddPersonalNoteModal from '../AddPersonalNoteModal'
import MyRefreshControl from '../../../components/MyRefreshControl'



let feedVar = {
  page: 0,
  canLoadMore: false,
}

let commentVar = {
  page: 0,
  canLoadMore: false,
  id: "",
  level: "",
}

let likeVar = {
  page: 0,
  canLoadMore: false,
  id: "",
  actionType: ""
}
const FeedScreen = ({ navigation, route, CustomHeader, CustomTabs, showTabView, upcomingEvents, currentEvents, hideTabs = false, isScheduleFeedTabAllowed = false, schedulePost = false, }) => {
  // let feedPage = useRef({
  //   page: 0,
  //   canLoadMore: false,
  // })
  // let { current: feedVar } = feedPage;
  // console.log(feedVar,"feedVar")
  const addPostRef = useRef()
  const scheduleModalRef = useRef();
  const ref_personalNoteModal = useRef();
  const { feedFor, feedId, eventId = "" } = route?.params;
  const isCosmos = feedFor == "the_cosmos";
  const isScheduledFeed = feedFor == "scheduled";
  const isAllSourceFeed = feedFor == "all_source";
  const isTheSourceFeed = feedFor == "the_source";
  const isEventFeed = feedFor == "event";
  const { token, user, access, isChatAllowed } = useSelector(selectUser);
  console.log(access, "access")
  const { socket } = useSelector(selectSocket);
  const timezone = useSelector(selectTimeZone);
  const { settings } = useSelector(selectSettings);
  const [feed, setFeed] = useState([]);
  const [feedData, setFeedData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [feedLevel, setFeedLevel] = useState(
    isEventFeed ? "all" :
      isCosmos ? access?.cosmos_feeds_filters ? access?.default_filter : user?.team_type :
        isAllSourceFeed ? "all" : "dynamite"
  );
  const [isRefreshing, setRefreshing] = useState(false)
  const [feedFooterLoader, setFeedFooterLoader] = useState(false);
  const [likesFooterLoader, setLikesFooterLoader] = useState(false);
  const [commentsFooterLoader, setCommentsFooterLoader] = useState(false);
  const [feedOptionModal, setFeedOptionModal] = useState({ isVisible: false, selectedItem: null, })
  const [confirmation, setConfirmation] = useState({ isVisible: false, item: null, title: "", type: "" });
  const [cosmosLevels] = useState(makeCosmosLevls());
  const [tab, setTab] = useState(0);
  const [inView, setInView] = useState("")
  const [comments, setComments] = useState({
    modalVisibility: false,
    list: [],
    loader: false,
    focus: false
  });

  const [likes, setLikes] = useState({
    modalVisibility: false,
    list: [],
    loader: false,

  });

  function makeCosmosLevls() {
    return access?.cosmos_feed_filters.map((x) => ({
      title: x.split("_").join(" "),
      type: x
    }))
  }



  // !  API's /////////////////

  const getComments = async (append = false) => {
    let fd = new FormData();
    fd.append("feed_id", commentVar.id);
    let res = await GET_COMMENT_LIST({ navigation, token, body: fd, page: commentVar.page });
    if (res.code == 200) {
      if (res?.total_pages > (1 + commentVar.page)) {
        commentVar = {
          ...commentVar,
          page: commentVar.page + 1,
          canLoadMore: true
        }
      } else {
        commentVar = {
          ...commentVar,
          canLoadMore: false
        }
      }
      console.log("comments?.modalVisibility", commentVar?.page, comments?.modalVisibility)
      setComments({
        modalVisibility: true,
        list: !append ? res?.comment : [...comments?.list, ...res?.comment],
        loader: false
      });
      setCommentsFooterLoader(false);
    } else {
      setComments({
        modalVisibility: true,
        list: [],
        loader: false
      });
      setCommentsFooterLoader(false);
    }
  }

  const getLikes = async (forCmments) => {
    let fd = new FormData();
    fd.append("feed", likeVar.id);
    fd.append("action_type", likeVar.actionType);
    let res;
    if (forCmments) {
      res = await GET_COMMENT_LIKES_LIST({ navigation, token, body: fd, page: likeVar?.page });
    } else {
      res = await GET_LIKE_LIST({ navigation, token, body: fd, page: likeVar?.page });
    }
    if (res.code == 200) {
      if (res?.total_pages > (1 + likeVar.page)) {
        likeVar = {
          ...likeVar,
          canLoadMore: true,
          page: likeVar.page + 1,
        }
      } else {
        likeVar = {
          ...likeVar,
          canLoadMore: false
        }
      }
      setLikes((prev) => ({
        modalVisibility: true,
        list: [...prev.list, ...res?.feed_activity],
        loader: false
      }));
      setLikesFooterLoader(true);
    } else {
      setLikes({
        modalVisibility: true,
        list: [],
        loader: false
      });
      setLikesFooterLoader(true);
    }
  }

  const getFeed = async () => {
    if (!!feedId) {
      getFeedDetail()
    } else {
      getFeedList()
    }
  }

  const getFeedDetail = async () => {
    let res = await GET_FEED_DETAIL({ navigation, token, feedId: feedId });
    if (res.code == 200) {

      setFeed([res?.feeds])
      setLoader(false);
      setFeedFooterLoader(false);
      setRefreshing(false);
      if (route?.params?.openCommentModal) {
        openComments(feedId, false)
      }
    } else {
      setLoader(false);
      setRefreshing(false);
      setFeedFooterLoader(false);
    }
  }

  const getFeedList = async () => {
    let res = await GET_FEED_LIST({ navigation, token, type: schedulePost ? "scheduled" : feedFor, level: feedLevel, page: feedVar.page, eventId: eventId });
    if (res.code == 200) {
      if (res?.total_pages > (1 + feedVar.page)) {
        feedVar = {
          page: feedVar.page + 1,
          canLoadMore: true
        }
      } else {
        feedVar = {
          ...feedVar,
          canLoadMore: false
        }
      }
      // console.log(feedVar,"feedVar")
      setFeed(feedVar.page <= 1 ? res?.feeds : [...feed, ...res?.feeds])
      setLoader(false);
      setRefreshing(false);
      setFeedFooterLoader(false);
    } else {
      setLoader(false);
      setRefreshing(false);
      setFeedFooterLoader(false);
    }
  }

  const api__getFeedExtraData = async () => {
    let res = await GET_FEED_EXTRA_DATA({ navigation, token, level: feedFor });
    if (res.code == 200) {
      setFeedData(res)
    }
  }

  const feedAction = async (fd) => {
    let res = await FEED_ACTIONS({ navigation, token, formData: fd });
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" })
      resetCounts();
      getFeed();
    }
  }

  const deleteFeedPostAPI = async (id) => {
    let res = await DELETE_FEED_POST({ navigation, token, feedId: id });
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" })
      setFeed((list) => list.filter(f => f._id != id));
    }
  }

  const resetCounts = () => {
    feedVar = {
      page: 0,
      canLoadMore: false,
    };
    commentVar = {
      page: 0,
      canLoadMore: false,
      id: "",
      level: ""
    };
    likeVar = {
      page: 0,
      canLoadMore: false,
      id: "",
      actionType: ''
    }
  }


  // !  SOCKET AND its fcuntions /////////////////

  const socketEmittersForAction = (resp, action = "", extra = {}) => {
    let socketData = {
      action: !!action ? action : resp?.action,
      action_by: user?._id,
      action_response: resp,
      creator_id: resp?.creator_id,
      feed_id: typeof (resp?.feed) == "object" ? resp?.feed?._id : resp?.feed,
      token: token,
      ...extra
    }
    console.log(isCosmos, "Emitted Socket data", socketData)
    if (isCosmos) {
      socket.emit("delegate_feed_room_action_event", socketData);
    } else {
      socket.emit("feed_room_action_event", socketData);
    }
  }

  const updateComments = (data) => {
    if (data?.feed_id == commentVar?.id) {
      if (data?.action == "add_comment") {

        setComments((obj) => ({
          ...obj,
          list: [data?.action_response?.comment, ...obj.list]
        }))
        setFeed((list) => {
          let index = list.findIndex(item => item._id == data?.action_response?.feed?._id);
          if (index > -1) {
            list[index] = { ...list[index], comment_count: data?.action_response?.feed?.comment_count };
          }
          return [...list]
        })
      } else if (data?.action == "delete_comment") {
        setComments((obj) => ({
          ...obj,
          list: [...obj.list.slice("").filter(x => x._id != data?.comment)]
        }))
        setFeed((list) => {
          let index = list.findIndex(item => item._id == data?.action_response?.feed?._id);
          if (index > -1) {
            list[index] = { ...list[index], comment_count: data?.action_response?.feed?.comment_count };
          }
          return [...list]
        })
      } else if (data?.action == "edit_comment") {
        setComments((obj) => {
          let eeditedComment = data?.action_response?.comment;
          let nList = [...obj.list];
          let index = nList.findIndex(x => x._id == eeditedComment?._id);
          if (index > -1) {
            let obj = {
              ...nList[index],
              message: eeditedComment?.message,
              mentioned_users: !!eeditedComment?.mentioned_users ? eeditedComment?.mentioned_users : []
            }
            if (!!eeditedComment?.image) {
              obj["image"] = eeditedComment?.image
            } else {
              delete obj["image"]
            }
            nList.splice(index, 1, obj);
          }
          return {
            ...obj,
            list: [...nList]
          }
        })
      } else if (data?.action == "delete_comment_reply") {

        setComments((obj) => {
          let eeditedComment = data?.action_response?.comment;
          let nList = [...obj.list];
          let index = nList.findIndex(x => x._id == eeditedComment?._id);
          if (index > -1) {
            nList.splice(index, 1, { ...nList[index], ...eeditedComment });
          }
          return {
            ...obj,
            list: [...nList]
          }
        })

        setFeed((list) => {
          let index = list.findIndex(item => item._id == data?.action_response?.feed?._id);
          if (index > -1) {
            list[index] = { ...list[index], comment_count: data?.action_response?.feed?.comment_count };
          }
          return [...list]
        })

      } else if (data?.action == "add_comment_reply") {
        setComments((obj) => {
          let newChildComment = { ...data?.action_response?.comment, parent_comment: data?.action_response?.parent_comment }
          let pId = data?.action_response?.parent_comment
          let nList = [...obj.list];
          let index = nList.findIndex(x => x._id == pId);
          if (index > -1) {
            nList.splice(index, 1, { ...nList[index], child_comment: [newChildComment, ...nList[index].child_comment] });
          }
          console.log(obj.list, index, "check edited")
          return {
            ...obj,
            list: nList
          }
        })

        setFeed((list) => {
          let index = list.findIndex(item => item._id == data?.action_response?.feed?._id);
          if (index > -1) {
            list[index] = { ...list[index], comment_count: data?.action_response?.feed?.comment_count };
          }
          return [...list]
        })
      } else if (data?.action == "edit_comment_reply") {
        setComments((obj) => {
          let pId = data?.action_response?.comment?.parent_comment;
          let cId = data?.action_response?.comment?._id;
          let editedComment = data?.action_response?.comment;
          let nList = [...obj.list];
          let index = nList.findIndex(x => x._id == pId);
          if (index > -1) {
            let childList = [...nList[index].child_comment];
            let childIndex = childList.findIndex(x => x._id == cId);
            if (childIndex > -1) {
              childList.splice(childIndex, 1, editedComment);
              nList.splice(index, 1, { ...nList[index], child_comment: childList });
            }
          }
          return {
            ...obj,
            list: nList
          }
        })
      } else if (data?.action == "commentunlike" || data?.action == "commentlike") {
        setComments((obj) => {
          let editedComment = data?.action_response;
          let nList = [...obj.list];
          if (!!editedComment?.parent_comment) {
            let index = nList.findIndex(x => x._id == editedComment?.parent_comment);
            if (index > -1) {
              let childList = [...nList[index].child_comment];
              let childIndex = childList.findIndex(x => x._id == editedComment?.comment);
              if (childIndex > -1) {
                childList.splice(childIndex, 1, {
                  ...nList[index].child_comment[childIndex],
                  like_count: editedComment?.comment_like_count,
                  is_liked: editedComment?.is_liked && user?._id == data?.action_by ? true : nList[index].child_comment[childIndex]?.is_liked,
                });
                nList.splice(index, 1, { ...nList[index], child_comment: childList });
              }
            }
          }
          else {
            let index = nList.findIndex(x => x._id == editedComment?.comment);
            console.log(index, "index")
            if (index > -1) {
              nList.splice(index, 1, {
                ...nList[index],
                like_count: editedComment?.comment_like_count,
                is_liked: editedComment?.is_liked && user?._id == data?.action_by ? true : nList[index]?.is_liked
              })
            }
          }
          return {
            ...obj,
            list: nList
          }
        })
      }
    } else {
      setFeed((list) => {
        let index = list.findIndex(item => item._id == data?.action_response?.feed?._id);
        if (index > -1) {
          list[index] = { ...list[index], comment_count: data?.action_response?.feed?.comment_count };
        }
        return [...list]
      })
    }
  }

  const socketReceiverAction = (data) => {
    console.log("%csocketReceiverAction", 'background:#624B2D; color: #FFF', data);
    if (data?.action == "feedlike" || data?.action == "feedunlike") {
      updateFeedItemsSpecificField(data?.feed_id, {
        is_liked: data?.action_response?.is_liked,
        like_count: data?.action_response?.like_count,
        top_liked_user: data?.action_response?.top_liked_user
      })
    }

    if (data?.action.includes("comment")) {
      updateComments(data)
    }
  }


  const SocketEvents = () => {
    if (socket?.connected) {
      enableSocketEvents()
    }
    socket.on("connect", () => {
      enableSocketEvents()
    })
    socket.on("disconnect", () => {
      disableSocketEvents()
    })
  }

  const enableSocketEvents = () => {
    socket.emit("delegate_feed_room", "delegate_live_feed_room");
    socket.emit("live_event_room", "live_feed_room");
    socket.on("delegate_live_feed_room_reciever", socketReceiverAction);
    socket.on("live_feed_room_reciever", socketReceiverAction);
  }

  const disableSocketEvents = () => {
    socket.off("delegate_live_feed_room_reciever", socketReceiverAction);
    socket.off("live_feed_room_reciever", socketReceiverAction);
  }

  // !  USE  EFFECTS /////////////////

  useEffect(() => {
    resetCounts();
    setFeed([])
    setLoader(true)
    getFeed();
  }, [feedLevel])

  const onRefresh = () => {
    setRefreshing(true)
    resetCounts();
    getFeed();
  }

  useEffect(() => {
    SocketEvents()
    api__getFeedExtraData();
    return () => {
      disableSocketEvents();
    }
  }, [])



  // !  FUNCTIONALITIES /////////////////


  const changeTab = (newTab) => {
    console.log(newTab, "newTab")
    setTab(newTab);
  }

  const selectFeedlevel = (lvl) => {
    // setLoader(true);
    // setFeed([])
    setFeedLevel(lvl);
  }

  const openComments = (id, focus) => {
    let curFeed = feed.find(fed => fed._id == id);
    commentVar = {
      page: 0,
      canLoadMore: false,
      id: id,
      level: !!curFeed ? curFeed?.created_for_level_or_type : ""
    };
    setComments({
      list: [],
      modalVisibility: true,
      loader: true,
      focus: focus
    });

    getComments();
  }

  const showLikesOfComments = (id) => {
    setLikes({
      list: [],
      modalVisibility: true,
      loader: true,
    });
    likeVar = {
      ...likeVar,
      id: id,
      actionType: "like",
    }
    getLikes(true);
  }

  const showLikes = (id) => {
    setLikes({
      list: [],
      modalVisibility: true,
      loader: true,
    });
    likeVar = {
      page: 0,
      canLoadMore: false,
      id: id,
      actionType: "all",
    }
    getLikes(false);
  }

  const onCommentEndReached = () => {
    if (commentVar?.canLoadMore && comments?.modalVisibility == true) {
      commentVar = {
        ...commentVar,
        canLoadMore: false,
      }
      setCommentsFooterLoader(true);
      getComments(true);
    }
  }

  const onLikesEndReached = () => {
    console.log("onLikesEndReached", likes, likeVar)
    if (likeVar?.canLoadMore && likes?.modalVisibility == true) {
      likeVar = {
        ...likeVar,
        canLoadMore: false,
      }
      setLikesFooterLoader(true);
      getLikes(false);

    }
  }

  const openOptions = (item) => {
    setFeedOptionModal({
      isVisible: true,
      selectedItem: item,
    })
  }

  const confirmationAction = () => {
    if (confirmation.type == "pin" || confirmation.type == "unpin") {
      let fd = new FormData();
      fd.append("feed", confirmation?.item?._id);
      fd.append("action", confirmation.type == "pin" ? "feature" : "unfeature");
      feedAction(fd)
    } else if (confirmation.type == "delete") {
      deleteFeedPostAPI(confirmation?.item?._id)
    }

    setConfirmation({
      isVisible: false,
      item: null,
      title: "",
      type: null
    })
  }

  const actionOfFeedOptions = (selectedOpt) => {

    let item = feedOptionModal.selectedItem;
    setFeedOptionModal({
      isVisible: false,
      selectedItem: null
    })
    if (selectedOpt?.type == "pin" || selectedOpt?.type == "unpin") {
      setTimeout(() => {
        setConfirmation({
          isVisible: true,
          item: item,
          title: `Are you sure you want to ${selectedOpt?.title} this post?`,
          type: selectedOpt?.type
        })
      }, 500);
    } else if (selectedOpt?.type == "delete") {
      setTimeout(() => {
        setConfirmation({
          isVisible: true,
          item: item,
          title: `Are you sure you want to delete this post?`,
          type: selectedOpt?.type
        })
      }, 500);
    } else if (selectedOpt?.type == "edit") {
      setTimeout(() => {
        // console.log(item,"item")
        addPostRef?.current?.selectItemForEdit(item)
      }, 500);
    } else if (selectedOpt?.type == "message") {
      onChatScreen(item?.action_info?.action_id)
    } else if (selectedOpt?.type == "notes") {
      setTimeout(() => {
        ref_personalNoteModal?.current?.openModal(item?.description)
      }, 500);
    }
  }

  const onMessagePress = (item) => {
    console.log(item, "item")
    if (!!item?.user_info_action_by?.action_id) {
      onChatScreen(item?.user_info_action_by?.action_id)
      setLikes({
        modalVisibility: false,
        list: [],
        loader: false
      })
    }
  }

  const onCommentMessagePress = (item) => {
    if (!!item?.user_info_action_by?.action_id) {
      onChatScreen(item?.user_info_action_by?.action_id)
      setComments({
        modalVisibility: false,
        list: [],
        loader: false,
        id: ""
      })
    }
  }

  const onChatScreen = async (memberId) => {
    let res = await IS_CHAT_EXIST({ token, navigation, memberId })
    if (res.code == 200) {
      if (res.is_chat_exist) {
        let member = res.chat.member.find(x => x._id != user?._id)
        navigation.navigate(routes.chatMessageList, {
          isOnline: member?.is_online,
          memberId: member?._id,
          firstName: member?.first_name,
          lastName: member?.last_name,
          lastSeen: "",
          profileImage: !!member?.profile_image ? member?.profile_image : "",
          chatId: res?.chat?._id,
          canGoBack: true,
          resetCountToZero: () => { },
          refresh: () => { },
        })
      } else {
        let member = res.user_info;
        navigation.navigate(routes.chatMessageList, {
          isOnline: member?.is_online,
          memberId: member?._id,
          firstName: member?.first_name,
          lastName: member?.last_name,
          lastSeen: !!member?.last_login_activity ? member?.last_login_activity : "",
          profileImage: !!member?.member ? member?.member : "",
          chatId: "",
          canGoBack: true,
          resetCountToZero: () => { },
          refresh: () => { },
        })
      }
    }
  }

  const onFeedDetail = (id) => {
    navigation.navigate(routes.feedDetailScreen, {
      feedId: id,
    })
  }

  const updateFeedItemsSpecificField = (feedId, updatedObj) => {
    setFeed((list) => {
      let index = list.findIndex(item => item._id == feedId);
      if (index > -1) {
        list[index] = { ...list[index], ...updatedObj };
      }
      return [...list]
    })
  }

  const removeFromList = (id) => {
    setFeed((list) => list.filter(f => f._id != id));
  }

  const updateFeedCommentCount = (feedId, count) => {
    setFeed((list) => {
      let index = list.findIndex(item => item._id == feedId);
      if (index > -1) {
        let newCount = !!list[index].comment_count ? list[index].comment_count : 0;
        newCount = newCount + count;
        if (newCount <= 0) {
          newCount = 0;
        }
        list[index] = { ...list[index], comment_count: newCount };
      }
      return [...list]
    })
  }

  const filterTheOptions = (options) => {
    if (feedOptionModal.isVisible) {
      let feed = feedOptionModal?.selectedItem;
      let newList = [];
      let isMine = feed?.action_info?.action_id == user?._id;

      options.forEach((item) => {
        if (item.type == "pin") {
          if (access?.feed_pin_unpin_option) {
            if (!feed?.is_feature) {
              if (isAllSourceFeed || isTheSourceFeed) {
                newList.push(item);
              } else if (isMine) {
                if (!isScheduledFeed) {
                  newList.push(item);
                }
              }
            }
          }
        }

        if (item.type == "unpin") {
          if (access?.feed_pin_unpin_option) {
            if (feed?.is_feature) {
              if (isAllSourceFeed || isTheSourceFeed) {
                newList.push(item);
              } else if (isMine) {
                if (!isScheduledFeed) {
                  newList.push(item);
                }
              }
            }
          }
        }

        if (item.type == "edit" || item.type == "delete") {
          if (isMine) {
            newList.push(item);
          } else {
            if (isAllSourceFeed || isTheSourceFeed) {
              if (access?.edit_delete_option_in_source_all_source_feeds) {
                newList.push(item);
              }
            }
          }
        }

        if (item.type == "notes") {
          if (isEventFeed) {
            newList.push(item);
          }
        }

        if (item.type == "message") {
          if (isChatAllowed) {
            if (!isMine) {
              newList.push(item);
            }
          }
        }


      })

      return newList

      //   if ((isEventFeed && feedOptionModal?.selectedItem?.action_info?.action_id == user?._id) || !isEventFeed) {
      //     if (access?.feed_pin_unpin_option) {
      //       if (feedOptionModal?.selectedItem?.is_feature)
      //         newList = newList.slice().filter(x => x.type != "pin");
      //       else if (!feedOptionModal?.selectedItem?.is_feature)
      //         newList = newList.slice().filter(x => x.type != "unpin");
      //     } else {
      //       newList = newList.slice().filter(x => x.type != "pin" && x.type != "unpin");
      //     }
      //   }else{
      //     newList = newList.slice().filter(x => x.type != "pin" && x.type != "unpin");
      //   }
      //   if (!isEventFeed) {
      //     newList = newList.slice().filter(x => x.type != "notes");
      //   }


      //   newList = newList.slice().filter(x => {
      //     if ((x.type == "message" && user?._id == feedOptionModal?.selectedItem?.action_info?.action_id) || (!!isChatAllowed == false && x.type == "message")) {
      //       return false
      //     }
      //     else if (
      //      ( !isCosmos && !isScheduledFeed && !isEventFeed )&&
      //       (!access?.edit_delete_option_in_source_all_source_feeds && feedOptionModal?.selectedItem?.action_info?.action_id != user?._id) &&
      //       (x.type == "edit" || x.type == "delete")) {
      //       return false
      //     }
      //     return true
      //   });

      //   console.log(newList, "newList 4")
      //   // if(!access?.feed_pin_unpin_option){
      //   //   newList = newList.slice().filter(x => {
      //   //     if (x.type == "message" && user?._id == feedOptionModal?.selectedItem?.action_info?.action_id) {
      //   //       return false
      //   //     }
      //   //     return true
      //   //   });
      //   // }
      //   console.log(newList, "newList")
      //   return newList
      // } else {
      //   return []
    }
  }

  const filterTheOptionsCount = (feed) => {

    let newList = [];
    let isMine = feed?.action_info?.action_id == user?._id;

    feedOptionList.forEach((item) => {
      if (item.type == "pin") {
        if (access?.feed_pin_unpin_option) {
          if (!feed?.is_feature) {
            if (isAllSourceFeed || isTheSourceFeed) {
              newList.push(item);
            } else if (isMine) {
              if (!isScheduledFeed) {
                newList.push(item);
              }
            }
          }
        }
      }

      if (item.type == "unpin") {
        if (access?.feed_pin_unpin_option) {
          if (feed?.is_feature) {
            if (isAllSourceFeed || isTheSourceFeed) {
              newList.push(item);
            } else if (isMine) {
              if (!isScheduledFeed) {
                newList.push(item);
              }
            }
          }
        }
      }

      if (item.type == "edit" || item.type == "delete") {
        if (isMine) {
          newList.push(item);
        } else {
          if (isAllSourceFeed || isTheSourceFeed) {
            if (access?.edit_delete_option_in_source_all_source_feeds) {
              newList.push(item);
            }
          }
        }
      }

      if (item.type == "notes") {
        if (isEventFeed) {
          newList.push(item);
        }
      }

      if (item.type == "message") {
        if (isChatAllowed) {
          if (!isMine) {
            newList.push(item);
          }
        }
      }


    })
    return newList.length

    //   if ((isEventFeed && feedOptionModal?.selectedItem?.action_info?.action_id == user?._id) || !isEventFeed) {
    //     if (access?.feed_pin_unpin_option) {
    //       if (feedOptionModal?.selectedItem?.is_feature)
    //         newList = newList.slice().filter(x => x.type != "pin");
    //       else if (!feedOptionModal?.selectedItem?.is_feature)
    //         newList = newList.slice().filter(x => x.type != "unpin");
    //     } else {
    //       newList = newList.slice().filter(x => x.type != "pin" && x.type != "unpin");
    //     }
    //   }else{
    //     newList = newList.slice().filter(x => x.type != "pin" && x.type != "unpin");
    //   }
    //   if (!isEventFeed) {
    //     newList = newList.slice().filter(x => x.type != "notes");
    //   }


    //   newList = newList.slice().filter(x => {
    //     if ((x.type == "message" && user?._id == feedOptionModal?.selectedItem?.action_info?.action_id) || (!!isChatAllowed == false && x.type == "message")) {
    //       return false
    //     }
    //     else if (
    //      ( !isCosmos && !isScheduledFeed && !isEventFeed )&&
    //       (!access?.edit_delete_option_in_source_all_source_feeds && feedOptionModal?.selectedItem?.action_info?.action_id != user?._id) &&
    //       (x.type == "edit" || x.type == "delete")) {
    //       return false
    //     }
    //     return true
    //   });

    //   console.log(newList, "newList 4")
    //   // if(!access?.feed_pin_unpin_option){
    //   //   newList = newList.slice().filter(x => {
    //   //     if (x.type == "message" && user?._id == feedOptionModal?.selectedItem?.action_info?.action_id) {
    //   //       return false
    //   //     }
    //   //     return true
    //   //   });
    //   // }
    //   console.log(newList, "newList")
    //   return newList
    // } else {
    //   return []

  }


  const onLikebtnPress = async (feedId, isLike) => {
    let fd = new FormData();
    fd.append("action", !isLike ? "feedlike" : "feedunlike");
    fd.append("feed", feedId);
    updateFeedItemsSpecificField(feedId, { is_liked: isLike ? false : true });
    let res = await FEED_LIKE_ACTIONS({ token, navigation, formdata: fd });
    if (res.code == 200) {
      socketEmittersForAction(res?.action_response, "")
      // updateFeedItemsSpecificField(feedId, {
      //   is_liked: res?.action_response?.is_liked,
      //   top_liked_user: res?.action_response?.top_liked_user,
      //   like_count: res?.action_response?.like_count
      // });
    } else {
      updateFeedItemsSpecificField(feedId, { is_liked: isLike });
    }
  }

  // !  VIEWS /////////////////

  const footerView = () => {
    if (tab == 0) {
      return (
        <View style={{ height: 50, alignItems: "center", justifyContent: "center" }}>
          {feedFooterLoader && <SimpleLoader />}
        </View>
      )
    }

    else if (tab == 1) {
      return (
        <FeedEvents
          upcomingEvents={isEventFeed ? upcomingEvents : feedData?.upcoming_events_array}
          currentEvent={isEventFeed ? currentEvents : feedData?.current_events_array}
          isEventFeed={isEventFeed}
          noticeboard={feedData?.notice_board}
        />)
    }
    else if (tab == 2 && isScheduleFeedTabAllowed) {
      return (
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <FeedScreen
            filterTheOptions={filterTheOptionsCount}
            navigation={navigation}
            route={route}
            hideTabs={true}
            isScheduleFeedTabAllowed={true}
            schedulePost={true}
          />
        </View>)

    }
    else if (isEventFeed) {
      return showTabView(tab)
    }
    else if (tab == 2) {
      return (
        <Leaderboard
          monthlyCounts={feedData?.consultant_list_by_monthly_count}
          weeklyCounts={feedData?.consultant_list_by_weekly_count}
          isCosmos={isCosmos}
          affiliateMember={feedData?.affiliate_member}
          pages={feedData?.sale_pages}
          user={user}
        />)
    }
    else
      return null
  }

  const onViewableItemsChanged = React.useCallback((item) => {
    if (!!item?.viewableItems[1] && item?.viewableItems[1]?.item?.is_reward_feed == true) {
      setInView(item?.viewableItems[1]?.item?._id)
    } else if (!!item?.viewableItems[0] && item?.viewableItems[0]?.item?.is_reward_feed == true) {
      setInView(item?.viewableItems[0]?.item?._id)
    }
  }, [])



  const headerView = () => {
    return (
      <View style={{ paddingHorizontal: 10 }}>
        {!!!feedId &&
          <>
            {route?.params?.title &&
              <View style={{ marginTop: 5, marginLeft: 5 }}>
                <MyText fontSize={18} type='bold' color={colors.primary} >{route?.params?.title}</MyText></View>
            }
            {!!CustomHeader && CustomHeader()}
            {!hideTabs &&
              <FeedTabs
                CustomTabs={CustomTabs}
                isCosmos={isCosmos}
                tab={tab}
                changeTab={changeTab}
                isScheduleFeedTabAllowed={isScheduleFeedTabAllowed} />}
          </>}
        <AddPost
          ref={addPostRef}
          tab={tab}
          feedLevel={feedLevel}
          selectFeedlevel={selectFeedlevel}
          refresh={() => {
            resetCounts();
            getFeed();
          }}
          user={user}
          token={token}
          navigation={navigation}
          updateFeedItem={(newFeed) => setFeed(feeds => {
            let index = feeds.findIndex(feed => feed._id === newFeed?._id);
            if (index !== -1) {
              feeds.splice(index, 1, newFeed);
            }
            return [...feeds];
          })}
          hideAddView={!!feedId}
          isCosmos={isCosmos}
          isScheduledFeed={isScheduledFeed || schedulePost}
          isEventFeed={isEventFeed}
          eventId={isEventFeed ? eventId : ""}
          timezone={timezone}
          removeFromList={removeFromList}
          isSuperDelegate={user?.is_super_delegate}
          hideLevelView={isEventFeed || (isCosmos && !access?.cosmos_feeds_filters)}
          isMultipleSelectAllowed={access?.multiple_levels_in_source_all_source_scadule_feeds}
          showEventOption={access?.event_info_in_source_all_source_scadule_feeds}
          cosmosLevelList={access?.cosmos_feed_filters}
          defaultCosmosFilter={access?.default_filter}
          selectLevelOptionOnAddPostForCosmos={isCosmos && access?.choose_level_in_cosmos_feeds}
        />
      </View>
    )
  }

  const feedRenderView = useCallback(({ item, index }) =>
    <FeedView
      filterTheOptions={filterTheOptionsCount}
      isInView={inView == item?._id}
      item={item}
      index={index}
      timezone={timezone}
      user={user}
      token={token}
      settings={settings}
      openComments={openComments}
      showLikes={showLikes}
      openOptions={openOptions}
      onLikebtnPress={onLikebtnPress}
      isCosmos={isCosmos}
      isEventFeed={isEventFeed}
      isScheduledFeed={isScheduledFeed}
      sourceLevelIcons={feedData?.feed_setting}
      openScheduleTimeModal={scheduleModalRef?.current?.openScheduleTimeModal}
      onFeedDetail={onFeedDetail}
    />, [feed, inView]);

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

  return (
    <View style={{ flex: 1 }}>

      <View style={{ flex: 1, marginHorizontal: -10 }}>
        <FlatList
          data={tab == 0 ? feed : []}
          // onViewableItemsChanged={!__DEV__ && onViewableItemsChanged}
          // viewabilityConfig={!__DEV__ && viewConfigRef.current}
          refreshControl={<MyRefreshControl
            onRefresh={onRefresh}
            refreshing={isRefreshing}
          />}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id}
          ListHeaderComponent={headerView()}
          ListEmptyComponent={!loader && tab == 0 && <EmptyView label={"Posts not found"} />}
          onEndReached={() => {
            console.log(feedId, feedVar?.canLoadMore, tab, "OnEndReached")
            if (!!!feedId && feedVar?.canLoadMore && tab == 0) {
              feedVar = {
                ...feedVar,
                canLoadMore: false,
              }
              setFeedFooterLoader(true);
              getFeed();
            }
          }}
          onEndReachedThreshold={0.3}
          renderItem={tab == 0 && feedRenderView}
          ListFooterComponent={footerView()}
          // removeClippedSubviews={true}
          updateCellsBatchingPeriod={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={10}

        />
      </View>

      <CommentModal
        isVisible={comments?.modalVisibility}
        timezone={timezone}
        closeModal={() =>
          setComments({
            modalVisibility: false,
            list: [],
            loader: false,
            id: ""
          })}
        comments={comments?.list}
        user={user}
        loader={comments?.loader}
        focus={comments?.focus}
        showLikesOfComments={showLikesOfComments}
        onEndReached={onCommentEndReached}
        footerLoader={commentsFooterLoader}
        token={token}
        navigation={navigation}
        feedId={commentVar?.id}
        setComments={setComments}
        updateFeedItemsSpecificField={updateFeedItemsSpecificField}
        socketEmittersForAction={socketEmittersForAction}
        isCosmos={isCosmos}
        isEventFeed={isEventFeed}
        eventId={eventId}
        feedCreatedFor={commentVar?.level}
        onCommentMessagePress={onCommentMessagePress}
      />


      <LikeModal
        isVisible={likes?.modalVisibility}
        timezone={timezone}
        closeModal={() =>
          setLikes({
            modalVisibility: false,
            list: [],
            loader: false
          })}
        likes={likes?.list}
        user={user}
        loader={likes?.loader}
        onEndReached={onLikesEndReached}
        footerLoader={likesFooterLoader}
        onMessagePress={onMessagePress}
      />

      <OptionModal
        optionList={filterTheOptions(feedOptionList)}
        closeModal={() => setFeedOptionModal({ isVisible: false, selectedItem: null })}
        onSelected={actionOfFeedOptions}
        isVisible={feedOptionModal?.isVisible} />


      <ConfirmationModal
        closeModal={() => setConfirmation({ isVisible: false, title: "", item: null, type: "" })}
        isVisible={confirmation.isVisible}
        onAgree={confirmationAction}
        title={confirmation.title}

      />

      <ScheduleModal ref={scheduleModalRef} />

      <AddPersonalNoteModal
        ref={ref_personalNoteModal}
      />

      <MyLoader enable={loader} />
    </View >
  )
}

export default FeedScreen


const feedOptionList = [{
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
{
  icon: () => icons.send(colors.primary, 17),
  title: "Message",
  type: "message"
},

{
  icon: () => icons.notes(colors.primary, 17),
  title: "Add as Personal Notes",
  type: "notes"
},
]