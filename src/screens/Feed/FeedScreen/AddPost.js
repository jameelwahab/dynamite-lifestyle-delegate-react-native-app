import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Pressable, ScrollView } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import UserImage from '../../../components/UserImage'
import Modal from 'react-native-modal'
import { colors } from '../../../utilities/colors'
import MyText from '../../../components/MyText'
import { icons } from '../../../utilities/icons'
import { fonts } from '../../../utilities/fonts'
import MyInputs from '../../../components/MyInputs'
import { MyButton } from '../../../components/MyButton'
import ImageUploadModal from '../../../components/ImageUploadModal'
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker'
import ResponsiveImage2 from '../../../components/ResponsiveImage2'
import utilities from '../../../utilities'
import MyImage from '../../../components/MyImage'
import OptionModal from '../../../components/OptionModal'
import Toast from 'react-native-toast-message'
import { CREATE_FEED, FEED_DETAIL, UPDATE_FEED, UPLOAD_FEED_IMAGES } from '../../../DAL'
import { tokens } from 'react-native-paper/lib/typescript/styles/themes/v3/tokens'
import showToast from '../../../functions/showToast'
import { S3_URL } from '../../../utilities/constants'
import LevelModal from './LevelModal'
import MyTouchableInput from '../../../components/MyTouchableInput'

const AddPost = forwardRef(({ user, token, navigation, refresh, updateFeedItem, selectFeedlevel, feedLevel }, ref) => {
  const lvlModalRef = useRef()
  const [loader, setLoader] = useState(false);
  const [isPostModalVisible, setPostModalVisibilty] = useState(false);
  const [isImageVisible, setImageModalVisibilty] = useState(false);
  const [options, setOption] = useState({
    list: [],
    type: "",
    visibility: false
  });
  const [postCategory, setPostCategory] = useState("general");
  const [postCeatedFor, setPostCreatedFor] = useState(feedLevel != 'all' ? feedLevel : "delegate");
  const [postType, setPostType] = useState("general");
  const [postText, setPostText] = useState("");
  const [images, setImages] = useState([]);
  const [videoLink, setVideoLink] = useState("");
  const [embededCode, setEmbededCode] = useState("");
  const [editId, setEditId] = useState("")

  useImperativeHandle(ref, () => {
    return {
      selectItemForEdit,
      // ... your methods ...
    };
  }, []);

  const selectItemForEdit = (item) => {
    setEditId(item._id);
    setPostCategory(item?.source_by);
    setPostCreatedFor(item?.created_for_level_or_type == "both" ? "delegate" : item?.created_for_level_or_type);
    setPostType(item?.feed_type);
    setPostText(item?.description);
    setImages([...item.feed_images]);
    setVideoLink(item?.video_url);
    setEmbededCode(item?.embed_code)
    setPostModalVisibilty(true);
  }



  const onImagePicked = (newImages) => {
    setImages([...images, ...newImages])
  }

  const closeModal = () => {
    setPostModalVisibilty(false);
  }

  const openModal = (type) => {
    setPostType(type);
    setPostModalVisibilty(true);
  }

  const resetStates = () => {
    setPostText("");
    setImages("");
    setVideoLink("");
    setEmbededCode("");
    setImages([])
  }

  const openOptionModal = (Modalfor) => {
    if (Modalfor == "category") {
      setOption({
        list: PostCategory,
        visibility: true,
        type: Modalfor
      })
    } else if (Modalfor == "createdFor") {
      setOption({
        list: PostCretedFor,
        visibility: true,
        type: Modalfor
      })
    }
  }

  const closeOptionModal = () => {
    setOption({
      list: [],
      visibility: false,
      type: ""
    })
  }

  const onOptionSelected = (opt) => {
    if (options?.type == "category") {
      setPostCategory(opt.type)
    } else if (options?.type == "createdFor") {
      setPostCreatedFor(opt.type)
    }

    closeOptionModal()
  }

  const addPostBtn = async () => {
    setLoader(true);
    let uploadedImages = [];
    if (postType == "image" && images.length > 0) {
      let uploadImageArray = [];
      images.forEach(image => {
        if (!!image?.uri) {
          let ifd = new FormData()
          ifd.append("width", image.width);
          ifd.append("image", image);
          uploadImageArray.push(UPLOAD_FEED_IMAGES({ token, navigation, formData: ifd }));
        } else {
          uploadedImages.push(image);
        }
      });

      let resp = await Promise.all(uploadImageArray);


      resp.forEach(image => {
        if (image.code == 200) {
          uploadedImages.push(image.images_obj);
        } else {
          showToast({ body: image?.message, title: "Error" })
          setLoader(false);
          return;
        }
      });

    }


    let fd = new FormData();
    fd.append("feed_appear_by", "public");
    fd.append("feed_type", postType);
    fd.append("video_url", postType == "video" ? videoLink : "");
    fd.append("description", postText);
    fd.append("embed_code", postType == "embed_code" ? embededCode : "");
    fd.append("feed_images", postType == 'image' ? JSON.stringify(uploadedImages) : "[]");
    fd.append("created_for_level_or_type", "both");
    if (!(!!editId)) {
      fd.append("is_publish", "true");
      fd.append("feed_created_for", postCeatedFor);
    }

    if (!!editId) {
      editTheFeedPostAPI(fd);
    } else {
      let res = await CREATE_FEED({ navigation, token, formData: fd });
      if (res.code == 200) {
        refresh?.()
        setPostModalVisibilty(false)
        setLoader(false);
      } else {

        setLoader(false);
      }
    }
  }

  const editTheFeedPostAPI = async (fd) => {
    let res = await UPDATE_FEED({ navigation, token, formData: fd, feedId: editId });
    if (res.code == 200) {

      let res1 = await FEED_DETAIL({ navigation, token, feedId: editId });
      if (res1.code == 200) {

        showToast({ title: res?.message, type: "success" })
        updateFeedItem(res1?.feeds)
        setPostModalVisibilty(false)
        setLoader(false);
        setEditId("")
      } else {
        setLoader(false);
      }
    } else {

      setLoader(false);
    }
  }



  const Modal_addPost = () => {
    return (
      <Modal
        isVisible={isPostModalVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        useNativeDriverForBackdrop={true}
        onModalHide={resetStates}
        hasBackdrop={false}
        animationInTiming={500}
        animationOutTiming={500}
        style={{ margin: 0 }}>
        <SafeAreaView style={{ flex: 1 }} >
          <View pointerEvents={loader ? "none" : "auto"} style={__style.modalRootView}>
            <View style={__style.headingView}>
              <View style={__style.modalclosebtn} />
              <View style={__style.headingTextView}>
                <MyText type='bold' fontSize={28} >{!!editId ? "Update Post" : "Create Post"}</MyText>
              </View>
              <TouchableOpacity
                onPress={() => closeModal()}
                style={[__style.modalclosebtn, { backgroundColor: colors.border }]} >
                {icons.crosss(colors.white, 20)}
              </TouchableOpacity>
            </View>
            <View style={[__style.divider, { marginTop: -1 }]} />
            <View style={__style.postView}>

              {/* //* Profile view with actions */}

              <View style={[__style.inputRootView,]}>
                <UserImage
                  image={user?.image?.thumbnail_1}
                  name={user?.first_name}
                  size={45}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <MyText fontSize={16} type="bold">{user?.first_name + " " + user?.last_name}</MyText>
                  <View style={__style.modalActionButtonRow}>

                    <TouchableOpacity
                      onPress={() => openOptionModal("category")}
                      style={__style.modalDropBtns}>
                      <MyText style={{ textTransform: "capitalize" }}>
                        {postCategory}</MyText>
                      {icons.downwardArrow(17, colors.white)}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => openOptionModal("createdFor")}
                      style={__style.modalDropBtns}>
                      <MyText style={{ textTransform: "capitalize" }}>
                        {postCeatedFor}
                      </MyText>
                      {icons.downwardArrow(17, colors.white)}
                    </TouchableOpacity>
                    {!!!editId &&
                      <View opacity={0.7}>
                        <TouchableOpacity
                          style={__style.modalDropBtns}>
                          <MyText>Publish</MyText>
                          {icons.downwardArrow(17, colors.white)}
                        </TouchableOpacity>
                      </View>}
                  </View>
                </View>
              </View>




              {/*//*   Post Text     */}

              <TextInput
                style={__style.modalInput}
                multiline={true}
                autoCapitalize='none'
                autoComplete="off"
                textAlignVertical="top"
                autoCorrect={false}
                onChangeText={(text) => setPostText(text)}
                value={postText}
                placeholder="What's on your mind?"
                placeholderTextColor={colors.lightText2}
              />


              {/*//*   Images List     */}
              {postType == "image" &&
                <View>
                  <View style={{ flexDirection: "row", marginBottom: 5 }}>
                    <ScrollView horizontal
                      contentContainerStyle={{ paddingVertical: 10 }}
                      indicatorStyle="white"
                    >
                      {images.map((image, index) => (
                        <View>
                          <MyImage
                            source={{ uri: !!image.uri ? image.uri : S3_URL + image.thumbnail_1 }}
                            style={{ width: ((utilities.screenWidth() - 40) / 4), aspectRatio: 1, borderRadius: 10, marginRight: 10, overflow: "hidden" }}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              setImages((images) => images.filter((x, i) => i != index))

                            }}
                            style={[__style.inputCrossBtn, { backgroundColor: colors.primary, right: 5, top: -8 }]}>
                            {icons.crosss(colors.black, 15)}
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>

                  {/*//*   Image View     */}

                  <View>
                    <Pressable
                      onPress={() => setImageModalVisibilty(true)}
                      style={__style.addPhotoView}>
                      <MyText type='medium' color={colors.primary} >Add Photo</MyText>
                      {icons.upload()}
                    </Pressable>
                    <TouchableOpacity
                      onPress={() => setPostType("general")}
                      style={[__style.inputCrossBtn, { top: -5, backgroundColor: colors.black }]}>
                      {icons.crosss(colors.primary, 15)}
                    </TouchableOpacity>
                  </View>
                </View>}
              {/* //*     Post Video url      */}


              {postType == "video" &&
                <View >
                  <TextInput
                    style={__style.videoInput}
                    autoCapitalize='none'
                    autoComplete="off"
                    autoCorrect={false}
                    onChangeText={(text) => setVideoLink(text)}
                    value={videoLink}
                    placeholder="Video URL"
                    placeholderTextColor={colors.lightText2}
                  />
                  <TouchableOpacity
                    onPress={() => setPostType("general")}
                    style={__style.inputCrossBtn}>
                    {icons.crosss(colors.white, 15)}
                  </TouchableOpacity>
                </View>}


              {/* //*     Post Embed Code      */}
              {postType == "embed_code" &&
                <View >
                  <TextInput
                    style={[__style.videoInput, { height: 120 }]}
                    multiline={true}
                    textAlignVertical='top'
                    autoCapitalize='none'
                    autoComplete="off"
                    autoCorrect={false}
                    onChangeText={(text) => setEmbededCode(text)}
                    value={embededCode}
                    placeholder="Embeded Code"
                    placeholderTextColor={colors.lightText2}
                  />
                  <TouchableOpacity
                    onPress={() => setPostType("general")}
                    style={__style.inputCrossBtn}>
                    {icons.crosss(colors.white, 15)}
                  </TouchableOpacity>
                </View>}


              {/* //*     post type action buttonns  */}
              <View style={__style.typeButtonRow}>

                <TouchableOpacity
                  onPress={() => setPostType("image")}
                  style={__style.typeButtonView}>
                  {icons.camera(postType == "image" ? colors.primary : colors.white, 17)}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPostType("video")}
                  style={__style.typeButtonView}>
                  {icons.video(postType == "video" ? colors.primary : colors.white, 17)}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPostType("embed_code")}
                  style={__style.typeButtonView}>
                  {icons.code(postType == "embed_code" ? colors.primary : colors.white, 17)}
                </TouchableOpacity>


              </View>


            </View>

            {/* //*    add post Button  */}
            {!!editId ?
              <View style={{ flexDirection: "row", marginVertical: 20, marginHorizontal: 20 }}>
                <View style={{ flex: 1 }}>
                  <MyButton
                    isLoading={loader}
                    onPress={addPostBtn}
                    invert={true} title={"cancel"} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <MyButton
                    isLoading={loader}
                    onPress={addPostBtn}
                    invert={true} title={loader ? 'updating...' : 'Update'} />
                </View>
              </View> :
              <View style={{ marginVertical: 20, marginHorizontal: 20 }}>
                <MyButton
                  isLoading={loader}
                  onPress={addPostBtn}
                  invert={true} title={loader ? 'POSTING...' : 'POST'} />
              </View>}

          </View>
          <ImageUploadModal
            closeModal={() => setImageModalVisibilty(false)}
            isVisible={isImageVisible}
            onImagePicked={onImagePicked}
            multiple={true}
          />

          <OptionModal
            isVisible={options.visibility}
            optionList={options.list}
            closeModal={closeOptionModal}
            onSelected={onOptionSelected}
          />
          {isPostModalVisible && <Toast />}
        </SafeAreaView>
        <SafeAreaView style={{ flex: 0, backgroundColor: colors.secondary }} ></SafeAreaView>
      </Modal>

    )
  }
  return (
    <View>
      {/* //*  Level select View */}
      <Pressable
        onPress={() => {
          console.log(lvlModalRef, "lvlModalRef")
          lvlModalRef?.current?.openLvlModal()
        }}
        style={__style.lvlbtnView}>
        <View style={__style.levlBtnLabel}>
          <MyText color={colors.lightText2} fontSize={12} >Select Level</MyText>
        </View>
        <MyText type={"medium"} style={{ textTransform: "capitalize" }} >{feedLevel}</MyText>
        {icons.down(colors.lightText2)}
      </Pressable>

      <View style={__style.rootView}>
        <View style={__style.inputRootView}>
          <UserImage
            image={user?.image?.thumbnail_1}
            name={user?.first_name}
            size={40}
          />

          <TouchableOpacity
            onPress={() => openModal("general")}
            style={__style.inputView}>
            <MyText>What's on your mind?</MyText>
          </TouchableOpacity>
        </View>
        <View style={__style.divider} />

        <View style={__style.buttonsRow} >
          <TouchableOpacity
            onPress={() => openModal("video")}
            style={__style.buttonView}>
            <MyText style={__style.buttonText}>Upload Video</MyText>
            {icons.video(colors.white, 15)}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openModal("image")}
            style={__style.buttonView}>
            <MyText style={__style.buttonText}>Upload Image</MyText>
            {icons.camera(colors.white, 15)}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openModal("embed_code")}
            style={__style.buttonView}>
            <MyText style={__style.buttonText}>Embeded Code</MyText>
            {icons.code(colors.white, 15)}
          </TouchableOpacity>
        </View>
        {Modal_addPost()}

      </View>

      <LevelModal
        selectFeedlevel={selectFeedlevel}
        feedLevel={feedLevel}
        ref={lvlModalRef}
      />
    </View>

  )
})

export default AddPost;

const PostCategory = [
  {
    title: "General",
    type: "general"
  },
  {
    title: "Win",
    type: "win"
  },
]

const PostCretedFor = [
  {
    title: "Delegate",
    type: "delegate"
  },
  {
    title: "Consultant",
    type: "consultant"
  },
]

const __style = StyleSheet.create({
  lvlbtnView: { flexDirection: "row", borderWidth: 1, borderColor: colors.lightText, height: 45, borderRadius: 10, marginTop: 10, alignItems: "center", paddingHorizontal: 10, justifyContent: "space-between" },
  levlBtnLabel: { backgroundColor: colors.darkSecondary, alignSelf: "flex-start", paddingHorizontal: 5, position: "absolute", top: -8, left: 5 },

  rootView: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  inputRootView: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputView: {
    backgroundColor: colors.secondaryVariant,
    height: 40,
    padding: 10,
    justifyContent: "center",
    marginLeft: 10,
    flex: 1,
    borderRadius: 30
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightText,
    marginTop: 15
  },
  buttonsRow: {
    marginTop: 5
  },
  buttonView: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "center",
    marginTop: 10,

  },
  buttonText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 5,
    fontFamily: fonts.medium
  },
  modalRootView: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  headingView: {
    flexDirection: "row",
    padding: 10,
    marginTop: 5
  },
  headingTextView: {
    flex: 1,
    alignItems: "center"
  },
  modalclosebtn: {
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30 / 2,

  },
  postView: {
    padding: 15,
    flex: 1
  },
  modalActionButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5
  },
  modalDropBtns: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginRight: 5

  },
  modalInput: {
    minHeight: 70,
    maxHeight: 150,
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    paddingTop: 10,
    color: colors.lightText2,
    fontFamily: fonts.regular,
    includeFontPadding: false
  },
  videoInput: {
    height: 40,
    backgroundColor: colors.secondaryVariant,
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    paddingTop: 10,
    color: colors.lightText2,
    fontFamily: fonts.regular,
    includeFontPadding: false
  },
  inputCrossBtn: {
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20 / 2,
    backgroundColor: colors.border,
    position: "absolute",
    right: -5
  },
  typeButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15
  },
  typeButtonView: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.border,
    borderRadius: 40 / 2,
    marginRight: 10
  },
  addPhotoView: {
    height: 120,
    backgroundColor: colors.lightPrimary3,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  }
})