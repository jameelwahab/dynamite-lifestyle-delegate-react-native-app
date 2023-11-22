import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import { PermissionsAndroid, Platform } from "react-native"
import showToast from "./showToast"
import { appName } from "../utilities/constants"
import ReactNativeBlobUtil from "react-native-blob-util"


const downloadImage = async (url) => {
  if (Platform.OS === "android") {

    let granted = await requestWritePermission()
    if (granted) {
      const { config, fs } = ReactNativeBlobUtil;
      let PictureDir = fs.dirs.PictureDir;
      let picName = url.split("/").pop();
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: PictureDir + "/" + picName,
          description: 'downloading_file'
        }
      };
      config(options)
        .fetch('GET', url)
        .then(res => {
          console.log(res.path(), "download")
          if (!!res.path()) {
            saveImage(res.path())
          } else {
            showToast({ title: "Image Download failed", body: res?.message, type: "error" })
          }
        });
    } else {
      showToast({ title: "Permission denied", type: "info" })
    }

  } else if (Platform.OS === "ios") {
    saveImage(url)
  }



}

export default downloadImage

const saveImage = (image) => {
  CameraRoll.save(image, { album: appName }).then((res) => {
    console.log(res, "res")
    showToast({ title: "Image Downloaded", body: "Image Saved to Gallery", type: "success" })
  }).catch((err) => {
    showToast({ title: "Image Download failed", body: err?.message, type: "error" })
  })
}

export const requestWritePermission = async () => {
  if (Platform.OS == "android" && Platform.Version < 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      console.log(granted, "granted")
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true
      } else {
        Alert.alert("Permission denied")
        return false
      }
    } catch (e) {
      return false
    }
  } else {
    return true
  }
}