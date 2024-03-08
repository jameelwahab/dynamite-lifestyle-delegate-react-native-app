import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import ResponsiveImage2 from '../../../components/ResponsiveImage2'
import { S3_URL } from '../../../utilities/constants'
import utilities from '../../../utilities'
import MyImage from '../../../components/MyImage'
import { colors } from '../../../utilities/colors'

const HeaderBanner = ({ image, user ,}) => {
  return (
    <View style={{ margin: 10,minHeight:100 }}>
      <View style={__styles.imageView}>
        <ResponsiveImage2
          uri={S3_URL + image}
          width={utilities.screenWidth()}
          
        />
      </View>
      <View style={__styles.profileView}>
        <MyImage
          style={__styles.profileImageView}
          source={{ uri: S3_URL + user?.image?.thumbnail_1 }}
        />
      </View>
    </View>

  )
}

export default HeaderBanner;


const __styles = StyleSheet.create({
  imageView: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: "auto",
  },
  profileView: {
    height: 100,
    width: 100,
    borderWidth: 5,
    borderColor: colors.primary2,
    borderColor: colors.primary2,backgroundColor:colors.secondary,
    borderRadius: 10,
    position: "absolute",
    zIndex: 2,
    bottom: 0,
    left:10,
    bottom:-10
  },
  profileImageView: {
    height: '100%',
    width: "100%",
  }
})