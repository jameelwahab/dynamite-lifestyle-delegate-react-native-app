import { View, Text, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'

const WebPlayer = ({ url, width, height, borderRadius }) => {
  const player = useRef();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View
      renderToHardwareTextureAndroid={true}
      style={{
        width: !!width ? width : Dimensions.get("screen").width,
        height: !!height ? height : 300,
        borderRadius: !!borderRadius ? borderRadius : 0,
      }}>
      {!!url &&
        <WebView
          ref={player}
          // onMessage={(event) => {
          //   if (!!event.nativeEvent.data) {
          //     let data = JSON.parse(event.nativeEvent.data);
          //     if (data?.type == "onProgress") {
          //       this.played = data?.playedSeconds
          //     }
          //     if (data?.type == "onPause") {
          //       this.onPause?.(data)
          //     }
          //   }
          // }}
          id={url}
          cacheEnabled={false}
          startInLoadingState={true}
          scrollEnabled={false}
          allowsAirPlayForMediaPlayback={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={true}
          allowsFullscreenVideo={true}
          onLoadEnd={() => {
            setTimeout(() => {
              setIsLoading(false)
            }, 1600);
          }}
          scalesPageToFit={true}
          containerStyle={{
            height: !!height ? height : 300,
            width: "100%",
            backgroundColor: colors.black,
            opacity: 0.99,
            // overflow: "hidden"
          }}
          cacheMode={'LOAD_NO_CACHE'}
          renderToHardwareTextureAndroid={true}
          source={{ uri: this.getUrl(), }}
        />}
      {isLoading && (
        <View style={{
          backgroundColor: colors.black,
          alignItems: 'center',
          justifyContent: 'center',
          height: !!height ? height : 300,
          position: "absolute",
          // width: Dimensions.get("screen").width
          width: "100%",
        }}>
          <ActivityIndicator color={colors.golden} />
        </View>
      )
      }
    </View>
  )
}

export default WebPlayer