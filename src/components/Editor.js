import { View, Text, TouchableOpacity, ScrollView, FlatList, Pressable, Image, SafeAreaView } from 'react-native'
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
import { MyButton, TransparentButton } from './MyButton';
import MyInputs from './MyInputs';
import ImageUploadModal from './ImageUploadModal';
import MyLoader from './MyLoader';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/reducers/userSlice';
import { UPLOAD_FILE_TO_S3 } from '../DAL';

const ic_A = require('../assets/icons/A-alphabet.png');
const ic_bucket = require('../assets/icons/paint.png');
const Editor = ({
  initialValue = "",
  onChange,
  height = 300,
  backgroundColor = colors.secondary,
  label = "",
  autoResonderMsgs = [],
  placeholder = 'Type a message...'
}) => {
  const navigation = useNavigation();
  const { token, S3_URL } = useSelector(selectUser);
  const RichText = useRef();
  const scrollViewRef = useRef();
  const [link, setLink] = useState({ value: "", showDialog: false, title: "" })
  const [foreColor, setForeColor] = useState(colors.lightText2)
  const [backColor, setBackColor] = useState(undefined)
  const [colorModaal, setColorModaal] = useState({ value: "", isVisible: false, for: "" })
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const [loader, setLoader] = useState(false);
  //? Fore Color

  const updateColor = () => {

  }

  const onImagePicked = async (image) => {
    setLoader(true);
    let fd = new FormData();
    fd.append("width", image.width);
    fd.append("image", image);
    let res = await UPLOAD_FILE_TO_S3({ token, navigation, body: fd });
    if (res.code == 200) {
      setLoader(false)
      RichText?.current?.insertImage(S3_URL + res?.image_path);
      RichText?.current?.insertHTML("<br/>")
    } else {
      setLoader(false)
    }
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

  const openDialogue = () => {
    setLink({ value: "", showDialog: true, title: "" })
  };

  const closeDialogue = () => {
    setLink({ ...link, showDialog: false, })
  };

  const addLink = () => {
    RichText.current.insertLink(link.title, link.value);
    closeDialogue();
  }

  const LinkDialog = () => {

    return (
      <Modal
        isVisible={link.showDialog}
        onBackButtonPress={() => closeDialogue()}
        onBackdropPress={() => closeDialogue()}
        useNativeDriverForBackdrop={true}
        avoidKeyboard={true}
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
      >
        <SafeAreaView>
          <View style={{ backgroundColor: colors.secondary, padding: 20, borderRadius: 10 }}>
            <View style={{ marginVertical: 10 }}>
              <MyText align='center' type="medium" fontSize={18} color={colors.primary} >Enter your link</MyText>
            </View>
            <View style={{ marginTop: 10 }}>
              <MyInputs
                label='Title'
                value={link.title}
                onChangeText={title => setLink({ ...link, title })}
              />

              <MyInputs
                label='Link'
                value={link.value}
                onChangeText={Weblink => setLink({ ...link, value: Weblink })}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
              <TransparentButton title='CANCEL' onPress={closeDialogue} />
              <TransparentButton title='ADD' onPress={addLink} />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    )
  };


  return (
    <View>
      {/* {colorModal()} */}
      <View style={{}}>
        {!!label ? <MyText isLabel>{label}</MyText> : null}
        <View style={{ backgroundColor: backgroundColor, borderRadius: 10, overflow: "hidden", }}>
          {LinkDialog()}

          <View style={{ height: height }}>
            <ScrollView
              nestedScrollEnabled={true}
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
                initialContentHTML={!!initialValue ? `<div>${initialValue}</div>` : ""}
                useContainer={true}
                placeholder={placeholder}
                onChange={text => onChange(text)}
                androidLayerType="hardware"
                androidHardwareAccelerationDisabled
                scrollEnabled={true}
                enterKeyHint="done"
                // onSin
                onKeyDown={(data) => {
                  if (data?.keyCode == 13) {
                    RichText?.current?.dismissKeyboard()

                  }
                }}
              />
            </ScrollView>


          </View>
          <RichToolbar
            editor={RichText}
    
            onInsertLink={openDialogue}
            selectedIconTint={colors.primary}
            // keyboardDisplayRequiresUserAction={true}
            // editor={this[`TextEditor`]}
            actions={[
              actions.keyboard,
              actions.undo,
              actions.redo,
              "newline",
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.removeFormat,
              // actions.foreColor,
              // actions.hiliteColor,
              "addImage",
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

              // [actions.foreColor]: ({ tintColor }) => (
              //   <TouchableOpacity
              //     onPress={() => openModal("forecolor")}
              //     style={{ alignItems: "center" }}>
              //     <Image source={ic_A} style={{ height: 20, width: 20, tintColor: tintColor }} />
              //     <View style={{ height: 2, width: 15, backgroundColor: foreColor }} />
              //   </TouchableOpacity>
              // ),
              // [actions.hiliteColor]: ({ tintColor }) => (
              //   <TouchableOpacity
              //     onPress={() => openModal("backcolor")}
              //     style={{ alignItems: "center", marginBottom: -1 }}>
              //     <Image source={ic_bucket} style={{ height: 15, width: 15, tintColor: tintColor }} />
              //     <View style={{ height: 2, width: 17, backgroundColor: backColor, marginTop: 2 }} />
              //   </TouchableOpacity>
              // ),
              ["newline"]: ({ tintColor }) => (
                <TouchableOpacity
                  onPress={() => { RichText?.current?.insertHTML("<br/>") }}
                  style={{ alignItems: "center", marginBottom: -1 }}>
                  {icons.reply(tintColor, 20)}
                </TouchableOpacity>
              ),

              ["addImage"]: ({ tintColor }) => (
                <TouchableOpacity
                  onPress={() => setIsImageModalVisible(true)}
                  style={{ alignItems: "center", marginBottom: -1 }}>
                  {icons.image(tintColor, 20)}
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

        <ImageUploadModal
          closeModal={() => setIsImageModalVisible(false)}
          onImagePicked={onImagePicked}
          isVisible={isImageModalVisible}
        />
        <MyLoader enable={loader} />
      </View>
    </View>
  )
}

export default Editor
