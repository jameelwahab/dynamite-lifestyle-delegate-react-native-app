import { View, Text } from 'react-native'
import React from 'react'
import { SimpleLoader } from './MyLoader'

const FooterLoader = ({isVisible}) => {
  return (
    <View style={{height:50,alignItems:"center",justifyContent:"center"}}>
     {isVisible && <SimpleLoader/>}
    </View>
  )
}

export default FooterLoader