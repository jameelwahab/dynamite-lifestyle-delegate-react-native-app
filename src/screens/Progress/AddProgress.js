import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { BOOKING_ADD, BOOKING_CONSULTANT_LIST, BOOKING_PASS, BOOKING_UPDATE, GET_BOOKING_TIME_SLOTS, GET_BOOKING_TIME_SLOTS_BY_CONSULTANT, GET_SALE_PAGE_LIST_FOR_BOOKING, PROGRESS_ADD, PROGRESS_CATEGORIES_LIST } from '../../DAL'
import MyTouchableInput from '../../components/MyTouchableInput'
import { MyButton } from '../../components/MyButton'
import OptionModalWithSearch from '../../components/OptionModalWithSearch'
import CalendarModal from '../../components/CalendarModal'
import OptionModal from '../../components/OptionModal'
import moment from 'moment'
import { dateTimeFormat } from '../../utilities/constants'
import showToast from '../../functions/showToast'
import routes from '../../navigation/routes'
import MyLoader from '../../components/MyLoader'
import { icons } from '../../utilities/icons'
import { colors } from '../../utilities/colors'
import MyCheckBox from '../../components/MyCheckBox'
import Editor from '../../components/Editor'
import UploadFileInput from '../../components/UploadFileInput'
import { PROGRESS_UPDATE } from '../../DAL/Progress'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const AddProgress = ({ navigation, route }) => {
  const ref_calendar = useRef();
  const { token } = useSelector(selectUser);
  const { editableItem } = route?.params;

  const [optionModal, setOptionModal] = useState({ isVisble: false, list: [], type: "", titleKey: "" });
  const [catList, setCatList] = useState([]);
  const [AddType, setAddType] = useState(!!editableItem?.report_type ? typeList.find(x => x.key == editableItem?.report_type) : typeList[0])
  const [startDate, setStartDate] = useState(!!editableItem?.start_date ? moment(editableItem?.start_date) : moment());
  const [endDate, setEndDate] = useState(!!editableItem?.end_date ? moment(editableItem?.end_date) : moment());
  const [category, setCategory] = useState(!!editableItem?.progress_category ? editableItem?.progress_category : null);
  const [desc, setDesc] = useState(!!editableItem?.description ? editableItem?.description : "");
  const [image, setImage] = useState(!!editableItem?.image ? editableItem?.image?.thumbnail_1 : null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    getCategoriesFromServer()
  }, [])




  const closeOptionModal = () => { setOptionModal({ isVisble: false, list: [], type: "", titleKey: "" }) }

  const onSelected = (opt) => {
    let { type } = optionModal;
    closeOptionModal();
    if (type == "addtype") {
      if (opt?.key != AddType?.key) {
        if (opt.key == "daily") {
          setStartDate(moment())
          setEndDate(moment())
        } else if (opt.key == "weekly") {
          setStartDate(moment().subtract({ week: 1 }))
          setEndDate(moment())
        }
        else if (opt.key == "monthly") {
          setStartDate(moment().subtract({ month: 1 }))
          setEndDate(moment())
        } else if (opt.key == "custom") {
          setStartDate(moment())
          setEndDate(moment())
        }
        setAddType(opt)
      }
    } else if (type == "category") {
      setCategory(opt)
    }

  }




  const onSubmit = () => {
    if (!category) {
      showToast({ title: "Alert", body: "Please select a category", type: "info" })
    } else if (desc.trim() == "") {
      showToast({ title: "Alert", body: "Please write description", type: "info" })
    }
    else {
      setLoader(true);

      let fd = new FormData();
      fd.append("report_type", AddType?.key);
      fd.append("progress_category", category?._id);
      fd.append("start_date", moment(startDate).format("YYYY-MM-DD"));
      fd.append("end_date", moment(endDate).format("YYYY-MM-DD"));
      fd.append("description", desc?.trim());
      if (!!image?.uri) {
        fd.append("image", image);
      }

      if (!!editableItem) {
        updateToServer(fd);
      } else {
        addToServer(fd)
      }
    }
  }


  const addToServer = async (fd) => {
    let res = await PROGRESS_ADD({ navigation, token, formdata: fd });
    setLoader(false);
    if (res.code == 200) {
      navigation.navigate(routes?.progresssList, {
        callList: true
      })
    }
  }

  const updateToServer = async (fd) => {
    let res = await PROGRESS_UPDATE({ navigation, token, formdata: fd, progressId: editableItem?._id });
    setLoader(false);
    if (res.code == 200) {
      navigation.navigate(routes?.progresssList, {
        callList: true
      })
    }
  }



  const getCategoriesFromServer = async () => {
    let res = await PROGRESS_CATEGORIES_LIST({ navigation, token, });
    if (res.code == 200) {
      setCatList(res?.progress_report_category);
    }
  }






  return (
    <RootView title={!!editableItem ? "Edit Progress" : 'Add New Progress'} >
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      >

        <MyTouchableInput
          label='Add Type *'
          onPress={() => setOptionModal({ isVisble: true, list: typeList, type: "addtype", })}
          value={!!AddType ? AddType?.title : ""}
        />




        <MyTouchableInput
          label='Start Date *'
          onPress={() => ref_calendar?.current?.openModal(startDate, "startDate")}
          value={!!startDate ? moment(startDate).format(dateTimeFormat.date) : ""}
          icon={() => icons.calendar(colors.primary)}
        />
        {AddType?.key != "daily" &&
          <MyTouchableInput
            label='End Date *'
            onPress={() => ref_calendar?.current?.openModal(endDate, "endDate")}
            value={!!endDate ? moment(endDate).format(dateTimeFormat.date) : ""}
            icon={() => icons.calendar(colors.primary)}
          />}

        <MyTouchableInput
          label='Progress Categories *'
          onPress={() => setOptionModal({ isVisble: true, list: catList, type: "category", })}
          value={!!category ? category?.title : ""}
        />


        <Editor
          height={150}
          label='Description *'
          initialValue={desc}
          onChange={(txt) => setDesc(txt)}
        />


        <UploadFileInput
          label='Image'
          subLabel='Recommended Size (1000x670)'
          onImagePicked={(img) => setImage(img)}
          selectedImage={image}
          hideRemoveButton
        />



        <View>
          <MyButton title='Save' onPress={onSubmit} />
        </View>

      </KeyboardAwareScrollView>

      <MyLoader enable={loader} />

      <OptionModal
        isVisible={optionModal?.isVisble}
        closeModal={closeOptionModal}
        onSelected={onSelected}
        optionList={optionModal.list}
        checkSelected={(item) => {
          if (optionModal.type == "category") {
            return category?._id == item?._id
          } else if (optionModal.type == "addtype") {
            return AddType?.key == item?.key
          } else {
            return false
          }
        }}
      />

      <CalendarModal
        ref={ref_calendar}
        onDateSelected={(date, type) => {
          if (type == "startDate") setStartDate(date);
          else if (type == "endDate") setEndDate(date);
        }}
      />
    </RootView>
  )
}

export default AddProgress

const typeList = [
  { key: "daily", title: "Daily" },
  { key: "weekly", title: "Weekly" },
  { key: "monthly", title: "Monthly" },
  { key: "custom", title: "Custom" },

]

const __styles = StyleSheet.create({
  radioRootView: {
    marginBottom: 15
  },
  radioView: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    // padding: 2
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  radioItem: {
    flex: 1,

  },
})