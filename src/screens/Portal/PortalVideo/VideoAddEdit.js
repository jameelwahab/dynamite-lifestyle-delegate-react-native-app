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
import { PORTAL_ADD_EVENT, PORTAL_CATEGORY_ADD, PORTAL_CATEGORY_EDIT, PORTAL_UPDATE_EVENT, PORTAL_VIDEO_ADD, PORTAL_VIDEO_EDIT, UPLDATE_PORTAL_LOCK_EVENT, UPLOAD_FILE_TO_S3 } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import routes from '../../../navigation/routes'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'
import showToast from '../../../functions/showToast'
import UploadAudio from '../../../components/UploadAudio'

const VideoAddEdit = ({ route, navigation }) => {
  console.log(route.params, " route.params")
  let { item, slug, eventId, catId, backScreenFunc } = route.params;
  console.log(item, "item")
  let { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [data, updateData] = useState({
    title: !!item?.title ? item?.title : "",
    status: !!item?.status == false ? false : true,
    isFeature: !!item?.is_feature ? item?.is_feature : false,
    chatEnable: !!item?.is_chat_enable == false ? false : true,
    type: !!item?.video_type ? item?.video_type : "video",
    videoCode: !!item?.video_url ? item?.video_url : "",
    shortDesc: !!item?.short_description ? item?.short_description : "",
    desc: !!item?.detail_description ? item?.detail_description : "",
    order: !!item?.order ? String(item?.order) : "",
    image: !!item?.image?.thumbnail_1 ? item?.image?.thumbnail_1 : "",
    audio: !!item?.audio_file_url ? item?.audio_file_url : "",
  })

  const setData = (updation) => updateData((oldData) => { return { ...oldData, ...updation } });

  const onSubmit = async () => {
    if (data.title.trim() == "") {
      showToast({ body: "Please enter title", title: "Alert" })
      return
    } else if (data.type == "video" && data.videoCode.trim() == "") {
      showToast({ body: "Please enter video embed code", title: "Alert" })
      return
    } else if (data.type == "audio" && data.audio.uri == "") {
      showToast({ body: "Please select an audio", title: "Alert" })
      return
    }
    setLoader(true);
    let fd = new FormData();
    fd.append("title", data.title.trim());
    fd.append("status", data.status);
    fd.append("is_feature", data.status);
    fd.append("is_chat_enable", data.chatEnable);
    fd.append("video_type", data.type);
    fd.append("dynamite_event_category", catId);
    if (!!data.image?.uri) {
      fd.append("image", data.image);
    }
    if (data.type == "video") {
      fd.append("video_url", data.videoCode);
    } else if (data.type == "audio" && !!data?.audio?.uri) {
      fd.append("audio", data.audio);
    }
    if (!!item) {
      fd.append("order", data.order);
    }
    fd.append("short_description", data.shortDesc.trim());
    fd.append("detail_description", data.desc.trim());

    if (!!item) {
      updateDataToServer(fd)
    } else {
      addDataToServer(fd)
    }

  }

  const updateDataToServer = async (fd) => {
    let res = await PORTAL_VIDEO_EDIT({
      token, navigation, formdata: fd, catId: item?._id
    })
    if (res.code == 200) {
      backScreenFunc?.(res?.dynamite_event_category_video)
      navigation.goBack()
      // navigation.navigate(routes.portalCategoryList, {
      //   eventId, slug
      // })
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  const addDataToServer = async (fd) => {
    let res = await PORTAL_VIDEO_ADD({
      token, navigation, formdata: fd
    })
    if (res.code == 200) {
      navigation.navigate(routes.portalVideoList, {
        slug, eventId, catId,
      })
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  return (
    <RootView title={!!item ? 'Edit Video' : 'Add Video'}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableResetScrollToCoords={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <MyInputs
          label='Video Title *'
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

        <View style={__styles.radioRootView}>
          <MyText isLabel>Is Feature *</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Yes'
                onPress={() => setData({ isFeature: true })}
                value={data?.isFeature}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='No'
                onPress={() => setData({ isFeature: false })}
                value={!data?.isFeature}
              />
            </View>
          </View>
        </View>

        <View style={__styles.radioRootView}>
          <MyText isLabel>is Chat Enable *</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Yes'
                onPress={() => setData({ chatEnable: true })}
                value={data?.chatEnable}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='No'
                onPress={() => setData({ chatEnable: false })}
                value={!data?.chatEnable}
              />
            </View>
          </View>
        </View>

        <View style={__styles.radioRootView}>
          <MyText isLabel>Type *</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Video'
                onPress={() => setData({ type: "video" })}
                value={data?.type == "video"}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Audio'
                onPress={() => setData({ type: "audio" })}
                value={data?.type == "audio"}
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

        <UploadFileInput
          label='Upload Image *'
          subLabel='Image Size (100*100) ("JPG", "JPEG", "PNG","WEBP")'
          onImagePicked={(img) => setData({ image: img })}
          selectedImage={data.image}
          onRemoveBtnPress={() => setData({ image: null })}
          hideRemoveButton={true}
        />

        {data.type == "audio" &&
          <UploadAudio
            label='Upload Audio *'
            subLabel='Allowed Formats is "Mp3",200Mb'
            onAudioPicked={(file) => setData({ audio: file })}
            selectedAudio={data.audio}
            onRemoveBtnPress={() => setData({ audio: "" })}
            hideRemoveButton={true}
          />}

        {data.type == "video" &&
          <MyInputs
            label='Video Embed Code *'
            value={data?.videoCode}
            onChangeText={(text) => setData({ videoCode: text })}
            multiline
            maxLength={500}
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

export default VideoAddEdit

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