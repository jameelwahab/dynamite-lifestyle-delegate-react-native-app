
import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { icons } from '../../../utilities/icons'
import { colors } from '../../../utilities/colors'
import { MyButton, MyClearButton } from '../../../components/MyButton'
import CalendarModal from '../../../components/CalendarModal'
import moment, { months } from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import routes from '../../../navigation/routes'
import showToast from '../../../functions/showToast'
import MonthYearPicker from '../../../components/MonthYearPicker'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'
import { GET_SALE_PAGES_AND_DELEGATES } from '../../../DAL'
import MyText from '../../../components/MyText'
import MyChip from '../../../components/MyChip'

const SaleFilter = ({ navigation, route }) => {
  const { delegateId, filters: appliedFilter } = route?.params;
  const ref_month_year_picker = useRef();
  const { token, } = useSelector(selectUser);
  const [filters, setFilters] = useState(appliedFilter);
  const [searchText, setSearchText] = useState("")
  const [delegateList, setdelegateList] = useState([]);
  const [pagesList, setPagesList] = useState([]);
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    titlekey: "",
    list: []
  })




  const closeOptionModal = () => {
    setOptionModal({
      isVisible: false,
      titlekey: "",
      list: []
    })
  }

  useEffect(() => {
    getPagesAndDeleates()
  }, [searchText])



  const onClearButtonPress = () => {
    navigation.navigate(routes.delegateReportSalesScreen, {
      filters: {
        compare_with: undefined,
        pages: [],
        currentMonthYear: moment().format("MM-YYYY")
      },
      item: route?.params?.item
    })
  }

  const onSubmitButtonPress = () => {
    navigation.navigate(routes.delegateReportSalesScreen, { filters, item: route?.params?.item })
  }





  const onSelected = (item) => {
    let { titlekey } = optionModal;
    closeOptionModal();
    if (titlekey == "sale_page_title") {
      filters?.pages?.push(item);
      setFilters({ ...filters })
    } else {
      setFilters({ ...filters, compare_with: item })
    }
  }


  //! APIs

  const getPagesAndDeleates = async () => {

    let res = await GET_SALE_PAGES_AND_DELEGATES({
      navigation, token,
      delegateId, searchText: searchText.trim(),
    });
    if (res.code == 200) {
      setdelegateList(res?.delegate);
      setPagesList(res?.sale_pages);

    }
  }


  const filterTheList = (list) => {
    if (optionModal.titlekey == "sale_page_title") {
      return list.slice("").filter((item) => {
        return !(!!filters?.pages.find(x => x._id == item._id));
      })
    } else {
      console.log(list, "list")
      return list
    }
  }

  const filterTheListonSearch = (list, search) => {
    if (optionModal.titlekey == "sale_page_title") {
      if (search.trim().toLowerCase() == "") {
        return list
      } else {
        let nStext = search.trim().toLowerCase();
        return list.slice().filter(x => x.sale_page_title.toLowerCase().includes(nStext));
      }
    } else {
      return list
    }
  }

  const pagesView = () => {
    return (
      <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", padding: 3 }}>
        {filters.pages?.map((item, index) => (
          <MyChip
            title={item?.sale_page_title}
            onPress={() => {
              filters?.pages.splice(index, 1);
              setFilters({ ...filters })
            }} />
        ))}

      </View>
    )
  }



  return (
    <RootView title='Filter' >
      <KeyboardAwareScrollView
        contentContainerStyle={{ marginTop: 10, marginHorizontal: 10 }}>





        <MyTouchableInput
          label='Month and Year *'
          icon={() => icons.calendar(colors.primary)}
          onPress={() => ref_month_year_picker?.current?.openModal(filters?.monthYear)}
          value={!!filters?.currentMonthYear ? moment(filters?.currentMonthYear, "MM-YYYY").format("MMM YYYY") : ""}
        />


        <MyTouchableInput
          label='Select Page'
          onPress={() => setOptionModal({ isVisible: true, list: pagesList, titlekey: "sale_page_title", })}
          view={pagesView}
          clearbutton={filters?.pages.length > 0}
          onClearButtonPress={() => {
            setFilters({ ...filters, pages: [] });
          }}
        />

        <MyTouchableInput
          label='Compare With'
          onPress={() => setOptionModal({ isVisible: true, list: delegateList, titlekey: "", })}
          value={!!filters?.compare_with ? `${filters?.compare_with?.first_name} ${filters?.compare_with?.last_name} (${filters?.compare_with?.email})` : ""}
          clearbutton={!!filters?.compare_with}
          onClearButtonPress={() => {
            setFilters({ ...filters, compare_with: undefined });
          }}
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
          isVisible={optionModal?.isVisible}
          closeModal={closeOptionModal}
          optionList={optionModal?.titlekey == "sale_page_title" ? filterTheList(optionModal?.list) : delegateList}
          onSearchTextChange={(text) => setSearchText(text)}
          filterTheList={optionModal?.titlekey == "sale_page_title" ? filterTheListonSearch : undefined}
          noIcon
          title={optionModal?.titlekey == "" ? "Delegate" : "Sale Page"}
          renderText={({ item }) => (
            <>
              {optionModal?.titlekey == "" ?
                <MyText fontSize={16} >
                  {`${item?.first_name} ${item?.last_name} (${item?.email})`}
                </MyText> :
                <MyText fontSize={16} >{item?.[optionModal?.titlekey]}</MyText>}
            </>)}
          onSelected={onSelected}
        />


        <MonthYearPicker
          ref={ref_month_year_picker}
          onAgree={(monthsSelected) => setFilters({ ...filters, currentMonthYear: monthsSelected })}
        />

      </KeyboardAwareScrollView>
    </RootView>
  )
}

export default SaleFilter


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