import { View, Text, Pressable, Image, SafeAreaView, } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import { ColorPicker, TriangleColorPicker } from 'react-native-color-picker'
import { colors } from '../utilities/colors'
import { MyButton } from './MyButton'
import { icons } from '../utilities/icons'
import MyText from './MyText'

const ColorModal = ({ isVisible, clodeModal, getColor, removeColor,selectedColor }) => {
  return (
    <Modal
      isVisible={isVisible}
      style={{ margin: 0 }}
      onBackButtonPress={clodeModal}
      onBackdropPress={clodeModal}
      animationIn={"zoomIn"}
      animationOut={"zoomOut"}
      useNativeDriverForBackdrop={true}
    >
      <SafeAreaView>
        <View style={{ height: 400, backgroundColor: colors.secondary, borderRadius: 10 }} >

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>

            <Pressable onPress={clodeModal} style={{ padding: 10 }}>
              {icons.crosssWithCircle_20(colors.white, 30)}
            </Pressable>
          </View>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View style={{ height: 250, width: 250, }}>
              <TriangleColorPicker
                ref={r => { this.picker = r }}
                hideSliders
                hideControls
                defaultColor={selectedColor}
                onColorSelected={color => alert(`Color selected: ${color}`)}
                style={{ flex: 1 }}
              />
            </View>
          </View>

          <View style={{ marginRight: 10, marginBottom: 10, flexDirection: 'row', justifyContent: "flex-end" }}>
            {removeColor &&
              <MyButton title="Remove Color" onPress={() => {
                getColor("#FFFFFF00");
                clodeModal()
              }} />}
            <View style={{ marginLeft: 10, }}>
              <MyButton
                style={{ paddingHorizontal: 20 }}
                textStyle={{ color: colors.black }}
                title="Select"
                onPress={() => {
                  getColor(this.picker.getColor());
                  clodeModal()
                }} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default ColorModal


