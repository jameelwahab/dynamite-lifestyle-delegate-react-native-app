import { View, Text } from 'react-native'
import React from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'

import { KanbanBoard, ColumnModel, CardModel } from '@intechnity/react-native-kanban-board';

const columns = [
  new ColumnModel("new", "New", 1),
  new ColumnModel("inProgress", "In Progress", 2),
  new ColumnModel("ready", "Ready", 3),
];

const cards = [
  new CardModel(
    "card1",
    "new",
    "1st Card",
    "Example card",
    "test description",
    [
      {
        text: "Tag1",
        backgroundColor: "#00FF00",
        textColor: "#000000"
      }
    ],
    null,
    1
  ),

  new CardModel(
    "card2",
    "new",
    "1st Card",
    "Example card",
    "test description",
    [
      {
        text: "Tag1",
        backgroundColor: "#00FF00",
        textColor: "#000000"
      }
    ],
    null,
    2
  ),


  new CardModel(
    "card3",
    "new",
    "1st Card",
    "Example card",
    "test description",
    [
      {
        text: "Tag1",
        backgroundColor: "#00FF00",
        textColor: "#000000"
      }
    ],
    null,
    3
  ),

  new CardModel(
    "card4",
    "new",
    "1st Card",
    "Example card",
    "test description",
    [
      {
        text: "Tag1",
        backgroundColor: "#00FF00",
        textColor: "#000000"
      }
    ],
    null,
    4
  ),
  // ... add more cards ...
];


const LeadCenter = ({ navigation, route }) => {

  const onCardDragEnd = (srcColumn, destColumn, item, targetIdx) => {
    // Handle card drag and drop
  };

  const onCardPress = (item) => {
    // Handle card press
  };
  return (
    <RootView hideSubHeader>
      <KanbanBoard
        columns={columns}
        cards={cards}
        onDragEnd={onCardDragEnd}
        onCardPress={onCardPress}
      />
    </RootView>
  )
}

export default LeadCenter