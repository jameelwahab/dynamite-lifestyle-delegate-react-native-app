import { View, Text, SafeAreaView, FlatList, Image, TouchableHighlight, StatusBar, Pressable } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../utilities/colors'
import MyText from './MyText'
import utilities from '../utilities'
import { icons } from '../utilities/icons'
import Collapsible from 'react-native-collapsible'
import breakReference from '../functions/breakReference'


const OptionModal2 = forwardRef(({
  onSelected,
  optionList,
  filterTheList = null,
  titleKey = undefined,
  renderText,
  noIcon = false,
  multiple = false,
  checkSelected,
  multipleLabel = ""
}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const closeModal = () => {
    setSelectedItem(null)
    setIsVisible(false)
  }

  const openModal = (item = null) => {
    setSelectedItem(item)
    setIsVisible(true)
  }


  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])

  return (

    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationInTiming={300}
      animationOutTiming={300}
      hideModalContentWhileAnimating={true}
      style={{ margin: 0 }}>
      <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, marginTop: "auto", borderTopLeftRadius: 10, borderTopRightRadius: 10, maxHeight: 500 }} >
        {multiple &&
          <View style={{ flexDirection: "row", paddingTop: 15, paddingHorizontal: 15 }}>
            <View style={{ flex: 1 }} >
              <MyText color={colors.primary} fontSize={16} type='medium' >{!!multipleLabel ? multipleLabel : "Select Level"}</MyText>
            </View>
            <Pressable
              onPress={closeModal}
              style={{ alignSelf: "flex-end", }}>
              {icons.crosss(colors.primary)}
            </Pressable>
          </View>
        }
        <FlatList
          data={typeof filterTheList == "function" ? filterTheList?.(selectedItem) : optionList}
          // keyExtractor={(item, index) => item?.key}
          // scrollEnabled={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item, index }) =>
            <RenderList
              item={item}
              index={index}
              titleKey={titleKey}
              onSelected={(option) => {
                let item = breakReference(selectedItem);
                closeModal?.();
                setTimeout(() => {
                  onSelected(option, item)
                }, 400);
              }}
              renderText={renderText}
              noIcon={noIcon}
              checkSelected={checkSelected}
              isChild={false}
              multiple={multiple}
            />}
        />
      </SafeAreaView>
    </Modal>)
})

export default OptionModal2

const RenderList = ({ item, index, isChild, titleKey, onSelected, renderText, noIcon, checkSelected, multiple }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  // let isChecked = multiple && checkSelected?.(item);
  let isChecked = checkSelected?.(item);
  return (
    <>
      <TouchableHighlight
        style={multiple ? { marginTop: 5 } : undefined}
        onPress={() => {
          if (!!item.list) {
            setIsCollapsed(!isCollapsed)
          } else {
            onSelected?.(item)
          }
        }}
        underlayColor={colors.secondary} >
        <View style={{
          paddingVertical: 12, flexDirection: "row", alignItems: "center", paddingLeft: 20, backgroundColor: 'red',
          backgroundColor: isChecked ? colors.secondarySelect : colors.transparent,
          marginLeft: isChild ? 30 : 0

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
          {!!item?.list ?
            <View style={isCollapsed ? {
              paddingLeft: 15,
              transform: [{ rotateZ: "180deg" }]
            } : {
              paddingRight: 15,
              transform: [{ rotateZ: "0deg" }]
            }}>
              {icons.downwardArrow()}
            </View> :
            isChecked && multiple &&
            <View style={{ paddingRight: 15 }}>
              {icons.crosssWithCircle(colors.white, 20)}
            </View>
          }
        </View>
      </TouchableHighlight>
      <Collapsible collapsed={isCollapsed}>
        {!!item?.list && item?.list.map((x, i) =>
          <RenderList
            item={x}
            index={i}
            isChild={true}
            titleKey={titleKey}
            onSelected={onSelected}
            renderText={renderText}
            noIcon={noIcon}
            checkSelected={checkSelected}
            multiple={multiple}
          />)}
      </Collapsible>
    </>
  )
}
