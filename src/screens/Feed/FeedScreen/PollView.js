import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import MyTouchableInput from '../../../components/MyTouchableInput';
import MyInputs from '../../../components/MyInputs';
import {MyButton} from '../../../components/MyButton';
import MyCheckBox from '../../../components/MyCheckBox';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {colors} from '../../../utilities/colors';
import moment from 'moment';
import {
  convertTimezone2,
  convertTimezoneToRegion,
} from '../../../functions/convertTime';
import {dateTimeFormat} from '../../../utilities/constants';
import {STRINGS} from '../../../utilities/strings';
import {icons} from '../../../utilities/icons';

const PollView = forwardRef(({data, timezone}, ref) => {
  const [options, setOptions] = useState([{text: ''}, {text: ''}]);
  const [isMultiple, setIsMultiple] = useState(true);
  const [dateTimePicker, setDateTimePicker] = useState({
    isVisible: false,
    mode: 'date',
    time: moment().toDate(),
  });
  const [expiryDate, setExpiryDate] = useState(
    convertTimezoneToRegion(moment.utc().add({day: 1}), timezone),
  );
  const [expiryTime, setExpiryTime] = useState(
    convertTimezoneToRegion(moment().utc(), timezone),
  );
  const [privacy, setPrivacy] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      getData,
    };
  });
  const openDateTimePicker = (mode, datetime) => {
    setDateTimePicker({
      isVisible: true,
      mode: mode,
      time: moment(datetime).toDate(),
    });
  };

  useEffect(() => {
    if (!!data) {
      setOptions([...data?.options]);
      setPrivacy(data?.poll_result == 'private');
      setIsMultiple(data?.is_multiple_allow);
      setExpiryDate(moment(data?.expiry_date, dateTimeFormat.date2));
      setExpiryTime(
        convertTimezone2(moment(data?.expiry_time, 'hh:mm'), timezone),
      );
    }
  }, [data]);

  // const setData = (data) => {

  // }

  const getData = () => {
    return {
      options: options,
      isMultiple: isMultiple,
      privacy: privacy,
      expiryDate: expiryDate,
      expiryTime: expiryTime,
    };
  };

  const setDateTime = time => {
    if (dateTimePicker?.mode == 'date') {
      setExpiryDate(convertTimezoneToRegion(time, timezone));
      // setExpiryDate(moment(time, "YYYY-MM-DD"))
    } else if (dateTimePicker?.mode == 'time') {
      setExpiryTime(convertTimezoneToRegion(time, timezone));
    }
    closeDateTimePicker();
  };

  const closeDateTimePicker = (mode, datetime) => {
    setDateTimePicker({
      isVisible: false,
      mode: 'date',
      time: moment().toDate(),
    });
  };

  const addOption = () => {
    if (options.length <= 5) {
      setOptions(list => {
        return [...list, {text: ''}];
      });
    }
  };

  const textHandler = (text, index) => {
    options[index].text = text;
    setOptions([...options]);
  };

  const removeOption = index => {
    if (options.length > 2) {
      options.splice(index, 1);
      setOptions([...options]);
    }
  };

  const getMinimumDate = () => {
    let date = convertTimezoneToRegion(moment(), timezone);

    let obj = {
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
      hour: date.hour(),
      minute: date.minute(),
      second: date.second(),
    };

    let dateObj = new Date(date.format(dateTimeFormat.date2));

    return dateObj;
  };

  return (
    <View style={__styles.container}>
      <View style={__styles.dateTimeRow}>
        <View style={__styles.dateTimeInputView}>
          <MyTouchableInput
            onPress={() => openDateTimePicker('date', expiryDate)}
            value={moment(expiryDate).format(dateTimeFormat.date)}
            label={STRINGS.POLL_VIEW.expiryDate}
            rootStyle={__styles.dateTimeInput}
            icon={() => icons.calendar(colors.primary)}
          />
        </View>
        <View style={__styles.spacer10} />
        <View style={__styles.dateTimeInputView}>
          <MyTouchableInput
            label={STRINGS.POLL_VIEW.expiryTime}
            onPress={() => openDateTimePicker('time', expiryTime)}
            value={moment(expiryTime).format(dateTimeFormat.time)}
            rootStyle={__styles.dateTimeInput}
            icon={() => icons.clock(colors.primary)}
          />
        </View>
      </View>

      <View style={__styles.optionsContainer}>
        {options.map((item, index) => (
          <View style={__styles.optionView}>
            <View style={__styles.flex1}>
              <MyInputs
                noSpace
                capitalizeSentence
                value={item?.text}
                style={__styles.dateTimeInput}
                onChangeText={text => textHandler(text, index)}
                placeholder={STRINGS.POLL_VIEW.option(index)}
              />
            </View>
            {options.length > 2 && (
              <TouchableOpacity
                onPress={() => removeOption(index)}
                style={__styles.crossBtn}>
                {/* <Image source={ic_cross} style={__styles.crossBtnIcon} /> */}
                {icons.crosss()}
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      <View style={__styles.rowAlignCenter}>
        <View
          style={[
            __styles.checkboxContainer,
            {marginTop: options.length < 5 ? 0 : 15},
          ]}>
          <MyCheckBox
            pb={0}
            title={STRINGS.POLL_VIEW.allowMultipleSelection}
            value={isMultiple}
            onPress={() => setIsMultiple(val => !val)}
          />
        </View>

        {options.length < 5 && (
          <View style={__styles.addOptionBtnView}>
            <MyButton
              style={__styles.addOptionBtnPadding}
              noSpace
              noCapitalize
              invert
              leftIcon={() => icons.plus(colors.primary)}
              onPress={addOption}
              fullWidth
              title={STRINGS.POLL_VIEW.addOption}
            />
          </View>
        )}
      </View>
      <View style={{marginTop: options.length < 5 ? 0 : 15}}>
        <MyCheckBox
          paddingTop={0}
          title={STRINGS.POLL_VIEW.makeResultPrivate}
          value={privacy}
          onPress={() => setPrivacy(!privacy)}
        />
      </View>

      <DateTimePicker
        isVisible={dateTimePicker?.isVisible}
        minimumDate={dateTimePicker?.mode == 'date' ? new Date() : undefined}
        mode={dateTimePicker?.mode}
        date={dateTimePicker?.time}
        timeZoneName={
          !!data && dateTimePicker?.mode == 'date' ? undefined : timezone?.user
        }
        onCancel={closeDateTimePicker}
        onConfirm={time => setDateTime(time)}
        // confirmTextIOS={colors.golden}
        buttonTextColorIOS={colors.golden}
      />
    </View>
  );
});

export default PollView;

const __styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  dateTimeRow: {
    flexDirection: 'row',
  },
  dateTimeInputView: {
    flex: 1,
  },
  dateTimeInput: {
    backgroundColor: colors.backgorund5,
  },
  spacer10: {
    width: 10,
  },
  optionsContainer: {
    marginTop: -10,
  },
  optionView: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  crossBtn: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    marginTop: 15,
  },
  crossBtnIcon: {
    height: 15,
    width: 15,
    tintColor: colors.delete,
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  addOptionBtnView: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  addOptionBtnPadding: {
    paddingHorizontal: 10,
  },
  addBtnIcon: {
    height: 15,
    width: 15,
    tintColor: colors.golden,
    marginRight: 10,
  },
});
