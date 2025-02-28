import React, { useState, useEffect } from 'react';
import TrackPlayer, { useProgress, State, usePlaybackState, useActiveTrack } from 'react-native-track-player';
import { Text, View, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
import SliderSimple from '@react-native-community/slider';
import { Slider } from "@rneui/themed"
import { colors } from '../utilities/colors';
import { S3_URL } from '../utilities/constants';
import { icons } from '../utilities/icons';
import { textSize } from '../utilities/styles';
import MyText from '../components/MyText';
import LinearGradient from "react-native-linear-gradient"
import { SimpleLoader } from './MyLoader';




const ic_audio = require("../assets/icons/audio.png")
const ic_forward = require("../assets/icons/forward.png")
const ic_backward = require("../assets/icons/backward.png")


const AudioPlayer = ({ stop = "", url, mission=false, title, desc }) => {
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

  if(mission){
 return (
      <View style={{borderRadius:10, overflow:"hidden"}}>
        <LinearGradient
          style={{ flex: 1, padding: 10 }}
          colors={["#FFE9C4", colors.primary2]}
          // locations={[0,0.6]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 1 }}>
          <View style={{ flex: 1 }}>
            {!!title &&
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <Image source={ic_audio} style={[{ tintColor: colors.black, marginRight: 5, height: 15, resizeMode: "contain" }]} />
                <Text style={[textSize.title, { color: colors.black }]}>{title}</Text>
              </View>}
            {!!desc &&
              <MyText numberOfLines={2} color={"#6f502c"} fontSize={textSize.description2}>{desc}</MyText>
						}
          </View>


          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
            <TouchableOpacity disabled={!isPlaying} onPress={() => TrackPlayer.seekTo(position - 10)}>
              <Image source={ic_backward} style={{ height: 25, resizeMode: "contain" }} />
            </TouchableOpacity>
            <Pressable
              onPress={playPauseFunction}
              disabled={loading}
						  style={{ marginHorizontal: 20, height: 50, width: 50, borderRadius: 25, backgroundColor: colors.black, alignItems: "center", justifyContent: "center" }}>
              {loading ?
								<SimpleLoader />
										: isPlaying ? icons.pause() : icons.play()}
						</Pressable>
            <TouchableOpacity disabled={!isPlaying} onPress={() => TrackPlayer.seekTo(position + 10)}>
              <Image source={ic_forward} style={{ height: 25, resizeMode: "contain" }} />
            </TouchableOpacity>
          </View>

          <View style={{ justifyContent: "flex-end", flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
              <MyText  color={colors.black} >{formatTime(position)}</MyText>
              <MyText color={colors.black} >{formatTime(duration)}</MyText>
            </View>
            <View>
              <Slider
                thumbStyle={{ height: 18, width: 18, backgroundColor: "#9F723F" }}
                value={position}
                maximumTrackTintColor='#C6A26D'
                minimumTrackTintColor='#C6A26D'
                trackStyle={{ height: 7, borderRadius: 20 }}
                animationType='timing'
                minimumValue={0}
                maximumValue={duration}
                onSlidingComplete={val => {
                  TrackPlayer.seekTo(val)
                  TrackPlayer.play()
                  setPlaying(true)
                }}
              />
            </View>
          </View>

        </LinearGradient>

      </View>
    )
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
        <SliderSimple
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
