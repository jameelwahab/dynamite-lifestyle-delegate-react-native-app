import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import { useSelector } from 'react-redux'
import MyText from '../../components/MyText'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { selectUser } from '../../redux/reducers/userSlice'
import QuestionConfig from '../../MojarComponents/QuestionConfig'

const QuaterDetail = ({ navigation, route }) => {
  const { createdFor, createdForId, title, description } = route?.params
  const { token } = useSelector(selectUser);



  return (
    <RootView title={title} >
      <QuestionConfig
        token={token}
        navigation={navigation}
        created_for={createdFor}
        created_for_id={createdForId}
        description={description}

      />
    </RootView>
  )
}

export default QuaterDetail