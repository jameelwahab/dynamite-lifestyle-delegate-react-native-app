import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyLoader from '../../../components/MyLoader'
import { MEMBER_DELETE_SUBSCRIPTION, MEMBER_SUBSCRIPTION_LIST } from '../../../DAL'
import { colors } from '../../../utilities/colors'
import StatView from '../Components/StatView'
import EmptyView from '../../../components/EmptyView'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import { MenuButton } from '../../../components/MyButton'
import OptionModal from '../../../components/OptionModal'
import { icons } from '../../../utilities/icons'
import ConfirmationModal from '../../../components/ConfirmationModal'
import showToast from '../../../functions/showToast'

const SubscriptionList = ({ navigation, route }) => {
  const { memberId } = route?.params
  const { token, user } = useSelector(selectUser);
  const [optionModal, setOptionModal] = useState({ isVisible: false, selectedItem: null });
  const [confirmationModal, setConfirmationModal] = useState({ isVisible: false, selectedItem: null, opt: "" })
  const [list, setList] = useState([])
  const [loader, setLoader] = useState(true)

  const onSelectedOpt = (opt) => {
    console.log(opt, "opt");
    let { selectedItem } = optionModal;
    setOptionModal({ isVisible: false, selectedItem: null })
    if (opt.key == "delete") {
      setTimeout(() => {
        setConfirmationModal({
          isVisible: true,
          selectedItem: selectedItem,
          opt: opt.key
        })
      }, 400);
    }
  }

  const onAgreePress = async () => {
    if (confirmationModal.opt == "delete") {
      deleteSubscriptionFromServer(confirmationModal?.selectedItem?._id)
      setConfirmationModal({ isVisible: false, selectedItem: null, opt: "" })
    }
  }

  const deleteSubscriptionFromServer = async (id) => {
    setLoader(true);
    let res = await MEMBER_DELETE_SUBSCRIPTION({ token, navigation, subscriptionId: id })
    if (res.code == 200) {
      showToast({ type: "success", body: res.message,title:"" })
      setList((prevList) => prevList.filter(x => x._id != id));
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const getSubscriptionListFromServer = async () => {

    let res = await MEMBER_SUBSCRIPTION_LIST({ token, navigation, memberId: memberId, page: 0, searchText: "" })
    if (res.code == 200) {
      setList(res.event_subscriber)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }
  useEffect(() => {
    getSubscriptionListFromServer()
  }, [])

  const renderList = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: colors.secondary, borderRadius: 10, marginTop: 10, padding: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <MyText color={colors.primary} > {`${index + 1}.`}</MyText>
          <MenuButton
            onPress={() => setOptionModal({ isVisible: true, selectedItem: item })}
            size={20} />
        </View>
        {StatView({ title: "Page Title", value: item?.page_info?.sale_page_title })}
        {StatView({ title: "Plan Title", value: `${item?.plan_info?.plan_title} (${item?.plan_info?.payment_access})` })}
        {StatView({ title: "Referral User", value: !!item?.affiliate_info ? `${item?.affiliate_info?.affiliate_user_info?.first_name} ${item?.affiliate_info?.affiliate_user_info?.last_name}` : "N/A" })}
        {StatView({ title: "Subscription Date", value: moment(item?.createdAt).format(dateTimeFormat.date) })}
        {StatView({ title: "Agreement PDF", value: "" })}
        {StatView({ title: "Register Link", value: item?.register_url })}
      </View>
    )
  }
  return (
    <RootView title='Member Subscriptions'>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={list}
            renderItem={renderList}
            ListEmptyComponent={!loader && <EmptyView />}
          />
        </View>
        <MyLoader enable={loader} />

        <OptionModal
          isVisible={optionModal.isVisible}
          closeModal={() => setOptionModal({ isVisible: false, selectedItem: null })}
          onSelected={onSelectedOpt}
          optionList={optionsList}
        />
        <ConfirmationModal
          title={"Are you sure you want to delete this subscription?"}
          closeModal={() => setConfirmationModal({ isVisible: false, selectedItem: null, opt: "" })}
          isVisible={confirmationModal.isVisible}
          onAgree={onAgreePress}
        />
      </View>
    </RootView>
  )
}



export default SubscriptionList

const optionsList = [

  // {
  //   title: "Edit",
  //   key: "edit",
  //   icon: icons.edit
  // },
  {
    title: "Delete",
    key: "delete",
    icon: icons.trash
  },

]