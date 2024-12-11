import React, { useState, useEffect } from 'react';
import TrackPlayer, { useProgress, State, usePlaybackState, useActiveTrack } from 'react-native-track-player';
import { Text, View, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '../utilities/colors';
import { S3_URL } from '../utilities/constants';
import { icons } from '../utilities/icons';
import { SimpleLoader } from './MyLoader';






const AudioPlayer = ({ stop = "", url,  }) => {
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(false)
  const progress = useProgress();
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    if (!!stop) {
      pausePlayer()
    }
  }, [stop])


  useEffect(() => {

      let duration = parseInt(progress.duration);
      let position = progress.position;
      setDuration(duration);
      setPosition(position);
    
  }, [progress]);

  const { state: playerState } = usePlaybackState();
  
  if (playerState === "ready" && loading == true) {
    setLoading(false)
  }
  if (playerState == "paused" && isPlaying == true) {
    setPlaying(false)
  } else if (playerState == "playing" && isPlaying == false) {
    setPlaying(true)
  }


  useEffect(() => {

    if (!!url) {
      setLoading(true)
      setTimeout(() => {
        load()
      }, 500);
    }


    return () => {
      console.log("playerState dead")
      TrackPlayer.reset();
    }


  }, [url])

  const load = async () => {
    await TrackPlayer.add({
      id: "1",
      url: !!url.uri ? url.uri : S3_URL + url,
      // title: "",
      // artist: "",
      // album: '',
      // genre: '',
      // artwork: "",
    });

  }

  const formatTime = timeInSec => {
    return moment(timeInSec * 1000).format('mm:ss');
  };

  const playPauseFunction = async () => {
    const status = await TrackPlayer.getState();
    console.log(status, "track player")
    if (status == State.Playing) {
      TrackPlayer.pause()
      setPlaying(false)
    } else {
      TrackPlayer.play()
      setPlaying(true)
    }
  }

  const pausePlayer = () => {
    TrackPlayer.pause()
    setPlaying(false)
  }


  return (
    <View style={{ backgroundColor: colors.secondaryVariant, paddingVertical: 3, borderRadius: 40, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, }} >
      <TouchableOpacity onPress={playPauseFunction}
        disabled={loading}
        style={{ height: 50, width: 50, alignItems: "center", justifyContent: "center", }} >
        {loading ?
          <SimpleLoader />
          : isPlaying ? icons.pause() : icons.play()}
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
            width: 15, height: 15, shadowOpacity: 0.9,
            elevation: 1,
            shadowOffset: {
              width: 0,
              height: 0,
            },
          }}
          animationType='timing'
          maximumValue={duration}

          onSlidingComplete={val => {
            TrackPlayer.seekTo(val)
            TrackPlayer.play()
            setPlaying(true)
          }}
        />

        <Text style={styles.duration}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};


export default AudioPlayer;

const styles = StyleSheet.create({
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
    width: "75%",

  }
});