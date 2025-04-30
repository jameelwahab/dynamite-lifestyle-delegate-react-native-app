import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, ActivityIndicator, Alert, ScrollView, Pressable, FlatList } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import Modal from 'react-native-modal';
import moment from 'moment';
import MyText from '../../../components/MyText';
import { colors } from '../../../utilities/colors';
import { convertTimezone2 } from '../../../functions/convertTime';
import numFormatter from '../../../functions/numFormatter';
import invokeApi from '../../../functions/invokeAPI';
import MyImage from '../../../components/MyImage';
import EmptyView from '../../../components/EmptyView';
import MemberView from '../../../components/MemberView';
import { icons } from '../../../utilities/icons';
import { FEED_POLL_ACTIONS, FEED_POLL_DETAIL, FEED_POLLED_MEMBER_LIST } from '../../../DAL';
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'



// const ic_cross = require("../../assets/close1.png");
// const ic_back = require("../../assets/back.png");

const PollDetailModal = forwardRef(({ token, navigation, timezone, member, }, ref) => {
  const pagination = useRef({ page: 0, canLoadMore: false });
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(null)
  const [loader, setLoader] = useState(false);
  const [tab, setTab] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [listLoader, setListLoader] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { S3_URL } = useSelector(selectUser)

  useImperativeHandle(ref, () => {
    return {
      openModal,
      socketActionForPollDetailModal
    }
  }, [token, timezone, member])



  const socketActionForPollDetailModal = (socketData) => {
    if (socketData.token != token) {
      if (socketData.action == "poll_answered") {
        updatePollData(socketData?.feed_obj, socketData?.action_by?._id)
      }
    }
  }

  const updatePollData = (updatedDate, actionId) => {
    setData((old) => {
      let obj = { ...old }
      if (updatedDate?._id == old?.feed_obj?._id) {
        obj.options_array = [...updatedDate?.poll_info?.options];
        if (actionId == member?._id) {
          obj.selected_options = !!updatedDate?.selected_options ? [...updatedDate?.selected_options] : []
        }
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
    let res = await FEED_POLL_DETAIL({ token, navigation, id });
    if (res.code === 200) {
      setData(res)
    }
    setLoader(false)
  }

  const getMemberList = async (id, isFirstTime = false) => {
    let res = await FEED_POLLED_MEMBER_LIST({
      navigation,
      token,
      postData: {
        feed_id: data?.feed_obj?._id,
        option_id: id,
        limit: 10,
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

  const pollAction = async (optionId) => {
    let resp = await FEED_POLL_ACTIONS({
      token, navigation,
      feedId: data?.feed_obj?._id,
      optionId: optionId
    })

    if (resp.code == 200) {
      updatePollData(resp?.feed_obj, member?._id)
    } else {

    }
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
                  {/* <Image
                    source={ic_back}
                    style={__style.closeIcon}
                  /> */}
                </TouchableOpacity> :
                <View style={{ width: 30, }} />}

              <View>
                <MyText fontSize={18} type='M' >Poll</MyText>
                {/* <MyText color={colors.lightText} fontSize={12}>Select your country from list below</MyText> */}
              </View>
              <TouchableOpacity
                style={__style.clsoeIconView}
                onPress={closeModal}>
                {icons.crosss()}
                {/* <Image
                  source={ic_cross}
                  style={__style.closeIcon}
                /> */}
              </TouchableOpacity>
            </View>
            {tab == 1 ?
              <>
                {!!data ?
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 10 }}>
                      <View style={__style.headingTextView} >
                        <MyText color={colors.primary} >Poll Statement</MyText>
                        <View style={__style.descView} >
                          <MyText  >{data?.feed_obj?.description}</MyText>
                        </View>
                      </View>

                      <View style={__style.headingTextView} >
                        <MyText color={colors.primary} >Expiration</MyText>
                        <View style={__style.descView} >
                          {data?.feed_obj?.poll_info?.poll_status == "expired" ?
                            <MyText  >{"Expired"}</MyText> :
                            <MyText  >{convertTimezone2(data?.feed_obj?.poll_info?.expiry_date_time, timezone).format("DD-MM-YYYY [at] hh:mm A")}</MyText>}
                        </View>
                      </View>

                      <View style={__style.headingTextView} >
                        <MyText color={colors.primary} >Responses</MyText>
                        <View style={{ marginTop: 10 }} >
                          {data?.options_array?.map((option) => {
                            let isSelected = !!data?.selected_options && !!data?.selected_options.find(x => x._id == option?._id)
                            return (
                              <View style={{ marginBottom: 10, }}>
                                <TouchableOpacity
                                  disabled={data?.feed_obj?.poll_info?.poll_status == "expired"}
                                  onPress={() => pollAction?.(option?._id)}
                                  style={{ flexDirection: "row", alignItems: "center", }}>
                                  <View style={{ backgroundColor: isSelected ? colors.primary : colors.transparent, flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 40, borderWidth: 1 / 2, borderColor: colors.border, borderRadius: 5, paddingHorizontal: 10 }} >
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                                      <View style={{ marginRight: 10, height: 20, width: 20, borderRadius: 20 / 2, borderWidth: 1, borderColor: isSelected ? colors.black : colors.primary, marginHorizontal: 5, alignItems: "center", justifyContent: "center" }} >
                                        {isSelected &&
                                          <View style={{ height: 12, width: 12, borderRadius: 12 / 2, backgroundColor: colors.black }} />}
                                      </View>
                                      <MyText color={isSelected ? colors.black : colors.white} >{option?.text}</MyText>
                                    </View>
                                    {option?.votes > 0 &&
                                      <MyText color={isSelected ? colors.black : colors.white}>{numFormatter(option?.votes, 1)}</MyText>}
                                  </View>
                                </TouchableOpacity>
                                <Pressable
                                  onPress={() => onMemberList(option)}
                                  style={{ marginLeft: 2, marginTop: 5, flexDirection: "row" }}>
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
                                </Pressable>
                              </View>
                            )
                          })}
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
                      EmptyView}
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

    </Modal>
  )
})

export default PollDetailModal


const __style = StyleSheet.create({
  rootView: {
    marginTop: "auto",
    borderRadius: 10,
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
    borderBottomColor: colors.border
  },
  clsoeIconView: {
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.darkSecondary,
    borderRadius: 30 / 2
  },
  closeIcon: {
    height: 12,
    width: 12,
    tintColor: colors.white
  }
})
