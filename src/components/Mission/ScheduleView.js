import {useState} from "react"
import {colors} from "../../utilities/colors"
import {fonts} from "../../utilities/fonts"
import {icons} from "../../utilities/icons"
import isArray from "../../functions/isArray"
import {View,TextInput, StyleSheet, Pressable} from "react-native";
import QuestionComponent from "../../screens/Questions/Components/QuestionComponent"
import MyText from "../MyText"
import MyInputs from "../MyInputs"
const ScheduleView = ({ schedule, index }) => {
    console.log("is been called", schedule)
  const scheduleActions = () => {
    let arr = schedule?.general_allowed_actions;
    // let arr = [{
    //   action_statement: "test",
    //   action_type: "general"
    // }, {
    //   action_statement: "test",
    //   action_type: "general"
    // }, {
    //   action_statement: "test",
    //   action_type: "general"
    // }]
    if (isArray(arr)) {
      return (
        <View style={__styles.cardView} >
          {!!schedule?.content_settings?.action_statement_heading && schedule?.general_allowed_actions?.length > 0 &&
            <MyText type='medium' color={colors.primary} >{schedule?.content_settings?.action_statement_heading}</MyText>}
          <View>
            {arr?.map((x, i) => {
              if (x.action_type == "general") {
                return (
                  <View
										key={i}
                    style={__styles.box2}
                    pointerEvents={"none"}>
                    <MyCheckBox
                      color={colors.primary2}
                      value={true}
                      pb={0}
                      title={x?.action_statement}
                    />

                    {/*  <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
                  <MyTextField
                    onChangeText={(text) => this.handleGeneralAnswers(text, x)}
                    style={{ height: 80 }}
                    value={statement}
                    editable={!!!this.state.answers[x?._id]}
                    multiline={true} />
                </View> */}
                  </View>
                )
              } else return null
            })}
          </View>
        </View>
      )
    }
    else return null
  }

  const growthToolIntentions = (x, i) => {
    let arr = [{ option: "", }, { option: "", }, { option: "", }];
    let arr_gratitude = [{ option: "", }, { option: "", }, { option: "", }];
    return (
      <View>
        <View style={[__styles.boxView, {marginTop:15}]}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <MyText type='medium' fontSize={16} color={colors.primary} >{schedule?.content_settings?.gratitude_action_title || "Gratitude"}</MyText>
            </View>
          </View>
          <View style={{ paddingTop: 10 }}>
            {!!arr_gratitude &&
              <>
                {arr_gratitude.map((item, index) => {
                  return (
                    <View style={{ marginTop: index != 0 ? 10 : 0 }} key={index}>
                      <MyText   >{labels?.gratitudeLabels[index]}</MyText>
                      <TextInput
                        placeholder={index + 1 + ". "}
												placeholderTextColor="white"
                        // multiline={true}
                        multiline={true}
                        value={item?.option}
                        style={{
                          color: colors.lightText2,
                          fontFamily: fonts.regular,
                          borderWidth: 1,
                          borderColor: colors.lightText2,
                          borderRadius: 5,
                          padding: 5,
                          marginTop: 5,
                          minHeight: 40
                        }}
                        editable={false}
                      />
                    </View>
                  )
                })}
              </>}
          </View>
        </View>

        <View style={[__styles.boxView, {marginTop:15}]} >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <MyText type='medium' color={colors.primary} fontSize={16}  >{schedule?.content_settings?.dynamite_dairy_action_title || "Intentions"}</MyText>
            </View>
          </View>
          <View style={{}}>
            {!!arr &&
              <View style={{ marginTop: 10, }} >
                {arr.map((item, index) => {
                  return (
                    <View key={index} style={{ marginTop: index != 0 ? 10 : 0 }}>
                      <MyText  >{labels?.dailyDynamiteLabels[index]}</MyText>
                      <TextInput
                        placeholder={index + 1 + ". "}
												placeholderTextColor="white"
                        multiline={true}
                        value={item?.option}
                        style={{
                          color: colors.lightText2,
                          fontFamily: fonts.regular,
                          backgroundColor: colors.white + "05",
                          borderWidth: 1,
                          borderColor: colors.lightText2,
                          borderRadius: 5,
                          padding: 5,
                          marginTop: 5,
                          minHeight: 40
                        }}
                        editable={false}
                      />
                    </View>
                  )
                })}
              </View>}
          </View>
        </View>
      </View>)
  }

  return (
    <View>
      {/* <Collapsible collapsed={isCollapsed} > */}
        <View>

          {scheduleActions()}


          {(isArray(schedule?.schedule_questions) && schedule?.schedule_questions.findIndex(item=> item.show_on=="on_screen") > -1) &&
            <View style={[__styles.boxView, {marginTop:15}]}>
              <MyText type='medium' color={colors.primary} fontSize={16} >{schedule?.content_settings?.onscreen_question_title || "Content Questions"}</MyText>
              {schedule.schedule_questions.map((item, index) => {
                return item.show_on=="on_screen" && (<QuestionComponent
                  padding={0}
                  noQuestionStatement={true}
                  hideRepliesCheckBox={true}
                  item={{ ...item }}
                  index={index}
								  key={index}
                  showRepliesbtns={false}
                  hideCollpase={true}
                />)
              })}
            </View>}

          {schedule?.growth_tool_allowed_actions.map((item, index) => {
            if (item?.tool == "dynamite_dairy") {
              return (
                <View key={index}>
                  {growthToolIntentions(item, index)}
                </View>
              )
            } else return null
          })}

          {schedule?.content_settings?.is_show_general_note &&
            <View style={[__styles.boxView, {marginTop:15}]} >
              <MyText type='medium' color={colors.primary2} fontSize={16} >{(schedule?.content_settings?.general_note_title || "Journal")}</MyText>
              <View style={{ marginTop: 5 }}>
                <MyInputs
		  placeholder={labels.journal}
                  noLable
                  noSpace
                  multiline={true}
                  value={schedule?.general_note}
                />
                {/* <MyAutoGrowTextField
                  style={{ backgroundColor: colors.box2, minHeight: 40, maxHeight: undefined, padding: 10 }}
                  value={schedule?.general_note}
                  editable={false}
                /> */}

              </View>
            </View>}



          {(isArray(schedule?.schedule_questions) && schedule?.schedule_questions.findIndex(item=> item.show_on=="after_action") > -1) &&
            <View style={[__styles.boxView, {marginTop:15}]}>
              <MyText 
		type='medium'
		color={colors.primary}
		fontSize={16} >{"Interactive Learning Experience"}</MyText>
              {schedule.schedule_questions.map((item, index) => {
                return item.show_on=="after_action" && (<QuestionComponent
                  padding={0}
                  noQuestionStatement={true}
                  hideRepliesCheckBox={true}
                  item={{ ...item }}
                  index={index}
								  key={index}
                  showRepliesbtns={false}
                  hideCollpase={true}
                />)
              })}
            </View>}

          {/* 
          {!!schedule?.questions?.after_action_questions && schedule?.questions?.after_action_questions.length > 0 &&
            <View style={{ marginTop: 10 }}>
              <Text style={main.titleGolden} >{"Interactive Learning Experience"}</Text>
              <MissionQuestions2
                from="mission"
                questions={schedule?.questions?.after_action_questions}
                questionsReplies={schedule?.questions?.question_replies}
                bgColor={colors.box2}
                showAnswersOnly={true}
                disable={true}
              />
            </View>} */}

        </View>
      {/* // </Collapsible> */}
    </View >
  )
}

const __styles = StyleSheet.create({
  boxView: { 
      paddingHorizontal: 10,
      paddingTop: 10,
      backgroundColor: colors.secondary,
      marginTop: 10,
      borderRadius: 10,
      paddingBottom: 10
  },
  rowView: {
    flexDirection: "row",
    alignItems: 'center',
    marginRight: 5
  },
  box2: {
    backgroundColor: colors.secondaryVariant,
    borderRadius: 10,
    marginTop: 10,
    padding: 10

  }
})

const labels = {
  gratitudeLabels: [
    "What are you grateful for today?",
    "Who do you want to send love to today?",
    "What do you desire most out of today?",
  ],
  dailyDynamiteLabels: [
    "Where will I focus my energy today?",
    "What am I committed to achieving today?",
    "What 1 decision or action can I take today?"
  ],
  journal: "What did you take away from todays lesson? Keep a note of all your aha moments! "
}
export default ScheduleView;
