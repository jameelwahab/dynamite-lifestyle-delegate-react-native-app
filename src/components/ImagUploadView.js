import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import MyText from './MyText'
import { colors } from '../utilities/colors'
import MyImage from './MyImage'
import { icons, plus } from '../utilities/icons'
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/reducers/userSlice'



const ImagUploadView = ({ alreadyUploaded, selected, label, onPress, viewStyle }) => {

  const { S3_URL } = useSelector(selectUser)

  return (
    <View>
      <MyText isLabel>{label}</MyText>
      <Pressable
        onPress={onPress}
        style={[{ marginBottom: 10, marginTop: 5, width: "100%", height: 150, borderWidth: 1, backgroundColor:colors.darkSecondary, borderRadius: 5, alignItems: "center", justifyContent: "center" }, viewStyle]}>
        {!!selected ?
          <Image
            source={{ uri: selected.uri }}
            style={{ height: 145, aspectRatio: 1 }}
            resizeMode="contain"
          /> : !!alreadyUploaded ?
            <MyImage source={{ uri: S3_URL + alreadyUploaded }}
              style={{ height: 145, aspectRatio: 1 }}
              resizeMode="contain" />
            :
            <>
              {/* <Image source={plus} style={{ marginBottom: 5, tintColor: colors.text, height: 30, width: 30 }} /> */}
              {icons.upload()}
              <MyText fontSize={16} color={colors.text} >Upload Image</MyText>
            </>}
      </Pressable>
    </View>
  )
}

export default ImagUploadView
