import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { GET_BOOKING_STATUSES, GET_SALE_PAGE_LIST_FOR_BOOKING } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import MyCheckBox from '../../../components/MyCheckBox'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { icons } from '../../../utilities/icons'
import Collapsible from 'react-native-collapsible'
import { colors } from '../../../utilities/colors'
import { MyButton, MyClearButton } from '../../../components/MyButton'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'
import MyChip from '../../../components/MyChip'
import OptionModal from '../../../components/OptionModal'
import CalendarModal from '../../../components/CalendarModal'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import routes from '../../../navigation/routes'

const BookingReportFilter = ({ navigation, route }) => {
  const { filters: appliedFilters ,item} = route?.params
  const ref_calendar = useRef();
  const { token, } = useSelector(selectUser);
  const [memberlist, setMemberlist] = useState([]);
  const [pageList, setPageList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState("")
  const [optionModal, setOptionModal] = useState({ isVisble: false, list: [], type: "", titleKey: "" });
  const [simpleOptionModal, setSimpleOptionModal] = useState({ isVisble: false, list: [], titleKey: "" });
  const [filters, setFilters] = useState(appliedFilters);



  useEffect(() => {
    getBookingsPagesFromServer();
    getBookingStatuesFromServer()
  }, [])

  const onClearButtonPress = () => {
    navigation.navigate(routes.delegateReportBookingsScreen, {
      filters: {
        booking_status: null,
        end_date: null,
        filter_by_dates: false,
        sale_page: [],
        search_text: "",
        sort_by: "",
        start_date: null,
      },
      item
    })
  }

  const onSubmitButtonPress = () => {
    navigation.navigate(routes.delegateReportBookingsScreen, { filters ,item})
  }

  const closeOptionModal = () => { setOptionModal({ isVisble: false, list: [], type: "", titleKey: "" }) }
  const closeSimpleOptionModal = () => { setSimpleOptionModal({ isVisble: false, list: [], titleKey: "" }) }
  const onSelected = (opt) => {
    let { titleKey, type } = optionModal;
    closeOptionModal()
    if (titleKey == "sale_page_title") {
      filters.sale_page = [...filters.sale_page, opt];
      setFilters({ ...filters })
    } else if (titleKey == "title") {
      filters.booking_status = opt;
      setFilters({ ...filters })
    }
  }

  const onSimpleOptSelected = (opt) => {
    let { titleKey } = simpleOptionModal;
    closeSimpleOptionModal()
    if (titleKey == "sort_title") {
      filters.sort_by = opt;
      setFilters({ ...filters })
    }
  }

  const onDateSelected = (date, type) => {
    if (type == "start_date") {
      setFilters({ ...filters, start_date: date })
    } else if (type == "end_date") {
      setFilters({ ...filters, end_date: date })
    }
  }

  const removeSalePage = (index) => {
    filters.sale_page.splice(index, 1);
    setFilters({ ...filters })
  }

  const filterTheList = (list, searchText) => {
    let nlist = [];
    if (optionModal.titleKey == "sale_page_title") {
      nlist = list.slice().filter(x => !filters.sale_page.find(y => y._id == x._id));
    } else if (optionModal.titleKey == "title") {
      nlist = list.slice().filter(x => filters.booking_status?._id != x._id);
    }

    if (searchText.trim() == "") {
      return nlist;
    } else {
      return nlist.slice().filter(x => x[optionModal?.titleKey].toLowerCase().includes(searchText.trim().toLowerCase()))
    }
  }

  const getBookingsPagesFromServer = async () => {
    let res = await GET_SALE_PAGE_LIST_FOR_BOOKING({ navigation, token, search: searchText.trim() });
    if (res.code == 200) {
      setPageList(res?.Sale_page);
      setMemberlist(res?.members)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const getBookingStatuesFromServer = async () => {
    let res = await GET_BOOKING_STATUSES({ navigation, token, });
    if (res.code == 200) {
      setStatusList(res?.active_booking_status);
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const selectedMembersView = () => {
    return (
      <View style={{ flexDirection: "row", flex: 1, alignItems: "center", flexWrap: "wrap", paddingVertical: 2 }}>
        {filters?.sale_page.map((item, index) => (
          <MyChip
            key={item?._id}
            title={item?.sale_page_title}
            onPress={() => removeSalePage(index)}
          />
        ))}
      </View>
    )
  }

  return (
    <RootView title='Filter' >
      <KeyboardAwareScrollView
        contentContainerStyle={{ marginTop: 10, marginHorizontal: 10 }}>

        <View style={{ marginBottom: 10 }}>
          <MyCheckBox
            onPress={() => setFilters({ ...filters, filter_by_dates: !filters?.filter_by_dates })}
            value={filters?.filter_by_dates}
            title='Filter By Booking Dates'
          />
        </View>

        <Collapsible collapsed={!filters?.filter_by_dates} >
          <View style={__styles.row}>
            <View style={__styles.rowItem}>
              <MyTouchableInput
                label='From'
                icon={() => icons.calendar(colors.primary)}
                onPress={() => ref_calendar?.current?.openModal(filters?.start_date, "start_date")}
                value={!!filters?.start_date ? moment(filters?.start_date).format(dateTimeFormat.date) : ""}
              />
            </View>
            <View style={[__styles.rowItem, { marginLeft: 10 }]}>
              <MyTouchableInput
                label='To'
                icon={() => icons.calendar(colors.primary)}
                onPress={() => ref_calendar?.current?.openModal(filters?.end_date, "end_date")}
                value={!!filters?.end_date ? moment(filters?.end_date).format(dateTimeFormat.date) : ""}
              />
            </View>
          </View>
        </Collapsible>


        <MyTouchableInput
          label='Select Booking Pages'
          iconOnPress={() => setOptionModal({ isVisble: true, list: pageList, titleKey: "sale_page_title", type: "Booking Page" })}
          view={selectedMembersView}
        />


        <MyTouchableInput
          label='Select Booking Status'
          onPress={() => setOptionModal({ isVisble: true, list: statusList, titleKey: "title", type: "Booking Status" })}
          titleKey={optionModal?.titleKey}
          value={filters?.booking_status?.title}
          clearbutton={!!filters?.booking_status}
          onClearButtonPress={() => setFilters({ ...filters, booking_status: null })}
        />

        <MyTouchableInput
          label='Sort By'
          onPress={() => setSimpleOptionModal({ isVisble: true, list: sortList, titleKey: "sort_title" })}
          value={filters?.sort_by?.sort_title}
        />

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {/* {(!!appliedFilters?.createdFor) ? */}
          <MyClearButton
            style={{ flex: 1, marginRight: 10 }}
            title='Clear Filter'
            onPress={onClearButtonPress}
          />
          {/* : <View style={[{ marginRight: 11 }, __styles.btn]} />} */}


          <MyButton
            style={__styles.btn}
            title='Submit'
            onPress={onSubmitButtonPress}
          />

        </View>

        <OptionModalWithSearch
          isVisible={optionModal.isVisble}
          optionList={optionModal?.list}
          closeModal={closeOptionModal}
          onSelected={onSelected}
          noIcon
          titleKey={optionModal.titleKey}
          title={optionModal?.type}
          filterTheList={filterTheList}
        />

        <OptionModal
          isVisible={simpleOptionModal?.isVisble}
          optionList={simpleOptionModal?.list}
          checkSelected={(opt) => filters?.sort_by?.key == opt?.key}
          onSelected={onSimpleOptSelected}
          titleKey={simpleOptionModal?.titleKey}
          closeModal={closeSimpleOptionModal}
        />

        <CalendarModal
          ref={ref_calendar}
          onDateSelected={onDateSelected}
        />

      </KeyboardAwareScrollView>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default BookingReportFilter

const sortList = [{
  sort_title: "Call booked Newest First",
  key: "call_booked_newest_first"
},
{
  sort_title: "Call booked Oldest First",
  key: "call_booked_oldest_first"
}]

const __styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  rowItem: {
    flex: 1
  },
  clearBtnText: {
    color: colors.delete
  },
  btn: {
    flex: 1
  },
  clearBtn: {
    // marginTop: 20,
    borderColor: colors.delete,
    backgroundColor: colors.delete + "22",
    marginRight: 10
  },
})