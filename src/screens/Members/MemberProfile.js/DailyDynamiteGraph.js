import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { __styles } from './style'
import { LineChart } from 'react-native-chart-kit'
import utilities from '../../../utilities'
import { colors } from '../../../utilities/colors'
import moment from 'moment'
import MyText from '../../../components/MyText'

const DailyDynamiteGraph = () => {
  let count = 1;
  return (
    <View style={__styles.tabRootView}>
      <View style={{ marginVertical: 30 }}>
        <View style={{ marginLeft: 20, }}>
          <MyText color={colors.primary} fontSize={16} type='medium' >Daily Dynamite</MyText>
        </View>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} >
            <LineChart
              data={{
                labels: Array(21).fill("10").map((x, i) => moment().add({ day: i + 1 }).format("DD/MM")),
                datasets: [
                  {
                    data: [0],
                    color: (opacity = 1) => colors.primary
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
              width={(utilities.screenWidth() * 0.2) * 21}
              height={500}
              segments={10}
              yAxisLabel={''}
              yAxisSuffix={""}
              bezier
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
    </View>
  )
}

export default DailyDynamiteGraph