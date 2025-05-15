import { View, Text, FlatList, StyleSheet, Pressable, SectionList } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { GET_ASSETS_CATEGORY_LIST, GET_TECH_CATEGORY_LIST, } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import utilities from '../../utilities'
import { S3_URL, } from '../../utilities/constants'
import { colors } from '../../utilities/colors'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import routes from '../../navigation/routes'


const Helptechlist = ({ navigation, route }) => {
  const { token } = useSelector(selectUser);
  const { value, parentValue } = route?.params;
  const { navbar } = useSelector(selectNavbar)
  const [title] = useState(navbar?.find(x => x.value == parentValue)?.child_options?.find(y => y.value == value)?.title);
  const [list, setList] = useState([])
  const [loader, setLoader] = useState(true)
  const [width] = useState(utilities.screenWidth())
  useEffect(() => {
    getDataFromServer()
  }, []);


  const getDataFromServer = async () => {
    let res = await GET_TECH_CATEGORY_LIST({ navigation, token });
    if (res.code == 200) {
      let arr = []
      res.help_video_category.forEach((x, i) => {
        arr.push({
          data: x.help_videos,
          title: x.title,
          _id: x._id
        })
      })
      setList(arr)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const onHelpTechDetailScreen = (item) => {
    navigation.navigate(routes.helptechDetailScreen, {
      category: item
    })
  }

  const renderTutorials = ({ item, index }) => {
    return (
      <Pressable onPress={() => onHelpTechDetailScreen(item)}
        style={__styles.itemView} >
        <ResponsiveImage2
          uri={S3_URL + item.image.thumbnail_1}
          width={width - 20}
        />
        <View style={{ padding: 10 }} >
          <MyText isHeading>{item.title}</MyText>
          {!!item?.short_description &&
            <MyText >
              {item?.short_description}
            </MyText>}
        </View>
      </Pressable>)
  }



  return (
    <RootView
      title={title}
      subTitle={`Total : ${list.length}`}
      hideBackBottomButton
    >
      <View style={{ flex: 1 }} >


        <SectionList
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{ paddingBottom: 30 }}
          // refreshControl={
          //   <MyRefreshControl
          //     refreshing={refreshing}
          //     onRefresh={() => {
          //       // this.setState({ refreshing: true })
          //       // this.api_tutorialList();
          //     }}
          //     tintColor={colors.pt}
          //   />
          // }

          sections={list}
          renderSectionHeader={({ section }) => {
            return (<MyText type='bold' fontSize={18}
              style={__styles.header}
            >{section.title}</MyText>)
          }}
          renderItem={renderTutorials}

        />

      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default Helptechlist;

const __styles = StyleSheet.create({
  itemView: {
    marginTop: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    backgroundColor: colors.darkSecondary,
    paddingBottom: 5
  }

})