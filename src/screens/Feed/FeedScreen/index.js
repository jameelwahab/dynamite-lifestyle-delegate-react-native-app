import { View, Text, FlatList } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyLoader, { SimpleLoader } from '../../../components/MyLoader'
import { GET_FEED_LIST, GET_COMMENT_LIST, GET_LIKE_LIST, GET_COMMENT_LIKES_LIST, FEED_ACTIONS, DELETE_FEED_POST, FEED_LIKE_ACTIONS } from '../../../DAL'
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
const FeedScreen = ({ navigation }) => {
  const addPostRef = useRef()
  const { token, user } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const { settings } = useSelector(selectSettings);
  const [feed, setFeed] = useState([]);
  const [loader, setLoader] = useState(true);
  const [feedLevel, setFeedLevel] = useState('all');
  const [feedFooterLoader, setFeedFooterLoader] = useState(false);
  const [likesFooterLoader, setLikesFooterLoader] = useState(false);
  const [commentsFooterLoader, setCommentsFooterLoader] = useState(false);
  const [feedOptionModal, setFeedOptionModal] = useState({ isVisible: false, selectedItem: null })
  const [confirmation, setConfirmation] = useState({ isVisible: false, item: null, title: "", type: "" })
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


  const getComments = async () => {
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
        list: commentVar?.page <= 1 ? res?.comment : [...comments?.list, ...res?.comment],
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
    let res = await GET_FEED_LIST({ navigation, token, type: "the_cosmos", level: feedLevel, page: feedVar.page });
    if (res.code == 200) {
      if (res?.total_pages < feedVar.page) {
        feedVar = {
          ...feedVar,
          canLoadMore: false
        }
      } else {
        feedVar = {
          page: feedVar.page + 1,
          canLoadMore: true
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

  useEffect(() => {
    resetCounts();
    getFeed();
  }, [feedLevel])


  const onCommentEndReached = () => {
    if (commentVar?.canLoadMore && comments?.modalVisibility == true) {
      commentVar = {
        ...commentVar,
        canLoadMore: false,
      }
      setCommentsFooterLoader(true);
      getComments();
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
    }
  }

  const updateFeedItemsSpecificField = (feedId, updatedObj) => {
    let index = feed.findIndex(item => item._id == feedId);
    if (index > -1) {
      feed[index] = { ...feed[index], ...updatedObj };
      setFeed([...feed]);
    }
  }


  const filterTheOptions = (options) => {
    if (feedOptionModal?.selectedItem?.is_feature)
      return options.slice().filter(x => x.type != "pin");
    else if (!feedOptionModal?.selectedItem?.is_feature)
      return options.slice().filter(x => x.type != "unpin");
    else return options

  }

  const onLikebtnPress = async (feedId, isLike) => {
    let fd = new FormData();
    fd.append("action", !isLike ? "feedlike" : "feedunlike");
    fd.append("feed", feedId);
    updateFeedItemsSpecificField(feedId, { is_liked: isLike ? false : true });
    let res = await FEED_LIKE_ACTIONS({ token, navigation, formdata: fd });
    if (res.code == 200) {
      updateFeedItemsSpecificField(feedId, {
        is_liked: res?.action_response?.is_liked,
        top_liked_user: res?.action_response?.top_liked_user,
        like_count: res?.action_response?.like_count
      });
    } else {
      updateFeedItemsSpecificField(feedId, { is_liked: isLike });
    }
  }

  const headerView = () =>
  (<AddPost
    ref={addPostRef}
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
      console.log("updateFeedItem", newFeed, index);
      if (index !== -1) {
        feeds.splice(index, 1, newFeed);
      }
      console.log("updateFeedItem after", feeds[index]);
      return [...feeds];
    })}
  />)

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
    />, [feed]);

  return (
    <RootView hideSubHeader>
      <View style={{ flex: 1 }}>
        <FlatList
          data={feed}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id}
          ListHeaderComponent={headerView}
          onEndReached={() => {
            console.log("onEndReached", feedVar)
            if (feedVar?.canLoadMore) {
              feedVar = {
                ...feedVar,
                canLoadMore: false,
              }
              setFeedFooterLoader(true);
              getFeed();
            }
          }}
          renderItem={feedRenderView}
          ListFooterComponent={
            <View style={{ height: 50, alignItems: "center", justifyContent: "center" }}>
              {feedFooterLoader && <SimpleLoader />}
            </View>}
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

      <MyLoader enable={loader} />
    </RootView >
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
]