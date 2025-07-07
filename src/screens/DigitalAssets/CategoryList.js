
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { GET_ASSETS_CATEGORY_LIST, } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import utilities from '../../utilities'
import { colors } from '../../utilities/colors'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import routes from '../../navigation/routes'


const CategoryList = ({ navigation, route }) => {
  const { token,S3_URL } = useSelector(selectUser);
  const { parentValue, value, } = route?.params;
  const { navbar } = useSelector(selectNavbar)
  const [title] = useState(navbar?.find(x => x.value == parentValue)?.child_options?.find(y => y.value == value)?.title);
  const [list, setList] = useState([])
  const [loader, setLoader] = useState(true)
  const [width] = useState(utilities.screenWidth())
  useEffect(() => {
    getDataFromServer()
  }, []);


  const getDataFromServer = async () => {
    let res = await GET_ASSETS_CATEGORY_LIST({ navigation, token });
    if (res.code == 200) {
      setList(res?.asset_categories)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const renderRecordings = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => navigation.navigate(routes.digitalAssetByCategoryScreen, {
          catId: item?._id
        })}
        style={__styles.itemView}>
        <ResponsiveImage2
          uri={S3_URL + item?.category_image?.thumbnail_1}
        />
        <View style={__styles.header}>
          <MyText isHeading >{item?.title}</MyText>
          <View style={{ marginTop: 10 }}>
            <MyText>{item?.short_description}</MyText>
          </View>
        </View>
      </Pressable>
    )
  }


  return (
    <RootView
      title={title +" Categories"}
      subTitle={`Total : ${list.length}`}
      hideBackBottomButton
    >
      <View style={{ flex: 1 }} >


        <FlatList
          data={list}
          renderItem={renderRecordings}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        />

      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default CategoryList;

const __styles = StyleSheet.create({
  itemView: {
    marginTop: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    padding: 10
  },
  subView: {
    marginTop: 10,
    paddingHorizontal: 10
  }

})