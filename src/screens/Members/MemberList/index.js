import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import invokeApi from '../../../functions/invokeAPI'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { LIST_OF_MEMBERS } from '../../../DAL'
import { colors } from '../../../utilities/colors'
import numFormatter from '../../../DAL/numFormatter'
import UserImage from '../../../components/UserImage'
import { icons } from '../../../utilities/icons'
import MyLoader from '../../../components/MyLoader'
import routes from '../../../navigation/routes'
import StatView from '../Components/StatView'

const MemberList = ({ navigation }) => {
  const { token, user } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([]);

  const getMembers = async () => {
    let res = await LIST_OF_MEMBERS({ token, navigation, page: 0, searchText: '', body: {} });
    if (res.code == 200) {
      setList(res?.member)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const onMemberDetail = (item) => {
    navigation.navigate(routes.memberDetails, {
      member: item
    })
  }


  const renderMemberList = ({ item, index }) => {
    return (
      <View style={__styles.memberRootView}>

        <View style={__styles.memberProfileView}>
          <View>
            <UserImage
              image={item?.profile_image}
              name={item?.first_name}
              size={30} />
            <View style={[{ backgroundColor: item?.is_online ? colors.online : colors.primary2, }, __styles.memberStatusView]} />
          </View>

          <View style={__styles.memberProfileNameView}>
            <MyText fontSize={14} type='bold'>{item?.first_name + " " + item?.last_name}</MyText>
            <MyText fontSize={12} >{item?.email}</MyText>
          </View>

          <TouchableOpacity>
            {icons.message(colors.primary, 20)}
          </TouchableOpacity>

        </View>

        <View>
          <StatView title={"Reffered User"} value={!!item?.affliliate ?
            item?.affliliate?.affiliate_user_info?.first_name + " " + item?.affliliate?.affiliate_user_info?.last_name + " (" + item?.affliliate?.affiliate_url_name + ") " : "Master Link"} />
          <StatView title={"Nurture"} value={!!item?.nurture ? item?.nurture?.first_name + " " + item?.nurture?.last_name : "N/A"} />
          <StatView title={"Delegate"} value={!!item?.consultant ? item?.consultant?.first_name + " " + item?.consultant?.last_name : "N/A"} />
          <StatView title={"Community Level"} value={item?.community_level} />
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={() => onMemberDetail(item)}
            style={{ padding: 5, marginTop: 10 }}>
            <MyText color={colors.primary} type='medium' >View More...</MyText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }



  useEffect(() => {
    getMembers()
  }, [])


  return (
    <RootView title='All Members' hideBackBottomButton>
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          renderItem={renderMemberList}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default MemberList


const __styles = StyleSheet.create({
  memberRootView: { backgroundColor: colors.secondary, marginTop: 10, borderRadius: 10, padding: 10 },
  memberProfileView: { flexDirection: "row", alignItems: "center" },
  memberStatusView: { position: "absolute", bottom: 0, right: 0, height: 10, width: 10, borderRadius: 10 / 2, },
  memberProfileNameView: { flex: 1, marginLeft: 10 },
})