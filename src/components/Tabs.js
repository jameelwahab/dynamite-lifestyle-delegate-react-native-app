import React, { useRef } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import MyText from "./MyText";
import { colors } from "../utilities/colors";



const Tabs = ({ list, changeTab, tab }) => {
  const menuRef = useRef()


  return (
    <View style={{ marginHorizontal: -10 }}>
      <View style={{ height: 50,  }}>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={list}
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={menuRef}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  menuRef?.current?.scrollToIndex({
                    index: index,
                    animated: true
                  })
                  setTimeout(() => {
                    changeTab(index)
                  }, 100);
                }}
                style={{ justifyContent: "center", paddingHorizontal: 10 }}>
                <MyText fontSize={15} type={index == tab ? 'medium' : 'regular'} color={index == tab ? colors.primary2 : colors.lightText} >
                  {item.title}
                </MyText>

                <View style={{ borderRadius: 10, marginTop: 3, height: 3, backgroundColor: index == tab ? colors.primary : colors.transparent }} />
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </View>
  )
}

export default Tabs;

