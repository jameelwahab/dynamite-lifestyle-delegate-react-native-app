import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { __styles } from './style'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import QuestionComponent from '../../Questions/QuestionComponent'


const NinetyDaysView = ({ member }) => {
  const [tab, setTab] = useState(0)

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
      <View>

      </View>
    )
  }

  const questionsView = () => {
    return (
      <View style={{paddingHorizontal:10}}>
        {member?.ninety_day_questions_list?.map((item, index) => (
          <QuestionComponent item={item} index={index} />
        ))}
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