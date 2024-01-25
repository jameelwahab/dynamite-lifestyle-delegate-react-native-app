import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { __styles } from './style'
import { LineChart } from 'react-native-chart-kit'
import utilities from '../../../utilities'
import { colors } from '../../../utilities/colors'

const DailyDynamiteGraph = () => {
  let count = 1;
  return (
    <View style={__styles.tabRootView}>
      <View style={{ alignItems: "center", marginVertical: 30 }}>
        <ScrollView horizontal>
          <LineChart
            data={{
              labels: Array(10).fill("10").map((x, i) => count + i),
              datasets: [
                {
                  data: [0]
                },
                {
                  data: [0],
                  withDots: false,
                },
                {
                  data: [100],
                  withDots: false,
                }
              ]
            }}
            width={utilities.screenWidth() - 40}
            height={500}
            segments={10}
            yAxisLabel={''}
            yAxisSuffix={""}

            chartConfig={{
              decimalPlaces: 0,
              backgroundColor: colors.secondaryVariant,
              backgroundGradientFrom: colors.secondaryVariant,
              backgroundGradientTo: colors.secondaryVariant,
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
    </View>
  )
}

export default DailyDynamiteGraph