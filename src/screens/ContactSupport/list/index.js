import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'
import { CONTACT_SUPPORT_TCIKETS_LIST_BY_TYPE } from '../../../DAL'
import MyText from '../../../components/MyText'
import UserImage from '../../../components/UserImage'
import { colors } from '../../../utilities/colors'
import moment from 'moment'

const List = ({ navigation }) => {
  const { token } = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);

  const getListOfTickets = async () => {
    setLoader(true)
    let formData = new FormData();
    formData.append('filter_by', 'all')
    let res = await CONTACT_SUPPORT_TCIKETS_LIST_BY_TYPE({ token, navigation, body: formData });
    if (res.code == 200) {
      setLoader(false)
      setList(res?.support_ticket)
    } else {
      setLoader(false)
    }
  }

  useEffect(() => {
    getListOfTickets()
  }, [])


  const renderTicketList = ({ item, index }) => {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ paddingLeft: 5, paddingRight: 10 }}>
          <MyText>{item?.reference_number}</MyText>
        </View>
        <View style={{ flexDirection: "row", paddingVertical: 10, }}>

          <UserImage
            size={35}
            name={"Amark"}
          />

          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={{ flexDirection: "row", }}>
              <MyText fontSize={16} type='medium' >{"Ammar Yousaf"}</MyText>
            </View>
            <MyText fontSize={12} >{item?.subject}</MyText>
            <MyText fontSize={12} numberOfLines={1} >{!!item?.department?.title ? item?.department?.title : "N/A"}</MyText>
          </View>

          <View>
            <MyText fontSize={10} >
              {moment(item.createdAt).fromNow()}
            </MyText>
          </View>

        </View>

      </View>
    )
  }



  return (
    <RootView hideBackBottomButton title='Support Tickets'>
      <View style={{ flex: 1 }}>

        <FlatList
          data={list}
          renderItem={renderTicketList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={<View style={{ height: 1 / 3, backgroundColor: colors.lightText }} />}
        />

      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default List