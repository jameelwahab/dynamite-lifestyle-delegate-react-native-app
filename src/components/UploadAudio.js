import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import MyText from './MyText'
import { colors } from '../utilities/colors'
import { S3_URL } from '../utilities/constants'
import { icons } from '../utilities/icons'
import DocumentPicker from 'react-native-document-picker'
import showToast from '../functions/showToast'
import AudioPlayer from './AudioPlayer'


const UploadAudio = ({
  label = "",
  subLabel = "",
  selectedAudio,
  onAudioPicked,
  onRemoveBtnPress,
  hideRemoveButton = false,
}) => {


  const onUplaodPress = async () => {
    try {
      let res = await DocumentPicker.pick({ type: Platform.OS === 'ios' ? 'public.mp3' : 'audio/mpeg' })
      onAudioPicked?.(res[0])
    } catch (e) {
      // if (e.code != "DOCUMENT_PICKER_CANCELED") {
      // showToast({ body: e.message.replace(/e.domain/g, ""), title: "" })
      // }
    }
  }

  return (
    <>
      <View style={__styles.rootView}>
        <View style={__styles.headerView}>
          <View style={__styles.headingView}>
            <MyText type='medium' >{label}</MyText>
            <View style={{ marginTop: 2 }}>
              <MyText fontSize={11} color={colors.lightText} >{subLabel}</MyText>
            </View>
          </View>
          <TouchableOpacity
            style={__styles.btnView}
            hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
            onPress={onUplaodPress}
          >
            {icons.upload2(colors.primary, 20)}
          </TouchableOpacity>
        </View>

        <View style={[__styles.imageBox, { height: !!selectedAudio ? 60 : 50 }]}>
          {!!selectedAudio ?
            <View style={{ paddingVertical: 10 }}>
              <AudioPlayer url={selectedAudio} />
            </View>
            :

            <View style={__styles.dummyImage}>
              <View style={{}}>
                <MyText fontSize={12} >No Audio Selected</MyText>
              </View>
            </View>}

          {!!selectedAudio && hideRemoveButton == false &&
            <TouchableOpacity
              onPress={onRemoveBtnPress}
              style={__styles.removeIconBtn}>
              {icons.crosss(colors.white, 25)}
            </TouchableOpacity>}

        </View>
      </View>


    </>
  )
}

export default UploadAudio;

const __styles = StyleSheet.create({
  rootView: {
    marginBottom: 15
  },
  dummyImage: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5
  },
  headingView: {
    flex: 1,
  },
  btnView: {
    height: 30,
    width: 30,
    alignItems: "flex-end",
    justifyContent: "center",

  },
  imageBox: {
    borderTopWidth: 1,
    borderTopColor: colors.lightText,
    borderRadius: 5,
    height: 50,
    marginTop: 10,
  },
  removeIconBtn: {
    position: "absolute",
    backgroundColor: colors.delete,
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    right: 0,
    top: 5

  }
})