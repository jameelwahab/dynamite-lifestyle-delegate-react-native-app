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
import { MyButton } from '../../components/MyButton'
import openUrl from '../../functions/openUrl'

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

  const onTrainingLessonList = () => {
    navigation.navigate(routes.trainingLessonsList, {
      slug: slug
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

  const footerView = () => {
    let data = selectedTabIndex > 0 ? tabs[selectedTabIndex] : null
    return (
      <View>
        {!!data &&
          <View style={__styles.cardView}>
            {!!data?.video_url &&
              <WebPlayer url={data?.video_url}
                width={utilities.screenWidth() - 20}
              />}
            <View style={{ padding: 10 }}>
              {!!data?.detailed_description &&
                <MyWebview html={data?.detailed_description} />
              }

              {!!data?.button_text && !!data?.button_url &&
                <View style={{ marginTop: 10 }}>
                  <MyButton
                    onPress={() => openUrl(data?.button_url)}
                    invert title={data?.button_text}
                  />
                </View>
              }
            </View>
          </View>
        }
      </View>
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
        <MyText isHeading  >{program?.title}</MyText>
        <TouchableOpacity
          onPress={onTrainingLessonList}
          style={__styles.rightButtton}>
          {icons.list_circle(colors.primary, 25)}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <RootView titleView={titleView}  >
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={headerView()}
          data={lessons}
          renderItem={selectedTabIndex == 0 ? renderlessons : null}
          ListFooterComponent={footerView()}
        />

      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default TrainingDetail

const __styles = StyleSheet.create({
  topViewRoot: { flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "space-between" },
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