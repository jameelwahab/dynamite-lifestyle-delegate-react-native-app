import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import MyText from '../../components/MyText'
import RootView from '../../components/RootView'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { DELETE_PORTAL_EVENT, GET_PORTAL_LIST, DUBLICATE_PORTAL_EVENT, GET_MY_RECORDING_LIST, RECORDING_DELETE } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import { S3_URL } from '../../utilities/constants'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import { colors } from '../../utilities/colors'
import routes from '../../navigation/routes'
import FAB from '../../components/FAB'
import OptionModal from '../../components/OptionModal'
import { MenuButton } from '../../components/MyButton'
import { icons } from '../../utilities/icons'
import ConfirmationModal from '../../components/ConfirmationModal'
import MyWebview from '../../components/MyWebview'
import showToast from '../../functions/showToast'
import SearchView from '../../components/SearchView'

const PortalListing = ({ navigation, route }) => {
  const { key } = route?.params;
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const [title] = useState(navbar?.find(x => x.value == key)?.title);
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState("");
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
    getDataFromServer()
  }, [route]);



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
            title: "Are you sure you want to delete this recording?",
            type: opt.type
          })
        }, 200);
      }


    }, 200);
  }

  const onAgree = () => {
    let { selectedItem: item, type } = confirmModal;
    if (type == "delete") {
      deletePortalEventFromServer(item.recording_slug);
    }
    setConfirmModal({ isVisible: false, selectedItem: null, title: "", type: "" })
  }

  const getDataFromServer = async () => {
    let res = await GET_MY_RECORDING_LIST({ navigation, token });
    if (res.code == 200) {
      setList(res?.recording)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }


  const deletePortalEventFromServer = async (slug) => {
    setLoader(true);
    let res = await RECORDING_DELETE({ navigation, token, slug });
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
      setList((list) => {
        return list.filter(x => x.recording_slug != slug)
      });
      setLoader(false)
    } else {
      setLoader(false)
    }
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


  const onPortalDetailScreen = (item) => {
    navigation.navigate(routes?.myRecordingsDetail, {
      recording: item,
    })
  }

  const onAddEditScreen = (item) => {
    navigation.navigate(routes?.myRecordingsAddEdit, {
      item,
      backScreenFunc: ammendList
    })
  }

  const serachInList = (list) => {
    if (searchText.trim() == "") {
      return list;
    } else {
      let textToSearch = searchText.toLowerCase().trim();
      return list.slice().filter(x => x.title.toLowerCase().includes(textToSearch))
    }
  }


  const renderEvent = useCallback(({ item, index }) => {
    return (
      <Pressable
        onPress={() => onPortalDetailScreen(item)}
        style={__style.itemView}>
        {!!item?.recording_image &&
          <ResponsiveImage2
            uri={S3_URL + item?.recording_image?.thumbnail_1}
          />}

        <View style={__style.itemSecondaryView}>
          <View style={__style.itemTitleView}>
            <MyText color={colors.primary} fontSize={18} type='bold' >{item?.title}</MyText>
          </View>
          {!!item?.short_description &&
            <View style={__style.itemDescriptionView}>
              <MyWebview html={item?.short_description} />
            </View>}
          <View style={__style.dateAndStatusView}>
            <MyText color={colors.lightText} fontSize={14} type='bold' >{item?.recording_date}</MyText>

            <View style={[{ backgroundColor: item?.status ? colors.online : colors.delete, }, __style.statusView]}>
              <MyText  >{item?.status ? "ACTIVE" : "INACTIVE"}</MyText>
            </View>
          </View>
        </View>
        <MenuButton
          onPress={() => setOptionModal({ isVisible: true, selectedItem: item })}
          style={__style.menuBtn} />
      </Pressable>

    )
  }, [JSON.stringify(list)])

  const searchView = () => {
    return (
      <View style={{ paddingHorizontal: 5, backgroundColor: colors.darkSecondary, paddingBottom: 5 }}>
        <SearchView
          search={searchText}
          onChangeText={(text) => setSearchText(text)}
          hideBtn
        />
      </View>
    )
  }

  return (
    <RootView
      title={title}
      subTitle={`Total : ${list.length}`}
      hideBackBottomButton>
      <View style={{ flex: 1 }}>

        <FlatList
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          ListHeaderComponent={searchView()}
          data={serachInList(list)}
          renderItem={renderEvent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
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
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default PortalListing

const __style = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 15
  },
  itemSecondaryView: {
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  itemTitleView: {

  },
  itemDescriptionView: {
    marginTop: 10
  },
  menuBtn: {
    position: "absolute",
    right: 10,
    top: 10
  },
  statusView: {
    paddingHorizontal: 10, paddingVertical: 2, borderRadius: 999
  },
  dateAndStatusView: { marginTop: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }
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
  }
]

