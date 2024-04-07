import { View, Text, StyleSheet, FlatList, TouchableNativeFeedbackComponent, TouchableOpacity, Pressable, Animated, TouchableHighlight, Vibration } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { selectUser } from '../../../redux/reducers/userSlice'
import { APPOINTMENT_CONFIG_ADD, GET_APPOINTMENT_CONFIG_LIST } from '../../../DAL'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { icons } from '../../../utilities/icons'
import DraggableFlatList, { NestableDraggableFlatList, NestableScrollContainer, OpacityDecorator, ScaleDecorator } from "react-native-draggable-flatlist"
import uuid from 'react-native-uuid';
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import MyInputs from '../../../components/MyInputs'
import CalendarModal from '../../../components/CalendarModal'
import MyDateTimePicker from '../../../components/MyDateTimePicker'
import ConfirmationModal from '../../../components/ConfirmationModal'
import FAB from '../../../components/FAB'
import { MyButton } from '../../../components/MyButton'
import showToast from '../../../functions/showToast'
import MyLoader from '../../../components/MyLoader'


const Configurations = ({ navigation, route }) => {
  const { key, parentKey } = route.params
  const ref_calendar = useRef();
  const ref_scroller = useRef();
  const { navbar } = useSelector(selectNavbar);
  const title = useState(navbar?.find(x => x.value == parentKey)?.child_options?.find(y => y.value == key)?.title);
  const { token } = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [confirm, setConfirm] = useState({ isVisible: false, text: "", index: -1, type: "" });
  const [timePicker, setTimePicker] = useState({
    isVisible: false,
    pIndex: -1,
    cIndex: -1,
    date: moment().toDate(),
    type: "",
  })

  const slot = () => {
    let id = uuid.v4();
    return {
      end_time: "00:00",
      slot_id: id,
      start_time: "00:00"
    }
  }

  const interval = () => {
    let mSlot = slot();
    let id = uuid.v4();
    return {
      appointment_configration_name: "",
      days: [],
      end_date: moment(),
      interval_id: id,
      slot_duration: "",
      slot_type: "",
      slots: [mSlot],
      start_date: moment(),
      _id: ""
    }
  }

  const onDateSelected = (date, type) => {
    handler({ [type.type]: date }, type?.index);
  }

  const closeConfirmModal = () => {
    setConfirm({ isVisible: false, text: "", item: null, index: -1 })
  }
  const closeTimePicker = () => {
    setTimePicker({
      isVisible: false,
      pIndex: -1,
      cIndex: -1,
      date: moment().toDate(),
      type: "",
    })
  }

  const onTimeSelected = (time) => {
    let { pIndex, cIndex, type } = timePicker;
    closeTimePicker();
    list[pIndex].slots[cIndex][type] = moment(time).format("HH:mm");
    setList([...list])

  }

  const onAgree = () => {
    let { type, index } = confirm;
    closeConfirmModal();
    if (type == "duplicate") {
      dublicateTheInterval(index)
    } else if (type == "delete") {
      deleteTheInterval(index)
    }
  }


  const dublicateTheInterval = (index) => {
    let interval = { ...list[index] };
    list.push(interval);
    setList([...list]);
  }

  const deleteTheInterval = (index) => {
    list.splice(index, 1);
    setList([...list]);
  }

  const addNew = () => {
    let obj = interval();
    setList([...list, obj]);
  }

  const onDragEnd = (data, index) => {
    list[index].slots = data;
    setList([...list]);

  }
  const onSubmit = () => {
    for (let i = 0; i < list.length; i++) {
      let interval = list[i];
      let inteval_number = i + 1;
      if (interval?.slot_type == "") {
        showToast({ title: "Alert", body: `Please Select Interval type of Interval ${inteval_number}` })
        return
      } else if (interval?.slot_duration == "") {
        showToast({ title: "Alert", body: `Please enter slot duration of Interval ${inteval_number}` })
        return
      } else if (interval?.days.length == 0) {
        showToast({ title: "Alert", body: `Please select weekdays of Interval ${inteval_number}` })
        return
      }
    }

    addIntervalsToServer();
  }

  const addIntervalsToServer = async () => {
    setLoader(true);
    let res = await APPOINTMENT_CONFIG_ADD({ navigation, token, body: { appointments: list } })
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" })
      setLoader(false)
    } else {
      setLoader(false)

    }
  }


  useEffect(() => {
    getConfigListFromServer()
  }, [])

  const getConfigListFromServer = async () => {

    let res = await GET_APPOINTMENT_CONFIG_LIST({ navigation, token, })
    if (res.code == 200) {
      setList(res?.appointments)
      setLoader(false)
    } else {
      setLoader(false)

    }
  }

  const handler = (obj, index) => {
    list[index] = { ...list[index], ...obj };
    setList([...list]);

  }

  const handlerWeekdays = (day, index) => {
    let days = list[index].days;
    let dINDEX = days.findIndex(x => x == day.fullName)
    if (dINDEX > -1) {
      days.splice(dINDEX, 1);
    } else {
      days.push(day.fullName)
    }
    handler({ days: [...days] }, index);
  }

  const removeSlot = (pIndex, cIndex) => {
    list[pIndex].slots.splice(cIndex, 1);
    setList([...list]);
  }

  const addSlot = (pIndex) => {
    list[pIndex].slots = [...list[pIndex].slots, slot()];
    setList([...list]);
  }


  const renderSlots = ({ item, drag, total, cIndex, pIndex }) => {

    return (
      <ScaleDecorator activeScale={1.05}>
        <OpacityDecorator activeOpacity={0.6}>
          <View style={{ backgroundColor: colors.secondarySelect, marginTop: 5, padding: 10, borderRadius: 10, marginBottom: 10, marginHorizontal: 10 }}>
            <View style={{ flexDirection: "row", }}>
              <View style={{ flex: 1 }}>
                <MyTouchableInput
                  label='From*'
                  icon={() => icons.clock(colors.lightText)}
                  value={moment(item?.start_time, "HH:mm").format("hh:mm A")}
                  onPress={() => setTimePicker({ isVisible: true, pIndex, cIndex, date: moment(item?.start_time, "HH:mm").toDate(), type: "start_time" })}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <MyTouchableInput
                  label='To*'
                  icon={() => icons.clock(colors.lightText)}
                  value={moment(item?.end_time, "HH:mm").format("hh:mm A")}
                  onPress={() => setTimePicker({ isVisible: true, pIndex, cIndex, type: "end_time", date: moment(item?.end_time, "HH:mm").toDate(), })}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              {total > 1 &&
                <TouchableOpacity
                  onPress={() => removeSlot(pIndex, cIndex)}
                  style={__styles.btn}>
                  {icons.minusCircle(colors.delete)}
                </TouchableOpacity>}
              <TouchableOpacity
                onPress={() => addSlot(pIndex)}
                style={__styles.btn}>
                {icons.plusCircle()}
              </TouchableOpacity>
              {total > 1 &&

                <TouchableHighlight
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                  delayLongPress={300}
                  underlayColor={colors.lightPrimary2}
                  onLongPress={() => {
                    Vibration.vibrate(10)
                    drag()
                  }}
                  style={[__styles.btn, { marginLeft: 30, height: 30, width: 30, borderRadius: 30 / 2, alignItems: "center", justifyContent: "center", marginTop: -2 }]}>
                  {icons.drag(colors.primary, 25)}
                </TouchableHighlight>}
            </View>


          </View>
        </OpacityDecorator>
      </ScaleDecorator>
    )
  }

  const renderConfig = (item, index) => {
    return (
      <View style={__styles.itemView}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <MyText type='bold' >{(index + 1) + "."}</MyText>

          <TouchableOpacity
            onPress={() => setConfirm({ isVisible: true, text: "Are you sure you want to duplicate this interval?", index, type: "duplicate" })}
            style={{ flexDirection: "row", paddingVertical: 5, alignItems: "center" }}>
            {icons.duplicate()}
            <MyText type='bold'> Duplicate</MyText>
          </TouchableOpacity>
        </View>
        <View style={__styles.radioRootView}>
          <MyText isLabel>Interval Type *</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Built In'
                value={item?.slot_type == "builtin"}
                onPress={() => handler({ slot_type: "builtin" }, index)}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Custom'
                value={item?.slot_type == "custom"}
                onPress={() => handler({ slot_type: "custom" }, index)}
              />
            </View>
          </View>
        </View>

        {item?.slot_type == "builtin" &&
          <View style={__styles.radioRootView}>
            <MyText isLabel>Slot Duration *</MyText>
            <View style={[__styles.radioView, { flexDirection: "column", paddingTop: 0, paddingHorizontal: 0 }]}>
              <View style={[__styles.radioView, { borderWidth: 0, }]}>
                <View style={__styles.radioItem}>
                  <MyCheckBox
                    title='15 min'
                    onPress={() => handler({ slot_duration: "15" }, index)}
                    value={item?.slot_duration == "15"}
                  />
                </View>
                <View style={__styles.radioItem}>
                  <MyCheckBox
                    title='30 min'
                    value={item?.slot_duration == "30"}
                    onPress={() => handler({ slot_duration: "30" }, index)}
                  // onPress={() => setType(2)}
                  // value={type == 2}
                  />
                </View>
              </View>


              <View style={[__styles.radioView, { borderWidth: 0, }]}>

                <View style={__styles.radioItem}>
                  <MyCheckBox
                    title='45 min'
                    onPress={() => handler({ slot_duration: "45" }, index)}
                    value={item?.slot_duration == "45"}
                  />
                </View>
                <View style={__styles.radioItem}>
                  <MyCheckBox
                    title='60 min'
                    value={item?.slot_duration == "60"}
                    onPress={() => handler({ slot_duration: "60" }, index)}
                  />
                </View>
              </View>

            </View>
          </View>}

        {item?.slot_type == "custom" &&
          <MyInputs
            label='Custom Duration in Min'
            value={item?.slot_duration}
            onChangeText={(text) => handler({ slot_duration: text }, index)}
            keyboardType='number-pad'
          />
        }


        <View style={{ flexDirection: "row", }}  >
          <View style={{ flex: 1 }} >
            <MyTouchableInput
              label='Start Date*'
              icon={() => icons.calendar(colors.lightText)}
              value={moment(item?.start_date).format(dateTimeFormat.date)}
              onPress={() => ref_calendar?.current?.openModal(item?.start_date, { type: "start_date", index: index })}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }} >
            <MyTouchableInput
              label='End Date*'
              icon={() => icons.calendar(colors.lightText)}
              value={moment(item?.end_date).format(dateTimeFormat.date)}
              onPress={() => ref_calendar?.current?.openModal(item?.end_date, { type: "end_date", index: index })}
            />
          </View>
        </View>

        <View style={{ marginHorizontal: -10 }} >
          <NestableDraggableFlatList
            ref={ref_scroller}
            data={item?.slots}
            renderItem={({ item: item2, drag, getIndex }) =>
              renderSlots({ item: item2, drag, cIndex: getIndex(), pIndex: index, total: item?.slots.length })}
            keyExtractor={(item2) => item2.slot_id}
            scrollEnabled={false}
            onDragEnd={({ data }) => onDragEnd(data, index)}
          />
        </View>



        <View style={__styles.radioRootView}>
          <MyText isLabel>Weekdays *</MyText>
          <View style={[__styles.radioView, { flexWrap: "wrap" }]}>

            {weekdays.map((day, dayIndex) =>
              <View key={day.shortName} style={{ flex: 1 }}>
                <MyCheckBox
                  onPress={() => handlerWeekdays(day, index)}
                  title={day.shortName}
                  row={false}
                  value={item?.days.includes(day.fullName)}
                />
              </View>
            )}

          </View>
        </View>

        <TouchableOpacity
          onPress={() => setConfirm({ isVisible: true, text: "Are you sure you want to delete this interval?", index, type: "delete" })}
          style={{ alignSelf: "flex-end", padding: 5 }}
          hitSlop={{ left: 5, top: 5, right: 5, bottom: 5 }}>
          {icons.trashFilled(colors.primary, 20)}
        </TouchableOpacity>
      </View>
    )
  }


  return (
    <RootView title={title} hideBackBottomButton>

      <NestableScrollContainer
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}>
        {list.map(renderConfig)}
        {list.length > 0 &&
          <View style={{ marginTop: 20 }}>
            <MyButton
              invert
              title='Submit'
              onPress={onSubmit}
            />
          </View>}
      </NestableScrollContainer>

      <FAB
        onPress={addNew}
      />

      <CalendarModal
        ref={ref_calendar}
        onDateSelected={onDateSelected}
      />

      <MyDateTimePicker
        isVisible={timePicker.isVisible}
        onCancel={closeTimePicker}
        onConfirm={onTimeSelected}
        date={timePicker?.date}
        mode='time'
      />

      <ConfirmationModal
        isVisible={confirm?.isVisible}
        closeModal={closeConfirmModal}
        title={confirm?.text}
        onAgree={onAgree}
      />

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default Configurations

const weekdays = [{
  fullName: "Monday",
  shortName: "Mon",
},
{
  fullName: "Tuesday",
  shortName: "Tue",
},
{
  fullName: "Wednesday",
  shortName: "Wed",
},
{
  fullName: "Thursday",
  shortName: "Thu",
},
{
  fullName: "Friday",
  shortName: "Fri",
},
{
  fullName: "Saturday",
  shortName: "Sat",
},
{
  fullName: "Sunday",
  shortName: "Sun",
}]



const __styles = StyleSheet.create({
  itemView: {
    marginTop: 10,
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10
  },
  radioRootView: {
    marginBottom: 15
  },
  radioView: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    // padding: 2
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  radioItem: {
    flex: 1,

  },
  btn: {
    marginLeft: 10
  }
})