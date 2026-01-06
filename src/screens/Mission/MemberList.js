import RootView from '../../components/RootView';
import TitleView from '../../components/TitleView';
import MyText from '../../components/MyText';
import MyChip from '../../components/MyChip';
import FooterLoader from '../../components/FooterLoader';
import MyRefreshControl from '../../components/MyRefreshControl';
import MyLoader from '../../components/MyLoader';
import MemberView from '../../components/MemberView';
import StatView from '../../components/StatView';
import ImgAndTxt from '../../components/ImgAndTxt';
import SearchView from '../../components/SearchView';
import StatusView from '../../components/StatusView';
import CounterBox from '../Payments/Commission/components/CounterBox';
import showToast from '../../functions/showToast';
import {STRINGS} from '../../utilities/strings';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Pressable,
  Image,
} from 'react-native';
import {GET_MISSION_MEMBER_LIST} from '../../DAL';
import EmptyView from '../../components/EmptyView';
import {useState, useEffect, useRef} from 'react';
import routes from '../../navigation/routes';
import {colors} from '../../utilities/colors';
import {dateTimeFormat} from '../../utilities/constants';
import {selectUser} from '../../redux/reducers/userSlice';
import {useSelector} from 'react-redux';
import {icons} from '../../utilities/icons';
import breakReference from '../../functions/breakReference';
import numFormatter from '../../functions/numFormatter';
import moment from 'moment';
import RNFetchBlob from 'react-native-blob-util';

const MemberList = ({route, navigation}) => {
  const {item} = route?.params;
  const [filters, setFilters] = useState(route.params.filter);
  const {token} = useSelector(selectUser);
  const pagination = useRef({page: 0, canLoadMore: false});
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [result, setResult] = useState([]);
  const [counter, setCounter] = useState({});
  const [loaders, updateLoaders] = useState({
    overall: true,
    pagination: false,
    refreshing: false,
    searching: false,
  });

  const setLoader = type => {
    let loadersObj = breakReference(loaders);
    for (const key in loadersObj) {
      if (key == type) {
        loadersObj[key] = true;
      } else {
        loadersObj[key] = false;
      }
    }
    updateLoaders(loadersObj);
  };

  const getMemberList = async () => {
    const res = await GET_MISSION_MEMBER_LIST({
      token,
      navigation,
      mission_id: item?._id,
      page: pagination?.current?.page,
      body: filters,
    });
    if (res.code == 200) {
      setCounter({
        complete: res?.completed_member_count,
        revenue: res?.total_revenue,
        in_progress: res?.in_progress_member_count,
      });
      setResult(
        pagination.current.page == 0
          ? res.users_list
          : [...result, ...res.users_list],
      );
      setTotal(res?.total_count);
      setLoader('');
      let length =
        pagination?.current?.page == 0
          ? res?.users_list.length
          : result.length + res?.users_list.length;
      if (length < res?.total_count) {
        pagination.current.page++;
        pagination.current.canLoadMore = true;
      } else {
        pagination.current.canLoadMore = false;
      }
    } else {
      setResult([]);
      setCounter({});
      setLoader('');
    }
  };

  useEffect(() => {
    pagination.current.canLoadMore = false;
    pagination.current.page = 0;
    setResult([]);
    setLoader('overall');
    getMemberList();
  }, [filters]);

  useEffect(() => {
    setFilters(route.params.filter);
  }, [route]);

  const onRefresh = () => {
    pagination.current.page = 0;
    pagination.current.canLoadMore = false;
    setLoader('refreshing');
    getMemberList();
  };

  const onEndReach = () => {
    if (pagination.current.canLoadMore) {
      pagination.current.canLoadMore = false;
      setLoader('pagination');
      getMemberList();
    }
  };

  const onSearch = () => {
    Keyboard.dismiss();
    pagination.current.page = 0;
    pagination.current.canLoadMore = false;
    setLoader('search');
    setFilters({...filters, search_text: searchText});
  };

  const makeCsv = () => {
    let file = '';
    let header = `First Name, Last Name, Email, Start Date, ${
      route.params?.item.type == 'mission' ? 'Completed Days' : 'End Date'
    }, Accept Time Badge, Current Badges, Coin Attracted, Target Coins, Status\n`;
    result.forEach((x, i) => {
      file += `${x?.user_info?.first_name}, ${x?.user_info?.last_name}, ${
        x?.user_info?.email
      }, ${moment(x?.mission_start_date).format(
        dateTimeFormat.dateTime.split(' ')[0],
      )}, ${
        route.params.item?.type == 'mission'
          ? x?.completed_mission_days
          : moment(x?.mission_end_date).format(
              dateTimeFormat.dateTime.split(' ')[0],
            )
      }, ${x?.accept_time_badge_details?.title}, ${
        x?.current_badge_level?.title
      }, ${numFormatter(x?.attracted_coins, 1)}, ${numFormatter(
        x?.target_coins,
        1,
      )}, ${item?.mission_status === 'complete' ? 'Complete' : 'In Progress'}
						\n`;
    });
    file = header + file;
    const pathToWrite =
      Platform.OS == 'ios'
        ? `${RNFetchBlob.fs.dirs.DocumentDir}/CSV/${item?.title || 'data'}.csv`
        : `${RNFetchBlob.fs.dirs.DownloadDir}/CSV/${item?.title || 'data'}.csv`;

    RNFetchBlob.fs
      .writeFile(pathToWrite, file, 'utf8')
      .then(async res => {
        if (Platform.OS == 'android') {
          let result = await RNFetchBlob.MediaCollection.copyToMediaStore(
            {
              name: `${item?.title || 'data'}.csv`, // name of the file
              parentFolder: 'Mission Control', // subdirectory in the Media Store, e.g. HawkIntech/Files to create a folder HawkIntech with a subfolder Files and save the image within this folder
              mimeType: 'text/csv',
            },
            'Download', // Media Collection to store the file in ("Audio" | "Image" | "Video" | "Download")
            pathToWrite, // Path to the file being copied in the apps own storage
          );
          showToast({
            title: STRINGS.MISSION_MEMBER_LIST.csvFileDownloaded,
            type: 'success',
          });
        } else if (Platform.OS == 'ios') {
          showToast({
            title: STRINGS.MISSION_MEMBER_LIST.csvFileDownloaded,
            type: 'success',
          });
        }
      })
      .catch(error => console.error(error));
  };

  const topView = () => {
    return (
      <View style={styles.topView}>
        <TitleView
          hideBackBottomButton
          title={item?.title + "'s Members"}
          subTitle={`Showing ${result?.length} of ${total}`}
        />

        <View style={styles.topBtnsView}>
          <TouchableOpacity
            disabled={loaders.overall}
            onPress={() => makeCsv()}
            style={styles.headerBtn}>
            <Image source={icons.csv} style={styles.csvIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(routes.missionFilter, {filters, item: item})
            }>
            {icons.filterCircle(colors.primary, 30)}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const headerView = () => {
    return (
      <View style={styles.topViewBg}>
        <View style={styles.filterChipsView}>
          {((filters?.mission_status && filters.mission_status) ||
            (!!filters?.badge_levels && filters?.badge_levels.length != 0) ||
            (filters?.from_start_date && filters.to_start_date) ||
            (filters?.from_end_date && filters.to_end_date) ||
            (filters?.coins_from && filters.coins_to)) && (
            <MyText>{STRINGS.MISSION_MEMBER_LIST.filterBy}</MyText>
          )}
          {filters?.mission_status && filters.mission_status && (
            <MyChip
              title={`${
                (filters?.mission_status == 'in_progress' &&
                  STRINGS.MISSION_MEMBER_LIST.inProgress) ||
                (filters?.mission_status == 'completed' &&
                  STRINGS.MISSION_MEMBER_LIST.completed)
              }`}
              onPress={() =>
                setFilters({...filters, mission_status: null, status: null})
              }
            />
          )}
          {!!filters?.badge_levels && filters?.badge_levels.length != 0 && (
            <>
              {!!filters.badge_type && (
                <MyChip
                  title={
                    (filters?.badge_type == 'accept_time' &&
                      STRINGS.MISSION_MEMBER_LIST.acceptTime) ||
                    (filters?.badge_type == 'current' &&
                      STRINGS.MISSION_MEMBER_LIST.current)
                  }
                  onPress={() =>
                    setFilters({
                      ...filters,
                      badge_levels: null,
                      badge_type: null,
                      badges: null,
                      filter_member_title: null,
                    })
                  }
                />
              )}
              {filters?.badges?.map((el, index) => (
                <MyChip
                  title={el.title}
                  key={index}
                  onPress={() => {
                    setFilters({
                      ...filters,
                      badge_levels: [
                        ...filters.badge_levels.filter(val => val != el._id),
                      ],
                      badges: [
                        ...filters.badges.filter(val => val._id != el._id),
                      ],
                    });
                  }}
                />
              ))}
            </>
          )}
          {filters?.from_start_date && filters.to_start_date && (
            <MyChip
              title={`${STRINGS.MISSION_MEMBER_LIST.startFrom} ${filters?.from_start_date} ${STRINGS.MISSION_MEMBER_LIST.to} ${filters?.to_start_date}`}
              onPress={() =>
                setFilters({
                  ...filters,
                  from_start_date: null,
                  to_start_date: null,
                })
              }
            />
          )}

          {filters?.from_end_date && filters.to_end_date && (
            <MyChip
              title={`${STRINGS.MISSION_MEMBER_LIST.endDateFrom} ${filters?.from_end_date} ${STRINGS.MISSION_MEMBER_LIST.to} ${filters?.to_end_date}`}
              onPress={() =>
                setFilters({...filters, from_end_date: null, to_end_date: null})
              }
            />
          )}
          {!!filters?.sort_by_coins && (
            <MyChip
              title={`${STRINGS.MISSION_MEMBER_LIST.sortBy}${
                filters?.sort_by_coins === 'ascending'
                  ? STRINGS.MISSION_MEMBER_LIST.lowToHigh
                  : STRINGS.MISSION_MEMBER_LIST.highToLow
              }`}
              onPress={() => {
                let obj = {...filters};
                delete obj?.sort_by_coins;
                setFilters({...obj});
              }}
            />
          )}
          {filters?.coins_from && filters.coins_to && (
            <MyChip
              title={`${STRINGS.MEMBER_LIST.coinsAttractFrom} ${filters?.coins_from} ${STRINGS.MEMBER_LIST.to} ${filters?.coins_to}`}
              onPress={() =>
                setFilters({...filters, coins_from: null, coins_to: null})
              }
            />
          )}
          {((filters?.mission_status && filters.mission_status) ||
            (!!filters?.badge_levels && filters?.badge_levels.length != 0) ||
            (filters?.from_start_date && filters.to_start_date) ||
            (filters?.from_end_date && filters.to_end_date) ||
            (filters?.coins_from && filters.coins_to)) && (
            <TouchableOpacity
              onPress={() => setFilters({})}
              style={styles.clearFilterBtn}>
              <MyText color={colors.primary}>
                {STRINGS.MISSION_MEMBER_LIST.clearFilter}
              </MyText>
            </TouchableOpacity>
          )}
        </View>

        {!loaders.overall && (
          <View style={styles.counterContainer}>
            <CounterBox
              color={'#283C35'}
              count={counter?.complete || 0}
              subTitle={STRINGS.MISSION_MEMBER_LIST.completedMembers}
              icon={icons.members2(colors.primary)}
              normal
            />
            <View style={styles.spacer} />
            <CounterBox
              color={'#3C3834'}
              count={counter?.in_progress || 0}
              subTitle={STRINGS.MISSION_MEMBER_LIST.inProgressMembers}
              icon={icons.members2(colors.primary)}
              normal
            />
            {route.params.item?.type == 'quest' ? (
              <>
                <View style={styles.spacer} />
                <CounterBox
                  color={'#3B2837'}
                  count={counter?.revenue || 0}
                  subTitle={STRINGS.MISSION_MEMBER_LIST.totalRevenue}
                />
              </>
            ) : (
              <View style={styles.flex1} />
            )}
          </View>
        )}

        {/* search engine */}
        <View style={styles.searchWrapper}>
          <SearchView
            search={searchText}
            onChangeText={text => setSearchText(text)}
            onSearchPress={onSearch}
            loader={loaders.searching}
          />
        </View>
      </View>
    );
  };

  const memberListView = ({item, index}) => {
    const onMissionList = () => {
      navigation.navigate(routes.missionReportScreen, {
        missionId: item?.mission_info?._id,
        memberId: item?.user_info?._id,
        type: route.params.item?.type,
      });
    };

    return (
      <Pressable onPress={onMissionList} style={styles.itemView}>
        <View style={styles.memberRowContainer}>
          <MemberView
            borderColor={item?.current_badge_level?.color_code}
            member={item?.user_info}
            customImage={item?.user_info?.profile_image}
          />
          <View style={styles.arrowContainer}>{icons.forwardArrow()}</View>
        </View>

        <View style={styles.statsContainer}>
          <StatView
            title={STRINGS.MISSION_MEMBER_LIST.startDate}
            value={moment(item?.mission_start_date).format(
              dateTimeFormat.dateTime.split(' ')[0],
            )}
          />
          {route?.params?.item?.type == 'quest' && (
            <StatView
              title={STRINGS.MISSION_MEMBER_LIST.endDate}
              value={moment(item?.mission_end_date).format(
                dateTimeFormat.dateTime.split(' ')[0],
              )}
            />
          )}
          {route?.params?.item?.type == 'mission' && (
            <StatView
              title={STRINGS.MISSION_MEMBER_LIST.completedDays}
              value={item?.completed_mission_days}
            />
          )}
          <StatView
            title={STRINGS.MISSION_MEMBER_LIST.acceptTimeBadge}
            view={() => (
              <ImgAndTxt
                img={item?.accept_time_badge_details?.icon?.thumbnail_1}
                txt={item?.accept_time_badge_details?.title}
              />
            )}
          />
          <StatView
            title={STRINGS.MISSION_MEMBER_LIST.currentBadge}
            view={() => (
              <ImgAndTxt
                img={item?.current_badge_level?.icon?.thumbnail_1}
                txt={item?.current_badge_level?.title}
              />
            )}
          />
          <StatView
            title={STRINGS.MISSION_MEMBER_LIST.coinsAttracted}
            value={numFormatter(item?.attracted_coins, 1)}
          />
          <StatView
            title={STRINGS.MISSION_MEMBER_LIST.targetCoins}
            value={numFormatter(item?.target_coins, 1)}
          />
          <StatView
            title={STRINGS.MISSION_MEMBER_LIST.status}
            view={() => (
              <StatusView
                bgColor={
                  item?.mission_status == 'completed'
                    ? colors.green + '33'
                    : colors.delete + '33'
                }
                txtColor={
                  item?.mission_status == 'completed'
                    ? colors.green
                    : colors.delete
                }
                value={item?.mission_status.replace(/_/gm, ' ')}
              />
            )}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <RootView titleView={topView}>
      <FlatList
        ListHeaderComponent={headerView()}
        refreshControl={
          <MyRefreshControl
            refreshing={loaders?.refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={!loaders.overall && <EmptyView />}
        onEndReached={onEndReach}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={true}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<FooterLoader isVisible={loaders?.pagination} />}
        data={result}
        keyExtractor={item => item?._id.toString()}
        renderItem={memberListView}
      />
      <MyLoader enable={loaders.overall} />
    </RootView>
  );
};

const styles = StyleSheet.create({
  filterChipsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  topViewBg: {
    backgroundColor: colors.darkSecondary,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkSecondary,
    paddingBottom: 5,
    paddingRight: 5,
  },
  topBtnsView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    height: 25,
    width: 25,
    borderRadius: 28 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: colors.primary,
  },
  csvIcon: {
    height: 12,
    aspectRatio: 1.5,
  },
  clearFilterBtn: {
    marginLeft: 5,
    marginTop: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.primary + '33',
  },
  counterContainer: {
    backgroundColor: colors.darkSecondary,
    flexDirection: 'row',
    marginTop: 5,
  },
  spacer: {
    width: 10,
  },
  flex1: {
    flex: 1,
  },
  searchWrapper: {
    marginTop: 5,
  },
  itemView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
  },
  memberRowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsContainer: {
    padding: 5,
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  modalDropBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginRight: 5,
  },
});

export default MemberList;
