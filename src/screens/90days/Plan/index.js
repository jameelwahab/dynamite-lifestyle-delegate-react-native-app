import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import MyText from '../../../components/MyText'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import QuestionConfig from '../../../MojarComponents/QuestionConfig'
import { selectUser } from '../../../redux/reducers/userSlice'

const _90daysPlan = ({ navigation, route }) => {
  const { key, parentKey,type } = route?.params
  console.log(type,"type")
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const [title] = useState(navbar?.find(x => x.value == parentKey)?.child_options?.find(y => y.value == key)?.title);

  return (
    <RootView
      hideBackBottomButton
      title={title}
    >
      <QuestionConfig
        token={token}
        navigation={navigation}
        created_for={type}

      />
    </RootView>
  )
}

export default _90daysPlan