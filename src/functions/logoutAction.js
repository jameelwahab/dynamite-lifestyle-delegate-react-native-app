import { View, Text } from 'react-native'
import React from 'react'
import { LOGOUT } from '../DAL'
import AsyncStorage from '@react-native-async-storage/async-storage';

import routes from '../navigation/Routes';

const logoutAction = async (token = "", navigation) => {
  console.log(token,'hi')
  if (!!token) {
    let res = await LOGOUT(token, navigation);
    await AsyncStorage.multiRemove(["token"])
    navigation.reset({
      index: 0,
      routes: [{
        name: routes.welcome
      }]
    })
  }
}

export default logoutAction