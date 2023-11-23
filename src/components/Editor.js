import { View, Text, TouchableOpacity, ScrollView, FlatList, Pressable, Image } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'

import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import Dialog from 'react-native-dialog';
import { colors } from '../utilities/colors';
import { fonts } from '../utilities/fonts';
import {
  HueSlider,
  SaturationSlider,
  LightnessSlider,
} from 'react-native-color';
import tinycolor from 'tinycolor2';
import Collapsible from 'react-native-collapsible';
import Modal from 'react-native-modal';
import MyText from './MyText';
import { icons } from '../utilities/icons';
import { MyButton } from './MyButton';

const ic_A = require('../assets/icons/A-alphabet.png');
const ic_bucket = require('../assets/icons/paint.png');
const Editor = ({
  initialValue = "",
  onChange,
  height = 300,
  backgroundColor = colors.secondary,
  label = "",
  autoResonderMsgs = []
}) => {

  const RichText = useRef();
  const scrollViewRef = useRef();
  const [link, setLink] = useState({ value: "", showDialog: false })
  const [foreColor, setForeColor] = useState(colors.lightText2)
  const [backColor, setBackColor] = useState(undefined)
  const [colorModaal, setColorModaal] = useState({ value: "", isVisible: false, for: "" })


  //? Fore Color

  const updateColor = () => {

  }





  const closeModal = () => {
    setColorModaal({ ...colorModaal, isVisible: false, })
  }

  const openModal = (type) => {
    setColorModaal({ ...colorModaal, isVisible: true, for: type })
  }


  // const colorModal = () => {
  //   const [palletColor, setPalletColor] = useState(tinycolor('#FFFFFF').toHsl())
  //   const updateHue = (h) => setPalletColor({ ...palletColor, h })
  //   const updateSaturation = (s) => setPalletColor({ ...palletColor, s })

  //   const pickColor = () => {
  //     if (colorModaal.for == "backcolor") {

  //     } else if (colorModaal.for == "forecolor") {

  //     }
  //   }


  //   return (
  //     <Modal
  //       isVisible={colorModaal.isVisible}
  //       useNativeDriverForBackdrop={true}
  //       style={{ margin: 0 }}>

  //       <View style={{ backgroundColor: colors.secondary, marginHorizontal: 10, borderRadius: 10, paddingHorizontal: 20, paddingTop: 15, paddingBottom: 30 }}>

  //         <View style={{ flexDirection: "row", alignItems: "center" }}>
  //           <View style={{ height: 30, width: 30, }} />
  //           <View style={{ flex: 1, alignItems: "center" }} >
  //             <MyText fontSize={20}>Pick Color</MyText>
  //           </View>
  //           <Pressable
  //             onPress={closeModal}
  //             style={{ height: 30, width: 30, alignItems: "center", justifyContent: "center", }} >
  //             {icons.crosss()}
  //           </Pressable>
  //         </View>

  //         <View style={{}}>


  //           <View style={{ marginTop: 20 }}>
  //             <HueSlider
  //               gradientSteps={40}
  //               value={palletColor.h}
  //               onValueChange={updateHue}
  //             />
  //           </View>

  //           <View style={{ marginTop: 20 }}>
  //             <SaturationSlider
  //               gradientSteps={20}
  //               value={palletColor.s}
  //               color={palletColor}
  //               onValueChange={updateSaturation}
  //             />
  //           </View>

  //           {/* <View style={{ marginTop: 20 }}>
  //             <LightnessSlider
  //               gradientSteps={20}
  //               value={palletColor.l}
  //               color={palletColor}
  //               onValueChange={updateLightness}
  //             />
  //           </View> */}


  //         </View >

  //         <View style={{ marginTop: 30 }}>
  //           <MyButton title='Select' invert onPress={pickColor} />
  //         </View>

  //       </View>

  //     </Modal>
  //   )
  // }


  //? Link Dialog

  openDialogue = (type) => {
    setLink({ value: "", showDialog: true })
  };

  closeDialogue = () => {
    setLink({ ...link, showDialog: false, for: "" })
  };

  LinkDialog = () => {
    return (
      <View>
        <Dialog.Container
          visible={link.showDialog}
          onBackdropPress={closeDialogue}>
          <Dialog.Title style={{ color: colors.taskText, }}>
            Insert Link
          </Dialog.Title>
          <Dialog.Description
            style={{ color: colors.taskText, }}>
            Please enter the link
          </Dialog.Description>
          <Dialog.Input
            style={{ color: colors.taskText, }}
            onChangeText={Weblink => setLink({ ...link, value: Weblink })}
          />
          <Dialog.Button label="Cancel" onPress={closeDialogue} />
          <Dialog.Button
            label="Add"
            onPress={() => {
              console.log(RichText, link.value, "RichText")
              RichText.current.insertLink(null, link.value);
              closeDialogue();
            }}
          />
        </Dialog.Container>
      </View>
    );
  };
  // console.log(RichText, "console.log(RichText")
  return (
    <View>
      {/* {colorModal()} */}
      <View style={{}}>
        {!!label ? <MyText isLabel>{label}</MyText> : null}
        <View style={{ backgroundColor: backgroundColor, borderRadius: 10, overflow: "hidden", }}>
          {LinkDialog()}

          <View style={{ height: height }}>
            <ScrollView
              bounces={false}
              ref={scrollViewRef}
              onContentSizeChange={(contentWidth, contentHeight) => {
                scrollViewRef?.current?.scrollToEnd({ animated: false });
              }}>
              <RichEditor
                ref={RichText}
                style={{ backgroundColor: colors.backgorund2 }}
                initialHeight={height}
                editorStyle={{
                  backgroundColor: backgroundColor,
                  color: colors.lightText2,
                  caretColor: colors.white,
                  contentCSSText: `font-family: Verdana`,
                  placeholderColor: colors.placeholder
                }}
                selectedIconTint={colors.primary}
                iconTint={colors.primary}
                initialContentHTML={initialValue}
                useContainer={true}
                placeholder={'Type a message...'}
                onChange={text => onChange(text)}
                androidLayerType="software"
                androidHardwareAccelerationDisabled
              />
            </ScrollView>


          </View>
          <RichToolbar
            editor={RichText}
            onInsertLink={openDialogue}
            selectedIconTint={colors.primary}
            // editor={this[`TextEditor`]}
            actions={[
              actions.keyboard,
              actions.undo,
              actions.redo,
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.removeFormat,
              // actions.foreColor,
              // actions.hiliteColor,
              actions.insertLink,
              actions.setSubscript,
              actions.setSuperscript,
              actions.setStrikethrough,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.setParagraph,
              actions.heading1,
              actions.heading2,
              actions.heading3,
              actions.heading4,
              actions.heading5,
              actions.heading6,
              actions.line,
              actions.alignLeft,
              actions.alignCenter,
              actions.alignRight,
              actions.alignFull,
              actions.outdent,
              actions.indent,
              actions.blockquote,
            ]}

            iconMap={{
              [actions.foreColor]: ({ tintColor }) => (
                <TouchableOpacity
                  onPress={() => openModal("forecolor")}
                  style={{ alignItems: "center" }}>
                  <Image source={ic_A} style={{ height: 20, width: 20, tintColor: tintColor }} />
                  <View style={{ height: 2, width: 15, backgroundColor: foreColor }} />
                </TouchableOpacity>
              ),
              [actions.hiliteColor]: ({ tintColor }) => (
                <TouchableOpacity
                  onPress={() => openModal("backcolor")}
                  style={{ alignItems: "center", marginBottom: -1 }}>
                  <Image source={ic_bucket} style={{ height: 15, width: 15, tintColor: tintColor }} />
                  <View style={{ height: 2, width: 17, backgroundColor: backColor, marginTop: 2 }} />
                </TouchableOpacity>
              ),
              [actions.heading1]: ({ tintColor }) => (
                <Text style={{ color: tintColor, fontWeight: '700' }}>
                  H1
                </Text>
              ),
              [actions.heading2]: ({ tintColor }) => (
                <Text style={{ color: tintColor, fontWeight: '700' }}>
                  H2
                </Text>
              ),
              [actions.heading3]: ({ tintColor }) => (
                <Text style={{ color: tintColor, fontWeight: '700' }}>
                  H3
                </Text>
              ),
              [actions.heading4]: ({ tintColor }) => (
                <Text style={{ color: tintColor, fontWeight: '700' }}>
                  H4
                </Text>
              ),
              [actions.heading5]: ({ tintColor }) => (
                <Text style={{ color: tintColor, fontWeight: '700' }}>
                  H5
                </Text>
              ),
              [actions.heading6]: ({ tintColor }) => (
                <Text style={{ color: tintColor, fontWeight: '700' }}>
                  H6
                </Text>
              ),
              [actions.setParagraph]: ({ tintColor }) => (
                <Text style={{ color: tintColor, fontWeight: '700' }}>
                  P
                </Text>
              ),
            }}
            style={{ backgroundColor: colors.backgorund2 }}
          />


        </View>


        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <ScrollView horizontal>
            {autoResonderMsgs.map((x, i) => (
              <TouchableOpacity
                key={x._id}
                style={{ backgroundColor: colors.secondaryVariant, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, marginRight: 5, }}
                onPress={() => {
                  onChange(initialValue + " " + x.message);
                  RichText?.current?.setContentHTML(initialValue + " " + x.message)
                }}
              >
                <MyText>{x?.title}</MyText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  )
}

export default Editor