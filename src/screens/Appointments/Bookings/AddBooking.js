import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { BOOKING_ADD, GET_BOOKING_TIME_SLOTS, GET_SALE_PAGE_LIST_FOR_BOOKING } from '../../../DAL'
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

const AddBooking = ({ navigation, route }) => {
  const ref_calendar = useRef();
  const { token } = useSelector(selectUser);
  const [memberlist, setMemberlist] = useState([]);
  const [pageList, setPageList] = useState([]);
  const [timeSlotlist, setTimeSlotlist] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [optionModal, setOptionModal] = useState({ isVisble: false, list: [], type: "", titleKey: "" });
  const [member, setMember] = useState(null);
  const [bookingPage, setBookingPage] = useState(null);
  const [date, setDate] = useState(moment());
  const [loader, setLoader] = useState(false);
  const [timeSlot, setTimeSlot] = useState(null)

  useEffect(() => {
    getBookingsPagesFromServer();
  }, [searchText])

  useEffect(() => {
    getBookingsTimeSlotsFromServer();
  }, [date])

  const onSearchTextChange = (text) => {
    if (optionModal.type == "Member")
      setSearchText(text);
  }

  const closeOptionModal = () => { setOptionModal({ isVisble: false, list: [], type: "", titleKey: "" }) }

  const onSelected = (opt) => {
    let { titleKey, type } = optionModal;
    closeOptionModal();

    if (type == "Member") {
      setMember(opt);
    } else if (type == "Booking Page") {
      setBookingPage(opt)
    } else if (type == "Time Slot") {
      setTimeSlot(opt)
    }

  }



  const filterTheList = (list, text) => {
    if (optionModal.type == "Member") {
      return list
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
    if (!member) {
      showToast({ body: "Member's name can not be empty !", title: "Alert", type: "info" })
    } else if (!bookingPage) {
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
      addBookingToServer(data)
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


  const getBookingsPagesFromServer = async () => {
    let res = await GET_SALE_PAGE_LIST_FOR_BOOKING({ navigation, token, search: searchText.trim() });
    if (res.code == 200) {
      setPageList(res?.Sale_page);
      setMemberlist(res?.members);
      if (optionModal.isVisble && optionModal?.type == "Member") {
        setOptionModal({ ...optionModal, list: res?.members })
      }
    }
  }


  const getBookingsTimeSlotsFromServer = async () => {
    let res = await GET_BOOKING_TIME_SLOTS({ navigation, token, date: moment(date).format("YYYY/MM/DD") });
    if (res.code == 200) {
      setTimeSlotlist(res?.slots)
    }
  }

  return (
    <RootView title='Add New Booking' >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      >

        <MyTouchableInput
          label='Member*'
          onPress={() => setOptionModal({ isVisble: true, list: memberlist, type: "Member", titleKey: "" })}
          value={!!member ? `${member?.first_name} ${member?.last_name} (${member?.email})` : ""}
          clearbutton={!!member}
          onClearButtonPress={() => setMember(null)}
        />

        <MyTouchableInput
          label='Booking Page*'
          onPress={() => setOptionModal({ isVisble: true, list: pageList, type: "Booking Page", titleKey: "sale_page_title" })}
          value={!!bookingPage ? bookingPage?.sale_page_title : ''}
          clearbutton={!!bookingPage}
          onClearButtonPress={() => setBookingPage(null)}
        />

        <MyTouchableInput
          label='Date*'
          onPress={() => ref_calendar?.current?.openModal(date)}
          value={!!date ? moment(date).format(dateTimeFormat.date) : ""}
        />

        <MyTouchableInput
          label='Time Slots*'
          onPress={() => setOptionModal({ isVisble: true, list: timeSlotlist, type: "Time Slot", titleKey: "" })}
          value={!!timeSlot ? `${timeSlot?.start_time}  -  ${timeSlot?.end_time}` : ""}
          clearbutton={!!timeSlot}
          onClearButtonPress={() => setTimeSlot(null)}
        />

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
            {optionModal?.type == "Member" ? item?.first_name + " " + item?.last_name + " (" + item?.email + ")" :
              optionModal?.type == "Time Slot" ? `${item?.start_time}  -  ${item?.end_time}` : ""}
          </MyText> : undefined}
      />

      <CalendarModal
        ref={ref_calendar}
        onDateSelected={(date) => setDate(date)}
      />
    </RootView>
  )
}

export default AddBooking