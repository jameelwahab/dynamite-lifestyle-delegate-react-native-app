import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { selectUser } from '../../../redux/reducers/userSlice';
import { useSelector } from 'react-redux';
import { PORTAL_DELETE_EVENT, PORTAL_EVENT_DELETE_MEMBER, PORTAL_EVENT_LIST, PORTAL_MEMBER_LISTING } from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import MyText from '../../../components/MyText';
import StatView from '../../Members/Components/StatView';
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


let page = 0;
let canLoadMore = false;
const MembersList = ({ navigation, route }) => {
  const { eventId, slug } = route?.params;
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [imageForZoom, setImageForZoom] = useState("");
  const [total, setTotal] = useState("");
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
  })

  const [confirmModal, setConfirmModal] = useState({
    isVisible: false,
    selectedItem: null,
    title: "",
    type: ''
  })

  useEffect(() => {
    callAPI();
  }, [route]);

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
      if (opt.type == "edit") {
        onAddEditScreen(item)
      } else if (opt.type == "delete") {
        setTimeout(() => {
          setConfirmModal({
            isVisible: true,
            selectedItem: item,
            title: "Are you sure you want to delete this event?",
            type: opt.type
          })
        }, 200);
      }
    }, 200);
  }

  const onAddEditScreen = (item) => {
    navigation.navigate(routes?.portalAddEditMembers, {
      eventId, slug, item,
      backScreenFunc: ammendList
    })
  }

  const ammendList = (item) => {
    let index = list.findIndex(x => x._id == item._id);
    if (index > -1) {
      list.splice(index, 1, item);
    } else {
      list.push(item);
    }
    setList([...list]);
  }

  const onAgree = () => {
    let { selectedItem: item, type } = confirmModal;
    console.log(item, "item")
    if (type == "delete") {
      deleteEventFromServer(item);
    }
    setConfirmModal({ isVisible: false, selectedItem: null, title: "", type: "" })
  }

  const getDataFromServer = async () => {
    let res = await PORTAL_MEMBER_LISTING({ navigation, token, eventId, page, searchText });
    if (res.code == 200) {
      let isFirstTime = page == 0;
      let totalItems = page == 0 ? res?.member.length : (list.length + res?.member.length);
      if (res?.total_member_count > totalItems) {
        canLoadMore = true;
        page += 1;
      } else {
        canLoadMore = false;
      }
      setTotal(res?.total_member_count)
      setList(isFirstTime ? res?.member : [...list, ...res?.member]);
      setLoader(false);
      setFooterLoader(false);
      setSearchLoader(false);

    } else {
      setFooterLoader(false);
      setLoader(false)
      setSearchLoader(false);
    }
  }

  const deleteEventFromServer = async (item) => {

    setLoader(true);
    let fd = new FormData();
    fd.append("member", item?._id)
    fd.append("dynamite_event", eventId)
    let res = await PORTAL_EVENT_DELETE_MEMBER({ navigation, token, formdata:fd, });
    if (res.code == 200) {
      setList((list) => {
        return list.filter(x => x._id != item?._id)
      });
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const loadMore = () => {
    console.log("onENd", canLoadMore, page)
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

  const statusView = (value) => {
    return (
      <View style={{ backgroundColor: value ? colors.green + "33" : colors.delete + "33", paddingHorizontal: 10, paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        <MyText type='medium' color={value ? colors.green : colors.delete} >{value ? "Active" : "Inactive"}</MyText>
      </View>)
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
          <StatView title={"Event Start Date"} value={moment(item?.event_start_date).format(dateTimeFormat.date)} />
          <StatView title={"Event Expiry Date"} value={moment(item?.event_expiry_date).format(dateTimeFormat.date)} />
          <StatView title={"Status"} view={() => statusView(item?.status)} />
        </View>
      </View>)
  }


  return (
    <RootView
      title='Dynamite Events Members'
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
          keyExtractor={(item)=>item?._id}
        />

      </View>


      <FAB onPress={() => onAddEditScreen()} />

      <OptionModal
        optionList={options}
        isVisible={optionModal?.isVisible}
        onSelected={onOptionSelected}
        closeModal={() => setOptionModal({ isVisible: false, selectedItem: null })}

      />

      <ConfirmationModal
        isVisible={confirmModal?.isVisible}
        closeModal={() => setConfirmModal({ isVisible: false, selectedItem: null, title: "", type: "" })}
        onAgree={onAgree}
        title={confirmModal?.title}
      />

      <ImageZoomer
        closeModal={() => setImageForZoom("")}
        url={imageForZoom}
        visible={!!imageForZoom}
      />

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default MembersList

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
    title: "Edit",
    type: "edit"
  },
  {
    icon: () => icons.trash(colors.primary, 17),
    title: "Delete",
    type: "delete"
  }]