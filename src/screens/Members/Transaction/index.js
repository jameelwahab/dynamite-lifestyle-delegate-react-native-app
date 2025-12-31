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
import OptionModal from '../../../components/OptionModal';
import {icons} from '../../../utilities/icons';
import ConfirmationModal from '../../../components/ConfirmationModal';
import showToast from '../../../functions/showToast';
import openUrl from '../../../functions/openUrl';
import FooterLoader from '../../../components/FooterLoader';
import MyInputs from '../../../components/MyInputs';
import debounce from '../../../functions/debounce';
import UserImage from '../../../components/UserImage';
import removeUnderscore from '../../../functions/removeUnderscore';
import {PaymentIdView} from './PaymentIdView';
import {ReferralUserView} from './ReferralUserView';
import {OtherInformationView} from './OtherInformationView';
import {DiscountInformationView} from './DiscountInformationView';
import {TicketCountView} from './TicketCountView';
import {TransactionTypeView} from './TransactionTypeView';
import MyRefreshControl from '../../../components/MyRefreshControl';
import prependCurency from '../../../functions/prependCurency';
import {dateTimeFormat} from '../../../utilities/constants';

let page = 0;
let canLoadMore = false;

const Transaction = ({navigation, route}) => {
  const {memberId} = route?.params;
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
    if (opt.key == 'delete') {
      setTimeout(() => {
        setConfirmationModal({
          isVisible: true,
          selectedItem: selectedItem,
          opt: opt.key,
        });
      }, 400);
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
      type: 'transaction_list',
    });
    if (res.code == 200) {
      let listLength = firstTime
        ? 0 + res.transaction_list.length
        : list.length + res.transaction_list.length;
      if (res?.total_count > listLength) {
        page = page + 1;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setList(
        firstTime ? res.transaction_list : [...list, ...res.transaction_list],
      );
      setTotal(res?.total_count || res.transaction_list.length);
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
          <MyText color={colors.primary}>{STRINGS.TRANSACTION.preview}</MyText>
        </TouchableOpacity>
      );
    } else return null;
  };

  const listHeaderView = () => {
    return (
      <View style={styles.searchContainer}>
        <MyInputs
          leftIcon={icons.search}
          placeholder={STRINGS.TRANSACTION.searchPlaceholder}
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

  const renderList = ({item, index}) => {
    return (
      <View style={styles.listItemContainer}>
        <View style={styles.listItemHeader}>
          <MyText color={colors.primary}>
            {STRINGS.TRANSACTION.indexLabel(index)}
          </MyText>
          {/* <MenuButton
            onPress={() => setOptionModal({ isVisible: true, selectedItem: item })}
            size={20} /> */}
        </View>
        <StatView
          title={STRINGS.TRANSACTION.transactionType}
          view={() => <TransactionTypeView item={item} />}
        />
        <StatView
          title={STRINGS.TRANSACTION.paymentMadeBy}
          view={() => <PaymentIdView item={item} />}
        />
        <StatView
          title={STRINGS.TRANSACTION.amount}
          value={prependCurency(item?.currency) + ' ' + (item?.amount || '0')}
        />
        <StatView
          title={STRINGS.TRANSACTION.teamDiego}
          value={
            prependCurency(item?.currency) +
            ' ' +
            (item?.dynamite_commission || '0')
          }
        />
        <StatView
          title={STRINGS.TRANSACTION.referralCommission}
          value={
            prependCurency(item?.currency) +
            ' ' +
            (item?.referral_commission || '0')
          }
        />
        <StatView
          title={STRINGS.TRANSACTION.referralUser}
          view={() => <ReferralUserView affiliate={item?.affiliate_info} />}
        />
        <StatView
          title={STRINGS.TRANSACTION.transactionReferralCommission}
          value={
            prependCurency(item?.currency) +
            ' ' +
            (item?.transaction_referral_commission || '0')
          }
        />
        <StatView
          title={STRINGS.TRANSACTION.transactionReferral}
          view={() => (
            <ReferralUserView
              affiliate={item?.transaction_referral_info}
              defaultRefferal={STRINGS.GENERIC.N_A}
            />
          )}
        />
        <StatView
          title={STRINGS.TRANSACTION.transactionDate}
          value={
            !!item?.transaction_date
              ? moment(item?.transaction_date).format(dateTimeFormat.date)
              : ''
          }
        />
        <StatView
          title={STRINGS.TRANSACTION.totalTickets}
          view={() => <TicketCountView item={item} navigation={navigation} />}
        />
        <StatView
          title={STRINGS.TRANSACTION.agreementPDF}
          view={() => pdfLinkView(item?.agrement_pdf_url)}
        />
        <StatView
          title={STRINGS.TRANSACTION.createdBy}
          value={STRINGS.TRANSACTION.createdByFormat(
            removeUnderscore(item?.created_by),
            item?.payment_made_by_platform
              ? removeUnderscore(item?.payment_made_by_platform)
              : '',
          )}
        />
        <StatView
          title={STRINGS.TRANSACTION.otherInformation}
          view={() => <OtherInformationView row={item} />}
        />
        <StatView
          title={STRINGS.TRANSACTION.discountInformation}
          view={() => <DiscountInformationView item={item} />}
        />
        <StatView
          title={STRINGS.TRANSACTION.transactionMode}
          value={item?.transaction_mode}
        />
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
                  {STRINGS.TRANSACTION.fullName(
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

          {/* <View style={{ marginTop: -2, paddingBottom: 5 }}>
            <MyText fontSize={10} type='medium' color={colors.lightText2}>{`Showing ${list.length} of ${total}`}</MyText>
          </View> */}
        </View>
      </View>
    );
  };

  return (
    <RootView
      // titleView={topView}
      title={STRINGS.TRANSACTION.title}
      subTitle={
        !!member
          ? `${STRINGS.TRANSACTION.fullName(
              member?.first_name,
              member?.last_name,
            )} (${member?.email})`
          : ''
      }>
      {/* {topView()} */}
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
        <ConfirmationModal
          title={STRINGS.TRANSACTION.deleteConfirmation}
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

export default Transaction;

const optionsList = [
  // {
  //   title: "Edit",
  //   key: "edit",
  //   icon: icons.edit
  // },
  {
    title: STRINGS.TRANSACTION.delete,
    key: 'delete',
    icon: icons.trash,
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
});
