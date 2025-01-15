import { View, Text, RootTagContext, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import MyTouchableInput from '../../components/MyTouchableInput'
import OptionModal from '../../components/OptionModal'
import { GET_SALE_PAGES_LIST_FOR_SUBSCRIPTION } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import OptionModalWithSearch from '../../components/OptionModalWithSearch'
import { MyButton, MyClearButton } from '../../components/MyButton'
import routes from '../../navigation/routes'
import { colors } from '../../utilities/colors'


const Filter = ({ navigation, route }) => {
  const { filters } = route?.params
  const { token, } = useSelector(selectUser);
  const [data, setData] = useState(null)
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([]);
  const [modesModal, setModesModal] = useState(false)
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
    list: [],
    title: "",
    titleKey: ""
  });
  const [appliedFilters, setAppliedFilters] = useState({
    mode: !!filters?.mode ? filters?.mode : null,
    page: !!filters?.page ? filters?.page : null,
    plan: !!filters?.plan ? filters?.plan : null
  })

  const onSubmit = () => {
    navigation.navigate(routes.subscriptionList, {
      appliedFilters
    })
  }

  const onClear = () => {
    navigation.navigate(routes.subscriptionList, {
      appliedFilters: {
        mode: null,
        page: null,
        plan: null
      }
    })
  }

  const onOptionSelected = (opt) => {
    let { titleKey } = optionModal;
    closeOptionModal()
    setTimeout(() => {
      if (titleKey == "sale_page_title") {
        setAppliedFilters({ ...appliedFilters, page: opt, plan: null })
      } else if (titleKey == "plan_title") {
        setAppliedFilters({ ...appliedFilters, plan: opt })
      }
    }, 200);
  }

  const filterTheList = (list, text) => {
    if (text.trim() == "") {
      return list
    } else {
      return list.slice().filter(x => x[optionModal?.titleKey].toLowerCase().includes(text.toLowerCase().trim()))
    }
  }

  const getDataFromServer = async () => {
    let res = await GET_SALE_PAGES_LIST_FOR_SUBSCRIPTION({ navigation, token });
    if (res.code == 200) {
      setList(res?.sale_pages);
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const openOptionModal = (list, title, titleKey) => {
    setOptionModal({ isVisible: true, selectedItem: null, list: list, title, titleKey })
  }

  const closeOptionModal = () => {
    setOptionModal({ isVisible: false, selectedItem: null, list: [], withSearch: false, title: "", titleKey: "" })
  }


  useEffect(() => {
    getDataFromServer()
  }, [])


  return (
    <RootView title='Filter' >
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 5 }}
      >


        <MyTouchableInput
          label='Sale Page'
          onPress={() => openOptionModal(list, "Sale Page", "sale_page_title")}
          value={!!appliedFilters?.page ? `${appliedFilters?.page?.sale_page_title} ${appliedFilters?.page?.type == "template" ? " (Template) " : ""}` : ""}
          clearbutton={!!appliedFilters?.page?.sale_page_title}
          onClearButtonPress={() => setAppliedFilters({ ...appliedFilters, page: null, plan: null })}

        />

        <MyTouchableInput
          label='Choose Plan'
          onPress={() => { if (!!appliedFilters.page) { openOptionModal(appliedFilters.page?.payment_plans, "Plan", "plan_title") } }}
          value={appliedFilters?.plan?.plan_title}
          clearbutton={!!appliedFilters?.plan?.plan_title}
          onClearButtonPress={() => setAppliedFilters({ ...appliedFilters, plan: null })}
        />

        <MyTouchableInput
          label='Subscription Mode'
          onPress={() => setModesModal(true)}
          value={appliedFilters?.mode?.title}
        />


        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {/* {(!!appliedFilters?.plan || !!appliedFilters?.page || !!appliedFilters?.mode ) ? */}
          <MyClearButton
            style={{ flex: 1, marginRight: 10 }}
            title='Clear Filter'
            onPress={onClear}
          />



          <MyButton
            style={__styles.btn}
            title='Submit'
            onPress={onSubmit}
          />


        </View>
      </ScrollView>


      <OptionModalWithSearch
        optionList={optionModal?.list}
        filterTheList={filterTheList}
        isVisible={optionModal?.isVisible}
        onSelected={onOptionSelected}
        closeModal={closeOptionModal}
        // title={optionModal?.title}
        titleKey={optionModal?.titleKey}
        noIcon
        renderText={(({ item }) =>
          <MyText fontSize={16}  >{
            `${item[optionModal?.titleKey]} ${item?.type == "template" ? " (Template) " : ""}`
          }</MyText>
        )}
      />

      <OptionModal
        optionList={modes}
        isVisible={modesModal}
        onSelected={(opt) => {
          setModesModal(false);
          setAppliedFilters({ ...appliedFilters, mode: opt })
        }}
        closeModal={() => setModesModal(false)}
        noIcon
      />

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default Filter;


const modes = [
  {
    title: "SandBox",
    key: "sandBox",
  },
  {
    title: "Live",
    key: "live",
  },
  {
    title: "All",
    key: "all",
  },
]

const __styles = StyleSheet.create({
  clearBtn: {
    // marginTop: 20,
    borderColor: colors.delete,
    backgroundColor: colors.delete + "22",
    marginRight: 10
  },
  clearBtnText: {
    color: colors.delete
  },
  btn: {
    flex: 1
  }
})