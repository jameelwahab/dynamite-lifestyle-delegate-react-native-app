import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import MyLoader from '../../../components/MyLoader';
import {
  MEMBER_DELETE_SUBSCRIPTION,
  MEMBER_SUBSCRIPTION_LIST,
} from '../../../DAL';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import StatView from '../Components/StatView';
import EmptyView from '../../../components/EmptyView';
import moment from 'moment';
import {dateTimeFormat} from '../../../utilities/constants';
import OptionModal from '../../../components/OptionModal';
import {icons} from '../../../utilities/icons';
import ConfirmationModal from '../../../components/ConfirmationModal';
import showToast from '../../../functions/showToast';
import openUrl from '../../../functions/openUrl';
import FooterLoader from '../../../components/FooterLoader';
import MyInputs from '../../../components/MyInputs';
import debounce from '../../../functions/debounce';
import UserImage from '../../../components/UserImage';
import {Flex} from '../../../UIComponents/FlexViews';
import {MenuButton} from '../../../components/MyButton';

let page = 0;
let canLoadMore = false;
const SubscriptionList = ({navigation, route}) => {
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
    });
    if (res.code == 200) {
      let listLength = firstTime
        ? 0 + res.event_subscriber.length
        : list.length + res.event_subscriber.length;
      if (res?.total_count > listLength) {
        page = page + 1;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setList(
        firstTime ? res.event_subscriber : [...list, ...res.event_subscriber],
      );
      setTotal(res?.total_count);
      setMember(res?.member);
      setLoader(false);
      setFooterLoader(false);
    } else {
      setLoader(false);
      setFooterLoader(false);
    }
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
          hitSlop={styles.hitSlop}
          style={styles.previewButton}>
          <MyText color={colors.primary}>
            {STRINGS.SUBSCRIPTION_LIST.preview}
          </MyText>
        </TouchableOpacity>
      );
    } else return null;
  };

  const listHeaderView = () => {
    return (
      <View style={styles.listHeaderContainer}>
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

  const renderList = ({item, index}) => {
    return (
      <View style={styles.listItemContainer}>
        <View style={styles.rowSpaceBetween}>
          <MyText color={colors.primary}>
            {STRINGS.SUBSCRIPTION_LIST.indexLabel(index)}
          </MyText>
          {/* <MenuButton
            onPress={() =>
              setOptionModal({isVisible: true, selectedItem: item})
            }
            size={20}
          /> */}
        </View>
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.pageTitle}
          value={
            !!item?.page_info?.sale_page_title
              ? item?.page_info?.sale_page_title
              : !!item?.module_info?.title
              ? item?.module_info?.title
              : STRINGS.SUBSCRIPTION_LIST.na
          }
        />
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.planTitle}
          value={
            !!item?.plan_info?.plan_title
              ? STRINGS.SUBSCRIPTION_LIST.planTitleFormat(
                  item?.plan_info?.plan_title,
                  item?.plan_info?.payment_access,
                  item?.plan_info?.payment_access == 'recursion',
                )
              : STRINGS.SUBSCRIPTION_LIST.na
          }
        />
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.referralUser}
          value={
            !!item?.affiliate_info?.affiliate_user_info
              ? STRINGS.SUBSCRIPTION_LIST.fullName(
                  item?.affiliate_info?.affiliate_user_info?.first_name,
                  item?.affiliate_info?.affiliate_user_info?.last_name,
                )
              : STRINGS.SUBSCRIPTION_LIST.na
          }
        />
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.subscriptionDate}
          value={moment(item?.createdAt).format(dateTimeFormat.date)}
        />
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.agreementPDF}
          view={() => pdfLinkView(item?.aggrement_pdf_url)}
        />
        <StatView
          title={STRINGS.SUBSCRIPTION_LIST.registerLink}
          value={item?.register_url}
        />
      </View>
    );
  };

  const topView = () => {
    return (
      <View style={styles.topViewContainer}>
        {/* <TitleView title={''} /> */}
        <View style={styles.topViewRow}>
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

          <View style={styles.countContainer}>
            <MyText fontSize={10} type="medium" color={colors.lightText2}>
              {STRINGS.SUBSCRIPTION_LIST.showingOfTotal(list.length, total)}
            </MyText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <RootView titleView={topView}>
      <Flex flex={1}>
        <Flex flex={1}>
          <FlatList
            data={list}
            renderItem={renderList}
            ListEmptyComponent={!loader && <EmptyView />}
            stickyHeaderHiddenOnScroll={true}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={listHeaderView()}
            onEndReached={() => {
              if (canLoadMore) {
                canLoadMore = false;
                setFooterLoader(true);
                getSubscriptionListFromServer(false);
              }
            }}
            ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          />
        </Flex>
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
      </Flex>
    </RootView>
  );
};

export default SubscriptionList;

const optionsList = [
  // {
  //   title: "Edit",
  //   key: "edit",
  //   icon: icons.edit
  // },
  {
    title: STRINGS.SUBSCRIPTION_LIST.delete,
    key: 'delete',
    icon: icons.trash,
  },
];

const styles = StyleSheet.create({
  listHeaderContainer: {
    marginTop: -10,
    backgroundColor: colors.darkSecondary,
  },
  hitSlop: {
    left: 5,
    top: 5,
    bottom: 5,
    right: 5,
  },
  previewButton: {
    alignSelf: 'flex-start',
  },
  listItemContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topViewContainer: {
    backgroundColor: colors.darkSecondary,
    paddingRight: 10,
  },
  topViewRow: {
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
  countContainer: {
    marginTop: -2,
    paddingBottom: 5,
  },
});
