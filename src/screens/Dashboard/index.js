import { View, Text, StyleSheet, ScrollView, SectionList, Pressable, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import MyLoader from '../../components/MyLoader'
import { DASHBAORD } from '../../DAL'
import { selectUser } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import CounterBox from './CounterBox'
import { colors } from '../../utilities/colors'
import UserImage from '../../components/UserImage'
import { convertTimezone, convertTimezoneFrom } from '../../functions/convertTime'
import moment from 'moment'
import EmptyView from '../../components/EmptyView'
import { icons } from '../../utilities/icons'
import routes from '../../navigation/routes'
import { selectSettings } from '../../redux/reducers/settingSlice'
import MyWebview from '../../components/MyWebview'
import ResponsiveImage from '../../components/ResponsiveImage'
import utilities from '../../utilities'
import { S3_URL, dateTimeFormat } from '../../utilities/constants'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import { selectTimeZone } from '../../redux/reducers/timezoneSlice'
import MyChip from '../../components/MyChip'
import Tabs from '../../components/Tabs'
import prependCurency from '../../functions/prependCurency'
import { TransparentButton } from '../../components/MyButton'

const Dasboard = ({ navigation }) => {
  const { token } = useSelector(selectUser);
  const { settings } = useSelector(selectSettings);
  const timezone = useSelector(selectTimeZone);
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [filter, setFilter] = useState({});
  const [bookingTab, setBookingTab] = useState(0);


  const getDashboarddata = async () => {
    let res = await DASHBAORD({ navigation, token, body: filter, filter: Object.keys(filter).length > 0 });
    if (res.code == 200) {
      setData(res);
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const onCommissionlist = () => {
    navigation.jumpTo(routes.commissionNavigator)
  }


  useEffect(() => {

    console.log()
    if (!loader) {
      setData(null);
      setLoader(true);
    }
    getDashboarddata();
  }, [JSON.stringify(filter)])


  const filterTheData = (obj) => {
    console.log(obj, "filter Obj")
    setFilter(obj);
  }

  const onFilterScreen = () => {
    navigation.navigate(routes.missionControlfilterScreen, { filterTheData, filter })
  }


  //? //////// Views

  const view_commissionCounters = () => {
    return (

      <View style={{ marginTop: 10 }}>
        {!!settings?.brand_logo_2 &&
          <View style={{ alignItems: "center" }}>
            <ResponsiveImage2
              width={utilities.screenWidth() * 0.6}
              uri={S3_URL + settings?.brand_logo_2}
            />
          </View>}

        {!!settings?.dashboard_content &&
          <View style={{ marginTop: 10 }}>
            <MyWebview
              fullWidth={true}
              html={settings?.dashboard_content} />
          </View>}


        <View style={{ marginBottom: 5, marginTop: 15 }}>
          {topView()}
        </View>
        <View style={__style.countersView}>
          <CounterBox
            color={"#283C35"}
            count={data?.today_commission}
            subTitle={"Today's Commission"}
          />

          <CounterBox
            count={data?.remaining_commission}
            subTitle={"Pending Commission"}
            color={"#1F2D4C"} />

        </View>
        <View style={__style.countersView}>
          <CounterBox
            count={data?.paid_commission}
            subTitle={"Total Paid Commission"}
            color={"#3B3834"}
          />

          <CounterBox
            count={data?.total_commission}
            subTitle={"Total Commission Attracted"}
            color={"#3A2737"} />
        </View>

        <Tabs
          changeTab={(index) => setBookingTab(index)}
          list={tabs}
          tab={bookingTab}
        />
        {/* <View style={__style.tabsView}>
          <TouchableOpacity
            onPress={() => setBookingTab(1)}
            style={[__style.tabView, bookingTab == 1 && __style.tabSelectedView]}>
            <MyText fontSize={18} color={bookingTab == 1 ? colors.primary : undefined} type={bookingTab == 1 ? "medium" : undefined}>
              Latest Bookings
            </MyText>
            <View style={[__style.selectline, { backgroundColor: bookingTab == 1 ? colors.primary : colors.transparent }]} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setBookingTab(2)}
            style={[__style.tabView, bookingTab == 2 && __style.tabSelectedView]}>
            <MyText fontSize={18} color={bookingTab == 2 ? colors.primary : undefined} type={bookingTab == 2 ? "medium" : undefined} >
              Upcoming Bookings
            </MyText>
            <View style={[__style.selectline, { backgroundColor: bookingTab == 2 ? colors.primary : colors.transparent }]} />
          </TouchableOpacity>
        </View> */}
      </View>
    )
  }

  const bookingView = ({ item, index }) => {
    if (bookingTab == 2) {
      return (
        <View style={{ marginTop: index != 0 ? 10 : 0, backgroundColor: colors.secondary, padding: 10, borderRadius: 10, }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <UserImage
              image={item?.member_info?.profile_image}
              name={item?.member_info?.first_name}
              size={30}
            />
            <View style={__style.nameAndAmountView}>
              <MyText fontSize={14} type='medium' >{item?.member_info?.first_name + " " + item?.member_info?.last_name}</MyText>
              <MyText fontSize={14} type='medium'>{prependCurency(item?.currency) + " " + item?.amount}</MyText>
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{ marginTop: index != 0 ? 10 : 0, backgroundColor: colors.secondary, padding: 10, borderRadius: 10, }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <UserImage
              image={item?.user_info?.profile_image}
              name={item?.user_info?.first_name}
              size={30}
            />
            <View style={{ marginLeft: 10 }}>
              <MyText fontSize={14} type='medium' >{item?.user_info?.first_name + " " + item?.user_info?.last_name}</MyText>
              <MyText fontSize={12} type='light'>{item?.user_info?.email}</MyText>
            </View>
          </View>
          {itemView("Booking page", item?.page?.sale_page_title)}
          {itemView("Date", moment(item?.start_date_time).format("DD-MM-YYYY") + " (" + moment(item?.time, "hh:mm A").format("hh:mm A") + " - " + moment(item?.time, "hh:mm A").add({ minutes: item?.slot_duration }).format("hh:mm A") + ")")}
          {itemView("Booking Status", item?.booking_status_info?.title, item?.booking_status_info?.background_color)}

        </View>
      )
    }
  }

  const itemView = (title, value, color = null) => {
    return (
      <View style={{ flexDirection: "row", marginTop: 10, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText, paddingBottom: 5 }}>
        <View style={{ flex: 0.7 }}>
          <MyText fontSize={12} color={colors.lightText2}>{title}</MyText>
        </View>
        <View style={{ flex: 1 }}>
          <MyText fontSize={12} type='medium' color={!!color ? color : undefined} >{value}</MyText>
        </View>
      </View>
    )
  }

  const sectionHeader = ({ section: { title } }) => {
    return (
      <View style={{ marginVertical: 10 }}>
        <MyText color={colors.primary} fontSize={18} type='medium'>{title}</MyText>
      </View>
    )
  }

  const sectionEmpty = () => {
    if (!loader) {
      return (
        <View style={{ marginVertical: 10 }}>
          <EmptyView label={"No Data Exist"} />
        </View>
      )
    } else return null;
  }


  const sectionFooter = () => {
    if (!loader && bookingTab == 2) {
      return (
        <View style={{ marginVertical: 10, alignItems: "flex-end" }}>
          <TransparentButton
            onPress={onCommissionlist}
            title='View All' />
        </View>
      )
    } else return null;
  }





  const topView = () => {
    return (
      <View style={__style.topView}>


        {!!filter?.start_date && filter?.end_date ?
          // <View style={__style.chip}>
          //   <MyText type='medium' fontSize={12} color={colors.black} style={{ marginRight: 5 }} >
          //     {`${moment(filter?.start_date, "YYYY-MM-DD").format(dateTimeFormat.date)} to ${moment(filter?.end_date, "YYYY-MM-DD").format(dateTimeFormat.date)}`}
          //   </MyText>
          //   <TouchableOpacity
          //     hitSlop={{ bottom: 5, top: 5, left: 5, right: 5 }}
          //     onPress={() => filterTheData({})} >
          //     {icons.crosssWithCircle_20(colors.black, 20)}
          //   </TouchableOpacity>
          // </View> 
          <MyChip
            onPress={() => filterTheData({})}
            title={`${moment(filter?.start_date, "YYYY-MM-DD").format(dateTimeFormat.date)} to ${moment(filter?.end_date, "YYYY-MM-DD").format(dateTimeFormat.date)}`}
          />
          :
          <View />}

        <TouchableOpacity
          onPress={onFilterScreen}
          style={__style.filterButton}
          hitSlop={{ bottom: 5, top: 5, left: 5, right: 5 }}
        >
          {icons.filterCircle(colors.primary, 30)}
          {/* <MyText color={colors.primary} style={{ marginLeft: 5 }} >Filter</MyText> */}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <RootView hideSubHeader >
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 50 }}
          data={!!data ?
            bookingTab == 0 ?
              data?.latest_booking_list :
              bookingTab == 1 ?
                data?.upcomming_booking_list :
                bookingTab == 2 ?
                  data?.transaction.slice().reverse() :
                  [] :
            []
          }
          ListHeaderComponent={!!data && view_commissionCounters()}
          renderItem={bookingView}
          // renderSectionHeader={sectionHeader}
          ListEmptyComponent={sectionEmpty}
          ListFooterComponent={sectionFooter()}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default Dasboard;

const tabs = [{
  title: "Latest Booking",
  index: 0,
  key: "latest_booking_list"
},
{
  title: "Upcoming Booking",
  index: 1,
  key: "upcoming_booking_list"
},
{
  title: "Latest Transactions",
  index: 2,
  key: "latest_transactions"
}]

const __style = StyleSheet.create({
  chip: {
    backgroundColor: colors.primary, borderRadius: 15,
    justifyContent: "center", padding: 5,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center"
  },
  countersView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  filterButton: {
    height: "100%",
    justifyContent: "center",
    // width: 50,
    alignItems: "center",
    flexDirection: "row",
    // borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
    // paddingVertical: 8
  },
  topView: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tabsView: {
    flexDirection: "row",
    marginBottom: 10,
    // borderWidth: 1,
    // borderColor: colors.white,
    padding: 5,
    height: 45,
    borderRadius: 10,
    marginTop: 10,

  },
  nameAndAmountView: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  tabSelectedView: {
    // borderColor: colors.primary,
    // backgroundColor: colors.primary2,


  },

  tabView: {
    // flex: 1,
    borderRadius: 5,
    // borderBottomWidth: 1,
    // borderBottomColor: colors.lightPrimary2,
    paddingVertical: 5,
    // paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 20
  },
  selectline: {
    height: 2,
    width: "100%",

    borderRadius: 20,
    marginTop: 3
  }
})