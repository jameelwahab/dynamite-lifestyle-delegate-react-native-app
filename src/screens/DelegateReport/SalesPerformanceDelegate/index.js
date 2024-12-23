import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import MemberView from '../../../components/MemberView'
import MyLoader from '../../../components/MyLoader'
import { GET_COMMISSION_DETAIL } from '../../../DAL'
import { LineChart } from 'react-native-chart-kit'
import utilities from '../../../utilities'
import { colors } from '../../../utilities/colors'
import moment from 'moment'
import prependCurency from '../../../functions/prependCurency'
import { icons } from '../../../utilities/icons'
import routes from '../../../navigation/routes'
import MyChip from '../../../components/MyChip'
import { dateTimeFormat } from '../../../utilities/constants'
import { randomColorCode } from '../../../functions/randomColorCode'

const SalesPerformanceDelegate = ({ navigation, route }) => {
  const { item } = route?.params
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [graphData, setGraphData] = useState(null);
  const [graphData2, setGraphData2] = useState(null);
  const [data, setData] = useState(null)
  const [showChips, setShowChips] = useState(false);
  const [filters, setFilters] = useState({
    compare_with: undefined,
    pages: [],
    currentMonthYear: moment().format("MM-YYYY")
  });
  const [keyToValues, setkeyToValues] = useState({})


  useEffect(() => {
    setkeyToValues({})
    setGraphData(null)
    setGraphData2(null)
    setLoader(true)
    getSales()
  }, [JSON.stringify(filters)])


  useEffect(() => {
    if (route.params?.filters) {
      setFilters(route.params.filters)
    }
  }, [route])

  //* Filter Functions

  const resetFilterMonth = () => {
    let currentMonth = moment().format("MM");
    let appliedYear = filters?.currentMonthYear.split("-")[1];
    setFilters({ ...filters, currentMonthYear: currentMonth + "-" + appliedYear })
  }

  const resetFilterYear = () => {
    let currentYear = moment().format("YYYY");
    let appliedMonth = filters?.currentMonthYear.split("-")[0];
    setFilters({ ...filters, currentMonthYear: appliedMonth + "-" + currentYear })
  }

  const removePage = (index) => {
    filters?.pages.splice(index, 1);
    setFilters({ ...filters })
  }

  const resetFilters = () => {
    setFilters({
      compare_with: undefined,
      pages: [],
      currentMonthYear: moment().format("MM-YYYY")
    })
  }


  const getArray = (data, arr, compare) => {
    let lebels = [];
    let values = [];
    let values2 = [];
    let max = 0;
    let diff = moment(data?.end_date, "DD-MM-YYYY").diff(moment(data?.start_date, "DD-MM-YYYY"), 'days');
    for (let i = 0; i <= diff; i++) {
      let date = moment(data?.start_date, "DD-MM-YYYY").add({ day: i }).format("DD-MM-YYYY");
      lebels.push(moment(date, "DD-MM-YYYY").format("DD MMM"))
      let found = arr.find(x => x.date == date);
      if (!!found) {
        values.push(found.total_commission)
        if (found.total_commission > max) {
          max = found.total_commission
        }
      } else {
        values.push(0)
      }

      if (compare) {
        let found1 = data?.compare_with_use_commission_stats.find(x => x.date == date);
        if (!!found1) {
          values2.push(found1.total_commission)
          if (found1.total_commission > max) {
            max = found1.total_commission
          }
        } else {
          values2.push(0)
        }
      }
    }

    let dataset = {
      labels: lebels,
      datasets: [
        {
          data: values,
          color: (opacity = 1) => "#EDBF60",
        },
        {
          data: [max + 50],
          withDots: false,
        }
      ]
    }
    let dataset2 = null;
    if (compare) {
      dataset2 = {
        labels: lebels,
        datasets: [
          {
            data: values2,
            color: (opacity = 1) => "#EDBF60",
          },
          {
            data: [max + 50],
            withDots: false,
          }
        ]
      }
    }


    setGraphData(dataset)
    setGraphData2(dataset2)

  }

  const getMultipleArray = (data, compare) => {


    let lebels = [];
    let values = [];
    let values2 = [];
    let max = 0;
    data?.page_commission_stats_array.map((x, k) => {
      values.push([])
      values2.push([])
    })


    let diff = moment(data?.end_date, "DD-MM-YYYY").diff(moment(data?.start_date, "DD-MM-YYYY"), 'days');
    for (let i = 0; i <= diff; i++) {
      let date = moment(data?.start_date, "DD-MM-YYYY").add({ day: i }).format("DD-MM-YYYY");
      lebels.push(moment(date, "DD-MM-YYYY").format("DD MMM"))
      data?.page_commission_stats_array.forEach((x, j) => {
        let found = x?.commission_stats_array.find(y => y.date == date);
        if (found) {
          values[j].push(found?.total_commission)
          if (found?.total_commission > max) {
            max = found?.total_commission
          }
        } else {
          values[j].push(0)
        }
      })

      if (compare) {
        data?.compare_with_page_commission_stats_array.forEach((x, j) => {
          let found1 = x?.commission_stats_array.find(y => y.date == date);
          if (found1) {
            values2[j].push(found1?.total_commission)
            if (found1?.total_commission > max) {
              max = found1?.total_commission
            }
          } else {
            values2[j].push(0)
          }
        })
      }
    }

    let dataset = [];
    let dataset2 = [];
    let KeyToValues = {};

    values.forEach((x, i) => {
      let color = randomColorCode();


      dataset.push({
        data: x,
        color: (opacity = 1) => color,
      })
      dataset2.push({
        data: values2[i],
        color: (opacity = 1) => color,
      })
      KeyToValues[color] = data?.page_commission_stats_array[i].sale_page_title

    });



    dataset.push({ data: [max + 50], withDots: false, })
    dataset2.push({ data: [max + 50], withDots: false, })


    let dataSet = {
      labels: lebels,
      datasets: dataset
    }
    let dataSet2 = null
    if (compare) {
      dataSet2 = {
        labels: lebels,
        datasets: dataset2
      }
    }


    setkeyToValues(KeyToValues)
    setGraphData(dataSet)
    setGraphData2(dataSet2)

  }

  //! APIs

  const getSales = async (id) => {
    setLoader(true);
    let pagesId = filters?.pages.map(page => page?._id);
    let res = await GET_COMMISSION_DETAIL({
      navigation, token, delegateId: item?._id, body: {
        month_and_year: filters?.currentMonthYear,
        month_name: moment(filters?.currentMonthYear, "MM-YYYY").format("MMMM"),
        year_name: moment(filters?.currentMonthYear, "MM-YYYY").format("YYYY"),
        sale_page: filters?.pages,
        page: pagesId,
        compare_with: !!filters.compare_with ? filters.compare_with?._id : undefined,
      }
    });
    setLoader(false);
    if (res.code == 200) {
      if (filters?.pages.length > 0) {
        getMultipleArray(res, !!filters?.compare_with)
      } else {
        getArray(res, res?.commission_stats, !!filters?.compare_with);
      }
      setData(res)
      // showToast({ title: res?.message, type: "success" });
      // get90daysEarningsfromServer();
    }
  }

  const topView = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <MyText isHeading> {`${item?.first_name} ${item?.last_name} Sales`}</MyText>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(routes.delegateReportSalesFilterScreen, {
            delegateId: item?._id,
            filters,
            item
          })}
          style={{ paddingRight: 5 }}>
          {icons.filterCircle(colors.primary, 25)}
        </TouchableOpacity>
      </View >
    )
  }

  const filterView = () => {
    let count = 2;
    if (!!filters.compare_with) {
      count = 3
    }
    return (
      <View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
          <MyText type='bold' color={colors.primary} >Filters: </MyText>
          <MyChip
            title={moment(filters.currentMonthYear, "MM-YYYY").format("MMMM")}
            onPress={resetFilterMonth}
          />
          <MyChip
            title={moment(filters.currentMonthYear, "MM-YYYY").format("YYYY")}
            onPress={resetFilterYear}
          />
          {!!filters?.compare_with &&
            <MyChip
              title={`Compare with: ${filters?.compare_with?.first_name} ${filters?.compare_with?.last_name} (${filters?.compare_with?.email})`}
              onPress={() => setFilters({ ...filters, compare_with: undefined })}
            />
          }
          {filters?.pages.map((x, i) => {
            i
            if ((i >= count && showChips) || i < count)
              return (<MyChip
                key={x?._id}
                title={x?.sale_page_title}
                onPress={() => removePage(i)}
              />
              )
          })}

          {filters?.pages.length > count &&
            <Pressable onPress={() => setShowChips(!showChips)}>
              <MyText type='medium'
                style={{
                  color: colors.primary,
                  paddingVertical: 5,
                  paddingHorizontal: 10,

                }} >{showChips ? "See Less..." : "See All..."}</MyText>
            </Pressable>}

        </View>
        {(filters.pages.length > 0 || !!filters.compare_with) &&
          <View style={{ alignItems: "flex-end", }}>
            <TouchableOpacity
              onPress={resetFilters}
              style={{  borderWidth: 1, borderColor: colors.primary, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.primary + "22", alignSelf: "flex-end", marginTop: 5 }}>
              <MyText color={colors.primary}>{"Clear Filter"}</MyText>
            </TouchableOpacity>
          </View>}
      </View>
    )
  }


  const graph = (graphArrayData, keys, index) => {
    let compare = !!filters?.compare_with;
    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ marginBottom: 30 }}>
          <MyText fontSize={16} type='bold' >Total Monthly Commission {prependCurency("gbp")} {index == 0 ? data?.total_commission : data?.compare_with_total_commission} </MyText>
          {!!compare &&
            <MyText fontSize={14} color={colors.primary} >{index == 0 ?
              `${item?.first_name} ${item?.last_name} (${item?.email})`
              : `${filters?.compare_with?.first_name} ${filters?.compare_with?.last_name} (${filters?.compare_with?.email}`} </MyText>
          }
        </View>

        {index == 0 &&
          <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", width: utilities.windowWidth(), paddingBottom: 20 }}>
            {Object.keys(keys).map(key => (
              <View style={{ flexDirection: "row", alignItems: "center", width: utilities.windowWidth() / 2 }} >
                <View style={{ marginLeft: 5, height: 10, width: 10, backgroundColor: key }} />
                <View style={{ marginLeft: 5 }}>
                  <MyText  >{keys[key]}</MyText>
                </View>
              </View>
            ))}
          </View>}


        <ScrollView horizontal>
          <LineChart
            data={graphArrayData}
            width={(utilities.screenWidth() * 0.2) * graphData?.labels?.length}
            height={500}
            segments={10}
            yAxisLabel={''}
            yAxisSuffix={""}
            bezier
            // renderDotContent={({ x, y, index }) => {
            //   return (
            //     <View
            //       style={{
            //         height: 18,
            //         width: 18,
            //         backgroundColor: colors.primary,
            //         position: "absolute",
            //         top: y - 9, // <--- relevant to height / width (
            //         left: x - 9, // <--- width / 2
            //         alignItems: "center",
            //         justifyContent: "center",
            //         borderRadius: 3
            //       }}
            //     >
            //       <MyText fontSize={12} color={colors.black} >{graphData.datasets[0].data[index]}</MyText>
            //     </View>
            //   );
            // }}

            chartConfig={{
              decimalPlaces: 0,
              backgroundColor: colors.darkSecondary,
              backgroundGradientFrom: colors.darkSecondary,
              backgroundGradientTo: colors.darkSecondary,
              color: (opacity = 1) => colors.white,
              labelColor: (opacity = 1) => colors.white,
              style: {},
              propsForDots: {
                stroke: colors.white,
              },
            }}
          />
        </ScrollView>


      </View>
    )
  }
  return (
    <RootView titleView={topView} >

      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} >
          {filterView()}
          {!!graphData && graph(graphData, keyToValues, 0)}
          {!!graphData2 && graph(graphData2, keyToValues, 1)}
        </ScrollView>
      </View>
      <MyLoader enable={loader} />
    </RootView >
  )
}

export default SalesPerformanceDelegate
