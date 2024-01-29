import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import UserImage from '../../../components/UserImage'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import EmptyView from '../../../components/EmptyView'
import routes from '../../../navigation/routes'
import { INITIATE_WHATSAPP_CHAT, IS_CHAT_EXIST } from '../../../DAL'
import MyLoader, { SimpleLoader } from '../../../components/MyLoader'
import showToast from '../../../functions/showToast'
import { isValidNumber } from 'libphonenumber-js'

const Memberlist = ({ list, loader, navigation, token, refresh, resetCountToZero, headerComponent }) => {
  const [isLoading, setIsLoading] = useState(false)

  const onChatScreen = async (item) => {
    console.log( item.contact_number,isValidNumber("+" + item.contact_number), "isValidNumber")
    if (isValidNumber("+" + item.contact_number)) {
      setIsLoading(true)
      let res = await INITIATE_WHATSAPP_CHAT({ token, navigation, receiver_id: item?._id });
      setIsLoading(false)
      console.log(res, "res")
      if (!res.data.error) {
        let member = res.data?.receiver_info;
        navigation.navigate(routes.whtasappChatMessageList, {
          memberId: member?._id,
          firstName: member?.first_name,
          showTemplate: member?.whatsapp_chat_status != 'accepted',
          lastName: member?.last_name,
          profileImage: !!member?.profile_image ? member?.profile_image : "",
          chatId: res?._id,
          resetCountToZero,
          refresh
        })
      } else {
        showToast({ body: res?.message, title: "Error" })
      }
    } else {
      showToast({ body: "Provided contact number is invalid", title: "Invalid contact number" })
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
          {/* <View style={[__styles.online, { backgroundColor: statusColor }]} /> */}
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
          ListHeaderComponent={headerComponent?.()}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          // contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10, }}
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