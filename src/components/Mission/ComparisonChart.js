import { View, Text, ScrollView, Dimensions } from 'react-native'
import React, { useRef } from 'react'
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../../utilities/colors';
import InfoModal from '../InfoModal';
import { fonts } from '../../utilities/fonts';
import MyWebview from '../MyWebview';

const ComparisonChart = ({ data }) => {
  const ref_infoModal = useRef();

  const renderFooter = () => {
    if (!!data?.questions) {
      return (
        <View style={{ marginTop: -10, paddingBottom: 10 }}>
          {data?.questions.map((x) => (
            <View key={x.question_id} style={{ flexDirection: "row", marginTop: 5, paddingHorizontal: 10 }}>
              <View style={{ height: 10, width: 10, marginTop: 5, borderRadius: 3, backgroundColor: x?.scaling_color }} />
              {!!x?.question_statement &&
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <MyWebview html={x?.question_statement} />
                  {/* <HeadingWebview html={x?.question_statement} /> */}
                </View>}
            </View>
          ))}
        </View>
      )
    } else return null
  }

  if (!!data) {
    return (
      <View>
        <ScrollView
          contentContainerStyle={{ marginLeft: -30 }}
          horizontal showsHorizontalScrollIndicator={false} >
          {/* <View> */}
          <LineChart
            data={data}
            onDataPointClick={(item) => {
              console.log(item, "onDataPointClick")
              ref_infoModal?.current?.openModal(`${item?.dataset?.legend}`, `Value: ${item?.value}`)
            }}
            // width={Dimensions.get("window").width}
            width={(Dimensions.get("screen").width * 0.2) * 5}
            height={250}
            segments={5}
            // yAxisLabel="$"
            // yAxisSuffix="k"
            yAxisInterval={2}
            // yAxisLabel={''}
            // yAxisSuffix={""}
            bezier
            withInnerLines={false}
            withShadow={false}
            chartConfig={{
              decimalPlaces: 0,

              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              // useShadowColorFromDataset: true ,
              // backgroundGradientFrom: colors.tranparent,
              // backgroundGradientTo: colors.tranparent,
              color: (opacity = 1) => colors.lightText,
              labelColor: (opacity = 1) => colors.lightText2,
              style: {},
              propsForDots: {
                stroke: colors.white,
              },
              propsForLabels: {
                wordSpacing: 1,
                fontFamily: fonts.medium,
                fontSize: 12,
                // fill:colors.silver
              }
            }}


            style={{
              marginVertical: 8,
              // marginLeft: -10,
              borderRadius: 16
            }}
          />
          {/* </View> */}
        </ScrollView>
        {renderFooter()}

        <InfoModal ref={ref_infoModal} />
      </View>
    )
  } else return null


}

export default ComparisonChart