import { View, Text, StyleSheet, FlatList, TouchableNativeFeedbackComponent, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { selectUser } from '../../../redux/reducers/userSlice'
import { GET_APPOINTMENT_CONFIG_LIST } from '../../../DAL'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { icons } from '../../../utilities/icons'
import DraggableFlatList, { NestableDraggableFlatList, NestableScrollContainer, OpacityDecorator, ScaleDecorator } from "react-native-draggable-flatlist"
import uuid from 'react-native-uuid';
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import MyInputs from '../../../components/MyInputs'


const Configurations = ({ navigation, route }) => {
  const { key, parentKey } = route.params
  const { navbar } = useSelector(selectNavbar);
  const title = useState(navbar?.find(x => x.value == parentKey)?.child_options?.find(y => y.value == key)?.title);
  const { token } = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);

  const slot = () => {
    let id = uuid.v4();
    return {
      end_time: "00:00",
      slot_id: id,
      start_time: "00:00"
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
    console.log(days, "days")

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
    console.log(list[pIndex].slots, "slots")
    setList([...list]);
  }

  const addSlot = (pIndex) => {
    list[pIndex].slots = [...list[pIndex].slots, slot()];
    console.log(list[pIndex].slots, "slots")
    setList([...list]);
  }


  const renderSlots = ({ item, drag, total, cIndex, pIndex }) => {
    return (
      <ScaleDecorator activeScale={1.05}>
        <OpacityDecorator activeOpacity={0.6}>
          <View style={{ backgroundColor: colors.secondarySelect, marginTop: 5, padding: 10, borderRadius: 10, marginBottom: 10, marginHorizontal: 10 }}>
            <View style={{ flexDirection: "row", }}>
              <View pointerEvents='none' style={{ flex: 1 }}>
                <MyTouchableInput
                  label='From*'
                  icon={() => icons.clock(colors.lightText)}
                  value={moment(item?.start_time, "HH:mm").format("hh:mm A")}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <MyTouchableInput
                  label='To*'
                  icon={() => icons.clock(colors.lightText)}
                  value={moment(item?.end_time, "HH:mm").format("hh:mm A")}
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

              <TouchableOpacity
                onLongPress={drag}
                style={[__styles.btn, { marginLeft: 30 }]}>
                {icons.drag(colors.primary, 25)}
              </TouchableOpacity>
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

          <TouchableOpacity style={{ flexDirection: "row", paddingVertical: 5, alignItems: "center" }}>
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
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }} >
            <MyTouchableInput
              label='End Date*'
              icon={() => icons.calendar(colors.lightText)}
              value={moment(item?.end_date).format(dateTimeFormat.date)}
            />
          </View>
        </View>

        <View style={{ marginHorizontal: -10 }} >
          <NestableDraggableFlatList
            data={item?.slots}
            renderItem={({ item: item2, drag, index: cIndex }) =>
              renderSlots({ item: item2, drag, cIndex, pIndex: index, total: item?.slots.length })}
            keyExtractor={(item2) => item2.slot_id}
            scrollEnabled={false}
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
        showsVerticalScrollIndicator={false}>
        {list.map(renderConfig)}
        {/* <FlatList
          data={[0, 1, 2]}
          renderItem={renderConfig}
        /> */}
      </NestableScrollContainer>
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

let obj = {
  appointment_configration_name: "",
  days: [],
  end_date: "",
  interval_id: uuid.v4(),
  slot_duration: "",
  slot_type: "",
  slots: [{ ...slot }],
  start_date: "",
  _id: ""
}

let slot = {
  end_time: "00:00",
  slot_id: uuid.v4(),
  start_time: "00:00"
}

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