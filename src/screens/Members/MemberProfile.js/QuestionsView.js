import {View, Pressable, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import MyText from '../../../components/MyText';
import {__styles} from './style';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import AssessmentQuestions from './AssessmentQuestions';

const QuestionsView = ({member}) => {
  const [tab, setTab] = useState(0);

  const TabView = () => {
    return (
      <View style={styles.tabViewContainer}>
        <Pressable onPress={() => setTab(0)} style={__styles.tabBtn}>
          <View>
            <MyText style={__styles.tabBtnText}>
              {STRINGS.QUESTIONS_VIEW.lesson}
            </MyText>
            <View
              style={[
                __styles.tabSelector,
                {
                  backgroundColor:
                    tab == 0 ? colors.primary : colors.transparent,
                },
              ]}
            />
          </View>
        </Pressable>
        <Pressable onPress={() => setTab(1)} style={__styles.tabBtn}>
          <View>
            <MyText style={__styles.tabBtnText}>
              {STRINGS.QUESTIONS_VIEW.goalStatement}
            </MyText>
            <View
              style={[
                __styles.tabSelector,
                {
                  backgroundColor:
                    tab == 1 ? colors.primary : colors.transparent,
                },
              ]}
            />
          </View>
        </Pressable>
        <Pressable onPress={() => setTab(2)} style={__styles.tabBtn}>
          <View>
            <MyText style={__styles.tabBtnText}>
              {STRINGS.QUESTIONS_VIEW.event}
            </MyText>
            <View
              style={[
                __styles.tabSelector,
                {
                  backgroundColor:
                    tab == 2 ? colors.primary : colors.transparent,
                },
              ]}
            />
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={__styles.tabRootView}>
      {TabView()}
      <View style={styles.contentContainer}>
        {tab == 0 ? (
          <AssessmentQuestions
            list={member?.lesson_questionnaire_array}
            titleKey={'title'}
            noAnswer
            memberId={member?.member?._id}
          />
        ) : tab == 1 ? (
          <AssessmentQuestions
            list={member?.question_answer_list}
            titleKey={'question_statement'}
          />
        ) : tab == 2 ? (
          <AssessmentQuestions
            list={member?.dynamite_event_video_questionnaire_array}
            titleKey={'title'}
            noAnswer
            memberId={member?.member?._id}
          />
        ) : null}
      </View>
    </View>
  );
};

export default QuestionsView;

const styles = StyleSheet.create({
  tabViewContainer: {
    flexDirection: 'row',
  },
  contentContainer: {
    paddingHorizontal: 20,
    minHeight: 300,
  },
});
