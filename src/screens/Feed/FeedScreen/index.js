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



let feedVar = {
  page: 0,
  canLoadMore: false,
}

let commentVar = {
  page: 0,
  canLoadMore: false,
  id: "",
}

let likeVar = {
  page: 0,
  canLoadMore: false,
  id: "",
  actionType: ""
}
const FeedScreen = ({ navigation, route }) => {
  const addPostRef = useRef()
  const scheduleModalRef = useRef();
  const { feedFor, feedId } = route?.params;
  const isCosmos = feedFor == "the_cosmos";
  const isScheduledFeed = feedFor == "scheduled";
  const isAllSourceFeed = feedFor == "all_source";
  const { token, user } = useSelector(selectUser);
  const { socket } = useSelector(selectSocket);
  const timezone = useSelector(selectTimeZone);
  const { settings } = useSelector(selectSettings);
  const [feed, setFeed] = useState([]);
  const [feedData, setFeedData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [feedLevel, setFeedLevel] = useState(
    isCosmos ? user?.team_type == "both" ? 'all' : user?.team_type :
      isAllSourceFeed ? "all" : "dynamite"
  );
  const [feedFooterLoader, setFeedFooterLoader] = useState(false);
  const [likesFooterLoader, setLikesFooterLoader] = useState(false);
  const [commentsFooterLoader, setCommentsFooterLoader] = useState(false);
  const [feedOptionModal, setFeedOptionModal] = useState({ isVisible: false, selectedItem: null })
  const [confirmation, setConfirmation] = useState({ isVisible: false, item: null, title: "", type: "" });
  const [tab, setTab] = useState(0);
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

      if (route?.params?.openCommentModal) {
        openComments(feedId, false)
      }
    } else {
      setLoader(false);
      setFeedFooterLoader(false);
    }
  }

  const getFeedList = async () => {
    let res = await GET_FEED_LIST({ navigation, token, type: feedFor, level: feedLevel, page: feedVar.page });
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
      setFeed(feedVar.page <= 1 ? res?.feeds : [...feed, ...res?.feeds])
      setLoader(false);
      setFeedFooterLoader(false);
    } else {
      setLoader(false);
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
      id: ""
    };
    likeVar = {
      page: 0,
      canLoadMore: false,
      id: "",
      actionType: ''
    }
  }


  // !  SOCKET AND its fcuntions /////////////////

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
            nList.splice(index, 1, { ...nList[index], message: eeditedComment?.message });
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
                  is_liked: editedComment?.is_liked
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
                is_liked: editedComment?.is_liked
              })
            }
          }
          return {
            ...obj,
            list: nList
          }
        })
      }
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
    getFeed();
  }, [feedLevel])

  useEffect(() => {
    enableSocketEvents();
    api__getFeedExtraData();
    return () => {
      disableSocketEvents();
    }
  }, [])



  // !  FUNCTIONALITIES /////////////////


  const changeTab = (newTab) => {
    // console.log(newTab,"newTab")
    setTab(newTab);
  }

  const selectFeedlevel = (lvl) => {
    setLoader(true);
    setFeed([])
    setFeedLevel(lvl);
  }

  const openComments = (id, focus) => {
    commentVar = {
      page: 0,
      canLoadMore: false,
      id: id
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
    console.log(selectedOpt, "selectedOpt");
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
        addPostRef?.current?.selectItemForEdit(item)
      }, 500);
    } else if (selectedOpt?.type == "message") {
      onChatScreen(item?.action_info?.action_id)
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
    let newList = [...options];
    if (feedOptionModal?.selectedItem?.is_feature)
      newList = newList.slice().filter(x => x.type != "pin");
    else if (!feedOptionModal?.selectedItem?.is_feature)
      newList = newList.slice().filter(x => x.type != "unpin");
    else
      newList = options;

    if (!isCosmos || !isScheduledFeed) {
      newList = newList.slice().filter(x => {
        if (x.type == "message" && user?._id == feedOptionModal?.selectedItem?.action_info?.action_id) {
          return false
        }
        return true
      });
    }

    return newList
  }

  const onLikebtnPress = async (feedId, isLike) => {
    let fd = new FormData();
    fd.append("action", !isLike ? "feedlike" : "feedunlike");
    fd.append("feed", feedId);
    updateFeedItemsSpecificField(feedId, { is_liked: isLike ? false : true });
    let res = await FEED_LIKE_ACTIONS({ token, navigation, formdata: fd });
    if (res.code == 200) {
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
          upcomingEvents={feedData?.upcoming_events_array}
          currentEvent={feedData?.current_events_array}
          noticeboard={feedData?.notice_board}
        />)
    } else if (tab == 2) {
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

  const headerView = () => {
    return (
      <View>
        {route?.params?.title &&
          <View style={{ marginTop: 5, marginLeft: 5 }}>
            <MyText fontSize={18} type='bold' color={colors.primary} >{route?.params?.title}</MyText></View>
        }
        <FeedTabs
          isCosmos={isCosmos}
          tab={tab}
          changeTab={changeTab} />
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
          isCosmos={isCosmos}
          isScheduledFeed={isScheduledFeed}
          timezone={timezone}
          removeFromList={removeFromList}
          isSuperDelegate={user?.is_super_delegate}
        />
      </View>
    )
  }

  const feedRenderView = useCallback(({ item, index }) =>
    <FeedView
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
      isScheduledFeed={isScheduledFeed}
      sourceLevelIcons={feedData?.feed_setting}
      openScheduleTimeModal={scheduleModalRef?.current?.openScheduleTimeModal}
      onFeedDetail={onFeedDetail}
    />, [feed]);


  return (
    <View style={{ flex: 1 }}>

      <View style={{ flex: 1 }}>
        <FlatList
          data={tab == 0 ? feed : []}
          // onViewableItemsChanged={(e) => console.log("onViewableItemsChanged", e)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id}
          ListHeaderComponent={!!!feedId && headerView}
          ListEmptyComponent={!loader && tab == 0 && <EmptyView label={"Posts not found"} />}
          onEndReached={() => {
            console.log("onEndReached", feedVar)
            if (!!!feedId && feedVar?.canLoadMore && tab == 0) {
              feedVar = {
                ...feedVar,
                canLoadMore: false,
              }
              setFeedFooterLoader(true);
              getFeed();
            }
          }}
          renderItem={tab == 0 && feedRenderView}
          ListFooterComponent={footerView}
        />
      </View>
      {console.log(commentVar?.id, "commentVar?.id")}
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
]