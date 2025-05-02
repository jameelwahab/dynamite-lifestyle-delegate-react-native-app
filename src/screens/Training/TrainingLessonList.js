import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { GET_TRAINING_DETAIL, } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import { FlatList } from 'react-native-gesture-handler'
import { colors } from '../../utilities/colors'
import EmptyView from '../../components/EmptyView'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import routes from '../../navigation/routes'
import utilities from '../../utilities'

const TrainingLessonList = ({ navigation, route }) => {
  let { slug } = route?.params;
  let { token, user, S3_URL } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [program, setProgram] = useState(null)
  const [list, setList] = useState([]);

  useEffect(() => {
    getDataFromServer()
  }, [])

  const getDataFromServer = async () => {
    let res = await GET_TRAINING_DETAIL({ navigation, token, slug });
    if (res.code == 200) {
      setList(res?.lesson)
      setProgram(res?.program)
      setLoader(false)
    } else {
      setLoader(false)

    }
  }

  const onTrainingDetail = (item) => {
    navigation.navigate(routes.trainingLessonDetail, {
      slug: item?.lesson_slug
    })
  }

  const renderlessons = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => onTrainingDetail(item)}
        style={__styles.cardView}>
        <View>
          <ResponsiveImage2
            uri={S3_URL + item?.lesson_images?.thumbnail_1}
            width={utilities.screenWidth() - 20}
          />
        </View>
        <View style={__styles.textView}>
          <MyText color={colors.primary} type='medium' >{item?.title}</MyText>
          <View style={{ marginTop: 5 }}>
            <MyText>{item?.short_description}</MyText>
          </View>
        </View>
      </Pressable>
    )
  }

  return (
    <RootView title={program?.title} >
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          renderItem={renderlessons}
          keyExtractor={(item, index) => item?._id + index}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          ListEmptyComponent={!loader && <EmptyView />}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default TrainingLessonList

const __styles = StyleSheet.create({
  rightButtton: { height: 50, width: 30, justifyContent: "center" },
  cardView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10
  },
  textView: {
    padding: 10
  },

})
