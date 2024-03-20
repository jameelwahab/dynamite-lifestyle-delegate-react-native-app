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
import { PORTAL_ADD_EVENT, PORTAL_UPDATE_EVENT, UPLDATE_PORTAL_LOCK_EVENT, UPLOAD_FILE_TO_S3 } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import routes from '../../../navigation/routes'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'

const EventAddEdit = ({ route, navigation }) => {
  let { item, slug, eventId } = route.params;

  let { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [data, updateData] = useState({
    title: !!item?.title ? item?.title : "",
    type: !!item?.event_type ? item?.event_type : "current",
    btnText: !!item?.button_text ? item?.button_text : "",
    link: !!item?.button_link ? item?.button_link : "",
    status: !!item?.status == false ? false : true,
    image: !!item?.images?.thumbnail_1 ? item?.images?.thumbnail_1 : "",
    desc: !!item?.description ? item?.description : ""
  })

  const setData = (updation) => updateData((oldData) => { return { ...oldData, ...updation } });

  const onSubmit = async () => {
    setLoader(true);
    let fd = new FormData();
    fd.append("title", data.title.trim());
    fd.append("status", data.status);
    fd.append("button_text", data.btnText.trim());
    fd.append("button_link", data.link);
    fd.append("event_type", data.type);
    fd.append("description", data.desc.trim());
    fd.append("created_for", "event");
    fd.append("event_id", eventId);
    if (!!data.image?.uri) {
      fd.append("image", data.image);
    }
    if (!!item) {
      fd.append("order", item?.order);
    }
    if (!!item) {
      updateDataToServer(fd)
    } else {
      addDataToServer(fd)
    }

  }

  const updateDataToServer = async (fd) => {
    let res = await PORTAL_UPDATE_EVENT({
      token, navigation, eventSlug: item?.event_slug, formdata: fd
    })
    if (res.code == 200) {
      navigation.navigate(routes.portalEventsList, {
        eventId, slug
      })
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  const addDataToServer = async (fd) => {
    let res = await PORTAL_ADD_EVENT({
      token, navigation, formdata: fd
    })
    if (res.code == 200) {
      navigation.navigate(routes.portalEventsList, {
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
          <MyText isLabel>Event Type *</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Current'
                onPress={() => setData({ type: "current" })}
                value={data?.type == "current"}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Upcoming'
                onPress={() => setData({ type: "upcoming" })}
                value={data?.type == "upcoming"}
              />
            </View>
          </View>
        </View>


        <MyInputs
          label='Button Text'
          value={data?.btnText}
          onChangeText={(text) => setData({ btnText: text })}
        />

        <MyInputs
          label='Button Link'
          value={data?.link}
          onChangeText={(text) => setData({ link: text })}
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

        <UploadFileInput
          label='Upload Image *'
          subLabel='Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")'
          onImagePicked={(img) => setData({ image: img })}
          onRemoveBtnPress={() => setData({ image: "" })}
          selectedImage={data?.image}
          hideRemoveButton
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

export default EventAddEdit

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