import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { DELETE_PAYMENT_REQUEST, GET_PAYMENT_REQUEST_LIST } from '../../../DAL'
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


let page = 0;
let canLoadMore = false;
const PaymentRequest = ({ navigation, route }) => {
  const { key, parentKey } = route.params
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const [title] = useState(navbar?.find(x => x.value == parentKey)?.child_options?.find(y => y.value == key)?.title);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loader, setLoader] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [confirmationModal, setConfirmation] = useState({ isVisible: false, item: null })
  const [optionModal, setOptionModal] = useState({ isVisible: false, selectedItem: null, list: [] })

  const api_payment_request_list = async (newArray = false) => {
    let res = await GET_PAYMENT_REQUEST_LIST({
      navigation, token, page,
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
    } else {
      setLoader(false)
      setFooterLoader(false);
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

  const callAPI = () => {
    page = 0;
    canLoadMore = false;
    setTotal(0)
    setList([])
    setLoader(true);
    api_payment_request_list(true)

  }

  useEffect(() => {
    callAPI()
    return () => {
      page = 0;
      canLoadMore = false;
    }
  }, [])

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
      navigation.navigate(routes.PaymenyRequestDetailScreen, {
        slug: selectedItem?.payment_request_slug
      })
    }
  }

  const openOptionModal = (item) => {
    console.log(item,"item")
    let list = [];
    if (item?.payment_status == "paid" ||item?.is_first_paid) {
      list = optionsList.slice().filter(x => x.key != "edit");
    } else {
      list = optionsList
    }
    setOptionModal({ isVisible: true, list: list, selectedItem: item });
  }

  const itemView = ({ item, index }) => {
    return (
      <RequestView item={item} index={index} openOptionModal={openOptionModal} />
    )
  }


  return (
    <RootView title={title} hideBackBottomButton>
      <View style={{ flex: 1, }}>
        <FlatList
          data={list}
          onEndReached={loadMore}
          showsVerticalScrollIndicator={false}
          // ListHeaderComponent={topView()}
          // stickyHeaderIndices={[0]}
          // stickyHeaderHiddenOnScroll={true}
          renderItem={itemView}
          ListEmptyComponent={!loader && <EmptyView label={'No Payment Requests Found'} />}
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

      <ConfirmationModal
        title={"Are you sure you want to delete this Payment Request ?"}
        closeModal={() => setConfirmation({ isVisible: false, item: null })}

        onAgree={onConfirmationAgree}
        isVisible={confirmationModal?.isVisible} />
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