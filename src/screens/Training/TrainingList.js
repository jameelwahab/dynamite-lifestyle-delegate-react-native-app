import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { GET_TRAINING_LIST } from '../../DAL'
import { FlatList } from 'react-native-gesture-handler'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import MyWebview from '../../components/MyWebview'
import EmptyView from '../../components/EmptyView'
import { S3_URL } from '../../utilities/constants'
import MyLoader from '../../components/MyLoader'
import { colors } from '../../utilities/colors'
import utilities from '../../utilities'
import MyImage from '../../components/MyImage'
import routes from '../../navigation/routes'
import FooterLoader from '../../components/FooterLoader'
import MyRefreshControl from '../../components/MyRefreshControl'
import SearchView from '../../components/SearchView'
import breakReference from '../../functions/breakReference'

const TrainingList = ({ navigation, route }) => {
  const { key } = route?.params;
  const pagination = useRef({ page: 0, canLoadMore: false })
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const [title] = useState(navbar?.find(x => x._id == key)?.title);
  const [loader,] = useState(true);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loaders, updateLoaders] = useState({
    overall: true,
    pagination: false,
    refreshing: false,
    searching: false
  })

  const setLoader = (type) => {
    let loadersObj = breakReference(loaders);
    for (const key in loadersObj) {
      if (key == type) {
        loadersObj[key] = true
      } else {
        loadersObj[key] = false
      }

    }
    updateLoaders(loadersObj)

  }



  useEffect(() => {
    pagination.current.page = 0
    pagination.current.canLoadMore = false
    getDataFromServer()
  }, [])



  const getDataFromServer = async () => {

    let res = await GET_TRAINING_LIST({ navigation, token, page: pagination?.current?.page, search: searchText.trim() });
    if (res.code == 200) {
      let array = pagination.current.page == 0 ? res?.program : [...list, ...res?.program];
      pagination.current.page++;

      console.log(array.length, res?.total_program_count, "Check")
      if (array.length < res?.total_program_count) {
        pagination.current.canLoadMore = true;
      } else {
        pagination.current.canLoadMore = false;
      }
      setList(array)
      setTotal(res?.total_program_count)
      setLoader("")
    } else {
      setLoader("")
    }
  }
  const onRefresh = () => {
    pagination.current.page = 0
    pagination.current.canLoadMore = false
    setLoader("refreshing");
    getDataFromServer()
  }

  const onSearchPress = () => {
    pagination.current.page = 0
    pagination.current.canLoadMore = false
    setLoader("searching");
    getDataFromServer()
  }


  const onEndReached = () => {

    if (pagination.current.canLoadMore) {
      pagination.current.canLoadMore = false;
      setLoader("pagination");
      getDataFromServer()
    }
  }


  const onTrainingDetail = (item) => {
    if (!item?.locked_status) {
      navigation.navigate(routes.trainingDetail, {
        slug: item?.program_slug,
      })
    }
  }

  const renderTraining = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => onTrainingDetail(item)}
        style={__styles.cardView}>

        <View>
          <ResponsiveImage2
            uri={S3_URL + item?.program_images?.thumbnail_1}
            width={utilities.screenWidth() - 20}
          />
          {item?.locked_status &&
            <View style={__styles.lockedBackdrop}>
              <View style={__styles.lockedView}>
                {(!!item?.program_lock_icon || item?.locked_program_info?.image) &&
                  <MyImage
                    source={{ uri: !!item?.program_lock_icon ? S3_URL + item?.program_lock_icon : S3_URL + item?.locked_program_info?.image }}
                    style={__styles.lockImg}
                  />}
                <View style={{ marginLeft: 10, maxWidth: "70%" }}>
                  <MyText color={colors.primary} type='medium' >
                    {!!item?.program_lock_statement ? item?.program_lock_statement : "locked"}
                  </MyText>
                </View>
              </View>
            </View>}
        </View>
        <View style={__styles.textView}>
          <MyText color={colors.primary} type='bold' fontSize={18} >{item?.title}</MyText>
          <View style={{ marginTop: 5 }}>
            <MyText>{item?.short_description}</MyText>
          </View>
          <View style={{ marginTop: 10 }}>
            <MyText type='medium' color={colors.lightText} >{item?.no_of_lesson + " Modules | " + item?.total_lesson_duration}</MyText>
          </View>
        </View>



      </Pressable>
    )
  }

  const listHeader = () => {
    return (
      <View style={{backgroundColor:colors.darkSecondary,paddingBottom:5}}>
        <SearchView
          onChangeText={(text) => setSearchText(text)}
          onSearchPress={onSearchPress}
          loader={loaders?.searching}
          search={searchText}
        />
      </View>)
  }
  return (
    <RootView
      title={title}
      subTitle={`Showing ${list.length} of ${total}`}
      hideBackBottomButton>
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          renderItem={renderTraining}
          keyExtractor={(item, index) => item?._id + index}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          ListEmptyComponent={!loader && <EmptyView />}
          onEndReached={onEndReached}
          refreshControl={<MyRefreshControl
            refreshing={loaders?.refreshing}
            onRefresh={onRefresh}
          />}
          ListHeaderComponent={listHeader()}
          stickyHeaderHiddenOnScroll={true}
          stickyHeaderIndices={[0]}
          ListFooterComponent={<FooterLoader isVisible={loaders?.pagination} />}
        />
      </View>
      <MyLoader enable={loaders?.overall} />
    </RootView>
  )
}

export default TrainingList

const __styles = StyleSheet.create({
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
  lockedView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    padding: 5,
    minHeight: 40
  },
  lockedBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  }
})