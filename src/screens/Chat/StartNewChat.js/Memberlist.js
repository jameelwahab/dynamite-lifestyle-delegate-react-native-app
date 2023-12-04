import { View, Text, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import UserImage from '../../../components/UserImage'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import EmptyView from '../../../components/EmptyView'

const Memberlist = ({ list, loader, statusColor }) => {

  const rednerMemberView = ({ item }) => {
    return (
      <View style={__styles.itemRoot}>
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
      </View>
    )

  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ marginTop: 10, marginHorizontal: 10 }}
        data={list}
        renderItem={rednerMemberView}
        ListEmptyComponent={!loader && <EmptyView label={"No Members"} />}
      />
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