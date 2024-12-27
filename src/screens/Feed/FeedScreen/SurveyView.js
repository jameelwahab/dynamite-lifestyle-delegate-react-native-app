import { View, StyleSheet, FlatList, useWindowDimensions, TouchableOpacity, Pressable, } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import moment from 'moment';
import breakReference from '../../../functions/breakReference';
import MyTouchableInput from '../../../components/MyTouchableInput';
import MyText from '../../../components/MyText';
import { colors } from '../../../utilities/colors';
import { convertTimezone2, convertTimezoneToRegion } from '../../../functions/convertTime';
import { dateTimeFormat } from '../../../utilities/constants';
import { icons } from '../../../utilities/icons';
import MyInputs from '../../../components/MyInputs';
import MyCheckBox from '../../../components/MyCheckBox';
import { MyButton } from '../../../components/MyButton';
import DateTimePicker from 'react-native-modal-datetime-picker';




const SurveyView = forwardRef(({ data, timezone }, ref) => {
  const { width } = useWindowDimensions();
  const ref_flatlist = useRef()
  const [options, setOptions] = useState([breakReference(questionObj)]);
  const [privacy, setPrivacy] = useState(false)
  const [dateTimePicker, setDateTimePicker] = useState({ isVisible: false, mode: "date", time: moment().toDate() });
  const [expiryDate, setExpiryDate] = useState(convertTimezoneToRegion(moment.utc().add({ day: 1 }), timezone))
  const [expiryTime, setExpiryTime] = useState(convertTimezoneToRegion(moment().utc(), timezone))
  const [index, setIndex] = useState(0);

  useImperativeHandle(ref, () => {
    return {
      getData,
    }
  })
  const openDateTimePicker = (mode, datetime) => {
    setDateTimePicker({
      isVisible: true,
      mode: mode,
      time: moment(datetime).toDate()
    })
  }



  useEffect(() => {
    if (!!data) {
      setOptions([...data?.questions]);
      setPrivacy(data?.survey_result == "private")
      // setIsMultiple(data?.is_multiple_allow);
      setExpiryDate(moment(data?.expiry_date, "YYYY-MM-DD"))
      setExpiryTime(convertTimezone2(moment(data?.expiry_time, "hh:mm"), timezone))
    }
  }, [data])



  const getData = () => {
    return {
      options: options,
      privacy: privacy,
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

  const addOption = (index) => {
    if (options[index]?.options?.length < 5) {
      setOptions((list) => {
        list[index].options.push({ text: "" })
        return [...list,]
      });
    }
  }

  const textHandler = (text, index) => {
    options[index].question_statement = text;
    setOptions([...options])
  }

  const textOptionHandler = (text, qIndex, optIndex) => {
    options[qIndex].options[optIndex].text = text;
    setOptions([...options])
  }

  const removeOption = (index, optIndex) => {
    if (options[index]?.options?.length > 2) {
      options[index].options.splice(optIndex, 1)
      setOptions([...options])
    }
  }

  const toggleMultiple = (qIndex) => {
    setOptions((list) => {
      list[qIndex].is_multiple_allow = !list[qIndex].is_multiple_allow
      return [...list]
    });
  }


  const onNextQuestion = () => {
    ref_flatlist?.current?.scrollToIndex({
      index: index + 1,
      animated: true
    })
  }

  const onBackQuestion = () => {
    ref_flatlist?.current?.scrollToIndex({
      index: index - 1,
      animated: true
    })
  }

  const addQuesion = () => {
    options.push(breakReference(questionObj));
    setOptions([...options])

    setTimeout(() => {
      ref_flatlist?.current?.scrollToIndex({
        index: options.length - 1,
        animated: true
      })
    }, 300);
  }

  const removeQuesion = (index) => {
    if (index > 0) {
      ref_flatlist?.current?.scrollToIndex({
        index: index - 1,
        animated: true
      })
    }
    setTimeout(() => {
      options.splice(index, 1);
      setOptions([...options])
    }, 300);
  }

  const getMinimumDate = () => {
    let date = convertTimezoneToRegion(moment(), globalState);


    let obj = {
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
      hour: date.hour(),
      minute: date.minute(),
      second: date.second()
    }
    let dateObj = new Date(date.format("YYYY-MM-DD"))
    return dateObj


  }

  const onViewCallBack = React.useCallback(({ viewableItems }) => {
    if (viewableItems.length == 1) {
      setIndex(viewableItems[0]?.index)
    }
  }, [])

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })




  return (
    <View style={{ marginBottom: 20, }}>
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
            icon={() => icons.clock(colors.primary)} />
        </View>
      </View>

      <View style={{ marginTop: 10, }}>
        <FlatList
          onViewableItemsChanged={onViewCallBack}
          viewabilityConfig={viewConfigRef.current}
          ref={ref_flatlist}
          data={options}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          horizontal
          renderItem={({ item, index }) => {
            return (
              <View style={{ width: width, paddingHorizontal: 10, }}>
                <View style={{ flex: 1, backgroundColor: colors.secondaryVariant, borderRadius: 10, padding: 10 }}>
                  <MyInputs
                    capitalizeSentence
                    noSpace
                    value={item?.question_statement}
                    style={__styles.dateTimeInput}
                    onChangeText={text => textHandler(text, index)}
                    placeholder={`Question ${index + 1}.`}
                  />
                  <View >
                    {item.options.map((opt, optIndex) => (
                      <View style={__styles.optionView}>
                        <View style={{ flex: 1 }}>
                          <MyInputs
                            capitalizeSentence
                            noSpace
                            value={opt?.text}
                            style={__styles.dateTimeInput}
                            onChangeText={text => textOptionHandler(text, index, optIndex)}
                            placeholder={`Option ${optIndex + 1}.`}
                          />
                        </View>
                        {item?.options.length > 2 &&
                          <TouchableOpacity onPress={() => removeOption(index, optIndex)} style={__styles.crossBtn}>
                            {icons.crosss()}
                          </TouchableOpacity>}
                      </View>
                    ))}
                  </View>

                  <View style={{ flexDirection: "row", marginTop: 20, alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flex: 1, }}>
                      <MyCheckBox
                        paddingTop={0}
                        title={"Allow multiple selection"}
                        value={item?.is_multiple_allow}
                        onPress={() => toggleMultiple(index)}
                      />
                    </View>

                    {item.options?.length < 5 &&
                      <View style={__styles.addOptionBtnView}>
                        <MyButton
                          noCapitalize
                          leftIcon={() => icons.plus(colors.primary)}
                          style={{ paddingHorizontal: 10 }}
                          invert
                          onPress={() => addOption(index)} fullWidth title="Add Option" />
                      </View>}


                  </View>
                </View>
              </View>
            )
          }}
        />
      </View>

      <View style={{ marginTop: 30, paddingHorizontal: 10, flexDirection: "row", }}>
        {options.length != 1 &&
          <View style={{ flex: 1 }}>
            <MyButton
              leftIcon={() => icons.crosss(colors.primary)}
              // style={{ paddingHorizontal: 10 }}
              noCapitalize
              invert
              onPress={() => removeQuesion(index)} fullWidth title="Remove Question" />
          </View>}
        {options.length != 1 && options.length != 5 && <View style={{ width: 10 }} />}
        {options.length != 5 &&
          <View style={{ flex: 1 }}>
            <MyButton
              noCapitalize
              leftIcon={() => icons.plus(colors.primary)}
              // style={{ paddingHorizontal: 10 }}
              invert
              onPress={() => addQuesion(index)} fullWidth title="Add Question" />
          </View>}
      </View>
      <View style={{ marginTop: 30, paddingHorizontal: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Pressable
          disabled={index == 0}
          opacity={index == 0 ? 0.6 : 1}
          onPress={onBackQuestion}
          style={[__styles.btnImageView,]}>
          {icons.backwardArrow(17, colors.black)}
        </Pressable>
        <MyText color={colors.silver} ><MyText color={colors.white} type='bold' >{index + 1}</MyText> of {options.length}</MyText>
        <Pressable
          disabled={(options.length - 1) == index}
          opacity={(options.length - 1) == index ? 0.6 : 1}
          onPress={onNextQuestion}
          style={__styles.btnImageView}>
          {icons.forwardArrow(17, colors.black)}
        </Pressable>
      </View>
      <View style={{ marginTop: 30, paddingHorizontal: 10, }}>
        <MyCheckBox
          paddingTop={0}
          title={"Make Result Private"}
          value={privacy}
          onPress={() => setPrivacy(!privacy)}
        />
      </View>

      <DateTimePicker
        isVisible={dateTimePicker?.isVisible}
        minimumDate={dateTimePicker?.mode == "date" ? new Date() : undefined}
        mode={dateTimePicker?.mode}
        date={dateTimePicker?.time}
        timeZoneName={!!data && dateTimePicker?.mode == "date" ? undefined : timezone?.user}
        onCancel={closeDateTimePicker}
        onConfirm={(time) => setDateTime(time)}
        // confirmTextIOS={colors.golden}
        buttonTextColorIOS={colors.primary}
      />
    </View >
  )
})

export default SurveyView

const questionObj = {
  question_statement: "",
  options: [{ text: "" }, { text: "" }],
  is_multiple_allow: true,
  question_type: "text"
}

const __styles = StyleSheet.create({
  dateTimeRow: {
    flexDirection: "row",
    paddingHorizontal: 15
  },
  dateTimeInputView: {
    flex: 1,
    // marginLeft: 10
  },
  dateTimeInput: {
    // backgroundColor: colors.backgorund5
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
    marginTop: 15

  },
  crossBtnIcon: {
    height: 15,
    width: 15,
    tintColor: colors.delete
  },
  addOptionBtnView: {

    marginLeft: 15
  },
  addBtnIcon: {
    height: 15,
    width: 15,
    tintColor: colors.golden,
    marginRight: 10
  },
  btnImageView: {
    backgroundColor: colors.golden,
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    alignItems: "center",
    justifyContent: "center"
  },
  btnImage: {
    height: 15,
    width: 15,
    backgroundColor: colors.golden,
  }
})