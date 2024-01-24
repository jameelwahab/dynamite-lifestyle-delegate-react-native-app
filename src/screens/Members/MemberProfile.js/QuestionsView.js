import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import MyText from '../../../components/MyText'
import { __styles } from './style'
import { colors } from '../../../utilities/colors'
import AssessmentQuestions from './AssessmentQuestions'


const QuestionsView = ({ member }) => {
  const [tab, setTab] = useState(0)

  const TabView = () => {
    return (
      <View style={{ flexDirection: "row", }}>
        <Pressable
          onPress={() => setTab(0)}
          style={__styles.tabBtn}>
          <View>
            <MyText style={__styles.tabBtnText}>Lesson</MyText>
            <View style={[__styles.tabSelector, { backgroundColor: tab == 0 ? colors.primary : colors.transparent }]} />
          </View>
        </Pressable>
        <Pressable
          onPress={() => setTab(1)}
          style={__styles.tabBtn}>
          <View>
            <MyText style={__styles.tabBtnText}>Goal Statement</MyText>
            <View style={[__styles.tabSelector, { backgroundColor: tab == 1 ? colors.primary : colors.transparent }]} />
          </View>
        </Pressable>
        <Pressable
          onPress={() => setTab(2)}
          style={__styles.tabBtn}>
          <View>
            <MyText style={__styles.tabBtnText}>Event</MyText>
            <View style={[__styles.tabSelector, { backgroundColor: tab == 2 ? colors.primary : colors.transparent }]} />
          </View>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={__styles.tabRootView} >
      {TabView()}
      <View style={{ paddingHorizontal: 20 }}>
        {tab == 0 ?
          <AssessmentQuestions
            list={member?.lesson_questionnaire_array}
            titleKey={"title"}
            noAnswer
            memberId={member?.member?._id}
          /> :
          tab == 1 ?
            <AssessmentQuestions
              list={member?.question_answer_list}
              titleKey={"question_statement"}
            /> :
            tab == 2 ?
              <AssessmentQuestions
                list={member?.dynamite_event_video_questionnaire_array}
                titleKey={"title"}
                noAnswer
                memberId={member?.member?._id}
              /> :
              null}
      </View>
    </View>
  )
}

export default QuestionsView