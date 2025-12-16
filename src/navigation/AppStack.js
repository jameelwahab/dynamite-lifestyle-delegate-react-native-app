import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import routes from './routes';
import Login from '../screens/Auth/Login';
import ResetPassword from '../screens/Auth/ResetPassword';
import OPTscreen from '../screens/Auth/OPT';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import SideDrawer from './SideBar/SideDrawer';
import Splash from '../screens/Auth/Splash';
import VerifyAccount from '../screens/Profile/VerifyAccount.js';

const Stack = createNativeStackNavigator();
const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={routes.splash}
      screenOptions={{headerShown: false}}>
      {/* Auth */}
      <Stack.Screen name={routes.login} component={Login} />
      <Stack.Screen name={routes.resetPassword} component={ResetPassword} />
      <Stack.Screen name={routes.optScreen} component={OPTscreen} />
      <Stack.Screen name={routes.forgotPassword} component={ForgotPassword} />

      <Stack.Screen name={routes.splash} component={Splash} />

      {/* Drawer */}
      <Stack.Screen name={routes.mainScreen} component={SideDrawer} />
      <Stack.Screen name={routes.verifyAccount} component={VerifyAccount} />

      {/* <Stack.Screen name={routes.supportTicketDeatail} component={TicketDetail} /> */}
    </Stack.Navigator>
  );
};

export default AppStack;
