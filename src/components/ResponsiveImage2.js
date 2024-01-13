import { View, Text, Image } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image';
import utilities from '../utilities';

const ResponsiveImage2 = memo(({ uri, style, width }) => {
  const [size, setSize] = useState({ height: 0, width: 0 });
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    console.log(uri, "uri")
    Image.getSize(uri, (width, height) => {
      setSize({ width, height })
    })
  }, [])

  if (size.width != 0) {
    return (
      <FastImage
        source={{ uri: uri }}
        // style={[
        //   { width: width, aspectRatio: size.width / size.height },
        // ]}
        style={[
          { width: width, aspectRatio: size.width / size.height },
        ]}
      />
    )
  } else return null;
});

export default ResponsiveImage2;