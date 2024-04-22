import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import MyText from '../../../components/MyText'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { DELETE_EARNING, GET_NINTY_DAY_DETAIL, SET_90_DAYS_TARGET } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { selectUser } from '../../../redux/reducers/userSlice'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import Collapsible from 'react-native-collapsible';
import { colors } from '../../../utilities/colors'
import { icons } from '../../../utilities/icons'
import { MenuButton, MyButton } from '../../../components/MyButton'
import FAB from '../../../components/FAB'
import routes from '../../../navigation/routes'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import OptionModal from '../../../components/OptionModal'
import ConfirmationModal from '../../../components/ConfirmationModal'
import showToast from '../../../functions/showToast'
import MyInputs from '../../../components/MyInputs'
import MyTouchableInput from '../../../components/MyTouchableInput'
import CalendarModal from '../../../components/CalendarModal'
import { Slider } from '@rneui/themed';
import { LineChart } from 'react-native-chart-kit';
import utilities from '../../../utilities'
import { fonts } from '../../../utilities/fonts'
import numFormatter from '../../../functions/numFormatter'


const _90daysTracker = ({ navigation, route }) => {
  const { key, parentKey } = route?.params
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x.value == parentKey)?.child_options?.find(y => y.value == key)?.title);
  const ref_calendar = useRef();
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [options, setOptions] = useState({ isVisible: false, item: null });
  const [confirmation, setConfirmation] = useState({ isVisible: false, item: null })
  const [targetAmount, setTargetAmount] = useState("");
  const [startDate, setStartDate] = useState(moment())
  const [latestDay, setLatestDay] = useState(1);
  const [chartData, setChartData] = useState(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    if (!loader) {
      setLoader(true)
    }
    get90daysEarningsfromServer()
  }, [route])

  const onAgree = () => {
    let { item } = confirmation;
    setConfirmation({ isVisible: false, item: null })
    setTimeout(() => {
      delete90daysEarningsfromServer(item?._id)
    }, 350);
  }

  const onSelected = (opt) => {
    let { item } = options;
    setOptions({ isVisible: false, item: null });
    setTimeout(() => {
      if (opt.key == "edit") {
        navigation.navigate(routes.addEditEarnings, { earning: item })
      } else if (opt.key == "delete") {
        setConfirmation({ isVisible: true, item: item })
      }
    }, 400);
  }

  const toggleCollpasible = (id) => {
    if (!collapsed[id]) {
      collapsed[id] = true;
    } else {
      delete collapsed[id];
    }
    setCollapsed({ ...collapsed })
  }

  //! APIs

  const get90daysEarningsfromServer = async () => {
    let res = await GET_NINTY_DAY_DETAIL({ navigation, token, });
    setLoader(false);
    if (res.code == 200) {
      let chartData;
      let chartBlockWidth;
      let diff;
      let targetAmount = 0;
      let startDate = moment();
      if (!!res?.ninteen_day_vision_start_date && !!res?.target_amount) {
        targetAmount = res?.target_amount;
        startDate = res?.ninteen_day_vision_start_date;
      }

      if (res?.delegate_earning_app.length > 0) {

        let latest = res?.delegate_earning_app.reduce((a, b) => {
          return new Date(a.date) > new Date(b.date) ? a : b;
        });
        diff = moment(latest.date).diff(moment(res?.ninteen_day_vision_start_date), "days") + 1;


        let startDate = moment(res?.ninteen_day_vision_start_date, "YYYY-MM-DD");
        let date = moment(startDate);
        let filteredData = {};
        let iAmount = 0
        let arr = res?.delegate_earning_app.reverse()
        let number = 1;
        for (let x of arr) {
          let bDate = moment(x.date);
          let diff = moment(bDate).diff(startDate, "days") + 1;
          if (bDate.isSameOrAfter(startDate, "date") && bDate.isSameOrBefore(moment(startDate).add({ days: 90 }))) {
            let iDate = bDate.format("DD.MM.YYYY")
            iAmount += x.earning;
            if (filteredData[iDate]) {
              filteredData[iDate].earning += x.earning;
              filteredData[iDate].tillAmount = iAmount
            } else {
              filteredData[iDate] = {
                date: iDate,
                earning: x.earning,
                tillAmount: iAmount,
                number: number,
                day: diff,
              }
              number++
            }
          } else {
            let iDate = moment(date).format("DD.MM.YYYY");
            iAmount += x.earning;
            if (filteredData[iDate]) {
              filteredData[iDate].earning += x.earning;
              filteredData[iDate].tillAmount += x.tillAmount
            } else {
              filteredData[iDate] = {
                date: iDate,
                earning: x.earning,
                tillAmount: iAmount,
                number: 1,
                day: diff,
              }
              number++
            }
          }
        }

        filteredData = Object.values(filteredData)



        chartData = {
          labels: filteredData.length <= 0 ? [0] : filteredData.map(x => numFormatter(x?.day)),
          datasets: [
            {
              data: filteredData.length <= 0 ? [0] : filteredData.map(x => x?.tillAmount),
            },
            {
              data: [res?.target_amount],
              withDots: false,
            }
          ],
          legend: ["Earnings"]
        };
        let screenWidth = utilities.screenWidth();
        let width = (screenWidth / 10) * chartData.labels.length;
        chartBlockWidth = width < screenWidth ? screenWidth : width;
      } else {
        chartData = {
          labels: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          datasets: [
            {
              data: [0]
            },
            {
              data: [5011],
              withDots: false,
            }
          ],
          legend: ["Earnings"]
        };
        chartBlockWidth = utilities.screenWidth();
        diff = 1;
      }

      console.log(chartData, "chartData")
      setChartData(chartData);
      setChartWidth(chartBlockWidth);
      setLatestDay(diff);
      setTargetAmount(String(targetAmount));
      setStartDate(startDate);
      setData(res);
    }
  }

  const delete90daysEarningsfromServer = async (id) => {
    setLoader(true);
    let res = await DELETE_EARNING({ navigation, token, earningId: id });
    setLoader(false);
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
      get90daysEarningsfromServer();
    }
  }


  const settarget90daysEarnings = async (id) => {
    setLoader(true);
    let res = await SET_90_DAYS_TARGET({
      navigation, token, body: {
        tracker_start_date: moment(startDate).format('YYYY-MM-DD'),
        tracker_target_amount: targetAmount
      }
    });
    setLoader(false);
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
      get90daysEarningsfromServer();
    }
  }


  const header = (
    <View>
      <View style={[__styles.earningView]}>
        {!!chartData &&
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} >
            <LineChart
              data={chartData}
              width={chartWidth}
              height={250}
              segments={4}
              yAxisLabel={''}
              yAxisSuffix=""
              bezier
              chartConfig={{
                decimalPlaces: 0,
                backgroundColor: colors.secondary,
                backgroundGradientFrom: colors.secondary,
                backgroundGradientTo: colors.secondary,
                // fillShadowGradientFromOpacity:1,
                // fillShadowGradientToOpacity:1,
                color: (opacity = 1) => colors.lightPrimary,
                labelColor: (opacity = 1) => colors.white,
                style: {},
                propsForDots: {
                  stroke: colors.primary,
                },
                propsForLabels: {
                  fontFamily: fonts.medium,
                },

              }}
            />
          </ScrollView>}
      </View>

      <View style={__styles.earningView}>
        <MyTouchableInput
          label='90 Days Start Date*'
          value={moment(startDate).format(dateTimeFormat.date)}
          onPress={() => ref_calendar?.current?.openModal(startDate)}
          icon={() => icons.calendar(colors.primary)}
        />

        <MyInputs
          label='Target Amount*'
          value={targetAmount}
          onChangeText={(text) => setTargetAmount(text)}
          keyboardType='number-pad'
          leftIcon={() => icons.cuurency_gbp(colors.primary, 18)}
        />

        <View style={{ marginTop: 10 }}>
          <MyButton invert
            title='Save target'
            onPress={settarget90daysEarnings}
          />
        </View>

        <View style={{ marginTop: 30, marginBottom: 10 }}>
          <MyText fontSize={14} align='center'>
            {`YOUR 90 GOAL WILL BE ACHIEVED BY : \n`}
            <MyText
              fontSize={20}
              type='medium'
              align='center'
              color={colors.primary}>{moment(startDate).add({ days: 89 }).format(dateTimeFormat.date)}</MyText>
          </MyText>
        </View>
      </View>


      <View style={__styles.earningView}>
        {/* <MyText isHeading>Days</MyText> */}
        <View style={__styles.sliderView}>
          <Slider
            minimumValue={1}
            maximumValue={90}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.lightPrimary2}
            thumbTintColor={colors.primary}
            thumbStyle={{ height: 20, width: 20 }}
            value={latestDay}
            step={1}
            disabled={true}
            thumbProps={{
              children: (
                <View style={__styles.slideRootView}>
                  <View style={__styles.sliderUpperView}>
                    <MyText color={colors.primary}>{`Day ${latestDay}`}</MyText>
                  </View>
                  <View style={__styles.sliderUpperViewarrow} />
                </View>
              ),
            }}
          />
          <View style={__styles.sliderPoints}>
            <MyText color={colors.primary} >Day 1</MyText>
            <MyText color={colors.primary}>Day 90</MyText>

          </View>
        </View>
      </View>

      <View style={__styles.earningView}>
        {/* <MyText isHeading>Earning</MyText> */}
        <View style={__styles.sliderView}>
          <Slider
            minimumValue={0}
            maximumValue={!!data?.target_amount ? data?.target_amount : 0}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.lightPrimary2}
            thumbTintColor={colors.primary}
            thumbStyle={{ height: 20, width: 20 }}
            value={!!data?.total_earning ? data?.total_earning : 0}
            step={1}
            disabled={true}
            thumbProps={{
              children: (
                <View style={__styles.slideRootView}>
                  <View style={__styles.sliderUpperView}>
                    <MyText color={colors.primary}>{`£ ${!!data?.total_earning ? data?.total_earning : 0}`}</MyText>
                  </View>
                  <View style={__styles.sliderUpperViewarrow} />
                </View>
              ),
            }}
          />
          <View style={__styles.sliderPoints}>
            <MyText color={colors.primary} ></MyText>
            <MyText color={colors.primary}>{data?.target_amount}</MyText>

          </View>
        </View>
      </View>
    </View>
  )
  const renderEarnings = ({ item, index }) => {
    return (
      <View style={__styles.earningView}>
        <Pressable
          onPress={() => toggleCollpasible(item?._id)}
          style={{ flexDirection: "row", paddingVertical: 5 }}>
          <View style={{ flex: 1 }}>
            <MyText
              fontSize={16}
              type='medium'>{`Earning Date: ${moment(item?.date).format(dateTimeFormat.date)} : ${item?.earning}`}</MyText>
          </View>
          {!collapsed[item?._id] ? icons.upwardArrow() : icons.downwardArrow()}
        </Pressable>
        <Collapsible collapsed={!!collapsed[item?._id]}>
          <View style={{ flexDirection: "row", paddingVertical: 5, alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <MyText>{item?.description}</MyText>
            </View>
            <MenuButton
              onPress={() => setOptions({ isVisible: true, item: item })}
            />
          </View>
        </Collapsible>
      </View>
    )
  }


  return (
    <RootView
      hideBackBottomButton
      title={title}
    >
      {!!data &&
        <View style={{ flex: 1 }}>
          <KeyboardAwareFlatList
            contentContainerStyle={{ paddingBottom: 80 }}
            enableResetScrollToCoords={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item?._id}
            data={!!data ? data?.delegate_earning_app.slice().reverse() : []}
            renderItem={renderEarnings}
            ListHeaderComponent={header}
          // ListFooterComponent={footer}
          />

        </View>}
      <FAB
        onPress={() => navigation.navigate(routes.addEditEarnings, { earning: undefined })}
      />

      <OptionModal
        isVisible={options.isVisible}
        onSelected={onSelected}
        optionList={optionsList}
        closeModal={() => setOptions({ isVisible: false, item: null })}
      />

      <ConfirmationModal
        title={"Are you sure you want to delete this earning?"}
        isVisible={confirmation.isVisible}
        onAgree={onAgree}
        closeModal={() => setConfirmation({ isVisible: false, item: null })}
      />

      <CalendarModal
        onDateSelected={(date) => setStartDate(date)}
        ref={ref_calendar}
      />

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default _90daysTracker

const optionsList = [

  {
    title: "Edit",
    key: "edit",
    icon: icons.edit
  },
  {
    title: "Delete",
    key: "delete",
    icon: icons.trash
  },

]

const __styles = StyleSheet.create({
  earningView: {
    backgroundColor: colors.secondary,
    padding: 10,
    marginTop: 10,
    borderRadius: 10
  },
  slideRootView: {
    position: "absolute",
    top: -45,
    left: -30
  },
  sliderUpperView: {
    width: 80,
    height: 30,
    backgroundColor: colors.secondarySelect,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  sliderUpperViewarrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderTopWidth: 6,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: colors.secondarySelect,
    alignSelf: "center"
  },
  sliderView: { marginTop: 40, paddingHorizontal: 30 },
  sliderPoints: { flexDirection: "row", justifyContent: "space-between" }

})