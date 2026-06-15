import {View, TouchableOpacity, ActivityIndicator, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../../utilities/colors';
import {icons} from '../../../utilities/icons';
import {ProgressBar} from 'react-native-paper';
import moment from 'moment';
import MyText from '../../../components/MyText';
import utilities from '../../../utilities';
import {useProgress, usePlaybackState} from 'react-native-track-player';

const AudioChatView = ({
  url,
  onPress,
  totalDuration,
  currentPlaying,
  currentTrack,
  thisTrack,
  stopPlayer,
  isMine,
}) => {
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const progress = useProgress();
  const {state: playState} = usePlaybackState();

  const getTrack = async () => {};
  useEffect(() => {
    getTrack();
    if (currentPlaying == thisTrack && progress.duration != 0) {
      setDuration(progress.duration);
      setPosition(progress.position + 0.5);
    }
  }, [progress]);

  useEffect(() => {
    if (currentPlaying == thisTrack) {
      if (playState == 'buffering' || playState == 'connecting') {
      } else if (playState == 'paused') {
        if (Math.round(position) >= Math.round(totalDuration)) {
          setPosition(duration);
          stopPlayer();
        } else {
        }
      }
      // else if (playState == "stopped" && Platform.OS == "android") {
      //   stopPlayer();
      // }
      else if (playState == 'ended') {
        setPosition(position);
        stopPlayer();
      }
    } else if (url != currentTrack) {
      if (position != 0) setPosition(0);
    }
  }, [playState]);

  const isLoading = () => {
    if (
      currentPlaying == thisTrack &&
      playState != 'stopped' &&
      playState != 'paused' &&
      playState != 'playing'
    ) {
      return true;
    }
    return false;
  };
  // "#836e46"

  return (
    <View style={__style.container}>
      <View
        style={__style.audioContainer}>
        <TouchableOpacity
          onPress={onPress}
          disabled={isLoading()}
          style={__style.playButton}>
          {isLoading() ? (
            <ActivityIndicator
              color={isMine ? colors.white : colors.secondary}
            />
          ) : thisTrack == currentPlaying ? (
            icons.pause(isMine ? colors.white : colors.secondary, 18)
          ) : (
            icons.play(isMine ? colors.white : colors.secondary, 18)
          )}
        </TouchableOpacity>
        <View
          style={__style.progressContainer}>
          <ProgressBar
            progress={duration != 0 ? position / duration : 0}
            color={isMine ? colors.primary : colors.secondarySelect}
          />
          <View
            style={__style.timeRow}>
            <MyText
              color={isMine ? colors.white : colors.secondary}
              style={__style.timeText}>
              {moment.utc(position * 1000).format('mm:ss')}
            </MyText>
            <MyText
              color={isMine ? colors.white : colors.secondary}
              style={__style.timeText}>
              {moment.utc(totalDuration).format('mm:ss')}
            </MyText>
          </View>
        </View>
      </View>
    </View>
  );
};

const __style = StyleSheet.create({
  container: {},
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    width: utilities.windowWidth() * 0.7,
    borderRadius: 25,
    paddingHorizontal: 5,
  },
  playButton: {
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flex: 1,
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  timeText: {
    fontSize: 10,
  },
});

export default AudioChatView;
