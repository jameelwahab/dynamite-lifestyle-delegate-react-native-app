import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import MyText from '../../../components/MyText'
import StatView from '../../Members/Components/StatView'
import { colors } from '../../../utilities/colors'
import MemberView from '../../../components/MemberView'
import FooterLoader from '../../../components/FooterLoader'
import EmptyView from '../../../components/EmptyView'
import MyCheckBox from '../../../components/MyCheckBox'



const MemberList = ({ list, loadmore, footerLoader, loader, isCheckBox = false,
  onCheckBoxPress = () => { },
  checkedList = {}
}) => {



  const itemView = ({ item, index }) => {
    return (
      <View style={__styles.rootView}>
        {isCheckBox &&
          <View style={{ marginHorizontal: 5, marginRight: 10 }}>
            <MyCheckBox
              pb={0}
              value={!!checkedList[item?._id]}
              onPress={() => onCheckBoxPress(item)}
            />
          </View>}
        <View style={{ flex: 1 }}>
          <MemberView member={item} />
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={list}
        extraData={checkedList}
        renderItem={itemView}
        onEndReached={loadmore}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
        // ListEmptyComponent={!loader && <EmptyView />}
      />
    </View>
  )
}

export default MemberList

const __styles = StyleSheet.create({
  rootView: {
    marginHorizontal: 10, marginTop: 10,
    backgroundColor: colors.secondary, borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center"
  }
})