import { View, Text, FlatList, Pressable, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import MyLoader from '../../components/MyLoader'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import MyWebview from '../../components/MyWebview'
import AudioPlayer from '../../components/AudioPlayer'
import WebPlayer from '../../components/WebPlayer'
import Tabs from '../../components/Tabs'
import routes from '../../navigation/routes'
import { GET_TRAINING_DETAIL, GET_TRAINING_LESSONS_DETAIL } from '../../DAL'
import { S3_URL } from '../../utilities/constants'
import { colors } from '../../utilities/colors'
import utilities from '../../utilities'
import ResponsiveImage from '../../components/ResponsiveImage'
import { icons } from '../../utilities/icons'
import downloadImage from '../../functions/downloadImage'
import downloadFile from '../../functions/downloadFile'
import VimeoWithPip from '../../components/VimeoWithPip'

const TrainingLessonDetail = ({ navigation, route }) => {
  let { slug } = route?.params;
  let { token, user } = useSelector(selectUser);
  const [selecedSlug, setSlug] = useState(slug)
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [recources, setRecources] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [prevlesson, setPrevlesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);

  useEffect(() => {
    setLoader(true);
    getDataFromServer()
  }, [selecedSlug])

  const getDataFromServer = async () => {
    let res = await GET_TRAINING_LESSONS_DETAIL({ navigation, token, slug: selecedSlug });
    if (res.code == 200) {
      let next = Object.keys(res?.next_lesson).length > 0;
      let prev = Object.keys(res?.previous_lesson).length > 0;
      setData(res?.lesson);
      setRecources(res?.document_list);
      setRecordings(res?.recording_list)
      setNextLesson(!!next ? res?.next_lesson : null);
      setPrevlesson(!!prev ? res?.previous_lesson : null);
      setLoader(false);
    } else {
      setLoader(false)
    }
  }

  const changeLesson = (slug) => {
    setData(null);
    setRecordings([])
    setRecources([]);
    setSelectedTabIndex(0)
    setSlug(slug);
  }

  const onTrainingDetail = (item) => {
    navigation.navigate(routes.trainingLessonRecording, {
      slug: item?.recording_slug
    })
  }
  const getFileIconByType = (uri) => {
    let ext = uri.split(".").pop();

    if (ext == "xls" || ext == "xlsx") {
      return icons.file_xls
    } else if (ext == "doc" || ext == "docx") {
      return icons.file_doc
    } else if (ext == "pdf") {
      return icons.file_pdf
    } else if (ext == "csv") {
      return icons.file_csv
    } else if (ext == "mp3") {
      return icons.file_mp3
    }


  }

  const headerView = () => {
    return (
      <>
        {!!data &&
          <View>
            {!!data?.video_url ?
              <>
                {data?.video_url.includes("vimeo") ?
                  <VimeoWithPip url={data?.video_url} /> :
                  <WebPlayer width={utilities.screenWidth() - 20} url={data?.video_url} />}
              </> :
              <ResponsiveImage2 uri={S3_URL + data?.lesson_images?.thumbnail_1} />}

            {!!data?.audio_file &&
              <AudioPlayer url={data?.audio_file} />}

            {(!!prevlesson || !!nextLesson) &&
              <View style={__styles.btnsRow}>
                {!!prevlesson ?
                  <TouchableOpacity
                    onPress={() => changeLesson(prevlesson?.lesson_slug)}
                    style={__styles.btnsView}>
                    {icons.backwardArrow()}
                    <MyText style={__styles.btnsText}> Prevoius</MyText>
                  </TouchableOpacity> : <View />}

                {!!nextLesson ?
                  <TouchableOpacity
                    onPress={() => changeLesson(nextLesson?.lesson_slug)}
                    style={__styles.btnsView}>
                    <MyText style={__styles.btnsText}>Next </MyText>
                    {icons.forwardArrow()}
                  </TouchableOpacity> : <View />}
              </View>}

            {!!data?.detailed_description &&
              <View style={{ marginTop: 10 }}>
                <MyWebview
                  fullWidth
                  html={data?.detailed_description}
                />
              </View>
            }


          </View>
        }
      </>
    )
  }

  const lessonView = () => {
    return recordings.map((item, index) => {
      return (
        <Pressable
          onPress={() => onTrainingDetail(item)}
          style={[__styles.cardView]}>
          <ResponsiveImage2
            uri={S3_URL + item?.recording_image?.thumbnail_1}
          />
          <View style={__styles.textView}>
            <MyText type='medium' fontSize={16} color={colors.primary} >{item?.title}</MyText>
            {!!item?.short_description &&
              <View style={{ marginTop: 5 }}>
                <MyText>{item?.short_description}</MyText>
              </View>}
          </View>
        </Pressable>
      )
    })
  }

  const recourcesView = () => {
    return recources.map((item, index) => {
      return (
        <View style={[__styles.cardView,]}>
          <View style={{ alignSelf: "flex-start", marginTop: 10, marginLeft: 10 }}>
            {(!!item?.document_thumbnail || item?.document_images_url?.thumbnail_1) ?
              <ResponsiveImage2
                uri={!!item?.document_thumbnail ? S3_URL + item?.document_thumbnail : S3_URL + item?.document_images_url?.thumbnail_1}
                width={((utilities.screenWidth() - 40) / 2)}
              /> :

              <Image
                source={getFileIconByType(item?.document_file_url)}
              // style={{ width: 50, height: 50 }}
              />
            }
          </View>


          <View style={{}}>
            <View style={__styles.textView}>
              <MyText type='medium' fontSize={16} color={colors.primary} >{item?.title}</MyText>
              {!!item?.detailed_description &&
                <View style={{ marginTop: 5 }}>
                  <MyWebview html={item?.detailed_description} />
                </View>}
            </View>






            <TouchableOpacity
              onPress={() => {
                if (item?.document_type == "image") {
                  downloadFile(S3_URL + item?.document_images_url?.thumbnail_1, `Delegate Training/${data?.title}/${item?.title}`)
                } else {
                  downloadFile(S3_URL + item?.document_file_url, `Delegate Training/${data?.title}/${item?.title}`)
                }
              }}
              style={__styles.downloadButton}
            >
              {icons.download(colors.primary, 25)}
            </TouchableOpacity>
          </View>
        </View>
      )
    })
  }

  return (
    <RootView title={data?.title} >
      <View style={{ flex: 1 }}>
        {!!data &&
          <ScrollView showsVerticalScrollIndicator={false}>
            {headerView()}
            <View style={{ marginTop: 10 }}>
              <Tabs
                tab={selectedTabIndex}
                changeTab={setSelectedTabIndex}
                list={tabs} />
            </View>

            {selectedTabIndex == 0 ? lessonView() : recourcesView()}

          </ScrollView>}
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default TrainingLessonDetail

const __styles = StyleSheet.create({
  cardView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,

  },
  textView: {
    padding: 10
  },
  downloadButton: {
    alignSelf: "flex-end",
    // backgroundColor:"pink",
    padding: 5,
    marginTop: -5,
    paddingRight: 10,
    paddingBottom: 10
  },
  btnsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  btnsView: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
  },
  btnsText: {
    color: colors.primary,
    fontSize: 16
  }

})

const tabs = [
  {
    title: "LESSONS",
    key: "lessons",
  },
  {
    title: "RECOURCES",
    key: "recources",
  },
]