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
import { filterFromlist, memberStatusList, onlineStatusList, membershipStatusList, expireDaysList, appDownloadedStatusList } from './list'
import Toast from 'react-native-toast-message';
import showToast from '../../../functions/showToast';
import OptionModalWithSearch from '../../../components/OptionModalWithSearch';
import { useSelector } from 'react-redux';
import { access, selectUser } from '../../../redux/reducers/userSlice';
import isArray from '../../../functions/isArray';

const FilterModal = forwardRef(({ token, type, filterTheData, appliedFilter, isMembers, isNurture, isAllMembers, isNurtureAccessable }, ref) => {
  const calendarRef = useRef()
  const { access: { badge_levels: levelList } } = useSelector(selectUser);
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
  const [isAppDownloaded, setIsAppDownloaded] = useState("")
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    list: [],
    selectedFor: "",
    titleKey: "",
  })

  const [searchOptionModal, setSearchOptionModal] = useState({
    isVisible: false,
    list: [],
    selectedFor: "",
    titleKey: "",
    title: "",
  })
  const navigation = useNavigation();


  const reset = (clearSaved) => {
    if (!clearSaved) {
      setfilterFrom(filterFromlist[0]);
    }
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

  const checkFiltersApplied = () => {

    setfilterFrom(appliedFilter?.isSavedFilterApplied ? filterFromlist[1] : filterFromlist[0]);
    setSelectedSavedFilter((prev) => appliedFilter?.isSavedFilterApplied ? prev : null);

    setSalePage((prev) => !!appliedFilter?.event_page[0] ? prev : "");
    setPlan((prev) => !!appliedFilter?.event_page[0] ? prev : "");
    setNurture((prev) => !!appliedFilter?.nurture ? prev : "");
    setDelegate((prev) => !!appliedFilter?.delegate ? prev : "")
    setLeadStatus((prev) => {
      let list = [];
      prev.forEach((x) => {
        if (appliedFilter?.lead_status?.findIndex(y => y == x._id) > -1) {
          list.push(x)
        }
      })
      return list;
    });
    setSelectedLevel((prev) => {
      let list = [];
      prev.forEach((x) => {
        if (appliedFilter?.badge_levels?.findIndex(y => y == x._id) > -1) {
          list.push(x)
        }
      })
      return list;
    })
    setMemberStatus((prev) => typeof (appliedFilter?.status) != "string" ? prev : "");
    setOnlineStatus((prev) => !!appliedFilter?.user_status_type ? prev : "");
    setMembershipStatus((prev) => !!appliedFilter?.member_ship_expiry ? prev : "");
    setExpireIn((prev) => !!appliedFilter?.expiry_in && appliedFilter?.member_ship_expiry == "not_expired" ? prev : "")
    setMembershipExpiryStartDate((prev) => !!appliedFilter?.expiry_in && appliedFilter?.member_ship_expiry == "not_expired" && appliedFilter?.expiry_in == "custom" ? moment(appliedFilter?.membership_purchase_expiry_from, "YYYY-MM-DD") : moment());
    setMembershipExpiryEndDate((prev) => !!appliedFilter?.expiry_in && appliedFilter?.member_ship_expiry == "not_expired" && appliedFilter?.expiry_in == "custom" ? moment(appliedFilter?.membership_purchase_expiry_to, "YYYY-MM-DD") : moment());
    setShowDateRange((prev) => appliedFilter?.is_date_range == prev ? prev : false);
    setStartDate((prev) => !!appliedFilter?.is_date_range ? prev : null);
    setEndDate((prev) => !!appliedFilter?.is_date_range ? prev : null)
    setShowCoinsRange((prev) => !!appliedFilter?.coins_range ? prev : false);
    setCoinsFrom((prev) => !!appliedFilter?.coins_range ? prev : "0");
    setCoinsTo((prev) => !!appliedFilter?.coins_range ? prev : "0");
    setIsAppDownloaded((prev) => !!appliedFilter?.downloaded_app ? prev : "");
  }


  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      getFilterData();
      checkFiltersApplied()

    } else {
      if (!isApplied) {
        reset(false)
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
      // "community": [],
      "badge_levels": selectedLevel.map((x) => x._id),
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
      "downloaded_app": !!isAppDownloaded ? isAppDownloaded?.value : null
    }
    setApplied(!reset)
    filterTheData(obj, filterData, !!selectedSavedFilter, !reset);
    setIsVisible(false);

  }

  const clearAll = () => {
    reset(false);
    filterTheData(filteroObj, filterData, false, false)
    setIsVisible(false)
  }

  const getFilterData = async (searchText = "") => {
    let res = await GET_FILTER_DATA({ navigation, token, searchText, type });
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
    } else if (openFor == "appDownloaded") {
      list = appDownloadedStatusList
    }

    setOptionModal({
      isVisible: true,
      list: list,
      selectedFor: openFor,
      titleKey: title,
    })
  }

  const openSearchOptionModal = (openFor, title = undefined) => {
    let list = [];
    let heading = "";
    if (openFor == "savedfilter") {
      list = filterData?.saved_portal_filter;
      heading = "Saved Filters"
    } else if (openFor == "salepage") {
      list = filterData?.sale_pages
      heading = "Page"
    } else if (openFor == "plan") {
      list = !!salePage?.payment_plans ? salePage?.payment_plans : []
      heading = "Plan"
    } else if (openFor == "leadstatus") {
      heading = "Lead Status"
      filterData?.lead_status.forEach(x => {
        if (leadStatus.findIndex(y => y._id == x._id) == -1) {
          list.push(x)
        }
      })
    } else if (openFor == "level") {
      heading = "Level"
      levelList.forEach(x => {
        if (x?.is_access) {
          if (selectedLevel.findIndex(y => y?._id == x?._id) == -1) {
            list.push(x)
          }
        }
      })
    }


    setSearchOptionModal({
      isVisible: true,
      list: list,
      selectedFor: openFor,
      titleKey: title,
      title: heading
    })
  }

  const onOptionSelected = (seletecOpt) => {
    let selectedFor;
    if (optionModal.isVisible) {
      selectedFor = optionModal.selectedFor;
      setOptionModal({
        isVisible: false,
        list: [],
        selectedFor: "",
        titleKey: ""
      })
    } else {
      selectedFor = searchOptionModal.selectedFor;
      setSearchOptionModal({
        isVisible: false,
        list: [],
        selectedFor: "",
        titleKey: "",
        title: ""
      })
    }

    if (selectedFor == "filterType") {
      setfilterFrom(seletecOpt)
    } else if (selectedFor == "savedfilter") {
      let filterObj = seletecOpt?.filter_object;
      console.log(filterObj, "filterObj")
      setSelectedSavedFilter(seletecOpt);
      setSalePage(filterObj?.event_page);
      setPlan(filterObj?.event_page?.payment_plans.find(x => x._id == filterObj?.plan?._id));
      setNurture(!!filterObj?.nurture ? filterObj?.nurture : "");
      setDelegate(!!filterObj?.delegate ? filterObj?.delegate : "");
      setLeadStatus(filterObj?.lead_status);
      setSelectedLevel(() => {
        let list = []
        console.log(levelList, "levelList")
        levelList.forEach((item) => {
          if (filterObj?.badge_levels.some(x => x._id == item?._id)) {
            console.log(item, "item")
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
      setIsAppDownloaded(!!filterObj?.downloaded_app ? appDownloadedStatusList.find(x => x.value == filterObj?.downloaded_app?.value) : null);

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
    } else if (selectedFor == "appDownloaded") {
      setIsAppDownloaded(seletecOpt)
    }
  }

  const filterDataLocally = (oldlist, text) => {
    let titleKey = searchOptionModal.titleKey;

    return oldlist.slice().filter(x => x[titleKey].toLowerCase().includes(text.trim().toLowerCase()));

  }



  const openCalendarFor = (openFor, date) => {
    setCalenderFor(openFor)
    calendarRef?.current?.openModal(date)
  }

  const onDateSelected = (date) => {


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


  const closeSearchOptionModal = () => {
    setSearchOptionModal({
      isVisible: false,
      list: [],
      selectedFor: "",
      title: ""
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
                onPress={() => setSelectedLevel((prev) => prev.filter(x => x._id != item?._id))}>
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
              label='Saved Filter'
              value={selectedSavedFilter?.filter_name}
              onPress={() => openSearchOptionModal("savedfilter", "filter_name")}
              icon={() => icons.down(colors.primary, 15)}
              subTextView={() => !!selectedSavedFilter && (
                <Pressable
                  style={__styles.clearbtnView}
                  onPress={() => reset(true)}>
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
                onPress={() => openSearchOptionModal("salepage", "sale_page_title")}
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
                onPress={() => openSearchOptionModal("plan", "plan_title")}
                icon={() => icons.down(colors.primary, 15)}
                subTextView={() => !!plan && (
                  <Pressable
                    style={__styles.clearbtnView}
                    onPress={() => setPlan("")}>
                    <MyText color={colors.primary} >Clear</MyText>
                  </Pressable>
                )}
              />
              {!isNurture && isNurtureAccessable &&
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
              }
              {!isMembers &&
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
                />}

              {/* <MyTouchableInput
            label='Choose Delegate'
          /> */}

              <MyTouchableInput
                view={selectedleadStatusView}
                iconOnPress={() => openSearchOptionModal("leadstatus", "title")}
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
                label='Badge Levels'
                view={selectedlevelView}
                iconOnPress={() => openSearchOptionModal("level", "title")}
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
                subTextView={() => !!memberStatus && (
                  <Pressable
                    style={__styles.clearbtnView}
                    onPress={() => setMemberStatus("")}>
                    <MyText color={colors.primary} >Clear</MyText>
                  </Pressable>
                )}
              />

              <MyTouchableInput
                label='Online Status'
                value={onlineStatus?.title}
                onPress={() => openOptionModal("onlinestatus", "title")}
                icon={() => icons.down(colors.primary, 15)}
                subTextView={() => !!onlineStatus && (
                  <Pressable
                    style={__styles.clearbtnView}
                    onPress={() => setOnlineStatus("")}>
                    <MyText color={colors.primary} >Clear</MyText>
                  </Pressable>
                )}
              />

              <MyTouchableInput
                label='App Downloaded Status'
                value={isAppDownloaded?.title}
                onPress={() => openOptionModal("appDownloaded", "title")}
                icon={() => icons.down(colors.primary, 15)}
                subTextView={() => !!isAppDownloaded && (
                  <Pressable
                    style={__styles.clearbtnView}
                    onPress={() => setIsAppDownloaded("")}>
                    <MyText color={colors.primary} >Clear</MyText>
                  </Pressable>
                )}
              />

              <MyTouchableInput
                label='Membership Status'
                value={membershipStatus?.title}
                onPress={() => openOptionModal("membershipstatus", "title")}
                icon={() => icons.down(colors.primary, 15)}
                subTextView={() => !!membershipStatus && (
                  <Pressable
                    style={__styles.clearbtnView}
                    onPress={() => setMembershipStatus("")}>
                    <MyText color={colors.primary} >Clear</MyText>
                  </Pressable>
                )}
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
                        icon={() => icons.calendar(colors.primary, 20)}
                        onPress={() => openCalendarFor("MESD", membershipExpiryStartDate)}
                      />


                      <MyTouchableInput
                        label='Membership Expiry End Date'
                        value={moment(membershipExpiryEndDate).format(dateTimeFormat.date)}
                        icon={() => icons.calendar(colors.primary, 20)}
                        onPress={() => openCalendarFor("MEED", membershipExpiryEndDate)}
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
                    icon={() => icons.calendar(colors.primary, 20)}
                    onPress={() => openCalendarFor("SD", startDate)}
                  />

                  <MyTouchableInput
                    label='End Date*'
                    value={!!endDate ? moment(endDate).format(dateTimeFormat.date) : ""}
                    icon={() => icons.calendar(colors.primary, 20)}
                    onPress={() => openCalendarFor("ED", endDate)}
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

        <OptionModalWithSearch
          closeModal={closeSearchOptionModal}
          isVisible={searchOptionModal.isVisible}
          onSelected={onOptionSelected}
          optionList={searchOptionModal.list}
          titleKey={searchOptionModal.titleKey}
          noIcon={true}
          title={searchOptionModal?.title}
          filterTheList={filterDataLocally}
        />

        <OptionModalWithSearch
          closeModal={() => setNurtureModalVisibilty(false)}
          isVisible={nurtureModalVisibilty}
          onSelected={onNutureSelected}
          optionList={!!filterData?.delegates_list ? filterData?.delegates_list : []}
          renderText={({ item }) => <MyText style={{ textTransform: "capitalize" }} >{`${item?.first_name} ${item?.last_name} | ${item?.team_type}`}</MyText>}
          noIcon={true}
          title="Nurture"
          onSearchTextChange={(text) => getFilterData(text)}
        />


        <OptionModalWithSearch
          closeModal={() => setDeletegateModalVisibility(false)}
          isVisible={deletegateModalVisibility}
          onSelected={onDelegateSelected}
          optionList={!!filterData?.delegates_list ? filterData?.delegates_list : []}
          renderText={({ item }) => <MyText style={{ textTransform: "capitalize" }} >{`${item?.first_name} ${item?.last_name} | ${item?.team_type}`}</MyText>}
          noIcon={true}
          title="Delegate"
          onSearchTextChange={(text) => getFilterData(text)}
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

const filteroObj = {
  // "community": [],
  "badge_levels": [],
  "event_page": [],
  "lead_status": [],
  "plan": null,
  "nurture": null,
  "delegate": null,
  "is_date_range": false,
  "coins_range": false,
  "coins_from": 0,
  "coins_to": 0,
  "from_date": null,
  "to_date": null,
  "membership_purchase_expiry_from": moment(),
  "membership_purchase_expiry_to": moment(),
  "date": null,
  "coins": null,
  "membership_expiry": null,
  "status": "",
  "expiry_in": 3,
  "member_ship_expiry": "",
  "user_status_type": "",
  "downloaded_app": null
}


const __styles = StyleSheet.create({
  clearbtnView: {
    paddingBottom: 5, paddingLeft: 10, paddingRight: 5
  },
  chipRoot: { flexDirection: "row", flex: 1, alignItems: "center", flexWrap: "wrap", paddingVertical: 2 },
  chipView: { backgroundColor: colors.chip, borderRadius: 15, paddingHorizontal: 5, paddingVertical: 2, flexDirection: "row", alignItems: "center", marginLeft: 5, marginTop: 5, },
  chipBtn: { marginLeft: 5, height: 20, width: 20, borderRadius: 20 / 2, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary }
})




