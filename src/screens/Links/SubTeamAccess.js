import {View, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import MyLoader from '../../components/MyLoader';
import {
  GET_LINKS_SALES_TEAM_LIST_FOR_ACCESS,
  UPDATE_LINKS_SALES_TEAM_ACCESS,
} from '../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../redux/reducers/userSlice';
import {colors} from '../../utilities/colors';
import TitleView from '../../components/TitleView';
import MyRefreshControl from '../../components/MyRefreshControl';
import EmptyView from '../../components/EmptyView';
import SearchView from '../../components/SearchView';
import MyCheckBox from '../../components/MyCheckBox';
import MemberView from '../../components/MemberView';
import MyKeyboardAvoidingView from '../../components/MyKeyboardAvoidingView';
import {MyButton} from '../../components/MyButton';
import showToast from '../../functions/showToast';
import {STRINGS} from '../../utilities/strings';

const SubTeamAccess = ({navigation, route}) => {
  const {title, _id} = route?.params;
  const {token} = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setLoader(true);
    getDataFromServer();
  }, []);

  //! //////// API
  const getDataFromServer = async () => {
    let res = await GET_LINKS_SALES_TEAM_LIST_FOR_ACCESS({
      token,
      navigation,
      salePageId: _id,
    });
    if (res.code == 200) {
      setSelectedMembers(obj => {
        res?.sales_team.forEach(x => {
          if (x.sales_commission.some(y => y.sale_page == _id)) {
            obj[x?._id] = x;
          }
        });
        return {...obj};
      });
      setList(res?.sales_team);

      setLoader(false);
      setRefreshing(false);
    } else {
      setLoader(false);
      setRefreshing(false);
    }
  };

  const updateSaleCommission = async commission => {
    setLoader(true);
    let res = await UPDATE_LINKS_SALES_TEAM_ACCESS({
      token,
      navigation,
      salePageId: _id,
      teamIds: Object.keys(selectedMembers),
    });

    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
      setLoader(false);
      // navigation.goBack()
    } else {
      setLoader(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getDataFromServer();
  };

  const searchFromList = list => {
    if (searchText.trim() == '') {
      return list;
    }
    return list.slice().filter(x => {
      let searchForText = searchText.toLowerCase().trim();
      let searchInto = `${x?.first_name} ${x?.last_name} (${x?.email})`
        .toLowerCase()
        .trim();
      return !!searchInto.includes(searchForText);
    });
  };

  const handler = member => {
    if (!!selectedMembers[member?._id]) {
      delete selectedMembers[member?._id];
    } else {
      selectedMembers[member?._id] = member;
    }
    setSelectedMembers({...selectedMembers});
  };

  const memberListView = ({item, index}) => {
    return (
      <View style={styles.itemView}>
        <View style={styles.memberContainer}>
          <View
            opacity={item?.is_approved ? 1 : 0.6}
            pointerEvents={item?.is_approved ? 'auto' : 'none'}>
            <MyCheckBox
              pb={0}
              value={!!selectedMembers[item?._id]}
              onPress={() => handler(item)}
            />
          </View>
          <View style={styles.memberInfoContainer}>
            <MemberView
              size={30}
              member={item}
              customImage={item?.image?.thumbnail_1}
            />
          </View>
          <View
            style={[
              styles.statusView,
              {
                backgroundColor: item?.is_approved
                  ? colors.green
                  : colors.heart,
              },
            ]}>
            <MyText
              fontSize={12}
              color={item?.is_approved ? colors.black : colors.text}>
              {item?.is_approved
                ? STRINGS.SUB_TEAM_ACCESS.approved
                : STRINGS.SUB_TEAM_ACCESS.pending}
            </MyText>
          </View>
        </View>
      </View>
    );
  };

  const headerView = () => {
    return (
      <View style={styles.headerContainer}>
        <SearchView
          onChangeText={text => setSearchText(text)}
          search={searchText}
          hideBtn
        />
      </View>
    );
  };

  const topView = () => {
    return (
      <View>
        <View style={styles.topView}>
          <TitleView
            title={STRINGS.SUB_TEAM_ACCESS.title}
            subTitle={`${title}`}
          />
        </View>
      </View>
    );
  };

  const footerView = () => {
    return (
      <View style={styles.footerContainer}>
        {list.length > 0 && (
          <MyButton
            onPress={updateSaleCommission}
            title={STRINGS.SUB_TEAM_ACCESS.saveChanges}
          />
        )}
      </View>
    );
  };

  return (
    <RootView hideSubHeader>
      {topView()}
      <View style={styles.rootContainer}>
        <MyKeyboardAvoidingView noScrollView>
          <FlatList
            refreshControl={
              <MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              !loader && (
                <EmptyView label={STRINGS.SUB_TEAM_ACCESS.noDataFound} />
              )
            }
            stickyHeaderIndices={[0]}
            stickyHeaderHiddenOnScroll={true}
            ListHeaderComponent={headerView()}
            data={searchFromList(list)}
            renderItem={memberListView}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item?._id}
          />
        </MyKeyboardAvoidingView>
      </View>
      {footerView()}
      <MyLoader enable={loader} />
    </RootView>
  );
};

export default SubTeamAccess;

const styles = StyleSheet.create({
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
  itemView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  memberInfoContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  statusView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  headerContainer: {
    backgroundColor: colors.darkSecondary,
  },
  footerContainer: {
    marginHorizontal: 5,
  },
  rootContainer: {
    flex: 1,
  },
});
