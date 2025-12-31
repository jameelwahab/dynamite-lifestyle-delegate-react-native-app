import {View, FlatList, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import MyText from '../../../components/MyText';
import MyLoader, {SimpleLoader} from '../../../components/MyLoader';
import {STRINGS} from '../../../utilities/strings';
import {
  GET_FEED_LIST,
  GET_COMMENT_LIST,
  GET_LIKE_LIST,
  GET_COMMENT_LIKES_LIST,
  FEED_ACTIONS,
  DELETE_FEED_POST,
  FEED_LIKE_ACTIONS,
  GET_FEED_EXTRA_DATA,
  IS_CHAT_EXIST,
  GET_FEED_DETAIL,
  FEED_POLL_ACTIONS,
  ADD_PERSONAL_NOTE_FOR_PORTAL,
  APPROVE_REVIEW_FEEDS,
} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import FeedView from './FeedView';
import NotifyUser from './NotifyUser';
import {selectTimeZone} from '../../../redux/reducers/timezoneSlice';
import {selectSettings} from '../../../redux/reducers/settingSlice';
import CommentModal from './CommentModal';
import LikeModal from './LikeModal';
import OptionModal from '../../../components/OptionModal';
import {icons} from '../../../utilities/icons';
import ConfirmationModal from '../../../components/ConfirmationModal';
import showToast from '../../../functions/showToast';
import AddPost from './AddPost';
import {selectSocket} from '../../../redux/reducers/socketSlice';
import FeedTabs from '../FeedTabs';
import FeedEvents from '../FeedEvents';
import Leaderboard from '../Leaderboard.js';
import EmptyView from '../../../components/EmptyView';
import {colors} from '../../../utilities/colors';
import routes from '../../../navigation/routes';
import ScheduleModal from './ScheduleModal';
import AddPersonalNoteModal from '../AddPersonalNoteModal';
import MyRefreshControl from '../../../components/MyRefreshControl';
import PollDetailModal from './PollDetailModal';
import SurveyModal from './SurveyModal';
import SurveyDetailModal from './SurveyDetailModal';
import ConfirmationModal2 from '../../../components/ConfirmationModal2';
import isArray from '../../../functions/isArray';
import {Flex} from '../../../UIComponents/FlexViews';

let feedVar = {
  page: 0,
  canLoadMore: false,
};

let commentVar = {
  page: 0,
  canLoadMore: false,
  id: '',
  level: '',
  keywords: [],
};

let likeVar = {
  page: 0,
  canLoadMore: false,
  id: '',
  actionType: '',
};
const FeedScreen = ({
  navigation,
  route,
  CustomHeader,
  CustomTabs,
  showTabView,
  upcomingEvents,
  currentEvents,
  hideTabs = false,
  isScheduleFeedTabAllowed = false,
  schedulePost = false,
}) => {
  const addPostRef = useRef();
  const scheduleModalRef = useRef();
  const ref_surveymodal = useRef();
  const ref_personalNoteModal = useRef();
  const ref_pollInfo = useRef();
  const ref_surveyInfo = useRef();
  const ref_confirmModal = useRef();
  const ref_notify_user = useRef();
  const {feedFor, feedId, eventId = ''} = route?.params;
  const isCosmos = feedFor == 'the_cosmos';
  const isScheduledFeed = feedFor == 'scheduled';
  const isAllSourceFeed = feedFor == 'all_source';
  const isTheSourceFeed = feedFor == 'the_source';
  const isForSource = isScheduledFeed || isAllSourceFeed || isTheSourceFeed;
  const isNoteMainFeed =
    feedFor == 'event' || feedFor == 'program' || feedFor == 'mission';
  const isEventFeed = feedFor == 'event';
  const isProgramFeed = feedFor == 'program';
  const isMissionFeed = feedFor == 'mission';

  const {token, user, access, isChatAllowed, feedSettings, S3_URL} =
    useSelector(selectUser);

  const {socket} = useSelector(selectSocket);
  const timezone = useSelector(selectTimeZone);
  const {settings} = useSelector(selectSettings);
  const [feed, setFeed] = useState([]);
  const [feedData, setFeedData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [feedLevel, setFeedLevel] = useState(
    isNoteMainFeed
      ? 'all'
      : isCosmos
      ? access?.cosmos_feeds_filters
        ? access?.default_filter
        : user?.team_type
      : isAllSourceFeed
      ? 'all'
      : 'dynamite',
  );
  const [feedType, setFeedType] = useState({title: 'All', value: 'all'});
  const [feedTypeMember, setFeedTypeMember] = useState(null);
  const [isRefreshing, setRefreshing] = useState(false);
  const [feedFooterLoader, setFeedFooterLoader] = useState(false);
  const [likesFooterLoader, setLikesFooterLoader] = useState(false);
  const [commentsFooterLoader, setCommentsFooterLoader] = useState(false);
  const [feedOptionModal, setFeedOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
  });
  const [confirmation, setConfirmation] = useState({
    isVisible: false,
    item: null,
    title: '',
    type: '',
  });
  const [cosmosLevels] = useState(makeCosmosLevls());
  const [tab, setTab] = useState(0);
  const [inView, setInView] = useState('');
  const [comments, setComments] = useState({
    modalVisibility: false,
    list: [],
    loader: false,
    focus: false,
  });

  const [likes, setLikes] = useState({
    modalVisibility: false,
    list: [],
    loader: false,
    type: 'like',
  });

  function makeCosmosLevls() {
    return access?.cosmos_feed_filters.map(x => ({
      title: x.split('_').join(' '),
      type: x,
    }));
  }

  // !  API's /////////////////

  const getComments = async (append = false) => {
    let fd = new FormData();
    fd.append('feed_id', commentVar.id);
    let res = await GET_COMMENT_LIST({
      navigation,
      token,
      body: fd,
      page: commentVar.page,
    });
    if (res.code == 200) {
      if (res?.total_pages > 1 + commentVar.page) {
        commentVar = {
          ...commentVar,
          page: commentVar.page + 1,
          canLoadMore: true,
        };
      } else {
        commentVar = {
          ...commentVar,
          canLoadMore: false,
        };
      }

      setComments({
        modalVisibility: true,
        list: !append ? res?.comment : [...comments?.list, ...res?.comment],
        loader: false,
      });
      setCommentsFooterLoader(false);
    } else {
      setComments({
        modalVisibility: true,
        list: [],
        loader: false,
      });
      setCommentsFooterLoader(false);
    }
  };

  const getLikes = async (forCmments, forUserReports = false) => {
    let fd = new FormData();
    fd.append('feed', likeVar.id);
    fd.append('action_type', likeVar.actionType);
    let res;
    if (forCmments) {
      res = await GET_COMMENT_LIKES_LIST({
        navigation,
        token,
        body: fd,
        page: likeVar?.page,
      });
    } else {
      res = await GET_LIKE_LIST({
        navigation,
        token,
        body: fd,
        page: likeVar?.page,
      });
    }
    if (res.code == 200) {
      if (res?.total_pages > 1 + likeVar.page) {
        likeVar = {
          ...likeVar,
          canLoadMore: true,
          page: likeVar.page + 1,
        };
      } else {
        likeVar = {
          ...likeVar,
          canLoadMore: false,
        };
      }
      setLikes(prev => ({
        modalVisibility: true,
        list: [...prev.list, ...res?.feed_activity],
        loader: false,
        type: forUserReports ? 'report' : 'like',
      }));
      setLikesFooterLoader(true);
    } else {
      setLikes({
        modalVisibility: true,
        list: [],
        loader: false,
        type: likes?.type,
      });
      setLikesFooterLoader(true);
    }
  };

  const getFeed = async () => {
    if (!!feedId) {
      getFeedDetail();
    } else {
      getFeedList();
    }
  };

  const getFeedDetail = async () => {
    let res = await GET_FEED_DETAIL({navigation, token, feedId: feedId});
    if (res.code == 200) {
      setFeed([res?.feeds]);
      setLoader(false);
      setFeedFooterLoader(false);
      setRefreshing(false);
      if (route?.params?.openCommentModal) {
        openComments(feedId, false);
      }
    } else {
      setLoader(false);
      setRefreshing(false);
      setFeedFooterLoader(false);
    }
  };

  const getFeedList = async () => {
    let res = await GET_FEED_LIST({
      navigation,
      token,
      type: schedulePost ? 'scheduled' : feedFor,
      level: isCosmos ? feedLevel : undefined,
      page: feedVar.page,
      eventId: eventId,
      feedTypeAction: feedType?.value,
      feedTypeActionId:
        feedType?.value == 'all' || feedType?.value == 'reported'
          ? 'all'
          : feedType?.value == 'own'
          ? user?._id
          : feedType?.value == 'other'
          ? feedTypeMember?._id
          : undefined,
    });
    if (res.code == 200) {
      if (res?.total_pages > 1 + feedVar.page) {
        feedVar = {
          page: feedVar.page + 1,
          canLoadMore: true,
        };
      } else {
        feedVar = {
          ...feedVar,
          canLoadMore: false,
        };
      }

      setFeed(feedVar.page <= 1 ? res?.feeds : [...feed, ...res?.feeds]);
      setLoader(false);
      setRefreshing(false);
      setFeedFooterLoader(false);
    } else {
      setLoader(false);
      setRefreshing(false);
      setFeedFooterLoader(false);
    }
  };

  const api__getFeedExtraData = async () => {
    let res = await GET_FEED_EXTRA_DATA({navigation, token, level: feedFor});
    if (res.code == 200) {
      setFeedData(res);
    }
  };

  const feedAction = async fd => {
    let res = await FEED_ACTIONS({navigation, token, formData: fd});
    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
      resetCounts();
      getFeed();
    }
  };

  const approvePostAPI = async id => {
    let res = await APPROVE_REVIEW_FEEDS({navigation, token, id});
    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
      if (!!feedId) {
        route?.params?.reviewCallback?.(id);
        navigation.goBack();
      }
      // setFeed((list) => list.filter(f => f._id != id));
    }
  };

  const deleteFeedPostAPI = async id => {
    let res = await DELETE_FEED_POST({navigation, token, feedId: id});
    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
      setFeed(list => list.filter(f => f._id != id));
      if (!!feedId) {
        route?.params?.reviewCallback?.(id);
        navigation.goBack();
      }
    }
  };

  const addNotesToServer = async feed => {
    let notes = '';
    if (feed?.feed_type == 'image') {
      feed.feed_images.forEach(item => {
        notes += `<img src='${S3_URL + item?.thumbnail_1}'><br/>`;
      });
    }
    if (feed?.description) {
      notes += `<p>${feed?.description}</p>`;
    }

    setLoader(true);
    let res = await ADD_PERSONAL_NOTE_FOR_PORTAL({
      navigation,
      token,
      feedId: feed?._id,
      memberId: feed?.action_info?.action_id,
      note: notes,
    });
    if (res.code == 200) {
      setLoader(false);
      showToast({type: 'success', title: res?.message});
    } else {
      setLoader(false);
    }
  };
  const resetCounts = () => {
    feedVar = {
      page: 0,
      canLoadMore: false,
    };
    commentVar = {
      page: 0,
      canLoadMore: false,
      id: '',
      level: '',
      keywords: [],
    };
    likeVar = {
      page: 0,
      canLoadMore: false,
      id: '',
      actionType: '',
    };
  };

  // !  SOCKET AND its fcuntions /////////////////

  const socketEmittersForAction = (resp, action = '', extra = {}) => {
    let socketData = {
      action: !!action ? action : resp?.action,
      action_by: user?._id,
      action_response: resp,
      creator_id: resp?.creator_id,
      feed_id: typeof resp?.feed == 'object' ? resp?.feed?._id : resp?.feed,
      token: token,
      ...extra,
    };

    if (isCosmos) {
      socket.emit('delegate_feed_room_action_event', socketData);
    } else {
      socket.emit('feed_room_action_event', socketData);
    }
  };

  const updateComments = data => {
    if (data?.feed_id == commentVar?.id) {
      if (data?.action == 'add_comment') {
        setComments(obj => ({
          ...obj,
          list: [data?.action_response?.comment, ...obj.list],
        }));
        setFeed(list => {
          let index = list.findIndex(
            item => item._id == data?.action_response?.feed?._id,
          );
          if (index > -1) {
            list[index] = {
              ...list[index],
              comment_count: data?.action_response?.feed?.comment_count,
            };
          }
          return [...list];
        });
      } else if (data?.action == 'delete_comment') {
        setComments(obj => ({
          ...obj,
          list: [...obj.list.slice('').filter(x => x._id != data?.comment)],
        }));
        setFeed(list => {
          let index = list.findIndex(
            item => item._id == data?.action_response?.feed?._id,
          );
          if (index > -1) {
            list[index] = {
              ...list[index],
              comment_count: data?.action_response?.feed?.comment_count,
            };
          }
          return [...list];
        });
      } else if (data?.action == 'edit_comment') {
        setComments(obj => {
          let eeditedComment = data?.action_response?.comment;
          let nList = [...obj.list];
          let index = nList.findIndex(x => x._id == eeditedComment?._id);
          if (index > -1) {
            let obj = {
              ...nList[index],
              message: eeditedComment?.message,
              mentioned_users: !!eeditedComment?.mentioned_users
                ? eeditedComment?.mentioned_users
                : [],
            };
            if (!!eeditedComment?.image) {
              obj['image'] = eeditedComment?.image;
            } else {
              delete obj['image'];
            }
            nList.splice(index, 1, obj);
          }
          return {
            ...obj,
            list: [...nList],
          };
        });
      } else if (data?.action == 'delete_comment_reply') {
        setComments(obj => {
          let eeditedComment = data?.action_response?.comment;
          let nList = [...obj.list];
          let index = nList.findIndex(x => x._id == eeditedComment?._id);
          if (index > -1) {
            const filterArr = !!nList[index]?.child_comment
              ? nList[index]?.child_comment.filter(x => x._id != data?.comment)
              : [];

            nList[index].child_comment = filterArr;
            nList[index].child_comments_count =
              eeditedComment?.child_comments_count;
            // nList.splice(index, 1, { ...nList[index], ...eeditedComment });
          }
          return {
            ...obj,
            list: [...nList],
          };
        });

        setFeed(list => {
          let index = list.findIndex(
            item => item._id == data?.action_response?.feed?._id,
          );
          if (index > -1) {
            list[index] = {
              ...list[index],
              comment_count: data?.action_response?.feed?.comment_count,
            };
          }
          return [...list];
        });
      } else if (data?.action == 'add_comment_reply') {
        setComments(obj => {
          let newChildComment = {
            ...data?.action_response?.comment,
            parent_comment: data?.action_response?.parent_comment,
          };
          let pId = data?.action_response?.parent_comment;
          let nList = [...obj.list];
          let index = nList.findIndex(x => x._id == pId);
          if (index > -1) {
            nList.splice(index, 1, {
              ...nList[index],
              child_comment: [newChildComment, ...nList[index].child_comment],
            });
          }

          return {
            ...obj,
            list: nList,
          };
        });

        setFeed(list => {
          let index = list.findIndex(
            item => item._id == data?.action_response?.feed?._id,
          );
          if (index > -1) {
            list[index] = {
              ...list[index],
              comment_count: data?.action_response?.feed?.comment_count,
            };
          }
          return [...list];
        });
      } else if (data?.action == 'edit_comment_reply') {
        setComments(obj => {
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
              nList.splice(index, 1, {
                ...nList[index],
                child_comment: childList,
              });
            }
          }
          return {
            ...obj,
            list: nList,
          };
        });
      } else if (
        data?.action == 'commentunlike' ||
        data?.action == 'commentlike'
      ) {
        setComments(obj => {
          let editedComment = data?.action_response;
          let nList = [...obj.list];
          if (!!editedComment?.parent_comment) {
            let index = nList.findIndex(
              x => x._id == editedComment?.parent_comment,
            );
            if (index > -1) {
              let childList = [...nList[index].child_comment];
              let childIndex = childList.findIndex(
                x => x._id == editedComment?.comment,
              );
              if (childIndex > -1) {
                childList.splice(childIndex, 1, {
                  ...nList[index].child_comment[childIndex],
                  like_count: editedComment?.comment_like_count,
                  is_liked:
                    user?._id == data?.action_by
                      ? editedComment?.is_liked
                      : nList[index].child_comment[childIndex]?.is_liked,
                });
                nList.splice(index, 1, {
                  ...nList[index],
                  child_comment: childList,
                });
              }
            }
          } else {
            let index = nList.findIndex(x => x._id == editedComment?.comment);

            if (index > -1) {
              nList.splice(index, 1, {
                ...nList[index],
                like_count: editedComment?.comment_like_count,
                is_liked:
                  user?._id == data?.action_by
                    ? editedComment?.is_liked
                    : nList[index]?.is_liked,
              });
            }
          }
          return {
            ...obj,
            list: nList,
          };
        });
      }
    } else {
      setFeed(list => {
        let index = list.findIndex(
          item => item._id == data?.action_response?.feed?._id,
        );
        if (index > -1) {
          list[index] = {
            ...list[index],
            comment_count: data?.action_response?.feed?.comment_count,
          };
        }
        return [...list];
      });
    }
  };

  const socketReceiverAction = data => {
    console.log(data, 'data');

    if (data?.action == 'feedlike' || data?.action == 'feedunlike') {
      let obj = {
        like_count: data?.action_response?.like_count,
        top_liked_user: data?.action_response?.top_liked_user,
      };
      console.log(data?.action_response?.creator_id, user?._id, 'check');
      if (data?.action_by == user?._id) {
        obj['is_liked'] = data?.action_response?.is_liked;
      }
      console.log(obj, 'obj');
      updateFeedItemsSpecificField(data?.feed_id, obj);
    }

    if (data?.action.includes('comment')) {
      updateComments(data);
    }

    ref_pollInfo?.current?.socketActionForPollDetailModal(data);
    ref_surveyInfo?.current?.socketActionForSurveyDetailModal(data);

    if (data.action === 'poll_answered') {
      updateFeedItemsSpecificField(data?.feed_obj?._id, {
        poll_info: data?.feed_obj?.poll_info,
      });
      if (data?.action_by?._id == user?._id) {
        updateFeedItemsSpecificField(data?.feed_obj?._id, {
          selected_options: data?.feed_obj?.selected_options,
        });
      }
    } else if (data.action === 'poll_expired') {
      setFeed(list => {
        list.map(x => {
          let index = data.feeds.findIndex(item => item.feed_id == x?._id);
          if (index > -1) {
            x.poll_info.poll_status = 'expired';
          }
        });
        return [...list];
      });
    } else if (data.action === 'survey_answered') {
      updateFeedItemsSpecificField(data?.feed_obj?._id, {
        survey_info: data?.feed_obj?.survey_info,
      });
      if (data?.action_by?._id == user?._id) {
        updateFeedItemsSpecificField(data?.feed_obj?._id, {
          survey_selected_options: data?.feed_obj?.survey_selected_options,
        });
      }
    } else if (data.action === 'survey_expired') {
      setFeed(list => {
        list.map(x => {
          let index = data.feeds.findIndex(item => item.feed_id == x?._id);
          if (index > -1) {
            x.survey_info.survey_status = 'expired';
          }
        });
        return [...list];
      });
    }
  };

  const SocketEvents = () => {
    if (socket?.connected) {
      enableSocketEvents();
    }
    socket.on('connect', () => {
      enableSocketEvents();
    });
    socket.on('disconnect', () => {
      disableSocketEvents();
    });
  };

  const enableSocketEvents = () => {
    socket.emit('delegate_feed_room', 'delegate_live_feed_room');
    socket.emit('live_event_room', 'live_feed_room');
    socket.on('delegate_live_feed_room_reciever', socketReceiverAction);
    socket.on('live_feed_room_reciever', socketReceiverAction);
  };

  const disableSocketEvents = () => {
    socket.off('delegate_live_feed_room_reciever', socketReceiverAction);
    socket.off('live_feed_room_reciever', socketReceiverAction);
  };

  // !  USE  EFFECTS /////////////////

  useEffect(() => {
    resetCounts();
    setFeed([]);
    setLoader(true);
    getFeed();
  }, [feedLevel]);

  useEffect(() => {
    if (feedType?.value == 'other' && !!feedTypeMember == false) {
    } else {
      resetCounts();
      setFeed([]);
      setLoader(true);
      getFeed();
    }
  }, [feedType, feedTypeMember]);

  const onRefresh = () => {
    setRefreshing(true);
    resetCounts();
    getFeed();
  };

  useEffect(() => {
    SocketEvents();
    api__getFeedExtraData();
    return () => {
      disableSocketEvents();
    };
  }, []);

  // !  FUNCTIONALITIES /////////////////

  const changeTab = newTab => {
    setTab(newTab);
  };

  const selectFeedlevel = lvl => {
    // setLoader(true);
    // setFeed([])
    setFeedLevel(lvl);
  };

  const openComments = (id, focus) => {
    let curFeed = feed.find(fed => fed._id == id);
    commentVar = {
      page: 0,
      canLoadMore: false,
      id: id,
      level: !!curFeed ? curFeed?.created_for_level_or_type : '',
      keywords: isArray(curFeed?.feed_keywords)
        ? [
            ...new Map(
              curFeed?.feed_keywords.map(item => [item.value, item]),
            ).values(),
          ]
        : [],
      feed_badge_levels: curFeed?.feed_badge_levels,
    };
    setComments({
      list: [],
      modalVisibility: true,
      loader: true,
      focus: focus,
    });

    getComments();
  };

  const showLikesOfComments = id => {
    setLikes({
      list: [],
      modalVisibility: true,
      loader: true,
      type: 'like',
    });
    likeVar = {
      ...likeVar,
      id: id,
      actionType: 'like',
    };
    getLikes(true);
  };

  const showLikes = id => {
    setLikes({
      list: [],
      modalVisibility: true,
      loader: true,
      type: 'like',
    });
    likeVar = {
      page: 0,
      canLoadMore: false,
      id: id,
      actionType: 'all',
    };
    getLikes(false);
  };

  const onCommentEndReached = () => {
    if (commentVar?.canLoadMore && comments?.modalVisibility == true) {
      commentVar = {
        ...commentVar,
        canLoadMore: false,
      };
      setCommentsFooterLoader(true);
      getComments(true);
    }
  };

  const onLikesEndReached = () => {
    if (likeVar?.canLoadMore && likes?.modalVisibility == true) {
      likeVar = {
        ...likeVar,
        canLoadMore: false,
      };
      setLikesFooterLoader(true);
      getLikes(false);
    }
  };

  const openOptions = item => {
    setFeedOptionModal({
      isVisible: true,
      selectedItem: item,
    });
  };

  const confirmationAction = () => {
    if (confirmation.type == 'pin' || confirmation.type == 'unpin') {
      let fd = new FormData();
      fd.append('feed', confirmation?.item?._id);
      fd.append('action', confirmation.type == 'pin' ? 'feature' : 'unfeature');
      feedAction(fd);
    } else if (confirmation.type == 'delete') {
      deleteFeedPostAPI(confirmation?.item?._id);
    } else if (confirmation?.type == 'approve') {
      approvePostAPI(confirmation?.item?._id);
    }

    setConfirmation({
      isVisible: false,
      item: null,
      title: '',
      type: null,
    });
  };

  const actionOfFeedOptions = selectedOpt => {
    let item = feedOptionModal.selectedItem;
    setFeedOptionModal({
      isVisible: false,
      selectedItem: null,
    });
    if (selectedOpt?.type == 'pin' || selectedOpt?.type == 'unpin') {
      setTimeout(() => {
        setConfirmation({
          isVisible: true,
          item: item,
          title: `Are you sure you want to ${selectedOpt?.title} this post?`,
          type: selectedOpt?.type,
        });
      }, 500);
    } else if (selectedOpt?.type == 'delete') {
      setTimeout(() => {
        setConfirmation({
          isVisible: true,
          item: item,
          title: `Are you sure you want to delete this post?`,
          type: selectedOpt?.type,
        });
      }, 500);
    } else if (selectedOpt?.type == 'edit') {
      setTimeout(() => {
        addPostRef?.current?.selectItemForEdit(item);
      }, 500);
    } else if (selectedOpt?.type == 'message') {
      onChatScreen(item?.action_info?.action_id);
    } else if (selectedOpt?.type == 'notes') {
      console.log(item, 'feed');
      if (item?.action_info?.action_by == 'consultant_user') {
        setTimeout(() => {
          let notes = '';
          if (item?.feed_type == 'image') {
            item.feed_images.forEach(item => {
              notes += `<img src='${S3_URL + item?.thumbnail_1}'><br/>`;
            });
          }
          if (item?.description) {
            notes += `<p>${item?.description}</p>`;
          }

          ref_personalNoteModal?.current?.openModal(notes, item?._id);
        }, 500);
      } else {
        setTimeout(() => {
          ref_confirmModal?.current?.openModal({
            title: `Are you sure you want to add as ${item?.action_info?.name}'s personal note ?`,
            agreeFunc: () => addNotesToServer(item),
          });
        }, 500);
      }
    } else if (selectedOpt?.type == 'approve') {
      setTimeout(() => {
        setConfirmation({
          isVisible: true,
          item: item,
          title: `Are you sure you want to approve this post?`,
          type: selectedOpt?.type,
        });
      }, 500);
    } else if (selectedOpt?.type == 'reported_by') {
      setTimeout(() => {
        getUserWhoReportedFeed(item);
      }, 500);
    } else if (selectedOpt?.type == 'notify') {
      setTimeout(() => {
        ref_notify_user?.current.openModal(item?._id);
      }, 500);
    }
  };

  const onMessagePress = item => {
    if (!!item?.user_info_action_by?.action_id) {
      onChatScreen(item?.user_info_action_by?.action_id);
      setLikes({
        modalVisibility: false,
        list: [],
        loader: false,
      });
    }
  };

  const onCommentMessagePress = item => {
    if (!!item?.user_info_action_by?.action_id) {
      onChatScreen(item?.user_info_action_by?.action_id);
      setComments({
        modalVisibility: false,
        list: [],
        loader: false,
        id: '',
      });
    }
  };

  const onChatScreen = async memberId => {
    let res = await IS_CHAT_EXIST({token, navigation, memberId});
    if (res.code == 200) {
      if (res.is_chat_exist) {
        let member = res.chat.member.find(x => x._id != user?._id);
        navigation.navigate(routes.chatMessageList, {
          isOnline: member?.is_online,
          memberId: member?._id,
          firstName: member?.first_name,
          lastName: member?.last_name,
          lastSeen: '',
          profileImage: !!member?.profile_image ? member?.profile_image : '',
          chatId: res?.chat?._id,
          canGoBack: true,
          badge_color: member?.color_code,
          resetCountToZero: () => {},
          refresh: () => {},
        });
      } else {
        let member = res.user_info;
        navigation.navigate(routes.chatMessageList, {
          isOnline: member?.is_online,
          memberId: member?._id,
          firstName: member?.first_name,
          lastName: member?.last_name,
          lastSeen: !!member?.last_login_activity
            ? member?.last_login_activity
            : '',
          profileImage: !!member?.member ? member?.member : '',
          chatId: '',
          canGoBack: true,
          badge_color: member?.color_code,
          resetCountToZero: () => {},
          refresh: () => {},
        });
      }
    }
  };

  const onFeedDetail = id => {
    navigation.navigate(routes.feedDetailScreen, {
      feedId: id,
    });
  };

  const updateFeedItemsSpecificField = (feedId, updatedObj) => {
    setFeed(list => {
      let index = list.findIndex(item => item._id == feedId);
      if (index > -1) {
        list[index] = {...list[index], ...updatedObj};
      }
      return [...list];
    });
  };

  const removeFromList = id => {
    setFeed(list => list.filter(f => f._id != id));
  };

  const updateFeedCommentCount = (feedId, count) => {
    setFeed(list => {
      let index = list.findIndex(item => item._id == feedId);
      if (index > -1) {
        let newCount = !!list[index].comment_count
          ? list[index].comment_count
          : 0;
        newCount = newCount + count;
        if (newCount <= 0) {
          newCount = 0;
        }
        list[index] = {...list[index], comment_count: newCount};
      }
      return [...list];
    });
  };

  const filterTheOptions = options => {
    if (feedOptionModal.isVisible) {
      let feed = feedOptionModal?.selectedItem;
      let newList = [];
      let isMine = feed?.action_info?.action_id == user?._id;

      options.forEach(item => {
        if (
          item.type == 'pin' &&
          feed?.review_status == 'approved' &&
          !feed?.is_reported &&
          !isCosmos
        ) {
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

        if (
          item.type == 'unpin' &&
          feed?.review_status == 'approved' &&
          !feed?.is_reported &&
          !isCosmos
        ) {
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

        if (item.type == 'edit') {
          if (isMine) {
            if (
              (feed?.feed_type == 'poll' &&
                feed?.poll_info?.poll_status == 'expired') ||
              (feed?.feed_type == 'survey' &&
                feed?.survey_info?.survey_status == 'expired')
            ) {
            } else {
              newList.push(item);
            }
          } else {
            if (!isCosmos) {
              if (access?.edit_delete_option_in_source_all_source_feeds) {
                if (
                  (feed?.feed_type == 'poll' &&
                    feed?.poll_info?.poll_status == 'expired') ||
                  (feed?.feed_type == 'survey' &&
                    feed?.survey_info?.survey_status == 'expired')
                ) {
                } else {
                  newList.push(item);
                }
              }
            }
          }
        }

        if (item.type == 'delete') {
          if (isMine) {
            newList.push(item);
          } else {
            if (!isCosmos) {
              if (access?.edit_delete_option_in_source_all_source_feeds) {
                newList.push(item);
              }
            }
          }
        }

        if (item.type == 'notes' && feed?.review_status == 'approved') {
          if (isEventFeed) {
            // if (!isMine && item.action_info?.action_by != "consultant_user") {
            if (feed?.feed_type != 'poll' && feed?.feed_type != 'survey') {
              newList.push(item);
            }
            // }
          }
        }

        if (item.type == 'message' && feed?.review_status == 'approved') {
          console.log(isChatAllowed, 'isChatAllowed');
          if (isChatAllowed) {
            if (!isMine && feed.action_info?.action_by != 'consultant_user') {
              newList.push(item);
            }
          }
        }

        if (item.type == 'approve' && feed?.review_status == 'pending') {
          newList.push(item);
        }

        if (item.type == 'reported_by' && feed?.is_reported) {
          newList.push(item);
        }

        if (item?.type == 'notify' && access?.notify_users_on_create_post) {
          if (isMine && (isAllSourceFeed || isTheSourceFeed)) {
            newList.push(item);
          }
        }
      });

      return newList;
    }
  };

  const filterTheOptionsCount = feed => {
    let newList = [];
    let isMine = feed?.action_info?.action_id == user?._id;

    feedOptionList.forEach(item => {
      if (
        item.type == 'pin' &&
        feed?.review_status == 'approved' &&
        !isCosmos
      ) {
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

      if (
        item.type == 'unpin' &&
        feed?.review_status == 'approved' &&
        !isCosmos
      ) {
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

      if (item.type == 'edit') {
        if (isMine) {
          if (
            (feed?.feed_type == 'poll' &&
              feed?.poll_info?.poll_status == 'expired') ||
            (feed?.feed_type == 'survey' &&
              feed?.survey_info?.survey_status == 'expired')
          ) {
          } else {
            newList.push(item);
          }
        } else {
          if (!isCosmos) {
            if (access?.edit_delete_option_in_source_all_source_feeds) {
              if (
                (feed?.feed_type == 'poll' &&
                  feed?.poll_info?.poll_status == 'expired') ||
                (feed?.feed_type == 'survey' &&
                  feed?.survey_info?.survey_status == 'expired')
              ) {
              } else {
                newList.push(item);
              }
            }
          }
        }
      }

      if (item.type == 'delete') {
        if (isMine) {
          newList.push(item);
        } else {
          if (!isCosmos) {
            if (access?.edit_delete_option_in_source_all_source_feeds) {
              newList.push(item);
            }
          }
        }
      }

      if (item.type == 'notes' && feed?.review_status == 'approved') {
        if (isEventFeed) {
          // if (!isMine && item.action_info?.action_by != "consultant_user") {
          if (feed?.feed_type != 'poll' && feed?.feed_type != 'survey') {
            newList.push(item);
          }
          // }
        }
      }

      if (item.type == 'message' && feed?.review_status == 'approved') {
        if (isChatAllowed) {
          if (!isMine && feed.action_info?.action_by != 'consultant_user') {
            newList.push(item);
          }
        }
      }

      if (item.type == 'approve' && feed?.review_status == 'pending') {
        newList.push(item);
      }

      if (item.type == 'reported_by' && feed?.is_reported) {
        newList.push(item);
      }

      if (item?.type == 'notify' && access?.notify_users_on_create_post) {
        if (isMine && (isAllSourceFeed || isTheSourceFeed)) {
          newList.push(item);
        }
      }
    });
    return newList.length;
  };

  const pollAction = async (feedId, optionId) => {
    let resp = await FEED_POLL_ACTIONS({token, navigation, feedId, optionId});
    if (resp.code == 200) {
    } else {
    }
  };

  const openPollDetail = item => {
    ref_pollInfo?.current?.openModal(item);
  };

  const onStartQuestionnairPress = item => {
    // ref_pollInfo?.current?.openModal(item)
    ref_surveymodal?.current?.openModal(item);
  };

  const openSurveyDetail = item => {
    ref_surveyInfo?.current?.openModal(item);
  };

  const getUserWhoReportedFeed = async feed => {
    setLikes({
      list: [],
      modalVisibility: true,
      loader: true,
      type: 'report',
    });
    likeVar = {
      page: 0,
      canLoadMore: false,
      id: feed?._id,
      actionType: 'feed_report',
    };
    getLikes(false, true);
  };

  const onLikebtnPress = async (feedId, isLike) => {
    let fd = new FormData();
    fd.append('action', !isLike ? 'feedlike' : 'feedunlike');
    fd.append('feed', feedId);
    updateFeedItemsSpecificField(feedId, {is_liked: isLike ? false : true});
    let res = await FEED_LIKE_ACTIONS({token, navigation, formdata: fd});
    if (res.code == 200) {
      socketEmittersForAction(res?.action_response, '');
      // updateFeedItemsSpecificField(feedId, {
      //   is_liked: res?.action_response?.is_liked,
      //   top_liked_user: res?.action_response?.top_liked_user,
      //   like_count: res?.action_response?.like_count
      // });
    } else {
      updateFeedItemsSpecificField(feedId, {is_liked: isLike});
    }
  };

  // !  VIEWS /////////////////

  const footerView = () => {
    if (tab == 0) {
      return (
        <View style={styles.footerLoaderContainer}>
          {feedFooterLoader && <SimpleLoader />}
        </View>
      );
    } else if (tab == 1) {
      return (
        <FeedEvents
          upcomingEvents={
            isEventFeed ? upcomingEvents : feedData?.upcoming_events_array
          }
          currentEvent={
            isEventFeed ? currentEvents : feedData?.current_events_array
          }
          isEventFeed={isEventFeed}
          noticeboard={feedData?.notice_board}
        />
      );
    } else if (tab == 2 && isScheduleFeedTabAllowed) {
      return (
        <View style={styles.scheduledFeedContainer}>
          <FeedScreen
            filterTheOptions={filterTheOptionsCount}
            navigation={navigation}
            route={route}
            hideTabs={true}
            isScheduleFeedTabAllowed={true}
            schedulePost={true}
          />
        </View>
      );
    } else if (isEventFeed) {
      return showTabView(tab);
    } else if (tab == 2) {
      return (
        <Leaderboard
          monthlyCounts={feedData?.consultant_list_by_monthly_count}
          weeklyCounts={feedData?.consultant_list_by_weekly_count}
          isCosmos={isCosmos}
          affiliateMember={feedData?.affiliate_member}
          pages={feedData?.sale_pages}
          user={user}
        />
      );
    } else return null;
  };

  const onViewableItemsChanged = React.useCallback(item => {
    if (
      !!item?.viewableItems[1] &&
      item?.viewableItems[1]?.item?.is_reward_feed == true
    ) {
      setInView(item?.viewableItems[1]?.item?._id);
    } else if (
      !!item?.viewableItems[0] &&
      item?.viewableItems[0]?.item?.is_reward_feed == true
    ) {
      setInView(item?.viewableItems[0]?.item?._id);
    }
  }, []);

  const headerView = () => {
    return (
      <View style={styles.headerContainer}>
        {!!!feedId && (
          <>
            {route?.params?.title && (
              <View style={styles.titleContainer}>
                <MyText fontSize={18} type="bold" color={colors.primary}>
                  {route?.params?.title}
                </MyText>
              </View>
            )}
            {!!CustomHeader && CustomHeader()}
            {!hideTabs && (
              <FeedTabs
                CustomTabs={CustomTabs}
                isCosmos={isCosmos}
                tab={tab}
                changeTab={changeTab}
                isScheduleFeedTabAllowed={isScheduleFeedTabAllowed}
              />
            )}
          </>
        )}

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
          updateFeedItem={newFeed =>
            setFeed(feeds => {
              let index = feeds.findIndex(feed => feed._id === newFeed?._id);
              if (index !== -1) {
                feeds.splice(index, 1, newFeed);
              }
              return [...feeds];
            })
          }
          hideOnlyAddPostView={feedType?.value == 'reported'}
          hideAddView={!!feedId}
          isCosmos={isCosmos}
          isScheduledFeed={isScheduledFeed || schedulePost}
          isNoteMainFeed={isNoteMainFeed}
          isEventFeed={isEventFeed}
          isMissionFeed={isMissionFeed}
          isProgramFeed={isProgramFeed}
          eventId={isNoteMainFeed ? eventId : ''}
          timezone={timezone}
          removeFromList={removeFromList}
          isSuperDelegate={user?.is_super_delegate}
          hideLevelView={
            isNoteMainFeed ||
            isForSource ||
            (isCosmos && !access?.cosmos_feeds_filters)
          }
          isMultipleSelectAllowed={
            access?.multiple_levels_in_source_all_source_scadule_feeds
          }
          showEventOption={
            !isNoteMainFeed &&
            !isCosmos &&
            access?.event_info_in_source_all_source_scadule_feeds
          }
          cosmosLevelList={access?.cosmos_feed_filters}
          defaultCosmosFilter={access?.default_filter}
          selectLevelOptionOnAddPostForCosmos={
            isCosmos && access?.choose_level_in_cosmos_feeds
          }
          isPollAllowed={access?.enable_poll_feed}
          isSurveyAllowed={access?.enable_survey_feed}
          isFeedFilterAllowed={
            (isAllSourceFeed || isTheSourceFeed) &&
            access?.is_feed_search_allowed
          }
          feedType={feedType}
          setFeedType={setFeedType}
          feedTypeMember={feedTypeMember}
          setFeedTypeMember={setFeedTypeMember}
        />
      </View>
    );
  };

  const feedRenderView = useCallback(
    ({item, index}) => (
      <FeedView
        S3_URL={S3_URL}
        filterTheOptions={filterTheOptionsCount}
        isInView={inView == item?._id}
        item={item}
        index={index}
        feedSettings={feedSettings}
        timezone={timezone}
        user={user}
        token={token}
        settings={settings}
        openComments={openComments}
        showLikes={showLikes}
        openOptions={openOptions}
        onLikebtnPress={onLikebtnPress}
        isCosmos={isCosmos}
        isNoteMainFeed={isNoteMainFeed}
        isScheduledFeed={isScheduledFeed}
        sourceLevelIcons={feedData?.feed_setting}
        openScheduleTimeModal={scheduleModalRef?.current?.openScheduleTimeModal}
        onFeedDetail={onFeedDetail}
        onVotePress={pollAction}
        pollSettings={settings?.pollSettings}
        openPollDetail={openPollDetail}
        onStartQuestionnairPress={onStartQuestionnairPress}
        openSurveyDetail={openSurveyDetail}
        onReportedPress={() => getUserWhoReportedFeed(item)}
      />
    ),
    [feed, inView],
  );

  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 50});

  return (
    <Flex flex={1}>
      <Flex flex={1} style={styles.flatListContainer}>
        <FlatList
          data={tab == 0 ? feed : []}
          refreshControl={
            <MyRefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item?._id}
          ListHeaderComponent={headerView()}
          ListEmptyComponent={
            !loader &&
            tab == 0 && <EmptyView label={STRINGS.FEED_SCREEN.postsNotFound} />
          }
          onEndReached={() => {
            if (!!!feedId && feedVar?.canLoadMore && tab == 0) {
              feedVar = {
                ...feedVar,
                canLoadMore: false,
              };
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
      </Flex>

      <CommentModal
        isVisible={comments?.modalVisibility}
        timezone={timezone}
        closeModal={() =>
          setComments({
            modalVisibility: false,
            list: [],
            loader: false,
            id: '',
          })
        }
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
        keywords={commentVar?.keywords}
        setComments={setComments}
        updateFeedItemsSpecificField={updateFeedItemsSpecificField}
        socketEmittersForAction={socketEmittersForAction}
        isCosmos={isCosmos}
        hasEditDeleteAccess={
          isAllSourceFeed || isTheSourceFeed || isNoteMainFeed
            ? access?.edit_delete_option_in_source_all_source_feeds
            : false
        }
        isNoteMainFeed={isNoteMainFeed}
        eventId={eventId}
        feedCreatedFor={commentVar?.feed_badge_levels}
        onCommentMessagePress={onCommentMessagePress}
        isChatAllowed={isChatAllowed}
      />

      <LikeModal
        type={likes?.type}
        isVisible={likes?.modalVisibility}
        timezone={timezone}
        closeModal={() => {
          setLikes(prev => ({
            ...prev,
            modalVisibility: false,
            list: [],
            loader: false,
          }));
          setTimeout(() => {
            setLikes(prev => ({
              ...prev,
              type: 'like',
            }));
          }, 500);
        }}
        likes={likes?.list}
        user={user}
        loader={likes?.loader}
        onEndReached={onLikesEndReached}
        footerLoader={likesFooterLoader}
        onMessagePress={onMessagePress}
        isChatAllowed={isChatAllowed}
      />

      <OptionModal
        optionList={filterTheOptions(feedOptionList)}
        closeModal={() =>
          setFeedOptionModal({isVisible: false, selectedItem: null})
        }
        onSelected={actionOfFeedOptions}
        isVisible={feedOptionModal?.isVisible}
      />

      <ConfirmationModal
        closeModal={() =>
          setConfirmation({isVisible: false, title: '', item: null, type: ''})
        }
        isVisible={confirmation.isVisible}
        onAgree={confirmationAction}
        title={confirmation.title}
      />

      <ConfirmationModal2 ref={ref_confirmModal} />

      <ScheduleModal ref={scheduleModalRef} />

      <AddPersonalNoteModal ref={ref_personalNoteModal} />

      <SurveyModal
        ref={ref_surveymodal}
        token={token}
        navigation={navigation}
      />

      <SurveyDetailModal
        member={user}
        token={token}
        ref={ref_surveyInfo}
        timezone={timezone}
        navigation={navigation}
      />

      <PollDetailModal
        member={user}
        token={token}
        ref={ref_pollInfo}
        timezone={timezone}
        navigation={navigation}
      />

      <NotifyUser ref={ref_notify_user} token={token} navigation={navigation} />

      <MyLoader enable={loader} />
    </Flex>
  );
};

export default FeedScreen;

const feedOptionList = [
  {
    icon: icons.edit,
    title: STRINGS.FEED_SCREEN.edit,
    type: 'edit',
  },
  {
    icon: icons.trash,
    title: STRINGS.FEED_SCREEN.delete,
    type: 'delete',
  },
  {
    icon: icons.pin,
    title: STRINGS.FEED_SCREEN.pin,
    type: 'pin',
  },
  {
    icon: icons.pin,
    title: STRINGS.FEED_SCREEN.unpin,
    type: 'unpin',
  },
  {
    icon: () => icons.warnOctagon(colors.primary, 17),
    title: STRINGS.FEED_SCREEN.reportedBy,
    type: 'reported_by',
  },
  {
    icon: () => icons.send(colors.primary, 17),
    title: STRINGS.FEED_SCREEN.message,
    type: 'message',
  },

  {
    icon: () => icons.notes(colors.primary, 17),
    title: STRINGS.FEED_SCREEN.addAsPersonalNotes,
    type: 'notes',
  },

  {
    icon: () => icons.check_circle(colors.primary, 17),
    title: STRINGS.FEED_SCREEN.approve,
    type: 'approve',
  },
  {
    icon: () => icons.notification(colors.primary, 17),
    title: STRINGS.FEED_SCREEN.notifyUsers,
    type: 'notify',
  },
];

const styles = StyleSheet.create({
  flatListContainer: {
    marginHorizontal: -10,
  },
  footerLoaderContainer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduledFeedContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  headerContainer: {
    paddingHorizontal: 10,
  },
  titleContainer: {
    marginTop: 5,
  },
});
