import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyText from '../../components/MyText'
import RootView from '../../components/RootView'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { selectUser } from '../../redux/reducers/userSlice'
import { GET_LINKS_LIST } from '../../DAL'
import OptionModal from '../../components/OptionModal'
import StatView from '../Members/Components/StatView'
import MyLoader from '../../components/MyLoader'
import { icons } from '../../utilities/icons'
import EmptyView from '../../components/EmptyView'
import { colors } from '../../utilities/colors'
import { MenuButton, MyButton } from '../../components/MyButton'
import copyText from '../../functions/copyText'
import { websiteBaseUrl } from '../../utilities/constants'
import openUrl from '../../functions/openUrl'

const LinksList = ({ navigation, route }) => {
  const { key } = route?.params;
  const { navbar } = useSelector(selectNavbar);
  const { token, user } = useSelector(selectUser);
  const [title] = useState(navbar?.find(x => x._id == key)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [affiliate, setAffiliate] = useState(null)
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
  })

  useEffect(() => {
    getDataFromServer()
  }, [])

  const onOptionSelected = (opt) => {
    let item = optionModal?.selectedItem;
    setOptionModal({ isVisible: false, selectedItem: null });
    setTimeout(() => {
      copy(item, opt.type)
    }, 200);
  }

  const getDataFromServer = async () => {
    let res = await GET_LINKS_LIST({ navigation, token, });
    if (res.code == 200) {
      setList(res?.sale_pages)
      setAffiliate(res?.affiliate_object?.affiliate_url_name)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const copy = (item, type) => {
    let link = ""
    let msg = ""
    if (type == "appointment") {
      link = websiteBaseUrl + item?.sale_page_title_slug + "/appointment";
      msg = "Appointment URL copied to clipboard"
    } else if (type == "main") {
      link = websiteBaseUrl + item?.sale_page_title_slug
      msg = "Preview URL copied to clipboard"
    }
    copyText(link, msg)
  }

  const linkActon = (item, action) => {
    let link = ""
    let msg = ""
    if (item?.type_of_page == "book_a_call_page") {
      link = websiteBaseUrl + item?.sale_page_title_slug + "/appointment/" + affiliate;
      msg = "Appointment URL copied to clipboard"
    } else if (item?.type_of_page == "sale_page") {
      link = websiteBaseUrl + item?.sale_page_title_slug + "/" + affiliate;
      msg = "Preview URL copied to clipboard"
    }

    if (action == "copy") {
      copyText(link, msg)
    } else if (action == "goto") {
      openUrl(link)
    }
  }

  const filter = (list) => {
    if (optionModal?.selectedItem?.type_of_page == "book_a_call_page") {
      return list
    } else {
      return list.slice().filter(x => x.type != "appointment")
    }
  }

  const copyView = (item) => (
    <TouchableOpacity
      onPress={() => linkActon(item, "copy")}
      style={__styles.copybtn} >
      <MyText color={colors.white} fontSize={12} type='medium'>
        {item?.type_of_page == "sale_page" ? "Copy Main URL " :
          item?.type_of_page == "book_a_call_page" ? "Copy Appointment URL " : ""}
      </MyText>
      {icons.copy(colors.primary, 15)}
    </TouchableOpacity>
  )

  const preview = (item) => (
    <TouchableOpacity
      onPress={() => openUrl(websiteBaseUrl + item?.sale_page_title_slug + "/" + affiliate)}
      style={__styles.previewBtn} >
      <MyText color={colors.primary} >
        {"Preview "}
      </MyText>
      {icons.goto(colors.primary, 15)}
    </TouchableOpacity>
  )


  const renderLinks = ({ item, index }) => {
    return (
      <View style={__styles.cardView}>
        <View style={__styles.headerView}>
          <MyText>{index + 1})</MyText>
          {/* <View /> */}

          <MenuButton
            onPress={() => setOptionModal({ isVisible: true, selectedItem: item })}
          />
        </View>
        <StatView title={"Page Title"} value={item?.sale_page_title} />
        <StatView title={"Copy Url"} view={() => copyView(item)} />
        <StatView title={"URL"} view={() => preview(item)} />
      </View>
    )
  }


  return (
    <RootView hideBackBottomButton
     title={title}
     subTitle={`Total: ${list.length}`}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          renderItem={renderLinks}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={!loader && <EmptyView />}
        />


      </View>


      <OptionModal
        optionList={filter(options)}
        isVisible={optionModal?.isVisible}
        onSelected={onOptionSelected}
        closeModal={() => setOptionModal({ isVisible: false, selectedItem: null })}

      />
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default LinksList
const options = [
  {
    icon: () => icons.eye(colors.primary, 17),
    title: "Copy Main URL",
    type: "main"
  },
  {
    icon: () => icons.eye(colors.primary, 17),
    title: "Copy Appointment URL",
    type: "appointment"
  }]

const __styles = StyleSheet.create({
  cardView: {
    backgroundColor: colors.secondary,
    padding: 10,
    marginTop: 10,
    borderRadius: 10
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  copybtn: {
    borderWidth: 1,
    borderColor: colors.lightText + "AA",
    borderRadius: 20,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center"
  },
  previewBtn: {
    flexDirection: "row",
    alignItems: "center"
    // borderWidth: 1,
    // borderColor: colors.primary,
    // borderRadius: 20,
    // alignSelf: "flex-start",
    // paddingHorizontal: 30,
    // paddingVertical: 5
  }
})