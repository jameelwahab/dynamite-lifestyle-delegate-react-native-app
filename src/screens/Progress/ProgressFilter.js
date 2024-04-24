import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { GET_BOOKING_STATUSES, GET_SALE_PAGE_LIST_FOR_BOOKING, PROGRESS_CATEGORIES_LIST } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import MyCheckBox from '../../components/MyCheckBox'
import MyTouchableInput from '../../components/MyTouchableInput'
import { icons } from '../../utilities/icons'
import Collapsible from 'react-native-collapsible'
import { colors } from '../../utilities/colors'
import { MyButton } from '../../components/MyButton'
import OptionModalWithSearch from '../../components/OptionModalWithSearch'
import MyChip from '../../components/MyChip'
import OptionModal from '../../components/OptionModal'
import CalendarModal from '../../components/CalendarModal'
import moment from 'moment'
import { dateTimeFormat } from '../../utilities/constants'
import routes from '../../navigation/routes'

const ProgressFilter = ({ navigation, route }) => {
  const { filters: appliedFilters } = route?.params
  const ref_calendar = useRef();
  const { token, } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [optionModalVisibility, setOptionModalVisibility] = useState(false);
  const [filters, setFilters] = useState(appliedFilters);
  const [catList, setCatList] = useState([]);


  useEffect(() => {
    getCategoriesFromServer()
  }, [])

  const onClearButtonPress = () => {
    navigation.navigate(routes.progresssList, {
      filters: {
        end_date: undefined,
        start_date: undefined,
        progress_category: undefined,
        filter_by: "all",
        filterByDate: false
      }
    })
  }

  const onSubmitButtonPress = () => {
    navigation.navigate(routes.progresssList, { filters })
  }





  const getCategoriesFromServer = async () => {
    let res = await PROGRESS_CATEGORIES_LIST({ navigation, token });
    if (res.code == 200) {
      setCatList(res?.progress_report_category);
    }
    setLoader(false)
  }



  return (
    <RootView title='Filter' >
      <KeyboardAwareScrollView
        contentContainerStyle={{ marginTop: 10, marginHorizontal: 10 }}>


        <MyCheckBox
          title='Filter By Dates'
          value={filters?.filterByDate}
          onPress={() => setFilters({ ...filters, filterByDate: !filters?.filterByDate })}
        />


        <Collapsible collapsed={!filters?.filterByDate}>
          <View style={{ marginTop: 10 }}>
            <MyTouchableInput
              label='From'
              onPress={() => ref_calendar?.current?.openModal(filters?.start_date, "start_date")}
              value={!!filters?.start_date ? moment(filters?.start_date).format(dateTimeFormat.date) : ""}
              icon={() => icons.calendar(colors.primary)}
            />

            <MyTouchableInput
              label='To'
              onPress={() => ref_calendar?.current?.openModal(filters?.end_date, "end_date")}
              value={!!filters?.end_date ? moment(filters?.end_date).format(dateTimeFormat.date) : ""}
              icon={() => icons.calendar(colors.primary)}
            />
          </View>
        </Collapsible>


        <View style={{ marginTop: 20 }}>
          <MyText type='medium' color={colors.primary} >Choose Type</MyText>
          <View style={{ marginTop: 15 }}>
            {typeList.map((item, index) => {
              return (
                <MyCheckBox
                  key={"checkbox" + index}
                  pb={15}
                  title={item.title}
                  onPress={() => setFilters({ ...filters, filter_by: item?.key })}
                  value={item?.key == filters?.filter_by}
                  circle
                />
              )
            })}
          </View>
        </View>

        <View style={{ marginTop: 5 }}>
          <MyTouchableInput
            label='Progress Categories *'
            value={!!filters?.progress_category ? filters?.progress_category?.title : ""}
            onPress={() => setOptionModalVisibility(true)}
          />
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {/* {(!!appliedFilters?.createdFor) ? */}
          <MyButton
            style={[__styles.clearBtn, __styles.btn]}
            textStyle={__styles.clearBtnText}
            invert
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



        <OptionModal
          isVisible={optionModalVisibility}
          optionList={catList}

          // checkSelected={(opt) => setFilters({ ...filters, progress_category: opt?._id })}
          onSelected={(opt) => {
            setOptionModalVisibility(false);
            setFilters({ ...filters, progress_category: opt })
          }}
          closeModal={() => setOptionModalVisibility(false)}
        />

        <CalendarModal
          ref={ref_calendar}
          onDateSelected={(date, type) => setFilters({ ...filters, [type]: date })}
        />

      </KeyboardAwareScrollView>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default ProgressFilter


const typeList = [
  { key: "daily", title: "Daily" },
  { key: "weekly", title: "Weekly" },
  { key: "monthly", title: "Monthly" },
  { key: "custom", title: "Custom" },
  { key: "all", title: "All" },

]
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