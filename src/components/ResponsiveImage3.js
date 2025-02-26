import { View, Text, Image } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image';

const ResponsiveImage3 = memo(({ source, style, imageStyle, width, defaultSize = { height: 1, width: 0 }, children }) => {
  const [size, setSize] = useState({ height: 0, width: 0 });
  // const [, set] = useState(second)

  // useEffect(() => {
  //   Image.getSize(source?.uri, (width, height) => {
  //     setSize({ width, height })
  //   })
  // }, [])

  if (size.width != 0) {
    return (
      <FastImage
        // onLoad={(event) => {
        // console.log(event.nativeEvent, "onLoad")
        // setSize({
        //   width: event.nativeEvent?.width,
        //   height: event.nativeEvent?.height
        // })
        // }}
        // fallback={true}
        source={source}
        resizeMode={'contain'}
        imageStyle={imageStyle}
        style={[
          {
            width: width,
            aspectRatio: size?.width / size?.height,
          },
        ]}
      >{children}</FastImage>
    )
  } else return (
    <View style={{ width: width, height: defaultSize?.height, alignItems: "center", justifyContent: "center" }}>
      <FastImage
        // onLoadStart={(event) => {
        //   console.log(event?.nativeEvent, "onLoadStart")
        // }}

        // onLoadEnd={(event) => {
        //   console.log(event?.nativeEvent, "onLoadEnd")
        // }}
        onLoad={(event) => {
          // console.log(event.nativeEvent?.width, "width")
          setSize({
            width: event.nativeEvent?.width,
            height: event.nativeEvent?.height
          })
        }}
        // onError={(err) => {
        //   console.log(err, "err")
        // }}
        source={source}
        resizeMode={'contain'}
        // fallback={true}
        style={[
          {
            // position: "absolute",
            width: width,
            // height: defaultSize
          },
        ]}
      >{children}</FastImage>
    </View>
  )

});

export default ResponsiveImage3;
