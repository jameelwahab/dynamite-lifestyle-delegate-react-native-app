import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal';
import { Picker } from 'react-native-wheel-pick';
import { colors } from '../utilities/colors';
import MyText from './MyText';
import moment from 'moment';
import { TransparentButton } from './MyButton';
import { pick } from 'react-native-document-picker';
import { icons } from '../utilities/icons';

const MonthYearPicker = forwardRef(({ onAgree }, ref) => {
  const [isVisible, setIsVisible] = useState(false)
  const [yearList, setyearList] = useState([]);
  const [monthList, setMonthList] = useState([])
  const [month, setMonth] = useState(moment().format("MMMM"));
  const [year, setYear] = useState(moment().format("YYYY"))

  useEffect(() => {
    makeListOfYears()
  }, [])

  useEffect(() => {
    if (year == moment().format("YYYY")) {
      let cur_month = moment().format("M");
      let list = months.slice(0, (cur_month ));
      console.log(list,"list")
      setMonthList([...list]);
    } else {
      setMonthList(months)
    }
  }, [year])
  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])

  const makeListOfYears = () => {
    let list = [];
    for (let i = Number(moment().format("YYYY")); i >= 1900; i--) {
      list.push(i);
    }
    setyearList(list);
  }

  const onAgreeClick = () => {
    let result = moment(month + " " + year, "MMMM YYYY").format("MM-YYYY");
    onAgree?.(result);
    closeModal?.()
  }

  const openModal = (monthyear) => {
    if (monthyear) {
      setYear(moment(monthyear, "MM-YYYY").format("YYYY"))
      setMonth(moment(monthyear, "MM-YYYY").format("MMMM"))
    }
    setIsVisible(true)
  }

  const closeModal = () => {
    setIsVisible(false)
  }
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn='zoomIn'
      animationOut='zoomOut'
      animationInTiming={300}
      animationOutTiming={300}
      style={{ margin: 10 }}>

      <View style={__styles.rootView}>
        <View style={__styles.row}>
          <View style={{}}>
            <View style={__styles.headingView}>
              <MyText fontSize={18} type='medium' align='center' color={colors.white} >Month</MyText>
            </View>
            <View style={__styles.pickerOuterView}>
              {icons.upward(colors.primary)}
              <Picker
                style={__styles.pickerView}
                textColor={colors.primary}
                itemStyle={__styles.itemView}
                selectedValue={month}
                pickerData={monthList}
                onValueChange={value => setMonth(value)}
              />
              {icons.downward(colors.primary)}
            </View>
          </View>
          <View style={{ marginLeft: 10 }}>
            <View style={__styles.headingView}>
              <MyText fontSize={18} type='medium' align='center' color={colors.white} >Year</MyText>
            </View>
            <View style={__styles.pickerOuterView}>
              {icons.upward(colors.primary)}
              <Picker
                style={__styles.pickerView}
                textColor={colors.primary}
                itemStyle={{ fontSize: 18 }}
                selectedValue={year}
                pickerData={yearList}
                onValueChange={value => setYear(value)}
              />
              {icons.downward(colors.primary)}
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10, width: "100%", paddingBottom: 10 }}>
          <TransparentButton title='CANCEL' onPress={closeModal} />
          <TransparentButton title='AGREE' onPress={onAgreeClick} />
        </View>
      </View>
    </Modal >
  )
})

export default MonthYearPicker

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const __styles = StyleSheet.create({
  rootView: {
    backgroundColor: colors.secondary,
    alignItems: "center",
    borderRadius: 10
  },
  row: { flexDirection: "row" },
  headingView: { marginTop: 20 },
  pickerOuterView: { marginVertical: 20, borderRadius: 10, borderRadius: 10, alignItems: "center" },
  pickerView: {
    backgroundColor: colors.secondary,
    width: 150, height: 215,
    borderRadius: 10,
    // shadowColor: "#000000",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity:  0.18,
    // shadowRadius: 4.59,
    // elevation: 5,
    // borderWidth:1,
    // borderColor:colors.white+"22"
  },
  itemView: {
    fontSize: 18,
  }
})