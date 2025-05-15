import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import { useSelector } from 'react-redux'
import MyText from '../../components/MyText'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import QuestionConfig from '../../MojarComponents/QuestionConfig'
import { selectUser } from '../../redux/reducers/userSlice'
import MyLoader from '../../components/MyLoader'
import { STUDY_ASSESSSMENT_QUESTIONS_LIST } from '../../DAL/Certification'
import { colors } from '../../utilities/colors'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import routes from '../../navigation/routes'
import { selectSettings } from '../../redux/reducers/settingSlice'
import MyWebview from '../../components/MyWebview'
import EmptyView from '../../components/EmptyView'

const StudyAssessmentList = ({ navigation, route }) => {
  const { parentValue, value } = route?.params
  const { navbar } = useSelector(selectNavbar);
  const { settings } = useSelector(selectSettings);
  const { token, S3_URL } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([]);
  const [title] = useState(navbar?.find(x => x.value == parentValue)?.child_options?.find(y => y.value == value)?.title);


  useEffect(() => {
    getDatafromServer()
  }, [])

  const getDatafromServer = async () => {
    let res = await STUDY_ASSESSSMENT_QUESTIONS_LIST({ token, navigation });
    setLoader(false)
    if (res.code == 200) {
      setList(res?.program)
    }
  }


  const renderList = useCallback(({ item, index }) => {
    return (
      <Pressable
        onPress={() => navigation.navigate(routes.studyAssessmentQuestionList, {
          type: "programme",
          id: item?._id,
          title: item?.title
        })}
        style={__styles.itemView}>
        <ResponsiveImage2
          uri={S3_URL + item?.program_images?.thumbnail_1}
        />
        <View style={__styles.secondView}>
          <MyText fontSize={18} color={colors.primary} type='medium' >{item?.title}</MyText>
          <View style={{ marginTop: 3 }}>
            <MyText fontSize={12} color={colors.white} >{item?.short_description}</MyText>
          </View>
        </View>
      </Pressable>
    )
  }, [JSON.stringify(list)])

  const headerView = () => {
    return (
      <View>
        {!!settings?.assessment_page_content && list.length > 0 &&
          <MyWebview fullWidth html={settings?.assessment_page_content} />}
      </View>
    )
  }

  return (
    <RootView
      hideBackBottomButton
      title={title}
      subTitle={`Total Showing : ${list.length}`}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={headerView()}
          data={list}
          renderItem={renderList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id}
          ListEmptyComponent={!loader && <EmptyView label={"No Programmes Found"} />}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default StudyAssessmentList

const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    marginTop: 15,
    overflow: "hidden"
  },
  secondView: {
    padding: 10,
  }
})
