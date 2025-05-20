import { View, Text, FlatList, StyleSheet, Pressable, SectionList, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { GET_ASSETS_CATEGORY_LIST, GET_TECH_CATEGORY_LIST, } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import utilities from '../../utilities'
import { dateTimeFormat, S3_URL, } from '../../utilities/constants'
import { colors } from '../../utilities/colors'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import routes from '../../navigation/routes'
import LessonView from '../../components/LessonView'
import { main } from '../../utilities/styles'
import MyChip from '../../components/MyChip'
import { Flex, Row } from '../../UIComponents/FlexViews'
import { icons } from '../../utilities/icons'
import TitleView from '../../components/TitleView'
import Filter from './components/Filter'
import isArray from '../../functions/isArray'
import moment from 'moment'
import MyRefreshControl from '../../components/MyRefreshControl'
import EmptyView from '../../components/EmptyView'
import SearchView from '../../components/SearchView'
import LessonView2 from '../../components/LessonView2'



const Helptechlist = ({ navigation, route }) => {
  const { token } = useSelector(selectUser);
  const ref_filterModal = useRef()
  const { value, parentValue } = route?.params;
  const { navbar } = useSelector(selectNavbar)
  const [title] = useState(navbar?.find(x => x.value == parentValue)?.child_options?.find(y => y.value == value)?.title);
  const [list, setList] = useState([])
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [appliedFilter, setAppliedFilter] = useState({
    categories: [],
    departments: [],
    from: "",
    to: ""
  })

  const [width] = useState(utilities.screenWidth())
  useEffect(() => {
    setLoader(true)
    getDataFromServer()
  }, [JSON.stringify(appliedFilter)]);


  const removeFromArrayFilter = (index, type) => {
    if (appliedFilter[type]) {
      appliedFilter[type].splice(index, 1);
      setAppliedFilter({ ...appliedFilter })
    }

  }

  const removeFromDateFilter = () => {
    setAppliedFilter({ ...appliedFilter, to: "", from: "" })
  }

  const applyFilter = (filters) => {
    setAppliedFilter({ ...filters })
  }

  const filterBySearch = (data) => {
    return data.slice("")
      .map(category => {
        const filteredVideos = category.help_videos.filter(video => video.title.toLowerCase().includes(searchText.trim().toLowerCase()));
        return {
          ...category,
          help_videos: filteredVideos
        };
      })
      .filter(category => category.help_videos.length > 0);
  }



  const getDataFromServer = async () => {
    let res = await GET_TECH_CATEGORY_LIST({
      navigation, token,
      categories: appliedFilter?.categories.map(x => x?._id),
      departments: appliedFilter?.departments.map(x => x?._id),
      endDate: appliedFilter?.to ? appliedFilter?.to : undefined,
      startDate: appliedFilter?.from ? appliedFilter?.from : undefined,

    });
    if (res.code == 200) {
      // let arr = []
      // res.help_video_category.forEach((x, i) => {
      //   arr.push({
      //     index: i,
      //     data: x.help_videos,
      //     title: x.title,
      //     _id: x._id
      //   })
      // })
      setList(res.help_video_category)
      setLoader(false)
      setRefreshing(false);
    } else {
      setRefreshing(false);
      setLoader(false)
    }
  }


  const onHelpTechDetailScreen = (item) => {
    navigation.navigate(routes.helptechDetailScreen, {
      category: item
    })
  }



  const descView = (item, index) => {
    if (isArray(item?.help_video_departments)) {
      return (
        <View style={{ marginTop: "auto", marginTop: 5 }} >
          <Row flexWrap="wrap"  >
            {
              item?.help_video_departments.map((x, i) => {
                return (<MyChip title={x?.title} />)
              })}
          </Row>

        </View>
      )
    } else return null
  }

  const renderTutorials = ({ item, index, }) => {

    return (
      <View style={{ flex: 1 / 2 }}>
        <View style={[{
          marginTop: 10,
          marginLeft: index % 2 != 0 ? 5 : 0,
          marginRight: index % 2 == 0 ? 5 : 0,
          borderWidth: 1,
          borderColor: colors.white + "22",
          borderRadius: 10,
          flex: 1,
          backgroundColor: colors.secondary
        }, {}]} >
          <LessonView2
            handlePress={() => onHelpTechDetailScreen(item)}
            heading={item.title}
            numberOfTitleLines={3}
            durationText={moment(item?.createdAt).format("DD MMM, YYYY")}
            descView={() => descView(item, index)}
            image={item.image.thumbnail_1} />
        </View>
      </View>
    )
    // return (
    //   <Pressable onPress={() => onHelpTechDetailScreen(item)}
    //     style={[__styles.itemView, { marginBottom: index == (section.data.length - 1) ? 20 : 0 }]} >
    //     <ResponsiveImage2
    //       uri={S3_URL + item.image.thumbnail_1}
    //       width={width - 20}
    //     />
    //     <View style={{ padding: 10 }} >
    //       <MyText isHeading>{item.title}</MyText>
    //       {!!item?.short_description &&
    //         <MyText >
    //           {item?.short_description}
    //         </MyText>}
    //     </View>
    //   </Pressable>)
  }

  const sectionHeader = ({ item }) => {

    return (
      <View style={[__styles.header, {}]}>
        <View style={{ alignSelf: "flex-start", paddingBottom: 5 }} >
          <Text style={main.heading}>
            {item?.title}
          </Text>
          <View style={{
            marginTop: 2,
            // borderBottomColor: colors.primary,
            // borderBottomWidth: 1,
            height: 2,
            borderRadius: 10,
            // paddingBottom:10,

            backgroundColor: colors.primary
          }} />
        </View>
        <FlatList
          data={item?.help_videos}
          renderItem={renderTutorials}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
        {/* {item?.help_videos.map((x, i) => renderTutorials({ item: x, index: i }))} */}
      </View>
    )
  }

  const headerComponent = () => {
    return (
      <View style={{ paddingTop: 5, backgroundColor: colors.darkSecondary }}>
        <Row flexWrap="wrap">
          {isArray(appliedFilter?.categories) &&
            appliedFilter?.categories.map((x, i) => <MyChip title={x?.title} onPress={() => removeFromArrayFilter(i, "categories")} />)}
          {isArray(appliedFilter?.departments) &&
            appliedFilter?.departments.map((x, i) => <MyChip title={x?.title} onPress={() => removeFromArrayFilter(i, "departments")} />)}
          {appliedFilter.from && appliedFilter.to &&
            <MyChip title={`From ${moment(appliedFilter.from).format(dateTimeFormat.date)} to ${moment(appliedFilter.to).format(dateTimeFormat.date)}`} onPress={() => removeFromDateFilter()} />
          }
        </Row>
        {mySearchView()}
      </View>
    )
  }

  const mySearchView = () => {
    return (
      <View style={{ paddingBottom: 5 }} >
        <SearchView
          hideBtn
          search={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
    )
  }

  const titleView = () => {
    return (
      <View>
        <Row paddingHorizontal={10}>
          <Flex flex={1} >
            <TitleView
              hideBackBottomButton
              title={title}
              subTitle={`Total : ${list.reduce((count, category) => count + category.help_videos.length, 0)}`}
            />
          </Flex>
          <TouchableOpacity
            onPress={() => ref_filterModal?.current?.openModal(appliedFilter)}>
            {icons.filterCircle(colors.primary, 30)}
          </TouchableOpacity>

        </Row>

      </View>
    )
  }

  return (
    <RootView
      titleView={titleView}
      hideBackBottomButton >
      <View style={{ flex: 1 }} >
        <FlatList
          ListHeaderComponent={headerComponent()}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          showsVerticalScrollIndicator={false}
          // stickySectionHeadersEnabled={true}
          contentContainerStyle={{ paddingBottom: 30, }}
          refreshControl={
            <MyRefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                getDataFromServer()
              }}
            />
          }
          ListEmptyComponent={!loader && <EmptyView />}
          data={filterBySearch(list)}
          // renderSectionHeader={sectionHeader}
          renderItem={sectionHeader}
        />
      </View>
      <MyLoader enable={loader} />
      <Filter ref={ref_filterModal} applyFilter={applyFilter} />
    </RootView>
  )
}

export default Helptechlist;

const __styles = StyleSheet.create({
  itemView: {
    // marginTop: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    backgroundColor: colors.darkSecondary,
    // paddingVertical: 10,
    paddingTop: 10,
    paddingBottom: 10,


  }

})