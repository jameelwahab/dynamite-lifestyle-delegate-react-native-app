import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../../utilities/colors'
import { icons } from '../../../utilities/icons'
import { ProgressBar } from 'react-native-paper';
import moment from 'moment';
import MyText from '../../../components/MyText';
import utilities from '../../../utilities';
import TrackPlayer, { useProgress, usePlaybackState } from 'react-native-track-player';
import { SimpleLoader } from '../../../components/MyLoader';

const AudioChatView = ({ url, onPress, totalDuration, currentPlaying, currentTrack, thisTrack, stopPlayer, isMine }) => {
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const progress = useProgress();
  const { state: playState } = usePlaybackState();

  const getTrack = async () => {
    console.log(await TrackPlayer.getActiveTrack(), "state")
  }
  useEffect(() => {
    getTrack()
    if (currentPlaying == thisTrack && progress.duration != 0) {
      setDuration(progress.duration);
      setPosition(progress.position + 0.5);
    }
  }, [progress]);

  useEffect(() => {
    if (currentPlaying == thisTrack) {
      if (playState == "buffering" || playState == "connecting") {
      } else if (playState == "paused") {
        if (Math.round(position) >= Math.round(totalDuration)) {
          setPosition(duration);
          stopPlayer();
        } else {
        }
      }
      // else if (playState == "stopped" && Platform.OS == "android") {
      //   stopPlayer();
      // }
      else if (playState == "ended") {
        setPosition(position)
        stopPlayer();
      }
    }
    else if (url != currentTrack) {
      if (position != 0)
        setPosition(0)
    }
  }, [playState]);

  const isLoading = () => {
    if (currentPlaying == thisTrack && playState != "stopped" && playState != "paused" && playState != "playing") {
      return true
    }
    return false
  }
  // "#836e46"

  return (
    <View style={{}}>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        height: 45,
        width: utilities.windowWidth() * 0.7,
        // backgroundColor: isMine ? colors.lightText2 : "#69a4d3",
        borderRadius: 25,
        paddingHorizontal: 5,
        // marginBottom: 5
      }} >
        <TouchableOpacity
          onPress={onPress}
          disabled={isLoading()}
          style={{
            height: 35, width: 35,
            // backgroundColor: isMine?"": "#69a4d3",
            borderRadius: 35 / 2, alignItems: "center", justifyContent: "center"
          }} >
          {isLoading() ? <ActivityIndicator color={isMine ? colors.white : colors.secondary} /> :
            thisTrack == currentPlaying ?
              icons.pause(isMine ? colors.white : colors.secondary, 18) :
              icons.play(isMine ? colors.white : colors.secondary, 18)
          }
        </TouchableOpacity>
        <View style={{ flex: 1, paddingHorizontal: 10, height: "100%", justifyContent: "flex-end", marginBottom: 10 }}>
          <ProgressBar
            progress={duration != 0 ? position / duration : 0}
            color={isMine ? colors.primary : colors.secondarySelect}
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
            <MyText color={isMine ? colors.white : colors.secondary} style={{ fontSize: 10 }} >{moment.utc((position * 1000)).format("mm:ss")}</MyText>
            <MyText color={isMine ? colors.white : colors.secondary} style={{ fontSize: 10 }}>{moment.utc(totalDuration).format("mm:ss")}</MyText>
          </View>
        </View>
      </View>
    </View>
  )
}

export default AudioChatView