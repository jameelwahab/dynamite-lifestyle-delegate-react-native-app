import TrackPlayer, { Event } from 'react-native-track-player';

module.exports = async function() {

  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    console.log("remote play")
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    console.log("remote pause")
    await TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    await TrackPlayer.stop();
    await TrackPlayer.destroy();
  });

    TrackPlayer.addEventListener(Event.RemoteJumpForward, async (interval) => {
    await TrackPlayer.seekTo(await TrackPlayer.getPosition()+5);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward,async (interval) => {
    await TrackPlayer.seekTo(await TrackPlayer.getPosition()-5);
  });
  
};

