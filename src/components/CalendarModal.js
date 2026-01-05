import {
  View,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Modal from 'react-native-modal';
import moment from 'moment';
import {colors} from '../utilities/colors';
import {fonts} from '../utilities/fonts';
import {Calendar} from 'react-native-calendars';
import {icons} from '../utilities/icons';
import MyText from './MyText';
import Yearlist from '../assets/data/yearlist.json';
const CalendarModal = forwardRef(({onDateSelected, minimum, maximun}, ref) => {
  const flatlistRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [showYearView, setShowYearView] = useState(false);
  const [type, setType] = useState('');
  const [minDate, setMinDate] = useState(!!minimum ? minimum : null);

  useImperativeHandle(
    ref,
    () => {
      return {
        openModal,
      };
    },
    [],
  );

  const openModal = (date, type = '', minimimDate = undefined) => {
    setDate(
      !!date
        ? moment(date).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD'),
    );
    setType(type);
    if (!!minimimDate && !minimum) {
      setMinDate(minimimDate);
    }
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      setDate(moment().format('YYYY-MM-DD'));
    }, 300);
  };

  const onAgreeClick = () => {
    setIsVisible(false);
    onDateSelected?.(moment(date, 'YYYY-MM-DD'));
    setDate(moment().format('YYYY-MM-DD'));
  };

  useEffect(() => {
    if (showYearView) {
      let index = Yearlist.findIndex(x => x == moment(date).format('YYYY'));

      // setTimeout(() => {
      //   flatlistRef?.current?.scrollToIndex({
      //     index: 100,
      //     animated: false,
      //   });
      // }, 200);
    }
  }, [showYearView]);

  const headerView = () => {
    return (
      <View style={__styles.headerView}>
        <View style={__styles.titleView}>
          <MyText fontSize={16} type="bold">
            {moment(date).format('MMMM YYYY')}{' '}
          </MyText>
          {/* <TouchableOpacity
            style={__styles.arrownBtn}
            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            onPress={() => setShowYearView(!showYearView)}>
            {icons.down(colors.lightText)}
          </TouchableOpacity> */}
        </View>
        <View style={__styles.arrowBtnsRow}>
          <TouchableOpacity
            onPress={() =>
              setDate(date =>
                moment(date).subtract({month: 1}).format('YYYY-MM-DD'),
              )
            }
            style={__styles.arrowBtnsView}>
            {icons.backwardArrow()}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setDate(date => moment(date).add({month: 1}).format('YYYY-MM-DD'))
            }
            style={__styles.arrowBtnsView}>
            {icons.forwardArrow()}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const yearslist = () => {
    return (
      <View style={{flex: 1, marginTop: 10}}>
        <FlatList
          ref={flatlistRef}
          data={Yearlist}
          disableVirtualization={true}
          numColumns={4}
          initialNumToRender={200}
          // getItemLayout={(data, index) => (
          //   {length: 40,offset: 40 * (index-4),  index}
          // )}
          // getItemLayout=  (data, index) => {length: number, offset: number, index: number}

          renderItem={({item}) => (
            <View
              style={{
                width: '25%',
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MyText fontSize={16}>{item}</MyText>
            </View>
          )}
        />
        {/* <ScrollView onScrollEndDrag={event => {
            console.log(event,"event")

            console.log(event.nativeEvent,"layout")
            // console.log('height:', layout.height);
            // console.log('width:', layout.width);
            // console.log('x:', layout.x);
            // console.log('y:', layout.y);
          }} indicatorStyle="white">
          <View
          
           style={{ flexDirection: "row", flexWrap: "wrap" }} >
            {Yearlist.map((x, i) => (
              <View
              
               style={{ width: "25%", height: 40, alignItems: "center", justifyContent: "center", }} >
                <MyText fontSize={16}  >{x}</MyText>
              </View>
            ))}
          </View>
        </ScrollView> */}
      </View>
    );
  };

  const modalCalendar = () => {
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
        style={{margin: 10}}>
        <View
          style={{
            backgroundColor: colors.secondaryVariant,
            borderRadius: 10,
            height: 400,
          }}>
          <View style={{margin: 10, flex: 1}}>
            <Pressable
              onPress={closeModal}
              style={{padding: 5, alignSelf: 'flex-end'}}>
              {icons.crosss()}
              {/* <MyText fontSize={18} type='medium' color={colors.primary}>Are you sure you want to move this ticket to needs fixes?</MyText> */}
            </Pressable>
            {headerView()}

            {showYearView ? (
              yearslist()
            ) : (
              <View
                style={{
                  backgroundColor: colors.secondaryVariant,
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                <Calendar
                  initialDate={date}
                  minDate={
                    !!minDate ? moment(minDate).format('YYYY-MM-DD') : undefined
                  }
                  maxDate={
                    !!maximun ? moment(maximun).format('YYYY-MM-DD') : undefined
                  }
                  // date={date}
                  markedDates={{
                    [date]: {selected: true},
                  }}
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
                  onDayPress={day => {
                    setIsVisible(false);
                    onDateSelected?.(
                      moment(day.dateString, 'YYYY-MM-DD'),
                      type,
                    );
                  }}
                  renderHeader={() => null}
                  hideArrows
                />
              </View>
            )}

            {/* <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
              <TransparentButton title='CANCEL' onPress={closeModal} />
              <TransparentButton title='AGREE' onPress={onAgreeClick} />
            </View> */}
          </View>
        </View>
      </Modal>
    );
  };

  return <View>{modalCalendar()}</View>;
});

export default CalendarModal;

const __styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  arrownBtn: {},
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowBtnsRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  arrowBtnsView: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    width: 25,
    marginLeft: 10,
  },
});
