/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import notifee from '@notifee/react-native';



messaging().setBackgroundMessageHandler(async remoteMessage => {
  notifee.incrementBadgeCount();
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./service'));