
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
import StudyAssessmentList from '../../screens/StudyAssessment.js/StudyAssessmentList'
import StudyAssessmentQuestionList from '../../screens/StudyAssessment.js/StudyAssessmentQuestionList'





const StudyAssessmentStack = createNativeStackNavigator()

const StackStudyAssessment = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <StudyAssessmentStack.Navigator
        screenOptions={{ headerShown: false }}>
        <StudyAssessmentStack.Screen initialParams={route.params} name={routes.studyAssessmentList} component={StudyAssessmentList} />
        <StudyAssessmentStack.Screen name={routes.studyAssessmentQuestionList} component={StudyAssessmentQuestionList} />



        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <StudyAssessmentStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </StudyAssessmentStack.Navigator>
    </View>
  )
}
export default StackStudyAssessment