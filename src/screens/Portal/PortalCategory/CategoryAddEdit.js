import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyInputs from '../../../components/MyInputs'
import UploadFileInput from '../../../components/UploadFileInput'
import Editor from '../../../components/Editor'
import { MyButton } from '../../../components/MyButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PORTAL_ADD_EVENT, PORTAL_CATEGORY_ADD, PORTAL_CATEGORY_EDIT, PORTAL_UPDATE_EVENT, UPLDATE_PORTAL_LOCK_EVENT, UPLOAD_FILE_TO_S3 } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import routes from '../../../navigation/routes'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'
import showToast from '../../../functions/showToast'

const CategoryAddEdit = ({ route, navigation }) => {
  let { item, slug, eventId, backScreenFunc } = route.params;
  console.log(item, "item")
  let { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [data, updateData] = useState({
    title: !!item?.title ? item?.title : "",
    status: item?.status == false ? false : true,
    shortDesc: !!item?.short_description ? item?.short_description : "",
    desc: !!item?.detail_description ? item?.detail_description : "",
    order: !!item?.order ? String(item?.order) : "",
  })

  const setData = (updation) => updateData((oldData) => { return { ...oldData, ...updation } });

  const onSubmit = async () => {
    if (data.title.trim() == "") {
      showToast({ body: "Please enter title", title: "Alert" })
      return
    }
    setLoader(true);
    let fd = new FormData();
    fd.append("title", data.title.trim());
    fd.append("status", data.status);
    fd.append("short_description", data.shortDesc.trim());
    fd.append("detail_description", data.desc.trim());
    fd.append("dynamite_event", eventId);
    if (!!item) {
      fd.append("order", data.order);
    }

    if (!!item) {
      updateDataToServer(fd)
    } else {
      addDataToServer(fd)
    }

  }

  const updateDataToServer = async (fd) => {
    let res = await PORTAL_CATEGORY_EDIT({
      token, navigation, slug: item?.dynamite_event_category_slug, formdata: fd,
    })
    if (res.code == 200) {
      // backScreenFunc?.(res?.dynamite_event_category)
      // navigation.goBack()
      navigation.navigate(routes.portalCategoryList, {
        eventId, slug
      })
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  const addDataToServer = async (fd) => {
    let res = await PORTAL_CATEGORY_ADD({
      token, navigation, formdata: fd
    })
    if (res.code == 200) {
      navigation.navigate(routes.portalCategoryList, {
        eventId, slug
      })
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  return (
    <RootView title={!!item ? 'Edit Event' : 'Add Event'}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableResetScrollToCoords={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <MyInputs
          label='Title *'
          value={data?.title}
          onChangeText={(text) => setData({ title: text })}
        />



        <View style={__styles.radioRootView}>
          <MyText isLabel>Status *</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Active'
                onPress={() => setData({ status: true })}
                value={data?.status}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Inctive'
                onPress={() => setData({ status: false })}
                value={!data?.status}
              />
            </View>
          </View>
        </View>

        {!!item &&
          <MyInputs
            label='Order *'
            value={data?.order}
            onChangeText={(text) => setData({ order: text })}
            keyboardType='number-pad'
          />}

        <MyInputs
          label='Short Description'
          value={data?.shortDesc}
          onChangeText={(text) => setData({ shortDesc: text })}
          multiline
          maxLength={500}
        />


        <Editor
          label='Detailed Description'
          height={150}
          initialValue={data?.desc}
          onChange={(text) => setData({ desc: text })}
        />

        <MyButton title={!!item ? "Save Changes" : 'Add'} onPress={onSubmit} />

      </KeyboardAwareScrollView>

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default CategoryAddEdit

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