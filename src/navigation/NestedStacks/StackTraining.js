
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'


import TrainingList from '../../screens/Training/TrainingList'
import TrainingDetail from '../../screens/Training/TrainingDetail'
import TrainingLessonDetail from '../../screens/Training/TrainingLessionDetail'
import TrainingLessonList from '../../screens/Training/TrainingLessonList'
import TrainingLessonRecordings from '../../screens/Training/TrainingLessonRecordings'





const TrainingStack = createNativeStackNavigator()

const StackTraining = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <TrainingStack.Navigator
        initialRouteName={routes.sourceFeedScreen}
        screenOptions={{ headerShown: false }}>
        <TrainingStack.Screen initialParams={route.params} name={routes.traininglist} component={TrainingList} />
        <TrainingStack.Screen name={routes.trainingDetail} component={TrainingDetail} />
        <TrainingStack.Screen name={routes.trainingLessonDetail} component={TrainingLessonDetail} />
        <TrainingStack.Screen name={routes.trainingLessonsList} component={TrainingLessonList} />
        <TrainingStack.Screen name={routes.trainingLessonRecording} component={TrainingLessonRecordings} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <TrainingStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </TrainingStack.Navigator>
    </View>
  )
}
export default StackTraining