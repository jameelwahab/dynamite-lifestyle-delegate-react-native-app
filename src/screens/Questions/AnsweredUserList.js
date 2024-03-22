import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import { selectUser } from '../../redux/reducers/userSlice';
import { useSelector } from 'react-redux';
import { GET_USER_LISTING_WHO_ASNWERED_BY_MODULE, PORTAL_DELETE_EVENT, PORTAL_EVENT_DELETE_MEMBER, PORTAL_EVENT_LIST, PORTAL_MEMBER_LISTING } from '../../DAL';
import MyLoader from '../../components/MyLoader';
import MyText from '../../components/MyText';
import { colors } from '../../utilities/colors';
import MyImage from '../../components/MyImage';
import { S3_URL, dateTimeFormat } from '../../utilities/constants';
import { MenuButton } from '../../components/MyButton';
import OptionModal from '../../components/OptionModal';
import { icons } from '../../utilities/icons';
import ConfirmationModal from '../../components/ConfirmationModal';
import EmptyView from '../../components/EmptyView';
import routes from '../../navigation/routes';
import FAB from '../../components/FAB';
import ImageZoomer from '../../components/ImageZoomer';
import UserImage from '../../components/UserImage';
import moment from 'moment';
import SearchView from '../../components/SearchView';
import FooterLoader from '../../components/FooterLoader';
import StatView from '../Members/Components/StatView';


let page = 0;
let canLoadMore = false;
const AnsweredUserList = ({ navigation, route }) => {
  const { _id, module } = route?.params;
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [total, setTotal] = useState("");
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
  })



  useEffect(() => {
    callAPI();
  }, []);

  const callAPI = () => {
    page = 0;
    canLoadMore = false;
    getDataFromServer()
  }

  const onSerachPress = () => {
    setSearchLoader(true);
    callAPI()
  }

  const onOptionSelected = (opt) => {
    let item = optionModal?.selectedItem;
    setOptionModal({ isVisible: false, selectedItem: null });
    setTimeout(() => {
      if (opt.type == "answers") {
        onAnswerScreen(item)
      }
    }, 200);
  }

  const onAnswerScreen = (item) => {
    navigation.navigate(routes.genericQestionListing, {
      created_for: module,
      id: "",
      memberId: item?.member_id
    })
  }


  const getDataFromServer = async () => {
    let res = await GET_USER_LISTING_WHO_ASNWERED_BY_MODULE({ navigation, token, page, search_text: searchText, created_for: module, created_for_id: _id });
    if (res.code == 200) {
      let isFirstTime = page == 0;
      let totalItems = page == 0 ? res?.members.length : (list.length + res?.members.length);
      if (res?.toal_count > totalItems) {
        canLoadMore = true;
        page += 1;
      } else {
        canLoadMore = false;
      }
      setTotal(res?.toal_count)
      setList(isFirstTime ? res?.members : [...list, ...res?.members]);
      setLoader(false);
      setFooterLoader(false);
      setSearchLoader(false);

    } else {
      setFooterLoader(false);
      setLoader(false)
      setSearchLoader(false);
    }
  }


  const loadMore = () => {
    if (canLoadMore && page != 0) {
      canLoadMore = false;
      setFooterLoader(true);
      getDataFromServer()
    }
  }

  const headerView = () => {
    return (
      <View style={__styles.headerView}>
        <SearchView
          loader={searchLoader}
          onChangeText={(text) => setSearchText(text)}
          search={searchText}
          onSearchPress={onSerachPress}
        />
      </View>
    )
  }

  const renderList = ({ item, index }) => {
    return (
      <View style={__styles.itemRootView}>
        <View style={__styles.itemHead} >
          <UserImage
            size={35}
            image={item?.profile_image}
            name={item?.first_name}
            backgroundTransparent
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <MyText type='medium' >{item?.first_name + " " + item?.last_name}</MyText>
            <MyText fontSize={12} color={colors.lightText}>{item?.email}</MyText>
          </View>
          <MenuButton
            onPress={() => setOptionModal({ isVisible: true, selectedItem: item })}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <StatView title={"Answered Date"} value={moment(item?.createdAt).format(dateTimeFormat.date)} />
        </View>

      </View>)
  }


  return (
    <RootView
      title='Questions Answers List'
      subTitle={`Showing ${list.length} of ${total}`}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={headerView()}
          stickyHeaderHiddenOnScroll={true}
          stickyHeaderIndices={[0]}
          data={list}
          renderItem={renderList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView />}
          contentContainerStyle={{ paddingBottom: 50 }}
          onEndReached={loadMore}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
        />

      </View>




      <OptionModal
        optionList={options}
        isVisible={optionModal?.isVisible}
        onSelected={onOptionSelected}
        closeModal={() => setOptionModal({ isVisible: false, selectedItem: null })}

      />



      <MyLoader enable={loader} />
    </RootView>
  )
}

export default AnsweredUserList

const __styles = StyleSheet.create({
  itemRootView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  itemHead: {
    flexDirection: "row",
    alignItems: "center"
  },
  itemImage: { height: 50, width: 50, borderRadius: 50 / 2, overflow: "hidden" },
  headerView: {
    paddingBottom: 10,
    backgroundColor: colors.darkSecondary
  }
})


const options = [
  {
    icon: () => icons.edit(colors.primary, 17),
    title: "Answers Detail",
    type: "answers"
  },]