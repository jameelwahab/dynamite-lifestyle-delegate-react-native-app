import { View, Text } from 'react-native'
import React from 'react'
import ReactNativeBlobUtil from "react-native-blob-util"
import showToast from './showToast';
const downloadFile = async (url, path, bodyTitle) => {



  if (Platform.OS === "android") {


    let ext = extention(url);
    ext = "." + ext[0];
    const config = ReactNativeBlobUtil.config;
    const fs = ReactNativeBlobUtil.fs;
    let DownloadDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        description: 'Downloading file.',
        path: DownloadDir + "/" + path + ext,
      }
    }

    await config(options).fetch('GET', url).then(async (res) => {

      try {


        let info = await ReactNativeBlobUtil.fs.stat(res.path());
        let result = await ReactNativeBlobUtil.MediaCollection.copyToMediaStore({
          name: path + "." + ext, // name of the file
          parentFolder: path + "." + ext,
          mimeType: info.type
        },
          'Download', // Media Collection to store the file in ("Audio" | "Image" | "Video" | "Download")
          res.path()// Path to the file being copied in the apps own storage
        );
        showToast({ title: "Downloaded", body: bodyTitle || "File downloaded", type: "success" });
      } catch (error) {
        alert("error in dowload!")
      }

    }).catch((errorMessage, statusCode) => {

      alert("error in dowload!")

    });




  }

  else {

    let ext = extention(url);
    ext = "." + ext[0];
    const config = ReactNativeBlobUtil.config;
    let options = {
      fileCache: true,
      path: ReactNativeBlobUtil.fs.dirs.DocumentDir + "/" + path + ext,
    }

    await config(options).fetch('GET', url).then(async (res) => {


      showToast({ title: "Downloaded", body: bodyTitle || "Recources downloaded", type: "success" });

    }).catch((errorMessage,) => {

      alert("error in dowload!")

    });

  }

}

export default downloadFile


const extention = (filename) => {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}
