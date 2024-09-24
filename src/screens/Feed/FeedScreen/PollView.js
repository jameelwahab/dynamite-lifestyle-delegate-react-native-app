import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import MyTouchableInput from '../../../components/MyTouchableInput';
import MyInputs from '../../../components/MyInputs';
import { MyButton } from '../../../components/MyButton';
import MyCheckBox from '../../../components/MyCheckBox';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { colors } from '../../../utilities/colors';
import moment from 'moment';
import { convertTimezone, convertTimezone2, convertTimezoneToRegion } from '../../../functions/convertTime';
import { dateTimeFormat } from '../../../utilities/constants';
import { icons } from '../../../utilities/icons';





const PollView = forwardRef(({ data, timezone }, ref) => {

  const [options, setOptions] = useState([{ text: "" }, { text: "" }]);
  const [isMultiple, setIsMultiple] = useState(true)
  const [dateTimePicker, setDateTimePicker] = useState({ isVisible: false, mode: "date", time: moment().toDate() });
  const [expiryDate, setExpiryDate] = useState(convertTimezoneToRegion(moment.utc().add({ day: 1 }), timezone))
  const [expiryTime, setExpiryTime] = useState(convertTimezoneToRegion(moment().utc(), timezone))

  useImperativeHandle(ref, () => {
    return {
      getData,
    }
  })
  const openDateTimePicker = (mode, datetime) => {
    console.log(datetime, "datetime")
    setDateTimePicker({
      isVisible: true,
      mode: mode,
      time: moment(datetime).toDate()
    })
  }

  useEffect(() => {
    if (!!data) {
      console.log(data, "dataForEdit")
      console.log(moment(data?.expiry_date, "YYYY-MM-DD").format(),)
      setOptions([...data?.options]);
      setIsMultiple(data?.is_multiple_allow);
      setExpiryDate(moment(data?.expiry_date, "YYYY-MM-DD"))
      setExpiryTime(convertTimezone2(moment(data?.expiry_time, "hh:mm"), timezone))
    }
  }, [data])

  // const setData = (data) => {

  // }

  const getData = () => {
    return {
      options: options,
      isMultiple: isMultiple,
      expiryDate: expiryDate,
      expiryTime: expiryTime
    }
  }

  const setDateTime = (time) => {
    if (dateTimePicker?.mode == "date") {
      setExpiryDate(convertTimezoneToRegion(time, timezone))
      // setExpiryDate(moment(time, "YYYY-MM-DD"))

    } else if (dateTimePicker?.mode == "time") {
      setExpiryTime(convertTimezoneToRegion(time, timezone))
    }
    closeDateTimePicker()
  }

  const closeDateTimePicker = (mode, datetime) => {
    setDateTimePicker({
      isVisible: false,
      mode: "date",
      time: moment().toDate()
    })
  }

  const addOption = () => {
    if (options.length <= 5) {
      setOptions((list) => {
        return [...list, { text: "" }]
      });
    }
  }

  const textHandler = (text, index) => {
    options[index].text = text;
    setOptions([...options])
  }

  const removeOption = (index) => {
    if (options.length > 2) {
      options.splice(index, 1)
      setOptions([...options])
    }
  }

  const getMinimumDate = () => {
    let date = convertTimezoneToRegion(moment(), timezone);
    console.log(timezone?.userTimeZone, "timezone?.userTimeZone")

    let obj = {
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
      hour: date.hour(),
      minute: date.minute(),
      second: date.second()
    }
    console.log(obj, "obj")
    let dateObj = new Date(date.format("YYYY-MM-DD"))
    // console.log(obj)
    return dateObj


  }

  return (
    <View style={{ marginBottom: 30 }}>
      <View style={__styles.dateTimeRow}>
        <View style={__styles.dateTimeInputView}>
          <MyTouchableInput
            onPress={() => openDateTimePicker("date", expiryDate)}
            value={moment(expiryDate).format(dateTimeFormat.date)}
            label="Expiry Date*"
            rootStyle={__styles.dateTimeInput}
            iconColor={colors.golden}
            icon={() => icons.calendar(colors.primary)} />
        </View>
        <View style={{ width: 10 }} />
        <View style={__styles.dateTimeInputView}>
          <MyTouchableInput
            label="Expiry Time*"
            onPress={() => openDateTimePicker("time", expiryTime)}
            value={moment(expiryTime).format(dateTimeFormat.time)}
            iconColor={colors.golden}
            rootStyle={__styles.dateTimeInput}
            icon={() => icons.clock()} />
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        {options.map((item, index) => (
          <View style={__styles.optionView}>
            <View style={{ flex: 1 }}>
              <MyInputs
                noSpace
                value={item?.text}
                style={__styles.dateTimeInput}
                onChangeText={text => textHandler(text, index)}
                placeholder={`Option ${index + 1}.`}
              />
            </View>
            {options.length > 2 &&
              <TouchableOpacity onPress={() => removeOption(index)} style={__styles.crossBtn}>
                {/* <Image source={ic_cross} style={__styles.crossBtnIcon} /> */}
                {icons.crosss()}
              </TouchableOpacity>}
          </View>
        ))}
      </View>
      {options.length < 5 &&
        <View style={__styles.addOptionBtnView}>
          <MyButton
            style={{ paddingHorizontal: 10 }}
            noSpace
            noCapitalize
            leftIcon={() => icons.plus(colors.black)}
            onPress={addOption} fullWidth title="Add Option" />
        </View>}

      <View style={{marginTop:10}}>
        <MyCheckBox
          title={"Allow Selecting Multiple Options"}
          value={isMultiple}
          onPress={() => setIsMultiple((val) => !val)}
        />
      </View>
      {/* {console.log(convertTimezoneToRegion(moment(), timezone).format())} */}
      {/* {getMinimumDate()} */}
      {console.log(moment.utc(dateTimePicker?.time).toString(), "time")}
      <DateTimePicker
        isVisible={dateTimePicker?.isVisible}
        minimumDate={dateTimePicker?.mode == "date" ? new Date() : undefined}
        mode={dateTimePicker?.mode}
        date={dateTimePicker?.time}
        timeZoneName={!!data && dateTimePicker?.mode == "date" ? undefined : timezone?.userTimeZone}
        onCancel={closeDateTimePicker}
        onConfirm={(time) => setDateTime(time)}
        // confirmTextIOS={colors.golden}
        buttonTextColorIOS={colors.golden}
      />

    </View>
  )
})

export default PollView

const __styles = StyleSheet.create({
  dateTimeRow: {
    flexDirection: "row"
  },
  dateTimeInputView: {
    flex: 1,
    // marginLeft: 10
  },
  dateTimeInput: {
    backgroundColor: colors.backgorund5
  },
  optionView: {
    // marginTop: 10,
    flexDirection: "row"
  },
  crossBtn: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    marginTop:15

  },
  crossBtnIcon: {
    height: 15,
    width: 15,
    tintColor: colors.delete
  },
  addOptionBtnView: {
    marginTop: 10,
    alignItems: "flex-start"
  },
  addBtnIcon: {
    height: 15,
    width: 15,
    tintColor: colors.golden,
    marginRight: 10
  }
})