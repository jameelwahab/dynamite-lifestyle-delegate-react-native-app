import { View, Text, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyInputs from '../../../components/MyInputs'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { MyButton } from '../../../components/MyButton'
import { GET_GROUPS_AND_MEMBERS_FOR_CALENDAR, } from '../../../DAL'
import MyKeyboardAvoidingView from '../../../components/MyKeyboardAvoidingView'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'
import MyChip from '../../../components/MyChip'
import showToast from '../../../functions/showToast'
import MyLoader from '../../../components/MyLoader'
import { icons } from '../../../utilities/icons'
import Collapsible from 'react-native-collapsible'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import CalendarModal from '../../../components/CalendarModal'
import TimePicker from '../../../components/TimePicker'
import ColorModal from '../../../components/ColorModal'
import routes from '../../../navigation/routes'
import Editor from '../../../components/Editor'
import { convertTimezone2 } from '../../../functions/convertTime'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'


const GroupAddEdit = ({ navigation, route }) => {
  const { event, iteration_id, type: eventType } = route?.params;
  const isDelegateEvents = eventType == "consultant_user";
  const isEdit = !!event;
  const isEditIteration = !!iteration_id;
  const { token } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone)
  const ref_calendar = useRef();
  const ref_timePicker = useRef();
  const [loader, setLoader] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [colorModal, setColorModal] = useState(false);
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    type: "",
  })
  const [groupData, updateGroupData] = useState({
    title: !!event?.title ? event?.title : "",
    status: isEdit && !!event?.status == false ? false : true,
    group: !!event?.group ? event?.group.map(x => x?._id) : [],
    member: !!route?.params?.member ? [route?.params?.member] : !!event?.member ? event?.member.map(x => x?._id) : [],
    exclude_members: !!route?.params?.event?.exclude_members ? route?.params?.event?.exclude_members.map(x => x?._id): !!event?.excluded_members ? event?.excluded_members.map(x => x) : [],
    startDate: !!event?.start_date_time ? convertTimezone2(event?.start_date_time, timezone) : moment(),
    startTime: !!event?.start_date_time ? convertTimezone2(event?.start_date_time, timezone).format("HH:mm") : moment().format("HH:mm"),
    endDate: !!event?.end_date_time ? convertTimezone2(event?.end_date_time, timezone) : moment(),
    endTime: !!event?.end_date_time ? convertTimezone2(event?.end_date_time, timezone).format("HH:mm") : moment().format("HH:mm"),
    weekday: !!event?.weekday ? event?.weekday : [],
    recurringType: !!event?.recurring_type ? event?.recurring_type : "daily",
    color: !!event?.color ? event?.color : "#000000",
    desc: !!route?.params?.note ? route?.params?.note : !!event?.description ? event?.description : ""

  })
  const setGroupData = (update) => updateGroupData({ ...groupData, ...update });

  const closeModal = () => setOptionModal({
    isVisible: false,
    type: "",
  })

  useEffect(() => {
    getMemberListFromServer()
  }, [])

  //! APIs

  const getMemberListFromServer = async (searchText = "") => {
    let res = await GET_GROUPS_AND_MEMBERS_FOR_CALENDAR({ navigation, token, searchText: searchText.trim() });
    if (res.code == 200) {
      setMemberList(res?.members)
      setGroupList(res?.group)
    }
  }


  ///todo ....... Submit

  const onSubmit = () => {
    if (groupData.title.trim() == "") {
      showToast({ title: "Alert", type: "info", body: "Please enter event title" })
    } else {
      navigation.navigate(routes.calendarEventsAddEditNotification, {
        data: groupData,
        event,
        iteration_id,
        notifications: route?.params?.notifications,
        popTo: !!route?.params?.popTo ? route?.params?.popTo : undefined
      })
    }

  }


  const handlerWeekdays = (day) => {
    let days = [...groupData.weekday];
    let dINDEX = days.findIndex(x => x == day.value)
    if (dINDEX > -1) {
      days.splice(dINDEX, 1);
    } else {
      days.push(day.value)
    }
    setGroupData({ weekday: [...days] })
  }



  //Todo /// optoion functions

  const onSelected = (item) => {
    let { type } = optionModal;
    closeModal();
    let sEvents = groupData[type];
    sEvents.push(item);
    setGroupData({ [type]: [...sEvents] });

  }

  const filterTheList = (list, text) => {
    return list.slice().filter(y => {
      if (!groupData[optionModal?.type].find(x => x?._id == y?._id)) return true
      else return false
    });

  }

  const removeItem = (index, type) => {
    groupData[type].splice(index, 1);
    setGroupData({ [type]: [...groupData[type]] })
  }


  //? /// Views

  const selectedView = (list, type) => {
    return (
      <View style={__styles.chipsLisView}>
        {list.map((item, index) =>
          <MyChip
            key={item?._id}
            title={item?.title}
            onPress={() => removeItem(index, type)}
          />
        )}
      </View>
    )
  }

  const selectedMemberView = (list, type) => {
    return (
      <View pointerEvents="box-none" style={__styles.chipsLisView}>
        {list.map((item, index) =>
          <MyChip
            title={`${item?.first_name} ${item?.last_name} (${item?.email})`}
            onPress={() => removeItem(index, type)}
          />
        )}
      </View>
    )
  }



  return (
    <RootView title={isEditIteration ? "Edit Iteration" : isEdit ? "Edit Event" : "Add Event"}>
      <MyKeyboardAvoidingView >
        <MyInputs
          label='Title*'
          onChangeText={(text) => setGroupData({ title: text })}
          value={groupData?.title}
        />

        <MyTouchableInput
          onPress={() => setColorModal(true)}
          label='Color*'
          view={() => (
            <View style={[__styles.colorView, { backgroundColor: groupData.color, }]} />
          )}
        />

        {/* //?  Recurring Type */}
        {!isEditIteration &&
          <View>
            <MyText isLabel>Recurring Type</MyText>
            <View style={__styles.alignBtnsRow}>
              <Pressable
                onPress={() => setGroupData({ recurringType: "daily" })}
                style={[__styles.alignBtnView, groupData?.recurringType == "daily" && __styles.alignSelectedBtnView]}
              >
                <MyText
                  type='medium'
                  color={groupData?.recurringType == "daily" ? colors.black : colors.white} >Daily</MyText>
              </Pressable>
              <View style={__styles.verticalDivider} />
              <Pressable
                onPress={() => setGroupData({ recurringType: "weekly" })}
                style={[__styles.alignBtnView, groupData.recurringType == "weekly" && __styles.alignSelectedBtnView]}>
                <MyText
                  type='medium'
                  color={groupData?.recurringType == "weekly" ? colors.black : colors.white}
                >Weekly</MyText>
              </Pressable>
              <View style={__styles.verticalDivider} />
              <Pressable
                onPress={() => setGroupData({ recurringType: "monthly" })}
                style={[__styles.alignBtnView, groupData.recurringType == "monthly" && __styles.alignSelectedBtnView]}>
                <MyText
                  type='medium'
                  color={groupData?.recurringType == "monthly" ? colors.black : colors.white}
                >Monthly</MyText>
              </Pressable>
            </View>
          </View>}

        {!isEditIteration &&
          <Collapsible collapsed={groupData?.recurringType != "weekly"} >
            <View style={__styles.radioRootView}>
              <MyText isLabel>Weekdays *</MyText>
              <View style={[__styles.radioView, { flexWrap: "wrap" }]}>

                {weekdays.map((day, dayIndex) =>
                  <View key={day.shortName} style={{ flex: 1 }}>
                    <MyCheckBox
                      onPress={() => handlerWeekdays(day)}
                      title={day.shortName}
                      row={false}
                      value={groupData?.weekday.includes(day.value)}
                    />
                  </View>
                )}

              </View>
            </View>
          </Collapsible>}

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <MyTouchableInput
              label='Start Date*'
              onPress={() => ref_calendar?.current?.openModal(groupData.startDate, "startDate")}
              icon={() => icons.calendar(colors.primary)}
              value={moment(groupData?.startDate).format(dateTimeFormat.date)}
            />
          </View>
          <View style={{ flex: 1, marginRight: 10 }}>
            <MyTouchableInput
              label='Start Time*'
              onPress={() => ref_timePicker?.current?.openModal(groupData.startTime, "startTime")}
              icon={icons.clock}
              value={moment(groupData?.startTime, "HH:mm").format(dateTimeFormat.time)}
            />
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <MyTouchableInput
              label='End Date*'
              onPress={() => ref_calendar?.current?.openModal(groupData.endDate, "endDate")}
              icon={() => icons.calendar(colors.primary)}
              value={moment(groupData?.endDate).format(dateTimeFormat.date)}
            />
          </View>
          <View style={{ flex: 1, marginRight: 10 }}>
            <MyTouchableInput
              label='End Time*'
              onPress={() => ref_timePicker?.current?.openModal(groupData.endTime, "endTime")}
              icon={icons.clock}
              value={moment(groupData?.endTime, "HH:mm").format(dateTimeFormat.time)}
            />
          </View>
        </View>

        {!isDelegateEvents &&
          <View style={__styles.radioRootView}>
            <MyText isLabel>Status *</MyText>
            <View style={__styles.radioView}>
              <View style={__styles.radioItem}>
                <MyCheckBox
                  title='Active'
                  onPress={() => setGroupData({ status: true })}
                  value={groupData?.status}
                />
              </View>
              <View style={__styles.radioItem}>
                <MyCheckBox
                  title='Inactive'
                  onPress={() => setGroupData({ status: false })}
                  value={!groupData?.status}
                />
              </View>
            </View>
          </View>}



        {(!isEditIteration && !isDelegateEvents) &&
          <>
            <MyTouchableInput
              label='Groups'
              view={() => selectedView(groupData?.group, "group")}
              iconOnPress={() => setOptionModal({ isVisible: true, type: "group" })}
            />

            <MyTouchableInput
              view={() => selectedMemberView(groupData?.member, "member")}
              label='Members'
              iconOnPress={() => setOptionModal({ isVisible: true, type: "member" })}
            />

            <MyTouchableInput
              view={() => selectedMemberView(groupData?.exclude_members, "exclude_members")}
              label='Exclude Members'
              iconOnPress={() => setOptionModal({ isVisible: true, type: "exclude_members" })}
            />
          </>}
        <Editor
          initialValue={groupData?.desc}
          onChange={(text) => setGroupData({ desc: text })}
          height={150}
          label='Event Description'
          placeholder='Write event description'
        />

        <View style={{ marginTop: 10 }}>
          <MyButton
            title='Next'
            onPress={onSubmit} />
        </View>
      </MyKeyboardAvoidingView>


      <CalendarModal
        ref={ref_calendar}
        onDateSelected={(date, type) => setGroupData({ [type]: moment(date) })}
      />

      <TimePicker
        ref={ref_timePicker}
        onAgree={(time, type) => setGroupData({ [type]: time })}
      />

      <OptionModalWithSearch
        isVisible={optionModal.isVisible}
        closeModal={closeModal}
        onSelected={onSelected}
        noIcon
        filterTheList={filterTheList}
        onSearchTextChange={(text) => {
          getMemberListFromServer(text.trim())
        }}
        optionList={
          optionModal?.type == "group" ? groupList :
            optionModal?.type == "member" || optionModal?.type == "exclude_members" ? memberList :
              []
        }
        title={
          optionModal?.type == "group" ? "Group" :
            optionModal?.type == "member" || optionModal?.type == "exclude_members" ? "Member" : ""
        }
        renderText={({ item }) => (
          <MyText>
            {optionModal?.type == "group" ?
              `${item?.title}` :
              (optionModal?.type == "member" || optionModal?.type == "exclude_members") ?
                `${item?.first_name} ${item?.last_name} (${item?.email})` : ""}
          </MyText>
        )}
      />

      <ColorModal
        clodeModal={() => setColorModal(false)}
        getColor={(color) => setGroupData({ color })}
        isVisible={colorModal}
        selectedColor={groupData?.color}
      />



      <MyLoader enable={loader} />
    </RootView>
  )
}

export default GroupAddEdit



const weekdays = [{
  fullName: "Monday",
  shortName: "Mon",
  value: 1
},
{
  fullName: "Tuesday",
  shortName: "Tue",
  value: 2
},
{
  fullName: "Wednesday",
  shortName: "Wed",
  value: 3
},
{
  fullName: "Thursday",
  shortName: "Thu",
  value: 4
},
{
  fullName: "Friday",
  shortName: "Fri",
  value: 5
},
{
  fullName: "Saturday",
  shortName: "Sat",
  value: 6
},
{
  fullName: "Sunday",
  shortName: "Sun",
  value: 0
}]

const __styles = StyleSheet.create({
  colorView: {
    borderWidth: 1,
    borderColor: colors.white,
    height: 30,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  radioRootView: {
    marginBottom: 15
  },

  radioView: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    // padding: 2
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  radioItem: {
    flex: 1,

  },
  chipsLisView: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 5
  },
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

})
