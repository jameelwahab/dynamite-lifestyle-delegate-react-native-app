import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {STRINGS} from '../../../utilities/strings';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import MyLoader from '../../../components/MyLoader';
import {
  MEMBER_DELETE_SUBSCRIPTION,
  MEMBER_SUBSCRIPTION_LIST,
} from '../../../DAL';
import {colors} from '../../../utilities/colors';
import StatView from '../Components/StatView';
import EmptyView from '../../../components/EmptyView';
import moment from 'moment';
import {MenuButton} from '../../../components/MyButton';
import OptionModal from '../../../components/OptionModal';
import {icons} from '../../../utilities/icons';
import ConfirmationModal from '../../../components/ConfirmationModal';
import showToast from '../../../functions/showToast';
import openUrl from '../../../functions/openUrl';
import FooterLoader from '../../../components/FooterLoader';
import MyInputs from '../../../components/MyInputs';
import debounce from '../../../functions/debounce';
import UserImage from '../../../components/UserImage';
import DefaultStatusView from '../../../components/DefaultStatusView';
import {Flex, Row} from '../../../UIComponents/FlexViews';
import copyText from '../../../functions/copyText';
import MyRefreshControl from '../../../components/MyRefreshControl';
import InfoModal from '../../../components/InfoModal';
import {dateTimeFormat} from '../../../utilities/constants';

let page = 0;
let canLoadMore = false;

const SubscriptionsList = ({navigation, route}) => {
  const {memberId} = route?.params;
  const infoRef = React.useRef();
  const {token, user, S3_URL} = useSelector(selectUser);
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
  });
  const [confirmationModal, setConfirmationModal] = useState({
    isVisible: false,
    selectedItem: null,
    opt: '',
  });
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [member, setMember] = useState(null);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onSelectedOpt = opt => {
    let {selectedItem} = optionModal;
    setOptionModal({isVisible: false, selectedItem: null});
    if (opt.key == 'view_cancel_request') {
      setTimeout(
        () => {
          let str = `${STRINGS.SUBSCRIPTION_LIST.cancelationReason}${selectedItem?.cancellation_reason}</p>`;
          infoRef?.current?.openModal(str, '', true);
        },
        __DEV__ ? 1000 : 400,
      );
    }
  };

  const onAgreePress = async () => {
    if (confirmationModal.opt == 'delete') {
      deleteSubscriptionFromServer(confirmationModal?.selectedItem?._id);
      setConfirmationModal({isVisible: false, selectedItem: null, opt: ''});
    }
  };

  const deleteSubscriptionFromServer = async id => {
    setLoader(true);
    let res = await MEMBER_DELETE_SUBSCRIPTION({
      token,
      navigation,
      subscriptionId: id,
    });
    if (res.code == 200) {
      showToast({type: 'success', body: res.message, title: ''});
      setList(prevList => prevList.filter(x => x._id != id));
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  const getSubscriptionListFromServer = async (firstTime = false) => {
    let res = await MEMBER_SUBSCRIPTION_LIST({
      token,
      navigation,
      memberId: memberId,
      page: page,
      searchText: searchText,
      type: 'subscription_list',
    });
    if (res.code == 200) {
      let listLength = firstTime
        ? 0 + res.subscription_list.length
        : list.length + res.subscription_list.length;
      if (res?.total_count > listLength) {
        page = page + 1;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setList(
        firstTime ? res.subscription_list : [...list, ...res.subscription_list],
      );
      setTotal(res?.total_count || res.subscription_list.length);
      setMember(res?.member);
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
    } else {
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    page = 0;
    canLoadMore = false;
    setRefreshing(true);
    getSubscriptionListFromServer(true);
  };

  useEffect(() => {
    page = 0;
    canLoadMore = false;
    setList([]);
    setLoader(true);
    debounce(() => getSubscriptionListFromServer(true), 200);
  }, [searchText]);

  const pdfLinkView = link => {
    if (!!link) {
      return (
        <TouchableOpacity
          onPress={() => openUrl(S3_URL + link)}
          hitSlop={{left: 5, top: 5, bottom: 5, right: 5}}
          style={styles.alignStart}>
          <MyText color={colors.primary}>
            {STRINGS.SUBSCRIPTION_LIST.preview}
          </MyText>
        </TouchableOpacity>
      );
    } else return null;
  };

  const listHeaderView = () => {
    return (
      <View style={styles.searchContainer}>
        <MyInputs
          leftIcon={icons.search}
          placeholder={STRINGS.SUBSCRIPTION_LIST.searchPlaceholder}
          rightIcon={() =>
            searchText.length > 0
              ? icons.crosssWithCircle_20(colors.white, 20)
              : icons.noIcon()
          }
          rightIconOnPress={() => setSearchText('')}
          value={searchText}
          onChangeText={text => setSearchText(text)}
          noSpace
        />
      </View>
    );
  };

  const getProduct = item => {
    if (item?.subscription_type === 'quest') {
      return STRINGS.SUBSCRIPTION_LIST.quest(item?.mission_info?.title);
    }
    if (item?.subscription_type === 'mission') {
      return STRINGS.SUBSCRIPTION_LIST.mission(item?.mission_info?.title);
    } else if (!!item?.payment_request_id) {
      return STRINGS.SUBSCRIPTION_LIST.paymentRequest(
        item?.payment_request_id?.request_title,
        item?.payment_request_id?.request_type,
      );
    } else if (!!item?.sale_page) {
      return STRINGS.SUBSCRIPTION_LIST.salePage(
        item?.sale_page?.sale_page_title,
        item?.plan?.plan_title,
      );
    } else if (!!item?.clickfunnel_order_info) {
      return STRINGS.SUBSCRIPTION_LIST.clickFunnels(
        item?.clickfunnel_order_info?.funnel?.name,
      );
    }
  };

  const subscriptionIdView = item => {
    return (
      <>
        {!!item?.stripe_subscription_id ? (
          <TouchableOpacity
            onPress={() =>
              copyText(
                item?.stripe_subscription_id,
                STRINGS.SUBSCRIPTION_LIST.subscriptionIdCopied,
              )
            }>
            <Row>
              {icons.copyOulined(15, colors.primary)}
              <Flex flex={1} ml={5}>
                <MyText
                  style={{textTransform: 'capitalize'}}
                  fontSize={12}
                  type="medium">
                  {item?.stripe_subscription_id}
                </MyText>
              </Flex>
            </Row>
          </TouchableOpacity>
        ) : (
          <MyText style={styles.capitalize} fontSize={12} type="medium">
            {STRINGS.GENERIC.N_A}
          </MyText>
        )}
      </>
    );
  };

  const renderList = ({item, index}) => {
    return (
      <View style={styles.listItemContainer}>
        <View style={styles.listItemHeader}>
          <MyText color={colors.primary}>
            {STRINGS.SUBSCRIPTION_LIST.indexLabel(index)}
          </MyText>
          {!!item?.cancelation_requested && !!item?.subscription_status && (
            <MenuButton
              onPress={() =>
                setOptionModal({isVisible: true, selectedItem: item})
              }
              size={20}
            />
          )}
        </View>
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.product}
          value={getProduct(item)}
        />
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.createdBy}
          value={item?.subscription_created_by}
        />
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.subscriptionMode}
          value={item?.stripe_mode}
        />
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.nextInvoiceDate}
          value={
            !!item?.next_invoice_date
              ? moment(item?.next_invoice_date).format(dateTimeFormat.date)
              : STRINGS.GENERIC.N_A
          }
        />
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.subscriptionDate}
          value={
            !!item?.subscription_date
              ? moment(item?.subscription_date).format(dateTimeFormat.date)
              : STRINGS.GENERIC.N_A
          }
        />
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.subscriptionId}
          view={() => subscriptionIdView(item)}
        />
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.card}
          value={
            !!item?.card_details?.last4
              ? STRINGS.SUBSCRIPTION_LIST.cardNumber(item?.card_details?.last4)
              : STRINGS.GENERIC.N_A
          }
        />
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.status}
          view={() => (
            <DefaultStatusView
              value={item?.subscription_status}
              inactiveText={STRINGS.SUBSCRIPTION_LIST.expired}
            />
          )}
        />
        {/* <StatView title={"Page Title"} value={!!item?.page_info?.sale_page_title ? item?.page_info?.sale_page_title :
          !!item?.plan_info?.plan_title ? item?.plan_info?.plan_title :

            "N/A"} />
        <StatView title={"Plan Title"} value={!!item?.plan_info?.plan_title ? `${item?.plan_info?.plan_title} (${item?.plan_info?.payment_access})` : "N/A"} />
        <StatView title={"Referral User"} value={!!item?.affiliate_info?.affiliate_user_info ? `${item?.affiliate_info?.affiliate_user_info?.first_name} ${item?.affiliate_info?.affiliate_user_info?.last_name}` : "N/A"} />
        <StatView title={"Subscription Date"} value={moment(item?.createdAt).format(dateTimeFormat.date)} />
        <StatView title={"Agreement PDF"} view={() => pdfLinkView(item?.aggrement_pdf_url)} />
        <StatView title={"Register Link"} value={item?.register_url} /> */}
      </View>
    );
  };

  const topView = () => {
    return (
      <View style={styles.topViewContainer}>
        {/* <TitleView title={""} /> */}
        <View style={styles.topViewHeader}>
          {!!member ? (
            <View style={styles.memberInfoContainer}>
              <UserImage
                image={member?.profile_image}
                name={member?.first_name}
                size={30}
              />
              <View style={styles.memberTextContainer}>
                <MyText type="bold" fontSize={12}>
                  {STRINGS.SUBSCRIPTION_LIST.fullName(
                    member?.first_name,
                    member?.last_name,
                  )}
                </MyText>
                <MyText type="medium" color={colors.lightText2} fontSize={10}>
                  {member?.email}
                </MyText>
              </View>
            </View>
          ) : (
            <View style={styles.memberPlaceholder} />
          )}

          <View style={styles.showingTextContainer}>
            <MyText fontSize={10} type="medium" color={colors.lightText2}>
              {STRINGS.SUBSCRIPTION_LIST.showingOfTotal(list.length, total)}
            </MyText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <RootView
      title={STRINGS.SUBSCRIPTION_LIST.title}
      subTitle={
        !!member
          ? `${STRINGS.SUBSCRIPTION_LIST.fullName(
              member?.first_name,
              member?.last_name,
            )} (${member?.email})`
          : ''
      }
      //  titleView={topView}
    >
      <View style={styles.flex1}>
        <View style={styles.flex1}>
          <FlatList
            refreshControl={
              <MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={list}
            renderItem={renderList}
            ListEmptyComponent={!loader && <EmptyView />}
            // stickyHeaderHiddenOnScroll={true}
            // stickyHeaderIndices={[0]}
            // ListHeaderComponent={listHeaderView()}
            onEndReached={() => {
              if (canLoadMore) {
                canLoadMore = false;
                setFooterLoader(true);
                getSubscriptionListFromServer(false);
              }
            }}
            ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          />
        </View>
        <MyLoader enable={loader} />

        <OptionModal
          isVisible={optionModal.isVisible}
          closeModal={() =>
            setOptionModal({isVisible: false, selectedItem: null})
          }
          onSelected={onSelectedOpt}
          optionList={optionsList}
        />

        <InfoModal ref={infoRef} />
        <ConfirmationModal
          title={STRINGS.SUBSCRIPTION_LIST.deleteConfirmation}
          closeModal={() =>
            setConfirmationModal({
              isVisible: false,
              selectedItem: null,
              opt: '',
            })
          }
          isVisible={confirmationModal.isVisible}
          onAgree={onAgreePress}
        />
      </View>
    </RootView>
  );
};

export default SubscriptionsList;

const optionsList = [
  // {
  //   title: "Edit",
  //   key: "edit",
  //   icon: icons.edit
  // },
  {
    title: STRINGS.SUBSCRIPTION_LIST.viewCancelationRequest,
    key: 'view_cancel_request',
    icon: icons.eye,
  },
];

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  alignStart: {
    alignSelf: 'flex-start',
  },
  searchContainer: {
    marginTop: -10,
    backgroundColor: colors.darkSecondary,
  },
  listItemContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  listItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  topViewContainer: {
    backgroundColor: colors.darkSecondary,
    paddingRight: 10,
  },
  topViewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  memberInfoContainer: {
    flex: 1,
    marginLeft: 5,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  memberPlaceholder: {
    flex: 1,
    height: 35,
  },
  showingTextContainer: {
    marginTop: -2,
    paddingBottom: 5,
  },
});
