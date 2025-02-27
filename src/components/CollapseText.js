import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../utilities/colors';
import { main } from '../utilities/styles';
// import colors from '../../colors'
// import { main, } from '../../styles'

const CollapseText = ({ desc, onPress, isCurrent, numOfLines = 2, style, disable=false }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCollapseable, setIsCollapseable] = useState(false);

  return (
    <View>
      <View >
        <Text

          style={[main.description, style]}
          numberOfLines={isCollapseable ? isCollapsed ? numOfLines : undefined : undefined}>
          {desc}
        </Text>
      </View>
      {!disable && isCollapseable ?
        <Pressable hitSlop={main.hitSlop} onPress={() => setIsCollapsed((val) => !val)}>
          <Text style={[main.regular,{fontSize:12,lineHeight:undefined, color:colors.primary2, textDecorationLine:"underline"}]} >{isCollapsed ? "See More" : "See Less"}</Text>
        </Pressable> : ""}

      <View style={{ position: "absolute", zIndex: -1 }}>
        <Text
          style={[main.description, style, { color: colors.transparent }]}
          onTextLayout={({ nativeEvent: { lines } }) => {
            setIsCollapseable(lines.length > numOfLines)
          }}>{desc}</Text>
      </View>
    </View>
  )
}

export default CollapseText
