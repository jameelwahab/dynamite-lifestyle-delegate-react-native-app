import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import MyLoader from '../../components/MyLoader'
import { GET_PODS_LIST_FOR_DELEGATE } from '../../DAL'
import { selectUser } from '../../redux/reducers/userSlice'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import utilities from '../../utilities'
import MyWebview from '../../components/MyWebview'
import EmptyView from '../../components/EmptyView'
import { colors } from '../../utilities/colors'
import SearchView from '../../components/SearchView'
import routes from '../../navigation/routes'

const DynamitePods = ({ navigation, route }) => {
  const { key } = route?.params
  const { token, S3_URL } = useSelector(selectUser);
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x._id == key)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState("")


  useEffect(() => {
    getDynamitePodsfromServer()
  }, [])


  const onPodDetailScreen = (slug) => {
    navigation.navigate(routes.dynamitePodDetailScreen, {
      slug
    })
  }

  const searchInList = (list) => {
    if (searchText.trim() == "") {
      return list;
    } else {
      return list.slice().filter(x => {
        let textForSearch = (x?.title).toLowerCase();
        let textToSearch = searchText.toLowerCase();
        return textForSearch.includes(textToSearch)
      })

    }
  }


  //! API
  const getDynamitePodsfromServer = async () => {
    setLoader(true)
    let res = await GET_PODS_LIST_FOR_DELEGATE({ navigation, token })
    if (res.code == 200) {
      // showToast({ title: res?.message, type: 'success' });
      setList(res?.room)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }



  const renderPods = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => onPodDetailScreen(item?.room_slug)}
        style={__styles.itemView}>
        <View style={{}}>
          <ResponsiveImage2
            uri={S3_URL + item?.room_image?.thumbnail_2}
            width={utilities.screenWidth() - 20}
          />


          <View style={{ padding: 10 }}>
            <MyText fontSize={18} type='bold' color={colors.primary} >{item?.title}</MyText>
            {!!item?.short_description &&
              <View >
                <MyWebview html={item?.short_description} />
              </View>}
          </View>
        </View>

      </Pressable>
    )
  }

  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary, paddingBottom: 5, paddingHorizontal: 1 }}>
        <SearchView
          hideBtn
          search={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
    )
  }

  return (
    <RootView hideBackBottomButton title={title}
      subTitle={`Total : ${list.length}`}>
      <View style={{ flex: 1 }}>
        <FlatList
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          ListHeaderComponent={headerView()}
          data={searchInList(list)}
          renderItem={renderPods}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView />}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default DynamitePods

const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    // padding: 10,
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  menuBtn: {
    position: "absolute",
    top: 5,
    right: 5
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  statusView: {
    // paddingVertical: 5,
    // paddingHorizontal: 15,
    height: 25,
    paddingHorizontal: 10,
    // minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    alignSelf: "flex-start"
  },

  topView: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.darkSecondary, paddingBottom: 5
  },
  topBtnsView: {
    flexDirection: "row",
    alignItems: "flex-end",

  },

  sortBtn: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: "center",
    marginLeft: 5
  }
})
