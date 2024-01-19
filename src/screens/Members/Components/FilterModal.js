import { View, Text, TouchableHighlight, SafeAreaView, Pressable, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import { icons } from '../../../utilities/icons';
import { useNavigation } from '@react-navigation/native';
import { GET_FILTER_DATA } from '../../../DAL';
import MyTouchableInput from '../../../components/MyTouchableInput';
import { MyButton } from '../../../components/MyButton';
import OptionModal from '../../../components/OptionModal';
import moment from 'moment';
import { dateTimeFormat } from '../../../utilities/constants';
import CalendarModal from '../../../components/CalendarModal';
import CheckBox from '@react-native-community/checkbox';
import MyCheckBox from '../../../components/MyCheckBox';
import MyInputs from '../../../components/MyInputs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { filterFromlist, levelList, memberStatusList, onlineStatusList, membershipStatusList, expireDaysList } from './list'
import Toast from 'react-native-toast-message';
import showToast from '../../../functions/showToast';

const FilterModal = forwardRef(({ token, filterTheData, appliedFilter }, ref) => {
  const calendarRef = useRef()
  const [isVisible, setIsVisible] = useState(false);
  const [nurtureModalVisibilty, setNurtureModalVisibilty] = useState(false);
  const [deletegateModalVisibility, setDeletegateModalVisibility] = useState(false)
  const [filterData, setFilterData] = useState(null);
  const [filterFrom, setfilterFrom] = useState(filterFromlist[0]);
  const [selectedSavedFilter, setSelectedSavedFilter] = useState(null)
  const [salePage, setSalePage] = useState("");
  const [plan, setPlan] = useState("")
  const [nurture, setNurture] = useState("")
  const [delegate, setDelegate] = useState("")
  const [leadStatus, setLeadStatus] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]);
  const [memberStatus, setMemberStatus] = useState("");
  const [onlineStatus, setOnlineStatus] = useState("");
  const [membershipStatus, setMembershipStatus] = useState("");
  const [expireIn, setExpireIn] = useState("");
  const [membershipExpiryStartDate, setMembershipExpiryStartDate] = useState(moment());
  const [membershipExpiryEndDate, setMembershipExpiryEndDate] = useState(moment());
  const [showDateRange, setShowDateRange] = useState(false);
  const [calenderFor, setCalenderFor] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showCoinsRange, setShowCoinsRange] = useState(false);
  const [coinsFrom, setCoinsFrom] = useState("0")
  const [coinsTo, setCoinsTo] = useState("0");
  const [isApplied, setApplied] = useState(false)
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    list: [],
    selectedFor: "",
    titleKey: ""
  })
  const navigation = useNavigation();


  const reset = () => {
    setfilterFrom(filterFromlist[0]);
    setSelectedSavedFilter(null);
    setSalePage("");
    setPlan("");
    setNurture("");
    setDelegate("")
    setLeadStatus([]);
    setSelectedLevel([])
    setMemberStatus("");
    setOnlineStatus("");
    setMembershipStatus("");
    setExpireIn("")
    setMembershipExpiryStartDate(moment());
    setMembershipExpiryEndDate(moment());
    setShowDateRange(false);
    setStartDate(null);
    setEndDate(null)
    setShowCoinsRange(false);
    setCoinsFrom("0");
    setCoinsTo("0");
  }

  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      getFilterData();
    } else {
      if (!isApplied) {
        reset()
      }
    }
  }, [isVisible])


  const applyFilter = (reset = false) => {
    if (showDateRange && reset == false) {
      if (!!startDate == false || !!endDate == false) {
        showToast({ title: "Alert", body: "Please select a Start Date & End Date" })
        return
      }
    }
    let obj = {
      "community": selectedLevel.map((x) => x.key),
      "event_page": salePage ? [salePage?._id] : [],
      "lead_status": leadStatus.map((x) => x._id),
      "plan": !!plan ? plan?._id : null,
      "nurture": !!nurture ? nurture._id : null,
      "delegate": !!delegate ? delegate?._id : null,
      "is_date_range": showDateRange,
      "coins_range": showCoinsRange,
      "coins_from": !!coinsFrom ? coinsFrom : 0,
      "coins_to": !!coinsTo ? coinsTo : 0,
      "from_date": !!startDate ? startDate : null,
      "to_date": !!endDate ? endDate : null,
      "membership_purchase_expiry_from": moment(membershipExpiryStartDate).format("YYYY-MM-DD"),
      "membership_purchase_expiry_to": moment(membershipExpiryEndDate).format("YYYY-MM-DD"),
      "date": expireIn?.key == "custom" ? {
        chip_label: `Start Date : ${moment(membershipExpiryStartDate).format("YYYY-MM-DD")} - End Date : ${moment(membershipExpiryEndDate).format("YYYY-MM-DD")}`,
        chip_value: `Start Date : ${moment(membershipExpiryStartDate).format("YYYY-MM-DD")} - End Date : ${moment(membershipExpiryEndDate).format("YYYY-MM-DD")}`
      } : null,
      "coins": null,
      "membership_expiry": null,
      "status": memberStatus != "" ? memberStatus?.key == "active" ? true : false : "",
      "expiry_in": !!expireIn?.key ? expireIn?.key : 3,
      "member_ship_expiry": !!membershipStatus?.key ? membershipStatus?.key : "",
      "user_status_type": !!onlineStatus?.key ? onlineStatus?.key : "",
    }
    console.log(obj, "filters")
    setApplied(!reset)
    filterTheData(obj, filterData);
    setIsVisible(false);

  }

  const clearAll = () => {
    reset();
    applyFilter(true)
  }

  const getFilterData = async () => {
    let res = await GET_FILTER_DATA({ navigation, token, });
    if (res.code == 200) {
      setFilterData(res)
    }
  }

  const openOptionModal = (openFor, title = undefined) => {
    let list = [];
    if (openFor == "filterType") {
      list = filterFromlist
    } else if (openFor == "savedfilter") {
      list = filterData?.saved_portal_filter
    } else if (openFor == "salepage") {
      list = filterData?.sale_pages
    } else if (openFor == "plan") {
      list = !!salePage?.payment_plans ? salePage?.payment_plans : []
    } else if (openFor == "leadstatus") {
      filterData?.lead_status.forEach(x => {
        if (leadStatus.findIndex(y => y._id == x._id) == -1) {
          list.push(x)
        }
      })
    } else if (openFor == "level") {
      levelList.forEach(x => {
        if (selectedLevel.findIndex(y => y.key == x.key) == -1) {
          list.push(x)
        }
      })
    } else if (openFor == "memberstatus") {
      list = memberStatusList
    } else if (openFor == "onlinestatus") {
      list = onlineStatusList
    } else if (openFor == "membershipstatus") {
      list = membershipStatusList
    } else if (openFor == "expiryin") {
      list = expireDaysList
    }

    setOptionModal({
      isVisible: true,
      list: list,
      selectedFor: openFor,
      titleKey: title
    })
  }

  const onOptionSelected = (seletecOpt) => {
    let { selectedFor } = optionModal;
    setOptionModal({
      isVisible: false,
      list: [],
      selectedFor: "",
      titleKey: ""
    })
    if (selectedFor == "filterType") {
      setfilterFrom(seletecOpt)
    } else if (selectedFor == "savedfilter") {
      let filterObj = seletecOpt?.filter_object;
      setSelectedSavedFilter(seletecOpt);
      setSalePage(filterObj?.event_page);
      setPlan(filterObj?.event_page?.payment_plans.find(x => x._id == filterObj?.plan?._id));
      setNurture(!!filterObj?.nurture ? filterObj?.nurture : "");
      setDelegate(!!filterObj?.delegate ? filterObj?.delegate : "");
      setLeadStatus(filterObj?.lead_status);
      setSelectedLevel(() => {
        let list = []
        levelList.forEach((item) => {
          if (!!filterObj?.community.find(x => x.name == item?.key)) {
            list.push(item);
          }
        })
        return list;
      });
      setMemberStatus(!!filterObj?.status ? filterObj?.status ? memberStatusList[1] : memberStatusList[0] : "");
      setOnlineStatus(!!filterObj?.user_status_type ? onlineStatusList.find(x => x.key == filterObj?.user_status_type) : "");
      setMembershipStatus(!!filterObj?.member_ship_expiry ? membershipStatusList.find(x => x.key == filterObj?.member_ship_expiry) : "");
      setExpireIn(!!filterObj?.expiry_in ? expireDaysList.find(x => x.key == filterObj?.expiry_in) : '')
      setMembershipExpiryStartDate(!!filterObj?.membership_purchase_expiry_from ? moment(filterObj?.membership_purchase_expiry_from) : moment());
      setMembershipExpiryEndDate(!!filterObj?.membership_purchase_expiry_to ? moment(filterObj?.membership_purchase_expiry_to) : moment());
      setShowDateRange(!!filterObj?.is_date_range);
      setStartDate(!!filterObj?.from_date ? moment(filterObj?.from_date) : null);
      setEndDate(!!filterObj?.to_date ? moment(filterObj?.to_date) : null)
      setShowCoinsRange(filterObj?.coins_range);
      setCoinsFrom(filterObj?.coins_from.toString());
      setCoinsTo(filterObj?.coins_to.toString());

    } else if (selectedFor == "salepage") {
      setSalePage(seletecOpt)
    } else if (selectedFor == "plan") {
      setPlan(seletecOpt)
    } else if (selectedFor == "leadstatus") {
      setLeadStatus((leadStatus) => [...leadStatus, seletecOpt])
    } else if (selectedFor == "level") {
      setSelectedLevel((list) => [...list, seletecOpt])
    } else if (selectedFor == "memberstatus") {
      setMemberStatus(seletecOpt.key == "none" ? "" : seletecOpt)
    } else if (selectedFor == "onlinestatus") {
      setOnlineStatus(seletecOpt.key == "all" ? "" : seletecOpt)
    } else if (selectedFor == "membershipstatus") {
      setMembershipStatus(seletecOpt.key == "none" ? "" : seletecOpt)
    } else if (selectedFor == "expiryin") {
      setExpireIn(seletecOpt)
    }
  }

  const openCalendarFor = (openFor) => {
    setCalenderFor(openFor)
    calendarRef?.current?.openModal()
  }

  const onDateSelected = (date) => {
    console.log(date, "onDateSelected")

    if (calenderFor == "SD") {
      setStartDate(date)
    } else if (calenderFor == "ED") {
      setEndDate(date)
    } else if (calenderFor == "MESD") {
      setMembershipExpiryStartDate(date)
    } else if (calenderFor == "MEED") {
      setMembershipExpiryEndDate(date)
    }
    setCalenderFor("")
  }

  const onNutureSelected = (selected) => {
    setNurtureModalVisibilty(false);
    setNurture(selected)
  }

  const onDelegateSelected = (selected) => {
    setDeletegateModalVisibility(false);
    setDelegate(selected)
  }

  const closeOptionModal = () => {
    setOptionModal({
      isVisible: false,
      list: [],
      selectedFor: ""
    })
  }

  const openModal = () => {
    setIsVisible(true);
  }

  const closeModal = () => {
    setIsVisible(false);
  }

  const selectedleadStatusView = () => {
    return (
      <View style={__styles.chipRoot}>
        {leadStatus.map((item, index) => {
          return (
            <View style={__styles.chipView} >
              <MyText fontSize={12} color={colors.white} >{item.title}</MyText>
              <Pressable
                style={__styles.chipBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => setLeadStatus((prev) => prev.filter(x => x._id != item?._id))}>
                {icons.crosss(colors.black, 20)}
              </Pressable>
            </View>
          )
        })}
      </View>
    )
  }

  const selectedlevelView = () => {
    return (
      <View style={__styles.chipRoot}>
        {selectedLevel.map((item, index) => {
          return (
            <View style={__styles.chipView} >
              <MyText fontSize={12} color={colors.white} >{item.title}</MyText>
              <Pressable
                style={__styles.chipBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => setSelectedLevel((prev) => prev.filter(x => x.key != item?.key))}>
                {icons.crosss(colors.black, 20)}
              </Pressable>
            </View>
          )
        })}
      </View>
    )
  }

  const screenView = () => {
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }} >
          <MyTouchableInput
            label='Filter From'
            value={filterFrom.title}
            onPress={() => openOptionModal("filterType")}
            icon={() => icons.down(colors.primary, 15)}
          />

          {filterFrom.key == "saved-filter" &&
            <MyTouchableInput
              label='Sale Pages'
              value={selectedSavedFilter?.filter_name}
              onPress={() => openOptionModal("savedfilter", "filter_name")}
              icon={() => icons.down(colors.primary, 15)}
              subTextView={() => !!selectedSavedFilter && (
                <Pressable
                  style={__styles.clearbtnView}
                  onPress={() => setSelectedSavedFilter(null)}>
                  <MyText color={colors.primary} >Clear</MyText>
                </Pressable>
              )}
            />
          }


          {(filterFrom.key == "new-filter" || (filterFrom.key == "saved-filter") && !!selectedSavedFilter) &&
            <>
              <MyTouchableInput
                label='Sale Pages'
                value={salePage?.sale_page_title}
                onPress={() => openOptionModal("salepage", "sale_page_title")}
                icon={() => icons.down(colors.primary, 15)}
                subTextView={() => !!salePage && (
                  <Pressable
                    style={__styles.clearbtnView}
                    onPress={() => setSalePage("")}>
                    <MyText color={colors.primary} >Clear</MyText>
                  </Pressable>
                )}
              />

              <MyTouchableInput
                label='Choose Plan'
                value={plan?.plan_title}
                onPress={() => openOptionModal("plan", "plan_title")}
                icon={() => icons.down(colors.primary, 15)}
                subTextView={() => !!plan && (
                  <Pressable
                    style={__styles.clearbtnView}
                    onPress={() => setPlan("")}>
                    <MyText color={colors.primary} >Clear</MyText>
                  </Pressable>
                )}
              />

              <MyTouchableInput
                label='Choose Nuture'
                value={!!nurture ? `${nurture?.first_name} ${nurture?.last_name} | ${nurture?.team_type}` : ""}
                onPress={() => setNurtureModalVisibilty(true)}
                icon={() => icons.down(colors.primary, 15)}
                subTextView={() => !!nurture && (
                  <Pressable
                    style={__styles.clearbtnView}
                    onPress={() => setNurture("")}>
                    <MyText color={colors.primary} >Clear</MyText>
                  </Pressable>
                )}
              />

              <MyTouchableInput
                label='Choose Delegate'
                value={!!delegate ? `${delegate?.first_name} ${delegate?.last_name} | ${delegate?.team_type}` : ""}
                onPress={() => setDeletegateModalVisibility(true)}
                icon={() => icons.down(colors.primary, 15)}
                subTextView={() => !!delegate && (
                  <Pressable
                    style={__styles.clearbtnView}
                    onPress={() => setDelegate("")}>
                    <MyText color={colors.primary} >Clear</MyText>
                  </Pressable>
                )}
              />

              {/* <MyTouchableInput
            label='Choose Delegate'
          /> */}

              <MyTouchableInput
                view={selectedleadStatusView}
                iconOnPress={() => openOptionModal("leadstatus", "title")}
                label='Lead Status'
                icon={() => icons.down(colors.primary, 15)}
                subTextView={() => leadStatus.length > 0 && (
                  <Pressable
                    style={__styles.clearbtnView}
                    onPress={() => setLeadStatus([])}>
                    <MyText color={colors.primary} >Clear</MyText>
                  </Pressable>
                )}
              />

              <MyTouchableInput
                label='Levels'
                view={selectedlevelView}
                iconOnPress={() => openOptionModal("level", "title")}
                icon={() => icons.down(colors.primary, 15)}
                subTextView={() => selectedLevel.length > 0 && (
                  <Pressable
                    style={__styles.clearbtnView}
                    onPress={() => setSelectedLevel([])}>
                    <MyText color={colors.primary} >Clear</MyText>
                  </Pressable>
                )}
              />

              <MyTouchableInput
                label='Member Status'
                value={memberStatus?.title}
                onPress={() => openOptionModal("memberstatus", "title")}
                icon={() => icons.down(colors.primary, 15)}
              />

              <MyTouchableInput
                label='Online Status'
                value={onlineStatus?.title}
                onPress={() => openOptionModal("onlinestatus", "title")}
                icon={() => icons.down(colors.primary, 15)}
              />

              <MyTouchableInput
                label='Membership Status'
                value={membershipStatus?.title}
                onPress={() => openOptionModal("membershipstatus", "title")}
                icon={() => icons.down(colors.primary, 15)}
              />
              {membershipStatus?.key == "not_expired" &&
                <>
                  <MyTouchableInput
                    label='Expiry In'
                    value={expireIn?.title}
                    onPress={() => openOptionModal("expiryin", "title")}
                    icon={() => icons.down(colors.primary, 15)}
                  />
                  {expireIn?.key == "custom" &&
                    <>
                      <MyTouchableInput
                        label='Membership Expiry Start Date'
                        value={moment(membershipExpiryStartDate).format(dateTimeFormat.date)}
                        icon={icons.calendar}
                        onPress={() => openCalendarFor("MESD")}
                      />


                      <MyTouchableInput
                        label='Membership Expiry End Date'
                        value={moment(membershipExpiryEndDate).format(dateTimeFormat.date)}
                        icon={icons.calendar}
                        onPress={() => openCalendarFor("MEED")}
                      />
                    </>}
                </>
              }

              <MyCheckBox
                title='Search By Date Range'
                value={showDateRange}
                onPress={() => setShowDateRange(!showDateRange)}
              />
              {showDateRange &&
                <View style={{ marginTop: 10 }}>
                  <MyTouchableInput
                    label='Start Date*'
                    value={!!startDate ? moment(startDate).format(dateTimeFormat.date) : ""}
                    icon={icons.calendar}
                    onPress={() => openCalendarFor("SD")}
                  />

                  <MyTouchableInput
                    label='End Date*'
                    value={!!endDate ? moment(endDate).format(dateTimeFormat.date) : ""}
                    icon={icons.calendar}
                    onPress={() => openCalendarFor("ED")}
                  />
                </View>}


              <MyCheckBox
                title='Search By Coins'
                value={showCoinsRange}
                onPress={() => setShowCoinsRange(!showCoinsRange)}
              />

              {showCoinsRange && (
                <View style={{ marginTop: 10, flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <MyInputs
                      label='Coins From*'
                      value={coinsFrom}
                      onChangeText={(text) => setCoinsFrom(text)}
                      keyboardType='number-pad'
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <MyInputs
                      label='Coins To*'
                      value={coinsTo}
                      onChangeText={(text) => setCoinsTo(text)}
                      keyboardType='number-pad'
                    />
                  </View>
                </View>
              )}

            </>
          }
          <MyButton
            style={{ marginTop: 20 }}
            title='Apply Filter'
            textStyle={{ color: colors.black }}
            onPress={() => applyFilter(false)}
          />

          <MyButton
            style={{ marginTop: 20 }}
            invert
            onPress={clearAll}
            title='Clear all' />

        </KeyboardAwareScrollView>
      </View>
    )
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      useNativeDriverForBackdrop={true}
      style={{ margin: 0 }}
      animationIn={"slideInRight"}
      animationOut={"slideOutRight"}
      animationInTiming={300}
      animationOutTiming={300}
    >
      <SafeAreaView style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, flex: 1, marginTop: "auto", backgroundColor: colors.secondary }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText, }}>
            <Pressable onPress={closeModal}>
              {icons.back(colors.primary, 25)}
            </Pressable>
            <View style={{ marginLeft: 10 }}>
              <MyText fontSize={18} color={colors.primary} type='medium' >{"Member Filter"}</MyText>
              {/* <MyText color={colors.lightText} fontSize={12}>Select Lead Status from list below</MyText> */}
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, flex: 1 }}>
            {screenView()}
          </View>
        </View>

        <OptionModal
          closeModal={closeOptionModal}
          isVisible={optionModal.isVisible}
          onSelected={onOptionSelected}
          optionList={optionModal.list}
          titleKey={optionModal.titleKey}
          noIcon={true}
        />

        <OptionModal
          closeModal={() => setNurtureModalVisibilty(false)}
          isVisible={nurtureModalVisibilty}
          onSelected={onNutureSelected}
          optionList={!!filterData?.delegates_list ? filterData?.delegates_list : []}
          renderText={({ item }) => <MyText style={{ textTransform: "capitalize" }} >{`${item?.first_name} ${item?.last_name} | ${item?.team_type}`}</MyText>}
          noIcon={true}
        />


        <OptionModal
          closeModal={() => setDeletegateModalVisibility(false)}
          isVisible={deletegateModalVisibility}
          onSelected={onDelegateSelected}
          optionList={!!filterData?.delegates_list ? filterData?.delegates : []}
          renderText={({ item }) => <MyText style={{ textTransform: "capitalize" }} >{`${item?.first_name} ${item?.last_name} | ${item?.team_type}`}</MyText>}
          noIcon={true}
        />

        <CalendarModal
          ref={calendarRef}
          onDateSelected={onDateSelected}

        />

      </SafeAreaView>
      {isVisible && <Toast />}
    </Modal>
  )
})

export default FilterModal;

const __styles = StyleSheet.create({
  clearbtnView: {
    paddingBottom: 5, paddingLeft: 10, paddingRight: 5
  },
  chipRoot: { flexDirection: "row", flex: 1, alignItems: "center", flexWrap: "wrap", paddingVertical: 2 },
  chipView: { backgroundColor: colors.chip, borderRadius: 15, paddingHorizontal: 5, paddingVertical: 2, flexDirection: "row", alignItems: "center", marginLeft: 5, marginTop: 5, },
  chipBtn: { marginLeft: 5, height: 20, width: 20, borderRadius: 20 / 2, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary }
})




