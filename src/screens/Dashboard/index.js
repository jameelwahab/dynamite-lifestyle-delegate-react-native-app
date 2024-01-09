import { View, Text, StyleSheet, ScrollView, SectionList, Pressable } from 'react-native'
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
import { convertTimezone } from '../../functions/convertTime'
import moment from 'moment'
import EmptyView from '../../components/EmptyView'
import { icons } from '../../utilities/icons'
import routes from '../../navigation/routes'

const Dasboard = ({ navigation }) => {
  const { token } = useSelector(selectUser);
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [filter, setFilter] = useState({});


  const getDashboarddata = async () => {
    let res = await DASHBAORD({ navigation, token, body: filter });
    if (res.code == 200) {
      setData(res);
      setLoader(false)
    } else {
      setLoader(false)
    }
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
        <View style={{ marginBottom: 5 }}>
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
      </View>
    )
  }

  const bookingView = ({ item, index }) => {
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
        {itemView("Date", moment(item?.start_date_time).format("DD-MM-YYYY") + " (" + moment(item?.start_date_time).format("hh:mm A") + " - " + moment(item?.end_date_time).format("hh:mm A") + ")")}
        {itemView("Booking Status", item?.booking_status_info?.title, item?.booking_status_info?.background_color)}

      </View>
    )
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

  const sectionFooter = ({ section }) => {
    if (section.data.length == 0) {
      return (
        <View style={{ marginVertical: 10 }}>
          <EmptyView label={"No Data Exist"} />
        </View>
      )
    } else return null;
  }

  const sections = [
    {
      title: "Latest Bookings",
      data: data?.latest_booking_list,
    },
    {
      title: "Upcoming Bookings",
      data: data?.upcomming_booking_list,
    }
  ]



  const topView = () => {
    return (
      <View style={__style.topView}>
        <Pressable onPress={onFilterScreen} style={__style.filterButton} >
          {icons.filterCircle(colors.primary, 25)}
        </Pressable>
      </View>
    )
  }

  return (
    <RootView hideSubHeader >
      <View style={{ flex: 1 }}>
        <SectionList
          contentContainerStyle={{ paddingBottom: 50 }}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={!!data && view_commissionCounters}
          sections={!!data ? sections : []}
          renderItem={bookingView}
          renderSectionHeader={sectionHeader}
          renderSectionFooter={sectionFooter}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default Dasboard;

const __style = StyleSheet.create({
  countersView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  filterButton: { height: "100%", justifyContent: "center", width: 50, alignItems: "center" },
  topView: { flex: 1, flexDirection: "row", justifyContent: "flex-end" }
})