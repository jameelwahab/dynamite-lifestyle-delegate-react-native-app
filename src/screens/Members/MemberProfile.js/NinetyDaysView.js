import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { __styles } from './style'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import QuestionComponent from '../../Questions/Components/QuestionComponent'
import { LineChart } from 'react-native-chart-kit';
import utilities from '../../../utilities'
import moment from 'moment'
import EmptyView from '../../../components/EmptyView'

const NinetyDaysView = ({ member, graphData }) => {
  const [tab, setTab] = useState(0);





  const TabView = () => {
    return (
      <View style={{ flexDirection: "row", }}>
        <Pressable
          onPress={() => setTab(0)}
          style={__styles.tabBtn}>
          <View>
            <MyText style={__styles.tabBtnText}>Graph</MyText>
            <View style={[__styles.tabSelector, { backgroundColor: tab == 0 ? colors.primary : colors.transparent }]} />
          </View>
        </Pressable>
        <Pressable
          onPress={() => setTab(1)}
          style={__styles.tabBtn}>
          <View>
            <MyText style={__styles.tabBtnText}>Questions</MyText>
            <View style={[__styles.tabSelector, { backgroundColor: tab == 1 ? colors.primary : colors.transparent }]} />
          </View>
        </Pressable>
      </View>
    )
  }

  const graphView = () => {
    return (
      <View style={{ alignItems: "center", marginVertical: 30 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={{
              labels: graphData.map(x => x.day),
              datasets: [
                {
                  data: graphData.map(x => x.earning),
                  color: (opacity = 1) => colors.primary
                },
                {
                  data: [0],
                  withDots: false,
                },
                {
                  data: [member?.target_amount],
                  withDots: false,
                }
              ]
            }}
            width={(utilities.screenWidth() * 0.2) * graphData.length}
            height={300}
            segments={4}
            bezier
            // interval={1000}
            yAxisLabel={''}
            yAxisSuffix=""
            // yAxisInterval={1}

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
    )
  }

  const questionsView = () => {
    return (
      <View style={{ paddingHorizontal: 10 }}>
        {member?.ninety_day_questions_list.length > 0 ?
          <>
            {member?.ninety_day_questions_list?.map((item, index) => (
              <QuestionComponent item={item} index={index} />
            ))}
          </> :
          <EmptyView label={"No Questions Found"} />
        }
      </View>
    )
  }

  return (
    <View style={__styles.tabRootView}>
      {TabView()}
      {tab == 0 ? graphView() : questionsView()}
    </View>
  )
}

export default NinetyDaysView