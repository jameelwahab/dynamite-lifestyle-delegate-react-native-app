import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import invokeApi from '../../functions/invokeAPI'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { LIST_OF_MEMBERS } from '../../DAL'
import { colors } from '../../utilities/colors'
import numFormatter from '../../DAL/numFormatter'
import UserImage from '../../components/UserImage'
import { icons } from '../../utilities/icons'

const Members = ({ navigation }) => {
  const { token, user } = useSelector(selectUser);
  const [list, setList] = useState([]);
  const getMembers = async () => {
    let res = await LIST_OF_MEMBERS({ token, navigation, page: 0, searchText: '', body: {} });
    if (res.code == 200) {
      setList(res?.member)
    } else { }
  }

  const renderMemberList = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: colors.secondary, marginTop: 10, borderRadius: 10, padding: 10 }}>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View>
            <UserImage
              image={item?.profile_image}
              name={item?.first_name}
              size={30} />
            <View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: item?.is_online ? colors.online : colors.primary2, position: "absolute", bottom: 0, right: 0 }} />
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <MyText fontSize={14} type='bold'>{item?.first_name + " " + item?.last_name}</MyText>
            <MyText fontSize={12} >{item?.email}</MyText>
          </View>

          <TouchableOpacity>
            {icons.message(colors.primary, 20)}
          </TouchableOpacity>

        </View>

        <View>
          {statView("Coins", numFormatter(item?.coins_count))}
          {statView("Reffered User", !!item?.affliliate ?
            item?.affliliate?.affiliate_user_info?.first_name + " " + item?.affliliate?.affiliate_user_info?.last_name + " (" + item?.affliliate?.affiliate_url_name + ") " : "Master Link")}
          {statView("Nurture", !!item?.nurture ? item?.nurture?.first_name + " " + item?.nurture?.last_name : "N/A")}
          {statView("Delegate", !!item?.consultant ? item?.consultant?.first_name + " " + item?.consultant?.last_name : "N/A")}
          {statView("Community Level", item?.community_level)}
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity style={{ padding: 5, marginTop: 10 }}>
            <MyText color={colors.primary} type='medium' >View More...</MyText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const statView = (title, value) => {
    return (
      <View style={{ flexDirection: "row", marginTop: 10, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText, paddingBottom: 5 }}>
        <View style={{ flex: 0.7 }}>
          <MyText fontSize={12} color={colors.lightText2}>{title}</MyText>
        </View>
        <View style={{ flex: 1 }}>
          <MyText style={{ textTransform: "capitalize" }} fontSize={12} type='medium' >{value}</MyText>
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
    </RootView>
  )
}

export default Members