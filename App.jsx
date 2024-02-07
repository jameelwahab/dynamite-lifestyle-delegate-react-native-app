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
import notifee, { AndroidImportance } from '@notifee/react-native';


const toastConfig = {
  success: props => <SuccessToast {...props} text2NumberOfLines={2} />,
  error: props => <ErrorToast {...props} text2NumberOfLines={2} />,
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
      importance: AndroidImportance.HIGH
    });
  };
  
  useEffect(() => {
    createChannel();
    setupPlayer();
    LogBox.ignoreLogs([
      `You seem to update the renderers prop(s) of the "RenderHTML" component in short periods of time`,
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
