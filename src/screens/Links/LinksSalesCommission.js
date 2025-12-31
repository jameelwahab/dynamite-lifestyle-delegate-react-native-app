import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import MyLoader from '../../components/MyLoader';
import {
  GET_LINKS_SALES_TEAM_LIST,
  UPDATE_LINKS_SALES_TEAM_COMMISSION,
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
import MyInputs from '../../components/MyInputs';
import MyKeyboardAvoidingView from '../../components/MyKeyboardAvoidingView';
import {MyButton} from '../../components/MyButton';
import prependCurency from '../../functions/prependCurency';
import {icons} from '../../utilities/icons';
import Collapsible from 'react-native-collapsible';
import showToast from '../../functions/showToast';
import {Flex} from '../../UIComponents/FlexViews';
import {STRINGS} from '../../utilities/strings';

const LinksSalesCommission = ({navigation, route}) => {
  const {pageId, planId, salePageTitle, planTitle} = route?.params;
  const {token} = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [commissionObj, setCommissionObj] = useState(null);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setLoader(true);
    getDataFromServer();
  }, []);

  //! //////// API
  const getDataFromServer = async () => {
    let res = await GET_LINKS_SALES_TEAM_LIST({
      token,
      navigation,
      pageId,
      planId,
    });

    if (res.code == 200) {
      let newArr = [];
      res?.team_list.forEach(element => {
        let planAmount = element.sales_commision_for_plan.find(
          x => x?.plan_id == planId,
        )?.commission_amount;
        newArr.push({
          ...element,
          planAmount: !!planAmount ? planAmount : 0,
          isCommissionEnabled: !!planAmount,
        });
      });
      setList(newArr);
      setCommissionObj(res?.commission_info);
      setLoader(false);
      setRefreshing(false);
    } else {
      setLoader(false);
      setRefreshing(false);
    }
  };

  const updateSaleCommission = async commission => {
    setLoader(true);
    let res = await UPDATE_LINKS_SALES_TEAM_COMMISSION({
      token,
      navigation,
      commissionList: commission,
      planId: planId,
    });

    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
      setLoader(false);
      navigation.goBack();
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

  const handler = (obj, index) => {
    let newObj = {...list[index], ...obj};
    list.splice(index, 1, newObj);
    setList([...list]);
  };

  const onSubmitPress = () => {
    let arr = [];
    for (let i = 0; i < list.length; i++) {
      let x = list[i];
      if (x?.isCommissionEnabled) {
        if (x?.planAmount <= commissionObj?.commission_amount) {
          arr.push({
            commission_amount: Number(x?.planAmount),
            consultant_id: x?._id,
          });
        } else {
          showToast({
            title: STRINGS.LINKS_SALES_COMMISSION.alert,
            body: `${
              STRINGS.LINKS_SALES_COMMISSION.commissionMustBeLess
            } ${prependCurency(
              commissionObj?.plan_currency,
            )} ${commissionObj?.commission_amount.toFixed(2)}`,
            type: 'info',
          });
          return;
        }
      }
    }
    updateSaleCommission(arr);
  };

  const memberListView = ({item, index}) => {
    return (
      <View style={styles.itemView}>
        <View style={styles.memberHeader}>
          <View style={styles.memberImageContainer}>
            <MemberView
              size={30}
              member={item}
              customImage={item?.image?.thumbnail_1}
            />
          </View>
          <MyCheckBox
            pb={0}
            value={item?.isCommissionEnabled}
            onPress={() =>
              handler({isCommissionEnabled: !item?.isCommissionEnabled}, index)
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <MyInputs
            label={STRINGS.LINKS_SALES_COMMISSION.commissionAmount}
            noSpace
            value={!!item?.planAmount ? String(item?.planAmount) : ''}
            onChangeText={val => handler({planAmount: val}, index)}
            keyboardType="number-pad"
          />
          {!!item?.planAmount && item?.isCommissionEnabled && (
            <Collapsible
              collapsed={
                Number(item?.planAmount) <=
                Number(commissionObj?.commission_amount)
              }>
              <View style={styles.warningContainer}>
                {icons.warnOuline(colors.heart, 15)}
                <MyText fontSize={12} color={colors.heart}>
                  {`  ${
                    STRINGS.LINKS_SALES_COMMISSION.commissionMustBeLess
                  } ${prependCurency(
                    commissionObj?.plan_currency,
                  )} ${commissionObj?.commission_amount.toFixed(2)}`}
                </MyText>
              </View>
            </Collapsible>
          )}
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

        {!!commissionObj && (
          <View style={styles.commissionInfoContainer}>
            <MyText align="center" color={colors.primary}>{`${
              STRINGS.LINKS_SALES_COMMISSION.yourCommissionOnEveryTransaction
            }${prependCurency(
              commissionObj?.plan_currency,
            )} ${commissionObj?.commission_amount.toFixed(2)}`}</MyText>
          </View>
        )}
      </View>
    );
  };

  const topView = () => {
    return (
      <View>
        <View style={styles.topView}>
          <TitleView
            title={STRINGS.LINKS_SALES_COMMISSION.title}
            subTitle={`${salePageTitle} -> ${planTitle}`}
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
            onPress={onSubmitPress}
            title={STRINGS.LINKS_SALES_COMMISSION.submit}
          />
        )}
      </View>
    );
  };

  return (
    <RootView hideSubHeader>
      {topView()}
      <Flex flex={1}>
        <MyKeyboardAvoidingView noScrollView>
          <FlatList
            refreshControl={
              <MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              !loader && (
                <EmptyView label={STRINGS.LINKS_SALES_COMMISSION.noDataFound} />
              )
            }
            stickyHeaderIndices={[0]}
            stickyHeaderHiddenOnScroll={true}
            ListHeaderComponent={headerView()}
            data={searchFromList(list)}
            renderItem={memberListView}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item?._id}
            ListFooterComponent={footerView()}
          />
        </MyKeyboardAvoidingView>
      </Flex>
      <MyLoader enable={loader} />
    </RootView>
  );
};

export default LinksSalesCommission;

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
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingRight: 10,
  },
  memberImageContainer: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 5,
    paddingBottom: 5,
    marginTop: 10,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  headerContainer: {
    backgroundColor: colors.darkSecondary,
  },
  commissionInfoContainer: {
    margin: 5,
    alignItems: 'center',
  },
  footerContainer: {
    marginTop: 10,
    marginHorizontal: 5,
  },
});
