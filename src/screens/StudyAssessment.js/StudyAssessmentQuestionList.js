import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import QuestionConfig from '../../MojarComponents/QuestionConfig'

const StudyAssessmentQuestionList = ({ navigation, route }) => {
  const { type, id ,title} = route?.params
  
  const { token } = useSelector(selectUser);


  return (
    <RootView title={title}>
      <QuestionConfig
        token={token}
        navigation={navigation}
        created_for={type}
        created_for_id={id}
      />
    </RootView>
  )
}

export default StudyAssessmentQuestionList