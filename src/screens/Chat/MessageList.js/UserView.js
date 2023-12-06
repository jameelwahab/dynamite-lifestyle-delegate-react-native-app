import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import UserImage from '../../../components/UserImage';
import MyText from '../../../components/MyText';
import { convertTimezone } from '../../../functions/convertTime';
import { colors } from '../../../utilities/colors';

const UserView = ({ member, timezone }) => {
  return (
    <View style={__style.userRootView}>
      <View>
        <UserImage
          image={member?.profileImage}
          name={member?.firstName}
          size={35}
        />
        <View style={[__style.status, { backgroundColor: member?.isOnline ? colors.online : colors.primary2 }]} />
      </View>
      <View style={__style.userNameView}>
        <MyText type='medium' fontSize={16} >
          {member?.firstName + " " + member?.lastName}
        </MyText>
        {member?.isOnline == false &&
          <View style={__style.lastSeenView}>
            <MyText fontSize={10} >{convertTimezone(member?.lastSeen, timezone).format("[Last seen] DD MMM YYYY, hh:mm A")}</MyText>
          </View>
        }
      </View>
    </View>
  )
}

export default UserView;

const __style = StyleSheet.create({
  userRootView: {
    flexDirection: "row",
    alignItems: "center",
  },
  userNameView: {
    flex: 1,
    marginLeft: 10
  },
  lastSeenView: {
    marginTop: 2
  },
  status: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    position: "absolute",
    right: -5,
    bottom: 0
  },

})