
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DELETE_ALL_NOTIFICATION, DELETE_SINGAL_NOTIFICATION, GET_NOTIFICATION_LIST, MARK_ALL_NOTIFICATION_AS_READ, MARK_NOTIFICATION_AS_READ } from '../../DAL';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUnReadCount } from '../../redux/reducers/userSlice';
import MyLoader from '../../components/MyLoader';
import { colors } from '../../utilities/colors';
import UserImage from '../../components/UserImage';
import { convertTimezone } from '../../functions/convertTime';
import { selectTimeZone } from '../../redux/reducers/timezoneSlice';
import { icons } from '../../utilities/icons';
import { MenuButton } from '../../components/MyButton';
import OptionModal from '../../components/OptionModal';
import FooterLoader from '../../components/FooterLoader';
import TitleView from '../../components/TitleView';
import EmptyView from '../../components/EmptyView';
import MyRefreshControl from '../../components/MyRefreshControl';
import ConfirmationModal from '../../components/ConfirmationModal';
import showToast from '../../functions/showToast';
import routes from '../../navigation/routes';
import notifee from '@notifee/react-native';
import { selectNavbar } from '../../redux/reducers/navbarSlice';

let nlpage = 0;
let nlCanLoadMore = false




const NotificationList = ({ navigation, route }) => {
  const { token, user } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const { navbar } = useSelector(selectNavbar);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true)
  const [list, setList] = useState([]);
  const [footerLoader, setFooterLoader] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0)
  const [optionModal, setOptionModal] = useState({ isVisible: false, item: null })
  const [confirmationModal, setConfirmationModal] = useState({ isVisible: false, title: "", type: "" })

  useEffect(() => {
    setList([])
    setLoader(true);
    callAPI()
  }, [])

  const callAPI = () => {
    nlpage = 0;
    nlCanLoadMore = false;
    getNotificationListFromServer(true)
  }

  const onRefresh = () => {
    setRefreshing(true)
    callAPI()
  }


  const loadMore = () => {
    if (nlCanLoadMore) {
      nlCanLoadMore = false;
      setFooterLoader(true);
      getNotificationListFromServer()
    }
  }

  //?* option funtcion 

  const onSelected = (opt) => {
    let { item } = optionModal;
    setOptionModal({ isVisible: false, item: null })
    if (opt.key == "read") {
      markReadSingal(item?._id);
    } else if (opt.key == "delete") {
      deleteSingal(item?._id);
    }
  }

  const onAgree = () => {
    let { type } = confirmationModal;
    setConfirmationModal({ isVisible: false, title: "", type: "" })
    if (type == "delete-all") {
      deleteAllNotification()
    }
  }

  //?* navigation

  const onNextScreen = (item) => {
    markReadSingal(item?._id);
    let { notification_type } = item;
    if (feedType.includes(notification_type)) {
      let navigator = "";
      console.log(item, "item")
      if ((item?.tab_type == "the_cosmos" || item?.notification_type == "feed_mentioned") && !!navbar.find(x => x.value == "the_cosmos")) {
        navigator = routes.feedNavigator;
      } else if (item?.tab_type == "event") {
        navigator = routes.portalNavigator;
      } else if (item?.tab_type == "program") {
        navigator = routes.trainingNavigator;
      } else if (item?.tab_type == "mission") {
        navigator = routes.missionNavigator;
      } else {
        if (!!navbar.find(x => x.value == "all_source_feed"))
          navigator = routes.allSourcesFeedNavigator;
        else if (!!navbar.find(x => x.value == "the_source_feed"))
          navigator = routes.sourceFeedNavigator;
      }



      if (!!navigator) {
        let params = { feedId: item?.feeds?._id };
        if (item?.tab_type == "event") {
          params["eventId"] = item?.module_id
          params["feedFor"] = "event"
        } else if (item?.tab_type == "program") {
          params["eventId"] = item?.module_id
          params["feedFor"] = "program"
        } else if (item?.tab_type == "mission") {
          params["eventId"] = item?.module_id
          params["feedFor"] = "mission"
        }


        if (notification_type == "addcomment" || notification_type == "addcommentreply" || notification_type == "commentlike" || notification_type == "feed_comment_mentioned") {
          params["openCommentModal"] = true;
        }
        if (item?.tab_type == "event") {
          console.log(item?.tab_type, "isEvent")
          navigation.reset({
            routes: [{
              name: navigator,
              state: {
                routes: [
                  {
                    name: routes.portalListScreen,
                  },
                  {
                    name: routes.portalDetailScreen,
                    params: {
                      eventId: item?.module_id,
                      feedFor: "event"
                    }
                  },
                  {
                    name: routes.feedDetailScreen,
                    params: params
                  }
                ],
              }
            }],
          })
        } else if (item?.tab_type == "program") {
          navigation.reset({
            routes: [{
              name: navigator,
              state: {
                routes: [
                  {
                    name: routes.traininglist,
                  },
                  {
                    name: routes.trainingDetail,
                    params: {
                      slug: item?.module_info?.program_slug,
                      curtab: "delegate_feed_tab_by_me",
                    }
                  },
                  {
                    name: routes.feedDetailScreen,
                    params: params
                  }],
              }
            }],
          })
        } else if (item?.tab_type == "mission") {
          console.log(navigator, "navigator")
          navigation.reset({
            routes: [{
              name: navigator,
              state: {
                routes: [
                  {
                    name: routes.missionLevel,
                  },
                  {
                    name: routes.missionList,
                    params: {
                      id: item?.module_info?.level_id,
                    }
                  },
                  {
                    name: routes.missionDetail,
                    params: {
                      id: item?.module_info?.mission_id,
                      type: item?.module_info?.type,
                      curTab: "community"
                    }
                  },
                  {
                    name: routes.feedDetailScreen,
                    params: params
                  }],
              }
            }],
          })
        }
      } else {
        navigation.reset({
          routes: [{
            name: navigator,
            state: {
              routes: [{
                name: routes.feedScreen,
              },
              {
                name: routes.feedDetailScreen,
                params: params
              }],
            }
          }],
        })
      }
    }

    else if (notification_type === "goal_statement_completed") {
      navigation.reset({
        routes: [{
          name: routes.goalStatementCompleteNavigator,
          state: {
            routes: [
              {
                name: routes.goalStatementCompleteScreen,
              },
              {
                name: routes.goalStatmentDetail,
                params: {
                  memberId: item?.user_info_sender?.action_id
                }
              }],
          }
        }],
      })
    } else if (notification_type == "message") {
      navigation.reset({
        routes: [{
          name: routes.chatNavigator,
          state: {
            routes: [
              {
                name: routes.chatList,
              },
              {
                name: routes.chatMessageList,
                params: {
                  chatId: item?.message?.chat_id,
                  isOnline: true,
                  memberId: item?.user_info_sender?.action_id,
                  firstName: item?.user_info_sender?.name,
                  lastName: "",
                  lastSeen: "",
                  profileImage: item?.user_info_sender?.profile_image,
                  badge_color: item?.user_info_sender?.color_code
                }
              }],
          }
        }],
      })
    } else if (notification_type == "daily_dynamite_reminder") {
      navigation.reset({
        routes: [{
          name: routes?.accountabilityTrackerNavigator,
        }],
      })

    } else if (notification_type == "dynamite_streak_reminder") {
      navigation.reset({
        routes: [{
          name: routes?.dailyStreakPerformerNavigator,
        }],
      })

    } else if (SupportTicketType.includes(notification_type)) {
      let navigator = "";
      let nestedNavigator = "";
      let params = {
        ticket: { _id: item?.support_ticket?._id },
      }
      if (notification_type == "support_ticket_comment") {
        params["tab"] = 1
      } else if (notification_type == "support_ticket_internal_note") {
        params["tab"] = 2
      }

      let isMineTicket = item?.support_ticket?.action_id == user?._id;

      if (item?.support_ticket?.action_by == "member_user" && !!navbar.find(x => x.value == "support_ticket")) {
        navigator = routes.supportTicketNavigator;
        nestedNavigator = routes?.supportTicketList
      } else if (isMineTicket && !!navbar.find(x => x.value == "support")?.child_options.find(x => x.value == "contact_support")) {
        navigator = routes.contactSupportNavigator;
        nestedNavigator = routes?.ticketList
        params["isMine"] = true;
      } else if (!isMineTicket && !!navbar.find(x => x.value == "internal-tickets")) {
        navigator = routes.internalTicketNavigator;
        nestedNavigator = routes?.supportTicketList
      }

      if (navigator != "" && nestedNavigator != "") {
        navigation.reset({
          routes: [{
            name: navigator,
            state: {
              index: 1,
              routes: [{
                name: nestedNavigator,
              },
              {
                name: routes.supportTicketDeatail,
                params: params
              }
              ],
            }
          }],
        })
      }
    } else if (notification_type == "progress_report_internal_note") {
      navigation.reset({
        routes: [{
          name: routes?.progressNavigator,
          state: {
            routes: [
              {
                name: routes.progresssList,
              },
              {
                name: routes.progresssNotesList,
                params: {
                  reportId: item?.progress_report
                }
              }],
          }
        }],
      })
    } else if (notification_type == "appointment_booking") {
      navigation.reset({
        routes: [{
          name: routes?.bookingNavigator,
          state: {
            routes: [
              {
                name: routes.bookingList,
              }],
          }
        }],
      })
    } else if (notification_type == "event_reminder" && !!navbar.find(x => x.value == "delegate_events")) {
      navigation.reset({
        routes: [{
          name: routes.delegateEventsNavigator,
          state: {
            routes: [
              {
                name: routes.calendarEventsList,
              },
              {
                name: routes.calendarEventDetail,
                params: {
                  eventId: item.event_id?._id,
                  iteration_id: item.iteration_id,
                }
              }],
          }
        }],
      })
    }

  }


  //! APIs

  const getNotificationListFromServer = async (firstTime = false) => {
    let res = await GET_NOTIFICATION_LIST({ token, navigation, page: nlpage })
    if (res.code == 200) {
      let listLength = firstTime ? (0 + res.notification_array.length) : (list.length + res.notification_array.length);
      if (res?.total_notification_count > listLength) {
        nlpage = nlpage + 1;
        nlCanLoadMore = true
      } else {
        notification_array = false
      }
      setList(firstTime ? res.notification_array : [...list, ...res.notification_array])
      setTotal(res?.unread_notification_count);
      setLoader(false)
      setFooterLoader(false)
      setRefreshing(false)
      dispatch(setUnReadCount(res?.unread_notification_count))
      notifee.setBadgeCount(res?.unread_notification_count)
    } else {
      setLoader(false)
      setFooterLoader(false)
      setRefreshing(false)
    }
  }

  const markReadSingal = async (id) => {
    let res = await MARK_NOTIFICATION_AS_READ({ token, navigation, id })
    if (res.code == 200) {
      let temp_total = total;
      let index = list.findIndex(x => x._id == id);
      if (index > -1) {
        if (temp_total > 0) {
          temp_total--;
        }
        notifee.setBadgeCount(temp_total);
        dispatch(setUnReadCount(temp_total))
        setTotal(temp_total)
        list[index].is_seen = true;
        setList([...list]);
      }
    }
  }

  const deleteSingal = async (id) => {
    let res = await DELETE_SINGAL_NOTIFICATION({ token, navigation, id })
    if (res.code == 200) {
      showToast({ title: "Notification has been deleted successfully", type: "success" });
      let index = list.findIndex(x => x._id == id);
      let temp_total = total;
      if (index > -1) {
        if (temp_total > 0) {
          temp_total--;
        }
        if (!list[index].is_seen) {
          notifee.setBadgeCount(temp_total);
          dispatch(setUnReadCount(temp_total))
        }
        list.splice(index, 1);
        setTotal(temp_total)
        setList([...list]);
      }
    }
  }

  const markAllRead = async () => {
    let res = await MARK_ALL_NOTIFICATION_AS_READ({ token, navigation })
    if (res.code == 200) {
      list.forEach(element => {
        element.is_seen = true;
      });
      notifee.setBadgeCount(0);
      dispatch(setUnReadCount(0))
      setTotal(0)
      setList([...list]);
    }
  }

  const deleteAllNotification = async () => {
    let res = await DELETE_ALL_NOTIFICATION({ token, navigation })
    if (res.code == 200) {
      showToast({ title: "All Notifications has been deleted successfully", type: "success" });
      setList([]);
      setTotal(0)
    }
  }

  //! APIs end

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onNextScreen(item)}
        style={[__styles.rootItemView, !item?.is_seen && __styles.rootItemUnseenView]} >
        <View style={[__styles.dot, { backgroundColor: !item?.is_seen ? colors.primary : colors.transparent }]} />

        <View>
          <UserImage
            size={35}
            image={item?.user_info_sender?.profile_image}
            name={item?.notification_title}
            backgroundTransparent
          />
          <View style={__styles.typeIcon}>
            {item?.notification_type.includes("like") ?
              icons.heartFilled(colors.heart, 18) :
              item?.notification_type == "gratitude" ?
                <Image source={icons.gratitude} style={{ height: 18, width: 18 }} /> :
                icons.messageFilled(colors.white, 18)}
          </View>
        </View>
        <View style={{ marginLeft: 15, flex: 1 }}>

          <MyText fontSize={14} type={'medium'} color={item?.is_seen ? colors.lightText : colors.white} >
            {item?.notification_title}</MyText>
          <View style={__styles.timeView}>
            <View opacity={item?.is_seen ? 0.5 : 1}>
              {icons.clockFilled(colors.white, 12)}
            </View>
            <View style={{ marginLeft: 5 }}>
              <MyText
                color={item?.is_seen ? colors.lightText : colors.white}
                fontSize={10} >{convertTimezone(item?.createdAt, timezone).fromNow()}</MyText>
            </View>
          </View>
        </View>

        <MenuButton
          onPress={() => setOptionModal({ isVisible: true, item })}
        />
      </TouchableOpacity>
    )
  }

  const topView = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <TitleView
            title={"Notifications"}
            hideBackBottomButton
            subTitle={`You have ${total} unread messages`}
          />
        </View>
        {list.length > 0 &&
          <>
            {total > 0 &&
              <TouchableOpacity
                onPress={markAllRead}
                style={__styles.btn}>
                {icons.seen(colors.primary, 18)}
              </TouchableOpacity>}

            <TouchableOpacity
              onPress={() => setConfirmationModal({
                isVisible: true,
                title: "Are you sure you want to remove all notifications?",
                type: "delete-all"
              })}
              style={__styles.btn}>
              {icons.trashFilled(colors.primary, 15)}
            </TouchableOpacity>
          </>}
      </View>
    )
  }

  return (
    <RootView titleView={topView} hideNotificaitonIcon hideChatIcon  >
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          renderItem={renderItem}
          onEndReached={loadMore}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          ListEmptyComponent={!loader && !refreshing && <EmptyView label={'No Notifications Found'} />}
          refreshControl={<MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <MyLoader enable={loader} />

      <OptionModal
        optionList={optionsList}
        onSelected={onSelected}
        closeModal={() => setOptionModal({ isVisible: false, item: null })}
        isVisible={optionModal?.isVisible}
      />

      <ConfirmationModal
        isVisible={confirmationModal?.isVisible}
        title={confirmationModal?.title}
        onAgree={onAgree}
        closeModal={() => setConfirmationModal({ isVisible: false, title: "", type: "" })}
      />
    </RootView>
  )
}

export default NotificationList


const optionsList = [
  {
    title: "Mark as read",
    key: "read",
    icon: () => icons.seen(colors.primary, 20)
  },
  {
    title: "Remove this notification",
    key: "delete",
    icon: icons.trash
  },
]


const __styles = StyleSheet.create({
  rootItemView: {
    backgroundColor: colors.secondary,
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    // paddingHorizontal: 10,
    paddingHorizontal: 5,
    paddingLeft: 10,
    borderRadius: 10,
    marginTop: 5
  },
  rootItemUnseenView: {
    backgroundColor: colors.secondaryVariant
  },
  timeView: {
    flexDirection: "row",
    marginTop: 7,
    alignItems: "center"
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 8 / 2,
    backgroundColor: colors.primary,
    marginRight: 5
  },
  btn: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: colors.lightPrimary3,
  },
  typeIcon: {
    position: "absolute",
    bottom: 0,
    right: -5
  }
})



const feedType = ["commentlike", "addcomment", "feedlike", "gratitude", "addcommentreply", "feed_mentioned", "feed_comment_mentioned", "poll_answer", "survey_answer"];
const SupportTicketType = ["support_ticket_internal_note", "send_support_ticket_reminder", "close_support_ticket", "support_ticket_comment", "add_support_ticket", "support_ticket"];