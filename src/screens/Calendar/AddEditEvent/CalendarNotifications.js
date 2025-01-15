import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native'
import React, { useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import MyInputs from '../../../components/MyInputs'
import MyCheckBox from '../../../components/MyCheckBox'
import { MyButton, TransparentButton } from '../../../components/MyButton'
import { icons } from '../../../utilities/icons'
import MyKeyboardAvoidingView from '../../../components/MyKeyboardAvoidingView'
import capitalize from '../../../functions/capitalize'
import breakReference from '../../../functions/breakReference'
import NotificationModal from '../../../components/ReminderModals/NotificationModal'
import MessageModal from '../../../components/ReminderModals/MessageModal'
import moment from 'moment'
import { ADD_CALENDAR_EVENT, UPDATE_CALENDAR_EVENT, UPDATE_CALENDAR_EVENT_ITERATION, UPDATE_CALENDAR_EVENT_ITERATION_BY_MEMBER } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'
import routes from '../../../navigation/routes'
import EventOptionModal from '../components/EventOptionModal'
import { dateTimeFormat } from '../../../utilities/constants'
import { convertTimezone2 } from '../../../functions/convertTime'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import useBackHandler from '../../../hooks/useBackHandler'



const CalendarNotifications = ({ navigation, route }) => {
  const { data, event, iteration_id, type: eventType, notifications: savedNotifications } = route?.params;
  const isDelegateEvents = eventType == "consultant_user";
  const { token } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone)
  const refNotificationModal = useRef()
  const ref_option = useRef();
  const refMessageModal = useRef();
  const [notifications, setnotifications] = useState(!!savedNotifications ? savedNotifications : !!event?.notify_before ? event?.notify_before : [{ ...notifyObject }])
  const [loader, setLoader] = useState(false);





  //! ///////  APIs

  const onAddEvent = async (body) => {
    let res = await ADD_CALENDAR_EVENT({
      navigation, token, body,
      by: isDelegateEvents ? "by_delegate" : "by_admin"
    });
    setLoader(false)
    if (res.code == 200) {
      if (route.params?.popTo) {
        navigation.pop(2)
      } else {
        navigation.navigate(routes.calendarEventsList, {
          refresh: true
        })
      } 2
    }
  }


  const onEditEvent = async (body) => {
    let res = await UPDATE_CALENDAR_EVENT({
      navigation, token, body, slug: event?.event_slug,
      by: isDelegateEvents ? "by_delegate" : "by_admin"
    });
    setLoader(false)
    if (res.code == 200) {
      navigation.navigate(routes.calendarEventsList, {
        refresh: true
      })
    }
  }

  const onEditIteration = async (body) => {
    let res = await UPDATE_CALENDAR_EVENT_ITERATION({ navigation, token, body, slug: event?.event_slug });
    setLoader(false)
    if (res.code == 200) {
      navigation.navigate(routes.calendarEventsList, {
        refresh: true
      })

    }
  }

  const onEditIterationDelegate = async (body) => {
    let res = await UPDATE_CALENDAR_EVENT_ITERATION_BY_MEMBER({ navigation, token, body, slug: event?.event_slug });
    setLoader(false)
    if (res.code == 200) {
      navigation.navigate(routes.calendarEventsList, {
        refresh: true
      })

    }
  }

  //? Functions
  const onSubmitPress = () => {
    if (isDelegateEvents && !!event) {
      if ((event?.title.trim() != data?.title.trim()) ||
        (convertTimezone2(event?.start_date_time, timezone).format(dateTimeFormat.date) != moment(data?.startDate).format(dateTimeFormat.date)) ||
        (convertTimezone2(event?.start_date_time, timezone).format("HH:mm") != data?.startTime) ||
        (convertTimezone2(event?.end_date_time, timezone).format(dateTimeFormat.date) != moment(data?.endDate).format(dateTimeFormat.date)) ||
        (convertTimezone2(event?.end_date_time, timezone).format("HH:mm") != data?.endTime)
      ) {
        ref_option?.current?.openModal()
      } else {
        onSavePress()
      }

    } else {
      onSavePress()
    }
  }

  const onSavePress = (type = "current") => {
    let body = {
      title: data?.title.trim(),
      color: data?.color,
      description: data?.desc,
      start_date: moment(data?.startDate).format("YYYY-MM-DD"),
      start_time: data?.startTime,
      end_date: moment(data?.endDate).format("YYYY-MM-DD"),
      end_time: data?.endTime,
      is_notify_user: true,
      notify_before: notifications,
      recurring_type: data?.recurringType,
      weekday: data?.weekday
    }
    if (!isDelegateEvents) {
      body = {
        ...body,
        status: data?.status,
        created_for: "",
        group: data?.group.map(x => ({ group_slug: x?.group_slug })),
        member: data?.member.map(x => ({ member_id: x?._id })),
        exclude_members: data?.exclude_members.map(x => ({ _id: x?._id })),

      }
    }
    setLoader(true)
    if (!!event) {
      if (!!iteration_id) {
        body["recurring_type"] = undefined;
        body["iteration_id"] = iteration_id;
        delete body["group"];
        delete body["member"];
        delete body["created_for"];
        delete body["weekday"];
        if (isDelegateEvents) {
          body["update_type"] = type;
          onEditIterationDelegate(body);
        } else {
          onEditIteration(body)
        }
      } else {
        onEditEvent(body)
      }
    } else {
      onAddEvent(body)
    }

  }

  const onBackPress = () => {
    navigation.navigate(routes.calendarEventsAddEdit, {
      notifications, event, iteration_id,
    })
    return true
  }
  useBackHandler(onBackPress)

  const addNotification = () => {
    notifications.push({ ...notifyObject })
    setnotifications([...notifications]);
  }

  const removeNotification = (index) => {
    notifications.splice(index, 1);
    setnotifications([...notifications]);
  }

  const notificationHandler = (update, index) => {
    notifications[index] = {
      ...notifications[index],
      ...update
    }
    setnotifications([...notifications]);
  }

  const notifcationTypeHandler = (type, index) => {
    let obj = breakReference({ ...notifications[index] })
    let iindex = obj.notification_send_type.findIndex(x => x.name == type);
    if (iindex > -1) {
      obj.notification_send_type.splice(iindex, 1);
    } else {
      obj.notification_send_type.push(access[type])
    }
    notifications.splice(index, 1, obj);
    setnotifications([...notifications]);
  }

  const notifcatioDataTypeHandler = (data, index, type) => {
    let obj = breakReference({ ...notifications[index] })
    let iindex = obj.notification_send_type.findIndex(x => x.name == type);
    if (iindex > -1) {
      obj.notification_send_type[iindex] = {
        ...obj.notification_send_type[iindex],
        ...data
      }
      notifications.splice(index, 1, obj);
      setnotifications([...notifications]);
    }
  }

  //*    Views

  const notificationView = ({ item, index }) => {
    let pushNot = item?.notification_send_type.find(x => x.name == "push_notification_access")
    let messageNot = item?.notification_send_type.find(x => x.name == "message_notification_access")
    return (
      <View style={__styles.notificationView} key={"notifcation" + index} >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, paddingVertical: 4 }} >
            <MyCheckBox
              value={!!pushNot}
              onPress={() => notifcationTypeHandler("push_notification_access", index)}
              title={"Notification"} />

          </View>
          {!!pushNot &&
            <View style={__styles.cardViewEditBtn}>
              <TransparentButton
                onPress={() => refNotificationModal?.current?.openModal(item?.notification_send_type.find(x => x.name == "push_notification_access")?.push_notification_info, index)}
                icon={() => icons.editpencil()} />
            </View>}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, paddingVertical: 4 }} >
            <MyCheckBox
              value={!!messageNot}
              onPress={() => notifcationTypeHandler("message_notification_access", index)}
              title={"Message"} />

          </View>
          {!!messageNot &&
            <View style={__styles.cardViewEditBtn}>
              <TransparentButton
                onPress={() => refMessageModal?.current?.openModal(item?.notification_send_type.find(x => x.name == "message_notification_access")?.message_notification_info, index)}
                icon={() => icons.editpencil()} />
            </View>}
        </View>



        <View style={{ marginTop: 10 }}>
          <MyText isLabel>Notify Before</MyText>
          {/* Notify Before */}
          <View style={__styles.alignBtnsRow}>
            <Pressable
              onPress={() => notificationHandler({ notify_before_unit: "minutes" }, index)}
              style={[__styles.alignBtnView, item?.notify_before_unit == "minutes" && __styles.alignSelectedBtnView]}
            >
              <MyText
                type='medium'
                color={item?.notify_before_unit == "minutes" ? colors.black : colors.white} >Minutes</MyText>
            </Pressable>
            <View style={__styles.verticalDivider} />
            <Pressable
              onPress={() => notificationHandler({ notify_before_unit: "hours" }, index)}
              style={[__styles.alignBtnView, item?.notify_before_unit == "hours" && __styles.alignSelectedBtnView]}>
              <MyText
                type='medium'
                color={item?.notify_before_unit == "hours" ? colors.black : colors.white}>Hours</MyText>
            </Pressable>
            <View style={__styles.verticalDivider} />
            <Pressable
              onPress={() => notificationHandler({ notify_before_unit: "days" }, index)}
              style={[__styles.alignBtnView, item?.notify_before_unit == "days" && __styles.alignSelectedBtnView]}>
              <MyText
                type='medium'
                color={item?.notify_before_unit == "days" ? colors.black : colors.white}>Days</MyText>
            </Pressable>
          </View>

          <MyInputs
            label={capitalize(item?.notify_before_unit) + "*"}
            value={String(item?.notify_before_time)}
            onChangeText={(text) => notificationHandler({ notify_before_time: text }, index)}
            keyboardType="number-pad"
          />

        </View>
        <View style={{ alignSelf: "flex-end" }}>
          <TransparentButton
            onPress={() => removeNotification(index)}
            underlayColor={colors.delete + "22"}
            style={{ paddingVertical: 5 }}
            icon={() => icons.minusCircle(colors.delete)}
          />
        </View>
      </View>
    )
  }

  return (
    <RootView
      customBackPress={onBackPress}
      title="Event Notification Setting" >

      <View style={{ flex: 1 }}>
        <MyKeyboardAvoidingView noScrollView >
          <FlatList
            data={notifications}
            renderItem={notificationView}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View>
                <View style={{ alignSelf: "flex-end", marginTop: 10 }}>
                  <TransparentButton
                    onPress={addNotification}
                    style={{ paddingVertical: 5 }}
                    icon={() => icons.plusCircle()}
                    title='Add Notification'
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <MyButton title='Submit' onPress={onSubmitPress} />
                </View>
              </View>
            }
          />
        </MyKeyboardAvoidingView>
      </View>


      <NotificationModal
        ref={refNotificationModal}
        onReminderSavePress={(data, index) => {
          notifcatioDataTypeHandler(data, index, "push_notification_access");
        }}
      />

      <MessageModal
        ref={refMessageModal}
        onReminderSavePress={(data, index) => {
          notifcatioDataTypeHandler(data, index, "message_notification_access");
        }}
      />

      <EventOptionModal
        ref={ref_option}
        title="Perform this action On?"
        onAgree={(type) => onSavePress(type)}
      />
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default CalendarNotifications

const notifyObject = {
  notification_send_type: [],
  notification_title: "",
  notify_before_time: 30,
  notify_before_unit: "minutes"
}

const access = {
  push_notification_access: {
    label: "Notification",
    name: "push_notification_access"
  },
  message_notification_access: {
    label: "Message",
    name: "message_notification_access"
  }
}



const __styles = StyleSheet.create({
  alignSelectedBtnView: {
    backgroundColor: colors.primary,
  },
  alignBtnsRow: {
    flexDirection: 'row',
    alignItems: "center",
    height: 45,
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    marginBottom: 15
  },
  verticalDivider: {
    height: 20,
    width: 1,
    backgroundColor: colors.lightText
  },
  alignBtnView: {
    flex: 1,
    height: "85%",
    borderRadius: 5,
    backgroundColor: colors.transparent,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5
  },
  line: {
    width: "100%",
    height: 0.5,
    backgroundColor: colors.white,
    marginVertical: 10
  },
  notificationView: {
    marginTop: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10
  },
  cardViewEditBtn: { marginBottom: 0 }
})