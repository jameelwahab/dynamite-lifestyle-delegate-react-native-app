import { View, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyLoader from '../../../components/MyLoader'
import { MEMBER_TICKETS_LIST } from '../../../DAL'
import { colors } from '../../../utilities/colors'
import StatView from '../Components/StatView'
import EmptyView from '../../../components/EmptyView'
import { icons } from '../../../utilities/icons'
import openUrl from '../../../functions/openUrl'
import FooterLoader from '../../../components/FooterLoader'
import MyInputs from '../../../components/MyInputs'
import debounce from '../../../functions/debounce'
import UserImage from '../../../components/UserImage'
import MyRefreshControl from '../../../components/MyRefreshControl'

let page = 0;
let canLoadMore = false

const MemberTickets = ({ navigation, route }) => {
  const { token, } = useSelector(selectUser);
  const [list, setList] = useState([])
  const [loader, setLoader] = useState(true)
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchText, setSearchText] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const getSubscriptionListFromServer = async (firstTime = false) => {
    try {


      let res = await MEMBER_TICKETS_LIST({ token, navigation, transId: route?.params?.transactionId })
      if (res.code == 200) {
        let listLength = firstTime ? (0 + res?.transaction?.tickets.length) : (list.length + res?.transaction?.tickets.length);
        if (res?.total_count > listLength) {
          page = page + 1;
          canLoadMore = true
        } else {
          canLoadMore = false
        }
        setList(firstTime ? res?.transaction?.tickets : [...list, ...res?.transaction?.tickets])
        // setTotal(res?.total_count || res?.transaction?.tickets.length)
        // setMember(res?.member)
        setLoader(false)
        setFooterLoader(false)
        setRefreshing(false)
      } else {
        setLoader(false)
        setFooterLoader(false)
        setRefreshing(false)
      }
    } catch (error) {
      console.log(error, "error")
    }
  }

  const onRefresh = () => {
    page = 0;
    canLoadMore = false;
    setRefreshing(true)
    getSubscriptionListFromServer(true)
  }

  useEffect(() => {
    page = 0;
    canLoadMore = false;
    setList([])
    setLoader(true)
    debounce(() => getSubscriptionListFromServer(true), 200)
  }, [searchText])



  const renderList = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: colors.secondary, borderRadius: 10, marginTop: 10, padding: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <MyText color={colors.primary} > {`${index + 1}.`}</MyText>

        </View>
        <StatView title={"First Name"} value={item?.first_name} />
        <StatView title={"Last Name"} value={item?.last_name} />
        <StatView title={"Email"} value={item?.email} />
        <StatView title={"Phone"} value={item?.contact_number} />
        <StatView title={"Venue"} value={item?.venue?.title} />

      </View>
    )
  }

  return (
    <RootView title='Tickets List' >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            refreshControl={
              <MyRefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            data={list}
            renderItem={renderList}
            ListEmptyComponent={!loader && <EmptyView />}
            // stickyHeaderHiddenOnScroll={true}
            // stickyHeaderIndices={[0]}
            // ListHeaderComponent={listHeaderView()}

            onEndReached={() => {
              if (canLoadMore) {
                canLoadMore = false;
                setFooterLoader(true)
                getSubscriptionListFromServer(false)
              }
            }}
            ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          />
        </View>
        <MyLoader enable={loader} />


      </View>
    </RootView>
  )
}



export default MemberTickets

