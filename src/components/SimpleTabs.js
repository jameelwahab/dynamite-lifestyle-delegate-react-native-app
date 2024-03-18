import React, { useRef } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import MyText from "./MyText";
import { colors } from "../utilities/colors";




const SimpleTabs = ({ list, changeTab, tab }) => {
  const menuRef = useRef()


  return (
    <View style={{ marginHorizontal: -10, }}>
      <View style={__styles.rootView}>
        {list.map((x, i) => {
          return (
            <TouchableOpacity
              onPress={() => changeTab(i)}
              style={{flex:1, justifyContent: "center", paddingHorizontal: 10 ,alignItems:"center"}}>
              <MyText fontSize={15} type={i == tab ? 'medium' : 'regular'} color={i == tab ? colors.primary2 : colors.lightText} >
                {x.title}
              </MyText>
              <View style={{ borderRadius: 10, marginTop: 3, height: 3, backgroundColor: i == tab ? colors.primary : colors.transparent }} />
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

export default SimpleTabs;


const __styles = StyleSheet.create({
  rootView: {
    height: 50,
    flexDirection: "row",
    flex: 1
  },
})