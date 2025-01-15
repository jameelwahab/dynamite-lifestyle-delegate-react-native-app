import { View, Text, SafeAreaView, Pressable } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../../../utilities/colors';
import MyInputs from '../../../components/MyInputs';
import { MyButton } from '../../../components/MyButton';
import MyText from '../../../components/MyText';
import { icons } from '../../../utilities/icons';
import Toast from 'react-native-toast-message';
import showToast from '../../../functions/showToast';
import { filterFromlist, levelList, memberStatusList, onlineStatusList, membershipStatusList, expireDaysList, sortList } from './list'
import moment from 'moment';
import { dateTimeFormat } from '../../../utilities/constants';
import MyLoader from '../../../components/MyLoader';
import { SAVE_FILTER } from '../../../DAL/Members';

const SaveFilterModal = forwardRef(({ access, tabName, filters, navigation, token, filterData, searchText, sort, isMembers, isNurture, isAllMembers }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("")
  const [loader, setLoader] = useState(false)
  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])

  const openModal = () => {
    setTitle("")
    setIsVisible(true)
  }

  const closeModal = () => {
    setIsVisible(false)
  }

  const saveFilterBtn = () => {
    if (title.trim() == "") {
      showToast({ body: "Please enter filter name", title: "Alert", type: "info" });
      return
    }
    // setLoader(true);


    let salePage = !!filters?.event_page
    [0] ? filterData?.sale_pages.find(x => x._id == filters?.event_page
    [0]) : null;

    let nurture = !!filters?.nurture ? filterData.delegates.find(x => x._id == filters?.nurture) : filters?.nurture;

    let delegate = !!filters?.delegate ? filterData.delegates_list.find(x => x._id == filters?.delegate) : filters?.delegate;
    let plan = !!filters?.plan ? salePage?.payment_plans.find(x => x._id == filters?.plan) : filters?.plan;


    let obj = {
      ...filters,
      coins: filters?.coins_range ? {
        chip_label: `Start Coins : ${filters?.coins_from} - End Coins :  ${filters?.coins_to}`,
        chip_value: `Start Coins : ${filters?.coins_from} - End Coins :  ${filters?.coins_to}`,
      } : null,
      downloaded_app: typeof (filters?.downloaded_app) == "boolean" ? {
        chip_label: filters?.downloaded_app ? "Downloaded" : "Not Downloaded",
        chip_value: filters?.downloaded_app,
        name: filters?.downloaded_app ? "Downloaded" : "Not Downloaded",
        value: filters?.downloaded_app,
      } : null,
      membership_expiry: filters?.member_ship_expiry == "not_expired" && filters?.expiry_in == "custom" ? {
        chip_label: `Membership Expiry Start Date : ${moment(filters?.membership_purchase_expiry_from).format(dateTimeFormat.date)} - Membership Expiry End Date :  ${moment(filters?.membership_purchase_expiry_to).format(dateTimeFormat.date)}`,
        chip_value: `Membership Expiry Start Date : ${moment(filters?.membership_purchase_expiry_from).format(dateTimeFormat.date)} - Membership Expiry End Date :  ${moment(filters?.membership_purchase_expiry_to).format(dateTimeFormat.date)}`,
      } : filters?.membership_expiry,
      badge_levels: filters?.badge_levels.map((x) => {
        let lvl = access?.badge_levels.find(y => y._id == x);
        if (!!lvl) {
          return {
            chip_label: lvl?.title,
            chip_value: lvl?._id,
            _id: lvl?._id,
            title: lvl?.title
          }
        }
      }),
      date: filters?.is_date_range ? {
        chip_label: `Start Date : ${moment(filters?.from_date).format(dateTimeFormat.date)} - End Coins :  ${moment(filters?.to_date).format(dateTimeFormat.date)}`,
        chip_value: `Start Date : ${moment(filters?.from_date).format(dateTimeFormat.date)} - End Coins :  ${moment(filters?.to_date).format(dateTimeFormat.date)}`,
      } : null,
      event_page: salePage ? {
        ...salePage,
        chip_label: salePage?.sale_page_title,
        chip_value: salePage?._id
      } : {},
      lead_status: filters?.lead_status.map((x) => {
        let lead = filterData?.lead_status.find(y => y._id == x);
        if (!!lead) {
          return {
            ...lead,
            chip_label: lead?.title,
            chip_value: lead?._id,
          }
        }
      }),

      nurture: !!nurture ? {
        ...nurture,
        chip_label: nurture?.first_name + " " + nurture?.last_name,
        chip_value: nurture?._id
      } : nurture,
      delegate: !!delegate ? {
        ...delegate,
        chip_label: delegate?.first_name + " " + delegate?.last_name,
        chip_value: delegate?._id
      } : delegate,
      user_status_type: !!filters?.user_status_type ? filters?.user_status_type : null,
      plan: !!plan ? {
        ...plan,
        chip_label: plan?.plan_title,
        chip_value: plan?._id
      } : plan,

      sort_by: !!sort ? {
        ...sort,
        chip_label: sort?.title,
        chip_value: sort?.key
      } : sort,

    }
    if (isNurture) {
      delete obj.nurture
    } else if (isMembers) {
      delete obj.delegate
    }
    console.log(obj, "obj")
    saveFilterToServer(obj);
  }
  const saveFilterToServer = async (obj) => {
    let res = await SAVE_FILTER({
      navigation, token, body: {
        filter_name: title.trim(),
        filter_object: obj,
        filter_on_tab_name: tabName
      }
    });
    if (res.code == 200) {
      setLoader(false);
      setIsVisible(false);
      showToast({ type: "success", body: res?.message })
    } else {
      setLoader(false)
    }
  }

  const saveFilterModal = () => {
    return (
      <Modal
        isVisible={isVisible}
        onBackButtonPress={closeModal}
        onBackdropPress={closeModal}
        useNativeDriverForBackdrop={true}
        style={{ margin: 0 }}
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        animationInTiming={300}
        animationOutTiming={300}
        avoidKeyboard={true}
      >
        <SafeAreaView>
          <View style={{ backgroundColor: colors.secondary, marginHorizontal: 10, borderRadius: 10 }}>
            <View style={{ alignItems: "center" }} >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingHorizontal: 10 }}>
                <View style={{ height: 20, width: 20 }} />
                <MyText type='medium' fontSize={20} style={{ paddingVertical: 20 }} >Save Filter</MyText>
                <Pressable
                  onPress={closeModal}
                  style={{ height: 25, width: 25, alignItems: "center", justifyContent: "center", backgroundColor: colors.lightPrimary3, borderRadius: 25 / 2 }}>
                  {icons.crosss(colors.primary, 20)}
                </Pressable>
              </View>
              <View style={{ height: 1 / 2, width: '100%', backgroundColor: colors.white }} />
            </View>
            <View style={{ padding: 20 }}>
              <MyInputs
                label='Filter Name'
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
              <MyButton title='Save' onPress={saveFilterBtn}
              />
            </View>
          </View>
          <MyLoader enable={loader} />

        </SafeAreaView>
        {isVisible && <Toast />}
      </Modal>
    )
  }
  return (
    <View>
      {saveFilterModal()}
    </View>
  )
})

export default SaveFilterModal