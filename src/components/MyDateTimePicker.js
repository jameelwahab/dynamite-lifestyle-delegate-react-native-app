import { View, Text } from 'react-native'
import React from 'react'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { colors } from '../utilities/colors'

const MyDateTimePicker = ({
  isVisible = false,
  onCancel,
  onConfirm,
  mode = "date",
  date = new Date()
}) => {
  return (
    <DateTimePicker
      isVisible={isVisible}
      date={date()}
      accentColor={colors.primary}
      onCancel={onCancel}
      onConfirm={onConfirm}
      display="spinner"
      mode={mode}
      buttonTextColorIOS={colors.primary}
      // isDarkModeEnabled={true}
      // pickerContainerStyleIOS={{ backgroundColor: colors.modalBackgroud, color: colors.white }}
      // pickerComponentStyleIOS={{color:"red"}}
    />
  )
}

export default MyDateTimePicker