import { View, Text } from 'react-native'
import React from 'react'

const prependCurency = (currency) => {

  if (currency == "gbp") {
    return "£"
  } else if (currency == "usd") {
    return "$"
  } else {
    return ""
  }
}

export default prependCurency