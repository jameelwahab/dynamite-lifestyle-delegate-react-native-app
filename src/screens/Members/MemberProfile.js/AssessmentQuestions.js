import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import { useNavigation } from '@react-navigation/native'
import routes from '../../../navigation/routes'
import EmptyView from '../../../components/EmptyView'

const AssessmentQuestions = ({ list, name = "", noAnswer = false, titleKey = "", memberId = "" }) => {
  const navigation = useNavigation()
  return (
    <View>
      {list.length > 0 ?
        <>
          {list.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (noAnswer) {
                    navigation.navigate(routes.genericQestionListing, {
                      created_for: item?.created_for,
                      id: !!item?.created_for_id?._id ? item?.created_for_id?._id :
                        !!item?.created_for_id ? item?.created_for_id : "",
                      memberId: memberId
                    })
                  }
                }}
                style={{ flexDirection: "row", marginBottom: 10, paddingVertical: noAnswer ? 5 : undefined }}>
                <MyText type='bold' >{`${index + 1}.   `}</MyText>
                <View style={{ flex: 1 }}>
                  <MyText  >{!!titleKey ? item[titleKey] : `${item.question_statement.replace(/{Name}/g, name)}`}</MyText>
                  {!noAnswer && <MyText type='light' style={{ marginTop: 3 }} color={colors.lightText2} >{`${item.answer}`}</MyText>}
                </View>
              </TouchableOpacity>
            )
          })}
        </> :
        <EmptyView label={"No Questions Found"} />
      }
    </View>
  )
}

export default AssessmentQuestions