import { View, Text } from 'react-native'
import React from 'react'
import MyText from './MyText'
import UserImage from './UserImage'
import { colors } from '../utilities/colors'

const MemberView = ({ member, showPhoneNumber = false, marginLeft = 5, size = 30,titleSize=12 }) => {
  return (
    <View style={{ marginLeft, height: 35, flexDirection: "row", alignItems: "center", }}>
      <UserImage image={member?.profile_image} name={member?.first_name} size={size} />
      <View style={{ marginLeft: 10 }}>
        <MyText type='bold' fontSize={titleSize} >{`${member?.first_name} ${member?.last_name}`}</MyText>
        <MyText type='medium' color={colors.lightText2} fontSize={10} >{`${member?.email}`}</MyText>
        {showPhoneNumber && !!member?.contact_number &&
          <MyText type='medium' color={colors.lightText2} fontSize={10} >{member?.contact_number}</MyText>}
      </View>
    </View>
  )
}

export default MemberView