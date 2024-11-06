import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, ActivityIndicator, Alert, ScrollView, Pressable, FlatList, Dimensions } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import Modal from 'react-native-modal';
import moment from 'moment';
import { LinearProgress } from '@rneui/base';
import { FEED_SURVEY_DETAIL, FEED_SURVEY_MEMBER_LIST } from '../../../DAL';
import MyText from '../../../components/MyText';
import { colors } from '../../../utilities/colors';
import MemberView from '../../../components/MemberView';
import { convertTimezone2 } from '../../../functions/convertTime';
import MyImage from '../../../components/MyImage';
import { S3_URL } from '../../../utilities/constants';
import EmptyView from '../../../components/EmptyView';
import { icons } from '../../../utilities/icons';
import Toast from 'react-native-toast-message';




const SurveyDetailModal = forwardRef(({ token, member, navigation, timezone }, ref) => {
  const pagination = useRef({ page: 0, canLoadMore: false });
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(null)
  const [loader, setLoader] = useState(false);
  const [tab, setTab] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [listLoader, setListLoader] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      openModal,
      socketActionForSurveyDetailModal
    }
  }, [token, member])



  const socketActionForSurveyDetailModal = (socketData) => {
    if (socketData.token != token) {
      if (socketData.action == "survey_answered") {
        updateSurveyData(socketData?.feed_obj, socketData?.action_by?._id)
      }
    }
  }

  const updateSurveyData = (updatedDate, actionId) => {
    setData((old) => {
      let obj = { ...old }
      if (updatedDate?._id == old?.feed_obj?._id) {
        obj.questions = [...updatedDate?.survey_info?.questions];
        obj.survey_selected_options = !!updatedDate?.survey_selected_options ? [...updatedDate?.survey_selected_options] : []
        // if (actionId == member?._id) {
        //   obj.survey_selected_options = !!updatedDate?.survey_selected_options ? [...updatedDate?.survey_selected_options] : []
        // }
      }
      return { ...obj }
    })
  }

  const openModal = (item) => {
    pagination.current.page = 0;
    pagination.current.canLoadMore = false;
    setData(null)
    setTab(1)
    setSelectedQuestion(null)
    setLoader(true)
    getDetail(item?._id)
    setIsVisible(true)
  }

  const closeModal = () => {
    setLoader(false)
    setData(null)
    setIsVisible(false)
    setTab(1)
    setSelectedQuestion(null)
    pagination.current.page = 0;
    pagination.current.canLoadMore = false;
  }

  const onMemberList = (question) => {
    pagination.current.page = 0;
    pagination.current.canLoadMore = false;
    setListLoader(true)
    setIsLoadingMore(false)
    setSelectedQuestion(question)
    getMemberList(question?._id, true)
    setTab(2);
  }

  const onBackPress = () => {
    pagination.current.page = 0;
    pagination.current.canLoadMore = false;
    setSelectedQuestion(null)
    getMemberList([])
    setTab(1);
  }

  const getDetail = async (id) => {
    let res = await FEED_SURVEY_DETAIL({ id, token, navigation });
    if (res.code === 200) {
      setData(res)
    }
    setLoader(false)
  }

  const getMemberList = async (id, isFirstTime = false) => {
    let res = await FEED_SURVEY_MEMBER_LIST({
      token, navigation,
      body: {
        feed_id: data?.feed_obj?._id,
        option_id: id,
        page: pagination?.current?.page,
      }
    });
    if (res.code === 200) {
      pagination.current.page++;
      if (pagination?.current?.page < res?.total_page) {
        pagination.current.canLoadMore = true;
      } else {
        pagination.current.canLoadMore = false;
      }
      setMemberList(isFirstTime ? res?.users : [...memberList, ...res?.users])
    }
    setIsLoadingMore(false)
    setListLoader(false)
  }


  const onEndReached = () => {
    if (pagination.current.canLoadMore) {
      pagination.current.canLoadMore = false;
      setIsLoadingMore(true);
      getMemberList(selectedQuestion?._id)
    }
  }

  const renderMember = ({ item }) => {
    return (
      <View style={{ marginTop: 5 }}>
        <MemberView
          hideEmail
          member={item?.user_info_action_by}
          subText={moment(item?.createdAt).format("DD-MM-YYYY [at] hh:mm A")}

        />
      </View>
    )
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn={"zoomIn"}
      animationOut={"zoomOut"}
      style={{ margin: 0 }}
    >
      <SafeAreaView style={{ flex: 1, }} >
        <View style={{ marginTop: "auto", marginBottom: "auto" }} >
          <View style={__style.rootView}>
            <View style={__style.headingView}>
              {tab == 2 ?
                <TouchableOpacity
                  style={__style.clsoeIconView}
                  onPress={onBackPress}>
                  {icons.back()}
                </TouchableOpacity> :
                <View style={{ width: 30, }} />}

              <View>
                <MyText fontSize={18} type='medium' >Survey</MyText>

              </View>
              <TouchableOpacity
                style={__style.clsoeIconView}
                onPress={closeModal}>
                {icons.crosss()}

              </TouchableOpacity>
            </View>
            {tab == 1 ?
              <>
                {!!data ?
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 10 }}>
                      <View style={__style.headingTextView} >
                        <MyText color={colors.primary} >Survey Statement</MyText>
                        <View style={__style.descView} >
                          <MyText  >{data?.feed_obj?.description}</MyText>
                        </View>
                      </View>

                      <View style={__style.headingTextView} >
                        <MyText color={colors.primary} >Expiration</MyText>
                        <View style={__style.descView} >
                          {data?.feed_obj?.survey_info?.survey_status == "expired" ?
                            <MyText  >{"Expired"}</MyText> :
                            <MyText  >{convertTimezone2(data?.feed_obj?.survey_info?.expiry_date_time, timezone).format("DD-MM-YYYY [at] hh:mm A")}</MyText>}
                        </View>
                      </View>

                      <View style={__style.headingTextView} >
                        {/* <MyText color={colors.primary} >Responses</MyText> */}
                        <View style={{}} >
                          <FlatList
                            data={data?.questions || []}
                            // extraData={}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                              let totalAnswers = item?.options.reduce((total, obj) => total + obj?.answers.length, 0);
                              return (
                                <View style={{ marginTop: 10, backgroundColor: colors.secondaryVariant, padding: 10, borderRadius: 10 }}>
                                  <MyText fontSize={14} type='medium' color={colors.primary} >{index + 1}. {item?.question_statement}</MyText>
                                  {item?.options?.map((option) => {
                                    let isSelected = !!data?.selected_options && !!data?.selected_options.find(x => x._id == option?._id)
                                    let percent = (option.answers.length / totalAnswers);
                                    percent = isNaN(percent) ? 0 : percent.toFixed(2);
                                    return (
                                      <View style={{ marginTop: 15, }}>
                                        <View>
                                          <View style={{}} >
                                            <MyText color={isSelected ? colors.black : colors.white} >{option?.text}</MyText>
                                            <View style={{ marginTop: 5, alignItems: "center", flexDirection: "row" }}>
                                              <View style={{ flex: 1, paddingRight: 10 }}>
                                                <LinearProgress
                                                  value={percent == 0 ? 0 : percent}
                                                  style={{ height: 8, borderRadius: 10 }}
                                                  color={colors.primary}
                                                  trackColor={colors.lightGolden3}
                                                  animation={{
                                                    duration: 500
                                                  }}
                                                />
                                              </View>
                                              <View style={{ minWidth: 35, alignItems: "flex-end" }}>
                                                <MyText color={colors.lightText2} fontSize={12}>{percent * 100}%</MyText>
                                              </View>
                                            </View>
                                          </View>
                                        </View>
                                        <Pressable
                                          onPress={() => onMemberList(option)}
                                          style={{ marginTop: 5, flexDirection: "row", alignItems: "center" }}>
                                          {option?.answers.map((user, index) => (
                                            <View style={{ backgroundColor: colors.backgorund4, height: 21, width: 21, borderRadius: 21 / 2, borderWidth: 2, borderColor: colors.white, alignItems: "center", justifyContent: "center", marginLeft: index == 0 ? 0 : -10 }}>
                                              {!!user?.user_info_action_by?.profile_image ?
                                                <MyImage
                                                  source={{
                                                    uri: S3_URL + user?.
                                                      user_info_action_by?.profile_image
                                                  }}
                                                  style={{ height: 20, width: 20 }}
                                                  imageStyle={{ borderRadius: 20 / 2 }}
                                                /> :
                                                <MyText fontSize={12} >{user?.user_info_action_by?.name.charAt(0)}</MyText>}
                                            </View>
                                          ))}

                                          <View style={{ marginLeft: option?.votes == 0 ? 0 : 10 }}>
                                            <MyText color={colors.lightText2} fontSize={12} >{option?.votes} {option?.votes == 1 ? "Vote" : "Votes"}</MyText>
                                          </View>
                                        </Pressable>
                                      </View>
                                    )
                                  })}
                                </View>
                              )
                            }}
                          />

                        </View>
                      </View>
                    </View>
                  </ScrollView> :
                  !loader ?
                    <View style={{ paddingBottom: 50 }}>
                      <EmptyView />
                    </View> : null
                }
              </> :
              <View style={{ height: 500, padding: 10 }}>
                <View style={__style.headingTextView} >
                  <MyText color={colors.primary} >Option Statement</MyText>
                  <View style={__style.descView} >
                    <MyText  >{selectedQuestion?.text}</MyText>
                  </View>
                </View>
                <View style={{ flex: 1, marginTop: 10 }}>
                  <FlatList
                    data={memberList}
                    renderItem={renderMember}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={listLoader ?
                      <View style={{ height: 50, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size={"small"} color={colors.primary} />
                      </View>
                      :
                      <EmptyView />}
                    onEndReached={onEndReached}
                    ListFooterComponent={
                      <View style={{ height: 50, alignItems: "center", justifyContent: "center" }}>
                        {isLoadingMore && <ActivityIndicator color={colors.primary} size={"small"} />}
                      </View>}
                  />
                </View>
              </View>
            }
            {!!loader &&
              <View style={{ height: 100, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator color={colors.primary} />
              </View>}


          </View>
        </View>
      </SafeAreaView>
      {isVisible &&<Toast />}
    </Modal>
  )
})

export default SurveyDetailModal


const __style = StyleSheet.create({
  rootView: {
    marginTop: "auto",
    borderRadius: 10,
    maxHeight: Dimensions.get("window").height - 100,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    backgroundColor: colors.secondary,
  },
  headingTextView: {
    marginTop: 10
  },
  descView: {
    marginTop: 5
  },
  headingView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15, borderBottomWidth: 1 / 3,
    borderBottomColor: colors.white + "99"
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