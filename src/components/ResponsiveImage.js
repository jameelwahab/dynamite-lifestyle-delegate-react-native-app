import { View, Text, Image } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image';
import utilities from '../utilities';
const screenWidth = utilities.windowWidth() * 0.8;

const ResponsiveImage = memo(({ uri, style, width }) => {
  const [size, setSize] = useState({ height: 0, width: 0 });
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    Image.getSize(uri, (width, height) => {
      setSize({ width, height })
    })
  }, [])

  if (size.width != 0) {
    return (
      <FastImage
        source={{ uri: uri }}
        style={[
          size.width <= screenWidth ?
            { width: size.width, height: size.height, } :
            { width: screenWidth - 10, aspectRatio: size.width / size.height }
        ]}
      />
    )
  } else return null;
});

export default ResponsiveImage