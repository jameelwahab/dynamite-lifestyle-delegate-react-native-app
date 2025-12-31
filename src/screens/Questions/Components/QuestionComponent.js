import {View, StyleSheet, Pressable} from 'react-native';
import React, {useState} from 'react';
import MyText from '../../../components/MyText';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import MyWebview from '../../../components/MyWebview';
import MyCheckBox from '../../../components/MyCheckBox';
import Collapsible from 'react-native-collapsible';
import {icons} from '../../../utilities/icons';
import {MyButton} from '../../../components/MyButton';
import openUrl from '../../../functions/openUrl';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';

const QuestionComponent = ({
  item,
  index,
  showRepliesbtns = false,
  onShowReplyPress,
  onRelpyBtnPress,
  hideRepliesCheckBox = false,
  hideCollapse = false,
  noQuestionStatement = false,
  padding = 10,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {S3_URL} = useSelector(selectUser);
  const findCollapsed = id => {
    return !!isCollapsed.find(x => x == id);
  };

  const toggleCollapsed = id => {
    let index = isCollapsed.findIndex(x => x == id);
    if (index > -1) {
      setIsCollapsed(list => list.filter(x => x != id));
    } else {
      setIsCollapsed(list => [...list, id]);
    }
  };
  //?   Qestion Type Views start

  const scalingQuestionView = (item, index) => {
    return (
      <Pressable onPress={() => {}} style={styles.rowWrap}>
        {Array(item.scaling_max - item.scaling_min + 1)
          .fill(item.scaling_max - item.scaling_min + 1)
          .map((y, j) => {
            return (
              <View
                key={'scaling' + j}
                style={[
                  styles.scalingOption,
                  item?.answer?.answer_statement >= item.scaling_min + j
                    ? styles.scalingOptionSelected
                    : styles.scalingOptionUnselected,
                ]}>
                <MyText
                  fontSize={12}
                  type="medium"
                  color={
                    item?.answer?.answer_statement >= item.scaling_min + j
                      ? colors.black
                      : colors.beige
                  }>
                  {item.scaling_min + j}
                </MyText>
              </View>
            );
          })}
      </Pressable>
    );
  };

  const RadioButtonView = (item, index) => {
    return (
      <Pressable onPress={() => {}}>
        {item.options.map((item2, index2) => {
          let isCheck = item?.answer?.answer_statement.trim() == item2.trim();
          return (
            <View
              key={'radio' + index2}
              style={[
                styles.optionContainer,
                isCheck ? styles.optionSelected : styles.optionUnselected,
              ]}>
              <MyCheckBox
                value={isCheck}
                size={15}
                title={item2}
                circle
                textColor={colors.lightText}
                color={colors.lightText}
              />
            </View>
          );
        })}
      </Pressable>
    );
  };

  const checkBoxButtonView = (item, index) => {
    return (
      <Pressable onPress={() => {}}>
        {item.options.map((item2, index2) => {
          let isCheck =
            !!item.answer?.answer_statement &&
            Array.isArray(item.answer?.answer_statement) &&
            item.answer?.answer_statement.findIndex(x => x == item2) > -1;
          return (
            <View key={'checkbox' + index2} style={styles.checkboxContainer}>
              <MyCheckBox
                value={isCheck}
                size={15}
                title={item2}
                textColor={colors.lightText2}
              />
            </View>
          );
        })}
      </Pressable>
    );
  };

  const textAreaView = (item, index) => {
    return (
      <View>
        <View>
          <View style={styles.textAreaContainer}>
            <MyText color={colors.lightText} style={styles.textOpacity}>
              {item?.answer?.answer_statement || item?.question_placeholder}
            </MyText>
          </View>
        </View>
      </View>
    );
  };

  const repliesBtns = item => {
    return (
      <View style={styles.btnView}>
        <MyButton
          onPress={() => onRelpyBtnPress?.(item)}
          invert={true}
          title={`${STRINGS.QUESTION_COMPONENT.replies} (${
            Array.isArray(item?.answer?.comments)
              ? item?.answer?.comments?.length
              : 0
          })`}
          style={styles.btn}
          noCapitalize
        />
        {!hideRepliesCheckBox && (
          <MyCheckBox
            title={STRINGS.QUESTION_COMPONENT.showRepliesToClient}
            onPress={() => onShowReplyPress?.(item)}
            pb={0}
            value={!!item?.answer?.show_replies}
          />
        )}
      </View>
    );
  };

  const appendTextInline = htmlContent => {
    return htmlContent.replace('</p>', ` <span class="required" >*</span></p>`);
  };

  return (
    <View style={[styles.mainContainer, {padding: padding}]}>
      <Pressable
        disabled={hideCollapse}
        onPress={() => {
          setIsCollapsed(!isCollapsed);
        }}
        style={styles.rowAlignCenter}>
        <View style={styles.flex1}>
          {!noQuestionStatement && (
            <MyText type="medium">
              {STRINGS.QUESTION_COMPONENT.questionStatement}
            </MyText>
          )}
          <View style={styles.marginTop5}>
            {!!item?.question_statement && (
              <>
                <MyWebview
                  fullWidth
                  // html={item?.question_statement}
                  html={
                    item?.is_required
                      ? appendTextInline(item?.question_statement)
                      : item?.question_statement
                  }
                  // style={{
                  //   h1: {
                  //     margin: 0,
                  //     color: colors.primary
                  //   },
                  //   h2: {
                  //     margin: 0,
                  //     color: colors.primary
                  //   },
                  //   span: {
                  //     color: colors.delete,
                  //     fontSize: 16,
                  //     paddingTop: 10,
                  //     transform: [{ translateY: 50 }]
                  //   },

                  // }}
                />
              </>
            )}
          </View>
        </View>
        {!hideCollapse && (
          <View>
            {isCollapsed ? icons.downwardArrow() : icons.upwardArrow()}
          </View>
        )}
      </Pressable>
      <View style={styles.marginTop10}>
        <Collapsible collapsed={isCollapsed}>
          <View>
            {item?.question_type == 'scaling'
              ? scalingQuestionView(item, index)
              : item?.question_type == 'mcq'
              ? RadioButtonView(item, index)
              : item?.question_type == 'checkbox'
              ? checkBoxButtonView(item, index)
              : item?.question_type == 'textarea'
              ? textAreaView(item, index)
              : null}
          </View>

          {item?.answer?.document_url && (
            <View style={styles.documentBtnContainer}>
              <MyButton
                onPress={() => openUrl(S3_URL + item?.answer?.document_url)}
                style={styles.documentBtn}
                textStyle={styles.documentBtnText}
                invert
                title={STRINGS.QUESTION_COMPONENT.viewDocument}
              />
            </View>
          )}
          {showRepliesbtns && repliesBtns(item)}
        </Collapsible>
      </View>
    </View>
  );
};

export default QuestionComponent;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.secondary,
    marginTop: 10,
    borderRadius: 10,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  marginTop5: {
    marginTop: 5,
  },
  marginTop10: {
    marginTop: 10,
  },
  scalingOption: {
    height: 25,
    width: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.beige,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
  },
  scalingOptionSelected: {
    backgroundColor: colors.beige,
  },
  scalingOptionUnselected: {
    backgroundColor: colors.transparent,
  },
  optionContainer: {
    paddingTop: 10,
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: colors.lightPrimary3,
  },
  optionUnselected: {
    backgroundColor: colors.transparent,
  },
  checkboxContainer: {
    paddingTop: 10,
    justifyContent: 'center',
  },
  textAreaContainer: {
    borderWidth: 1 / 2,
    borderRadius: 10,
    borderColor: colors.white,
    minHeight: 100,
    padding: 10,
  },
  textOpacity: {
    opacity: 0.8,
  },
  documentBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  documentBtn: {
    height: 30,
    paddingHorizontal: 10,
  },
  documentBtnText: {
    fontSize: 12,
    textTransform: 'capitalize',
    textDecorationLine: 'underline',
    textDecorationColor: colors.primary,
  },
  btnView: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: 10,
    height: 35,
    marginRight: 20,
  },
});
