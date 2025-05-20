import { View, Text, Image } from 'react-native'
import React from 'react'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'



const StatView = ({ title, value, view = null, uppercase = false, icon_img, noFontTransform = false }) => {

  const { S3_URL } = useSelector(selectUser)

  return (
    <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText, paddingBottom: 10, marginTop: 10, }}>
      <View style={{ flex: 0.7 }}>
        <MyText fontSize={12} color={colors.lightText2}>{title}</MyText>
      </View>
      <View style={{ flex: 1 }}>
        {!!view ? view() :
          <View style={{ flexDirection: 'row', alignItems: "center" }}>
            {icon_img &&
              <>
                <Image source={{ uri: S3_URL + icon_img }} style={{ width: 15, height: 15 }} />
                <View style={{ width: 5 }} />
              </>
            }
            <MyText style={{ textTransform: noFontTransform ? "none" : uppercase ? "uppercase" : "capitalize" }} fontSize={12} type='medium' >{value}</MyText>
          </View>
        }
      </View>
    </View>
  )
}

export default StatView
