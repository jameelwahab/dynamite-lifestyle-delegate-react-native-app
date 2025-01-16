import { View, Text } from 'react-native'
import React, { useRef } from 'react'
import { BarChart } from 'react-native-gifted-charts'
import InfoModal from '../InfoModal'
import { colors } from '../../utilities/colors'
import { fonts } from '../../utilities/fonts'
import MyWebview from '../MyWebview'

const BarChartForMission = ({ data, questions, noheading = false, }) => {

  const ref_infoModal = useRef()
  const renderTitle = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          {!noheading &&
            <Text style={[]} >Questions Report</Text>}
        </View>
      </View>
    )
  }

  const renderFooter = () => {
    return (
      <View style={{ marginTop: 10 }}>
        {questions.map((x) => (
          <View key={x.question_id} style={{ flexDirection: "row", marginTop: 5, paddingHorizontal: 10 }}>
            <View style={{ height: 10, width: 10, marginTop: 5, borderRadius: 3, backgroundColor: x?.scaling_color }} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <MyWebview html={x?.question_statement} />
            </View>
          </View>
        ))}
      </View>
    )
  }

  return (
    <View>
      {data.length > 0 &&
        <>
          <View style={{ marginTop: 20 }}>
            <BarChart
              onPress={(item) => ref_infoModal?.current?.openModal(`${item?.question_statement}`, `Answer: ${item?.value}`, true)}
              isAnimated={true}
              data={data}
              barWidth={8}
              spacing={40}
              // roundedTop
              // roundedBottom
              hideRules
              // focusBarOnPress


              initialSpacing={30}
              showScrollIndicator={false}
              yAxisColor={colors.lightText}
              xAxisColor={colors.lightText}
              barBorderTopLeftRadius={3}
              barBorderTopRightRadius={3}
              // xAxisThickness={1}
              // yAxisThickness={1}
              yAxisTextStyle={{ borderColor: colors.lightText, color: colors.lightText2, fontFamily: fonts.regular, }}
              noOfSections={5}
              maxValue={10}
            />
          </View>
          {renderFooter()}
        </>}
      <InfoModal ref={ref_infoModal} />
    </View>
  );

}

export default BarChartForMission