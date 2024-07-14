import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { BANK_PAYMENT_LINK, DELETE_PAYMENT_REQUEST, GET_PAYEMENT_DETAIL, GET_PAYMENT_REQUEST_LIST, MARK_PAYMENT_AS_CANCELLED_OR_PAID } from '../../../DAL'
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
import moment from 'moment'



let page = 0;
let canLoadMore = false;
const PaymentRequest = ({ navigation, route }) => {
  const bankOptionModalRef = useRef()
  const { key, parentKey } = route.params
  const { navbar } = useSelector(selectNavbar);
  const { token, access } = useSelector(selectUser);
  const [title] = useState(navbar?.find(x => x._id == parentKey)?.child_options?.find(y => y._id == key)?.title);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [confirmationModal, setConfirmation] = useState({ isVisible: false, item: null, text: "", type: "" })
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


  const markPayemntCancelOrPaid = async (item, type, note = undefined) => {
    setLoader(true)
    let res = await MARK_PAYMENT_AS_CANCELLED_OR_PAID({
      navigation, token, slug: item?.payment_request_slug,
      type, note
    })
    if (res.code == 200) {
      showToast({ "body": res?.message, type: "success" })
      changeStatus("cancelled", item)
      setLoader(false)
    } else {
      setLoader(false)

    }
  }

  const changeStatus = (type, item) => {

    setList((list) => {
      let index = list.findIndex(x => x._id == item?._id);

      if (index > -1) {
        if (type == "cancelled") {
          if (sort.selected.key == "cancelled" || sort.selected.key == "all") {
            list.splice(index, 1, {
              ...list[index],
              is_first_paid: false,
              status: false,
              cancel_date: moment().toISOString(),
              payment_status: "cancelled"
            });
          } else {
            list.splice(index, 1);
            setTotal((total) => --total);
          }
        } else if (type == "paid") {
          if (sort.selected.key == "paid" || sort.selected.key == "all") {
            list.splice(index, 1, {
              ...list[index],
              is_first_paid: true,
              status: true,
              payment_status: "paid",
              subscription_date: moment().toISOString()
            });
          } else {
            list.splice(index, 1)
            setTotal((total) => --total);
          }
        }
      }
      return [...list];
    });

  }
  const onConfirmationAgree = () => {
    let { type, item } = confirmationModal;
    if (type == "delete") {
      deletePaymentRequest(item);
    } else if (type == "markAsCancel") {
      markPayemntCancelOrPaid(item, "cancelled")
    }
    setConfirmation({ isVisible: false, item: null, text: "", type: "" })
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
    if (sort?.selected?.key == "pending" || sort?.selected?.key == "all") {
      setList([reqObj, ...list])
      setTotal((total) => ++total);
    }
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

    if (opt.key == "edit") {
      onEditPaymentRequest(selectedItem)
    } else if (opt.key == "delete") {
      setTimeout(() => {
        setConfirmation({ isVisible: true, item: selectedItem, text: "Are you sure you want to delete this payment request?", type: "delete" })
      }, 600);
    } else if (opt.key == "detail") {
      onTransactionalDetail(selectedItem?.payment_request_slug)
    } else if (opt.key == "bank") {
      getRequestDeatilForBankPayment(selectedItem?._id)
      // bankOptionModalRef?.current?.openModal(selectedItem)
      // console.log(bankOptionModalRef,"bankOptionModalRef");
      // copyBankLinkFromServer(selectedItem?._id);
    } else if (opt.key == "markAsPaid") {
      navigation.navigate(routes?.markAsPaidScreen, {
        data: selectedItem,
        changeStatus
      })
      // setTimeout(() => {
      //   markPaidModalRef?.current?.openModal(selectedItem)
      // }, 600);
    } else if (opt.key == "markAsCancel") {
      setTimeout(() => {
        setConfirmation({ isVisible: true, item: selectedItem, text: "Are you sure you want to cancel this payment request?", type: "markAsCancel" })
      }, 600);
    }

    setOptionModal({ isVisible: false, list: [], selectedItem: null });
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
    console.log(item, "item")
    let list = [];
    if (item?.payment_status == "paid" || item?.is_first_paid) {
      list = optionsList.slice().filter(x => x.key != "edit");
    } else {
      list = optionsList
    }

    if (access?.show_option_mark_request_as_paid && item?.payment_status == "pending" && item?.request_type === "onetime") {
      list = [...list, paidOpt]
    }

    if (access?.show_option_mark_request_as_cancelled && item?.payment_status == "pending") {
      list = [...list, cancelOpt]
    }

    if (item?.payment_status != "cancelled" && item?.payment_status != "paid" && item?.is_first_paid == false && item?.request_type == "onetime") {
      list = [...list, bankOpt]
    }
    setOptionModal({ isVisible: true, list: list, selectedItem: item });
  }

  const itemView = useCallback(({ item, index }) => {
    return (
      <RequestView item={item} index={index} openOptionModal={openOptionModal}
        onDetail={onTransactionalDetail}
      />
    )
  }, [JSON.stringify(list)])

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
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={5}
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
        title={confirmationModal?.text}
        closeModal={() => setConfirmation({ isVisible: false, item: null, type: "", text: "" })}
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
  {
    title: "Cancelled",
    key: "cancelled",
  },
]

const bankOpt = {
  title: "Copy Bank Payment Link",
  key: "bank",
  icon: icons.bank
}

const cancelOpt = {
  title: "Mark Request As Cancelled",
  key: "markAsCancel",
  icon: icons.edit
}

const paidOpt = {
  title: "Mark Request As Paid",
  key: "markAsPaid",
  icon: icons.edit
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