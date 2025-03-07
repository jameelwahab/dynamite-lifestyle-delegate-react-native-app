import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import UserImage from '../../../components/UserImage'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import EmptyView from '../../../components/EmptyView'
import routes from '../../../navigation/routes'
import { IS_CHAT_EXIST } from '../../../DAL'
import MyLoader, { SimpleLoader } from '../../../components/MyLoader'

const Memberlist = ({ list, loader, statusColor, navigation, token, refresh, resetCountToZero }) => {
  const [isLoading, setIsLoading] = useState(false)

  const onChatScreen = async (item) => {
    setIsLoading(true)
    let res = await IS_CHAT_EXIST({ token, navigation, memberId: item?._id });
    setIsLoading(false)
    if (res.code == 200) {
      if (res.is_chat_exist) {
        navigation.navigate(routes.broadcastChatMessageList, {
          isOnline: item?.is_online,
          memberId: item?._id,
          firstName: item?.first_name,
          lastName: item?.last_name,
          lastSeen: "",
          profileImage: !!item?.profile_image ? item?.profile_image : "",
          chatId: res?.chat?._id,
          resetCountToZero,
          refresh
        })
      } else {
        navigation.navigate(routes.broadcastChatMessageList, {
          isOnline: item?.is_online,
          memberId: item?._id,
          firstName: item?.first_name,
          lastName: item?.last_name,
          lastSeen: "",
          profileImage: !!item?.profile_image ? item?.profile_image : "",
          chatId: "",
          resetCountToZero,
          refresh
        })
      }
    }
  }

  const rednerMemberView = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onChatScreen(item)}
        style={__styles.itemRoot}>
        <View>
          <UserImage
            image={item?.profile_image}
            name={item?.first_name}
            size={30}
          />
          <View style={[__styles.online, { backgroundColor: statusColor }]} />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <MyText type='medium' numberOflines={1} fontSize={14}>{item?.first_name + " " + item?.last_name}</MyText>
        </View>
      </TouchableOpacity>
    )

  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10, }}
          data={list}
          renderItem={rednerMemberView}
          ListEmptyComponent={!loader && <EmptyView label={"No Members"} />}
        />
      </View>
      <MyLoader enable={isLoading} />
    </View>
  )
}

export default Memberlist;

const __styles = StyleSheet.create({
  itemRoot: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    paddingHorizontal: 10,
    backgroundColor: colors.secondaryVariant,
    borderRadius: 10,
    marginTop: 10
  },
  online: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: colors.white,
    position: "absolute",
    right: -5,
    bottom: 0
  },


})
