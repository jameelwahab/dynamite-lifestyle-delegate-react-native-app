import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyInputs from '../../../components/MyInputs'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { icons } from '../../../utilities/icons'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import UploadFileInput from '../../../components/UploadFileInput'
import Editor from '../../../components/Editor'
import { MyButton } from '../../../components/MyButton'
import CalendarModal from '../../../components/CalendarModal'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import Collapsible from 'react-native-collapsible'
import showToast from '../../../functions/showToast'
import { ADD_PORTAL_EVENT, ADD_PORTAL_EVENT_BY_DELEGATE, GET_PORTAL_TEMPLATES, UPDATE_PORTAL_EVENT } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'

const AddEditPortal = ({ navigation, route }) => {
  const { item, backScreenFunc } = route.params;
  let { token } = useSelector(selectUser)
  const [loader, setLoader] = useState(false);
  const calendarRef = useRef();
  const [templateList, setTemplateList] = useState([]);
  const [isTemplateModalShown, setTemplateModalShown] = useState(false)

  const [data, updateData] = useState({
    title: !!item?.title ? item.title : "",
    date: !!item?.start_date ? moment(item.start_date, "YYYY-MM-DD") : "",
    shownOnList: !!!item?.is_show_on_list == false ? false : true,
    numberOfDays: !!item?.no_of_days ? String(item?.no_of_days) : "0",
    topSectionText: !!item?.top_text ? item?.top_text : "",
    bottomSectionText: !!item?.bottom_text ? item?.top_text : "",
    banner1BtnText: !!item?.banner1_button_text ? item?.banner1_button_text : "",
    banner1Link: !!item?.banner1_link ? item?.banner1_link : "",
    banner2BtnText: !!item?.banner2_button_text ? item?.banner2_button_text : "",
    banner2Link: !!item?.banner2_link ? item?.banner2_link : "",
    status: item?.status != undefined ? item?.status : true,
    isPurchaseLinkEnabled: !!item?.is_purchase_link ? true : false,
    image: !!item?.images?.thumbnail_1 ? item?.images?.thumbnail_1 : "",
    logo: !!item?.event_logo?.thumbnail_1 ? item?.event_logo?.thumbnail_1 : "",
    banner1: !!item?.banner1_image?.thumbnail_1 ? item?.banner1_image?.thumbnail_1 : "",
    banner2: !!item?.banner2_image?.thumbnail_1 ? item?.banner2_image?.thumbnail_1 : "",
    embedCode: !!item?.video_url ? item?.video_url : "",
    shortDesc: !!item?.short_description ? item?.short_description : "",
    longDesc: !!item?.detail_description ? item?.detail_description : "",
    purchaseLink: !!item?.link ? item?.link : "",
    purchaseLinkImage: !!item?.link_image ? item?.link_image : "",
    order: !!item?.order ? String(item?.order) : "",
    isTemplate: false,
    selectedTemplate: null,
  })

  const setData = (updation) => updateData((oldData) => { return { ...oldData, ...updation } });

  useEffect(() => {
    getTemplatesListFromServer()

  }, [data?.isTemplate])


  const onSubmit = () => {
    if (data.title.trim() == "") {
      showToast({ body: "Please enter title", title: "Alert" })
    } else if (data.date == "") {
      showToast({ body: "Please select start date", title: "Alert" })
    } else if (data.numberOfDays == "" && data?.isTemplate == false) {
      showToast({ body: "Please enter no. of days", title: "Alert" })
    } else if (!!item && data?.order.trim() == "") {
      showToast({ body: "Please enter order", title: "Alert" })
    } else if (data.isPurchaseLinkEnabled && data?.purchaseLink.trim() == "" && data?.isTemplate == false) {
      showToast({ body: "Please enter purchase link", title: "Alert" })
    }
    //  else if (data.isPurchaseLinkEnabled && !!data?.purchaseLinkImage == false && data?.isTemplate == false) {
    //   showToast({ body: "Please select purchase link image", title: "Alert" })
    // }
    //  else if (!!data?.logo == false && data?.isTemplate == false) {
    //   showToast({ body: "Please select event logo", title: "Alert" })
    // } 
    else if (!!data?.image == false && data?.isTemplate == false) {
      showToast({ body: "Please select event image", title: "Alert" })
    } else if (data?.shortDesc.trim() == "" && data?.isTemplate == false) {
      showToast({ body: "Please enter short description", title: "Alert" })
    } else if (data?.longDesc.trim() == "" && data?.isTemplate == false) {
      showToast({ body: "Please enter long description", title: "Alert" })
    } else {
      makeDataForServer();
    }
  }

  const makeDataForServer = () => {
    let fd = new FormData();
    console.log(data, "data")
    fd.append("title", data.title.trim())
    fd.append("start_date", moment(data.date).format("YYYY-MM-DD"))

    if (data?.isTemplate) {
      fd.append("template_id", data?.selectedTemplate?._id)
      fd.append("is_use_template", "true")
    }
    else {
      fd.append("is_show_on_list", data.shownOnList)
      fd.append("no_of_days", data.numberOfDays.trim());
      fd.append("top_text", data.topSectionText.trim())
      fd.append("bottom_text", data.bottomSectionText.trim())
      fd.append("banner1_link", data.banner1Link)
      fd.append("banner1_button_text", data.banner1BtnText.trim())
      fd.append("banner2_link", data.banner2Link)
      fd.append("banner2_button_text", data.banner2BtnText.trim())
      fd.append("status", data.status)
      fd.append("is_purchase_link", data.isPurchaseLinkEnabled);
      if (data.isPurchaseLinkEnabled) {
        fd.append("link", data.purchaseLink)
        if (!!data.purchaseLinkImage?.uri) {
          fd.append("link_image", data.purchaseLinkImage)
        }
      }
      if (!!data.logo?.uri) {
        fd.append("event_logo", data.logo)
      }
      if (!!data.image?.uri) {
        fd.append("image", data.image)
      }
      if (!!data.banner1?.uri) {
        fd.append("banner1_image", data.banner1);
      } else if (!!data.banner1 == false) {
        fd.append("banner1_image", "");
      }
      if (!!data.banner1?.uri) {
        fd.append("banner2_image", data.banner2);
      } else if (!!data.banner2 == false) {
        fd.append("banner2_image", "");
      }

      fd.append("video_url", data.embedCode)
      fd.append("short_description", data.shortDesc.trim())
      fd.append("detail_description", data.longDesc.trim())
      if (!!item) {
        fd.append("order", Number(data?.order))
      }
    }


    if (!!item) {
      updateEventToServer(fd)
    } else {
      addEventToServer(fd)
    }

  }


  const addEventToServer = async (fd) => {
    setLoader(true);
    let res = await ADD_PORTAL_EVENT_BY_DELEGATE({ token, navigation, formdata: fd });
    setLoader(false);
    if (res.code == 200) {
      backScreenFunc?.(res?.dynamite_event);
      navigation.goBack();
    }
  }

  const updateEventToServer = async (fd) => {
    setLoader(true);
    let res = await UPDATE_PORTAL_EVENT({ token, navigation, formdata: fd, eventSlug: item?.event_slug });
    setLoader(false);
    if (res.code == 200) {
      backScreenFunc?.(res?.dynamite_event);
      navigation.goBack();
    }
  }

  const getTemplatesListFromServer = async (fd) => {
    let res = await GET_PORTAL_TEMPLATES({ token, navigation, });
    if (res.code == 200) {
      setTemplateList(res?.dynamite_events)
    }
  }



  return (
    <RootView title={!!item ? "Edit Event" : 'Add Event'}  >

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableResetScrollToCoords={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >

        {!!item == false &&
          <View style={__styles.radioRootView}>
            <MyText isLabel>Do you want to use Template*</MyText>
            <View style={__styles.radioView}>
              <View style={__styles.radioItem}>
                <MyCheckBox
                  title='Yes'
                  onPress={() => setData({ isTemplate: true })}
                  value={data?.isTemplate == true}
                />
              </View>
              <View style={__styles.radioItem}>
                <MyCheckBox
                  title='No'
                  onPress={() => {
                    if (data?.isTemplate) {
                      setData({
                        isTemplate: false,
                        selectedTemplate: null,
                        title: "",
                        date: ""
                      })
                    }
                  }}
                  value={data?.isTemplate == false}
                />
              </View>
            </View>
          </View>}
        {data?.isTemplate ?
          <View>
            <MyTouchableInput
              label='Template Title*'
              value={!!data?.selectedTemplate ? data?.selectedTemplate?.title : ""}
              onPress={() => setTemplateModalShown(true)}
              clearbutton={!!data?.selectedTemplate}
              onClearButtonPress={() => {
                setData({
                  selectedTemplate: null,
                  title: "",
                  date: ""
                })
              }}
            />
            <MyInputs
              label='Event Title*'
              value={data?.title}
              onChangeText={(text) => setData({ title: text })}
            />


            <MyTouchableInput
              label='Event Start Date*'
              icon={() => icons.calendar(colors.primary)}
              onPress={() => calendarRef?.current?.openModal(data.date)}
              value={!!data?.date ? moment(data?.date).format(dateTimeFormat.date) : ""}
            />


          </View> :
          <View>
            <MyInputs
              label='Event Title*'
              value={data?.title}
              onChangeText={(text) => setData({ title: text })}
            />

            <MyTouchableInput
              label='Event Start Date*'
              icon={() => icons.calendar(colors.primary)}
              onPress={() => calendarRef?.current?.openModal(data.date)}
              value={!!data?.date ? moment(data?.date).format(dateTimeFormat.date) : ""}
            />



            <View style={__styles.radioRootView}>
              <MyText isLabel>Is show on list*</MyText>
              <View style={__styles.radioView}>
                <View style={__styles.radioItem}>
                  <MyCheckBox
                    title='Yes'
                    onPress={() => setData({ shownOnList: true })}
                    value={data?.shownOnList}
                  />
                </View>
                <View style={__styles.radioItem}>
                  <MyCheckBox
                    title='No'
                    onPress={() => setData({ shownOnList: false })}
                    value={!data?.shownOnList}
                  />
                </View>
              </View>
            </View>



            <MyInputs
              label='No. of Days*'
              value={data?.numberOfDays}
              onChangeText={(text) => setData({ numberOfDays: text })}
              keyboardType="number-pad"
            />


            <MyInputs
              label='Top Section Text'
              value={data?.topSectionText}
              onChangeText={(text) => setData({ topSectionText: text })}
            />


            <MyInputs
              label='Bottom Section Text'
              value={data?.bottomSectionText}
              onChangeText={(text) => setData({ bottomSectionText: text })}
            />

            <MyInputs
              label='Banner 1 Link'
              value={data?.banner1Link}
              onChangeText={(text) => setData({ banner1Link: text })}
            />

            <MyInputs
              label='Banner 1 Button Text'
              value={data?.banner1BtnText}
              onChangeText={(text) => setData({ banner1BtnText: text })}
            />

            <MyInputs
              label='Banner 2 Link'
              value={data?.banner2Link}
              onChangeText={(text) => setData({ banner2Link: text })}
            />

            <MyInputs
              label='Banner 2 Button Text'
              value={data?.banner2BtnText}
              onChangeText={(text) => setData({ banner2BtnText: text })}
            />


            <View style={__styles.radioRootView}>
              <MyText isLabel>Status</MyText>
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
                    title='Inactive'
                    onPress={() => setData({ status: false })}
                    value={!data?.status}
                  />
                </View>
              </View>
            </View>

            {!!item &&
              <MyInputs
                label='Order'
                value={data?.order}
                onChangeText={(text) => setData({ order: text })}
                keyboardType='number-pad'
              // onChangeText={(text) => setData({ banner2Link: text })}
              />}

            <View style={__styles.radioRootView}>
              <MyText isLabel>Is Purchase link Enable*</MyText>
              <View style={__styles.radioView}>
                <View style={__styles.radioItem}>
                  <MyCheckBox
                    title='Yes'
                    onPress={() => setData({ isPurchaseLinkEnabled: true })}
                    value={data?.isPurchaseLinkEnabled}
                  />
                </View>
                <View style={__styles.radioItem}>
                  <MyCheckBox
                    title='No'
                    onPress={() => setData({ isPurchaseLinkEnabled: false })}
                    value={!data?.isPurchaseLinkEnabled}
                  />
                </View>
              </View>
            </View>

            <Collapsible collapsed={!data.isPurchaseLinkEnabled}>
              <MyInputs
                label='Purchase Link *'
                value={data?.purchaseLink}
                onChangeText={(text) => setData({ purchaseLink: text })}
              />


              <UploadFileInput
                label='Upload Link Image *'
                subLabel='Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")'
                onImagePicked={(img) => setData({ purchaseLinkImage: img })}
                selectedImage={data.purchaseLinkImage}
                onRemoveBtnPress={() => setData({ purchaseLinkImage: null })}
              />
            </Collapsible>

            <UploadFileInput
              label='Upload Event Logo *'
              subLabel='Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")'
              onImagePicked={(img) => setData({ logo: img })}
              selectedImage={data.logo}
              onRemoveBtnPress={() => setData({ logo: "" })}
            />

            <UploadFileInput
              label='Upload Image *'
              subLabel='Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")'
              onImagePicked={(img) => setData({ image: img })}
              selectedImage={data.image}
              onRemoveBtnPress={() => setData({ image: "" })}
            />

            <UploadFileInput
              label='Upload Banner 1 Image'
              subLabel='Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")'
              onImagePicked={(img) => setData({ banner1: img })}
              selectedImage={data.banner1}
              onRemoveBtnPress={() => setData({ banner1: "" })}
            />

            <UploadFileInput
              label='Upload Banner 2 Image'
              subLabel='Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")'
              onImagePicked={(img) => setData({ banner2: img })}
              selectedImage={data.banner2}
              onRemoveBtnPress={() => setData({ banner2: "" })}
            />


            <MyInputs
              label='Viedo Embed Code'
              multiline
              value={data?.embedCode}
              onChangeText={(text) => setData({ embedCode: text })}
            />


            <MyInputs
              label='Short Description *'
              multiline
              value={data?.shortDesc}
              onChangeText={(text) => setData({ shortDesc: text })}
              limited
            />

            <Editor
              label='Detailed Description *'
              height={150}
              initialValue={data?.longDesc}

              onChange={(text) => setData({ longDesc: text })}
            />

          </View>}
        <MyButton
          title='Submit'
          onPress={onSubmit}
        />

      </KeyboardAwareScrollView>

      <MyLoader enable={loader} />
      <CalendarModal
        ref={calendarRef}
        onDateSelected={(date) => setData({ date: date })}
      />

      <OptionModalWithSearch
        optionList={templateList}
        title='Template'
        isVisible={isTemplateModalShown}
        closeModal={() => setTemplateModalShown(false)}
        filterTheList={(list, searchText) => {
          searchText = searchText.toLowerCase().trim();
          return list.filter(x => x.title.toLowerCase().includes(searchText))
        }}
        onSelected={(item) => {
          setData({
            selectedTemplate: item,
            title: !!item?.title ? item?.title : "",
            date: !!item.start_date ? moment(item.start_date, "YYYY-MM-DD") : ""
          })
          setTemplateModalShown(false)
        }}
      />
    </RootView>
  )
}

export default AddEditPortal;

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
    flex: 1
  },

})