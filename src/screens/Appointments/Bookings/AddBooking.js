import {View, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {
  BOOKING_ADD,
  BOOKING_CONSULTANT_LIST,
  BOOKING_CONSULTANT_LIST_V1,
  BOOKING_PASS,
  BOOKING_UPDATE,
  GET_BOOKING_TIME_SLOTS,
  GET_BOOKING_TIME_SLOTS_BY_CONSULTANT,
} from '../../../DAL';
import MyTouchableInput from '../../../components/MyTouchableInput';
import {MyButton} from '../../../components/MyButton';
import OptionModalWithSearch from '../../../components/OptionModalWithSearch';
import CalendarModal from '../../../components/CalendarModal';
import moment from 'moment';
import {dateTimeFormat} from '../../../utilities/constants';
import showToast from '../../../functions/showToast';
import routes from '../../../navigation/routes';
import MyLoader from '../../../components/MyLoader';
import {icons} from '../../../utilities/icons';
import {colors} from '../../../utilities/colors';
import MyCheckBox from '../../../components/MyCheckBox';
import {STRINGS} from '../../../utilities/strings';

const AddBooking = ({navigation, route}) => {
  const ref_calendar = useRef();
  const {token, access, user} = useSelector(selectUser);
  const {editableItem, type} = route?.params;
  const isEdit = type == 'edit';
  const isPass = type == 'pass';
  const isAdd = type == 'add';
  const [memberlist, setMemberlist] = useState([]);
  const [pageList, setPageList] = useState([]);
  const [timeSlotlist, setTimeSlotlist] = useState([]);
  const [consultantList, setConsultantList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [optionModal, setOptionModal] = useState({
    isVisble: false,
    list: [],
    type: '',
    titleKey: '',
  });
  const [member, setMember] = useState(null);
  const [consultant, setConsultant] = useState(
    access?.book_call_with_delegate == 'self' ? user : null,
  );
  const [bookingPage, setBookingPage] = useState(
    !isAdd ? editableItem?.page : null,
  );
  const [date, setDate] = useState(
    !isAdd ? moment(editableItem?.date) : moment(),
  );
  const [loader, setLoader] = useState(false);
  const [timeSlot, setTimeSlot] = useState(
    isEdit
      ? {
          end_time: moment(editableItem?.time, 'hh:mm A')
            .add({minutes: editableItem?.slot_duration})
            .format('hh:mm A'),
          start_time: editableItem?.time,
          slot_id: editableItem?.slot_id,
          slot_duration: editableItem?.slot_duration,
        }
      : null,
  );
  const [isNotifyUser, setIsNotifyUser] = useState(false);

  useEffect(() => {
    if (isPass) {
      getBookingConsutantFromServer();
    } else {
      if (optionModal?.isVisble) {
        if (
          optionModal?.type != STRINGS.ADD_BOOKING.bookingPageType &&
          optionModal?.type != STRINGS.ADD_BOOKING.timeSlotType
        ) {
          getBookingsPagesFromServer();
        } else if (optionModal?.type == STRINGS.ADD_BOOKING.bookingPageType) {
          getPagesFromServer();
        } else if (optionModal?.type == STRINGS.ADD_BOOKING.timeSlotType) {
          getBookingsTimeSlotsFromServer();
        }
      }
    }
  }, [searchText, optionModal?.isVisble]);

  // useEffect(() => {
  //   if (optionModal?.isVisble) {
  //     getBookingsPagesFromServer()
  //   }
  // }, [optionModal?.isVisble])

  useEffect(() => {
    if (!isPass) {
      getPagesFromServer();
    }
    if (consultant?._id) {
      getBookingsTimeSlotsFromServer();
    }
  }, [date, consultant?._id]);

  const onSearchTextChange = text => {
    if (
      optionModal.type == STRINGS.ADD_BOOKING.memberType ||
      optionModal.type == STRINGS.ADD_BOOKING.delegateType
    ) {
      setSearchText(text);
    }
  };

  const closeOptionModal = () => {
    optionModal.isVisble = false;
    optionModal.list = [];
    optionModal.type = '';
    optionModal.titleKey = '';
    // let obj = { isVisble: false, list: [], type: "", titleKey: "" }
    setOptionModal({...optionModal});
    setSearchText('');
  };

  const onSelected = opt => {
    let {titleKey, type} = optionModal;
    closeOptionModal();

    if (type == STRINGS.ADD_BOOKING.memberType) {
      setMember(opt);
    } else if (type == STRINGS.ADD_BOOKING.delegateType) {
      setConsultant(opt);
      if (!isPass) {
        setBookingPage(null);
      }
      setTimeSlot(null);
    } else if (type == STRINGS.ADD_BOOKING.bookingPageType) {
      setBookingPage(opt);
    } else if (type == STRINGS.ADD_BOOKING.timeSlotType) {
      setTimeSlot(opt);
    }
  };

  const filterTheList = (list, text) => {
    if (optionModal.type == STRINGS.ADD_BOOKING.memberType) {
      return list;
    } else if (optionModal.type == STRINGS.ADD_BOOKING.delegateType) {
      if (text.trim() == '') {
        return list;
      } else {
        return list?.slice().filter(x => {
          let nameText = (
            x?.first_name +
            ' ' +
            x?.last_name +
            ' (' +
            x?.email +
            ')'
          ).toLowerCase();
          let searchText = text?.toLowerCase().trim();
          return nameText.includes(searchText);
        });
      }
    } else if (optionModal.type == STRINGS.ADD_BOOKING.bookingPageType) {
      if (text.trim() == '') {
        return list;
      } else {
        return list
          ?.slice()
          .filter(x =>
            x.sale_page_title.toLowerCase().includes(text.toLowerCase().trim()),
          );
      }
    } else if (optionModal.type == STRINGS.ADD_BOOKING.timeSlotType) {
      if (text.trim() == '') {
        return list;
      } else {
        let search = text.toLowerCase().trim();
        return list
          ?.slice()
          .filter(x =>
            (x.start_time + '  -  ' + x.end_time)
              .toLowerCase()
              .includes(search),
          );
      }
      // return list?.slice().filter(x => x.sale_page_title.toLowerCase().includes(text.toLowerCase().trim()))
    }
  };

  const onSubmit = () => {
    if (!member && isAdd) {
      showToast({
        body: STRINGS.ADD_BOOKING.memberNameEmpty,
        title: STRINGS.ADD_BOOKING.alert,
        type: 'info',
      });
    } else if (
      access?.book_call_with_delegate == 'other' &&
      !!consultant == false &&
      isAdd
    ) {
      showToast({
        body: STRINGS.ADD_BOOKING.selectDelegate,
        title: STRINGS.ADD_BOOKING.alert,
        type: 'info',
      });
    } else if (!bookingPage && !isPass) {
      showToast({
        body: STRINGS.ADD_BOOKING.bookingPageEmpty,
        title: STRINGS.ADD_BOOKING.alert,
        type: 'info',
      });
    } else if (!date) {
      showToast({
        body: STRINGS.ADD_BOOKING.dateEmpty,
        title: STRINGS.ADD_BOOKING.alert,
        type: 'info',
      });
    } else if (!timeSlot) {
      showToast({
        body: STRINGS.ADD_BOOKING.timeSlotEmpty,
        title: STRINGS.ADD_BOOKING.alert,
        type: 'info',
      });
    } else {
      let data = {
        date: moment(date).format('YYYY/MM/DD'),
        member_id: member?._id,
        page_id: bookingPage?._id,
        slot_id: timeSlot?.slot_id,
        time: timeSlot?.start_time,
      };
      setLoader(true);
      if (isPass) {
        data['consultant_id'] = consultant?._id;
        delete data['member_id'];
        delete data['page_id'];
        passBookingToOtherDelegate(data);
      } else if (isEdit) {
        data['is_notify'] = isNotifyUser;
        delete data['member_id'];
        updateBookingToServer(data);
      } else {
        data['consultant_id'] = consultant?._id;
        addBookingToServer(data);
      }
    }
  };

  const addBookingToServer = async obj => {
    let res = await BOOKING_ADD({navigation, token, data: obj});
    setLoader(false);
    if (res.code == 200) {
      navigation.navigate(routes?.bookingList, {
        callList: true,
      });
    }
  };

  const updateBookingToServer = async obj => {
    let res = await BOOKING_UPDATE({
      navigation,
      token,
      data: obj,
      bookingId: editableItem?._id,
    });
    setLoader(false);
    if (res.code == 200) {
      navigation.navigate(routes?.bookingList, {
        callList: true,
      });
    }
  };

  const passBookingToOtherDelegate = async obj => {
    let res = await BOOKING_PASS({
      navigation,
      token,
      data: obj,
      bookingId: editableItem?._id,
    });
    setLoader(false);
    if (res.code == 200) {
      navigation.navigate(routes?.bookingList, {
        callList: false,
      });
    }
  };

  const getBookingsPagesFromServer = async () => {
    let res = await BOOKING_CONSULTANT_LIST_V1({
      navigation,
      token,
      body: {
        data_type:
          optionModal?.type == STRINGS.ADD_BOOKING.delegateType
            ? 'delegates'
            : 'members',
        member_type:
          optionModal?.type == STRINGS.ADD_BOOKING.memberType
            ? access?.show_members_list_for_booking
            : undefined,
        delegates_type:
          optionModal?.type == STRINGS.ADD_BOOKING.delegateType
            ? access?.book_call_with_delegate == 'other'
              ? access?.other_delegate_team_type
              : user?.team_type
            : undefined,
        consultant_id: undefined,
        search_text: searchText.trim(),
      },
    });
    if (res.code == 200) {
      if (optionModal?.type == STRINGS.ADD_BOOKING.delegateType) {
        setConsultantList(res?.data);
      } else if (optionModal?.type == STRINGS.ADD_BOOKING.memberType) {
        setMemberlist(res?.data);
      }
      if (optionModal.isVisble) {
        setOptionModal({...optionModal, list: res?.data});
      }
      // setPageList(res?.Sale_page);
      // setMemberlist(res?.members);
      // if (optionModal.isVisble && optionModal?.type == "Member") {
      //   setOptionModal({ ...optionModal, list: res?.members })
      // }
    }
  };

  const getPagesFromServer = async () => {
    let res = await BOOKING_CONSULTANT_LIST_V1({
      navigation,
      token,
      body: {
        data_type: 'sale_page',
        consultant_id: consultant?._id,
      },
    });
    if (res.code == 200) {
      setPageList(res?.data);
      if (optionModal.isVisble) {
        setOptionModal({...optionModal, list: res?.data});
      }
    }
  };

  const getBookingConsutantFromServer = async () => {
    let res = await BOOKING_CONSULTANT_LIST({navigation, token});
    if (res.code == 200) {
      setConsultantList(res?.consultant_list);
    }
  };

  const getBookingsTimeSlotsFromServer = async () => {
    let res;
    if (!isEdit) {
      res = await GET_BOOKING_TIME_SLOTS_BY_CONSULTANT({
        navigation,
        token,
        date: moment(date).format('YYYY/MM/DD'),
        consultant_id: consultant?._id,
      });
    } else {
      res = await GET_BOOKING_TIME_SLOTS({
        navigation,
        token,
        date: moment(date).format('YYYY/MM/DD'),
      });
    }
    if (res.code == 200) {
      if (
        optionModal.isVisble &&
        optionModal?.type == STRINGS.ADD_BOOKING.timeSlotType
      ) {
        setOptionModal({...optionModal, list: res?.slots});
      }
      setTimeSlotlist(res?.slots);
    }
  };

  return (
    <RootView
      title={
        isPass
          ? STRINGS.ADD_BOOKING.passBooking
          : isEdit
          ? STRINGS.ADD_BOOKING.editBooking
          : STRINGS.ADD_BOOKING.addNewBooking
      }>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {!isEdit && !isPass && (
          <MyTouchableInput
            label={STRINGS.ADD_BOOKING.member}
            onPress={() =>
              setOptionModal({
                isVisble: true,
                list: memberlist,
                type: STRINGS.ADD_BOOKING.memberType,
                titleKey: '',
              })
            }
            value={
              !!member
                ? `${member?.first_name} ${member?.last_name} (${member?.email})`
                : ''
            }
            clearbutton={!!member}
            onClearButtonPress={() => {
              setMember(null);
            }}
          />
        )}

        {/* {isPass && */}
        {access?.book_call_with_delegate == 'other' && !isEdit && (
          <MyTouchableInput
            label={STRINGS.ADD_BOOKING.delegate}
            onPress={() =>
              setOptionModal({
                isVisble: true,
                list: consultantList,
                type: STRINGS.ADD_BOOKING.delegateType,
                titleKey: '',
              })
            }
            value={
              !!consultant
                ? `${consultant?.first_name} ${consultant?.last_name} (${consultant?.email})`
                : ''
            }
            clearbutton={!!consultant}
            onClearButtonPress={() => {
              setConsultant(null);
              if (!isPass) {
                setBookingPage(null);
              }
              setTimeSlot(null);
            }}
          />
        )}

        {!isEdit && (
          <MyTouchableInput
            label={
              isPass
                ? STRINGS.ADD_BOOKING.pageTitle
                : STRINGS.ADD_BOOKING.bookingPage
            }
            onPress={() =>
              setOptionModal({
                isVisble: true,
                list: pageList,
                type: STRINGS.ADD_BOOKING.bookingPageType,
                titleKey: 'sale_page_title',
              })
            }
            value={!!bookingPage ? bookingPage?.sale_page_title : ''}
            clearbutton={!!bookingPage}
            onClearButtonPress={() => setBookingPage(null)}
            disabled={isPass || isEdit}
          />
        )}

        <MyTouchableInput
          label={STRINGS.ADD_BOOKING.date}
          onPress={() => ref_calendar?.current?.openModal(date)}
          value={!!date ? moment(date).format(dateTimeFormat.date) : ''}
          icon={() => icons.calendar(colors.primary)}
        />

        <MyTouchableInput
          label={STRINGS.ADD_BOOKING.timeSlots}
          onPress={() =>
            setOptionModal({
              isVisble: true,
              list: timeSlotlist,
              type: STRINGS.ADD_BOOKING.timeSlotType,
              titleKey: '',
            })
          }
          value={
            !!timeSlot
              ? `${timeSlot?.start_time}  -  ${timeSlot?.end_time}`
              : ''
          }
          clearbutton={!!timeSlot}
          onClearButtonPress={() => setTimeSlot(null)}
        />
        {isPass && !!consultant && (
          <View style={styles.timezoneContainer}>
            <MyText>{consultant?.time_zone}</MyText>
          </View>
        )}
        {isEdit && (
          <View style={styles.radioRootView}>
            <MyText isLabel>{STRINGS.ADD_BOOKING.isNotifyUser}</MyText>
            <View style={styles.radioView}>
              <View style={styles.radioItem}>
                <MyCheckBox
                  title={STRINGS.ADD_BOOKING.yes}
                  onPress={() => setIsNotifyUser(true)}
                  value={isNotifyUser}
                />
              </View>
              <View style={styles.radioItem}>
                <MyCheckBox
                  title={STRINGS.ADD_BOOKING.no}
                  onPress={() => setIsNotifyUser(false)}
                  value={!isNotifyUser}
                />
              </View>
            </View>
          </View>
        )}

        <View>
          <MyButton title={STRINGS.ADD_BOOKING.save} onPress={onSubmit} />
        </View>
      </ScrollView>

      <MyLoader enable={loader} />

      <OptionModalWithSearch
        isVisible={optionModal?.isVisble}
        closeModal={closeOptionModal}
        onSelected={onSelected}
        optionList={optionModal.list}
        filterTheList={filterTheList}
        titleKey={optionModal?.titleKey}
        title={optionModal?.type}
        onSearchTextChange={onSearchTextChange}
        renderText={
          !optionModal?.titleKey
            ? ({item, index}) => (
                <MyText fontSize={16}>
                  {optionModal?.type == STRINGS.ADD_BOOKING.memberType ||
                  optionModal?.type == STRINGS.ADD_BOOKING.delegateType
                    ? item?.first_name +
                      ' ' +
                      item?.last_name +
                      ' (' +
                      item?.email +
                      ')'
                    : optionModal?.type == STRINGS.ADD_BOOKING.timeSlotType
                    ? `${item?.start_time}  -  ${item?.end_time}`
                    : ''}
                </MyText>
              )
            : undefined
        }
      />

      <CalendarModal
        ref={ref_calendar}
        onDateSelected={date => {
          setDate(date);
          setTimeSlot(null);
        }}
        minimum={moment()}
      />
    </RootView>
  );
};

export default AddBooking;

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  timezoneContainer: {
    paddingBottom: 15,
  },
  radioRootView: {
    marginBottom: 15,
  },
  radioView: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  radioItem: {
    flex: 1,
  },
});
