
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
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

let nlpage = 0;
let nlCanLoadMore = false




const NotificationList = ({ navigation, route }) => {
  const { token } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true)
  const [list, setList] = useState([]);
  const [footerLoader, setFooterLoader] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0)
  const [optionModal, setOptionModal] = useState({ isVisible: false, item: null })
  const [confirmationModal, setConfirmationModal] = useState({ isVisible: false, title: "", type: "" })

  useEffect(() => {
    setLoader(true);
    callAPI()
  }, [])

  const callAPI = () => {
    nlpage = 0;
    nlCanLoadMore = false;
    setList([])
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
    let { notification_type } = item;
    if (
      notification_type === "commentlike" ||
      notification_type === "feedlike" ||
      notification_type === "gratitude" ||
      notification_type === "add_comment" ||
      notification_type === "goal_statement_save_and_close_status" ||
      notification_type === "add_comment_reply"
    ) {

    } else if (notification_type === "goal_statement_completed") {
      // navigation.jumpTo({
      //   routes: [{
      //     name: routes.goalStatementCompleteNavigator,
      //     state: {
      //       routes: [
      //         {
      //           name: routes.goalStatementCompleteScreen,
      //           params: {
      //             chatId: data?.chat_id,
      //             isOnline: profile?.is_online,
      //             memberId: profile?.action_id,
      //             firstName: profile?.name,
      //             lastName: "",
      //             lastSeen: "",
      //             profileImage: profile?.profile_image,
      //           }
      //         },
      //         {
      //           name: routes.chatMessageList,
      //           params: {
      //             chatId: data?.chat_id,
      //             isOnline: profile?.is_online,
      //             memberId: profile?.action_id,
      //             firstName: profile?.name,
      //             lastName: "",
      //             lastSeen: "",
      //             profileImage: profile?.profile_image,
      //           }
      //         }],
      //     }
      //   }],
      // })
    } else if (notification_type == "daily_dynamite_reminder") {
      navigation.jumpTo(routes?.accountabilityTrackerNavigator)
      markReadSingal(item?._id);
    } else if (notification_type == "dynamite_streak_reminder") {
      navigation.jumpTo(routes?.dailyStreakPerformerNavigator)
      markReadSingal(item?._id);
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
      let index = list.findIndex(x => x._id == id);
      if (index > -1) {
        list[index].is_seen = true;
        setList([...list]);
      }
    }
  }

  const deleteSingal = async (id) => {
    let res = await DELETE_SINGAL_NOTIFICATION({ token, navigation, id })
    if (res.code == 200) {
      showToast({ title: res.message, type: "success" });
      let index = list.findIndex(x => x._id == id);
      if (index > -1) {
        list.splice(index, 1);
        setTotal((count) => --count)
        setList([...list]);
      }
    }
  }

  const markAllRead = async () => {
    let res = await MARK_ALL_NOTIFICATION_AS_READ({ token, navigation })
    if (res.code == 200) {
      let index = list.findIndex(x => x._id == id);
      list.forEach(element => {
        element.is_seen = true;
      });
      setTotal((count) => --count)
      setList([...list]);
    }
  }

  const deleteAllNotification = async () => {
    let res = await DELETE_ALL_NOTIFICATION({ token, navigation })
    if (res.code == 200) {
      showToast({ title: res.message, type: "success" });
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
            name={item?.user_info_sender?.name}
            backgroundTransparent
          />
          <View style={__styles.typeIcon}>
            {item?.notification_type.includes("like") ?
              icons.heartFilled(colors.heart,18) :
              item?.notification_type=="gratitude"?
              icons.gra
               null}
          </View>
        </View>
        <View style={{ marginLeft: 10, flex: 1 }}>

          <MyText fontSize={14} type={item?.is_seen ? 'light' : 'medium'} color={item?.is_seen ? colors.lightText : colors.white} >
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

        <TouchableOpacity
          onPress={markAllRead}
          style={__styles.btn}>
          {icons.seen(colors.primary, 18)}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setConfirmationModal({
            isVisible: true,
            title: "Are you sure you want to remove all notifications?",
            type: "delete-all"
          })}
          style={__styles.btn}>
          {icons.trashFilled(colors.primary, 15)}
        </TouchableOpacity>

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


