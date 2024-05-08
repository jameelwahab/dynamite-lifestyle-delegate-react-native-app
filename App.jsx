import {View, Text, LogBox} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './src/navigation/AppStack';
import {colors} from './src/utilities/colors';
import Toast, {
  BaseToast,
  ErrorToast,
  SuccessToast,
} from 'react-native-toast-message';
import {Provider} from 'react-redux';
import {store} from './src/redux';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';
import notifee, {AndroidImportance} from '@notifee/react-native';
import { fonts } from './src/utilities/fonts';

const toastConfig = {
  success: props => (
    <SuccessToast {...props} text1NumberOfLines={2} text2NumberOfLines={2} />
  ),
  error: props => (
    <ErrorToast {...props} text1NumberOfLines={2} text2NumberOfLines={2} />
  ),
  custom: props => (
    <SuccessToast
      {...props}
      text1NumberOfLines={2}
      text2NumberOfLines={2}
      style={{backgroundColor: props.props.bgColor, borderLeftWidth: 0}}
      text1Style={{color: colors.white,fontFamily:fonts.bold,fontSize:16}}
      text2Style={{color: colors.white,fontFamily:fonts.bold}}
    />
  ),
};

const App = () => {
  const setupPlayer = () => {
    TrackPlayer.setupPlayer({waitForBuffer: true}).then(() => {
      TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        stopWithApp: true,
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SeekTo,
        ],
        capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
    });
  };
  const createChannel = async () => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  };

  useEffect(() => {
    createChannel();
    setupPlayer();
    LogBox.ignoreLogs([
      `You seem to update the renderers prop(s) of the "RenderHTML" component in short periods of time`,
      'Non-serializable values were found in the navigation state',
      'The player has already been initialized via setupPlayer.',
    ]);
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: colors.darkSecondary}}>
      <Provider store={store}>
        <NavigationContainer>
          <AppStack />
          <Toast config={toastConfig} />
        </NavigationContainer>
      </Provider>
    </View>
  );
};

export default App;
