import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import MyLoader from '../../components/MyLoader'
import { POD_DELEGATE_DETAIL } from '../../DAL'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import MyWebview from '../../components/MyWebview'
import { MyButton } from '../../components/MyButton'
import openUrl from '../../functions/openUrl'
import { icons } from '../../utilities/icons'
import copyText from '../../functions/copyText'
import { color } from 'react-native-reanimated'
import { colors } from '../../utilities/colors'

const DynamitePodDetail = ({ navigation, route }) => {
  const { slug } = route?.params
  const { token, S3_URL } = useSelector(selectUser);
  const [pod, setPod] = useState(null)
  const [loader, setLoader] = useState(true);


  useEffect(() => {
    getDynamitePodDetailfromServer()
  }, [])


  //! API
  const getDynamitePodDetailfromServer = async () => {
    setLoader(true)
    let res = await POD_DELEGATE_DETAIL({ navigation, token, slug })
    if (res.code == 200) {
      // showToast({ title: res?.message, type: 'success' });
      setPod(res?.room)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }



  return (
    <RootView>
      {!!pod && (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            {!!pod?.room_image?.thumbnail_1 &&
              <ResponsiveImage2
                uri={S3_URL + pod?.room_image?.thumbnail_1}
              />}


            {!!pod?.short_description &&
              <View style={{ marginTop: 10 }}>
                <MyWebview html={pod?.short_description}
                />
              </View>}

            {(!!pod?.password || !!pod?.zoom_link) &&
              <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>

                {!!pod?.zoom_link &&
                  <MyButton
                    onPress={() => openUrl(pod?.zoom_link)}
                    title={"Join Meeting"}
                    invert
                    style={{ paddingHorizontal: 20, height: 35, borderRadius: 5 }}
                  />}
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  {!!pod?.password &&
                    <MyButton
                      onPress={() => copyText(pod?.password, "Password Copied")}
                      leftIcon={icons.lock}
                      title={" " + pod?.password}
                      invert
                      style={{ paddingHorizontal: 20, height: 35, borderRadius: 100 }}
                    />}
                </View>
              </View>}

            {!!pod?.detail_description &&
              <View style={{ marginTop: 10 }}>
                <MyWebview html={pod?.detail_description}
                />
              </View>}


          </View>
        </ScrollView>
      )}
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default DynamitePodDetail
