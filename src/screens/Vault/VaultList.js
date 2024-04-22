import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { GET_VAULT_LIST } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import WebPlayer from '../../components/WebPlayer'
import VimeoIFrame from '../../components/VimeoIFrame'
import utilities from '../../utilities'
import AudioPlayerForList from '../../components/AudioPlayerForList'
import { dateTimeFormat } from '../../utilities/constants'
import moment from 'moment'
import { colors } from '../../utilities/colors'
import { MyButton } from '../../components/MyButton'


const VaultList = ({ navigation, route }) => {
  const { token } = useSelector(selectUser);
  const { key } = route?.params;
  const { navbar } = useSelector(selectNavbar)
  const [title] = useState(navbar?.find(x => x.value == key)?.title);
  const [list, setList] = useState([])
  const [loader, setLoader] = useState(false)
  const [width] = useState(utilities.screenWidth())
  useEffect(() => {
    getDataFromServer()
  }, []);


  const getDataFromServer = async () => {
    let res = await GET_VAULT_LIST({ navigation, token });
    if (res.code == 200) {
      setList(res?.recording)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const renderRecordings = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <View style={__styles.header}>
          <View>
            <MyText fontSize={16} type='bold' >{item.title}</MyText>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <MyText>{moment(item.upload_date).format(dateTimeFormat.date)}</MyText>
          </View>
        </View>
        {item?.video_url.includes("vimeo") ?
          <VimeoIFrame url={item?.video_url} /> :
          <WebPlayer url={item?.video_url} width={width - 20} />}

        {!!item?.audio_recording &&
          <View style={__styles.subView}>
            <AudioPlayerForList
              url={item?.audio_recording}
              id={item?._id} />
          </View>}

        {!!item?.short_description &&
          <View style={__styles.subView}>
            <MyText>{item?.short_description}</MyText>
          </View>
        }

        {!!item?.program_info &&
          <View style={[__styles.subView, { alignSelf: "flex-start" }]}>
            <MyButton
              title={item?.program_info?.title}
              style={{ paddingHorizontal: 20, height: 35 }}
              invert
            />
          </View>
        }

        <View style={__styles.subView} />


      </View>
    )
  }


  return (
    <RootView
      title={title}
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

export default VaultList;

const __styles = StyleSheet.create({
  itemView: {
    marginTop: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10
  },
  header: {
    padding: 10
  },
  subView: {
    marginTop: 10,
    paddingHorizontal: 10
  }

})