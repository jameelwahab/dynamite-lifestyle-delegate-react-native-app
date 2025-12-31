import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import Modal from 'react-native-modal';
import MyText from '../../../components/MyText';
import {STRINGS} from '../../../utilities/strings';
import {colors} from '../../../utilities/colors';
import {LinearProgress} from '@rneui/base';
import {MyButton} from '../../../components/MyButton';
import MyLoader from '../../../components/MyLoader';
import {icons} from '../../../utilities/icons';
import {FEED_SURVEY_ACTION, FEED_SURVEY_DETAIL} from '../../../DAL';
import numFormatter from '../../../functions/numFormatter';
import Toast from 'react-native-toast-message';
import showToast from '../../../functions/showToast';

const SurveyModal = forwardRef(({token, navigation}, ref) => {
  const ref_swiper = useRef();
  let feedObj = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [curIndex, setCurIndex] = useState(0);

  const isExpired = data?.feed_obj?.survey_info?.survey_status == 'expired';

  const getSurveyDetail = async id => {
    let res = await FEED_SURVEY_DETAIL({token, navigation, id});
    if (res.code == 200) {
      setData(res);
    } else {
      Alert.alert(STRINGS.SURVEY_MODAL.error, res?.message);
    }
    setLoader(false);
  };

  const surveyAction = async (questionId, optionId) => {
    if (isExpired) {
      showToast({
        title: STRINGS.SURVEY_MODAL.surveyExpired,
        body: STRINGS.SURVEY_MODAL.cantAnswerExpired,
        type: 'info',
      });
      return;
    }
    let resp = await FEED_SURVEY_ACTION({
      token,
      navigation,
      body: {
        feed_id: feedObj?.current?._id,
        option_id: optionId,
        question_id: questionId,
      },
    });

    if (resp.code == 200) {
      setData(old => ({
        ...old,
        questions: resp?.feed_obj?.survey_info?.questions,
        survey_selected_options: resp?.feed_obj?.survey_selected_options,
      }));
    } else {
    }
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        openModal,
        closeModal,
      };
    },
    [token],
  );

  const openModal = feed => {
    feedObj.current = feed;

    setIsVisible(true);
    setLoader(true);
    setTimeout(() => {
      getSurveyDetail(feed?._id);
    }, 200);
  };
  const closeModal = () => {
    setIsVisible(false);
  };

  const onViewableItemsChanged = React.useCallback(
    ({viewableItems, changed}) => {
      // apply your logic here
      if (viewableItems.length == 1) {
        setCurIndex(viewableItems[0]?.index);
      }
    },
    [],
  );

  const viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};

  const viewabilityConfigCallbackPairs = React.useRef([
    {viewabilityConfig, onViewableItemsChanged},
  ]);

  const onNextPress = () => {
    if (curIndex < data?.questions.length - 1) {
      setCurIndex(curIndex + 1);
      ref_swiper?.current?.scrollToIndex({
        animated: true,
        index: curIndex + 1,
      });
    } else {
      closeModal();
    }
  };

  const onBackPress = () => {
    if (curIndex != 0) {
      setCurIndex(curIndex - 1);
      ref_swiper?.current?.scrollToIndex({
        animated: true,
        index: curIndex - 1,
      });
    }
  };

  const onModalHide = () => {
    setData(null);
  };

  const onModalShow = () => {};

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500}
      animationOutTiming={500}
      onModalHide={onModalHide}
      onModalShow={onModalShow}
      hideModalContentWhileAnimating={true}
      style={__styles.modalMargin}
      avoidKeyboard={true}>
      <SafeAreaView style={__styles.flex1}>
        <View style={__styles?.rootView}>
          <View style={__styles.headingView}>
            <View>
              <MyText fontSize={18} type="medium">
                {STRINGS.SURVEY_MODAL.survey}
              </MyText>
              {/* <MyText color={colors.lightText} fontSize={12}>Select your country from list below</MyText> */}
            </View>

            <TouchableOpacity
              style={__styles.clsoeIconView}
              onPress={closeModal}>
              {icons.crosss()}
              {/* <Image
                source={ic_cross}
                style={__styles.closeIcon}
              /> */}
            </TouchableOpacity>
          </View>
          <View style={__styles.flex1}>
            {!!data && (
              <>
                <View style={__styles.navigationContainer}>
                  {curIndex != 0 ? (
                    <Pressable
                      hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
                      onPress={onBackPress}>
                      {icons.back(colors.primary)}
                    </Pressable>
                  ) : (
                    <View style={__styles.spacer12} />
                  )}
                  <View style={__styles.counterContainer}>
                    <MyText fontSize={14} color={colors.silver}>
                      <MyText type="bold">{curIndex + 1}</MyText>{' '}
                      {STRINGS.SURVEY_MODAL.of} {data?.questions.length}
                    </MyText>
                  </View>
                  <View style={__styles.spacer12} />
                </View>
                <View style={__styles.progressContainer}>
                  <LinearProgress
                    // variant="indeterminate"
                    animation={{
                      duration: 500,
                    }}
                    color={colors.primary}
                    trackColor={colors.lightPrimary3}
                    value={(curIndex + 1) / data?.questions.length}
                    style={__styles.progressBar}
                  />
                </View>
                <View style={__styles.flex1}>
                  <FlatList
                    ref={ref_swiper}
                    scrollEnabled={false}
                    data={data?.questions || []}
                    viewabilityConfigCallbackPairs={
                      viewabilityConfigCallbackPairs.current
                    }
                    viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item: item2, index: index2}) => {
                      return (
                        <View style={__styles.questionSlideContainer}>
                          <View style={__styles.questionContentContainer}>
                            <MyText fontSize={12} color={colors.primary}>
                              {STRINGS.SURVEY_MODAL.question} {index2 + 1}:
                            </MyText>
                            <View style={__styles.marginTop5}>
                              <MyText
                                color={colors.white}
                                fontSize={18}
                                type="medium">
                                {item2?.question_statement}
                              </MyText>
                            </View>
                            {item2?.options.map(option => {
                              let isSelected = !!data?.survey_selected_options
                                ? data?.survey_selected_options.some(
                                    x => x._id == option?._id,
                                  )
                                : false;
                              // let isSelected = false
                              return (
                                <TouchableOpacity
                                  // disabled={isExpired}
                                  onPress={() =>
                                    surveyAction(item2._id, option?._id)
                                  }
                                  style={__styles.optionTouchable}>
                                  <View
                                    style={[
                                      __styles.optionContainer,
                                      isSelected
                                        ? __styles.optionSelected
                                        : __styles.optionNotSelected,
                                    ]}>
                                    <View style={__styles.optionInnerContainer}>
                                      {!isExpired && (
                                        <View
                                          style={{
                                            marginRight: 10,
                                            height: 20,
                                            width: 20,
                                            borderRadius:
                                              item2?.is_multiple_allow
                                                ? 5
                                                : 20 / 2,
                                            borderWidth: 1,
                                            borderColor: isSelected
                                              ? colors.black
                                              : colors.primary,
                                            marginHorizontal: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                          }}>
                                          {isSelected && (
                                            <>
                                              {item2?.is_multiple_allow ? (
                                                <Image
                                                  source={icons.tick}
                                                  style={__styles.tickIcon}
                                                />
                                              ) : (
                                                <View
                                                  style={__styles.radioInner}
                                                />
                                              )}
                                            </>
                                          )}
                                        </View>
                                      )}

                                      <MyText
                                        color={
                                          isSelected
                                            ? colors.black
                                            : colors.white
                                        }>
                                        {option?.text}
                                      </MyText>
                                    </View>
                                    {option?.votes > 0 && (
                                      <MyText
                                        color={
                                          isSelected
                                            ? colors.black
                                            : colors.white
                                        }>
                                        {numFormatter(option?.votes, 1)}
                                      </MyText>
                                    )}
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      );
                    }}
                  />
                </View>
                <View style={__styles.buttonContainer}>
                  <MyButton
                    onPress={onNextPress}
                    // style={{ width: "100%", backgroundColor: colors.golden }}
                    title={
                      curIndex == data?.questions.length - 1
                        ? STRINGS.SURVEY_MODAL.finish
                        : STRINGS.SURVEY_MODAL.next
                    }
                  />
                </View>
              </>
            )}
          </View>

          <MyLoader enable={loader} />
        </View>
      </SafeAreaView>
      <SafeAreaView style={__styles.safeAreaBottom} />
      {isVisible && <Toast />}
    </Modal>
  );
});

export default SurveyModal;

const __styles = StyleSheet.create({
  rootView: {
    marginTop: 'auto',
    // height: fle,
    // width: "100%",
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.secondary,
  },
  headingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    // borderBottomWidth: 1 / 3,
    // borderBottomColor: colors.taskText
  },
  clsoeIconView: {
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondarySelect,
    borderRadius: 30 / 2,
  },
  closeIcon: {
    height: 12,
    width: 12,
    tintColor: colors.white,
  },
  modalMargin: {
    margin: 0,
  },
  flex1: {
    flex: 1,
  },
  navigationContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer12: {
    width: 12,
    height: 12,
  },
  counterContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  progressBar: {
    height: 5,
    borderRadius: 5,
  },
  questionSlideContainer: {
    width: Dimensions.get('screen').width,
    padding: 10,
  },
  questionContentContainer: {
    backgroundColor: colors.backgorund5,
    flex: 1,
    padding: 10,
  },
  marginTop5: {
    marginTop: 5,
  },
  optionTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
    borderWidth: 1 / 2,
    borderColor: colors.border,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  optionSelected: {
    backgroundColor: colors.primary,
  },
  optionNotSelected: {
    backgroundColor: colors.transparent,
  },
  optionInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCheckContainer: {
    marginRight: 10,
    height: 20,
    width: 20,
    borderWidth: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCheckSquare: {
    borderRadius: 5,
  },
  radioCheckCircle: {
    borderRadius: 10,
  },
  radioCheckSelected: {
    borderColor: colors.black,
  },
  radioCheckNotSelected: {
    borderColor: colors.primary,
  },
  tickIcon: {
    height: 12,
    width: 12,
    tintColor: colors.black,
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.black,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  safeAreaBottom: {
    flex: 0,
    backgroundColor: colors.secondary,
  },
});
