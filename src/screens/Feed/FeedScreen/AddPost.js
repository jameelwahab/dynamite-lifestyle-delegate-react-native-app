import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Pressable, ScrollView } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
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
import { S3_URL, dateTimeFormat } from '../../../utilities/constants'
import LevelModal from './LevelModal'
import MyTouchableInput from '../../../components/MyTouchableInput'
import Editor from '../../../components/Editor'
import { TriangleColorPicker } from 'react-native-color-picker'
import ColorModal from '../../../components/ColorModal'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import { convertTimezone, convertTimezoneFrom } from '../../../functions/convertTime'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyWebview from '../../../components/MyWebview'
import openUrl from '../../../functions/openUrl'
import { isUrl } from '../../../functions/regex'


const AddPost = forwardRef(({ user, token, navigation, refresh, updateFeedItem, selectFeedlevel, feedLevel, tab, isCosmos, isScheduledFeed, timezone, removeFromList, isSuperDelegate }, ref) => {
  const lvlModalRef = useRef()
  const tablRef = useRef()
  const [loader, setLoader] = useState(false);
  const [isPostModalVisible, setPostModalVisibilty] = useState(false);
  const [isImageVisible, setImageModalVisibilty] = useState(false);
  const [options, setOption] = useState({
    list: [],
    type: "",
    visibility: false
  });
  const [postCategory, setPostCategory] = useState("general");
  const [postCeatedFor, setPostCreatedFor] = useState(isCosmos ? feedLevel != 'all' ? feedLevel : "delegate" : PostCretedForSourceFeed[0].type);
  const [postCeatedForArray, setPostCreatedForArray] = useState([PostCretedForSourceFeed[0]]);
  const [postType, setPostType] = useState("general");
  const [postText, setPostText] = useState("");
  const [images, setImages] = useState([]);
  const [videoLink, setVideoLink] = useState("");
  const [embededCode, setEmbededCode] = useState("");
  const [editId, setEditId] = useState("");
  const [editFeed, setEditFeed] = useState(null);
  const [show, setShow] = useState(false)
  const [isEventViewComplete, setEventComplete] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventBtnText, setEventBtnText] = useState("");
  const [eventBtnLink, setEventBtnLink] = useState("");
  const [eventBtnTextColor, setEventBtnTextColor] = useState(colors.white)
  const [eventBtnColor, setEventBtnColor] = useState(colors.primary2);



  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisibe, setTimeModalVisibe] = useState(false);
  const [publishDate, setPublishDate] = useState(moment().format(dateTimeFormat.date));
  const [publishTime, setPublishTime] = useState("12:00 AM");
  const [eventModalVisible, setEventModalVisible] = useState(false)

  const [multipleLevelModalVisiblity, setMultipleLevelModalVisiblity] = useState(false);


  useImperativeHandle(ref, () => {
    return {
      selectItemForEdit,
      // ... your methods ...
    };
  }, []);

  const selectItemForEdit = (item) => {
    console.log(item, "item for edit");
    setEditId(item._id);
    setEditFeed(item);
    setPostCategory(item?.feed_appear_by == "public" ? "general" : "win");
    setPostCreatedFor(item?.created_for_level_or_type == "both" ? "delegate" : item?.created_for_level_or_type);
    setPostType(item?.feed_type);
    setPostText(item?.description);
    setImages([...item.feed_images]);
    setVideoLink(item?.video_url);
    setEmbededCode(item?.embed_code)
    setPostModalVisibilty(true);
    if (!!item?.event_info && Object.keys(item?.event_info).length > 0) {
      setEventComplete(true);
      setEventTitle(item?.event_info?.event_title)
      setEventBtnText(item?.event_info?.button_text);
      setEventBtnLink(item?.event_info?.button_link);
      setEventBtnColor(item?.event_info?.button_background_color);
      setEventBtnTextColor(item?.event_info?.button_text_color)
    }
    if (!!item?.schedule_date_time && !item?.is_publish) {
      setPublishDate(moment(item?.schedule_date_time).tz(timezone.admin).format(dateTimeFormat.date));
      setPublishTime(moment(item?.schedule_date_time).tz(timezone.admin).format(dateTimeFormat.time));
    }
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
    setImages([]);
    setEditId("");
    setEditFeed(null);
    setEventComplete(false);
    setEventTitle("")
    setEventBtnText("");
    setEventBtnLink("");
    setEventBtnColor(colors.primary2);
    setEventBtnTextColor(colors.white);
    setPublishDate(moment().format(dateTimeFormat.date));
    setPublishTime("12:00 AM");
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
        list: isCosmos ? PostCretedFor : PostCretedForSourceFeed,
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
  const onMultipleOptionSelected = (opt) => {
    let list = [...postCeatedForArray];
    let index = list.findIndex(x => x.type == opt.type);
    console.log(list, index)
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(opt)
    }
    console.log(list)
    setPostCreatedForArray([...list])

  }
  useEffect(() => {
    console.log(postCeatedForArray)
  }, [
    JSON.stringify(postCeatedForArray)
  ])

  const checkSelected = (opt) => {
    return !!postCeatedForArray.find(x => x.type == opt.type)
  }
  const addPostBtn = async () => {
    // if (postType == "general" && ) {
    //   showToast({ body: "Please add some text to be posted", title: "Alert", type: "info" });
    //   return
    // }
    // else if (postType == "image") {
    //   showToast({ body: "Please add data to be posted", title: "Alert", type: "info" });
    //   return
    // } else if (postType == "video") {
    //   showToast({ body: "Please add data to be posted", title: "Alert", type: "info" });
    //   return
    // } else if (postType == "embed_code") {
    //   showToast({ body: "Please add data to be posted", title: "Alert", type: "info" });
    //   return
    // }

    if (postText.trim() == "" && images.length == 0 && embededCode.trim() == "" && videoLink.trim() == "") {
      showToast({ body: "Please add data to be posted", title: "Alert", type: "info" });
      return
    } else if (!isCosmos && !!!editId && postCeatedForArray.length == 0) {
      showToast({ body: "Please select post level", title: "Alert", type: "info" });
      return
    }

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
    console.log(postCeatedFor, "  <==postCeatedFor")

    let fd = new FormData();
    fd.append("feed_appear_by", postCategory == "general" ? "public" : "win");
    fd.append("feed_type", postType);
    fd.append("video_url", postType == "video" ? videoLink : "");
    fd.append("description", postText);
    fd.append("embed_code", postType == "embed_code" ? embededCode : "");
    fd.append("feed_images", postType == 'image' ? JSON.stringify(uploadedImages) : "[]");
    if (!isCosmos && !!editId == false && !isSuperDelegate) {
      fd.append("created_for_level_or_type", JSON.stringify(postCeatedForArray.map(x => x.type)));
    } else if (!!editId) {
      fd.append("created_for_level_or_type", postCeatedFor);
    }
    else {
      fd.append("created_for_level_or_type", isCosmos ?
        feedLevel == 'all' ? JSON.stringify(["both"]) : JSON.stringify([postCeatedFor])
        : JSON.stringify([postCeatedFor]));
    }

    if (isEventViewComplete) {
      let eventObj = {
        event_title: eventTitle,
        button_text: eventBtnText.trim(),
        button_link: eventBtnLink.trim(),
        button_background_color: eventBtnColor,
        button_text_color: eventBtnTextColor,
        is_event_info: true
      }
      fd.append("event_info", JSON.stringify(eventObj));
    }
    if (isScheduledFeed) {
      fd.append("schedule_date_time", moment(publishDate, dateTimeFormat.date).format("YYYY-MM-DD") + " " + moment(publishTime, dateTimeFormat.time).format("HH:mm"))
    }
    if (!(!!editId)) {
      fd.append("is_publish", isScheduledFeed ? "false" : "true");
      fd.append("feed_created_for", isCosmos ? "delegate" : "general");
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
        if (feedLevel != "all" && editFeed?.created_for_level_or_type != res1.feeds.created_for_level_or_type && !isCosmos) {
          removeFromList(editId)
        } else {
          updateFeedItem(res1?.feeds)
        }
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



  const btn_cancelEvent = () => {

    setEventTitle("")
    setEventBtnText("");
    setEventBtnLink("");
    setEventBtnColor(colors.primary2);
    setEventBtnTextColor(colors.white);
    setEventComplete(false);
    setEventModalVisible(false)
  }



  const EventModal = () => {
    const [title, setTitle] = useState("");
    const [btnText, setBtnText] = useState("");
    const [link, setLink] = useState("");
    const [textColor, setTextColor] = useState(colors.white)
    const [btnColor, setBtnColor] = useState(colors.primary2);
    const [colorModal, setColorModal] = useState({
      visibility: false,
      for: 0
    });

    useEffect(() => {
      if (eventModalVisible) {
        setTitle(eventTitle)
        setBtnText(eventBtnText);
        setLink(eventBtnLink);
        setBtnColor(eventBtnColor);
        setTextColor(eventBtnTextColor);
      }
    }, [eventModalVisible])

    const btn_addEvent = () => {
      if (title.trim() == "") {
        showToast({ body: "Please enter event title", title: "Alert", type: "info" });
        return
      } else if (btnText.trim() == "") {
        showToast({ body: "Please enter event button title", title: "Alert", type: "info" });
        return
      } else if (link.trim() == "") {
        showToast({ body: "Please enter event button link", title: "Alert", type: "info" });
        return
      } else if (!isUrl(link.trim())) {
        showToast({ body: "Please enter valid link", title: "Alert", type: "info" });
        return
      } else {
        setEventTitle(title);
        setEventBtnText(btnText);
        setEventBtnLink(link);
        setEventBtnTextColor(textColor);
        setEventBtnColor(btnColor)
        setEventComplete(true);
        setEventModalVisible(false)
      }
    }

    const btn_cancel = () => {
      setTitle("")
      setBtnText("");
      setLink("");
      setBtnColor(colors.primary2);
      setTextColor(colors.white);
    }
    return (
      <Modal
        isVisible={eventModalVisible}
        onBackdropPress={btn_cancel}
        onBackButtonPress={btn_cancel}
        useNativeDriverForBackdrop={true}
        animationIn={"slideInRight"}
        animationOut={"slideOutRight"}
        animationInTiming={300}
        animationOutTiming={300}
        style={{ margin: 0 }}>
        <SafeAreaView style={{ flex: 1 }} >
          <View pointerEvents={loader ? "none" : "auto"} style={__style.modalRootView}>
            <View style={__style.headingView}>
              <TouchableOpacity
                onPress={() => {
                  setEventModalVisible(false);
                  setTimeout(() => {
                    btn_cancel()
                  }, 350);
                }}
                style={[__style.modalclosebtn, { backgroundColor: colors.border }]} >
                {icons.back(colors.white, 20)}
              </TouchableOpacity>

              <View style={__style.headingTextView}>
                <MyText type='bold' fontSize={28} >{"Event"}</MyText>
              </View>
              <View style={__style.modalclosebtn} />
            </View>

            {/*//*   Event View    */}
            {!isCosmos &&
              <View style={{ paddingHorizontal: 20, flex: 1 }}>
                <KeyboardAwareScrollView
                  showsVerticalScrollIndicator={false} contentContainerStyle={{ marginTop: 10, paddingBottom: 30 }}>
                  <Editor
                    label='Event Title*'
                    initialValue={title}
                    onChange={(text) => setTitle(text)}
                    backgroundColor={colors.secondaryVariant}
                    height={120}
                  />

                  <View style={{}}>
                    <View style={{}}>
                      <MyInputs
                        label='Button Text*'
                        value={btnText}
                        onChangeText={(text) => setBtnText(text)}
                      />
                    </View>
                    <View style={{}}>
                      <MyInputs
                        label='Button Link*'
                        value={link}
                        onChangeText={(text) => setLink(text)}
                      />
                    </View>
                  </View>


                  <View style={{}}>
                    <View style={{}}>
                      <MyTouchableInput
                        onPress={() => setColorModal({ visibility: true, for: 1 })}
                        label='Button Text event*'
                        view={() => (
                          <View style={{ flex: 1, }}>
                            <View style={[__style.eventColorView, { backgroundColor: textColor, }]} />
                          </View>
                        )}
                      />
                    </View>
                    <View style={{}}>
                      <MyTouchableInput
                        onPress={() => setColorModal({ visibility: true, for: 2 })}
                        label='Button background color*'
                        view={() => (
                          <View style={{ flex: 1, }}>
                            <View style={[__style.eventColorView, { backgroundColor: btnColor, }]} />
                          </View>
                        )}
                      />
                    </View>
                  </View>
                  <View style={{ justifyContent: "flex-end", flexDirection: "row", marginTop: 10 }}>
                    <MyButton style={{ paddingHorizontal: 20 }} invert title={isEventViewComplete ? "Remove" : 'CANCEL'}
                      onPress={() => {
                        btn_cancelEvent()
                        btn_cancel()
                      }} />
                    <MyButton style={{ paddingHorizontal: 20, marginLeft: 20 }} invert title='DONE'
                      onPress={btn_addEvent}
                    />
                  </View>
                </KeyboardAwareScrollView>
              </View>}

          </View>

          <ColorModal
            isVisible={colorModal.visibility}
            clodeModal={() => setColorModal({ visibility: false, for: 0 })}
            selectedColor={colorModal.for == 1 ? eventBtnTextColor : colorModal.for == 2 ? eventBtnColor : ""}
            getColor={(color) => {
              if (colorModal.for == 1) {
                setTextColor(color)
              } else if (colorModal.for == 2) {
                setBtnColor(color)
              }
            }}
          />

        </SafeAreaView>
        <SafeAreaView style={{ flex: 0, backgroundColor: colors.secondary }} />
        {eventModalVisible && <Toast />}
      </Modal>)
  }


  const Modal_addPost = () => {
    let levelLength = postCeatedForArray.length
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
        // avoidKeyboard={true}
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
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}>

              <View style={__style.postView}>

                {/* //* Profile view with actions */}

                <View style={[__style.inputRootView,]}>
                  <UserImage
                    image={user?.image?.thumbnail_1}
                    name={user?.first_name}
                    size={45}
                  />

                  {/* //* Dropdown btns */}
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
                      {(isCosmos || !!editId || !isSuperDelegate) &&
                        <TouchableOpacity
                          onPress={() => openOptionModal("createdFor")}
                          style={__style.modalDropBtns}>
                          {isCosmos ?
                            <MyText style={{ textTransform: "capitalize" }}>
                              {postCeatedFor}
                            </MyText> :
                            <MyText  >
                              {PostCretedForSourceFeed.find(x => x.type == postCeatedFor)?.title}
                            </MyText>}
                          {icons.downwardArrow(17, colors.white)}
                        </TouchableOpacity>}
                      {!!!editId &&
                        <View opacity={0.7}>
                          <TouchableOpacity
                            style={__style.modalDropBtns}>
                            <MyText>{isScheduledFeed ? "Schedule" : "Publish"}</MyText>
                            {/* {icons.downwardArrow(17, colors.white)} */}
                          </TouchableOpacity>
                        </View>}
                    </View>
                    {!isCosmos && !!!editId && isSuperDelegate &&
                      <View style={{ marginTop: 10 }}>
                        <TouchableOpacity
                          onPress={() => setMultipleLevelModalVisiblity(true)}
                          style={[__style.modalDropBtns, { alignSelf: "flex-start" }]}>
                          <MyText >
                            {levelLength > 0 ? postCeatedForArray.map((x, i) => {
                              let name = x.title;
                              if ((i + 1) != levelLength) {
                                name = name + ", ";
                              }
                              return name
                            }) : "Select Level*"}
                          </MyText>
                          {icons.downwardArrow(17, colors.white)}
                        </TouchableOpacity>
                      </View>
                    }
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
                  keyboardAppearance="dark"
                  selectionColor={colors.selection}
                  cursorColor={colors.white}
                />


                {/*//*   Schedule View    */}
                {isScheduledFeed &&
                  <View style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                      <View style={{ flex: 1 }}>
                        <MyTouchableInput
                          noSpace
                          label='Publish Date*'
                          value={publishDate}
                          icon={() => icons.calendar(colors.lightPrimary, 20)}
                          onPress={() => setDateModalVisible(true)}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <MyTouchableInput
                          noSpace
                          label='Publish Time*'
                          value={publishTime}
                          icon={() => icons.clock(colors.lightPrimary, 20)}
                          onPress={() => setTimeModalVisibe(true)}
                        />
                      </View>
                    </View>
                    <MyText style={{ marginTop: 5 }} fontSize={12} color={colors.lightText}  >{"Date and Time are in Europe/Dublin timezone"}</MyText>
                  </View>
                }


                {/* //* Eent View */}

                {isEventViewComplete &&
                  <View style={{ paddingHorizontal: 10 }} >
                    <View style={__style.eventRootView} >
                      <View style={__style.eventTitleView}>
                        <MyWebview html={eventTitle} />
                      </View>
                      <TouchableOpacity
                        onPress={() => openUrl(eventBtnLink)}
                        style={[__style.eventBtnView, { backgroundColor: eventBtnColor, }]}>
                        <MyText
                          color={eventBtnTextColor}
                          type='medium'
                          style={{ paddingHorizontal: 10, }}
                        >{eventBtnText}</MyText>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => setEventModalVisible(true)}
                      style={{
                        backgroundColor: colors.white, height: 30, width: 30, borderRadius: 30 / 2, alignItems: "center", justifyContent: "center", position: "absolute", right: 0, top: 5,
                        shadowColor: "#fff",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 5,
                      }} >
                      {icons.editpencil(colors.border, 20)}
                    </TouchableOpacity>

                    {/* <View style={{ backgroundColor: colors.grey, height: 30, width: 30, borderRadius: 30 / 2, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, left: 2 }} >
                      {icons.edit(colors.white, 15)}
                    </View> */}
                  </View>
                }








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
                  <View style={{ flex: 1, flexDirection: "row" }}>
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
                  {!isCosmos &&
                    <TouchableOpacity
                      // onPress={() => setEventComplete((prev) => !prev)}
                      onPress={() => setEventModalVisible(true)}
                      style={__style.typeButtonView}>
                      {icons.calendarTick(isEventViewComplete ? colors.primary : colors.white, 20)}
                    </TouchableOpacity>
                  }
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
            </KeyboardAwareScrollView>
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



          {/* //? Multiple Option Level */}
          <OptionModal
            isVisible={multipleLevelModalVisiblity}
            optionList={PostCretedForSourceFeed}
            closeModal={() => setMultipleLevelModalVisiblity(false)}
            onSelected={onMultipleOptionSelected}
            multiple={true}
            checkSelected={checkSelected}
          />





          <DateTimePicker
            isVisible={dateModalVisible}
            mode="date"
            display='spinner'
            date={moment(publishDate, dateTimeFormat.date).toDate()}
            textColor={colors.darkSecondary}
            buttonTextColorIOS={colors.primary2}
            onConfirm={(date) => {
              setPublishDate(moment(date).format(dateTimeFormat.date))
              setDateModalVisible(false)
            }}
            onCancel={() => setDateModalVisible(false)}
          />

          <DateTimePicker
            isVisible={timeModalVisibe}
            mode="time"
            display="spinner"
            date={moment(publishTime, dateTimeFormat.time).toDate()}
            textColor={colors.darkSecondary}
            buttonTextColorIOS={colors.primary2}
            minuteInterval={15}
            onConfirm={(time) => {
              setPublishTime(moment(time).format(dateTimeFormat.time))
              setTimeModalVisibe(false)
            }}
            onCancel={() => setTimeModalVisibe(false)}
          />

          {EventModal()}

          {isPostModalVisible && !eventModalVisible && <Toast />}
        </SafeAreaView>
        <SafeAreaView style={{ flex: 0, backgroundColor: colors.secondary }} ></SafeAreaView>
      </Modal >

    )
  }

  return (
    <View>
      {tab == 0 &&
        <View >
          <Pressable
            onPress={() => {
              console.log(lvlModalRef, "lvlModalRef")
              lvlModalRef?.current?.openLvlModal()
            }}
            style={__style.lvlbtnView}>
            <View style={__style.levlBtnLabel}>
              <MyText color={colors.lightText2} fontSize={12} >Select Level</MyText>
            </View>
            <MyText type={"medium"} style={{ textTransform: feedLevel == "pta" ? "uppercase" : "capitalize" }} >{feedLevel}</MyText>
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
            isCosmos={isCosmos}
          />

        </View>}
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


const PostCretedForSourceFeed = [
  {
    title: "Dynamite",
    type: "dynamite"
  },
  {
    title: "PTA",
    type: "pta"
  },
  {
    title: "Elite",
    type: "elite"
  },
  {
    title: "Mastery",
    type: "mastery"
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
  eventColorView: {
    height: "70%", width: "90%", alignSelf: "center", borderRadius: 5
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
  },

  eventRootView: {
    borderWidth: 1,
    marginVertical: 20,
    borderColor: colors.white,
    backgroundColor: colors.black,
    paddingHorizontal: 5,
    marginHorizontal: 2,
    borderRadius: 5
  },
  eventTitleView: {
    margin: 0,
    padding: 5
  },
  eventBtnView: {
    flexGrow: 1,
    minHeight: 35,

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingVertical: 3,
    marginVertical: 3,
    flex: 1,
    minWidth: 50
  },
})