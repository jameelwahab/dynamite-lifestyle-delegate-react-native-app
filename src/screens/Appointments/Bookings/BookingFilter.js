import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { MyButton } from '../../../components/MyButton'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'

const BookingFilter = ({ navigation, route }) => {
  const { token } = useSelector(selectUser);
  const [memberlist, setMemberlist] = useState([]);
  const [pageList, setPageList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState("")
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [optionModal, setOptionModal] = useState({
    isVisble: false,
    list: [],
    type: "",
    titleKey: ""
  })
  useEffect(() => {
    getBookingsPagesFromServer();
    getBookingStatuesFromServer()
  }, [])


  const closeOptionModal = () => { setOptionModal({ isVisble: false, list: [], type: "", titleKey: "" }) }
  const onSelected = (opt) => {
    console.log(opt);
    closeOptionModal()
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

  return (
    <RootView title='Filter' >
      <KeyboardAwareScrollView
        contentContainerStyle={{ marginTop: 10, marginHorizontal: 10 }}>

        <View style={{ marginBottom: 10 }}>
          <MyCheckBox
            onPress={() => setShowDateFilter((val) => !val)}
            value={showDateFilter}
            title='Filter By Booking Dates'
          />
        </View>

        <Collapsible collapsed={!showDateFilter} >
          <View style={__styles.row}>
            <View style={__styles.rowItem}>
              <MyTouchableInput
                label='From'
                icon={icons.calendar}
              />
            </View>
            <View style={[__styles.rowItem, { marginLeft: 10 }]}>
              <MyTouchableInput
                label='To'
                icon={icons.calendar}
              />
            </View>
          </View>
        </Collapsible>


        <MyTouchableInput
          label='Select Booking Pages'
          onPress={() => setOptionModal({ isVisble: true, list: pageList, titleKey: "sale_page_title", type: "Booking Page" })}
        />


        <MyTouchableInput
          label='Select Booking Status'
        />

        <MyTouchableInput
          label='Sort By'
        />

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {/* {(!!appliedFilters?.createdFor) ? */}
          <MyButton
            style={[__styles.clearBtn, __styles.btn]}
            textStyle={__styles.clearBtnText}
            invert
            title='Clear Filter'
          />
          {/* : <View style={[{ marginRight: 11 }, __styles.btn]} />} */}


          <MyButton
            style={__styles.btn}
            title='Submit'

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
        />


      </KeyboardAwareScrollView>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default BookingFilter

const sortList = [{
  title: "Call booked Newest First",
  key: "call_booked_newest_first"
},
{
  title: "Call booked Oldest First",
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