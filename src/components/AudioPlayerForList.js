import React, { useState, useEffect } from 'react';
import TrackPlayer, { RepeatMode, useProgress, State, usePlaybackState, useActiveTrack, } from 'react-native-track-player';
import { Text, View, StyleSheet, TouchableOpacity, Image, Pressable, } from 'react-native';
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '../utilities/colors';
import { S3_URL } from '../utilities/constants';
import { icons } from '../utilities/icons';
import { SimpleLoader } from './MyLoader';




let ended = false;

const AudioPlayerForList = ({ stop = "", url, id, loop = false, onLoopComplete, noS3Url = false }) => {
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState("")
  const progress = useProgress();
  const [isPlaying, setPlaying] = useState(false);
  const active = useActiveTrack();
  const isCurrent = !!active ? active?.id == id : false;
  const [repeatMode, setRepeatMode] = useState(loop);


  useEffect(() => {
    if (!!stop) {
      pausePlayer()
    }
  }, [stop])


  useEffect(() => {

    if (active?.id == id) {
      let duration = parseInt(progress.duration);
      let position = progress.position;
      setDuration(duration);
      setPosition(position);
    }
  }, [progress]);


  const load = async () => {
    try {


      setLoading(id);
      let uri = !!url.uri ? url.uri : noS3Url ? url : S3_URL + url;
      console.log(uri, "uri")
      await TrackPlayer.add({
        id: id,
        url: uri,
        // title: "",
        // artist: "",
        // album: '',
        // genre: '',
        // artwork: "",
      });
      TrackPlayer.play();
      ended = false;
    } catch (error) {
      console.log(error, "trackplayer error")
      TrackPlayer.reset();
      TrackPlayer.stop()
      setTimeout(() => {
        setPlaying(false)
        setLoading("")
      }, 2000);
    }
  }


  const repeat = async () => {

    let track = await TrackPlayer.getActiveTrack();
    setLoading(track.id);
    onLoopComplete?.(track.id);
    await TrackPlayer.reset()
    await TrackPlayer.add(track);
    setPosition(0);
    await TrackPlayer.play();
    ended = false

  }


  const { state: playerState } = usePlaybackState();
  console.log(playerState, "playerState")
  if (playerState === "ready" && loading != "") {
    setLoading("")
  }
  if (playerState == "paused" && isPlaying == true) {
    setPlaying(false)
  } else if (playerState == "playing" && isPlaying == false) {
    setPlaying(true)
  } else if (playerState == "ended") {
    console.log(repeatMode, "repeatMode")
    if (repeatMode && active.id == id && progress != 0 && ended == false) {
      ended = true;
      repeat()
    }
  }
  //  else if (playerState == "stopped" && loading != "") {
  //   setLoading("")
  //   setPlaying(false)
  //   TrackPlayer.reset()
  // }


  // useEffect(() => {
  //   if (loop) {
  //     TrackPlayer.setRepeatMode(RepeatMode.Track)
  //     TrackPlayer.getRepeatMode().then((mode) => {
  //       setRepeatMode(mode);
  //     })
  //   } else {
  //     TrackPlayer.setRepeatMode(RepeatMode.Off)
  //   }
  // }, [loop])


  const onRepeatPress = () => {
    setRepeatMode((val) => !val)
    // TrackPlayer.getRepeatMode().then((mode) => {
    //   if (mode == RepeatMode.Off) {
    //     TrackPlayer.setRepeatMode(RepeatMode.Track);
    //     setRepeatMode(RepeatMode.Track)
    //   }else{
    //     TrackPlayer.setRepeatMode(RepeatMode.Off);
    //     setRepeatMode(RepeatMode.Off)
    //   }
    // })
  }

  useEffect(() => {
    ended = false;
    TrackPlayer.setRepeatMode(RepeatMode.Off)

    return () => {
      TrackPlayer.reset();
    }


  }, [url])





  const formatTime = timeInSec => {
    return moment(timeInSec * 1000).format('mm:ss');
  };

  const playPauseFunction = async () => {
    const status = await TrackPlayer.getState();
    if (!!!active) {

      load()
    } else if (!!active) {
      if (active.id == id) {
        if (status == State.Playing) {
          TrackPlayer.pause()
          setPlaying(false)
        } else {
          TrackPlayer.play()
          setPlaying(true)
        }
      } else {
        await TrackPlayer.reset()
        load()
      }
    }
  }




  const pausePlayer = () => {
    TrackPlayer.pause()
    setPlaying(false)
  }

  return (
    <View style={{ backgroundColor: colors.secondaryVariant, paddingVertical: 3, borderRadius: 40, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, }} >
      <TouchableOpacity onPress={playPauseFunction}
        disabled={!!loading}
        style={{ height: 50, width: 50, alignItems: "center", justifyContent: "center", }} >
        {loading == id ?
          <SimpleLoader />
          : !isCurrent ? icons.play() :
            isPlaying ? icons.pause() : icons.play()}
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.position}>{formatTime(position)}</Text>
        <Slider
          style={styles.slider}
          value={position}

          thumbTintColor="silver"
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor="gray"
          minimumValue={0}
          thumbStyle={{
            backgroundColor: colors.primary,
            width: 15,
            height: 15,
            shadowOpacity: 0.9,
            elevation: 1,
            shadowOffset: {
              width: 0,
              height: 0,
            },
          }}
          animationType='timing'
          maximumValue={!isCurrent ? 0 : duration}

          onSlidingComplete={val => {
            TrackPlayer.seekTo(val)
            TrackPlayer.play()
            setPlaying(true)
          }}
        />

        <Text style={styles.duration}>{formatTime(duration)}</Text>
        {loop &&
          <TouchableOpacity
            onPress={onRepeatPress}
            style={styles.repeatBtn} >
            {repeatMode ? icons.repeat(colors.primary, 20) : icons.noRepeat(colors.primary, 20)}
          </TouchableOpacity>}
      </View>
    </View>
  );
};


export default AudioPlayerForList;

const styles = StyleSheet.create({
  repeatBtn: {
    padding: 5,
    marginRight: -10
  },
  container: {

    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    flex: 1,
    // width: "85%",
    // paddingRight: 28,
    // paddingLeft: 28
  },
  position: {

    color: 'gray',
    fontSize: 12,



  },
  duration: {

    color: 'gray',
    fontSize: 12,


  },
  timeContainer: {
    alignItems: 'center',
    color: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,

  },
  slider: {
    marginLeft: 5,
    marginRight: 5,
    // width: "75%",
    flex: 1,

  }
});