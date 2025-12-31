import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import MyText from '../../../components/MyText';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import {useNavigation} from '@react-navigation/native';
import routes from '../../../navigation/routes';
import EmptyView from '../../../components/EmptyView';

const AssessmentQuestions = ({
  list,
  name = '',
  noAnswer = false,
  titleKey = '',
  memberId = '',
}) => {
  const navigation = useNavigation();
  return (
    <View>
      {list.length > 0 ? (
        <>
          {list.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (noAnswer) {
                    navigation.navigate(routes.genericQestionListing, {
                      created_for: item?.created_for,
                      id: !!item?.created_for_id?._id
                        ? item?.created_for_id?._id
                        : !!item?.created_for_id
                        ? item?.created_for_id
                        : '',
                      memberId: memberId,
                    });
                  }
                }}
                style={[
                  styles.questionItem,
                  noAnswer && styles.questionItemWithPadding,
                ]}>
                <MyText type="bold">{`${index + 1}.   `}</MyText>
                <View style={styles.questionContent}>
                  <MyText>
                    {!!titleKey
                      ? item[titleKey]
                      : `${item.question_statement.replace(/{Name}/g, name)}`}
                  </MyText>
                  {!noAnswer && (
                    <MyText
                      type="light"
                      style={styles.answerText}
                      color={colors.lightText2}>{`${item.answer}`}</MyText>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </>
      ) : (
        <EmptyView label={STRINGS.ASSESSMENT_QUESTIONS.noQuestionsFound} />
      )}
    </View>
  );
};

export default AssessmentQuestions;

const styles = StyleSheet.create({
  questionItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  questionItemWithPadding: {
    paddingVertical: 5,
  },
  questionContent: {
    flex: 1,
  },
  answerText: {
    marginTop: 3,
  },
});
