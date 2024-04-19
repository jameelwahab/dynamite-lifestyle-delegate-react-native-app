import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import StatView from '../../Members/Components/StatView'
import openUrl from '../../../functions/openUrl'
import { icons } from '../../../utilities/icons'

const ZoomCred = ({ list }) => {
  const linkView = (link) => {
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "flex-end" }}
        disabled={!link}
        onPress={() => openUrl(link)}>
        {!!link ?
          <>
            <MyText color={colors.primary} type='medium' >Join </MyText>
            {icons.goto(colors.primary, 18)}
          </> :
          <MyText type='medium' >N/A</MyText>
        }
      </TouchableOpacity>
    )
  }
  const itemView = ({ item, index }) => {
    return (
      <View style={__styles.rootView}>
        <MyText type='medium' >1. </MyText>
        <StatView title={"Url"} view={() => linkView(item.link)} />
        <StatView title={"Password"} value={!!item?.password ? item?.password : "N/A"} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={list}
        renderItem={itemView}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default ZoomCred

const __styles = StyleSheet.create({
  rootView: {
    marginHorizontal: 10, marginTop: 10,
    backgroundColor: colors.secondary, borderRadius: 10,
    padding: 10,
  }
})