import {View, FlatList, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../components/RootView';
import {useSelector} from 'react-redux';
import {selectNavbar} from '../../redux/reducers/navbarSlice';
import {selectUser} from '../../redux/reducers/userSlice';
import {GET_ASSESSMENT_LIST} from '../../DAL';
import MyLoader from '../../components/MyLoader';
import {colors} from '../../utilities/colors';
import MemberView from '../../components/MemberView';
import {MenuButton} from '../../components/MyButton';
import {dateTimeFormat} from '../../utilities/constants';
import FooterLoader from '../../components/FooterLoader';
import EmptyView from '../../components/EmptyView';
import MyRefreshControl from '../../components/MyRefreshControl';
import routes from '../../navigation/routes';
import TitleView from '../../components/TitleView';
import {icons} from '../../utilities/icons';
import SearchView from '../../components/SearchView';
import OptionModal from '../../components/OptionModal';
import StatView from '../../components/StatView';
import {convertTimezone} from '../../functions/convertTime';
import {selectTimeZone} from '../../redux/reducers/timezoneSlice';
import {STRINGS} from '../../utilities/strings';
import {__assessmentListStyles} from './__styles';

let page = 0;
let canLoadMore = false;
const Bookings = ({navigation, route}) => {
  const {value} = route.params;
  const {navbar} = useSelector(selectNavbar);
  const {token} = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const [title] = useState(navbar?.find(x => x.value == value)?.title);
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

  useEffect(() => {
    callAPi();
  }, []);

  const onSelected = opt => {
    let {item} = optionModal;
    setOptionModal({isVisible: false, item: null});
    if (opt.key == 'history') {
      onDetail(item);
    }
  };

  const onDetail = item => {
    navigation.navigate(routes.assessmentDetail, {
      item: item,
    });
  };
  const openOptions = item => {
    setOptionModal({isVisible: true, item: item});
  };

  const onSearchPress = () => {
    canLoadMore = false;
    page = 0;
    setSearchLoader(true);
    getBookingsFromServer(true);
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
    let res = await GET_ASSESSMENT_LIST({navigation, token, page, searchText});
    if (res.code == 200) {
      let length = newArray
        ? res?.assessment.length
        : list.length + res?.assessment.length;
      if (length < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setTotal(res?.total_count);
      setList(newArray ? res?.assessment : [...list, ...res?.assessment]);
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

  const renderBookings = ({item, index}) => {
    return (
      <View style={__assessmentListStyles.itemView}>
        <View style={__assessmentListStyles.headerView}>
          <Pressable onPress={() => onDetail(item)}>
            <MemberView
              member={item?.member}
              marginLeft={0}
              size={35}
              titleSize={14}
            />
          </Pressable>
          <MenuButton onPress={() => openOptions(item, index)} />
        </View>
        <View>
          <StatView
            title={STRINGS.ASSESSMENT_LIST.attitudeCoins}
            value={
              !!item?.attitude_assessment_coins_count
                ? item?.attitude_assessment_coins_count
                : STRINGS.GENERIC.N_A
            }
          />
          <StatView
            title={STRINGS.ASSESSMENT_LIST.delegate}
            value={
              !!item?.consultant
                ? item?.consultant?.first_name +
                  ' ' +
                  item?.consultant?.last_name
                : STRINGS.GENERIC.N_A
            }
          />
          <StatView
            title={STRINGS.ASSESSMENT_LIST.nurture}
            value={
              !!item?.nurture
                ? item?.nurture?.first_name + ' ' + item?.nurture?.last_name
                : STRINGS.GENERIC.N_A
            }
          />
          <StatView
            title={STRINGS.ASSESSMENT_LIST.completedDate}
            value={convertTimezone(item?.activity_date_time, timezone).format(
              dateTimeFormat.dateTime,
            )}
            uppercase
          />
          <StatView
            title={STRINGS.ASSESSMENT_LIST.assessmentLevel}
            value={item?.badge_level_info?.membership_level_badge_title}
            original
          />
        </View>
      </View>
    );
  };

  const topView = () => {
    return (
      <View>
        <View style={__assessmentListStyles.topView}>
          <TitleView
            title={title}
            hideBackBottomButton
            subTitle={`${STRINGS.ASSESSMENT_LIST.showing} ${list.length} ${STRINGS.ASSESSMENT_LIST.of} ${total}`}
          />
        </View>
      </View>
    );
  };

  const headerView = () => {
    return (
      <View style={{backgroundColor: colors.darkSecondary}}>
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
      <View style={{flex: 1}}>
        <FlatList
          keyExtractor={item => item?._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 70}}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          ListHeaderComponent={headerView()}
          data={list}
          renderItem={renderBookings}
          onEndReached={loadMore}
          ListEmptyComponent={!loader && !refreshing && <EmptyView />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          refreshControl={
            <MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <MyLoader enable={loader} />

      <OptionModal
        isVisible={optionModal?.isVisible}
        onSelected={onSelected}
        optionList={optionsList}
        closeModal={() =>
          setOptionModal({isVisible: false, item: null, list: []})
        }
      />
    </RootView>
  );
};

export default Bookings;
const optionsList = [
  {
    title: STRINGS.ASSESSMENT_LIST.viewHistory,
    key: 'history',
    icon: icons.edit,
  },
];
