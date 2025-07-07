import { View, Text, FlatList, StyleSheet, Pressable, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { GET_ASSETS_CATEGORY_LIST, GET_ASSETS_LIST_BY_CATEGORY, } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import utilities from '../../utilities'
import { colors } from '../../utilities/colors'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import routes from '../../navigation/routes'
import MyWebview from '../../components/MyWebview'
import openUrl from '../../functions/openUrl'


const ListByCategory = ({ navigation, route }) => {
  const { token,S3_URL } = useSelector(selectUser);
  const { catId } = route?.params;
  const [list, setList] = useState([])
  const [loader, setLoader] = useState(true);
  const [title, setTitle] = useState("");
  const [width] = useState(utilities.screenWidth())
  useEffect(() => {
    getDataFromServer()
  }, []);


  const getDataFromServer = async () => {
    let res = await GET_ASSETS_LIST_BY_CATEGORY({ navigation, token, categoryId: catId });
    if (res.code == 200) {
      setList(res?.assets)
      setTitle(res?.category?.title)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const openFile = (item) => {
    let link = "";
    if (item?.file_type == "image") {
      link = S3_URL + item?.assets_images_url?.thumbnail_1
    } else if (item?.file_type == "url") {
      link = item?.video_url
    } else {
      link = S3_URL + item?.assets_file_url
    }
    openUrl(link)
  }

  const renderRecordings = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <MyText fontSize={16} type='bold' >{item?.title}</MyText>

        {!!item?.short_description &&
          <View style={{ marginTop: 5 }}>
            <MyText fontSize={12} >{item?.short_description}</MyText>
          </View>}
        <View style={{ alignSelf: "flex-end", overflow: "hidden" }}>
          <TouchableHighlight
            underlayColor={colors.lightPrimary3}
            onPress={() => openFile(item)}>
            <View style={{ padding: 5, borderRadius: 20, paddingHorizontal: 10 }}>
              <MyText type='medium' color={colors.primary} >View</MyText>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }


  return (
    <RootView
      title={title}
      subTitle={`Total : ${list.length}`}
    >
      <View style={{ flex: 1 }} >


        <FlatList
          data={list}
          renderItem={renderRecordings}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          keyExtractor={(item) => item?._id}
        />

      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default ListByCategory;

const __styles = StyleSheet.create({
  itemView: {
    marginTop: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    overflow: "hidden",
    padding: 10
  },
  header: {
    padding: 10
  },
  subView: {
    marginTop: 10,
    paddingHorizontal: 10
  }

})