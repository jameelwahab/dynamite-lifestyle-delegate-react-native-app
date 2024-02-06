import { View, Text, SafeAreaView, FlatList, Image, TouchableHighlight, StatusBar, Pressable } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import { colors } from '../utilities/colors'
import MyText from './MyText'
import utilities from '../utilities'
import { icons } from '../utilities/icons'


const OptionModal = ({
  isVisible,
  closeModal,
  onSelected,
  optionList,
  titleKey = undefined,
  renderText,
  noIcon = false,
  multiple = false,
  checkSelected
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationInTiming={300}
      animationOutTiming={300}
      style={{ margin: 0 }}>
      <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, marginTop: "auto", borderTopLeftRadius: 10, borderTopRightRadius: 10, maxHeight: 500 }} >
        {multiple &&
          <View style={{ flexDirection: "row", paddingTop: 15, paddingHorizontal: 15 }}>
            <View style={{ flex: 1 }} >
              <MyText color={colors.primary} fontSize={16} type='medium' >Select level</MyText>
            </View>
            <Pressable
              onPress={closeModal}
              style={{ alignSelf: "flex-end", }}>
              {icons.crosss(colors.primary)}
            </Pressable>
          </View>
        }
        <FlatList
          data={optionList}
          keyExtractor={(item, index) => item?.key}
          // scrollEnabled={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item, index }) => {
            let isChecked = multiple && checkSelected?.(item);
            return (
              <TouchableHighlight
                style={multiple ? { marginTop: 5 } : undefined}
                onPress={() => onSelected?.(item)}
                underlayColor={colors.secondary} >
                <View style={{
                  paddingVertical: 12, flexDirection: "row", alignItems: "center", paddingLeft: 20, backgroundColor: 'red',
                  backgroundColor: isChecked ? colors.secondarySelect : colors.transparent,

                }}>
                  {!!item.icon && noIcon == false &&
                    <View style={{ height: 25, width: 25, justifyContent: "center", alignItems: "center" }}>
                      {typeof (item.icon) == "function" ? item.icon() :
                        <Image source={item.icon} style={{ height: 25, width: 25, tintColor: colors.primary }} />}
                    </View>}
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    {!!renderText ?
                      renderText({ item, index }) :
                      <MyText fontSize={16} >{
                        !!titleKey ? item[titleKey]
                          : item.title}</MyText>
                    }
                  </View>
                  {isChecked &&
                    <View style={{ paddingRight: 15 }}>
                      {icons.crosssWithCircle(colors.white, 20)}
                    </View>
                  }
                </View>
              </TouchableHighlight>
            )
          }}
        />
      </SafeAreaView>
    </Modal>)
}

export default OptionModal