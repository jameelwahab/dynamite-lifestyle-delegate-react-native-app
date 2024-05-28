import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import MyText from './MyText'
import { colors } from '../utilities/colors'
import MyImage from './MyImage'
import { S3_URL } from '../utilities/constants'
import { icons } from '../utilities/icons'
import ImageUploadModal from './ImageUploadModal'
import ImageZoomer from './ImageZoomer'
import EmptyView from './EmptyView'
import MyCheckBox from './MyCheckBox'

const UploadFileInput = ({
  label = "",
  subLabel = "",
  selectedImage,
  onImagePicked,
  onRemoveBtnPress,
  disable = false,
  hideRemoveButton = false,
  showCheckbox = false,
  checkBoxValue = false,
  onCheckBoxPress = () => { },

}) => {
  const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
  const [imageForZoom, setImageForZoom] = useState("")

  return (

    <>
      <View style={__styles.rootView}>
        <View style={__styles.headerView}>
          {showCheckbox &&
            <View style={__styles.checkBoxView}>
              <MyCheckBox
                onPress={onCheckBoxPress}
                value={checkBoxValue}
                pb={0}
              />
            </View>
          }
          <View style={__styles.headingView}>
            <MyText type='medium'>{label}</MyText>
            {!!subLabel &&
              <View style={{ marginTop: 2 }}>
                <MyText fontSize={11} color={colors.lightText} >{subLabel}</MyText>
              </View>}
          </View>
          {!disable &&
            <TouchableOpacity
              style={__styles.btnView}
              hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
              onPress={() => setIsImagePickerVisible(true)}
            >
              {icons.upload2(colors.primary, 20)}
            </TouchableOpacity>}
        </View>

        <View style={__styles.imageBox}>
          {!!selectedImage ?
            <Pressable onPress={() => setImageForZoom(selectedImage)}>
              <MyImage
                source={{ uri: !!selectedImage.uri ? selectedImage.uri : S3_URL + selectedImage }}
                style={{ height: '100%', width: '100%' }}

              />
            </Pressable> :
            <View style={__styles.dummyImage}>
              <MyImage
                opacity={0.6}
                source={icons.photo1}
                style={{ height: 50, width: 50 }}
              />
              <View style={{ marginTop: 5 }}>
                <MyText fontSize={12} >No Image Selected</MyText>
              </View>
            </View>}

          {!!selectedImage && hideRemoveButton == false &&
            <TouchableOpacity
              onPress={onRemoveBtnPress}
              style={__styles.removeIconBtn}>
              {icons.crosss(colors.white, 25)}
            </TouchableOpacity>
          }
        </View>
      </View>

      <ImageUploadModal
        isVisible={isImagePickerVisible}
        onImagePicked={onImagePicked}
        closeModal={() => setIsImagePickerVisible(false)}

      />

      <ImageZoomer
        visible={!!imageForZoom}
        closeModal={() => setImageForZoom("")}
        url={!!imageForZoom.uri ? imageForZoom.uri : imageForZoom}
        noUrl={!!imageForZoom.uri ? true : false}
      />

    </>
  )
}

export default UploadFileInput;

const __styles = StyleSheet.create({
  rootView: {
    marginBottom: 15
  },
  checkBoxView: {
    marginRight: 10
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
    paddingHorizontal: 5,
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
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    height: 150,
    marginTop: 10
  },
  removeIconBtn: {
    position: "absolute",
    backgroundColor: colors.delete,
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    right: 5,
    top: 5

  }
})