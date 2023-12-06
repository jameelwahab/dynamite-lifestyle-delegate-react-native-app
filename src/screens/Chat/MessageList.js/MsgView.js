import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import utilities from '../../../utilities'
import MyText from '../../../components/MyText'
import { convertTimezone } from '../../../functions/convertTime'
import { S3_URL } from '../../../utilities/constants'
import { colors } from '../../../utilities/colors'
import ResponsiveImage from '../../../components/ResponsiveImage';
import { isHtml } from '../../../functions/regex'
import MyWebview from '../../../components/MyWebview'
import copyText from '../../../functions/copyText'
import Markdown from '@ronradtke/react-native-markdown-display';
import { fonts } from '../../../utilities/fonts'
import AudioChatView from './AudioChatView'
import TrackPlayer from 'react-native-track-player'

const MsgView = ({ item, index, user, timezone, onMsgLongPress, openImageZommer }) => {

  const [state, updateState] = useState({
    selected_audio: null,
    isPlaying: ""
  });
  const setState = (updation) => updateState({ ...state, ...updation });
  const isOtherMember = (id) => {
    return id == user?._id;
  }


  const playIconClick = async (audio, id) => {
    if (audio !== state.selected_audio) {
      setState({ selected_audio: audio, isPlaying: id })
      await TrackPlayer.pause();
      await TrackPlayer.reset()
      await TrackPlayer.add({
        id: id,
        url: S3_URL + audio,
        // url:sampleUrl,
        title: "",
        artist: "",
        album: '',
        genre: '',
        artwork: "",
      });
      await TrackPlayer.play()

    }
    else {
      let playerState = await TrackPlayer.getState();
      // console.log(await TrackPlayer.getActiveTrack(), 'state')
      if (playerState === TrackPlayer.STATE_PAUSED || playerState === "ready" || playerState == "paused") {
        await TrackPlayer.play();
        setState({ isPlaying: id });
      }
      else {
        await TrackPlayer.pause();
        setState({ isPlaying: "" })
      }
    }
  }

  const stopPlayer = async () => {
    await TrackPlayer.reset()
    setState({ isPlaying: "", selected_audio: null })
  }

  return (
    <TouchableOpacity
      onLongPress={onMsgLongPress}
      style={{ alignSelf: isOtherMember(item.receiver_id) ? "flex-start" : "flex-end", }}
    >
      <View
        style={{
          borderBottomRightRadius: isOtherMember(item.receiver_id) ? 10 : 0,
          borderBottomLeftRadius: isOtherMember(item.receiver_id) ? 0 : 10,
          backgroundColor: isOtherMember(item.receiver_id) ? colors.lightText2 : colors.secondaryVariant,
          minWidth: utilities.screenWidth() * 0.4,
          maxWidth: utilities.screenWidth() * 0.8,
          padding: 5,
          borderRadius: 10,
          marginTop: 10
        }}>
        <View>

          {/*//?   Image View  */}

          {item.message_type == 'image' && !!item.image &&
            <TouchableOpacity
              onLongPress={onMsgLongPress}
              onPress={() => openImageZommer(item.image)}
              style={{ padding:2 }}>
              <ResponsiveImage
                uri={S3_URL + item?.image}
                source={{ uri: S3_URL + item?.image }}
              />
            </TouchableOpacity>}

          {/*//?   Audio View  */}

          {item?.message_type == 'audio' && !!item?.audio_url &&
            <AudioChatView
              currentPlaying={state.isPlaying}
              currentTrack={state.selected_audio}
              thisTrack={item._id}
              onPress={() => playIconClick(item.audio_url, item._id)}
              stopPlayer={stopPlayer}
              totalDuration={item?.audio_duration}
              url={item?.audio_url}
            />
          }



          {/*//?   Message View  */}

          <View style={{ paddingHorizontal: 5 }}>
            {isHtml(item?.message) ?
              <MyWebview
                style={isOtherMember(item.receiver_id) ? WebviewStyleOther : WebviewStyleMine}
                html={item?.message}
              /> :

              <Markdown
                style={isOtherMember(item.receiver_id) ? markdownStyleOther : markdownStyleMine}
                onLink={(url) => Linking.openURL(url)}>
                {item.message}
              </Markdown>}
          </View>

          <View style={{ marginTop: 5, alignSelf: "flex-end" }}>
            <MyText
              fontSize={10}
              color={isOtherMember(item.receiver_id) ? colors.black : undefined}>
              {convertTimezone(item?.createdAt, timezone).format("DD-MM-YYYY hh:mm A")}
            </MyText>
          </View>
        </View>
      </View>
    </TouchableOpacity >
  )
}

export default MsgView;

const markdownStyleMine = {
  body: {
    color: colors.white,
    fontFamily: fonts.regular,
  },
  link: {
    textDecorationLine: 'underline',
    color: colors.primary2,
    fontWeight: 'bold',
    fontStyle: "italic",
  },
  strong: {
    fontFamily: fonts.bold
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0,
  }
}

const markdownStyleOther = {
  body: {
    fontFamily: fonts.regular,
    color: colors.black,
    margin: 0
  },
  link: {
    textDecorationLine: 'underline',
    color: colors.primary2,
    fontWeight: 'bold',
    fontStyle: "italic"

  },
  strong: {
    fontFamily: fonts.bold
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0,
  }
}

const WebviewStyleMine = {
  a: {
    color: colors.primary2,
    textDecorationColor: colors.primary2,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  div: {
    color: colors.white,
    fontFamily: fonts.regular
  },
}

const WebviewStyleOther = {
  a: {
    color: colors.black,
    textDecorationColor: colors.black,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  div: {
    color: colors.black,
    fontFamily: fonts.regular
  },
}
