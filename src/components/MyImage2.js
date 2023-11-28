import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'

const MyImage2 = ({ uri, style, width }) => {
  const [ratio, setRatio] = useState(0);
  const [loader, setLoader] = useState(false);


  useEffect(() => {
    Image.getSize(uri, (width, height) => {
      setRatio(width / height)
    })
  }, [])

  if (ratio != 0) {
    return (
      <FastImage
        source={{ uri: uri }}
        style={[{ width: width, aspectRatio: 4.36 }]}
        onLoad={(res) => {
          console.log("onload")
          console.log(res.nativeEvent?.width, res.nativeEvent?.height, "width,height")
          // setRatio(res.nativeEvent?.width / res.nativeEvent?.height);
        }}
        onLoadStart={() => console.log("onload Start")}
        onLoadEnd={() => console.log("onload ENd")}
        onError={() => console.log("onload Error")}

      />
    )
  } else return null;
}

export default MyImage2