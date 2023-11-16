import { View, Text } from 'react-native'
import React from 'react'

const breakReference = (value) => {
  return JSON.parse(JSON.stringify(value))
}

export default breakReference