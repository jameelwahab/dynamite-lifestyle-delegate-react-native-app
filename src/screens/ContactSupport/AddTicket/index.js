import { View, Text, ScrollView, FlatList, TouchableOpacity, Pressable, SafeAreaView, TouchableHighlight, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyTouchableInput from '../../../components/MyTouchableInput';
import utilities from '../../../utilities';
import { colors } from '../../../utilities/colors';
import { icons } from '../../../utilities/icons';
import ImageUploadModal from '../../../components/ImageUploadModal';
import ImageZoomer from '../../../components/ImageZoomer';
import MyImage from '../../../components/MyImage';
import { S3_URL } from '../../../utilities/constants';
import MyText from '../../../components/MyText';
import { MyButton } from '../../../components/MyButton';
import Modal from 'react-native-modal';
import { ADD_TICKET_CONTECT_SUPPORT, DEPARTMENT_LIST_FOR_DELEGATE, UPLOAD_TICKET_IMAGE } from '../../../DAL';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import showToast from '../../../functions/showToast';
import MyLoader from '../../../components/MyLoader';
import OptionModal from '../../../components/OptionModal';
import { EDIT_TICKET_CONTECT_SUPPORT } from '../../../DAL/ContactSupport';
import MyInputs from '../../../components/MyInputs';
import getFileIconByType from '../../../functions/getFileIconByType';
import openUrl from '../../../functions/openUrl';
import FileViewer from "react-native-file-viewer";


const oneFourthOfScreen = (utilities.windowWidth() - 40) / 4;
const AddTicket = ({ navigation, route }) => {
  const { token } = useSelector(selectUser);
  const { ticket: oldTicket } = route.params;
  const [loader, setLoader] = useState(false);
  const [images, setImages] = useState([{ type: "button" }]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const [modalImage, setModalImage] = useState({ uri: "", noUrl: false });
  const [deparment, setDeparment] = useState(!!oldTicket ? oldTicket?.department : null);
  const [isDepartmentModalShown, setIsDepartmentModalShown] = useState(false)
  const [departmentList, setDepartmentList] = useState([]);
  const [subject, setSubject] = useState(!!oldTicket ? oldTicket?.subject : "");
  const [description, setDescription] = useState(!!oldTicket ? oldTicket?.description : "");



  const getDepartmentList = async () => {
    let res = await DEPARTMENT_LIST_FOR_DELEGATE({ navigation, token });
    if (res.code == 200) {
      setDepartmentList(res?.department);
    }
  }


  const addTicket = async () => {
    if (subject.trim() == "") {
      showToast({ body: "Please enter your ticket subject", type: "info" })
    } else if (!!deparment == false) {
      showToast({ body: "Please select your ticket department", type: "info" })
    } else if (description.trim() == "") {
      showToast({ body: "Please enter your ticket description", type: "info" })
    } else {
      setLoader(true);
      let imagesToUpload = [];
      let msgImages = [];
      images.forEach((image, index) => {
        if (index != 0) {
          if (!!image?.thumbnail_1) {
            msgImages.push(image);
          } else {
            let body = new FormData();
            body.append("image", image)
            imagesToUpload.push(UPLOAD_TICKET_IMAGE({
              token, navigation, body
            }));
          }
        }
      })
      let uploadedImages = [];
      let imagesLink = [];
      if (imagesToUpload.length > 0) {
        uploadedImages = await Promise.all(imagesToUpload);
        for (let i = 0; i < uploadedImages.length; i++) {
          if (uploadedImages[i].code == 200) {
            imagesLink.push(uploadedImages[i].image_path);
          } else {
            showToast({ title: "Image Upload Failed", body: uploadedImages[i].message, type: "error" });
            setLoader(false)
            return
          }
        }
      }

      let res;
      if (!!oldTicket) {
        res = await EDIT_TICKET_CONTECT_SUPPORT({
          token, navigation, body: {
            ticket_images: [...msgImages, ...imagesLink],
            department: deparment._id,
            subject: subject.trim(),
            description: description.trim()
          },
          ticketId: oldTicket?._id
        });
      } else {
        res = await ADD_TICKET_CONTECT_SUPPORT({
          token, navigation, body: {
            ticket_images: [...msgImages, ...imagesLink],
            department: deparment._id,
            subject: subject.trim(),
            description: description.trim()
          }
        });
      }

      if (res?.code == 200) {
        showToast({ title: res.message, type: "success" })
        route?.params?.refresh?.()
        navigation.goBack()
      } else {
        setLoader(false);
      }
    }
  }

  useEffect(() => {
    if (!!oldTicket) {
      setImages([...images, ...oldTicket?.ticket_images]);
    }
    getDepartmentList()
  }, [])



  const removeImage = (index) => {
    images.splice(index, 1);
    setImages([...images]);
  }



  const departmentModal = () => {
    return (
      <Modal
        isVisible={isDepartmentModalShown}
        onBackdropPress={() => setIsDepartmentModalShown(false)}
        onBackButtonPress={() => setIsDepartmentModalShown(false)}
        useNativeDriverForBackdrop={true}
        animationInTiming={300}
        animationOutTiming={300}
        style={{ margin: 0 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, marginTop: "auto", borderTopLeftRadius: 10, borderTopRightRadius: 10, }} >
          <View style={{ height: utilities.screenHeight() * 0.8, }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText }}>
              <View>
                <MyText fontSize={18} type='medium' >Departments</MyText>
                <MyText color={colors.lightText} fontSize={12}>Select your department from list below</MyText>
              </View>
              <Pressable
                onPress={() => setIsDepartmentModalShown(false)}
              >
                {icons.crosssWithCircle()}
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                data={departmentList}
                contentContainerStyle={{ paddingVertical: 10 }}
                indicatorStyle='white'
                renderItem={({ item, index }) => {
                  return (
                    <TouchableHighlight
                      onPress={() => {
                        setDeparment(item);
                        setIsDepartmentModalShown(false)
                      }}
                      underlayColor={colors.secondary} >
                      <View style={{ paddingVertical: 10, paddingLeft: 20, backgroundColor: deparment?._id == item?._id ? "#FFFFFF11" : colors.transparent }}>
                        <MyText fontSize={16} >{item?.title}</MyText>
                      </View>
                    </TouchableHighlight>
                  )
                }
                }
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>)
  }


  const HeaderView = () => {
    return (
      <View>
        <MyInputs
          label='Ticket Subject*'
          value={subject}
          onChangeText={(text) => setSubject(text)}
        />


        <MyTouchableInput
          label='Department*'
          onPress={() => setIsDepartmentModalShown(true)}
          value={deparment?.title}
        />

        <MyInputs
          label='Description*'
          multiline
          value={description}
          onChangeText={(text) => setDescription(text)}
        />


        <MyText isLabel >{"Attachments (1000X670)"}</MyText>
      </View>
    )
  }

  const viewButton = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <MyButton onPress={addTicket} invert title='Save' />
      </View>
    )
  }


  return (
    <RootView title='New Ticket' >

      <FlatList
        ListHeaderComponent={HeaderView()}
        contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 10 }}
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={viewButton}
        data={images}
        numColumns={4}
        renderItem={({ item, index }) => {
          if (item?.type == "button") {
            return (
              <View
                style={{ width: oneFourthOfScreen, height: oneFourthOfScreen }}>
                <TouchableOpacity
                  onPress={() => setIsImageModalVisible(true)}
                  style={{ margin: 5, backgroundColor: colors.lightPrimary2, flex: 1, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                  {icons.upload()}
                </TouchableOpacity>
              </View>
            )
          } else {
            let uri = !!item?.thumbnail_1 ? S3_URL + item?.thumbnail_1 : item.uri;
            let fileIcon = getFileIconByType(uri, item?.name || undefined);
            return (
              <View
                style={{ width: oneFourthOfScreen, height: oneFourthOfScreen }}>
                <View style={{ margin: 5, flex: 1, borderRadius: 10, alignItems: "center", justifyContent: "center", }}>
                  <Pressable onPress={() => {
                    if (fileIcon) {
                      if (item?.thumbnail_1) {
                        openUrl(uri)
                      } else {
                        FileViewer.open(uri)
                      }
                    }
                    else if (!!item?.thumbnail_1) {
                      setModalImage({ uri: item?.thumbnail_1, noUrl: false });
                    } else {
                      setModalImage({ uri: item.uri, noUrl: true });
                    }
                  }}
                    style={{ height: "100%", width: '100%', }}
                  >
                    {fileIcon ?
                      <View style={{ height: "100%", width: '100%', alignItems: "center", justifyContent: "center", backgroundColor: colors.secondary, borderRadius: 10 }}>
                        <Image
                          source={fileIcon}
                          resizeMode="contain"
                          style={{ borderRadius: 10, height: "80%", width: "80%", }}
                        />
                      </View> :
                      <MyImage
                        source={{
                          uri: !!item?.thumbnail_1 ?
                            S3_URL + item?.thumbnail_1 :
                            item.uri
                        }}
                        style={{ height: "100%", width: '100%', }}
                        imageStyle={{ borderRadius: 10, }}
                      />}
                  </Pressable>

                  <Pressable
                    onPress={() => removeImage(index)}
                    style={{ position: "absolute", height: 25, width: 25, backgroundColor: colors.delete, alignItems: "center", justifyContent: "center", top: -5, right: -5, borderRadius: 25 / 2 }}
                  >
                    {icons.crosss()}
                  </Pressable>
                </View>
              </View>
            )
          }
        }}
      />



      {departmentModal()}


      <ImageUploadModal
        isVisible={isImageModalVisible}
        onImagePicked={(image) => setImages([...images, ...image])}
        closeModal={() => setIsImageModalVisible(false)}
        multiple={true}
        enableDocument={true}
      />
      <ImageZoomer
        closeModal={() => setModalImage({ isUrl: false, uri: "" })}
        visible={!!modalImage.uri}
        url={modalImage.uri}
        noUrl={modalImage.noUrl}
      />


      <MyLoader enable={loader} />
    </RootView>
  )
}

export default AddTicket;

