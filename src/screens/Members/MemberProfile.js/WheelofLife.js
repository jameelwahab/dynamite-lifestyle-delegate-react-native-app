import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { PieChart } from 'react-native-svg-charts';
import utilities from '../../../utilities';
import { colors } from '../../../utilities/colors';
import { fonts } from '../../../utilities/fonts';
import MyText from '../../../components/MyText';
import AssessmentQuestions from './AssessmentQuestions';
import { __styles } from './style';

const size = utilities.screenWidth() * 0.7
const WheelofLife = ({ member }) => {
  const [tab, setTab] = useState(0)
  const _10percentOfsize = (10 / 100) * size;

  const getData = () => {
    let list = []
    for (let i = 0; i < member.wheel_of_life.length; i++) {
      let obj = {
        key: member.wheel_of_life[i]._id,
        value: 100,
        svg: { fill: member.wheel_of_life[i].scaling_color },
        arc: { outerRadius: member.wheel_of_life[i].answer + '0%' },
        question: member.wheel_of_life[i]?.scaling_main_heading,
        answer: 0
      };
      list.push(obj)
    }
    return list
  }


  const getStyle = size => {
    return {
      height: _10percentOfsize * size,
      width: _10percentOfsize * size,
      borderRadius: (_10percentOfsize * size) / 2,
      borderColor: "#FFF",
      borderWidth: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
    };
  };

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
            <MyText style={__styles.tabBtnText}>Assessment</MyText>
            <View style={[__styles.tabSelector, { backgroundColor: tab == 1 ? colors.primary : colors.transparent }]} />
          </View>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={__styles.tabRootView}>

      {TabView()}


      {tab == 0 ?
        <View style={WheelofLifeStyle.chartView}>
          <PieChart
            style={{ width: size, height: size }}
            outerRadius={'100%'}
            innerRadius={0}
            data={getData()}
            padAngle={0}
            animate={true}
          />

          {/* Backgrounf of Pie */}
          <View style={WheelofLifeStyle.chartBackground}>
            <Text style={WheelofLifeStyle.bordertext}>10</Text>
            <View style={getStyle(8)}>
              <Text style={WheelofLifeStyle.bordertext}>8</Text>
              <View style={getStyle(6)}>
                <Text style={WheelofLifeStyle.bordertext}>6</Text>
                <View style={getStyle(4)}>
                  <Text style={WheelofLifeStyle.bordertext}>4</Text>
                  <View style={getStyle(2)}>
                    <Text style={WheelofLifeStyle.bordertext}>2</Text>

                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ width: utilities.screenWidth() * 0.8, paddingVertical: 20 }}>
            {member?.wheel_of_life.map((item, index) => (
              <View style={{ alignItems: "center", marginBottom: 15, flexDirection: "row", }}>
                <View style={{ height: 15, width: 50, backgroundColor: item.scaling_color }} />
                <View style={{ flex: 1 }}>
                  <Text style={WheelofLifeStyle.questionText}>{item?.scaling_main_heading.replace("{Name}", member?.first_name)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View> :
        <View style={{ paddingBottom: "10%", paddingHorizontal: 10 }}>
          <AssessmentQuestions list={member?.assessment} name={member?.first_name} />
        </View>}

    </View>
  )
}

export default WheelofLife

const WheelofLifeStyle = StyleSheet.create({
  chartView: { alignItems: 'center', marginVertical: '10%', flex: 1 },
  questionView: { marginTop: 20, alignItems: 'center' },
  questionText: { fontSize: 24 },
  answerButtonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  rateText: {
    // fontFamily: font.medium,
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#404040',
  },
  questionText: {
    color: "#FFF",
    marginLeft: 10,
    fontFamily: fonts.regular,
    includeFontPadding: false,
    fontSize: 12
  },
  bordertext: {
    position: 'absolute',
    top: -8,
    backgroundColor: "#BFBFBF",
    includeFontPadding: false,
    paddingHorizontal: 5,
    color: "#fff",
    fontSize: 14,

  },
  answerButton: {
    height: 40,
    width: 40,
    borderWidth: 1,
    // borderColor: Colors.gray02,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginTop: 10,
    alignSelf: 'center',
    // backgroundColor: Colors.white,
    borderRadius: 10,
  },
  answerButtonText: { fontSize: 18, },
  dot: {
    height: 5,
    width: 5,
    borderRadius: 5 / 2,
    // backgroundColor: Colors.gray04,
  },
  chartBackground: {
    height: size,
    width: size,
    position: 'absolute',
    zIndex: -1,
    borderRadius: size / 2,
    borderColor: "#FFF",
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lableSection: {
    paddingBottom: 50,
  },
  lableView: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  colorView: {
    height: 20,
    width: 20,
  },
  labelText: {
    fontSize: 16,
    // fontFamily: font.medium,
    width: 120,
    marginLeft: 10,
    includeFontPadding: false,
  },

});