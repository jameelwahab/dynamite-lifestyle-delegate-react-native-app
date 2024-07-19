import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import React, { Component, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { colors } from '../../utilities/colors'
import utilities from '../../utilities'



const LeadCenter = () => {
  const [list, setList] = useState(data)

  const itemView = ({ item, }) => {
    return (
      <TouchableOpacity>
        <View style={{ width: utilities.screenWidth() * 0.90,marginRight:10, alignItems: "center", justifyContent: "center", height: 50, backgroundColor: "pink", borderRadius: 10, marginTop: 10 }}>
          <MyText color={colors.black} >  {item?.title}</MyText>
        </View>
      </TouchableOpacity>
    )
  }


  return (
    <RootView>
      <FlatList
        // disableIntervalMomentum
        pagingEnabled={true}
        decelerationRate={'fast'}

        horizontal
        data={data}
        keyExtractor={(item) => item?.id}
        renderItem={itemView}
      />
    </RootView>
  )
}

export default LeadCenter

const data = [
  {
    id: '1234-1',
    title: 'Header1',
    data: [
      { id: '1-1', name: 'item1' },
      { id: '1-2', name: 'item2' },
      { id: '1-3', name: 'item3' },
      { id: '1-4', name: 'item4' },
    ],
  },
  {
    id: '1234-2',
    title: 'Header2',
    data: [
      { id: '2-1', name: 'item5' },
      { id: '2-2', name: 'item6' },
      { id: '2-3', name: 'item7' },
      { id: '2-4', name: 'item8' },
    ],
  },
  {
    id: '1234-3',
    title: 'Header3',
    data: [
      { id: '3-1', name: 'item9' },
      { id: '3-2', name: 'item10' },
      { id: '3-3', name: 'item11' },
      { id: '3-4', name: 'item12' }
    ],
  },
]