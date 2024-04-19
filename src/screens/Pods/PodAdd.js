import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyInputs from '../../components/MyInputs'
import { colors } from '../../utilities/colors'
import MyCheckBox from '../../components/MyCheckBox'
import MyTouchableInput from '../../components/MyTouchableInput'
import { icons } from '../../utilities/icons'
import UploadFileInput from '../../components/UploadFileInput'
import Editor from '../../components/Editor'
import { MyButton } from '../../components/MyButton'
import { combineReducers } from '@reduxjs/toolkit'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import CalendarModal from '../../components/CalendarModal'
import { dateTimeFormat } from '../../utilities/constants'
import OptionModal from '../../components/OptionModal'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { POD_ADD, POD_DETAIL, POD_GROUPS_AND_MEMBERS, POD_UPDATE } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import OptionModalWithSearch from '../../components/OptionModalWithSearch'
import MyChip from '../../components/MyChip'
import routes from '../../navigation/routes'
import showToast from '../../functions/showToast'

const PodAdd = ({ navigation, route }) => {
  const ref_calendar = useRef();
  const { editableItem, type } = route.params;
  const isEdit = type == 'edit';
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [optionModal, setOptionModal] = useState({ isVisible: false, type: "", list: [], });
  const [multipleOptionModal, setMultipleOptionModal] = useState(false);
  const [memberModalVisibility, setMemberModalVisibility] = useState(false);
  const [timePicker, setTimePicker] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [order, setOrder] = useState("");
  const [cred, updateCred] = useState({
    title: "",
    status: true,
    zoomlink: "",
    password: "",
    isRecurring: false,
    communityLvl: communityLevels[0],
    startDate: moment(),
    startTime: "00:00",
    hours: hourslist[0],
    minutes: minsList[0],
    recurrenceType: null,
    recurrenceDays: [],
    recurrenceEndDate: moment(),
    groups: [],
    members: [],
    logo: null,
    shortDesc: "",
    longDesc: "",
  })

  const { title, status, zoomlink, password, isRecurring, communityLvl, startDate, startTime, hours, minutes, recurrenceType, recurrenceDays, recurrenceEndDate, groups, members, logo, shortDesc, longDesc } = cred;
  const setCred = (updation) => updateCred((old) => ({ ...old, ...updation }));

  useEffect(() => {
    if (editableItem) {
      getPodDetailFromServer()
    } else {
      setIsLoaded(true);
    }
    getGroupsAndMembersFromServer()
  }, [])

  const closeModal = () => {
    setOptionModal({ isVisible: false, type: "", list: [], });
  }

  const onOptionSelect = (opt) => {
    let { type } = optionModal;
    closeModal();
    setCred({ [type]: opt })
  }

  const onMultipleOptionSelect = (opt) => {
    let index = groups.findIndex(x => x._id == opt?._id);
    if (index > -1) {
      groups.splice(index, 1);
    } else {
      groups.push(opt);
    }
    setCred({ groups: [...groups] });
  }

  const onMemberSelect = (opt) => {
    let index = members.findIndex(x => x._id == opt?._id);
    if (index > -1) {
      members.splice(index, 1);
    } else {
      members.push(opt);
    }
    setCred({ members: [...members] });
  }

  const filterTheList = (list, text) => {
    let nlist = [];
    nlist = list.filter(x => {
      return !!!members.find(y => y._id == x?._id);
    })
    if (text.trim() == "") {
      return nlist
    } else {
      return nlist?.slice().filter(x => {
        let nameText = (x?.first_name + " " + x?.last_name + " (" + x?.email + ")").toLowerCase();
        let searchText = text?.toLowerCase().trim();
        return nameText.includes(searchText)
      })
    }
  }

  const multipleSelected = (item) => {
    return !!groups.find(x => x._id == item?._id);

  }


  const handlerWeekdays = (day) => {

    let days = [...recurrenceDays];
    let dINDEX = days.findIndex(x => x == day.key)
    if (dINDEX > -1) {
      days.splice(dINDEX, 1);
    } else {
      days.push(day.key)
    }
    setCred({ recurrenceDays: [...days] })
  }


  //! APIs

  const getGroupsAndMembersFromServer = async () => {
    setLoader(true);
    let res = await POD_GROUPS_AND_MEMBERS({ navigation, token, })
    if (res.code == 200) {
      setMemberList(res?.members);
      setGroupList(res?.groups);
      if (isEdit == false) {
        setLoader(false)
      }
    } else {
      setLoader(false)

    }
  }

  const getPodDetailFromServer = async () => {
    setLoader(true);
    let res = await POD_DETAIL({ navigation, token, slug: editableItem?.room_slug })
    if (res.code == 200) {
      let room = res.room;
      setCred({
        title: !!room?.title ? room?.title : "",
        status: !!room?.status == false ? false : true,
        zoomlink: !!room?.zoom_link ? room?.zoom_link : "",
        password: !!room?.password ? room?.password : "",
        isRecurring: !!room?.is_recurring ? true : false,
        communityLvl: !!room?.community_level ? communityLevels.find(x => x.key == room?.community_level) : communityLevels[0],
        startDate: !!room?.start_date ? moment(room?.start_date) : moment(),
        startTime: !!room?.start_time ? room?.start_time : "00:00",
        hours: !!room?.duration_hour ? hourslist.find(x => x.key == room?.duration_hour) : hourslist[0],
        minutes: !!room?.duration_minute ? minsList.find(x => x.key == room?.duration_minute) : minsList[0],
        recurrenceType: !!room ? null : recurrencelist[1],
        recurrenceDays: [],
        recurrenceEndDate: moment(),
        groups: !!room?.group ? room?.group.map(x => x._id) : [],
        members: res.room_members,
        logo: !!room?.room_image?.thumbnail_1 ? room?.room_image?.thumbnail_1 : null,
        shortDesc: !!room?.short_description ? room?.short_description : "",
        longDesc: !!room?.detail_description ? room?.detail_description : "",
      })
      setOrder(String(room?.order))
      setIsLoaded(true);
      setLoader(false)
    } else {
      setLoader(false)

    }
  }


  const onSubmit = () => {
    let fd = new FormData();
    console.log(recurrenceDays, "recurrenceDays")
    fd.append("title", title)
    if (!!logo?.uri) {
      fd.append("image", logo)
    }
    fd.append("short_description", shortDesc);
    fd.append("detail_description", longDesc);
    fd.append("status", status)
    fd.append("room_type", "general");
    fd.append("zoom_link", zoomlink)
    fd.append("password", password)
    fd.append("is_recurring", isRecurring)
    fd.append("start_time", startTime)
    fd.append("duration_hour", hours.key)
    fd.append("duration_minute", minutes.key)
    fd.append("community_level", communityLvl?.key)
    fd.append("weekdays", JSON.stringify(recurrenceDays))
    fd.append("start_date", moment(startDate).format("YYYY-MM-DD"))
    fd.append("end_date", moment(recurrenceEndDate).format("YYYY-MM-DD"))
    fd.append("group", JSON.stringify(groups.map(grp => ({ group_slug: grp.group_slug }))))
    fd.append("member", JSON.stringify(members.map(member => ({ member_id: member._id }))));
    if (isEdit) {
      fd.append("order", Number(order))
    }
    if (isEdit) {
      updatePodToServer(fd);
    } else {
      addPodToServer(fd)
    }
  }

  const addPodToServer = async (fd) => {
    setLoader(true);
    let res = await POD_ADD({ navigation, token, formData: fd })

    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" })
      navigation.navigate(routes.sourcePodScreen, {
        callAPI: true
      })
      setLoader(false)
    } else {
      setLoader(false)

    }
  }

  const updatePodToServer = async (fd) => {
    setLoader(true);
    let res = await POD_UPDATE({ navigation, token, formData: fd, slug: editableItem?.room_slug })

    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" })
      route?.params?.updateRoom?.(res?.room)
      navigation.goBack()
      setLoader(false)
    } else {
      setLoader(false)

    }
  }

  return (
    <RootView title={isEdit ? "Edit Pod" : 'Add Pod'} >
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
        enableResetScrollToCoords={false}>

        <MyInputs
          label='Title'
          value={title}
          onChangeText={(text) => setCred({ title: text })}
        />

        <View style={__styles.radioRootView}>
          <MyText isLabel>Pod Status*</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Yes'
                onPress={() => setCred({ status: true })}
                value={status}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='No'
                onPress={() => setCred({ status: false })}
                value={!status}
              />
            </View>
          </View>
        </View>

        <MyInputs
          label='Zoom Link'
          value={zoomlink}
          onChangeText={(text) => setCred({ zoomlink: text })}
        />

        <MyInputs
          label='Password'
          value={password}
          onChangeText={(text) => setCred({ password: text })}
        />
        {isEdit &&
          <MyInputs
            label='Order'
            value={order}
            onChangeText={(text) => setOrder(text)}
            keyboardType='number-pad'
          />}

        <View style={__styles.radioRootView}>
          <MyText isLabel>Recurring</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Yes'
                onPress={() => setCred({ isRecurring: true })}
                value={isRecurring}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='No'
                onPress={() => setCred({ isRecurring: false })}
                value={!isRecurring}
              />
            </View>
          </View>
        </View>

        <MyTouchableInput
          label='Community Level*'
          value={communityLvl?.title}
          onPress={() => setOptionModal({ isVisible: true, list: communityLevels, type: "communityLvl", })}
        />

        <View style={__styles.section} >
          <View style={__styles.sectionView}>
            <MyText type='medium' fontSize={16} >When</MyText>
          </View>
          <View style={__styles.sectionInner}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <MyTouchableInput
                  label='Start Date*'
                  icon={() => icons.calendar(colors.primary, 20)}
                  value={moment(startDate).format(dateTimeFormat.date)}
                  onPress={() => ref_calendar?.current?.openModal(startDate, "startDate", moment().toDate())}
                  error={moment(startDate).isBefore(moment(), "day")}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <MyTouchableInput
                  label='Start Time*'
                  icon={() => icons.clock(colors.primary, 20)}
                  value={moment(startTime, "hh:mm").format(dateTimeFormat.time)}
                  onPress={() => setTimePicker(true)}
                />
              </View>
            </View>
          </View>
        </View>


        <View style={__styles.section} >
          <View style={__styles.sectionView}>
            <MyText type='medium' fontSize={16} >Duration</MyText>
          </View>
          <View style={__styles.sectionInner}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <MyTouchableInput
                  label='Hours'
                  value={hours?.title}
                  onPress={() => setOptionModal({ isVisible: true, list: hourslist, type: "hours", })}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <MyTouchableInput
                  label='Minutes'
                  value={minutes?.title}
                  onPress={() => setOptionModal({ isVisible: true, list: minsList, type: "minutes", })}
                />
              </View>
            </View>
          </View>
        </View>


        {isRecurring &&
          <View style={__styles.section} >
            <View style={__styles.sectionView}>
              <MyText type='medium' fontSize={16} >Recurence</MyText>
            </View>
            <View style={__styles.sectionInner}>
              <View style={{ flexDirection: "row", }}>
                <View style={{ flex: 1 }}>
                  <MyTouchableInput
                    label='Recurrence Type'
                    value={recurrenceType?.title}
                    onPress={() => setOptionModal({ isVisible: true, list: recurrencelist, type: "recurrenceType", })}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <MyTouchableInput
                    label='End Date*'
                    icon={() => icons.calendar(colors.primary, 20)}
                    value={moment(recurrenceEndDate).format(dateTimeFormat.date)}
                    onPress={() => ref_calendar?.current?.openModal(recurrenceEndDate, "recurrenceEndDate", !!startDate ? moment(startDate).toDate() : moment().toDate())}
                    error={!!startDate ? moment(recurrenceEndDate).isBefore(moment(startDate), "day") : false}
                  />
                </View>
              </View>
              

              {recurrenceType?.key == "weekly" &&
                <View style={__styles.radioRootView}>
                  <MyText isLabel>Weekdays *</MyText>
                  <View style={[__styles.radioView, { flexWrap: "wrap" }]}>

                    {weekdays.map((day, dayIndex) =>
                      <View key={day.key} style={{ flex: 1 }}>
                        <MyCheckBox
                          onPress={() => handlerWeekdays(day)}
                          title={day.shortName}
                          row={false}
                          value={recurrenceDays.includes(day.key)}
                          size={30}
                        />
                      </View>
                    )}

                  </View>
                </View>}


            </View>
          </View>}

        <MyTouchableInput
          label='Groups'
          onPress={() => setMultipleOptionModal(true)}
          view={() => {
            return (<View style={{ flex: 1, paddingHorizontal: 10 }}>
              <MyText>{groups.map(x => x.title).join(", ")}</MyText>
            </View>)
          }}
        />

        <MyTouchableInput
          label='Members'
          iconOnPress={() => setMemberModalVisibility(true)}
          clearbutton={members?.length > 0}
          onClearButtonPress={() => setCred({ members: [] })}
          view={() => {
            return (
              <View style={{ flexDirection: "row", flex: 1, alignItems: "center", flexWrap: "wrap", paddingVertical: 2 }}>
                {members.map((item, index) => (
                  <MyChip
                    key={item?._id}
                    title={item?.first_name + " (" + item?.email + ")"}
                    onPress={() => onMemberSelect(item)}
                  />
                ))}
              </View>
            )
          }}
        />


        <UploadFileInput
          label='Upload Logo*'
          subLabel='Image Size(350 X 100) ("JPG", "JPEG", "PNG","WEBP")'
          onImagePicked={(image) => setCred({ logo: image })}
          selectedImage={logo}
          onRemoveBtnPress={() => setCred({ logo: null })}
        />

        {isLoaded && <>
          <Editor
            label='Short Description *'
            height={150}
            onChange={(text) => setCred({ shortDesc: text })}
            initialValue={shortDesc}
          />


          <Editor
            label='Detailed Description *'
            height={150}
            onChange={(text) => setCred({ longDesc: text })}
            initialValue={longDesc}
          />
        </>}
        <View style={{ marginTop: 10 }}>
          <MyButton
            title='Submit'
            onPress={onSubmit}
          />
        </View>
      </KeyboardAwareScrollView>


      <OptionModal
        optionList={optionModal.list}
        isVisible={optionModal.isVisible}
        closeModal={closeModal}
        onSelected={onOptionSelect}
        checkSelected={(item) => item?.key == cred[optionModal?.type]?.key}
        noIcon
      />

      <OptionModal
        optionList={groupList}
        isVisible={multipleOptionModal}
        closeModal={() => setMultipleOptionModal(false)}
        onSelected={onMultipleOptionSelect}
        checkSelected={multipleSelected}
        multiple={true}
        multipleLabel={"Select Groups"}
        noIcon
      />

      <OptionModalWithSearch
        optionList={memberList}
        isVisible={memberModalVisibility}
        closeModal={() => setMemberModalVisibility(false)}
        renderText={({ item }) =>
          <MyText>{`${item?.first_name} ${item?.last_name} (${item?.email})`}</MyText>}
        noIcon
        onSelected={onMemberSelect}
        filterTheList={filterTheList}
        title='Member'


      />


      <CalendarModal
        ref={ref_calendar}
        onDateSelected={(date, type) => setCred({ [type]: date })}
      />

      <DateTimePicker
        mode='time'
        date={moment(startTime, "HH:mm").toDate()}
        isVisible={timePicker}
        onCancel={() => setTimePicker(false)}
        onConfirm={(time) => {
          setCred({ startTime: moment(time).format("HH:mm") })
          setTimePicker(false);
        }}
      />

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default PodAdd


const communityLevels = [
  {
    title: "Dynamite",
    key: "dynamite"
  },
  {
    title: "PTA",
    key: "pta"
  },
  {
    title: "Elite",
    key: "elite"
  },
  {
    title: "Mastery",
    key: "mastery"
  },
]
const recurrencelist = [
  {
    title: "Daily",
    key: "daily"
  },
  {
    title: "Weekly",
    key: "weekly"
  },
  {
    title: "Monthly",
    key: "monthly"
  },
]

const hourslist = [
  { title: '1', key: '1' },
  { title: '2', key: '2' },
  { title: '3', key: '3' },
  { title: '4', key: '4' },
  { title: '5', key: '5' },
  { title: '6', key: '6' },
  { title: '7', key: '7' },
  { title: '8', key: '8' },
  { title: '9', key: '9' },
  { title: '10', key: '10' },
  { title: '11', key: '11' },
  { title: '12', key: '12' },
  { title: '13', key: '13' },
  { title: '14', key: '14' },
  { title: '15', key: '15' },
  { title: '16', key: '16' },
  { title: '17', key: '17' },
  { title: '18', key: '18' },
  { title: '19', key: '19' },
  { title: '20', key: '20' },
  { title: '21', key: '21' },
  { title: '22', key: '22' },
  { title: '23', key: '23' },
  { title: '24', key: '24' }
]

const minsList = [
  { title: '0', key: '0' },
  { title: '1', key: '1' },
  { title: '2', key: '2' },
  { title: '3', key: '3' },
  { title: '4', key: '4' },
  { title: '5', key: '5' },
  { title: '6', key: '6' },
  { title: '7', key: '7' },
  { title: '8', key: '8' },
  { title: '9', key: '9' },
  { title: '10', key: '10' },
  { title: '11', key: '11' },
  { title: '12', key: '12' },
  { title: '13', key: '13' },
  { title: '14', key: '14' },
  { title: '15', key: '15' },
  { title: '16', key: '16' },
  { title: '17', key: '17' },
  { title: '18', key: '18' },
  { title: '19', key: '19' },
  { title: '20', key: '20' },
  { title: '21', key: '21' },
  { title: '22', key: '22' },
  { title: '23', key: '23' },
  { title: '24', key: '24' },
  { title: '25', key: '25' },
  { title: '26', key: '26' },
  { title: '27', key: '27' },
  { title: '28', key: '28' },
  { title: '29', key: '29' },
  { title: '30', key: '30' },
  { title: '31', key: '31' },
  { title: '32', key: '32' },
  { title: '33', key: '33' },
  { title: '34', key: '34' },
  { title: '35', key: '35' },
  { title: '36', key: '36' },
  { title: '37', key: '37' },
  { title: '38', key: '38' },
  { title: '39', key: '39' },
  { title: '40', key: '40' },
  { title: '41', key: '41' },
  { title: '42', key: '42' },
  { title: '43', key: '43' },
  { title: '44', key: '44' },
  { title: '45', key: '45' },
  { title: '46', key: '46' },
  { title: '47', key: '47' },
  { title: '48', key: '48' },
  { title: '49', key: '49' },
  { title: '50', key: '50' },
  { title: '51', key: '51' },
  { title: '52', key: '52' },
  { title: '53', key: '53' },
  { title: '54', key: '54' },
  { title: '55', key: '55' },
  { title: '56', key: '56' },
  { title: '57', key: '57' },
  { title: '58', key: '58' },
  { title: '59', key: '59' },
  { title: '60', key: '60' }
]

const weekdays = [{
  fullName: "Monday",
  shortName: "Mon",
  key: 1,
},
{
  fullName: "Tuesday",
  shortName: "Tue",
  key: 2,
},
{
  fullName: "Wednesday",
  shortName: "Wed",
  key: 3,
},
{
  fullName: "Thursday",
  shortName: "Thu",
  key: 4,
},
{
  fullName: "Friday",
  shortName: "Fri",
  key: 5,
},
{
  fullName: "Saturday",
  shortName: "Sat",
  key: 6,
},
{
  fullName: "Sunday",
  shortName: "Sun",
  key: 0,
}]

const __styles = StyleSheet.create({
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
  section: {
    borderWidth: 2,
    borderColor: colors.secondaryVariant,
    borderRadius: 5,
    marginBottom: 10
  },
  sectionView: {
    backgroundColor: colors.secondaryVariant,
    paddingVertical: 5,
    paddingHorizontal: 5,
    // borderRadius: 5
  },
  sectionInner: {
    marginTop: 5,
    paddingHorizontal: 10
  }


})