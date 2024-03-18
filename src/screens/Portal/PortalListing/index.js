import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyText from '../../../components/MyText'
import RootView from '../../../components/RootView'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { GET_PORTAL_LIST } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { S3_URL } from '../../../utilities/constants'
import ResponsiveImage2 from '../../../components/ResponsiveImage2'
import { colors } from '../../../utilities/colors'
import routes from '../../../navigation/routes'

const EventListing = ({ navigation, route }) => {
  const { key } = route?.params
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const title = useState(navbar?.find(x => x.value == key)?.title);
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([])


  const getDataFromServer = async () => {
    let res = await GET_PORTAL_LIST({ navigation, token, });
    if (res.code == 200) {
      setList(res?.dynamite_events)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  useEffect(() => {
    getDataFromServer()
  }, [])


  const onPortalDetailScreen = (item) => {
    navigation.navigate(routes?.portalDetailScreen, {
      eventId: item?._id,
      feedFor:"event"
    })
  }


  const renderEvent = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => onPortalDetailScreen(item)}
        style={__style.itemView}>

        <ResponsiveImage2
          uri={S3_URL + item?.images?.thumbnail_1}
        />

        <View style={__style.itemSecondaryView}>
          <View style={__style.itemTitleView}>
            <MyText color={colors.primary} fontSize={18} type='bold' >{item?.title}</MyText>
          </View>
          <View style={__style.itemDescriptionView}>
            <MyText fontSize={14}>{item?.short_description}</MyText>
          </View>
        </View>
      </Pressable>
    )
  }


  return (
    <RootView title={title} hideBackBottomButton>
      <View style={{ flex: 1 }}>

        <FlatList
          data={list}
          renderItem={renderEvent}
        />


      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default EventListing

const __style = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 15
  },
  itemSecondaryView: {
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  itemTitleView: {

  },
  itemDescriptionView: {
    marginTop: 10
  }
})