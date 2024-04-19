import { View, Text, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import MyText from '../../../components/MyText'
import StatView from '../../Members/Components/StatView'
import { colors } from '../../../utilities/colors'

const GrpList = ({ list }) => {
  const itemView = ({ item, index }) => {
    return (
      <View style={__styles.rootView}>
        <MyText type='medium' >{index + 1}. </MyText>
        <StatView title={"Name"} value={item?.title} />
        <StatView title={"Member"} value={item?.member.length} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={list}
        renderItem={itemView}
      />
    </View>
  )
}

export default GrpList

const __styles = StyleSheet.create({
  rootView: {
    marginHorizontal: 10, marginTop: 10,
    backgroundColor: colors.secondary, borderRadius: 10,
    padding: 10
  }
})