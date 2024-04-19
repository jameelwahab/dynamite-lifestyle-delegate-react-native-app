import { View, Text, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import MyText from '../../../components/MyText'
import StatView from '../../Members/Components/StatView'
import { colors } from '../../../utilities/colors'
import MemberView from '../../../components/MemberView'
import FooterLoader from '../../../components/FooterLoader'



const MemberList = ({ list, loadmore, footerLoader }) => {
  const itemView = ({ item, index }) => {
    return (
      <View style={__styles.rootView}>
        <MemberView member={item} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={list}
        renderItem={itemView}
        onEndReached={loadmore}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
      />
    </View>
  )
}

export default MemberList

const __styles = StyleSheet.create({
  rootView: {
    marginHorizontal: 10, marginTop: 10,
    backgroundColor: colors.secondary, borderRadius: 10,
    padding: 10
  }
})