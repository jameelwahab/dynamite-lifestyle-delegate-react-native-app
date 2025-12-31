import {View, StyleSheet, FlatList, Pressable, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../../components/RootView';
import {selectUser} from '../../../redux/reducers/userSlice';
import {useSelector} from 'react-redux';
import {GET_MISSION_DETAIL_BY_ID} from '../../../DAL';
import ComparisonChart from '../../../components/Mission/ComparisonChart';
import hexToRgb from '../../../functions/hexToRgb';
import isArray from '../../../functions/isArray';
import MyText from '../../../components/MyText';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import BarChartForMission from '../../../components/Mission/BarChartForMission';
import {fonts} from '../../../utilities/fonts';
import MyLoader from '../../../components/MyLoader';
import PieGraph from '../../../components/Mission/PieGraph';
import MyCheckBox from '../../../components/MyCheckBox';
import {icons} from '../../../utilities/icons';
import MyInputs from '../../../components/MyInputs';
import QuestionComponent from '../../Questions/Components/QuestionComponent';
import MissionRewardView from '../../../components/Mission/MissionRewardView';
import isObject from '../../../functions/isObject';

const MissionReport = ({navigation, route}) => {
  const {missionId, memberId} = route.params;
  const {token} = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [compareChartData, setCompareChartData] = useState(null);
  const [barChartData, setBarChartData] = useState();
  const [pieData, setPieData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [mission, setMission] = useState(null);
  const [badgesEarned, setBadgesEarned] = useState([]);
  const [user, setUser] = useState(null);

  const prepareLineChartData = dataset => {
    if (!dataset || dataset.length === 0) {
      return {labels: [], datasets: []};
    }

    const labels = [...new Set(dataset.map(item => item.date))];
    const questions = {};

    dataset.forEach(item => {
      if (!questions[item?.question_id]) {
        questions[item?.question_id] = item;
      }
    });

    const allQuestions = [
      ...new Set(dataset.map(item => item.question_statement)),
    ];

    const groupedData = allQuestions.reduce((acc, question) => {
      acc[question] = {
        data: Array(labels.length).fill(0),
        color: (opacity = 1) =>
          hexToRgb(
            dataset.find(item => item.question_statement === question)
              .scaling_color,
          ),
        legend: question,
      };
      return acc;
    }, {});

    dataset.forEach(item => {
      const question = item.question_statement;
      const index = labels.indexOf(item.date);
      if (index !== -1) {
        groupedData[question].data[index] = item.answer_statement;
      }
    });

    // Convert grouped data into datasets array
    const datasets = Object.values(groupedData);

    setCompareChartData({
      datasets: [
        ...datasets,
        {
          data: [0],
          withDots: false,
        },
        {
          data: [10],
          withDots: false,
        },
      ],
      labels: labels,
      questions: Object.values(questions),
    });
  };

  const makeGraphData = dataList => {
    let arr = [...dataList];
    // arr.sort((a, b) => moment(a.date, "MMM DD").valueOf() - moment(b.date, "MMM DD").valueOf())
    let graphArr = [];
    let questionsObj = {};
    arr.forEach((y, j) => {
      questionsObj[y.question_id] = y;
      // let totalReplies = arr.filter(item => item.date === y.date).length;
      let obj = {
        ...y,
        value: y.answer_statement,
        labelWidth: 40,
        labelTextStyle: {
          color: colors.lightText2,
          fontFamily: fonts.regular,
          fontSize: 12,
        },
        frontColor: y.scaling_color,
        // label:y.date
      };
      if (y.date == arr[j + 1]?.date) {
        obj['spacing'] = 3;
        if (y.date != arr[j - 1]?.date) {
          obj['label'] = y.date;
        }
      } else if (y.date != arr[j + 1]?.date && y.date != arr[j - 1]?.date) {
        obj['label'] = y.date;
      }
      graphArr.push(obj);
    });

    setBarChartData({
      barChartData: graphArr,
      questionsForBarChart: Object.values(questionsObj),
    });
  };

  const getMissionMembersFromServer = async (newArray = false) => {
    let res = await GET_MISSION_DETAIL_BY_ID({
      navigation,
      token,
      memberId: memberId,
      missionId: missionId,
    });
    if (res.code == 200) {
      // setList(res?.missions);
      // setMembers(res?.user_data)
      setUser(res?.member_user);
      setMission(res?.mission);
      setBadgesEarned(res?.mission_badges_earned);
      makeGraphData(res?.structured_graph_data);
      prepareLineChartData(res?.on_screen_graph_data);
      setPieData(res?.mcq_graph_data);
      setSchedules(res?.report_data);
      setHasPermission(res?.permission_to_view_content);
      setLoader(false);
      setRefreshing(false);
    } else {
      setLoader(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    getMissionMembersFromServer();
  }, []);

  const headerView = () => {
    return (
      <View>
        <MissionRewardView
          duration={mission?.mission_duration}
          badges={mission?.badge_configration}
          badgesEarned={badgesEarned}
          totalCoins={mission?.rewarded_coins}
          acheivedCoins={mission?.attracted_coins}
        />

        {!hasPermission && isArray(schedules) && (
          <View style={styles.alertContainer}>
            <View style={styles.alertIndicator} />
            <MyText style={styles.alertText}>
              {STRINGS.MISSION_REPORT.note}
            </MyText>
          </View>
        )}

        {hasPermission && (
          <>
            {!!compareChartData && isArray(compareChartData?.datasets) && (
              <View>
                <MyText fontSize={18} type="bold" color={colors.primary}>
                  {STRINGS.MISSION_REPORT.comparisonGraph}
                </MyText>
                <View style={styles.boxView}>
                  <ComparisonChart data={compareChartData} />
                </View>
              </View>
            )}

            {!!barChartData && isArray(barChartData?.barChartData) && (
              <View style={styles.marginTop10}>
                <MyText fontSize={18} type="bold" color={colors.primary}>
                  {STRINGS.MISSION_REPORT.missionReportGraphOverview}
                </MyText>
                <View style={styles.boxView}>
                  <BarChartForMission
                    noheading={true}
                    data={barChartData?.barChartData}
                    questions={barChartData?.questionsForBarChart}
                  />
                </View>
              </View>
            )}

            {pieData.length > 0 &&
              pieData.map(x => (
                <View style={styles.marginTop10}>
                  {!(!!barChartData && isArray(barChartData?.barChartData)) && (
                    <View style={styles.marginTop10}>
                      <MyText fontSize={18} type="bold" color={colors.primary}>
                        {STRINGS.MISSION_REPORT.missionReportGraphOverview}
                      </MyText>
                    </View>
                  )}
                  <View style={[styles.boxView, styles.centerAlign]}>
                    <PieGraph data={x} />
                  </View>
                </View>
              ))}
          </>
        )}

        {isArray(schedules) && (
          <View style={styles.marginTop10}>
            <MyText fontSize={18} type="bold" color={colors.primary}>
              {mission?.type === 'quest'
                ? STRINGS.MISSION_REPORT.detailOverview
                : STRINGS.MISSION_REPORT.missionReportDetailOverview}
            </MyText>
          </View>
        )}
      </View>
    );
  };
  return (
    <RootView
      subTitle={mission ? mission?.title : ''}
      title={
        isObject(user)
          ? user?.first_name +
            ' ' +
            user?.last_name +
            STRINGS.MISSION_REPORT.report
          : ''
      }>
      {!loader && (
        <View style={styles.flex1}>
          <FlatList
            ListHeaderComponent={headerView()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            data={schedules}
            keyExtractor={item => item?._id}
            renderItem={({item, index}) => {
              return (
                <QuestionsView
                  schedule={item}
                  isAllow={
                    mission?.mission_status == 'completed' && hasPermission
                      ? true
                      : index == schedules.length - 1
                  }
                  isLast={schedules.length - 1 == index}
                />
              );
            }}
          />
        </View>
      )}
      <MyLoader enable={loader} />
    </RootView>
  );
};

export default MissionReport;

const QuestionsView = ({schedule, isAllow = false, isLast}) => {
  const [isCollapsed, setIsCollapsed] = useState(
    isAllow && isLast ? false : true,
  );

  const scheduleActions = () => {
    let arr = schedule.general_allowed_actions;
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
        <View style={styles.cardView}>
          {!!schedule?.content_settings?.action_statement_heading &&
            schedule?.general_allowed_actions?.length > 0 && (
              <MyText type="medium" color={colors.primary}>
                {schedule?.content_settings?.action_statement_heading}
              </MyText>
            )}
          <View>
            {arr?.map((x, i) => {
              if (x.action_type == 'general') {
                return (
                  <View style={styles.box2} pointerEvents={'none'}>
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
                );
              } else return null;
            })}
          </View>
        </View>
      );
    } else return null;
  };

  const growthToolIntentions = (x, i) => {
    let answer = schedule?.allowed_actions.find(y => y?._id == x?._id);
    let arr = [];
    let arr_gratitude = [];
    if (answer) {
      arr = answer?.options;
      arr_gratitude = answer?.gratitude_options;
    } else {
      arr = [{option: ''}, {option: ''}, {option: ''}];
      arr_gratitude = [{option: ''}, {option: ''}, {option: ''}];
    }

    return (
      <View>
        <View style={styles.cardView}>
          <View style={styles.rowDirection}>
            <View style={styles.flex1}>
              <MyText type="medium" color={colors.primary}>
                {schedule?.content_settings?.gratitude_action_title ||
                  STRINGS.MISSION_REPORT.gratitude}
              </MyText>
            </View>
          </View>
          <View style={styles.paddingTop10}>
            {!!arr_gratitude && (
              <>
                {arr_gratitude.map((item, index) => {
                  return (
                    <View style={index != 0 ? styles.marginTop10 : null}>
                      <MyText>
                        {STRINGS.MISSION_REPORT.gratitudeLabels[index]}
                      </MyText>
                      <TextInput
                        placeholder={index + 1 + '. '}
                        multiline={true}
                        value={item?.option}
                        style={styles.textInput}
                        editable={false}
                      />
                      {/* <MyAutoGrowTextField
                        labelNode={<View style={{ marginBottom: 5 }}>
                          <Text style={{}} >{labels?.gratitudeLabels[index]}
                          </Text>
                        </View>
                        }
                        style={{ backgroundColor: colors.box2, minHeight: 40, maxHeight: undefined, padding: 10 }}
                        placeholder={index + 1 + ". "}
                        value={item?.option}
                        editable={false}
                      /> */}
                    </View>
                  );
                })}
              </>
            )}
          </View>
        </View>

        <View style={styles.cardView}>
          <View style={styles.rowDirection}>
            <View style={styles.flex1}>
              <MyText type="medium" color={colors.primary}>
                {schedule?.content_settings?.dynamite_dairy_action_title ||
                  STRINGS.MISSION_REPORT.intentions}
              </MyText>
            </View>
          </View>
          <View>
            {!!arr && (
              <View style={styles.marginTop10}>
                {arr.map((item, index) => {
                  return (
                    <View style={index != 0 ? styles.marginTop10 : null}>
                      <MyText>
                        {STRINGS.MISSION_REPORT.dailyDynamiteLabels[index]}
                      </MyText>
                      <TextInput
                        placeholder={index + 1 + '. '}
                        multiline={true}
                        value={item?.option}
                        style={styles.textInputWithBackground}
                        editable={false}
                      />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.boxView}>
        <Pressable
          style={styles.rowView}
          hitSlop={{left: 10, right: 10, top: 10, right: 10}}
          onPress={() => isAllow && setIsCollapsed(!isCollapsed)}>
          <View style={styles.flex1}>
            <MyText fontSize={16} type="bold">
              {schedule?.title}
            </MyText>
          </View>
          <View
            style={[
              styles.iconRotate,
              isCollapsed && styles.iconRotateCollapsed,
            ]}>
            {isAllow ? icons.down() : icons.lock()}
          </View>
        </Pressable>
        {!isCollapsed && (
          <View>
            {scheduleActions()}

            {isArray(schedule?.questions?.questions) && (
              <View style={styles.marginTop10}>
                <MyText type="medium" color={colors.primary}>
                  {schedule?.content_settings?.onscreen_question_title ||
                    STRINGS.MISSION_REPORT.contentQuestions}
                </MyText>
                {schedule.questions?.questions.map((item, index) => {
                  let answers = schedule?.questions?.question_replies.find(
                    x => x?._id == item?._id,
                  );
                  return (
                    <QuestionComponent
                      padding={0}
                      noQuestionStatement={true}
                      hideRepliesCheckBox={true}
                      item={{...item, answer: answers}}
                      index={index}
                      showRepliesbtns={false}
                      hideCollapse={true}
                    />
                  );
                })}
              </View>
            )}

            {/* {!!schedule?.questions?.questions && schedule?.questions?.questions.length > 0 &&
            <View style={{ marginTop: 10 }}>
              <Text style={main.titleGolden} >{schedule?.content_settings?.onscreen_question_title || "Content Questions"}</Text>
              <MissionQuestions2
                from="mission"
                questions={schedule?.questions?.questions}
                questionsReplies={schedule?.questions?.question_replies}
                bgColor={colors.box2}
                showAnswersOnly={true}
                disable={true}
              />
            </View>} */}

            {schedule?.growth_tool_allowed_actions.map((item, index) => {
              if (item?.tool == 'dynamite_dairy') {
                return <View>{growthToolIntentions(item, index)}</View>;
              } else return null;
            })}

            {schedule?.content_settings?.is_show_general_note && (
              <View style={styles.marginTop15}>
                <MyText type="medium" color={colors.primary2}>
                  {schedule?.content_settings?.general_note_title ||
                    STRINGS.MISSION_REPORT.journal}
                </MyText>
                <View style={styles.marginTop5}>
                  <MyInputs
                    noLable
                    noSpace
                    editable={false}
                    multiline={true}
                    value={schedule?.general_note}
                  />
                  {/* <MyAutoGrowTextField
                  style={{ backgroundColor: colors.box2, minHeight: 40, maxHeight: undefined, padding: 10 }}
                  value={schedule?.general_note}
                  editable={false}
                /> */}
                </View>
              </View>
            )}

            {isArray(schedule?.questions?.after_action_questions) && (
              <View style={styles.marginTop10}>
                <MyText type="medium" color={colors.primary}>
                  {STRINGS.MISSION_REPORT.interactiveLearningExperience}
                </MyText>
                {schedule.questions?.after_action_questions.map(
                  (item, index) => {
                    let answers = schedule?.questions?.question_replies.find(
                      x => x?._id == item?._id,
                    );

                    return (
                      <QuestionComponent
                        padding={0}
                        noQuestionStatement={true}
                        hideRepliesCheckBox={true}
                        item={{...item, answer: answers}}
                        index={index}
                        showRepliesbtns={false}
                        hideCollapse={true}
                      />
                    );
                  },
                )}
              </View>
            )}

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
        )}
        {/* // </Collapsible> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 30,
  },
  alertContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    backgroundColor: colors.secondary,
  },
  alertIndicator: {
    width: 4,
    height: '100%',
    backgroundColor: colors.primary,
  },
  alertText: {
    padding: 10,
    backgroundColor: colors.secondary,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginTop15: {
    marginTop: 15,
  },
  marginTop5: {
    marginTop: 5,
  },
  paddingTop10: {
    paddingTop: 10,
  },
  centerAlign: {
    alignItems: 'center',
  },
  rowDirection: {
    flexDirection: 'row',
  },
  textInput: {
    color: colors.lightText2,
    fontFamily: fonts.regular,
    borderWidth: 1,
    borderColor: colors.lightText2,
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    minHeight: 40,
  },
  textInputWithBackground: {
    color: colors.lightText2,
    fontFamily: fonts.regular,
    backgroundColor: colors.white + '05',
    borderWidth: 1,
    borderColor: colors.lightText2,
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    minHeight: 40,
  },
  iconRotate: {
    transform: [{rotate: '180deg'}],
  },
  iconRotateCollapsed: {
    transform: [{rotate: '0deg'}],
  },
  boxView: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: colors.secondary,
    marginTop: 10,
    borderRadius: 10,
    paddingBottom: 10,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  cardView: {
    marginTop: 15,
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },
  box2: {
    backgroundColor: colors.secondaryVariant,
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
});
