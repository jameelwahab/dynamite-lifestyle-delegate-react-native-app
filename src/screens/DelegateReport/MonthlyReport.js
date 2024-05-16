import { View, Text, processColor, ScrollView, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MyText from '../../components/MyText'
import { PieChart, } from 'react-native-charts-wrapper';
import { LineChart } from 'react-native-chart-kit'
// import { LineChart } from "react-native-gifted-charts"
import { colors } from '../../utilities/colors'
import utilities from '../../utilities'
import moment from 'moment'
import { showToastCustom } from '../../functions/showToast'

const MonthlyReport = ({ data: data1, currentMonYear }) => {

  const [data, setData] = useState(null);
  const [width] = useState(utilities.screenWidth())
  const [lineChartLabels, setLineChartLabels] = useState([]);
  const [linechartDate, setLinechartDate] = useState([]);
  const [shownCharts, setShownCharts] = useState({ ...lebels });

  useEffect(() => {
    if (!!data1) {
      setData(data1);
      getLabels(data1)
    }
  }, [JSON.stringify(data1)])


  const getLabels = (res) => {
    if (!!res?.attitude_performance_rate_array) {
      let totalDays = moment(currentMonYear, "MM-YYYY").daysInMonth();
      let labels = [""];
      let attitudeArray = [];
      let desireArray = [0,];
      let displineArray = [0,];
      let focusArray = [0,];
      let winArray = [0,];
      for (let i = 0; i < totalDays; i++) {
        let date = moment(currentMonYear, "MM-YYYY").startOf('month').add({ days: i }).format("DD-MM-YYYY");
        labels.push(moment(date, "DD-MM-YYYY").format("DD-MMM"));

        let attitude = res?.attitude_performance_rate_array.find(x => x.date == date);
        if (attitude) {
          attitudeArray.push(attitude.rate);
          // attitudeArray.push({ value: attitude.rate, dataPointText: attitude.rate })
        } else {
          attitudeArray.push(0);
          // attitudeArray.push({ value: 0, dataPointText: 0 })
        }

        let desire = res?.desire_performance_rate_array.find(x => x.date == date);
        if (desire) {
          desireArray.push(desire.rate);
        } else {
          desireArray.push(0);
        }

        let displine = res?.discipline_performance_rate_array.find(x => x.date == date);
        if (displine) {
          displineArray.push(displine.rate);
        } else {
          displineArray.push(0);
        }

        let focus = res?.focus_performance_rate_array.find(x => x.date == date);
        if (focus) {
          focusArray.push(focus.rate);
        } else {
          focusArray.push(0);
        }


        let win = res?.win_note_performance_rate_array.find(x => x.date == date);
        if (win) {
          winArray.push(win.rate);
        } else {
          winArray.push(0);
        }

      }

      let dataArr = [
        {
          data: attitudeArray,
          color: (opacity = 1) => "#EDBF60",

        },
        {
          data: focusArray,
          color: (opacity = 1) => "#72B64A",
        },
        {
          data: desireArray,
          color: (opacity = 1) => "#932CE7"
        },
        {
          data: displineArray,
          color: (opacity = 1) => "#0000F5"
        },
        {
          data: winArray,
          color: (opacity = 1) => "#B6263D"
        },

        {
          data: [10],
          withDots: false,
        }
      ]

      // console.log(attitudeArray,
      //   "attitudeArray"
      // )
      setLineChartLabels(labels)
      setLinechartDate(dataArr)
      // setLinechartDate(attitudeArray)
    }
  }

  const toggleType = (color) => {
    if (!!shownCharts[color]) {
      delete shownCharts[color];
    } else {
      shownCharts[color] = true;
    }
    setShownCharts({ ...shownCharts });
  }

  const filterTheLineGraphData = () => {
    let arr = linechartDate.slice().filter(x => {
      if (x?.color) {
        return !!shownCharts[x.color()]
      } else {
        return true
      }
    })
    return arr
  }

  //? Views

  const graphView = () => {
    return (
      <View style={{}}>
        {!!data?.default_setting?.intentions_heading &&
          <View style={{ marginVertical: 10, width }}>
            <MyText align='center' fontSize={18} type='bold'>{data?.default_setting?.intentions_heading}</MyText>
          </View>}
        {!!data?.complete_accountability_avg && !!data?.incomplete_accountability_avg &&
          <View style={{ width: width, alignItems: "center", marginBottom: Platform.OS == "ios" ? 0 : -80 }}>
            <PieChart
              style={Platform.OS == "ios" ? {
                width: width * 0.8,
                height: width * 0.4,
              } : {
                width: width * 0.9,
                height: 250
              }}
              data={{
                dataSets: [
                  {
                    values: [
                      { value: Number(data?.complete_accountability_avg), label: 'Complete' },
                      { value: Number(data?.incomplete_accountability_avg), label: 'Not Completed' },
                    ],
                    config: {
                      colors: [
                        processColor('#EDBF60'),
                        processColor('#574C37'),
                      ],
                      valueTextColor: processColor(colors.white),
                      valueTextSize: 12,
                      valueFormatter: "#.#'%'",
                      valueLineColor: processColor('#EDBF60'),
                      valueLinePart1Length: 0.5,
                    },
                  },
                ],
              }}
              maxAngle={180}
              rotationAngle={180}
              legend={{
                enabled: false,
              }}
              rotationEnabled={false}
              holeRadius={50}
              holeColor={processColor(colors.darkSecondary)}
              transparentCircleRadius={0}
              centerText={""}
            />
          </View>}
      </View>
    )
  }

  const LineChartView = () => {
    return (
      <View style={{ width, alignItems: "center", backgroundColor: colors.secondary, marginTop: 50, borderRadius: 10, }}>
        {!!data?.default_setting?.performance_heading &&
          <View style={{ marginVertical: 10, marginTop: 30, width }}>
            <MyText align='center' fontSize={18} type='bold'>{data?.default_setting?.performance_heading}</MyText>
          </View>}
        <View style={{ marginTop: 20, height: 450 }}>
          {linechartDate?.length > 0 &&
            <ScrollView horizontal>
              <LineChart
                onDataPointClick={({ value, getColor }) => {
                  showToastCustom({ title: `${lebels[getColor()]} : ${value}`, bgColor: getColor() });
                }}
                data={{
                  labels: lineChartLabels,
                  datasets: filterTheLineGraphData()
                }}
                width={(utilities.screenWidth() * 0.2) * moment(currentMonYear, "MM-YYYY").daysInMonth()}
                height={500}

                segments={10}
                yAxisLabel={''}
                yAxisSuffix={""}
                bezier
                chartConfig={{
                  decimalPlaces: 0,
                  backgroundColor: colors.secondary,
                  backgroundGradientFrom: colors.secondary,
                  backgroundGradientTo: colors.secondary,
                  color: (opacity = 1) => colors.white,
                  labelColor: (opacity = 1) => colors.white,
                  style: {},
                  propsForDots: {
                    stroke: colors.white,
                  },
                }}
              />
            </ScrollView>}


        </View>

        <View style={{ paddingBottom: 20, width: "80%" }}>
          <View style={{ flexDirection: "row", }}>
            {label("#EDBF60", "Attitude")}
            {label("#72B64A", "Focus")}
          </View>
          <View style={{ flexDirection: "row", }}>
            {label("#932CE7", "Desire")}
            {label("#0000F5", "Discipline")}
          </View>
          {label("#B6263D", "Win")}
        </View>
      </View>
    )
  }

  const label = (bgColor, label) => {
    return (
      <TouchableOpacity
        onPress={() => toggleType(bgColor)}
        style={{ flex: 1, flexDirection: "row", alignItems: "center", padding: 10 }}>
        <View opacity={!!shownCharts[bgColor] ? 1 : 0.3} style={{ marginRight: 5, height: 10, width: 10, borderRadius: 2, backgroundColor: bgColor }} />
        <MyText>{label}</MyText>
      </TouchableOpacity>
    )
  }



  return (
    <View>
      {graphView()}
      {LineChartView()}
    </View>
  )
}

export default MonthlyReport

let lebels = {
  "#EDBF60": "Attitude",
  "#72B64A": "Focus",
  "#932CE7": "Desire",
  "#0000F5": "Descipline",
  "#B6263D": "Win"
}

