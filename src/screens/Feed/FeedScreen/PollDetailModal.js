import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import Modal from 'react-native-modal';
import moment from 'moment';
import MyText from '../../../components/MyText';
import {colors} from '../../../utilities/colors';
import {convertTimezone2} from '../../../functions/convertTime';
import numFormatter from '../../../functions/numFormatter';
import MyImage from '../../../components/MyImage';
import EmptyView from '../../../components/EmptyView';
import MemberView from '../../../components/MemberView';
import {icons} from '../../../utilities/icons';
import {STRINGS} from '../../../utilities/strings';
import {
  FEED_POLL_ACTIONS,
  FEED_POLL_DETAIL,
  FEED_POLLED_MEMBER_LIST,
} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';

// const ic_cross = require("../../assets/close1.png");
// const ic_back = require("../../assets/back.png");

const PollDetailModal = forwardRef(
  ({token, navigation, timezone, member}, ref) => {
    const pagination = useRef({page: 0, canLoadMore: false});
    const [isVisible, setIsVisible] = useState(false);
    const [data, setData] = useState(null);
    const [loader, setLoader] = useState(false);
    const [tab, setTab] = useState(1);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [memberList, setMemberList] = useState([]);
    const [listLoader, setListLoader] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const {S3_URL} = useSelector(selectUser);

    useImperativeHandle(
      ref,
      () => {
        return {
          openModal,
          socketActionForPollDetailModal,
        };
      },
      [token, timezone, member],
    );

    const socketActionForPollDetailModal = socketData => {
      if (socketData.token != token) {
        if (socketData.action == 'poll_answered') {
          updatePollData(socketData?.feed_obj, socketData?.action_by?._id);
        }
      }
    };

    const updatePollData = (updatedDate, actionId) => {
      setData(old => {
        let obj = {...old};
        if (updatedDate?._id == old?.feed_obj?._id) {
          obj.options_array = [...updatedDate?.poll_info?.options];
          if (actionId == member?._id) {
            obj.selected_options = !!updatedDate?.selected_options
              ? [...updatedDate?.selected_options]
              : [];
          }
        }
        return {...obj};
      });
    };

    const openModal = item => {
      pagination.current.page = 0;
      pagination.current.canLoadMore = false;
      setData(null);
      setTab(1);
      setSelectedQuestion(null);
      setLoader(true);
      getDetail(item?._id);
      setIsVisible(true);
    };

    const closeModal = () => {
      setLoader(false);
      setData(null);
      setIsVisible(false);
      setTab(1);
      setSelectedQuestion(null);
      pagination.current.page = 0;
      pagination.current.canLoadMore = false;
    };

    const onMemberList = question => {
      pagination.current.page = 0;
      pagination.current.canLoadMore = false;
      setListLoader(true);
      setIsLoadingMore(false);
      setSelectedQuestion(question);
      getMemberList(question?._id, true);
      setTab(2);
    };

    const onBackPress = () => {
      pagination.current.page = 0;
      pagination.current.canLoadMore = false;
      setSelectedQuestion(null);
      getMemberList([]);
      setTab(1);
    };

    const getDetail = async id => {
      let res = await FEED_POLL_DETAIL({token, navigation, id});
      if (res.code === 200) {
        setData(res);
      }
      setLoader(false);
    };

    const getMemberList = async (id, isFirstTime = false) => {
      let res = await FEED_POLLED_MEMBER_LIST({
        navigation,
        token,
        postData: {
          feed_id: data?.feed_obj?._id,
          option_id: id,
          limit: 10,
          page: pagination?.current?.page,
        },
      });

      if (res.code === 200) {
        pagination.current.page++;
        if (pagination?.current?.page < res?.total_page) {
          pagination.current.canLoadMore = true;
        } else {
          pagination.current.canLoadMore = false;
        }
        setMemberList(
          isFirstTime ? res?.users : [...memberList, ...res?.users],
        );
      }
      setIsLoadingMore(false);
      setListLoader(false);
    };

    const pollAction = async optionId => {
      let resp = await FEED_POLL_ACTIONS({
        token,
        navigation,
        feedId: data?.feed_obj?._id,
        optionId: optionId,
      });

      if (resp.code == 200) {
        updatePollData(resp?.feed_obj, member?._id);
      } else {
      }
    };

    const onEndReached = () => {
      if (pagination.current.canLoadMore) {
        pagination.current.canLoadMore = false;
        setIsLoadingMore(true);
        getMemberList(selectedQuestion?._id);
      }
    };

    const renderMember = ({item}) => {
      return (
        <View style={__style.marginTop5}>
          <MemberView
            hideEmail
            member={item?.user_info_action_by}
            subText={moment(item?.createdAt).format('DD-MM-YYYY [at] hh:mm A')}
          />
        </View>
      );
    };

    return (
      <Modal
        isVisible={isVisible}
        onBackButtonPress={closeModal}
        onBackdropPress={closeModal}
        useNativeDriverForBackdrop={true}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        style={__style.modalMargin}>
        <SafeAreaView style={__style.flex1}>
          <View style={__style.modalCenterView}>
            <View style={__style.rootView}>
              <View style={__style.headingView}>
                {tab == 2 ? (
                  <TouchableOpacity
                    style={__style.clsoeIconView}
                    onPress={onBackPress}>
                    {icons.back()}
                    {/* <Image
                    source={ic_back}
                    style={__style.closeIcon}
                  /> */}
                  </TouchableOpacity>
                ) : (
                  <View style={__style.width30} />
                )}

                <View>
                  <MyText fontSize={18} type="M">
                    {STRINGS.POLL_DETAIL_MODAL.poll}
                  </MyText>
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
              {tab == 1 ? (
                <>
                  {!!data ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View style={__style.padding10}>
                        <View style={__style.headingTextView}>
                          <MyText color={colors.primary}>
                            {STRINGS.POLL_DETAIL_MODAL.pollStatement}
                          </MyText>
                          <View style={__style.descView}>
                            <MyText>{data?.feed_obj?.description}</MyText>
                          </View>
                        </View>

                        <View style={__style.headingTextView}>
                          <MyText color={colors.primary}>
                            {STRINGS.POLL_DETAIL_MODAL.expiration}
                          </MyText>
                          <View style={__style.descView}>
                            {data?.feed_obj?.poll_info?.poll_status ==
                            'expired' ? (
                              <MyText>
                                {STRINGS.POLL_DETAIL_MODAL.expired}
                              </MyText>
                            ) : (
                              <MyText>
                                {convertTimezone2(
                                  data?.feed_obj?.poll_info?.expiry_date_time,
                                  timezone,
                                ).format('DD-MM-YYYY [at] hh:mm A')}
                              </MyText>
                            )}
                          </View>
                        </View>

                        <View style={__style.headingTextView}>
                          <MyText color={colors.primary}>
                            {STRINGS.POLL_DETAIL_MODAL.responses}
                          </MyText>
                          <View style={__style.marginTop10}>
                            {data?.options_array?.map(option => {
                              let isSelected =
                                !!data?.selected_options &&
                                !!data?.selected_options.find(
                                  x => x._id == option?._id,
                                );
                              return (
                                <View style={__style.marginBottom10}>
                                  <TouchableOpacity
                                    disabled={
                                      data?.feed_obj?.poll_info?.poll_status ==
                                      'expired'
                                    }
                                    onPress={() => pollAction?.(option?._id)}
                                    style={__style.pollOptionRow}>
                                    <View
                                      style={[
                                        __style.pollOptionContainer,
                                        {
                                          backgroundColor: isSelected
                                            ? colors.primary
                                            : colors.transparent,
                                        },
                                      ]}>
                                      <View style={__style.pollOptionInner}>
                                        <View
                                          style={[
                                            __style.radioButtonOuter,
                                            {
                                              borderColor: isSelected
                                                ? colors.black
                                                : colors.primary,
                                            },
                                          ]}>
                                          {isSelected && (
                                            <View
                                              style={__style.radioButtonInner}
                                            />
                                          )}
                                        </View>
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
                                  <Pressable
                                    onPress={() => onMemberList(option)}
                                    style={__style.avatarPressable}>
                                    {option?.answers.map((user, index) => (
                                      <View
                                        style={[
                                          __style.avatarContainer,
                                          {marginLeft: index == 0 ? 0 : -10},
                                        ]}>
                                        {!!user?.user_info_action_by
                                          ?.profile_image ? (
                                          <MyImage
                                            source={{
                                              uri:
                                                S3_URL +
                                                user?.user_info_action_by
                                                  ?.profile_image,
                                            }}
                                            style={__style.avatarImage}
                                            imageStyle={
                                              __style.avatarImageStyle
                                            }
                                          />
                                        ) : (
                                          <MyText fontSize={12}>
                                            {user?.user_info_action_by?.name.charAt(
                                              0,
                                            )}
                                          </MyText>
                                        )}
                                      </View>
                                    ))}
                                  </Pressable>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  ) : !loader ? (
                    <View style={__style.paddingBottom50}>
                      <EmptyView />
                    </View>
                  ) : null}
                </>
              ) : (
                <View style={__style.memberListContainer}>
                  <View style={__style.headingTextView}>
                    <MyText color={colors.primary}>
                      {STRINGS.POLL_DETAIL_MODAL.optionStatement}
                    </MyText>
                    <View style={__style.descView}>
                      <MyText>{selectedQuestion?.text}</MyText>
                    </View>
                  </View>
                  <View style={__style.flex1MarginTop10}>
                    <FlatList
                      data={memberList}
                      renderItem={renderMember}
                      showsVerticalScrollIndicator={false}
                      ListEmptyComponent={
                        listLoader ? (
                          <View style={__style.centerHeight50}>
                            <ActivityIndicator
                              size={'small'}
                              color={colors.primary}
                            />
                          </View>
                        ) : (
                          EmptyView
                        )
                      }
                      onEndReached={onEndReached}
                      ListFooterComponent={
                        <View style={__style.centerHeight50}>
                          {isLoadingMore && (
                            <ActivityIndicator
                              color={colors.primary}
                              size={'small'}
                            />
                          )}
                        </View>
                      }
                    />
                  </View>
                </View>
              )}
              {!!loader && (
                <View style={__style.loaderHeight100}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  },
);

export default PollDetailModal;

const __style = StyleSheet.create({
  modalMargin: {
    margin: 0,
  },
  flex1: {
    flex: 1,
  },
  modalCenterView: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  rootView: {
    marginTop: 'auto',
    borderRadius: 10,
    backgroundColor: colors.secondary,
  },
  headingTextView: {
    marginTop: 10,
  },
  descView: {
    marginTop: 5,
  },
  headingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1 / 3,
    borderBottomColor: colors.border,
  },
  clsoeIconView: {
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.darkSecondary,
    borderRadius: 30 / 2,
  },
  closeIcon: {
    height: 12,
    width: 12,
    tintColor: colors.white,
  },
  width30: {
    width: 30,
  },
  padding10: {
    padding: 10,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginBottom10: {
    marginBottom: 10,
  },
  pollOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollOptionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
    borderWidth: 1 / 2,
    borderColor: colors.border,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  pollOptionInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonOuter: {
    marginRight: 10,
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.black,
  },
  avatarPressable: {
    marginLeft: 2,
    marginTop: 5,
    flexDirection: 'row',
  },
  avatarContainer: {
    backgroundColor: colors.backgorund4,
    height: 21,
    width: 21,
    borderRadius: 10.5,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    height: 20,
    width: 20,
  },
  avatarImageStyle: {
    borderRadius: 10,
  },
  paddingBottom50: {
    paddingBottom: 50,
  },
  memberListContainer: {
    height: 500,
    padding: 10,
  },
  flex1MarginTop10: {
    flex: 1,
    marginTop: 10,
  },
  centerHeight50: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderHeight100: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginTop5: {
    marginTop: 5,
  },
});
