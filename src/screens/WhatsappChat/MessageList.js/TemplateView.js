import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import MyTouchableInput from '../../../components/MyTouchableInput'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import { icons } from '../../../utilities/icons'

const TemplateView = ({ value, onPress, onClearBtnPress, sendBtnPress }) => {
  return (
    <View style={{ paddingTop: 15, }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <MyTouchableInput
            label='Select Template'
            placeholder='No Template Selected...'
            value={value}
            onPress={onPress}
            subTextView={() => !!value && (
              <Pressable
                onPress={onClearBtnPress}
                style={{ paddingBottom: 5, paddingLeft: 10, paddingRight: 5 }} >
                <MyText color={colors.primary} >Clear</MyText>
              </Pressable>
            )}
          />
        </View>
        {!!value &&
          <TouchableOpacity
            onPress={sendBtnPress}
            style={__style.sendButtonView}>
            {icons.send(colors.primary, 18)}
          </TouchableOpacity>}
      </View>
    </View>
  )
}

export default TemplateView

const __style = StyleSheet.create({
  sendButtonView: {
    marginLeft: 5,
    height: 38,
    width: 38,
    backgroundColor: colors.lightPrimary2,
    borderRadius: 38 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Platform.OS == "android" ? 10 : 0,
    marginTop: 5

  },
})