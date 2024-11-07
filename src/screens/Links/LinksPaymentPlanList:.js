import { View, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { GET_LINKS_PAYMENT_PLANS_LIST, } from '../../DAL'
import { colors } from '../../utilities/colors'
import StatView from '../../components/StatView'
import SearchView from '../../components/SearchView'
import TitleView from '../../components/TitleView'
import MyRefreshControl from '../../components/MyRefreshControl'
import EmptyView from '../../components/EmptyView'
import MyLoader from '../../components/MyLoader'
import MyText from '../../components/MyText'
import { MenuButton } from '../../components/MyButton'
import OptionModal from '../../components/OptionModal'
import routes from '../../navigation/routes'
import { icons } from '../../utilities/icons'




const TeamList = ({ navigation, route }) => {
  const { title, _id } = route?.params;
  const { token } = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState("")
  const [refreshing, setRefreshing] = useState(false);
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
  })

  useEffect(() => {
    setLoader(true)
    getTeamListFromServer(true)
  }, [])




  const onRefresh = () => {
    setRefreshing(true)
    getTeamListFromServer(true)
  }





  //! //////// API
  const getTeamListFromServer = async (newArray = false) => {
    let res = await GET_LINKS_PAYMENT_PLANS_LIST({
      token, navigation, pageId: _id
    });
    setLoader(false);
    setRefreshing(false);
    if (res.code == 200) {
      setList(res?.commission_info);
    }
  }


  const searchFromList = (list) => {
    if (searchText.trim() == "") {
      return list
    }
    return list.slice().filter(x => x?.plan_title.toLowerCase().includes(searchText.toLowerCase().trim()))
  }







  const memberListView = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 5 }}>
          <View style={{ flex: 1 }}>
            <MyText color={colors.primary} fontSize={16}>{`${index + 1}.`}</MyText>
          </View>
          <MenuButton
            onPress={() => setOptionModal({ isVisible: true, item })}
          />
        </View>
        <View style={{ paddingHorizontal: 5, paddingBottom: 5 }}>
          <StatView title={"Plan Title"} value={item?.plan_title} />
          <StatView title={"Plan Type"} value={item?.payment_access} />
        </View>
      </View>
    )
  }


  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>
        <SearchView
          onChangeText={(text) => setSearchText(text)}
          search={searchText}
          hideBtn
        />
      </View>
    )
  }


  const topView = () => {
    return (
      <View>
        <View style={__styles.topView}>
          <TitleView
            title={"Payment Plans"}
            subTitle={`${title}`}
          />
        </View>
      </View>
    )
  }


  return (
    <RootView hideSubHeader>
      {topView()}
      <View style={{ flex: 1 }}>
        <FlatList
          refreshControl={<MyRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
          ListEmptyComponent={!loader && <EmptyView label={"No Commission Found!"} />}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          ListHeaderComponent={headerView()}
          data={searchFromList(list)}
          renderItem={memberListView}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id}

        />
      </View>

      <MyLoader enable={loader} />


      <OptionModal
        optionList={optList}
        isVisible={optionModal?.isVisible}
        closeModal={() => setOptionModal({ isVisible: false, item: null })}
        onSelected={(opt) => {
          let { item } = optionModal
          setOptionModal({ isVisible: false, item: null })
          if (opt.key == "set_commission") {
            navigation.navigate(routes?.linksManageSaleTeamCommission, {
              pageId: _id,
              planId: item?._id,
              salePageTitle: title,
              planTitle: item?.plan_title
            })
          }
        }}
      />

    </RootView>
  )
}

export default TeamList
const optList = [{
  key: "set_commission",
  title: "Manage Sales Team Commission",
  icon: icons.edit
}]



const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 5,
    marginTop: 10

  },
  topView: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.darkSecondary, paddingBottom: 5
  },
  topBtnsView: { flexDirection: "row", alignItems: "flex-end", },

  sortBtn: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: "center",
    marginLeft: 5
  }
})