import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { colors } from '../../utilities/colors'
import MyInputs from '../../components/MyInputs'
import Editor from '../../components/Editor'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import MyTouchableInput from '../../components/MyTouchableInput'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { icons } from '../../utilities/icons'

const ReminderSettings = ({ navigation }) => {
  const { user } = useSelector(selectUser);
  const [list, setList] = useState([...user?.welcome_reminder_setting]);
  const [datePicker, setDatePicker] = useState({ isVisible: false, index: -1 });


  const hideDatePicker = () => {
    setDatePicker({ index: -1, isVisible: false });
  };
  const openDatePicker = (index) => {
    setDatePicker({ index: index, isVisible: true });
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  const itemHander = ({ type, value, index }) => {
    list[index][type] = value;
    console.log(list[index])
    setList([...list])
  }


  const renderReminders = ({ item, index }) => {
    return (
      <View style={__styles.itemRoot}>
        <MyInputs
          label='After Days*'
          value={item.reminder_days}
          onChangeText={(text) => itemHander({ type: "reminder_days", value: text, index })}
          keyboardType='number-pad'
        />
        <MyTouchableInput
          onPress={() => openDatePicker(index)}
          label='Notify Time'
          icon={icons.clock}

        />

        {/* Messge Type */}

        <MyText isLabel={true} >Messge Type</MyText>
        <View style={__styles.typeRoot} >
          {type.map((x, i) => (
            <>
              <TouchableOpacity
                onPress={() => itemHander({ type: "message_type", value: x, index })}
                style={[__styles.typeView, item.message_type == x && __styles.selectedType]}>
                <MyText style={[{ textTransform: 'capitalize' }, item.message_type == x && __styles.selectedText]} >{x}</MyText>
              </TouchableOpacity>
              {(i == 0 || i == 1) && (<View style={__styles.sepeartor} />)}
            </>
          ))}
        </View>



        <Editor
          height={200}
          backgroundColor={"#232c43"}

        />
      </View>
    )
  }

  return (
    <RootView title='Welcome Reminder Setting'>
      <KeyboardAwareFlatList
        data={list}
        renderItem={renderReminders}
      />

      <DateTimePickerModal
        isVisible={datePicker.isVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </RootView>
  )
}

export default ReminderSettings;
const type = ["general", "image", "video"]
const reminderObj = {
  reminder_days: 0,
  notify_time: "12:00 AM",
  message_type: "",
  reminder_message: "",
  title: ""
}

const __styles = StyleSheet.create({
  itemRoot: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    margin: 10,
    padding: 10
  },
  typeView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    overflow: "hidden",
  },
  selectedType: {
    backgroundColor: colors.primary2
  },
  selectedText: {
    color: colors.black,
    fontWeight: "500",

  },

  typeRoot: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.lightText2,
    overflow: "hidden",
    borderRadius: 5,
    height: 40
  },
  sepeartor: {
    height: '100%',
    width: 1,
    backgroundColor: colors.lightText2,
  }
})