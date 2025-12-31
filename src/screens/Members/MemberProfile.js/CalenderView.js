import {
  View,
  Pressable,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import moment from 'moment';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import {fonts} from '../../../utilities/fonts';
import {Calendar} from 'react-native-calendars';
import {__styles, calendarStyles} from './style';
import MyText from '../../../components/MyText';
import {convertTimezone} from '../../../functions/convertTime';
import {icons} from '../../../utilities/icons';
import EmptyView from '../../../components/EmptyView';
import Modal from 'react-native-modal';
import {SimpleLoader} from '../../../components/MyLoader';
import {GET_EVENT_DETAIL} from '../../../DAL';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {useNavigation} from '@react-navigation/native';
import {dateTimeFormat} from '../../../utilities/constants';
const CalenderView = ({
  selectedDate,
  events,
  setDate,
  timezone,
  onArrowPress,
  type,
  setType,
  loader,
}) => {
  const {token} = useSelector(selectUser);
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

  const openInfoModal = item => {
    setIsVisible(true);
    setModalLoader(true);
    getEventDetailFRomServer(item?.event_slug);
  };
  const selectType = newType => {
    setType(newType);
  };

  const getEventDetailFRomServer = async slug => {
    let res = await GET_EVENT_DETAIL({token, navigation, slug});
    if (res.code == 200) {
      setModalEvent(res?.event);
      setModalLoader(false);
    } else {
      setModalLoader(false);
    }
  };
  const closeModal = () => {
    setIsVisible(false);
    setModalLoader(false);
    setModalEvent(null);
  };

  const eventInfoModal = () => {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        useNativeDriverForBackdrop={true}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={300}
        style={styles.modalContainer}>
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalInner}>
            <Pressable onPress={closeModal} style={styles.closeButton}>
              {icons.crosss()}
            </Pressable>
            <View style={styles.modalPadding}>
              {!!modalEvent && (
                <View>
                  <MyText
                    align="center"
                    color={colors.primary}
                    fontSize={18}
                    type="bold">
                    {modalEvent?.title}
                  </MyText>
                  <View style={styles.eventRow}>
                    <MyText style={styles.flex1} type="bold">
                      {STRINGS.CALENDAR_VIEW.eventFrom}
                    </MyText>
                    <MyText style={styles.flex1}>
                      {' '}
                      {convertTimezone(
                        modalEvent?.start_date_time,
                        timezone,
                      ).format(dateTimeFormat.dateTime)}
                    </MyText>
                  </View>

                  <View style={styles.eventRow}>
                    <MyText style={styles.flex1} type="bold">
                      {STRINGS.CALENDAR_VIEW.eventTo}
                    </MyText>
                    <MyText style={styles.flex1}>
                      {' '}
                      {convertTimezone(
                        modalEvent?.end_date_time,
                        timezone,
                      ).format(dateTimeFormat.dateTime)}
                    </MyText>
                  </View>

                  <View style={styles.eventRow}>
                    <MyText style={styles.flex1} type="bold">
                      {STRINGS.CALENDAR_VIEW.iterationFrom}
                    </MyText>
                    <MyText style={styles.flex1}>
                      {' '}
                      {convertTimezone(
                        modalEvent?.start_date_time,
                        timezone,
                      ).format(dateTimeFormat.dateTime)}
                    </MyText>
                  </View>

                  <View style={styles.eventRow}>
                    <MyText style={styles.flex1} type="bold">
                      {STRINGS.CALENDAR_VIEW.iterationFrom}
                    </MyText>
                    <MyText style={styles.flex1}>
                      {' '}
                      {convertTimezone(
                        modalEvent?.start_date_time,
                        timezone,
                      ).format(dateTimeFormat.dateTime)}
                    </MyText>
                  </View>
                </View>
              )}

              {modalLoader && (
                <View style={styles.loaderContainer}>
                  <SimpleLoader size={50} />
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
        {isVisible && <Toast />}
      </Modal>
    );
  };

  const dayComponent = ({date, state}) => {
    return (
      <TouchableOpacity
        onPress={() => setDate(date.dateString)}
        style={[
          styles.dayContainer,
          selectedDate == date.dateString && styles.dayContainerSelected,
        ]}>
        <MyText
          color={selectedDate == date.dateString ? colors.black : colors.white}>
          {date.day}
        </MyText>
        {events[date.dateString]?.count > 0 && (
          <MyText
            fontSize={12}
            color={
              selectedDate == date.dateString ? colors.black : colors.lightText2
            }>
            {events[date.dateString]?.count}
          </MyText>
        )}
      </TouchableOpacity>
    );
  };

  const calendarItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() => openInfoModal(item)}
      style={styles.calendarItemContainer}>
      <View style={styles.dateSection}>
        <MyText type="medium" color={colors.primary}>
          {convertTimezone(item.start_date_time, timezone).format('ddd')}
        </MyText>
        <MyText fontSize={12} color={colors.primary}>
          {convertTimezone(item.start_date_time, timezone).format('MM/DD')}
        </MyText>
      </View>

      <View style={styles.eventContent}>
        <View style={styles.eventInner}>
          <View>
            <View style={styles.eventDetails}>
              <View
                style={[styles.colorIndicator, {backgroundColor: item.color}]}
              />
              <View style={styles.eventText}>
                <MyText type="medium" fontSize={12}>
                  {item.title}
                </MyText>
                <MyText fontSize={10}>
                  {' '}
                  {`${convertTimezone(item.start_date_time, timezone).format(
                    'hh:mm A',
                  )} -- ${convertTimezone(item.end_date_time, timezone).format(
                    'hh:mm A',
                  )}`}
                </MyText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const calendarWeekItem = ({item: event, index}) => {
    if (events[event].list.length > 0) {
      return (
        <View style={styles.calendarItemContainer}>
          <View style={styles.dateSection}>
            <MyText type="medium" color={colors.primary}>
              {convertTimezone(moment(event, 'YYYY-MM-DD'), timezone).format(
                'ddd',
              )}
            </MyText>
            <MyText fontSize={12} color={colors.primary}>
              {convertTimezone(moment(event, 'YYYY-MM-DD'), timezone).format(
                'MM/DD',
              )}
            </MyText>
          </View>
          <View style={styles.flex1}>
            <FlatList
              data={!!events[event]?.list ? events[event]?.list : []}
              renderItem={({item: item2, index}) => {
                return (
                  <View style={styles.weekEventItem}>
                    <TouchableOpacity
                      onPress={() => openInfoModal(item2)}
                      style={styles.weekEventTouch}>
                      <View>
                        <View style={styles.eventDetails}>
                          <View
                            style={[
                              styles.colorIndicator,
                              {backgroundColor: item2.color},
                            ]}
                          />
                          <View style={styles.eventText}>
                            <MyText type="medium" fontSize={12}>
                              {item2.title}
                            </MyText>
                            <MyText fontSize={10}>
                              {' '}
                              {`${convertTimezone(
                                item2.start_date_time,
                                timezone,
                              ).format('hh:mm A')} -- ${convertTimezone(
                                item2.end_date_time,
                                timezone,
                              ).format('hh:mm A')}`}
                            </MyText>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      );
    } else return null;
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.headerRow}>
        <View style={calendarStyles.typeView}>
          <TouchableOpacity
            onPress={() => onArrowPress('prev')}
            style={[calendarStyles.typeBtn]}>
            {icons.backwardArrow(20, colors.primary)}
          </TouchableOpacity>
          <View style={calendarStyles.typeDivider} />
          <TouchableOpacity
            onPress={() => onArrowPress('next')}
            style={calendarStyles.typeBtn}>
            {icons.forwardArrow(20, colors.primary)}
          </TouchableOpacity>
        </View>

        <View style={calendarStyles.typeView}>
          <TouchableOpacity
            onPress={() => selectType('month')}
            style={[calendarStyles.typeBtn]}>
            <MyText color={type == 'month' ? colors.primary : colors.white}>
              {STRINGS.CALENDAR_VIEW.month}
            </MyText>
          </TouchableOpacity>
          <View style={calendarStyles.typeDivider} />
          <TouchableOpacity
            onPress={() => selectType('week')}
            style={calendarStyles.typeBtn}>
            <MyText color={type == 'week' ? colors.primary : colors.white}>
              {STRINGS.CALENDAR_VIEW.week}
            </MyText>
          </TouchableOpacity>
          <View style={calendarStyles.typeDivider} />
          <TouchableOpacity
            onPress={() => selectType('day')}
            style={calendarStyles.typeBtn}>
            <MyText color={type == 'day' ? colors.primary : colors.white}>
              {STRINGS.CALENDAR_VIEW.day}
            </MyText>
          </TouchableOpacity>
        </View>
      </View>
      {type == 'month' ? (
        <View style={styles.marginTop10}>
          <Calendar
            // current={selectedDate}
            // date={selectedDate}
            initialDate={selectedDate}
            // date={date}
            markedDates={{
              [selectedDate]: {selected: true},
            }}
            style={{borderRadius: 10}}
            hideExtraDays={true}
            hideArrows={true}
            dayComponent={dayComponent}
            theme={{
              backgroundColor: colors.secondaryVariant,
              calendarBackground: colors.secondaryVariant,
              textSectionTitleColor: colors.primary,
              textSectionTitleDisabledColor: colors.primary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.black,
              todayTextColor: colors.primary,
              dayTextColor: colors.white,
              textDisabledColor: colors.placeholder,
              dotColor: colors.blue,
              selectedDotColor: 'blue',
              arrowColor: colors.primary,
              disabledArrowColor: colors.primary,
              monthTextColor: 'white',
              textDayFontSize: 14,
              // textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
              textDayFontFamily: fonts.regular,
              textDayHeaderFontFamily: fonts.regular,
              textMonthFontFamily: fonts.medium,
            }}
          />
        </View>
      ) : type == 'week' ? (
        <View style={styles.weekDayView}>
          <MyText type="medium" color={colors.primary} fontSize={16}>
            {`${moment(selectedDate)
              .startOf('week')
              .format('MMMM DD')} - ${moment(selectedDate)
              .endOf('week')
              .format('MMMM DD, YYYY')}`}
          </MyText>
        </View>
      ) : type == 'day' ? (
        <View>
          <View style={styles.weekDayView}>
            <MyText type="medium" color={colors.primary} fontSize={16}>
              {moment(selectedDate).format('MMMM DD, YYYY')}
            </MyText>
          </View>
        </View>
      ) : null}

      <View style={styles.marginTop5}>
        <FlatList
          data={
            type == 'week'
              ? Object.keys(events)
              : !!events[selectedDate]?.list
              ? events[selectedDate]?.list
              : []
          }
          renderItem={type == 'week' ? calendarWeekItem : calendarItem}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            type != 'month' &&
            !loader && <EmptyView label={STRINGS.CALENDAR_VIEW.noEventFound} />
          }
        />
      </View>
      {eventInfoModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContainer: {
    margin: 10,
  },
  modalContent: {
    backgroundColor: colors.secondaryVariant,
    borderRadius: 10,
    minHeight: 250,
  },
  modalInner: {
    margin: 10,
    flex: 1,
  },
  closeButton: {
    padding: 5,
    alignSelf: 'flex-end',
  },
  modalPadding: {
    paddingHorizontal: 10,
    flex: 1,
  },
  eventRow: {
    marginTop: 15,
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContainer: {
    backgroundColor: colors.transparent,
    alignItems: 'center',
    height: 35,
    width: 35,
    borderRadius: 17.5,
  },
  dayContainerSelected: {
    backgroundColor: colors.primary,
  },
  calendarItemContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.secondaryVariant,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: 'silver',
  },
  dateSection: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContent: {
    minHeight: 50,
    borderRadius: 4,
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 15,
  },
  eventInner: {
    minHeight: 50,
    borderRadius: 4,
    justifyContent: 'center',
  },
  eventDetails: {
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 10,
    minHeight: 35,
    margin: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    borderWidth: 0.5,
    borderColor: colors.border,
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  eventText: {
    flex: 1,
    marginLeft: 10,
  },
  weekEventItem: {
    borderRadius: 4,
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 5,
  },
  weekEventTouch: {
    borderRadius: 4,
    justifyContent: 'center',
  },
  weekDayView: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginTop5: {
    marginTop: 5,
  },
});

export default CalenderView;
