
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'


import AddProgress from '../../screens/Progress/AddProgress'
import ProgressList from '../../screens/Progress/ProgressList'
import AddNote from '../../screens/Progress/Notes/AddNote'
import PorgressNotesList from '../../screens/Progress/Notes/PorgressNotesList'
import GenericQuetionList from '../../screens/Questions/GenericQuetionList'
import ProgressFilter from '../../screens/Progress/ProgressFilter'





const ProgressStack = createNativeStackNavigator()

const StackProgress = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <ProgressStack.Navigator
        screenOptions={{ headerShown: false }}>

        <ProgressStack.Screen initialParams={route?.params} name={routes.progresssList} component={ProgressList} />
        <ProgressStack.Screen name={routes.progresssFilter} component={ProgressFilter} />
        <ProgressStack.Screen name={routes.progresssAddEdit} component={AddProgress} />
        <ProgressStack.Screen name={routes.genericQestionListing} component={GenericQuetionList} />
        <ProgressStack.Screen name={routes.progresssNotesList} component={PorgressNotesList} />
        <ProgressStack.Screen name={routes.progresssAddNote} component={AddNote} />


        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <ProgressStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}




      </ProgressStack.Navigator>
    </View>
  )
}
export default StackProgress;