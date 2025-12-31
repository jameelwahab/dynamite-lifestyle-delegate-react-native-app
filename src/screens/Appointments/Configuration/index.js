import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Vibration,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import {useSelector} from 'react-redux';
import {selectNavbar} from '../../../redux/reducers/navbarSlice';
import {selectUser} from '../../../redux/reducers/userSlice';
import {
  APPOINTMENT_CONFIG_ADD,
  GET_APPOINTMENT_CONFIG_LIST,
} from '../../../DAL';
import {colors} from '../../../utilities/colors';
import MyCheckBox from '../../../components/MyCheckBox';
import MyTouchableInput from '../../../components/MyTouchableInput';
import {icons} from '../../../utilities/icons';
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
  OpacityDecorator,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import uuid from 'react-native-uuid';
import moment from 'moment';
import {dateTimeFormat} from '../../../utilities/constants';
import MyInputs from '../../../components/MyInputs';
import CalendarModal from '../../../components/CalendarModal';
import MyDateTimePicker from '../../../components/MyDateTimePicker';
import ConfirmationModal from '../../../components/ConfirmationModal';
import FAB from '../../../components/FAB';
import {MyButton} from '../../../components/MyButton';
import showToast from '../../../functions/showToast';
import MyLoader from '../../../components/MyLoader';
import MyRefreshControl from '../../../components/MyRefreshControl';
import {STRINGS} from '../../../utilities/strings';

const Configurations = ({navigation, route}) => {
  const {parentValue, value} = route.params;
  const ref_calendar = useRef();
  const ref_scroller = useRef();
  const {navbar} = useSelector(selectNavbar);
  const [title] = useState(
    navbar
      ?.find(x => x.value == parentValue)
      ?.child_options?.find(y => y.value == value)?.title,
  );
  const {token} = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirm, setConfirm] = useState({
    isVisible: false,
    text: '',
    index: -1,
    type: '',
  });
  const [timePicker, setTimePicker] = useState({
    isVisible: false,
    pIndex: -1,
    cIndex: -1,
    date: moment().toDate(),
    type: '',
  });

  const slot = () => {
    let id = uuid.v4();
    return {
      end_time: '00:00',
      slot_id: id,
      start_time: '00:00',
    };
  };

  const interval = () => {
    let mSlot = slot();
    let id = uuid.v4();
    return {
      appointment_configration_name: '',
      days: [],
      end_date: moment().toISOString(),
      interval_id: id,
      slot_duration: '',
      slot_type: '',
      slots: [mSlot],
      start_date: moment().toISOString(),
    };
  };

  const onDateSelected = (date, type) => {
    handler({[type.type]: date}, type?.index);
  };

  const closeConfirmModal = () => {
    setConfirm({isVisible: false, text: '', item: null, index: -1});
  };
  const closeTimePicker = () => {
    setTimePicker({
      isVisible: false,
      pIndex: -1,
      cIndex: -1,
      date: moment().toDate(),
      type: '',
    });
  };

  const onTimeSelected = time => {
    let {pIndex, cIndex, type} = timePicker;
    closeTimePicker();
    list[pIndex].slots[cIndex][type] = moment(time).format('HH:mm');
    setList([...list]);
  };

  const onAgree = () => {
    let {type, index} = confirm;
    closeConfirmModal();
    if (type == 'duplicate') {
      dublicateTheInterval(index);
    } else if (type == 'delete') {
      deleteTheInterval(index);
    }
  };

  const dublicateTheInterval = index => {
    let interval = {...list[index]};
    list.push(interval);
    setList([...list]);
  };

  const deleteTheInterval = index => {
    list.splice(index, 1);
    setList([...list]);
  };

  const addNew = () => {
    let obj = interval();
    setList([...list, obj]);
  };

  const onDragEnd = (data, index) => {
    list[index].slots = data;
    setList([...list]);
  };
  const onSubmit = () => {
    for (let i = 0; i < list.length; i++) {
      let interval = list[i];
      let inteval_number = i + 1;
      if (interval?.slot_type == '') {
        showToast({
          title: STRINGS.APPOINTMENT_CONFIGURATION.alert,
          body: `${STRINGS.APPOINTMENT_CONFIGURATION.selectIntervalType}${inteval_number}`,
        });
        return;
      } else if (interval?.slot_duration == '') {
        showToast({
          title: STRINGS.APPOINTMENT_CONFIGURATION.alert,
          body: `${STRINGS.APPOINTMENT_CONFIGURATION.enterSlotDuration}${inteval_number}`,
        });
        return;
      } else if (interval?.days.length == 0) {
        showToast({
          title: STRINGS.APPOINTMENT_CONFIGURATION.alert,
          body: `${STRINGS.APPOINTMENT_CONFIGURATION.selectWeekdays}${inteval_number}`,
        });
        return;
      }
    }

    addIntervalsToServer();
  };

  const addIntervalsToServer = async () => {
    setLoader(true);
    let res = await APPOINTMENT_CONFIG_ADD({
      navigation,
      token,
      body: {appointments: list},
    });
    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    getConfigListFromServer();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getConfigListFromServer();
  };

  const getConfigListFromServer = async () => {
    let res = await GET_APPOINTMENT_CONFIG_LIST({navigation, token});
    if (res.code == 200) {
      setList(res?.appointments);
      setLoader(false);
      setRefreshing(false);
    } else {
      setLoader(false);
      setRefreshing(false);
    }
  };

  const handler = (obj, index) => {
    list[index] = {...list[index], ...obj};
    setList([...list]);
  };

  const handlerWeekdays = (day, index) => {
    let days = list[index].days;
    let dINDEX = days.findIndex(x => x == day.fullName);
    if (dINDEX > -1) {
      days.splice(dINDEX, 1);
    } else {
      days.push(day.fullName);
    }
    handler({days: [...days]}, index);
  };

  const removeSlot = (pIndex, cIndex) => {
    list[pIndex].slots.splice(cIndex, 1);
    setList([...list]);
  };

  const addSlot = pIndex => {
    list[pIndex].slots = [...list[pIndex].slots, slot()];
    setList([...list]);
  };

  const renderSlots = ({item, drag, total, cIndex, pIndex}) => {
    return (
      <ScaleDecorator activeScale={1.05}>
        <OpacityDecorator activeOpacity={0.6}>
          <View style={styles.slotContainer}>
            <View style={styles.slotRow}>
              <View style={styles.slotItem}>
                <MyTouchableInput
                  label={STRINGS.APPOINTMENT_CONFIGURATION.from}
                  icon={() => icons.clock(colors.lightText)}
                  value={moment(item?.start_time, 'HH:mm').format('hh:mm A')}
                  onPress={() =>
                    setTimePicker({
                      isVisible: true,
                      pIndex,
                      cIndex,
                      date: moment(item?.start_time, 'HH:mm').toDate(),
                      type: 'start_time',
                    })
                  }
                />
              </View>
              <View style={styles.slotItemWithMargin}>
                <MyTouchableInput
                  label={STRINGS.APPOINTMENT_CONFIGURATION.to}
                  icon={() => icons.clock(colors.lightText)}
                  value={moment(item?.end_time, 'HH:mm').format('hh:mm A')}
                  onPress={() =>
                    setTimePicker({
                      isVisible: true,
                      pIndex,
                      cIndex,
                      type: 'end_time',
                      date: moment(item?.end_time, 'HH:mm').toDate(),
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.slotButtonsRow}>
              {total > 1 && (
                <TouchableOpacity
                  onPress={() => removeSlot(pIndex, cIndex)}
                  style={styles.btn}>
                  {icons.minusCircle(colors.delete)}
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => addSlot(pIndex)}
                style={styles.btn}>
                {icons.plusCircle()}
              </TouchableOpacity>
              {total > 1 && (
                <TouchableHighlight
                  hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
                  delayLongPress={300}
                  underlayColor={colors.lightPrimary2}
                  onLongPress={() => {
                    Vibration.vibrate(10);
                    drag();
                  }}
                  style={styles.dragButton}>
                  {icons.drag(colors.primary, 25)}
                </TouchableHighlight>
              )}
            </View>
          </View>
        </OpacityDecorator>
      </ScaleDecorator>
    );
  };

  const renderConfig = (item, index) => {
    return (
      <View style={styles.itemView}>
        <View style={styles.configHeaderRow}>
          <MyText type="bold">{index + 1 + '.'}</MyText>

          <TouchableOpacity
            onPress={() =>
              setConfirm({
                isVisible: true,
                text: STRINGS.APPOINTMENT_CONFIGURATION.duplicateConfirmation,
                index,
                type: 'duplicate',
              })
            }
            style={styles.duplicateButton}>
            {icons.duplicate()}
            <MyText type="bold">
              {' '}
              {STRINGS.APPOINTMENT_CONFIGURATION.duplicate}
            </MyText>
          </TouchableOpacity>
        </View>
        <View style={styles.radioRootView}>
          <MyText isLabel>
            {STRINGS.APPOINTMENT_CONFIGURATION.intervalType}
          </MyText>
          <View style={styles.radioView}>
            <View style={styles.radioItem}>
              <MyCheckBox
                title={STRINGS.APPOINTMENT_CONFIGURATION.builtIn}
                value={item?.slot_type == 'builtin'}
                onPress={() => handler({slot_type: 'builtin'}, index)}
              />
            </View>
            <View style={styles.radioItem}>
              <MyCheckBox
                title={STRINGS.APPOINTMENT_CONFIGURATION.custom}
                value={item?.slot_type == 'custom'}
                onPress={() => handler({slot_type: 'custom'}, index)}
              />
            </View>
          </View>
        </View>

        {item?.slot_type == 'builtin' && (
          <View style={styles.radioRootView}>
            <MyText isLabel>
              {STRINGS.APPOINTMENT_CONFIGURATION.slotDuration}
            </MyText>
            <View style={styles.slotDurationContainer}>
              <View style={styles.slotDurationRow}>
                <View style={styles.radioItem}>
                  <MyCheckBox
                    title={STRINGS.APPOINTMENT_CONFIGURATION.min15}
                    onPress={() => handler({slot_duration: '15'}, index)}
                    value={item?.slot_duration == '15'}
                  />
                </View>
                <View style={styles.radioItem}>
                  <MyCheckBox
                    title={STRINGS.APPOINTMENT_CONFIGURATION.min30}
                    value={item?.slot_duration == '30'}
                    onPress={() => handler({slot_duration: '30'}, index)}
                  />
                </View>
              </View>

              <View style={styles.slotDurationRow}>
                <View style={styles.radioItem}>
                  <MyCheckBox
                    title={STRINGS.APPOINTMENT_CONFIGURATION.min45}
                    onPress={() => handler({slot_duration: '45'}, index)}
                    value={item?.slot_duration == '45'}
                  />
                </View>
                <View style={styles.radioItem}>
                  <MyCheckBox
                    title={STRINGS.APPOINTMENT_CONFIGURATION.min60}
                    value={item?.slot_duration == '60'}
                    onPress={() => handler({slot_duration: '60'}, index)}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {item?.slot_type == 'custom' && (
          <MyInputs
            label={STRINGS.APPOINTMENT_CONFIGURATION.customDurationInMin}
            value={item?.slot_duration}
            onChangeText={text => handler({slot_duration: text}, index)}
            keyboardType="number-pad"
          />
        )}

        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <MyTouchableInput
              label={STRINGS.APPOINTMENT_CONFIGURATION.startDate}
              icon={() => icons.calendar(colors.lightText)}
              value={moment(item?.start_date).format(dateTimeFormat.date)}
              onPress={() =>
                ref_calendar?.current?.openModal(item?.start_date, {
                  type: 'start_date',
                  index: index,
                })
              }
            />
          </View>
          <View style={styles.dateItemWithMargin}>
            <MyTouchableInput
              label={STRINGS.APPOINTMENT_CONFIGURATION.endDate}
              icon={() => icons.calendar(colors.lightText)}
              value={moment(item?.end_date).format(dateTimeFormat.date)}
              onPress={() =>
                ref_calendar?.current?.openModal(item?.end_date, {
                  type: 'end_date',
                  index: index,
                })
              }
            />
          </View>
        </View>

        <View style={styles.flatListContainer}>
          <NestableDraggableFlatList
            ref={ref_scroller}
            data={item?.slots}
            renderItem={({item: item2, drag, getIndex}) =>
              renderSlots({
                item: item2,
                drag,
                cIndex: getIndex(),
                pIndex: index,
                total: item?.slots.length,
              })
            }
            keyExtractor={item2 => item2.slot_id}
            scrollEnabled={false}
            onDragEnd={({data}) => onDragEnd(data, index)}
          />
        </View>

        <View style={styles.radioRootView}>
          <MyText isLabel>{STRINGS.APPOINTMENT_CONFIGURATION.weekdays}</MyText>
          <View style={styles.weekdaysContainer}>
            {weekdays.map((day, dayIndex) => (
              <View key={day.shortName} style={styles.weekdayItem}>
                <MyCheckBox
                  onPress={() => handlerWeekdays(day, index)}
                  title={day.shortName}
                  row={false}
                  value={item?.days.includes(day.fullName)}
                />
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            setConfirm({
              isVisible: true,
              text: STRINGS.APPOINTMENT_CONFIGURATION.deleteConfirmation,
              index,
              type: 'delete',
            })
          }
          style={styles.deleteButton}
          hitSlop={{left: 5, top: 5, right: 5, bottom: 5}}>
          {icons.trashFilled(colors.primary, 20)}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <RootView title={title} hideBackBottomButton>
      <NestableScrollContainer
        refreshControl={
          <MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {list.map(renderConfig)}
        {!loader && (
          <View style={styles.saveButtonContainer}>
            <MyButton
              invert
              title={STRINGS.APPOINTMENT_CONFIGURATION.save}
              onPress={onSubmit}
            />
          </View>
        )}
      </NestableScrollContainer>

      <FAB onPress={addNew} />

      <CalendarModal ref={ref_calendar} onDateSelected={onDateSelected} />

      <MyDateTimePicker
        isVisible={timePicker.isVisible}
        onCancel={closeTimePicker}
        onConfirm={onTimeSelected}
        date={timePicker?.date}
        mode="time"
      />

      <ConfirmationModal
        isVisible={confirm?.isVisible}
        closeModal={closeConfirmModal}
        title={confirm?.text}
        onAgree={onAgree}
      />

      <MyLoader enable={loader} />
    </RootView>
  );
};

export default Configurations;

const weekdays = [
  {
    fullName: STRINGS.APPOINTMENT_CONFIGURATION.monday,
    shortName: STRINGS.APPOINTMENT_CONFIGURATION.mon,
  },
  {
    fullName: STRINGS.APPOINTMENT_CONFIGURATION.tuesday,
    shortName: STRINGS.APPOINTMENT_CONFIGURATION.tue,
  },
  {
    fullName: STRINGS.APPOINTMENT_CONFIGURATION.wednesday,
    shortName: STRINGS.APPOINTMENT_CONFIGURATION.wed,
  },
  {
    fullName: STRINGS.APPOINTMENT_CONFIGURATION.thursday,
    shortName: STRINGS.APPOINTMENT_CONFIGURATION.thu,
  },
  {
    fullName: STRINGS.APPOINTMENT_CONFIGURATION.friday,
    shortName: STRINGS.APPOINTMENT_CONFIGURATION.fri,
  },
  {
    fullName: STRINGS.APPOINTMENT_CONFIGURATION.saturday,
    shortName: STRINGS.APPOINTMENT_CONFIGURATION.sat,
  },
  {
    fullName: STRINGS.APPOINTMENT_CONFIGURATION.sunday,
    shortName: STRINGS.APPOINTMENT_CONFIGURATION.sun,
  },
];

const styles = StyleSheet.create({
  itemView: {
    marginTop: 10,
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
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
  btn: {
    marginLeft: 10,
  },
  slotContainer: {
    backgroundColor: colors.secondarySelect,
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  slotRow: {
    flexDirection: 'row',
  },
  slotItem: {
    flex: 1,
  },
  slotItemWithMargin: {
    flex: 1,
    marginLeft: 10,
  },
  slotButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dragButton: {
    marginLeft: 30,
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
  },
  configHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duplicateButton: {
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
  },
  slotDurationContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
  },
  slotDurationRow: {
    flexDirection: 'row',
    borderWidth: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  dateRow: {
    flexDirection: 'row',
  },
  dateItem: {
    flex: 1,
  },
  dateItemWithMargin: {
    flex: 1,
    marginLeft: 10,
  },
  flatListContainer: {
    marginHorizontal: -10,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  weekdayItem: {
    flex: 1,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  scrollViewContent: {
    paddingBottom: 70,
  },
  saveButtonContainer: {
    marginTop: 20,
  },
});
