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

const toastConfig = {
  success: props => <SuccessToast {...props} text2NumberOfLines={2} />,
  error: props => <ErrorToast {...props} text2NumberOfLines={2} />,
};

const App = () => {
  useEffect(() => {
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
