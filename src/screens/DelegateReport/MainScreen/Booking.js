import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import MyText from '../../../components/MyText'
// import { BarChart } from 'react-native-chart-kit'
import utilities from '../../../utilities'
import { colors } from '../../../utilities/colors'
import { fonts } from '../../../utilities/fonts'
import { BarChart } from 'react-native-gifted-charts'

const Booking = ({ data }) => {
  if (!!data) {
    let screenWidth = utilities.screenWidth();
    let labels = [];
    let values = [];
    let barData = [];
    !!data?.booking_counts && data?.booking_counts.forEach((x, i) => {
      labels.push(x.title)
      values.push(x.count)
      barData.push({
        value: x?.count,
        label: x?.title,
        frontColor: x?.background_color,
        topLabelComponent: () => (
          <MyText>{x?.count}</MyText>
        ),
      })
    })
    let width = (screenWidth / 50) * labels.length;
    chartBlockWidth = width < screenWidth ? screenWidth : width;
    return (
      <View style={{ paddingVertical: 20, backgroundColor: colors.darkSecondary, justifyContent: "center" }}>
        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 50 }} > */}
        <BarChart
          barWidth={70}
          noOfSections={5}
          barBorderRadius={4}
          data={barData}
          yAxisThickness={1}
          xAxisThickness={1}
          yAxisColor={colors.lightText}
          xAxisColor={colors.lightText}
          yAxisIndicesColor={colors.lightText}
          yAxisTextStyle={{ color: colors.lightText }}
          xAxisIndicesColor={colors.lightText}
          xAxisLabelTexts={{ color: colors.lightText }}
          xAxisLabelsVerticalShift={30}
          xAxisLabelTextStyle={{ color: colors.lightText, fontSize: 10, }}
        // xAxisIndicesHeight={10}
        />
        {/* <BarChart
            style={{ paddingTop: 20 }}
            data={{
              labels: labels,
              datasets: [
                {
                  data: values
                },
              ],

            }}
            width={750}
            height={400}
            showValuesOnTopOfBars={true}

            // yAxisLabel="$"
            chartConfig={{
              decimalPlaces: 0,
              backgroundColor: colors.darkSecondary,
              backgroundGradientFrom: colors.darkSecondary,
              backgroundGradientTo: colors.darkSecondary,
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
          // verticalLabelRotation={20}
          /> */}
        {/* </ScrollView> */}
      </View>
    )
  } else return null
}

export default Booking