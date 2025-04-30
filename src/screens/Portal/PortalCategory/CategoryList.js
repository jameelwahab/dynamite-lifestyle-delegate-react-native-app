import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { selectUser } from '../../../redux/reducers/userSlice';
import { useSelector } from 'react-redux';
import { PORTAL_CATEGORY_DELETE, PORTAL_CATEGORY_LISTING, } from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import MyText from '../../../components/MyText';
import StatView from '../../Members/Components/StatView';
import { colors } from '../../../utilities/colors';
import MyImage from '../../../components/MyImage';
import { MenuButton } from '../../../components/MyButton';
import OptionModal from '../../../components/OptionModal';
import { icons } from '../../../utilities/icons';
import ConfirmationModal from '../../../components/ConfirmationModal';
import EmptyView from '../../../components/EmptyView';
import routes from '../../../navigation/routes';
import FAB from '../../../components/FAB';
import ImageZoomer from '../../../components/ImageZoomer';



const CategoryList = ({ navigation, route }) => {
   const { eventId, slug } = route?.params;
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([]);
  const [imageForZoom, setImageForZoom] = useState("")
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
      if (opt.type == "video") {
        onVideoScreen(item)
      }
      else if (opt.type == "edit") {
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


  const onVideoScreen = (item) => {
    navigation.navigate(routes?.portalVideoList, {
      eventId, slug, catId: item?._id
    })
  }

  const onAddEditScreen = (item) => {
    navigation.navigate(routes?.portalAddEditCategory, {
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
    if (type == "delete") {
      deleteCategoryFromServer(item.dynamite_event_category_slug);
    }
    setConfirmModal({ isVisible: false, selectedItem: null, title: "", type: "" })
  }

  const getDataFromServer = async () => {
    let res = await PORTAL_CATEGORY_LISTING({ navigation, token, eventId });
    if (res.code == 200) {
      setList(res?.dynamite_event_category_list);
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const deleteCategoryFromServer = async (slug) => {
    setLoader(true);
    let res = await PORTAL_CATEGORY_DELETE({ navigation, token, slug });
    if (res.code == 200) {

      setList((list) => {
        return list.filter(x => x.dynamite_event_category_slug != slug)
      });
      setLoader(false)
    } else {
      setLoader(false)
    }
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
          <MyText color={colors.primary} >{index + 1}. </MyText>
          <MenuButton
            onPress={() => setOptionModal({ isVisible: true, selectedItem: item })}
          />
        </View>
        <StatView title={"Title"} value={item?.title} />
        <StatView title={"Order"} value={item?.order} />
        <StatView title={"Status"} view={() => statusView(item?.status)} />
      </View>)
  }


  return (
    <RootView title='Dynamite Event Categories' >
      <View style={{ flex: 1 }}>
        <FlatList
        
          data={list}
          renderItem={renderList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView />}
          contentContainerStyle={{ paddingBottom: 50 }}
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

export default CategoryList

const __styles = StyleSheet.create({
  itemRootView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  itemHead: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  itemImage: { height: 50, width: 50, borderRadius: 50 / 2, overflow: "hidden" }
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
  },
  {
    icon: () => icons.edit(colors.primary, 17),
    title: "Videos",
    type: "video"
  }]
