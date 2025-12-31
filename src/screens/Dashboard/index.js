import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import MyLoader from '../../components/MyLoader';
import {DASHBAORD} from '../../DAL';
import {selectUser} from '../../redux/reducers/userSlice';
import {useSelector} from 'react-redux';
import {STRINGS} from '../../utilities/strings';
import CounterBox from './CounterBox';
import {colors} from '../../utilities/colors';
import UserImage from '../../components/UserImage';
import moment from 'moment';
import EmptyView from '../../components/EmptyView';
import {icons} from '../../utilities/icons';
import routes from '../../navigation/routes';
import {selectSettings} from '../../redux/reducers/settingSlice';
import MyWebview from '../../components/MyWebview';
import utilities from '../../utilities';
import {dateTimeFormat} from '../../utilities/constants';
import ResponsiveImage2 from '../../components/ResponsiveImage2';
import {selectTimeZone} from '../../redux/reducers/timezoneSlice';
import MyChip from '../../components/MyChip';
import Tabs from '../../components/Tabs';
import prependCurency from '../../functions/prependCurency';
import {TransparentButton} from '../../components/MyButton';
import MemberView from '../../components/MemberView';
import StatView from '../../components/StatView';
import {Flex} from '../../UIComponents/FlexViews';

const Dasboard = ({navigation}) => {
  const {token, S3_URL} = useSelector(selectUser);
  const {settings} = useSelector(selectSettings);
  const timezone = useSelector(selectTimeZone);
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [filter, setFilter] = useState({});
  const [bookingTab, setBookingTab] = useState(0);

  const getDashboarddata = async () => {
    let res = await DASHBAORD({
      navigation,
      token,
      body: filter,
      filter: Object.keys(filter).length > 0,
    });
    if (res.code == 200) {
      setData(res);
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  const changeTab = stackName => {
    navigation.jumpTo(stackName);
  };

  const onAnswerScreen = item => {
    // return
    navigation.navigate(routes?.genericQestionListing, {
      created_for: item?.created_for,
      id: item?.created_for_id,
      memberId: item?.member_id,
    });
  };

  useEffect(() => {
    if (!loader) {
      setData(null);
      setLoader(true);
    }
    getDashboarddata();
  }, [JSON.stringify(filter)]);

  const filterTheData = obj => {
    setFilter(obj);
  };

  const onFilterScreen = () => {
    navigation.navigate(routes.missionControlfilterScreen, {
      filterTheData,
      filter,
    });
  };

  //? //////// Views

  const view_commissionCounters = () => {
    // return null;
    return (
      <View style={{marginTop: 10}}>
        {!!settings?.brand_logo_2 && (
          <View style={{alignItems: 'center'}}>
            <ResponsiveImage2
              width={utilities.screenWidth() * 0.6}
              uri={S3_URL + settings?.brand_logo_2}
            />
          </View>
        )}

        {!!settings?.dashboard_content && (
          <View style={{marginTop: 10}}>
            <MyWebview fullWidth={true} html={settings?.dashboard_content} />
          </View>
        )}

        <View style={{marginBottom: 5, marginTop: 15}}>{topView()}</View>
        <View style={styles.countersView}>
          <CounterBox
            color={'#283C35'}
            count={data?.today_commission}
            subTitle={STRINGS.DASHBOARD.todayCommission}
          />

          <CounterBox
            count={data?.remaining_commission}
            subTitle={STRINGS.DASHBOARD.pendingCommission}
            color={'#1F2D4C'}
          />
        </View>
        <View style={styles.countersView}>
          <CounterBox
            count={data?.paid_commission}
            subTitle={STRINGS.DASHBOARD.totalPaidCommission}
            color={'#3B3834'}
          />

          <CounterBox
            count={data?.total_commission}
            subTitle={STRINGS.DASHBOARD.totalCommissionAttracted}
            color={'#3A2737'}
          />
        </View>

        <Tabs
          changeTab={index => setBookingTab(index)}
          list={tabs}
          tab={bookingTab}
        />
        {/* <View style={__style.tabsView}>
          <TouchableOpacity
            onPress={() => setBookingTab(1)}
            style={[__style.tabView, bookingTab == 1 && __style.tabSelectedView]}>
            <MyText fontSize={18} color={bookingTab == 1 ? colors.primary : undefined} type={bookingTab == 1 ? "medium" : undefined}>
              Latest Bookings
            </MyText>
            <View style={[__style.selectline, { backgroundColor: bookingTab == 1 ? colors.primary : colors.transparent }]} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setBookingTab(2)}
            style={[__style.tabView, bookingTab == 2 && __style.tabSelectedView]}>
            <MyText fontSize={18} color={bookingTab == 2 ? colors.primary : undefined} type={bookingTab == 2 ? "medium" : undefined} >
              Upcoming Bookings
            </MyText>
            <View style={[__style.selectline, { backgroundColor: bookingTab == 2 ? colors.primary : colors.transparent }]} />
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };

  const bookingView = ({item, index}) => {
    if (bookingTab == 3) {
      return (
        <View style={[styles.bookingItem, index != 0 && styles.marginTop10]}>
          <Pressable
            onPress={() => onAnswerScreen(item)}
            style={styles.rowAlignCenter}>
            {/* <View style={{ marginTop: 8 }}>
              <MyText>{index + 1}.</MyText>
            </View> */}
            <View style={styles.flex1}>
              <MemberView member={item} />
            </View>

            <View>{icons.nextArrow(colors.white, 20)}</View>
          </Pressable>
          <StatView
            title={STRINGS.DASHBOARD.moduleTitle}
            value={
              !!item?.title
                ? item?.title
                : item.created_for.replace(/[_-]/g, ' ')
            }
          />
          <StatView
            title={STRINGS.DASHBOARD.answeredDate}
            value={moment(item?.reply_date).format(dateTimeFormat.date)}
          />
          {/* <UserImage
              image={item?.member_info?.profile_image}
              name={item?.member_info?.first_name}
              size={30}
            /> */}
          {/* <View style={__style.nameAndAmountView}>
              <MyText fontSize={14} type='medium' >{item?.member_info?.first_name + " " + item?.member_info?.last_name}</MyText>
              <MyText fontSize={14} type='medium'>{prependCurency(item?.currency) + " " + item?.amount}</MyText>
            </View> */}
        </View>
      );
    } else if (bookingTab == 2) {
      return (
        <View style={[styles.bookingItem, index != 0 && styles.marginTop10]}>
          <View style={styles.rowAlignCenter}>
            <UserImage
              image={item?.member_info?.profile_image}
              name={item?.member_info?.first_name}
              size={30}
            />
            <View style={styles.nameAndAmountView}>
              <MyText fontSize={14} type="medium">
                {item?.member_info?.first_name +
                  ' ' +
                  item?.member_info?.last_name}
              </MyText>
              <MyText fontSize={14} type="medium">
                {prependCurency(item?.currency) + ' ' + item?.amount}
              </MyText>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.bookingItem, index != 0 && styles.marginTop10]}>
          <View style={styles.rowAlignCenter}>
            <UserImage
              image={item?.user_info?.profile_image}
              name={item?.user_info?.first_name}
              size={30}
            />
            <View style={styles.marginLeft10}>
              <MyText fontSize={14} type="medium">
                {item?.user_info?.first_name + ' ' + item?.user_info?.last_name}
              </MyText>
              <MyText fontSize={12} type="light">
                {item?.user_info?.email}
              </MyText>
            </View>
          </View>
          {itemView(STRINGS.DASHBOARD.bookingPage, item?.page?.sale_page_title)}
          {itemView(
            STRINGS.DASHBOARD.date,
            moment(item?.start_date_time).format(dateTimeFormat.date) +
              ' (' +
              moment(item?.time, dateTimeFormat.time).format(
                dateTimeFormat.time,
              ) +
              ' - ' +
              moment(item?.time, dateTimeFormat.time)
                .add({minutes: item?.slot_duration})
                .format(dateTimeFormat.time) +
              ')',
          )}
          {itemView(
            STRINGS.DASHBOARD.bookingStatus,
            item?.booking_status_info?.title,
            item?.booking_status_info?.background_color,
          )}
        </View>
      );
    }
  };

  const itemView = (title, value, color = null) => {
    return (
      <View style={styles.itemViewContainer}>
        <View style={styles.itemViewTitle}>
          <MyText fontSize={12} color={colors.lightText2}>
            {title}
          </MyText>
        </View>
        <View style={styles.flex1}>
          <MyText
            fontSize={12}
            type="medium"
            color={!!color ? color : undefined}>
            {value}
          </MyText>
        </View>
      </View>
    );
  };

  const sectionHeader = ({section: {title}}) => {
    return (
      <View style={styles.marginVertical10}>
        <MyText color={colors.primary} fontSize={18} type="medium">
          {title}
        </MyText>
      </View>
    );
  };

  const sectionEmpty = () => {
    if (!loader) {
      return (
        <View style={styles.marginVertical10}>
          <EmptyView label={STRINGS.DASHBOARD.noDataExist} />
        </View>
      );
    } else return null;
  };

  const sectionFooter = () => {
    if (!loader && (bookingTab == 2 || bookingTab == 3)) {
      return (
        <View style={styles.sectionFooterContainer}>
          <TransparentButton
            onPress={() =>
              changeTab(
                bookingTab == 2
                  ? routes.commissionNavigator
                  : routes?.membersAnswersNavigator,
              )
            }
            title={STRINGS.DASHBOARD.viewAll}
          />
        </View>
      );
    } else return null;
  };

  const topView = () => {
    return (
      <View style={styles.topView}>
        {!!filter?.start_date && filter?.end_date ? (
          <MyChip
            onPress={() => filterTheData({})}
            title={`${moment(filter?.start_date, dateTimeFormat.date2).format(
              dateTimeFormat.date,
            )} to ${moment(filter?.end_date, dateTimeFormat.date2).format(
              dateTimeFormat.date,
            )}`}
          />
        ) : (
          <View />
        )}

        <TouchableOpacity
          onPress={onFilterScreen}
          style={styles.filterButton}
          hitSlop={{bottom: 5, top: 5, left: 5, right: 5}}>
          {icons.filterCircle(colors.primary, 30)}
          {/* <MyText color={colors.primary} style={{ marginLeft: 5 }} >Filter</MyText> */}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <RootView hideSubHeader>
      <Flex flex={1}>
        <FlatList
          contentContainerStyle={styles.flatListContent}
          data={
            !!data
              ? bookingTab == 0
                ? data?.latest_booking_list
                : bookingTab == 1
                ? data?.upcomming_booking_list
                : bookingTab == 2
                ? data?.transaction.slice().reverse()
                : bookingTab == 3
                ? data?.member_answer_list
                : []
              : []
          }
          ListHeaderComponent={!!data && view_commissionCounters()}
          renderItem={bookingView}
          // renderSectionHeader={sectionHeader}
          ListEmptyComponent={sectionEmpty}
          ListFooterComponent={sectionFooter()}
          showsVerticalScrollIndicator={false}
        />
      </Flex>
      <MyLoader enable={loader} />
    </RootView>
  );
};

export default Dasboard;

const tabs = [
  {
    title: STRINGS.DASHBOARD.latestBooking,
    index: 0,
    key: 'latest_booking_list',
  },
  {
    title: STRINGS.DASHBOARD.upcomingBooking,
    index: 1,
    key: 'upcoming_booking_list',
  },
  {
    title: STRINGS.DASHBOARD.latestTransactions,
    index: 2,
    key: 'latest_transactions',
  },
  {
    title: STRINGS.DASHBOARD.latestMemberAnswers,
    index: 3,
    key: 'member_answers',
  },
];

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    justifyContent: 'center',
    padding: 5,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  countersView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterButton: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  topView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabsView: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 5,
    height: 45,
    borderRadius: 10,
    marginTop: 10,
  },
  nameAndAmountView: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabSelectedView: {},
  tabView: {
    borderRadius: 5,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
  },
  selectline: {
    height: 2,
    width: '100%',
    borderRadius: 20,
    marginTop: 3,
  },
  bookingItem: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
  },
  marginTop10: {
    marginTop: 10,
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  marginLeft10: {
    marginLeft: 10,
  },
  itemViewContainer: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1 / 3,
    borderBottomColor: colors.lightText,
    paddingBottom: 5,
  },
  itemViewTitle: {
    flex: 0.7,
  },
  marginVertical10: {
    marginVertical: 10,
  },
  sectionFooterContainer: {
    marginVertical: 10,
    alignItems: 'flex-end',
  },
  flatListContent: {
    paddingBottom: 50,
  },
});
