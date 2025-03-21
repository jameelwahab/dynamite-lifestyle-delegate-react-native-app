import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import UserImage from '../../../components/UserImage';
import MyText from '../../../components/MyText';
import { convertTimezone } from '../../../functions/convertTime';
import { colors } from '../../../utilities/colors';
import { useSelector } from 'react-redux';
import { selectSocket } from '../../../redux/reducers/socketSlice';

const UserView = ({ member, timezone }) => {
  const { socket } = useSelector(selectSocket);
  const [isOnline, setOnlineStatus] = useState(member?.isOnline);

  useEffect(() => {
    socket.on("member_online", memberOnlineSignal);
    socket.on("member_offline", memberOfflineSignal);
    socket.on("consultant_offline", memberOfflineSignal);
    return () => {
      socket.off("member_online", memberOnlineSignal);
      socket.off("member_offline", memberOfflineSignal);
      socket.off("consultant_offline", memberOfflineSignal);
    }
  }, [])

  const memberOnlineSignal = (data) => {
    
    if (member?.memberId == data?.user_id) {
      setOnlineStatus(true)
    }
  }

  const memberOfflineSignal = (data) => {
    if (member?.memberId == data?.user_id) {
      setOnlineStatus(false)
    }
  }
		console.log("here is the member",member)
  return (
    <View style={__style.userRootView}>
      <View>
        <UserImage
				  borderWidth={2}
				   borderColor={member?.badge_color}
          image={member?.profileImage}
          name={member?.firstName}
          size={35}
        />
        <View style={[__style.status, { backgroundColor: isOnline ? colors.online : colors.primary2 }]} />
      </View>
      <View style={__style.userNameView}>
        <MyText type='medium' fontSize={16} >
          {member?.firstName + " " + member?.lastName}
        </MyText>
        {isOnline == false &&
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
    marginBottom: 5
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
