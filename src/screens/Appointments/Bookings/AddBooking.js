import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { BOOKING_ADD, BOOKING_CONSULTANT_LIST, BOOKING_CONSULTANT_LIST_V1, BOOKING_PASS, BOOKING_UPDATE, GET_BOOKING_TIME_SLOTS, GET_BOOKING_TIME_SLOTS_BY_CONSULTANT, GET_SALE_PAGE_LIST_FOR_BOOKING } from '../../../DAL'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { MyButton } from '../../../components/MyButton'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'
import CalendarModal from '../../../components/CalendarModal'
import OptionModal from '../../../components/OptionModal'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import showToast from '../../../functions/showToast'
import routes from '../../../navigation/routes'
import MyLoader from '../../../components/MyLoader'
import { icons } from '../../../utilities/icons'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'

const AddBooking = ({ navigation, route }) => {
  const ref_calendar = useRef();
  const { token, access, user } = useSelector(selectUser);
  console.log(access, user, "access")
  const { editableItem, type } = route?.params;
  const isEdit = type == "edit";
  const isPass = type == "pass";
  const isAdd = type == "add";
  const [memberlist, setMemberlist] = useState([]);
  const [pageList, setPageList] = useState([]);
  const [timeSlotlist, setTimeSlotlist] = useState([])
  const [consultantList, setConsultantList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [optionModal, setOptionModal] = useState({ isVisble: false, list: [], type: "", titleKey: "" });
  const [member, setMember] = useState(null);
  const [consultant, setConsultant] = useState(null);
  const [bookingPage, setBookingPage] = useState(!isAdd ? editableItem?.page : null);
  const [date, setDate] = useState(!isAdd ? moment(editableItem?.date) : moment());
  const [loader, setLoader] = useState(false);
  const [timeSlot, setTimeSlot] = useState(isEdit ? {
    end_time: moment(editableItem?.time, "hh:mm A").add({ minutes: editableItem?.slot_duration }).format("hh:mm A"),
    start_time: editableItem?.time,
    slot_id: editableItem?.slot_id,
    slot_duration: editableItem?.slot_duration,
  } : null)
  const [isNotifyUser, setIsNotifyUser] = useState(false);

  useEffect(() => {
    if (isPass) {
      getBookingConsutantFromServer();
    }
    else {
      if (optionModal?.isVisble && optionModal?.type != "Booking Page" && optionModal?.type != "Time Slot") {
        getBookingsPagesFromServer()
      }
    }
    // if (isPass) {
    //   getBookingConsutantFromServer();
    // } else {
    //   getBookingsPagesFromServer();
    // }
  }, [searchText, optionModal?.isVisble])

  useEffect(() => {
    getPagesFromServer();
    getBookingsTimeSlotsFromServer();
  }, [date, consultant?._id])

  const onSearchTextChange = (text) => {
    if (optionModal.type == "Member") {
      setSearchText(text);
    }
  }

  const closeOptionModal = () => { setOptionModal({ isVisble: false, list: [], type: "", titleKey: "" }) }

  const onSelected = (opt) => {
    let { titleKey, type } = optionModal;
    closeOptionModal();

    if (type == "Member") {
      setMember(opt);
    } else if (type == "Delegate") {
      setConsultant(opt)
      if (!isPass) {
        setBookingPage(null);
      }
      setTimeSlot(null)
    } else if (type == "Booking Page") {
      setBookingPage(opt)
    } else if (type == "Time Slot") {
      setTimeSlot(opt)
    }

  }



  const filterTheList = (list, text) => {
    if (optionModal.type == "Member") {
      return list
    } else if (optionModal.type == "Delegate") {
      if (text.trim() == "") {
        return list
      } else {
        return list?.slice().filter(x => {
          let nameText = (x?.first_name + " " + x?.last_name + " (" + x?.email + ")").toLowerCase();
          let searchText = text?.toLowerCase().trim();
          return nameText.includes(searchText)

        })
      }
    } else if (optionModal.type == "Booking Page") {
      if (text.trim() == "") {
        return list
      } else {
        return list?.slice().filter(x => x.sale_page_title.toLowerCase().includes(text.toLowerCase().trim()))
      }
    } else if (optionModal.type == "Time Slot") {
      if (text.trim() == "") {
        return list
      } else {
        let search = text.toLowerCase().trim();
        return list?.slice().filter(x => (x.start_time + "  -  " + x.end_time).toLowerCase().includes(search))
      }
      // return list?.slice().filter(x => x.sale_page_title.toLowerCase().includes(text.toLowerCase().trim()))
    }
  }


  const onSubmit = () => {
    if (!member && isAdd) {
      showToast({ body: "Member's name can not be empty !", title: "Alert", type: "info" })
    } else if (!bookingPage && !isPass) {
      showToast({ body: "Booking Page can not be empty !", title: "Alert", type: "info" })
    } else if (!date) {
      showToast({ body: "Date can not be empty !", title: "Alert", type: "info" })
    } else if (!timeSlot) {
      showToast({ body: "Time Slot can not be empty !", title: "Alert", type: "info" })
    } else {
      let data = {
        date: moment(date).format("YYYY/MM/DD"),
        member_id: member?._id,
        page_id: bookingPage?._id,
        slot_id: timeSlot?.slot_id,
        time: timeSlot?.start_time,
      }
      setLoader(true);
      if (isPass) {
        data["consultant_id"] = consultant?._id;
        delete data['member_id'];
        delete data['page_id'];
        passBookingToOtherDelegate(data);
      }
      else if (isEdit) {
        data["is_notify"] = isNotifyUser;
        delete data['member_id'];
        updateBookingToServer(data);
      } else {
        addBookingToServer(data)
      }
    }
  }


  const addBookingToServer = async (obj) => {
    let res = await BOOKING_ADD({ navigation, token, data: obj });
    setLoader(false);
    if (res.code == 200) {
      navigation.navigate(routes?.bookingList, {
        callList: true
      })
    }
  }

  const updateBookingToServer = async (obj) => {
    let res = await BOOKING_UPDATE({ navigation, token, data: obj, bookingId: editableItem?._id });
    setLoader(false);
    if (res.code == 200) {
      navigation.navigate(routes?.bookingList, {
        callList: true
      })
    }
  }

  const passBookingToOtherDelegate = async (obj) => {
    let res = await BOOKING_PASS({ navigation, token, data: obj, bookingId: editableItem?._id });
    setLoader(false);
    if (res.code == 200) {
      navigation.navigate(routes?.bookingList, {
        callList: false
      })
    }
  }

  const getBookingsPagesFromServer = async () => {
    let res = await BOOKING_CONSULTANT_LIST_V1({
      navigation, token, body: {
        data_type: optionModal?.type == "Delegate" ? "delegates" : "members",
        member_type: optionModal?.type == "Member" ? access?.show_members_list_for_booking : undefined,
        delegates_type: optionModal?.type == "Delegate" ? access?.book_call_with_delegate == "other" ? access?.other_delegate_team_type : user?.team_type : undefined,
        consultant_id: undefined,
        search_text: searchText.trim()
      }
    });
    if (res.code == 200) {
      console.log(optionModal?.type, "optionModal?.type")
      if (optionModal?.type == "Delegate") {
        setConsultantList(res?.data)
      } else if (optionModal?.type == "Member") {
        setMemberlist(res?.data)
      }
      if (optionModal.isVisble) {
        setOptionModal({ ...optionModal, list: res?.data })
      }
      // setPageList(res?.Sale_page);
      // setMemberlist(res?.members);
      // if (optionModal.isVisble && optionModal?.type == "Member") {
      //   setOptionModal({ ...optionModal, list: res?.members })
      // }
    }
  }

  const getPagesFromServer = async () => {
    let res = await BOOKING_CONSULTANT_LIST_V1({
      navigation, token, body: {
        data_type: "sale_page",
        consultant_id: consultant?._id
      }
    });
    if (res.code == 200) {
      setPageList(res?.data);
    }
  }

  const getBookingConsutantFromServer = async () => {
    let res = await BOOKING_CONSULTANT_LIST({ navigation, token, });
    if (res.code == 200) {
      setConsultantList(res?.consultant_list);
    }
  }

  const getBookingsTimeSlotsFromServer = async () => {
    let res;
    if (isPass) {
      res = await GET_BOOKING_TIME_SLOTS_BY_CONSULTANT({ navigation, token, date: moment(date).format("YYYY/MM/DD"), consultant_id: consultant?._id });
    } else {
      res = await GET_BOOKING_TIME_SLOTS({ navigation, token, date: moment(date).format("YYYY/MM/DD") });
    }
    if (res.code == 200) {
      if (optionModal.isVisble && optionModal?.type=="Time Slot") {
        setOptionModal({ ...optionModal, list: res?.data })
      }
      setTimeSlotlist(res?.slots)
    }
  }



  return (
    <RootView title={isPass ? "Pass Booking" : isEdit ? "Edit Booking" : 'Add New Booking'} >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {!isEdit && !isPass &&
          <MyTouchableInput
            label='Member*'
            onPress={() => setOptionModal({ isVisble: true, list: memberlist, type: "Member", titleKey: "" })}
            value={!!member ? `${member?.first_name} ${member?.last_name} (${member?.email})` : ""}
            clearbutton={!!member}
            onClearButtonPress={() => { setMember(null); }}
          />}

        {/* {isPass && */}
        <MyTouchableInput
          label='Delegate*'
          onPress={() => setOptionModal({ isVisble: true, list: consultantList, type: "Delegate", titleKey: "" })}
          value={!!consultant ? `${consultant?.first_name} ${consultant?.last_name} (${consultant?.email})` : ""}
          clearbutton={!!consultant}
          onClearButtonPress={() => {
            setConsultant(null);
            if (!isPass) {
              setBookingPage(null);
            }
            setTimeSlot(null);
          }}
        />
        {/* } */}

        <MyTouchableInput
          label={isPass ? "Page Title*" : 'Booking Page*'}
          onPress={() => setOptionModal({ isVisble: true, list: pageList, type: "Booking Page", titleKey: "sale_page_title" })}
          value={!!bookingPage ? bookingPage?.sale_page_title : ''}
          clearbutton={!!bookingPage}
          onClearButtonPress={() => setBookingPage(null)}
          disabled={isPass}
        />

        <MyTouchableInput
          label='Date*'
          onPress={() => ref_calendar?.current?.openModal(date)}
          value={!!date ? moment(date).format(dateTimeFormat.date) : ""}
          icon={() => icons.calendar(colors.primary)}
        />

        <MyTouchableInput
          label='Time Slots*'
          onPress={() => setOptionModal({ isVisble: true, list: timeSlotlist, type: "Time Slot", titleKey: "" })}
          value={!!timeSlot ? `${timeSlot?.start_time}  -  ${timeSlot?.end_time}` : ""}
          clearbutton={!!timeSlot}
          onClearButtonPress={() => setTimeSlot(null)}
        />
        {isPass && !!consultant &&
          <View style={{ paddingBottom: 15 }}>
            <MyText>{consultant?.time_zone}</MyText>
          </View>}
        {isEdit &&
          <View style={__styles.radioRootView}>
            <MyText isLabel>Is Notify User</MyText>
            <View style={__styles.radioView}>
              <View style={__styles.radioItem}>
                <MyCheckBox
                  title='Yes'
                  onPress={() => setIsNotifyUser(true)}
                  value={isNotifyUser}
                />
              </View>
              <View style={__styles.radioItem}>
                <MyCheckBox
                  title='No'
                  onPress={() => setIsNotifyUser(false)}
                  value={!isNotifyUser}
                />
              </View>
            </View>
          </View>
        }


        <View>
          <MyButton title='Save' onPress={onSubmit} />
        </View>

      </ScrollView>

      <MyLoader enable={loader} />

      <OptionModalWithSearch
        isVisible={optionModal?.isVisble}
        closeModal={closeOptionModal}
        onSelected={onSelected}
        optionList={optionModal.list}
        filterTheList={filterTheList}
        titleKey={optionModal?.titleKey}
        title={optionModal?.type}
        onSearchTextChange={onSearchTextChange}
        renderText={!optionModal?.titleKey ? ({ item, index }) =>
          <MyText fontSize={16} >
            {optionModal?.type == "Member" || optionModal?.type == "Delegate" ? item?.first_name + " " + item?.last_name + " (" + item?.email + ")" :
              optionModal?.type == "Time Slot" ? `${item?.start_time}  -  ${item?.end_time}` : ""}
          </MyText> : undefined}
      />

      <CalendarModal
        ref={ref_calendar}
        onDateSelected={(date) => { setDate(date); setTimeSlot(null) }}
        minimum={moment()}
      />
    </RootView>
  )
}

export default AddBooking


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
})