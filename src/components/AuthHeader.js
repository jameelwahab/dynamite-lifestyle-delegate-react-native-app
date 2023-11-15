import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import { colors } from '../utilities/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const AuthHeader = () => {
  const navigation = useNavigation()
  return (
      <View style={{ height: 50, }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ height: 35, width: 35, backgroundColor: colors.lightPrimary3, borderRadius: 50 / 2, alignItems: "center", justifyContent: "center" }} >
          <Ionicons name="arrow-back-outline" color={colors.primary} size={20} />
        </TouchableOpacity>
      </View>
  )
}

export default AuthHeader