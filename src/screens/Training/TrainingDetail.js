import { View, Text, ScrollView, FlatList, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import MyWebview from '../../components/MyWebview'
import Tabs from '../../components/Tabs'
import { colors } from '../../utilities/colors'
import routes from '../../navigation/routes'
import { icons } from '../../utilities/icons'
import { MyButton } from '../../components/MyButton'
import openUrl from '../../functions/openUrl'
import VimeoWithPip from '../../components/VimeoWithPip'
import { useFocusEffect } from '@react-navigation/native'
import EmptyView from '../../components/EmptyView'
import FeedScreen from '../Feed/FeedScreen'

const TrainingDetail = (props) => {
  const { navigation, route } = props;
  let { slug } = route?.params;
  let { token, user, S3_URL } = useSelector(selectUser);
  const isFirtTime = useRef(true);
  const [loader, setLoader] = useState(true);
  const [program, setProgram] = useState(null);
  const [lessons, setLessons] = useState([])
  const [tabs, setTabs] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [mySlug, setSlug] = useState(slug)
  useEffect(() => {
    setLessons([])
    setTabs([])
    setProgram(null);
    setLoader(true)
    getDataFromServer()
  }, [mySlug])

  console.log(tabs, "tabs")


  useFocusEffect(useCallback(() => {
    setIsFocused(true);
    return () => {
      setIsFocused(false);
    }
  }, []))


  const onTabClick = (index) => {
    let tabObj = tabs[index]
    if (tabObj?.type == "general") {
      setSelectedTabIndex(index)
    } else {
      let link = tabObj?.button_url;
      if (!!link) {
        if (link.includes("dynamitelifestyle.com") && link.includes("delegates")) {
          if (link.includes("delegate-training")) {
            let slug = link.split("/").pop();
            setSlug(slug)
          }
        } else {
          openUrl(link)
        }
      }
    }
  }

  const getDataFromServer = async () => {
    let res = await GET_TRAINING_DETAIL({ navigation, token, slug: mySlug });
    if (res.code == 200) {

      let tabArr = [
        {
          title: "Overview",
          _id: "delegate_overview_tab_by_me",
          section_slug: "delegate_overview_tab_by_me",
          type: "general"
        },
        {
          title: res?.program?.delegate_first_tab_heading,
          _id: "delegate_first_tab",
          section_slug: "delegate_first_tab",
          type: "general"
        },
        ...res?.program_section];
      let community = null;
      res?.program?.program_configration.forEach((x) => {
        if (x?.community_tab_status) {
          community = {
            title: x?.community_tab_title,
            _id: "delegate_feed_tab_by_me",
            section_slug: "delegate_overview_tab_by_me",
            type: "general"
          }
        }
      })
      if (community) {
        tabArr.splice(1, 0, community);
      }

      if (isFirtTime?.current) {
        isFirtTime.current = false;
        if (route?.params?.curtab) {
          let index = tabArr.findIndex(x => x._id == route?.params?.curtab)
          if (index > -1) {
            setSelectedTabIndex(index)
          }
        }
      }
      setProgram(res?.program);
      setLessons(res?.lesson);
      setTabs(tabArr);
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
      slug: mySlug
    })
  }


  const overView = () => {
    return (
      <View style={{ flex: 1 }}>
        {!!program &&
          <ScrollView showsVerticalScrollIndicator={false} >
            {!!program?.video_url ?
              <>
                {program?.video_url.includes("vimeo") ?
                  <VimeoWithPip
                    id={program?._id}
                    url={program?.video_url}
                    focused={isFocused} /> :
                  <WebPlayer width={utilities.screenWidth() - 20} url={program?.video_url} />}
              </> :
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


          </ScrollView>
        }
      </View>
    )
  }

  const feedView = () => {
    console.log("feedView")
    return (
      <View style={{ flex: 1, }}>
        <FeedScreen
          isScheduleFeedTabAllowed={false}
          hideTabs
          navigation={navigation}
          route={{
            ...route,
            params: {
              ...route?.params,
              feedFor: "program",
              eventId: program?._id
            }
          }}
        />
      </View>
    )
  }

  const footerView1 = () => {
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
        {!!program &&
          <TouchableOpacity
            onPress={onTrainingLessonList}
            style={__styles.rightButtton}>
            {icons.list_circle(colors.primary, 25)}
          </TouchableOpacity>}
      </View>
    )
  }

  const lessonView = () => {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
          data={lessons}
          renderItem={renderlessons}
        />
      </View>
    )
  }

  const renderView = () => {
    return (<>
      {tabs[selectedTabIndex]?._id == "delegate_feed_tab_by_me" ? feedView() :
        tabs[selectedTabIndex]?._id == "delegate_first_tab" ? lessonView() :
          tabs[selectedTabIndex]?._id == "delegate_overview_tab_by_me" ? overView() :
            null
      }
    </>)
  }

  return (
    <RootView titleView={titleView}  >
      <View style={{ flex: 1, }}>
        {!!program ?
          <View style={{ flex: 1 }}>
            <Tabs
              tab={selectedTabIndex}
              changeTab={onTabClick}
              list={tabs} />

            {renderView()}
          </View> : loader == false &&
          <EmptyView label={`Nothing Found`} />
        }

        {/* {!!program ?
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={headerView()}
            data={tabs[selectedTabIndex]?._id == "delegate_first_tab" ? lessons : []}
            ListFooterComponent={footerView()}
            renderItem={renderlessons}
          /> :
          loader == false &&
          <EmptyView label={`Nothing Found`} />
        } */}

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
