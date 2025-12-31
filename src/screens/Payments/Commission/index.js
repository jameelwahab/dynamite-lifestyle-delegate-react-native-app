import {View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../../components/RootView';
import {useSelector} from 'react-redux';
import {selectNavbar} from '../../../redux/reducers/navbarSlice';
import CounterBox from './components/CounterBox';
import {colors} from '../../../utilities/colors';
import EmptyView from '../../../components/EmptyView';
import MyText from '../../../components/MyText';
import Tabs from '../../../components/Tabs';
import FooterLoader from '../../../components/FooterLoader';
import {GET_COMMISSION_LIST} from '../../../DAL';
import {selectUser} from '../../../redux/reducers/userSlice';
import {selectTimeZone} from '../../../redux/reducers/timezoneSlice';
import MyLoader from '../../../components/MyLoader';
import TransactionView from './components/TransactionView';
import {PaidCommissionDetailHtmlContent} from '../../../assets/html/PaidCommissionDetailHtml';
import {makePdfFromHtml} from '../../../functions/createPDF';
import {fileViewer} from '../../../functions/fileViewer';
import {STRINGS} from '../../../utilities/strings';
import {Flex, Row} from '../../../UIComponents/FlexViews';
import showToast from '../../../functions/showToast';

let page = 0;
let canLoadMore = false;
const Commission = ({navigation, route}) => {
  const {value, parentValue} = route.params;
  const {navbar} = useSelector(selectNavbar);
  const {token, user} = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const [title] = useState(
    navbar
      ?.find(x => x.value == parentValue)
      ?.child_options?.find(y => y.value == value)?.title,
  );
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState(0);
  const [commision, setCommision] = useState({
    total: 0,
    paid: 0,
    pending: 0,
  });

  const downloadPDF = async () => {
    try {
      setLoader(true);
      const htmlContent = PaidCommissionDetailHtmlContent(user, list);
      const file = await makePdfFromHtml(htmlContent, 'transaction');
      fileViewer(file?.filePath);
    } catch (error) {
      console.log('PDF download error:', error);
      showToast({body: 'Failed to download PDF. Please try again.'});
    } finally {
      setLoader(false);
    }
  };

  const api_commission_list = async (newArray = false) => {
    try {
      let res = await GET_COMMISSION_LIST({
        navigation,
        token,
        page,
        type: tab == 0 ? 'credit' : 'paid',
      });
      if (res.code == 200) {
        let length = newArray
          ? res?.transaction.length
          : list.length + res?.transaction.length;
        if (length < res?.total_member_count) {
          page++;
          canLoadMore = true;
        } else {
          canLoadMore = false;
        }
        setTotal(res?.total_member_count);
        setList(newArray ? res?.transaction : [...list, ...res?.transaction]);
        setCommision({
          paid: res?.paid_commission,
          total: res?.total_commission,
          pending: res?.remaining_commission,
        });
        setLoader(false);
        setFooterLoader(false);
      } else {
        setLoader(false);
        setFooterLoader(false);
      }
    } catch (error) {
      console.log('Error in fetching commission list: ', error);
      setLoader(false);
      setFooterLoader(false);
    } finally {
      setLoader(false);
      setFooterLoader(false);
    }
  };

  const loadMore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      api_commission_list();
    }
  };

  useEffect(() => {
    page = 0;
    canLoadMore = false;
    setTotal(0);
    setList([]);
    setLoader(true);
    api_commission_list(true);

    return () => {
      page = 0;
      canLoadMore = false;
    };
  }, [tab]);

  const topView = () => {
    return (
      <View style={{backgroundColor: colors.darkSecondary}}>
        <Row>
          <CounterBox
            color={'#283C35'}
            count={commision?.total}
            subTitle={STRINGS.COMMISSION.totalCommission}
          />
          <CounterBox
            style={{marginHorizontal: 8}}
            color={'#3C3834'}
            count={commision?.paid}
            subTitle={STRINGS.COMMISSION.paidCommission}
          />
          <CounterBox
            color={'#3B2837'}
            count={commision?.pending}
            subTitle={STRINGS.COMMISSION.pendingCommission}
          />
        </Row>
        <View>
          <Tabs
            list={tablist}
            tab={tab}
            changeTab={setTab}
            downloadPDF={downloadPDF}
          />
        </View>
      </View>
    );
  };

  const itemView = ({item, index}) => (
    <TransactionView
      item={item}
      index={index}
      timezone={timezone}
      isCredit={tab == 0}
    />
  );

  const Mytitle = () => {
    return (
      <Flex ph={10} flex={1}>
        <MyText fontSize={18} type="bold" color={colors.primary}>
          {title}
        </MyText>
        <MyText
          fontSize={10}
          type="medium"
          color={
            colors.lightText2
          }>{`Showing ${list.length} of ${total}`}</MyText>
      </Flex>
    );
  };
  return (
    <RootView hideBackBottomButton titleView={Mytitle}>
      <Flex flex={1}>
        <FlatList
          data={list}
          onEndReached={loadMore}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={topView()}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          renderItem={itemView}
          ListEmptyComponent={
            !loader && (
              <EmptyView label={STRINGS.COMMISSION.noTransactionsFound} />
            )
          }
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
        />
      </Flex>

      <MyLoader enable={loader} />
    </RootView>
  );
};

export default Commission;

const tablist = [
  {key: 'credit', title: 'CREDIT'},
  {key: 'paid', title: 'PAID'},
];
