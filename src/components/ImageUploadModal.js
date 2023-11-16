import { View, Text, StyleSheet, Pressable, Image, SafeAreaView } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import { colors } from '../utilities/colors'
import ImageCropPicker from 'react-native-image-crop-picker'
import showToast from '../functions/showToast'


import MyText from './MyText'
import { icons } from '../utilities/icons'

const ImageUploadModal = ({
  isVisible = false,
  onImagePicked,
  closeModal,
  mediaType = "photo",
  cropping = false,
  removeImage = false,
  multiple = false
}) => {

  const openCamera = async () => {
    // closeModal()
    let granted;
    if (Platform.OS == 'android') {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } else {
      granted = true;
    }

    if (granted) {
      setTimeout(() => {
        ImageCropPicker.openCamera({
          width: 600,
          height: 600,
          cropping: cropping,
          mediaType: mediaType,
          cropperStatusBarColor: colors.background,
          cropperToolbarColor: colors.background,

        })
          .then(image => {
            onImagePicked({
              uri: image.sourceURL,
              name: image.filename,
              type: image.mime,
              height: image.height,
              width: image.width,
            });


            setTimeout(() =>
              closeModal(), 500)
          })
          .catch(e => {
            closeModal()
            if (e?.code == 'E_NO_CAMERA_PERMISSION') {
              showToast(e.message, 'Permission not granted');
            }
            console.log('Error', JSON.stringify(e));
          });
      }, 500);
    } else {
      closeModal()
    }
  }

  const openGallery = () => {

    ImageCropPicker.openPicker({
      width: 600,
      height: 600,
      cropping: cropping,
      mediaType: mediaType,
      cropperStatusBarColor: colors.background,
      cropperToolbarColor: colors.background,
      multiple: multiple,
      maxFiles: 20
    })
      .then(image => {
        console.log(image, "image")
        if (!multiple) {
          onImagePicked({
            uri: image.sourceURL,
            name: image.filename,
            type: image.mime,
            height: image.height,
            width: image.width,
          });
        } else {
          let images = image.map((x) => {
            return {
              uri: x.sourceURL,
              name: x.filename,
              type: x.mime,
              height: x.height,
              width: x.width,
            }
          });
          onImagePicked(images)
        }
        setTimeout(() =>
          closeModal(),
          500)
      })
      .catch(e => {
        console.log('HI', JSON.stringify(e));
        closeModal()
        if (e.code == 'E_NO_LIBRARY_PERMISSION') {
          showToast(
            'Please allow permssion in settings first',
            'Permission denied',
          );
        }
      });

  }

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      useNativeDriverForBackdrop={true}
      style={{ margin: 0 }}
    >
      <SafeAreaView style={__modalStyle.root}>
        <View style={__modalStyle.innerView}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <MyText fontSize={18} type={"medium"} >Select Image</MyText>
            </View>
            <Pressable
              onPress={closeModal}
              style={{ alignItems: 'center' }}>
              <View
                style={__modalStyle.iconView}>
                {icons.crosssWithCircle()}
              </View>
            </Pressable>
          </View>
          <View
            style={{ marginTop: 25, flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={openCamera} style={{ alignItems: 'center' }}>
              <View style={__modalStyle.bigIconView}>
                {icons.camera()}
              </View>
              <MyText>Camera</MyText>
            </Pressable>

            <Pressable
              onPress={openGallery}
              style={{ alignItems: 'center', marginLeft: 30 }}>
              <View style={__modalStyle.bigIconView}>
                {icons.images()}
              </View>
              <MyText>Gallery</MyText>
            </Pressable>
            {!!removeImage && (
              <Pressable
                onPress={() =>
                  onImagePicked(null)
                }
                style={{ alignItems: 'center', marginLeft: 30 }}>
                <View style={__modalStyle.bigIconView}>
                  {icons.trashFilled()}
                </View>
                <MyText>Remove</MyText>
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal >
  )
}

export default ImageUploadModal


const __modalStyle = StyleSheet.create({
  root: {
    backgroundColor: colors.secondary,
    marginTop: "auto",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  innerView: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 15
  },
  iconView: {
    backgroundColor: '#BDC3C744',
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  bigIconView: {
    backgroundColor: '#BDC3C722',
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom: 5,
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: colors.icon
  }
})