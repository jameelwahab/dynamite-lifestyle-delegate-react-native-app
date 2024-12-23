import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import { PermissionsAndroid, Platform } from "react-native"
import showToast from "./showToast"
import { appName } from "../utilities/constants"
import ReactNativeBlobUtil from "react-native-blob-util"


const downloadImage = async (url) => {
  // if (Platform.OS === "android") {
  let granted = await requestWritePermission()
  if (granted) {
    const { config, fs } = ReactNativeBlobUtil;
    let PictureDir = Platform.OS === "android" ? fs.dirs.PictureDir : fs.dirs.DownloadDir;
    let picName = url.split("/").pop();
    let options = {
      fileCache: true,
      appendExt: picName = url.split(".").pop(),
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: PictureDir + "/" + picName,
        description: 'downloading_file'
      }
    };
    await config(options)
      .fetch('GET', url)
      .then(async res => {
        if (!!res.path()) {
          if (Platform.OS == "android") {
            await saveImage(res.path())
          } else {
            await saveImage(res.path())
          }
        } else {
          showToast({ title: "Image Download failed", body: res?.message, type: "error" })
        }
      });
  } else {
    showToast({ title: "Permission denied", type: "info" })
  }

  // } else if (Platform.OS === "ios") {
  //   saveImage(url)
  // }



}

export default downloadImage

const saveImage = async (image) => {
  await CameraRoll.saveAsset(image, { album: appName, type: "auto" }).then((res) => {
    showToast({ title: "Image Downloaded", body: "Image Saved to Gallery", type: "success" })
  }).catch((err) => {
    console.log(err, "err")
    showToast({ title: "Image Download failed", body: err?.message, type: "error" })
  })
}

export const requestWritePermission = async () => {
  if (Platform.OS == "android" && Platform.Version < 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
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