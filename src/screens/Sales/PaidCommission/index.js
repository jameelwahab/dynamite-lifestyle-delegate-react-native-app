import {View, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../../components/RootView';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {selectNavbar} from '../../../redux/reducers/navbarSlice';
import {SALE_TEAM_BY_PAID_COMMISSION} from '../../../DAL';
import MemberView from '../../../components/MemberView';
import {colors} from '../../../utilities/colors';
import StatView from '../../../components/StatView';
import prependCurency from '../../../functions/prependCurency';
import SearchView from '../../../components/SearchView';
import TitleView from '../../../components/TitleView';
import MyRefreshControl from '../../../components/MyRefreshControl';
import FooterLoader from '../../../components/FooterLoader';
import EmptyView from '../../../components/EmptyView';
import MyLoader from '../../../components/MyLoader';

let pncPage = 0;
let pncCanLoadMore = false;
const TeamList = ({navigation, route}) => {
  const {value, parentValue} = route?.params;
  const {token} = useSelector(selectUser);
  const {navbar} = useSelector(selectNavbar);
  const [title] = useState(
    navbar
      ?.find(x => x.value == parentValue)
      ?.child_options?.find(y => y.value == value)?.title,
  );
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);

  useEffect(() => {
    pncCanLoadMore = false;
    pncPage = 0;
    setLoader(true);
    getTeamListFromServer(true);
  }, []);

  const onSearchPress = () => {
    pncCanLoadMore = false;
    pncPage = 0;
    setSearchLoader(true);
    getTeamListFromServer(true);
  };

  const onRefresh = () => {
    pncCanLoadMore = false;
    pncPage = 0;
    setRefreshing(true);
    getTeamListFromServer(true);
  };

  const loadMore = () => {
    if (pncCanLoadMore) {
      pncCanLoadMore = false;
      setFooterLoader(true);
      getTeamListFromServer();
    }
  };

  //! //////// API
  const getTeamListFromServer = async (newArray = false) => {
    let res = await SALE_TEAM_BY_PAID_COMMISSION({
      token,
      navigation,
      page: pncPage,
      searchText: searchText.trim(),
    });
    if (res.code == 200) {
      let length = newArray
        ? res?.sales_team.length
        : list.length + res?.sales_team.length;
      if (length < res?.total_count) {
        pncPage++;
        pncCanLoadMore = true;
      } else {
        pncCanLoadMore = false;
      }
      setTotal(res?.total_count);
      setLoader(false);
      setList(newArray ? res?.sales_team : [...list, ...res?.sales_team]);
      setSearchLoader(false);
      setRefreshing(false);
      setFooterLoader(false);
    } else {
      setLoader(false);
      setSearchLoader(false);
      setRefreshing(false);
      setFooterLoader(false);
    }
  };

  const memberListView = ({item, index}) => {
    return (
      <View style={__styles.itemView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <MemberView member={item} customImage={item?.image?.thumbnail_1} />
          </View>
        </View>
        <View style={{padding: 5}}>
          <StatView
            title={'Total Commission'}
            value={
              prependCurency('gbp') +
              ' ' +
              (!!item?.total_commission
                ? item?.total_commission.toFixed(2)
                : '0.00')
            }
          />
          <StatView
            title={'Paid Commission'}
            value={
              prependCurency('gbp') +
              ' ' +
              (!!item?.commission_paid
                ? item?.commission_paid.toFixed(2)
                : '0.00')
            }
          />
          <StatView
            title={'Due Commission'}
            value={
              prependCurency('gbp') +
              ' ' +
              (!!item?.commission_due
                ? item?.commission_due.toFixed(2)
                : '0.00')
            }
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

  const topView = () => {
    return (
      <View>
        <View style={__styles.topView}>
          <TitleView
            title={title}
            hideBackBottomButton
            subTitle={`Showing ${list.length} of ${total}`}
          />
        </View>
      </View>
    );
  };

  return (
    <RootView hideSubHeader>
      {topView()}
      <View style={{flex: 1}}>
        <FlatList
          refreshControl={
            <MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            !loader && <EmptyView label={'No Commission Found!'} />
          }
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          ListHeaderComponent={headerView()}
          data={list}
          renderItem={memberListView}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item?._id}
          onEndReached={loadMore}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
        />
      </View>

      <MyLoader enable={loader} />
    </RootView>
  );
};

export default TeamList;

const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkSecondary,
    paddingBottom: 5,
  },
  topBtnsView: {flexDirection: 'row', alignItems: 'flex-end'},

  sortBtn: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
});
