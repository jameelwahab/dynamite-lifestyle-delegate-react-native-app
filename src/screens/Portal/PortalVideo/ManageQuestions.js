import { View, Text } from 'react-native'
import React from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import GenericQuetionListByModule from '../../Questions/GenericQuetionListByModule'

const ManageQuestions = ({ navigation, route }) => {
  let { eventId, slug, videoId } = route.params;
  return (
    <RootView title={"Dynamite Event Video Questions"}>
      <GenericQuetionListByModule
        module={"dynamite_event_video"}
        moduleId={videoId}
      />
    </RootView>
  )
}

export default ManageQuestions