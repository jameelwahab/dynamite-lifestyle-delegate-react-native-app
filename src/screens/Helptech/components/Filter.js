import { View, Text, SafeAreaView, Pressable, ScrollView } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import Modal from 'react-native-modal'
import MyText from '../../../components/MyText';
import { icons } from '../../../utilities/icons';
import { colors } from '../../../utilities/colors';
import MyTouchableInput from '../../../components/MyTouchableInput';
import { Flex, Row } from '../../../UIComponents/FlexViews';
import { MyButton, MyButton2 } from '../../../components/MyButton';
import CalendarModal from '../../../components/CalendarModal';
import moment from 'moment';
import OptionModalWithSearch from '../../../components/OptionModalWithSearch';
import MyChip from '../../../components/MyChip';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import { useNavigation } from '@react-navigation/native';
import { GET_CATEGORIES_AND_DEPARTMENT_LIST } from '../../../DAL';
import capitalize from '../../../functions/capitalize';
import breakReference from '../../../functions/breakReference';
import Toast from 'react-native-toast-message';
import showToast from '../../../functions/showToast';


const Filter = forwardRef(({ applyFilter }, ref) => {
  const { token } = useSelector(selectUser);
  const navigation = useNavigation()
  const ref_calendar = useRef()
  const [isVisible, setisVisible] = useState(false);
  const [loader, setLoader] = useState(false)
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    type: ""

  })
  const [lists, setLists] = useState({
    departments: []
  })
  const [fields, setFields] = useState({
    departments: [],
    from: "",
    to: ""
  })

  const closeOptionModal = () => {
    setOptionModal({ isVisible: false, type: "" })
  }

  const onSelected = (opt) => {
    fields[optionModal?.type].push(opt);
    setFields({ ...fields });
    closeOptionModal?.()
  }

  const filterTheList = (list, text) => {
    let nlist = [];
// console.log(list,optionModal,"list")
    list.forEach(element => {     
      if (!fields[optionModal?.type].find(x => x?._id == element?._id)) {
        nlist.push(element);
      }
    });

    if (text.trim() == "") {
      return nlist
    } else {
      return nlist.slice("").filter(x => x.title.toLowerCase().includes(text.trim().toLowerCase()))
    }
  }


  const openModal = (appliedFilter) => {
    setFields(appliedFilter)
    getCategoriesAndDepartments?.()
    setisVisible(true)
  }

  const closeModal = () => {
    setisVisible(false)
  }

  const onDateSelected = (date, type) => {
    setFields({ ...fields, [type]: moment(date).format("YYYY-MM-DD") })
  }

  const removeFromList = (index, type) => {
    fields[type].splice(index, 1)
    setFields({ ...fields })
  }


  const submit = () => {
    if ((!!fields.to && !!fields.from) || (!fields.to && !fields.from)) {

      applyFilter(fields);
      closeModal?.()
    } else {
      showToast({ title: "Alert", body: "Please select both start date & end date", type: "info" })
    }
  }

  const clear = () => {
    applyFilter({
      departments: [],
      from: "",
      to: ""
    })
    closeModal?.()
  }




  useImperativeHandle(ref, () => {
    return {
      openModal,
    }
  }, [])

  const getCategoriesAndDepartments = async () => {
    setLoader(true)
    let res = await GET_CATEGORIES_AND_DEPARTMENT_LIST({ navigation, token });
    setLoader(false)
    if (res.code == 200) {
      setLists({
        departments: res?.departments,

      })
    }
  }

  const views = (type) => {
    return (
      <Flex style={{ padding: 5 }} flex={1} >
        <Row flexWrap="wrap">
          {fields[type].map((x, i) => (
            <MyChip title={x?.title}
              onPress={() => removeFromList(i, type)}
            />
          ))}
        </Row>
      </Flex>
    )

  }

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      useNativeDriverForBackdrop={true}
      style={{ margin: 0 }}
      animationIn={"slideInRight"}
      animationOut={"slideOutRight"}
      animationInTiming={300}
      animationOutTiming={300}
      avoidKeyboard={true}

    >
      <SafeAreaView style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, flex: 1, marginTop: "auto", backgroundColor: colors.secondary }}>

        <View style={{ flex: 1 }}>

          <View style={{ flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText, }}>
            <View style={{ flex: 1 }}>
              <MyText fontSize={18} color={colors.primary} type='medium' >{"Help Tech Filter"}</MyText>
            </View>
            <Pressable onPress={closeModal}>
              {icons.crosss(colors.lightText2, 25)}
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
              {/* <MyTouchableInput
                label='Category'
                view={() => views("categories")}
                iconOnPress={() => setOptionModal({ isVisible: true, type: "categories" })}
              /> */}

              <MyTouchableInput
                label='Department'
                iconOnPress={() => setOptionModal({ isVisible: true, type: "departments" })}
                view={() => views("departments")}
              />

              <Row>
                <Flex flex={1}>
                  <MyTouchableInput
                    clearbutton={!!fields?.from}
                    label='Start Date'
                    onClearButtonPress={() => setFields({...fields, from: "" })}
                    onPress={() => ref_calendar?.current?.openModal(fields?.from, "from")}
                    icon={() => icons.calendar(colors.primary)}
                    value={fields?.from ? moment(fields?.from).format("DD-MM-YYYY") : ""}
                  />
                </Flex>
                <Flex flex={1} ml={10}  >
                  <MyTouchableInput
                    onPress={() => ref_calendar?.current?.openModal(fields?.to, "to")}
                    label='End Date'
                    onClearButtonPress={() => setFields({...fields, to: "" })}
                    clearbutton={!!fields?.to}
                    value={fields?.to ? moment(fields?.to).format("DD-MM-YYYY") : ""}
                    icon={() => icons.calendar(colors.primary)}
                  />
                </Flex>

              </Row>


              <Row>
                <Flex flex={1}>
                  <MyButton title='Clear' invert onPress={clear} />
                </Flex>
                <Flex flex={1} ml={10}  >
                  <MyButton title='Submit' onPress={submit} />
                </Flex>

              </Row>


            </View>
          </ScrollView>
        </View>


        <OptionModalWithSearch
          noIcon
          isVisible={optionModal?.isVisible}
          closeModal={closeOptionModal}
          onSelected={onSelected}
          filterTheList={filterTheList}
          optionList={optionModal?.type ? lists[optionModal?.type] : []}
          // title={optionModal?.type == "departments" ? "Department" :
          //   optionModal?.type == "categories" ? "Category" : ""
          // }
          title={capitalize(optionModal?.type).trim()}

        />

        <CalendarModal
          ref={ref_calendar}
          onDateSelected={onDateSelected}
        />
      </SafeAreaView>
      {isVisible && <Toast />}
    </Modal>
  )
})

export default Filter