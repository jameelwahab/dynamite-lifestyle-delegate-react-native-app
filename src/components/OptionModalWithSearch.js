import { View, Text, SafeAreaView, FlatList, Image, TouchableHighlight, StatusBar, StyleSheet, Pressable, TextInput } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../utilities/colors'
import MyText from './MyText'
import utilities from '../utilities'
import MyInputs from './MyInputs'
import { icons } from '../utilities/icons'
import { fonts } from '../utilities/fonts'
import EmptyView from './EmptyView'


const OptionModalWithSearch = ({
  isVisible,
  closeModal,
  onSelected,
  optionList,
  titleKey = undefined,
  renderText,
  noIcon = false,
  title = "",
  onSearchTextChange = () => { },
  filterTheList = undefined
}) => {
  const [searchText, setSearchText] = useState('');
  const onTextChange = (text) => {
    setSearchText(text);
    onSearchTextChange?.(text);
  }

  const closeTheModal = () => {
    closeModal()
    setSearchText("");
    onSearchTextChange?.("");
  }

  const select = (item) => {
    onSelected?.(item);
    setSearchText("");
    onSearchTextChange?.("");
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeTheModal}
      onBackButtonPress={closeTheModal}
      useNativeDriverForBackdrop={true}
      animationInTiming={300}
      animationOutTiming={300}
      style={{ margin: 0 }}>
      <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, marginTop: "auto", borderTopLeftRadius: 10, borderTopRightRadius: 10, flex: 0.8 }} >
        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText }}>
          <View>
            <MyText fontSize={18} type='medium' >{title + " List"}</MyText>
            <MyText color={colors.lightText} fontSize={12}>{`Select your ${title.toLowerCase()} from list below`}</MyText>
          </View>
          <Pressable onPress={closeTheModal}>
            {icons.crosssWithCircle()}
          </Pressable>
        </View>

        <View style={__styles.searchView}>
          <View>
            {icons.search()}
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              value={searchText}
              onChangeText={onTextChange}
              placeholder="Search..."
              placeholderTextColor={colors.lightText}
              spellCheck={false}
              style={{ color: colors.text, paddingVertical: 12, marginLeft: 10, fontFamily: fonts.medium, includeFontPadding: false }}
              selectionColor={colors.selection}
              cursorColor={colors.white}
              keyboardAppearance="dark"
              autoCorrect={false}
              autoCapitalize="none"
              autoComplete="off"
            />
          </View>
          {searchText.length > 0 &&
            <Pressable
              onPress={() => onTextChange("")}
              style={{ padding: 5 }}>
              {icons.crosss()}
            </Pressable>}
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={!!filterTheList ? filterTheList(optionList,searchText) : optionList}
            // scrollEnabled={false}
            keyExtractor={(item, index) => item?.key.toString()}
            contentContainerStyle={{}}
            ListEmptyComponent={<EmptyView label={`No ${title} found`} />}
            renderItem={({ item, index }) => (
              <TouchableHighlight
                onPress={() => select(item)}
                underlayColor={colors.secondary} >
                <View style={{ paddingVertical: 12, flexDirection: "row", alignItems: "center", paddingLeft: 20 }}>
                  {!!item.icon && noIcon == false &&
                    <View style={{ height: 25, width: 25, justifyContent: "center", alignItems: "center" }}>
                      {typeof (item.icon) == "function" ? item.icon() :
                        <Image source={item.icon} style={{ height: 25, width: 25, tintColor: colors.primary }} />}
                    </View>}
                  <View style={{ marginLeft: 10 }}>
                    {!!renderText ?
                      renderText({ item, index }) :
                      <MyText fontSize={16} >{
                        !!titleKey ? item[titleKey]
                          : item.title}</MyText>
                    }
                  </View>
                </View>
              </TouchableHighlight>
            )}
          />
        </View>
      </SafeAreaView>
    </Modal>)
}

export default OptionModalWithSearch

const __styles = StyleSheet.create({
  searchView: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10
  },
})