import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, Alert, Dimensions, FlatList, Pressable } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import Modal from 'react-native-modal';
import MyText from '../../../components/MyText';
import { colors } from '../../../utilities/colors';
import { LinearProgress } from '@rneui/base';
import { MyButton } from '../../../components/MyButton';
import MyLoader from '../../../components/MyLoader';
import { icons } from '../../../utilities/icons';
import { FEED_SURVEY_ACTION, FEED_SURVEY_DETAIL } from '../../../DAL';
import numFormatter from '../../../functions/numFormatter';
import Toast from 'react-native-toast-message';
import showToast from '../../../functions/showToast';



const SurveyModal = forwardRef(({ token, navigation }, ref) => {
  const ref_swiper = useRef()
  let feedObj = useRef(null)
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(null)
  const [loader, setLoader] = useState(false)
  const [curIndex, setCurIndex] = useState(0);

  const isExpired = data?.feed_obj?.survey_info?.survey_status == "expired";

  const getSurveyDetail = async (id) => {
    let res = await FEED_SURVEY_DETAIL({ token, navigation, id })
    if (res.code == 200) {
      setData(res)
    } else {
      Alert.alert("Error", res?.message)
    }
    setLoader(false)

  }


  const surveyAction = async (questionId, optionId) => {
    if (isExpired) {
      showToast({ title: "Survey Expired", body: "You can't answer these question.", type: "info" })
      return
    }
    let resp = await FEED_SURVEY_ACTION({
      token, navigation,
      body: {
        feed_id: feedObj?.current?._id,
        option_id: optionId,
        question_id: questionId,
      },
    });

    if (resp.code == 200) {
      setData((old) => ({
        ...old,
        questions: resp?.feed_obj?.survey_info?.questions,
        survey_selected_options: resp?.feed_obj?.survey_selected_options
      }));
    } else {

    }
  }

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal
    }
  }, [token])



  const openModal = (feed) => {

    feedObj.current = feed

    setIsVisible(true);
    setLoader(true)
    setTimeout(() => {
      getSurveyDetail(feed?._id)
    }, 200);
  }
  const closeModal = () => {
    setIsVisible(false);
  }


  const onViewableItemsChanged = React.useCallback(({ viewableItems, changed }) => {
    // apply your logic here
    if (viewableItems.length == 1) {
      setCurIndex(viewableItems[0]?.index)
    }
  }, []);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }

  const viewabilityConfigCallbackPairs = React.useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);



  const onNextPress = () => {
    if (curIndex < (data?.questions.length - 1)) {
      setCurIndex(curIndex + 1)
      ref_swiper?.current?.scrollToIndex({
        animated: true,
        index: curIndex + 1
      })
    } else {
      closeModal()
    }
  }

  const onBackPress = () => {
    if (curIndex != 0) {
      setCurIndex(curIndex - 1)
      ref_swiper?.current?.scrollToIndex({
        animated: true,
        index: curIndex - 1
      })
    }
  }

  const onModalHide = () => {
    setData(null)
  }

  const onModalShow = () => {

  }




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
      style={{ margin: 0, }}
      avoidKeyboard={true}>
      <SafeAreaView style={{ flex: 1 }} >
        <View style={__styles?.rootView}>
          <View style={__styles.headingView}>
            <View>
              <MyText fontSize={18} type='medium' >Survey</MyText>
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
          <View style={{ flex: 1 }}>
            {!!data &&
              <>
                <View style={{ paddingHorizontal: 15, marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                  {curIndex != 0 ?
                    <Pressable
                      hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                      onPress={onBackPress}>
                      {icons.back(colors.primary)}

                    </Pressable> :
                    <View style={{ width: 12, height: 12, }} />}
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <MyText fontSize={14} color={colors.silver} ><MyText type='bold' >{(curIndex + 1)}</MyText>  of  {data?.questions.length}</MyText>
                  </View>
                  <View style={{ width: 12, height: 12, }} />
                </View>
                <View style={{ paddingHorizontal: 15, marginTop: 20, }}>
                  <LinearProgress
                    // variant="indeterminate"
                    animation={{
                      duration: 500
                    }}

                    color={colors.primary}
                    trackColor={colors.lightPrimary3}
                    value={((curIndex + 1) / (data?.questions.length))}
                    style={{ height: 5, borderRadius: 5 }}

                  />

                </View>
                <View style={{ flex: 1 }}>
                  <FlatList
                    ref={ref_swiper}
                    scrollEnabled={false}
                    data={data?.questions || []}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item: item2, index: index2 }) => {

                      return (
                        <View style={{ width: Dimensions.get("screen").width, padding: 10, }}>
                          <View style={{ backgroundColor: colors.backgorund5, flex: 1, padding: 10 }}>
                            <MyText fontSize={12} color={colors.primary} >Question {index2 + 1}:</MyText>
                            <View style={{ marginTop: 5 }}>
                              <MyText color={colors.white} fontSize={18} type='medium'  >{item2?.question_statement}</MyText>
                            </View>
                            {item2?.options.map((option) => {
                              let isSelected = !!data?.survey_selected_options ? data?.survey_selected_options.some(x => x._id == option?._id) : false
                              // let isSelected = false
                              return (
                                <TouchableOpacity
                                  // disabled={isExpired}
                                  onPress={() => surveyAction(item2._id, option?._id)}
                                  style={{ flexDirection: "row", alignItems: "center", marginTop: 20, }}>
                                  <View style={{ backgroundColor: isSelected ? colors.primary : colors.transparent, flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 50, borderWidth: 1 / 2, borderColor: colors.border, borderRadius: 5, paddingHorizontal: 10 }} >

                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                                      {!isExpired &&
                                        <View style={{ marginRight: 10, height: 20, width: 20, borderRadius: item2?.is_multiple_allow ? 5 : (20 / 2), borderWidth: 1, borderColor: isSelected ? colors.black : colors.primary, marginHorizontal: 5, alignItems: "center", justifyContent: "center" }} >
                                          {isSelected &&
                                            <>
                                              {item2?.is_multiple_allow ?
                                                <Image source={icons.tick} style={{ height: 12, width: 12, tintColor: colors.black }} /> :
                                                <View style={{ height: 12, width: 12, borderRadius: 12 / 2, backgroundColor: colors.black }} />}
                                            </>}
                                        </View>}

                                      <MyText color={isSelected ? colors.black : colors.white} >{option?.text}</MyText>
                                    </View>
                                    {option?.votes > 0 &&
                                      <MyText color={isSelected ? colors.black : colors.white}>{numFormatter(option?.votes, 1)}</MyText>}
                                  </View>
                                </TouchableOpacity>
                              )
                            })}
                          </View>
                        </View>
                      )
                    }}
                  />
                </View>
                <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
                  <MyButton
                    onPress={onNextPress}
                    // style={{ width: "100%", backgroundColor: colors.golden }}
                    title={curIndex == (data?.questions.length - 1) ? "FINISH" : "NEXT"} />
                </View>

              </>}
          </View>

          <MyLoader enable={loader} />
        </View>
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: colors.secondary }} />
      {isVisible && <Toast />}
    </Modal>
  )
})

export default SurveyModal

const __styles = StyleSheet.create({
  rootView: {
    marginTop: "auto",
    // height: fle,
    // width: "100%",
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.secondary,
  },
  headingView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    // borderBottomWidth: 1 / 3,
    // borderBottomColor: colors.taskText
  },
  clsoeIconView: {
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondarySelect,
    borderRadius: 30 / 2
  },
  closeIcon: {
    height: 12,
    width: 12,
    tintColor: colors.white
  }
})