import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import {useSelector} from 'react-redux';
import {selectNavbar} from '../../../redux/reducers/navbarSlice';
import {selectUser} from '../../../redux/reducers/userSlice';
import {BOOKING_DELETE, GET_BOOKINGS_LIST} from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import {colors} from '../../../utilities/colors';
import MemberView from '../../../components/MemberView';
import {MenuButton} from '../../../components/MyButton';
import StatView from '../../Members/Components/StatView';
import moment from 'moment';
import {dateTimeFormat} from '../../../utilities/constants';
import FooterLoader from '../../../components/FooterLoader';
import EmptyView from '../../../components/EmptyView';
import MyRefreshControl from '../../../components/MyRefreshControl';
import FAB from '../../../components/FAB';
import routes from '../../../navigation/routes';
import TitleView from '../../../components/TitleView';
import {icons} from '../../../utilities/icons';
import MyChip from '../../../components/MyChip';
import SearchView from '../../../components/SearchView';
import OptionModal from '../../../components/OptionModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import ChangeStatusModal from './Component/ChangeStatusModal';
import {STRINGS} from '../../../utilities/strings';
import {Flex} from '../../../UIComponents/FlexViews';

let page = 0;
let canLoadMore = false;
const Bookings = ({navigation, route}) => {
  const ref_changeStatusModal = useRef();
  const {parentValue, value} = route.params;
  const {navbar} = useSelector(selectNavbar);
  const {token} = useSelector(selectUser);
  const [title] = useState(
    navbar
      ?.find(x => x.value == parentValue)
      ?.child_options?.find(y => y.value == value)?.title,
  );
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchLoader, setSearchLoader] = useState(false);
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    item: null,
    list: [],
  });
  const [confirmModal, setConfirmModal] = useState({
    isVisible: false,
    item: null,
  });
  const [filters, setFilters] = useState({
    booking_status: null,
    end_date: null,
    filter_by_dates: false,
    sale_page: [],
    search_text: '',
    sort_by: '',
    start_date: null,
  });

  useEffect(() => {
    callAPi();
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    if (route?.params?.filters) {
      setFilters(route?.params?.filters);
    } else if (route?.params?.callList) {
      callAPi();
    }
  }, [route]);

  const onSelected = opt => {
    let {item} = optionModal;
    setOptionModal({isVisible: false, item: null, list: []});
    if (opt.key == 'delete') {
      setTimeout(() => {
        setConfirmModal({isVisible: true, item: item});
      }, 500);
    } else if (opt.key == 'detail') {
      navigation.navigate(routes.genericQestionListing, {
        created_for: 'page',
        id: item?.page?._id,
        memberId: item?.user_info?._id,
      });
    } else if (opt.key == 'status') {
      setTimeout(() => {
        ref_changeStatusModal?.current?.openModal(item);
      }, 500);
    } else if (opt.key == 'notes') {
      navigation.navigate(routes.bookingNotesList, {
        bookingId: item?._id,
        userInfo: item?.user_info,
      });
    } else if (opt.key == 'edit') {
      navigation.navigate(routes.bookingAdd, {
        editableItem: item,
        type: 'edit',
      });
    } else if (opt.key == 'pass') {
      navigation.navigate(routes.bookingAdd, {
        editableItem: item,
        type: 'pass',
      });
    }
  };

  const openOptions = item => {
    let opt = [...optionsList];
    let status = item?.booking_status_info?.title.toLowerCase();
    if (status != 'complete' && status != 'cancel') {
      let date = moment(item.date).format(dateTimeFormat.date);
      let bookingTime = moment(
        date + ' ' + item?.time,
        dateTimeFormat.dateTime,
      );
      let diff = moment(bookingTime).diff(moment(), 'hours');
      if (diff > 1) {
        opt = [...optionsList, ...extraOptions];
      }
    }
    setOptionModal({isVisible: true, item: item, list: opt});
  };

  const onConfirmPress = opt => {
    let {item} = confirmModal;
    setConfirmModal({isVisible: false, item: null});
    deleteBookingFromServer(item?._id);
  };

  const onAddScreen = () => {
    navigation.navigate(routes.bookingAdd, {
      editableItem: undefined,
      type: 'add',
    });
  };

  const onFilterScreen = () => {
    navigation.navigate(routes.bookingFilter, {
      filters,
    });
  };

  const onSearchPress = () => {
    canLoadMore = false;
    page = 0;
    setSearchLoader(true);
    getBookingsFromServer(true);
  };

  const clearSalePage = index => {
    filters.sale_page.splice(index, 1);
    setFilters({...filters});
  };

  const clearFilter = () => {
    setSearchText('');
    setFilters({
      booking_status: null,
      end_date: null,
      filter_by_dates: false,
      sale_page: [],
      search_text: '',
      sort_by: '',
      start_date: null,
    });
  };

  const isFilterApplied = () => {
    return (
      filters.sale_page.length > 0 ||
      !!filters?.booking_status ||
      !!filters?.booking_status ||
      (filters?.filter_by_dates &&
        (!!filters?.start_date || !!filters?.end_date)) ||
      !!filters?.sort_by
    );
  };

  const callAPi = () => {
    canLoadMore = false;
    page = 0;
    setList([]);
    setLoader(true);
    getBookingsFromServer(true);
  };

  const loadMore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      getBookingsFromServer();
    }
  };

  const onRefresh = () => {
    page = 0;
    canLoadMore = false;
    setRefreshing(true);
    getBookingsFromServer(true);
  };

  const getBookingsFromServer = async (newArray = false) => {
    let filterObj = {
      booking_status: !!filters?.booking_status
        ? filters?.booking_status?._id
        : null,
      end_date: !!filters?.end_date
        ? moment(filters?.end_date).format(STRINGS.DATE_FORMATES.YYYY_MM_DD)
        : null,
      filter_by_dates: filters?.filter_by_dates,
      sale_page: filters?.sale_page.map(x => x?._id),
      search_text: searchText.trim(),
      sort_by: !!filters?.sort_by ? filters?.sort_by?.key : '',
      start_date: !!filters?.start_date
        ? moment(filters?.start_date).format(STRINGS.DATE_FORMATES.YYYY_MM_DD)
        : null,
    };

    let res = await GET_BOOKINGS_LIST({
      navigation,
      token,
      page,
      filters: filterObj,
    });
    if (res.code == 200) {
      let length = newArray
        ? res?.bookings.length
        : list.length + res?.bookings.length;
      if (length < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setTotal(res?.total_count);
      setList(newArray ? res?.bookings : [...list, ...res?.bookings]);
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
      setSearchLoader(false);
    } else {
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
      setSearchLoader(false);
    }
  };

  const deleteBookingFromServer = async id => {
    setLoader(true);
    let res = await BOOKING_DELETE({navigation, token, id});
    if (res.code == 200) {
      let nlist = list.slice().filter(x => x._id != id);
      setList([...nlist]);
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  const statusView = info => {
    return (
      <View
        style={[styles.statusView, {backgroundColor: info?.background_color}]}>
        <MyText color={info?.text_color} fontSize={14} type="medium">
          {info?.title}
        </MyText>
      </View>
    );
  };

  const renderBookings = ({item, index}) => {
    return (
      <View style={styles.itemView}>
        <View style={styles.headerView}>
          <MemberView
            member={item?.user_info}
            marginLeft={0}
            size={35}
            titleSize={14}
          />
          <MenuButton onPress={() => openOptions(item, index)} />
        </View>
        <View>
          <StatView
            title={STRINGS.BOOKINGS.bookingPage}
            value={
              !!item?.page?.sale_page_title
                ? item?.page?.sale_page_title
                : STRINGS.GENERIC.N_A
            }
          />
          <StatView
            title={STRINGS.BOOKINGS.date}
            value={`${moment(item?.date).format(dateTimeFormat.date)} (${moment(
              item?.time,
              STRINGS.DATE_FORMATES.HH_MM_A,
            ).format(dateTimeFormat.time)} - ${moment(
              item?.time,
              STRINGS.DATE_FORMATES.HH_MM_A,
            )
              .add({minutes: Number(item?.slot_duration)})
              .format(dateTimeFormat.time)})`}
            uppercase
          />
          <StatView
            title={STRINGS.BOOKINGS.memberNuture}
            value={
              !!item?.nurture?.first_name
                ? item?.nurture?.first_name + ' ' + item?.nurture?.last_name
                : STRINGS.GENERIC.N_A
            }
          />
          <StatView
            title={STRINGS.BOOKINGS.bookingStatus}
            view={() => statusView(item?.booking_status_info)}
          />
        </View>
      </View>
    );
  };

  const topView = () => {
    return (
      <View>
        <View style={styles.topView}>
          <TitleView
            title={title}
            hideBackBottomButton
            subTitle={`${STRINGS.BOOKINGS.showing} ${list.length} ${STRINGS.BOOKINGS.of} ${total}`}
          />
          <View style={styles.topBtnsView}>
            <TouchableOpacity onPress={onFilterScreen}>
              {icons.filterCircle(colors.primary, 25)}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const headerView = () => {
    return (
      <View style={styles.headerContainer}>
        {isFilterApplied() && (
          <View style={styles.filterChipsContainer}>
            {!!filters?.booking_status && (
              <MyChip
                title={filters?.booking_status?.title}
                onPress={() => setFilters({...filters, booking_status: null})}
              />
            )}

            {!!filters?.sale_page &&
              filters?.sale_page.map((x, i) => (
                <MyChip
                  title={x?.sale_page_title}
                  onPress={() => clearSalePage(i)}
                />
              ))}

            {!!filters?.sort_by && (
              <MyChip
                title={filters?.sort_by?.sort_title}
                onPress={() => setFilters({...filters, sort_by: null})}
              />
            )}

            {!!filters?.filter_by_dates &&
              (!!filters?.start_date || !!filters?.end_date) && (
                <MyChip
                  title={`${
                    !!filters?.start_date
                      ? STRINGS.BOOKINGS.startDate +
                        moment(filters?.start_date).format(dateTimeFormat?.date)
                      : ''
                  }${
                    !!filters?.end_date
                      ? STRINGS.BOOKINGS.endDate +
                        moment(filters?.end_date).format(dateTimeFormat?.date)
                      : ''
                  }`}
                  onPress={() =>
                    setFilters({
                      ...filters,
                      filter_by_dates: false,
                      start_date: null,
                      end_date: null,
                    })
                  }
                />
              )}

            <TouchableOpacity
              onPress={clearFilter}
              style={styles.clearFilterButton}>
              <MyText color={colors.delete}>
                {STRINGS.BOOKINGS.clearFilter}
              </MyText>
            </TouchableOpacity>
          </View>
        )}

        <SearchView
          onChangeText={text => setSearchText(text)}
          onSearchPress={onSearchPress}
          loader={searchLoader}
          search={searchText}
        />
      </View>
    );
  };

  return (
    <RootView hideSubHeader>
      {topView()}
      <Flex flex={1}>
        <FlatList
          keyExtractor={item => item?._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          ListHeaderComponent={headerView()}
          data={list}
          renderItem={renderBookings}
          onEndReached={loadMore}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          ListEmptyComponent={
            !loader &&
            !refreshing && (
              <EmptyView label={STRINGS.BOOKINGS.noPaymentRequestsFound} />
            )
          }
          refreshControl={
            <MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </Flex>
      <FAB onPress={onAddScreen} />
      <MyLoader enable={loader} />

      <OptionModal
        isVisible={optionModal?.isVisible}
        onSelected={onSelected}
        optionList={optionModal?.list}
        closeModal={() =>
          setOptionModal({isVisible: false, item: null, list: []})
        }
      />

      <ConfirmationModal
        isVisible={confirmModal?.isVisible}
        closeModal={() => setConfirmModal({isVisible: false, item: null})}
        onAgree={onConfirmPress}
        title={STRINGS.BOOKINGS.deleteConfirmation}
      />

      <ChangeStatusModal
        ref={ref_changeStatusModal}
        navigation={navigation}
        token={token}
        onStatusChange={item =>
          setList(list => {
            let index = list.findIndex(x => x._id === item._id);
            if (index > -1) {
              list.splice(index, 1, {
                ...list[index],
                booking_status_info: item?.booking_status_info,
              });
            }
            return [...list];
          })
        }
      />
    </RootView>
  );
};

export default Bookings;
const optionsList = [
  {
    title: STRINGS.BOOKINGS.questionAnswersDetail,
    key: 'detail',
    icon: icons.threeLinesMenu,
  },
  {
    title: STRINGS.BOOKINGS.bookingNotes,
    key: 'notes',
    icon: icons.notes,
  },
  {
    title: STRINGS.BOOKINGS.delete,
    key: 'delete',
    icon: icons.trash,
  },
  {
    title: STRINGS.BOOKINGS.changeStatus,
    key: 'status',
    icon: icons.edit,
  },
];

const extraOptions = [
  {
    title: STRINGS.BOOKINGS.edit,
    key: 'edit',
    icon: icons.edit,
  },
  {
    title: STRINGS.BOOKINGS.passBooking,
    key: 'pass',
    icon: icons.edit,
  },
];

const styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusView: {
    height: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkSecondary,
    paddingBottom: 5,
  },
  topBtnsView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sortBtn: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  headerContainer: {
    backgroundColor: colors.darkSecondary,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 5,
  },
  clearFilterButton: {
    marginLeft: 5,
    marginTop: 2,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.delete,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.heart + '33',
  },

  flatListContent: {
    paddingBottom: 70,
  },
});
