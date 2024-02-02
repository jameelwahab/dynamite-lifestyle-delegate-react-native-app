import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import MyInputs from './MyInputs'
import { icons } from '../utilities/icons'
import { colors } from '../utilities/colors'

const SearchView = ({ search="", onChangeText, onSearchPress }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ flex: 1, marginTop: -15 }}>
        <MyInputs
          rightIcon={search.length > 0 ? icons.crosssWithCircle_20 : icons.noIcon}
          value={search}
          placeholder='Search...'
          onChangeText={onChangeText}
          rightIconOnPress={() => onChangeText("")}
          noSpace
          isSearch={true}
          onSubmitEditing={onSearchPress}
        />
      </View>
      <View style={{ marginLeft: 5 }}>
        <TouchableOpacity
          onPress={onSearchPress}
          style={{ borderWidth: 1, borderColor: colors.primary, flex: 1, marginTop: 5, paddingHorizontal: 10, borderRadius: 5, justifyContent: "center" }} >
          {icons.search(colors.primary, 20)}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SearchView