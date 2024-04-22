
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'


import AssessmentList from '../../screens/Assessment/AssessmentList'
import AssessmentDetail from '../../screens/Assessment/AssessmentDetail'
import List from '../../screens/Assessment/Notes/List'
import AddNote from '../../screens/Assessment/Notes/AddNote'





const AssessmentStack = createNativeStackNavigator()

const StackAssessment = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <AssessmentStack.Navigator
        screenOptions={{ headerShown: false }}>
        <AssessmentStack.Screen initialParams={route.params} name={routes.assessmentList} component={AssessmentList} />
        <AssessmentStack.Screen name={routes.assessmentDetail} component={AssessmentDetail} />


        <AssessmentStack.Screen name={routes.assessmentNotesList} component={List} />
        <AssessmentStack.Screen name={routes.assessmentNotesAddEdit} component={AddNote} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <AssessmentStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </AssessmentStack.Navigator>
    </View>
  )
}
export default StackAssessment