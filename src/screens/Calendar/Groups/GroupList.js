import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import MyChip from '../../../components/MyChip';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {selectNavbar} from '../../../redux/reducers/navbarSlice';
import {
  DELETE_CALENDAR_GROUP,
  GET_CALENDAR_GROUPS_LIST_FILTER,
} from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import EmptyView from '../../../components/EmptyView';
import {colors} from '../../../utilities/colors';
import {fonts} from '../../../utilities/fonts';
import {MenuButton} from '../../../components/MyButton';
import StatView from '../../../components/StatView';
import FAB from '../../../components/FAB';
import OptionModal from '../../../components/OptionModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import routes from '../../../navigation/routes';
import {icons} from '../../../utilities/icons';
import MyRefreshControl from '../../../components/MyRefreshControl';
import showToast from '../../../functions/showToast';
import isArray from '../../../functions/isArray';
import SearchView from '../../../components/SearchView';
import capitalize from '../../../functions/capitalize';
import ViewMoreModal from '../../../components/ViewMoreModal';
import {main} from '../../../utilities/styles';
import {Flex} from '../../../UIComponents/FlexViews';
import {STRINGS} from '../../../utilities/strings';

const GroupList = ({navigation, route}) => {
  const ref_viewMore = React.useRef();
  const {parentValue, value} = route?.params;
  const {token, access} = useSelector(selectUser);
  const {navbar} = useSelector(selectNavbar);
  const [title] = useState(
    navbar
      ?.find(x => x.value == parentValue)
      ?.child_options?.find(y => y.value == value)?.title,
  );
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [options, setOptions] = useState({isVisible: false, item: null});
  const [confirmation, setConfirmation] = useState({
    isVisible: false,
    item: null,
  });
  const [filter, setFilter] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setLoader(true);
    getCalendarGroupsLists();
  }, [filter]);

  useEffect(() => setFilter(route.params.filter), [route]);

  const onRefresh = () => {
    setRefreshing(true);
    getCalendarGroupsLists();
  };
  // * Options functions

  const onAgree = () => {
    let {item} = confirmation;
    setConfirmation({isVisible: false, item: null});
    setTimeout(() => {
      deleteGrpFromServer(item);
    }, 350);
  };

  const onSelected = opt => {
    let {item} = options;
    setOptions({isVisible: false, item: null});
    setTimeout(() => {
      if (opt.key == 'edit') {
        navigation.navigate(routes.calendarGroupAddEdit, {
          group: item,
          ammendList,
        });
      } else if (opt.key == 'delete') {
        setTimeout(() => {
          setConfirmation({isVisible: true, item: item});
        }, 350);
      } else if (opt.key == 'detail') {
        onGrpDetail(item);
      }
    }, 400);
  };

  const ammendList = group => {
    let index = list.findIndex(x => x?._id == group._id);
    if (index > -1) {
      list.splice(index, 1, group);
    } else {
      list.unshift(group);
    }
    setList([...list]);
  };

  const onGrpDetail = group => {
    navigation.navigate(routes.calendarGroupDetail, {group});
  };

  //! APIs

  const getCalendarGroupsLists = async search => {
    let res = await GET_CALENDAR_GROUPS_LIST_FILTER({
      token,
      navigation,
      search,
      group_by: filter?.group?.key,
      badge_levels: filter?.badges?.map(el => el._id),
      group_by_ids: filter?.list?.map(el => el._id),
    });

    setLoader(false);
    setRefreshing(false);
    setSearching(false);

    if (res.code == 200) {
      setList(res?.groups);
    }
  };

  const deleteGrpFromServer = async grp => {
    let res = await DELETE_CALENDAR_GROUP({
      navigation,
      token,
      slug: grp?.group_slug,
    });
    setLoader(false);
    setRefreshing(false);
    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
      setList(list => list.slice().filter(x => x._id != grp._id));
    }
  };

  const onSearch = () => {
    Keyboard.dismiss();
    setSearching(true);
    getCalendarGroupsLists(searchText);
  };

  const statusView = value => {
    return (
      <View
        style={[
          __styles.statusContainer,
          {
            backgroundColor: value ? colors.green + '33' : colors.delete + '33',
          },
        ]}>
        <MyText
          type="medium"
          capitalize
          color={value ? colors.green : colors.delete}>
          {value
            ? STRINGS.CALENDAR_GROUP_LIST.status.active
            : STRINGS.CALENDAR_GROUP_LIST.status.inactive}
        </MyText>
      </View>
    );
  };

  const eventView = (list, variable = 'title', grpType) => {
    return (
      <View style={__styles.eventViewContainer}>
        {list.map((x, i) => {
          let subTitle = '';
          if (grpType == 'sale_page') {
            subTitle =
              x?.type_of_page == 'clickfunnel_page'
                ? ' | ' + STRINGS.CALENDAR_GROUP_LIST.clickFunnel
                : ' | ' + STRINGS.CALENDAR_GROUP_LIST.moon;
          } else if (grpType == 'mission' && grpType) {
            subTitle = ' | ' + capitalize(x?.type).trim();
          }
          if (i < 3) {
            return (
              <MyText type="medium" fontSize={12} key={'event' + i}>
                {x?._id?.[variable] || x?.[variable]}
                {subTitle},
              </MyText>
            );
          } else return null;
        })}

        {list.length > 3 ? (
          <TouchableOpacity
            style={__styles.viewMoreButton}
            hitSlop={main.hitSlop}
            onPress={() => {
              ref_viewMore?.current?.openModal({
                title: groupBy[grpType] + 's',
                data: list,
                type: grpType,
              });
            }}>
            <MyText underlined type="bold" fontSize={13} color={colors.primary}>
              {STRINGS.CALENDAR_GROUP_LIST.viewMore}
            </MyText>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <Pressable onPress={() => onGrpDetail(item)} style={__styles.itemView}>
        <View style={__styles.titleRow}>
          <View style={__styles.titleView}>
            <MyText type="medium">
              <MyText type="medium" color={colors.primary}>
                {index + 1}){' '}
              </MyText>
              {item?.title}
            </MyText>
          </View>
          <MenuButton
            onPress={() => setOptions({isVisible: true, item: item})}
          />
        </View>
        <View style={__styles.statView}>
          {item?.group_by != 'badge_level' && (
            <StatView
              title={groupBy[item?.group_by] + 's'}
              view={() =>
                eventView(
                  item?.group_by == 'event'
                    ? item?.event
                    : item?.group_by == 'program'
                    ? item?.program
                    : item?.group_by == 'sale_page'
                    ? item?.sale_pages
                    : item?.group_by == 'mission'
                    ? item?.missions
                    : [],
                  item?.group_by == 'sale_page' ? 'sale_page_title' : 'title',
                  item?.group_by,
                )
              }
            />
          )}
          <StatView title={'Type'} value={item?.group_type} />
          <StatView title={'Group By'} value={groupBy[item?.group_by]} />
          <StatView title={'Members'} value={item?.member.length} />
          {item?.group_by != 'sale_page' && (
            <StatView
              title={'Include Members'}
              value={includeMembersObj[item?.include_users]?.title}
            />
          )}
          <StatView
            original
            title={'Badge Level'}
            value={
              item?.group_by == 'badge_level'
                ? item?.group_badge_levels.map(item => item?.title + ', ')
                : isArray(item?.badge_levels)
                ? item?.badge_levels.map(item => item?.title + ', ')
                : 'N/A'
            }
          />
          <StatView title={'Status'} view={() => statusView(item?.status)} />
        </View>
      </Pressable>
    );
  };

  const titleView = () => {
    return (
      <View style={__styles.heading_container}>
        <Text style={__styles.heading_font}>
          {STRINGS.CALENDAR_GROUP_LIST.title}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(routes.calendarGroupFilter, {
              token,
              filter,
              access,
            })
          }
          style={__styles.filterButton}
          hitSlop={{bottom: 5, top: 5, left: 5, right: 5}}>
          {icons.filterCircle(colors.primary, 30)}
        </TouchableOpacity>
      </View>
    );
  };

  const headerView = () => {
    return (
      <View>
        {((!!filter?.group && filter?.group.title != '') ||
          isArray(filter?.badges) ||
          isArray(filter?.list)) && (
          <View style={__styles.topHeaderView}>
            <MyText>{STRINGS.CALENDAR_GROUP_LIST.filterBy}</MyText>
            {!!filter?.group && (
              <MyChip
                title={filter?.group?.title}
                onPress={() => setFilter({...filter, group: null, list: null})}
              />
            )}
            {filter?.list?.map((el, index) => (
              <MyChip
                title={
                  filter?.group?.key == 'sale_page'
                    ? el.sale_page_title
                    : el.title
                }
                key={index}
                onPress={() => {
                  setFilter({
                    ...filter,
                    list: filter.list.filter(x => x._id != el._id),
                  });
                }}
              />
            ))}
            {filter?.badges?.map((el, index) => (
              <MyChip
                title={el.title}
                key={index}
                onPress={() => {
                  setFilter({
                    ...filter,
                    badges: filter.badges.filter(x => x._id != el._id),
                  });
                }}
              />
            ))}
            <TouchableOpacity
              onPress={() => setFilter({})}
              style={__styles.clear_btn}>
              <MyText color={colors.primary}>
                {STRINGS.CALENDAR_GROUP_LIST.clearFilter}
              </MyText>
            </TouchableOpacity>
          </View>
        )}

        <View style={{backgroundColor: colors.darkSecondary}}>
          <SearchView
            search={searchText}
            onChangeText={text => setSearchText(text)}
            onSearchPress={onSearch}
            loader={searching}
          />
        </View>
      </View>
    );
  };

  return (
    <RootView hideBackBottomButton titleView={titleView}>
      <Flex flex={1}>
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={list}
          ListHeaderComponent={headerView()}
          renderItem={renderItem}
          keyExtractor={(item, index) => item?._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loader && (
              <EmptyView data={STRINGS.CALENDAR_GROUP_LIST.noGroupsFound} />
            )
          }
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          refreshControl={
            <MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </Flex>
      <MyLoader enable={loader} />

      <FAB
        onPress={() =>
          navigation.navigate(routes.calendarGroupAddEdit, {
            group: undefined,
            ammendList,
          })
        }
      />

      <OptionModal
        isVisible={options.isVisible}
        onSelected={onSelected}
        optionList={optionsList}
        closeModal={() => setOptions({isVisible: false, item: null})}
      />

      <ConfirmationModal
        title={STRINGS.CALENDAR_GROUP_LIST.deleteConfirmation}
        isVisible={confirmation.isVisible}
        onAgree={onAgree}
        closeModal={() => setConfirmation({isVisible: false, item: null})}
      />

      <ViewMoreModal
        ref={ref_viewMore}
        renderItem={({item, type}) => {
          let subTitle = '';
          let variable = type == 'sale_page' ? 'sale_page_title' : 'title';
          if (type == 'sale_page') {
            subTitle =
              item?.type_of_page == 'clickfunnel_page'
                ? ' | ' + STRINGS.CALENDAR_GROUP_LIST.clickFunnel
                : ' | ' + STRINGS.CALENDAR_GROUP_LIST.moon;
          } else if (type == 'mission') {
            subTitle = ' | ' + capitalize(type).trim();
          }
          return (
            <View style={__styles.viewMoreItemContainer}>
              <MyText fontSize={12} key={item?._id?._id || item?._id}>
                {item?._id?.[variable] || item?.[variable]}
                {subTitle}
              </MyText>
            </View>
          );
        }}
      />
    </RootView>
  );
};

export default GroupList;

const includeMembersObj = {
  active: {
    title: 'Active Members',
    value: 'active',
  },
  all: {
    title: 'All Members',
    value: 'all',
  },
  no_prior_access: {
    title: 'Members Without Any Prior Access',
    value: 'no_prior_access',
  },
};

const groupBy = {
  event: 'Event',
  program: 'Programme',
  sale_page: 'Sale Page',
  mission: 'Mission',
  badge_level: 'Badge Levels',
};

const optionsList = [
  {
    title: 'Edit',
    key: 'edit',
    icon: icons.edit,
  },
  {
    title: 'Delete',
    key: 'delete',
    icon: icons.trash,
  },
  {
    title: 'View Detail',
    key: 'detail',
    icon: icons.threeLinesMenu,
  },
];

const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    padding: 10,
    paddingTop: 5,
    marginTop: 10,
    borderRadius: 10,
  },
  titleRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  titleView: {
    flex: 1,
  },
  statView: {
    marginTop: 5,
  },
  topHeaderView: {
    backgroundColor: colors.darkSecondary,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 10,
  },
  heading_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.darkSecondary,
    marginHorizontal: 10,
  },
  heading_font: {
    color: colors.primary,
    fontSize: 18,
    includeFontPadding: false,
    textTransform: 'capitalize',
    fontFamily: fonts.bold,
  },
  filterButton: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: colors.primary,
    borderRadius: 10,
  },
  clear_btn: {
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
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderRadius: 10,
  },
  eventViewContainer: {
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderRadius: 10,
  },
  viewMoreButton: {
    marginTop: 2,
  },
  viewMoreItemContainer: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightText + '11',
  },
});
