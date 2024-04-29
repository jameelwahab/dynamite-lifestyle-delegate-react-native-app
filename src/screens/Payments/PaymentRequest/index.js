import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { BANK_PAYMENT_LINK, DELETE_PAYMENT_REQUEST, GET_PAYEMENT_DETAIL, GET_PAYMENT_REQUEST_LIST } from '../../../DAL'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'
import FooterLoader from '../../../components/FooterLoader'
import MyText from '../../../components/MyText'
import EmptyView from '../../../components/EmptyView'
import { colors } from '../../../utilities/colors'
import UserImage from '../../../components/UserImage'
import StatView from '../../Members/Components/StatView'
import RequestView from './components/RequestView'
import FAB from '../../../components/FAB'
import { icons } from '../../../utilities/icons'
import routes from '../../../navigation/routes'
import OptionModal from '../../../components/OptionModal'
import showToast from '../../../functions/showToast'
import ConfirmationModal from '../../../components/ConfirmationModal'
import MyRefreshControl from '../../../components/MyRefreshControl'
import copyText from '../../../functions/copyText'
import BankOptionModal from './components/BankOptionModal'
import TitleView from '../../../components/TitleView'
import MyChip from '../../../components/MyChip'



let page = 0;
let canLoadMore = false;
const PaymentRequest = ({ navigation, route }) => {
  const bankOptionModalRef = useRef()
  const { key, parentKey } = route.params
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const [title] = useState(navbar?.find(x => x._id == parentKey)?.child_options?.find(y => y._id == key)?.title);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [confirmationModal, setConfirmation] = useState({ isVisible: false, item: null })
  const [optionModal, setOptionModal] = useState({ isVisible: false, selectedItem: null, list: [] })
  const [sort, setSort] = useState({ isVisible: false, selected: sortList[1] })

  const api_payment_request_list = async (newArray = false) => {
    let res = await GET_PAYMENT_REQUEST_LIST({
      navigation, token, page, sort: sort?.selected?.key
    })
    if (res.code == 200) {
      console.log(list.length, "list.length");
      let length = newArray ? res?.payment_request.length : list.length + res?.payment_request.length;
      if (length < res?.total_payment_request_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      console.log(canLoadMore, "canLoadMore")
      setTotal(res?.total_payment_request_count)
      setList(newArray ? res?.payment_request : [...list, ...res?.payment_request]);
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
    } else {
      setLoader(false)
      setFooterLoader(false);
      setRefreshing(false);
    }
  }

  const deletePaymentRequest = async (item) => {
    setLoader(true)
    let res = await DELETE_PAYMENT_REQUEST({
      navigation, token, slug: item?.payment_request_slug
    })
    if (res.code == 200) {
      showToast({ "body": res?.message, type: "success" })
      if (res?.status == "inactive") {
        console.log('inactive')
        if (item.status) {
          setList((list) => {
            let index = list.findIndex(x => x._id == item?._id);
            if (index > -1) {
              list.splice(index, 1, { ...list[index], status: false });
            }
            return [...list];
          });
        }
      } else if (res?.status == "deleted") {
        setList((list) => list.slice().filter(x => x._id != item?._id));
      }
      setLoader(false)
    } else {
      setLoader(false)

    }
  }

  const onConfirmationAgree = () => {
    deletePaymentRequest(confirmationModal?.item);
    setConfirmation({ isVisible: false, item: null })
  }


  const loadMore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      api_payment_request_list()
    }
  }



  const updateListItem = (obj) => {
    let index = list.findIndex(x => obj._id == x._id);
    if (index > -1) {
      list.splice(index, 1, obj);
      setList([...list])
    }
  }

  const appendNewRequest = (reqObj) => {
    // callAPI()
    setList([reqObj, ...list])
  }

  const changePayStatus = (updation) => {
    let index = list.findIndex(x => updation?._id == x._id);
    if (index > -1) {
      list.splice(index, 1, { ...list[index], ...updation });
      setList([...list])
    }
  }

  const callAPI = (refresh = false) => {
    page = 0;
    canLoadMore = false;
    setTotal(0)
    setList([])
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoader(true);
    }
    api_payment_request_list(true)

  }

  useEffect(() => {
    callAPI()
    return () => {
      page = 0;
      canLoadMore = false;
    }
  }, [sort?.selected?.key])

  const onAddPaymentRequest = () => {
    navigation.navigate(routes.addEditPaymenyRequestScreen, {
      backScreenFunc: appendNewRequest,
    });
  }

  const onEditPaymentRequest = (item) => {
    navigation.navigate(routes.addEditPaymenyRequestScreen, {
      editItem: item,
      backScreenFunc: updateListItem
    });
  }

  const onSelectedOption = (opt) => {
    console.log(opt, "onSelectedOption")
    let { selectedItem } = optionModal;
    setOptionModal({ isVisible: false, list: [], selectedItem: null });
    if (opt.key == "edit") {
      onEditPaymentRequest(selectedItem)
    } else if (opt.key == "delete") {
      setTimeout(() => {
        setConfirmation({ isVisible: true, item: selectedItem })
      }, 400);
    } else if (opt.key == "detail") {
      onTransactionalDetail(selectedItem?.payment_request_slug)
    } else if (opt.key == "bank") {
      getRequestDeatilForBankPayment(selectedItem?._id)
      // bankOptionModalRef?.current?.openModal(selectedItem)
      // console.log(bankOptionModalRef,"bankOptionModalRef");
      // copyBankLinkFromServer(selectedItem?._id);
    }
  }



  const getRequestDeatilForBankPayment = async (id) => {
    setLoader(true);
    let res = await GET_PAYEMENT_DETAIL({ navigation, token, requestId: id });
    setLoader(false);
    if (res.code == 200) {

      setTimeout(() => {
        bankOptionModalRef?.current?.openModal(res)
      }, 200);
      // copyText(res?.redirect_url);
      // showToast({ title: "Bank URL coppied to clipboard", type: "success" });
    }
  }


  const onTransactionalDetail = (slug) => {
    navigation.navigate(routes.PaymenyRequestDetailScreen, {
      slug: slug,
      backScreenFunc: changePayStatus
    })
  }

  const openOptionModal = (item) => {
    console.log(item, "item");
    console.log(optionsList, "optionsList");
    let list = [];
    console.log(list, "1")
    if (item?.payment_status == "paid" || item?.is_first_paid) {
      list = optionsList.slice().filter(x => x.key != "edit");
    } else {
      list = optionsList
    }
    console.log(list, "2")
    console.log(item?.payment_status != "paid" && item?.is_first_paid == false && item?.request_type == "onetime")
    if (item?.payment_status != "paid" && item?.is_first_paid == false && item?.request_type == "onetime") {
      list = [...list, bankOpt]
    }
    console.log(list, "3")
    setOptionModal({ isVisible: true, list: list, selectedItem: item });
  }

  const itemView = ({ item, index }) => {
    return (
      <RequestView item={item} index={index} openOptionModal={openOptionModal}
        onDetail={onTransactionalDetail}
      />
    )
  }

  const topView = () => {
    return (
      <View style={__styles.topView}>
        <TitleView
          title={title}
          hideBackBottomButton
          subTitle={`Showing ${list.length} of ${total}`}
        />
        <View style={__styles.topBtnsView}>

          <MyChip title={sort?.selected?.title} />
          <TouchableOpacity
            onPress={() => setSort({ ...sort, isVisible: true })}
            style={__styles.sortBtn} >
            {icons.sort(colors.black, 15)}
          </TouchableOpacity>
        </View >
      </View >
    )
  }


  return (
    <RootView hideSubHeader>
      {topView()}
      <View style={{ flex: 1, }}>
        <FlatList
          data={list}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id}
          // ListHeaderComponent={topView()}
          // stickyHeaderIndices={[0]}
          // stickyHeaderHiddenOnScroll={true}
          renderItem={itemView}
          onEndReached={loadMore}
          ListEmptyComponent={!loader && !refreshing && <EmptyView label={'No Payment Requests Found'} />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
        />
      </View>
      <FAB icon={icons.plus} onPress={onAddPaymentRequest} />
      <MyLoader enable={loader} />

      <OptionModal
        optionList={optionModal?.list}
        isVisible={optionModal?.isVisible}
        onSelected={onSelectedOption}
        closeModal={() => setOptionModal({ selectedItem: null, isVisible: false, list: [] })}
      />

      <OptionModal
        optionList={sortList}
        isVisible={sort?.isVisible}
        onSelected={(opt) => setSort({ isVisible: false, selected: opt })}
        closeModal={() => setSort({ ...sort, isVisible: false })}
        checkSelected={(opt) => sort.selected.key === opt?.key}
      />

      <ConfirmationModal
        title={"Are you sure you want to delete this Payment Request ?"}
        closeModal={() => setConfirmation({ isVisible: false, item: null })}
        onAgree={onConfirmationAgree}
        isVisible={confirmationModal?.isVisible} />

      <BankOptionModal
        ref={bankOptionModalRef}
        token={token}
        navigation={navigation} />
    </RootView>
  )
}

export default PaymentRequest

const optionsList = [
  {
    title: "Edit",
    key: "edit",
    icon: icons.edit
  },
  {
    title: "Delete",
    key: "delete",
    icon: icons.trash
  },
  {
    title: "View Detail",
    key: "detail",
    icon: icons.threeLinesMenu
  },
]

const sortList = [
  {
    title: "All",
    key: "all",
  },
  {
    title: "Pending",
    key: "pending",
  },
  {
    title: "Paid",
    key: "paid",
  },
  {
    title: "Processing",
    key: "processing",
  },
]

const bankOpt = {
  title: "Copy Bank Payment Link",
  key: "bank",
  icon: icons.bank
}

const __styles = StyleSheet.create({
  topView: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.darkSecondary, paddingBottom: 5
  },
  topBtnsView: { flexDirection: "row", alignItems: "flex-end", },

  sortBtn: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: "center",
    marginLeft: 5
  }
})