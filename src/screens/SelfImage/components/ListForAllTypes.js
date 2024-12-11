import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { selectUser } from '../../../redux/reducers/userSlice';
import { useSelector } from 'react-redux';
import { GET_USER_LISTING_WHO_ASNWERED_BY_MODULE, PORTAL_DELETE_EVENT, PORTAL_EVENT_DELETE_MEMBER, PORTAL_EVENT_LIST, PORTAL_MEMBER_LISTING, SELF_IMAGE_INCOMPLETE, SELF_IMAGE_RESPONDED_MEMBER_LIST, SELF_IMAGE_SAVE_AND_CLOSE } from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import MyText from '../../../components/MyText';
import { colors } from '../../../utilities/colors';
import MyImage from '../../../components/MyImage';
import { S3_URL, dateTimeFormat } from '../../../utilities/constants';
import { MenuButton } from '../../../components/MyButton';
import OptionModal from '../../../components/OptionModal';
import { icons } from '../../../utilities/icons';
import ConfirmationModal from '../../../components/ConfirmationModal';
import EmptyView from '../../../components/EmptyView';
import routes from '../../../navigation/routes';
import FAB from '../../../components/FAB';
import ImageZoomer from '../../../components/ImageZoomer';
import UserImage from '../../../components/UserImage';
import moment from 'moment';
import SearchView from '../../../components/SearchView';
import FooterLoader from '../../../components/FooterLoader';
import StatView from '../../../components/StatView';
import { selectNavbar } from '../../../redux/reducers/navbarSlice';
import MyRefreshControl from '../../../components/MyRefreshControl';
import showToast from '../../../functions/showToast';




let page = 0;
let canLoadMore = false;
const ListForAllTypes = ({ navigation, route }) => {
  const { _id, module, type, parentKey, key } = route?.params;
  const isComplete = type == "completed";
  const isIncomplete = type == "incompleted";
  const isResponded = type == "responded";
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x._id == parentKey)?.title);
  const [subTitle] = useState(navbar?.find(x => x._id == parentKey)?.child_options?.find(y => y._id == key)?.title);
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [total, setTotal] = useState("");
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isVisible: false, item: null, statement: "", type: "" });
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

  const onRefresh = () => {
    setRefreshing(true)
    callAPI()
  }

  const onSerachPress = () => {
    setSearchLoader(true);
    callAPI()
  }

  const onSelected = (opt) => {
    let { selectedItem: item } = optionModal;
    setOptionModal({ isVisible: false, item: null });
    setTimeout(() => {
      if (opt.key == "save") {
        setConfirmModal({
          isVisible: true, item, type: opt.key,
          statement: "Are you sure you want save and notify user?"
        })
      } if (opt.key == "close") {
        setConfirmModal({
          isVisible: true, item, type: opt.key,
          statement: "Are you sure you want close?"
        })
      } else if (opt.key == "incomplete") {
        setConfirmModal({
          isVisible: true, item, type: opt.key,
          statement: "Are you sure you want to mark this incomplete?"
        })
      } else if (opt.key == "detail") {
        onAnswerScreen(item)
      }
    }, 500);

  }

  const onConfirmPress = () => {
    let { type, item } = confirmModal;
    setConfirmModal({ isVisible: false, item: null, statement: "", type: "" });
    if (type == "incomplete") {
      incompleteFromServer(item)
    }
    // else if (type == "reminder") {
    //   sendReminder(item)
    // } 
    else if (type == "save") {
      SaveAndCompleteFromServer(item, true)
    }
    else if (type == "close") {
      SaveAndCompleteFromServer(item, false)
    }
  }

  const onAnswerScreen = (item) => {
    let obj = {
      created_for: item?.created_for,
      id: "",
      memberId: item?.member_id,
      type: type
    };
    navigation.navigate(routes.selfImageDetail, obj)
  }


  //!  APIs



  const getDataFromServer = async () => {
    let res = await GET_USER_LISTING_WHO_ASNWERED_BY_MODULE({ navigation, token, page, search_text: searchText, created_for: module, created_for_id: _id, type });
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
      setRefreshing(false)

    } else {
      setFooterLoader(false);
      setLoader(false)
      setSearchLoader(false);
      setRefreshing(false)
    }
  }

  const SaveAndCompleteFromServer = async (member, isNotify) => {
    setLoader(true);
    let res = await SELF_IMAGE_SAVE_AND_CLOSE({ navigation, token, memberId: member?.member_id, isNotify })
    if (res.code == 200) {
      showToast({ type: 'success', title: res.message });
      setList((old) => old.filter(x => x._id != member?._id))
      setLoader(false)
      setRefreshing(false)
      setSearchLoader(false)
      setFooterLoader(false)
    } else {
      setLoader(false)
      setRefreshing(false)
      setSearchLoader(false)
      setFooterLoader(false)
    }
  }

  const incompleteFromServer = async (member) => {
    setLoader(true);
    let res = await SELF_IMAGE_INCOMPLETE({ navigation, token, memberId: member?.member_id })
    if (res.code == 200) {
      showToast({ type: 'success', title: res.message });
      setList((old) => old.filter(x => x._id != member?._id))
      setLoader(false)
      setRefreshing(false)
    } else {
      setLoader(false)
      setRefreshing(false)
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

  const statusView = (value, yes, no) => {
    return (
      <View style={{ backgroundColor: value ? colors.green + "33" : colors.delete + "33", paddingHorizontal: 10, paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        <MyText type='medium' capitalize color={value ? colors.green : colors.delete} >{value ? yes : no}</MyText>
      </View>)
  }

  const renderList = ({ item, index }) => {
    return (
      <View style={__styles.itemRootView}>
        <Pressable
          onPress={() => onAnswerScreen(item)}
          style={__styles.itemHead} >
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
        </Pressable>
        <View style={{ marginTop: 10 }}>
          <StatView title={"Status"} view={() => statusView(item?.self_image_status == "completed" || item?.self_image_status == "responded", "completed", "incomplete")} />
          {!isIncomplete && <StatView title={"Completed Date"} value={moment(item?.self_image_completed_date).format(dateTimeFormat.date)} />}
        </View>

      </View>)
  }


  return (
    <RootView
      title={title}
      subTitle={`${subTitle} | Showing ${list.length} of ${total}`}
      hideBackBottomButton
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
          refreshControl={<MyRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
        />

      </View>




      <OptionModal
        optionList={isComplete ? optionsListForComplete : optionsListForother}
        isVisible={optionModal?.isVisible}
        onSelected={onSelected}
        closeModal={() => setOptionModal({ isVisible: false, selectedItem: null })}

      />

      <ConfirmationModal
        isVisible={confirmModal?.isVisible}
        closeModal={() => setConfirmModal({ isVisible: false, item: null, statement: "", type: "" })}
        onAgree={onConfirmPress}
        title={confirmModal.statement}
      />

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default ListForAllTypes

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


const optionsListForComplete = [
  {
    title: "Detail",
    key: "detail",
    icon: icons.edit
  },
  {
    title: "Close",
    key: "close",
    icon: icons.edit
  },
  {
    title: "Save & Notify",
    key: "save",
    icon: icons.edit
  },




  {
    title: "Incomplete",
    key: "incomplete",
    icon: icons.edit
  },
]

const optionsListForother = [
  {
    title: "Detail",
    key: "detail",
    icon: icons.edit
  },
]