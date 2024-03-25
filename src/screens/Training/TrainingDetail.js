import { View, Text, ScrollView, FlatList, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { GET_TRAINING_DETAIL } from '../../DAL'
import WebPlayer from '../../components/WebPlayer'
import MyLoader from '../../components/MyLoader'
import utilities from '../../utilities'
import AudioPlayer from '../../components/AudioPlayer'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import { S3_URL } from '../../utilities/constants'
import MyWebview from '../../components/MyWebview'
import Tabs from '../../components/Tabs'
import { colors } from '../../utilities/colors'
import routes from '../../navigation/routes'
import { icons } from '../../utilities/icons'

const TrainingDetail = ({ navigation, route }) => {
  let { slug } = route?.params;
  let { token, user } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [program, setProgram] = useState(null);
  const [lessons, setLessons] = useState([])
  const [modules, setModules] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  useEffect(() => {
    getDataFromServer()
  }, [])

  const getDataFromServer = async () => {
    let res = await GET_TRAINING_DETAIL({ navigation, token, slug });
    if (res.code == 200) {
      setProgram(res?.program);
      setLessons(res?.lesson);
      setTabs([{
        title: res?.program?.delegate_first_tab_heading,
        _id: "delegate_first_tab",
        section_slug: "delegate_first_tab"
      },
      ...res?.program_section]);
      setLoader(false);
    } else {
      setLoader(false)
    }
  }

  const onTrainingDetail = (item) => {
    navigation.navigate(routes.trainingLessonDetail, {
      slug: item?.lesson_slug
    })
  }


  const headerView = () => {
    return (
      <>
        {!!program &&
          <View>
            {!!program?.video_url ?
              <WebPlayer width={utilities.screenWidth() - 20} url={program?.video_url} /> :
              <ResponsiveImage2 uri={S3_URL + program?.program_images?.thumbnail_1} />}

            {!!program?.audio_file &&
              <AudioPlayer url={program?.audio_file} />}

            {!!program?.detailed_description &&
              <View style={{ marginTop: 10 }}>
                <MyWebview
                  fullWidth
                  html={program?.detailed_description}
                />
              </View>
            }

            <Tabs
              tab={selectedTabIndex}
              changeTab={setSelectedTabIndex}
              list={tabs} />
          </View>
        }
      </>
    )
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

  const titleView = () => {
    return (
      <View style={__styles.topViewRoot}>
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={__styles.backButtton}>
          {icons.back(colors.primary, 25)}
        </TouchableOpacity> */}
      </View>
    )
  }

  return (
    <RootView titleView={titleView}  >
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={headerView()}
          data={lessons}
          renderItem={renderlessons}
        />

      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default TrainingDetail

const __styles = StyleSheet.create({
  topViewRoot: { flexDirection: "row", alignItems: "center",flex:1 },
  backButtton: { height: 50, width: 30, justifyContent: "center" },
  cardView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10
  },
  textView: {
    padding: 10
  },
  lockImg: {
    height: 30,
    width: 30
  },
  listIconView: {
    height: 50,
    width: 50,
    position: "absolute",
    top: -50,
    right: 10,
    backgroundColor: "pink"
  }

})