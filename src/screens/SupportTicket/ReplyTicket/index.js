import { View, Text, TouchableOpacity, ScrollView, FlatList, Pressable, Image } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import Dialog from 'react-native-dialog';
import { colors } from '../../../utilities/colors';
import { icons } from '../../../utilities/icons';
import utilities from '../../../utilities';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import ImageUploadModal from '../../../components/ImageUploadModal';
import { MyButton } from '../../../components/MyButton';
import Editor from '../../../components/Editor';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import { ADD_TICKET_COMMENT, EDIT_TICKET_COMMENT, UPLOAD_TICKET_IMAGE } from '../../../DAL';
import showToast from '../../../functions/showToast';
import MyLoader from '../../../components/MyLoader';
import { S3_URL } from '../../../utilities/constants';
import MyImage from '../../../components/MyImage';



const oneFourthOfScreen = (utilities.windowWidth() - 20) / 4;

const TicketReply = ({ navigation, route }) => {
  const { token } = useSelector(selectUser)
  const { msg } = route?.params;
  const [content, setContent] = useState(!!msg ? msg?.message : "");
  const [images, setImages] = useState([{ type: "button" }]);
  const [msgImages, setMsgImages] = useState([]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const [loader, setLoader] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const removeImage = (index) => {
    images.splice(index, 1);
    setImages([...images]);
  }

  useEffect(() => {
    if (!!msg) {
      setImages([...images, ...msg?.comment_image]);
    }
    setShowEditor(true)
  }, [])



  const EditorView = useCallback(() => {
    return (
      <Editor
        autoResonderMsgs={route?.params?.autoResonderMsgs}
        initialValue={content}
        onChange={(text) => setContent(text)}
      />
    )
  }, [content])


  const btn_send = async () => {
    if (content.trim() == "") {
      showToast({ body: "message is not allowed to be empty", title: "Alert", type: "info" });
      return
    }
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
    console.log(!!msg, "!!msg")
    if (!!msg) {
      res = await EDIT_TICKET_COMMENT({
        token, navigation,
        commentId: msg._id,
        body: {
          comment_image: [...msgImages, ...imagesLink],
          message: content
        },
      });
    } else {
      res = await ADD_TICKET_COMMENT({
        token, navigation, body: {
          comment_image: [...msgImages, ...imagesLink],
          support_ticket: route?.params?.ticketId,
          message: content,
        }
      });
    }
    if (res?.code == 200) {
      showToast({ title: res.message, type: "success" })
      setLoader(false);
      route.params?.addMessage?.(res?.support_ticket_comment)
      route.params?.updateMsg?.(res?.support_ticket_comemnt)
      navigation.goBack()
    } else {
      setLoader(false);
    }


  }




  const HeaderView = () => {
    return (
      <View>
        {showEditor && EditorView()}
        <View style={{ paddingVertical: 10 }}>
          <MyText color={colors.primary} fontSize={16} type='medium' >Upload Images
            <MyText color={colors.primary} fontSize={12}> (1000x670)</MyText>
          </MyText>
        </View>
      </View>
    )
  }

  return (
    <RootView title='Your Reply' >
      <View style={{ flex: 1 }}>
        <KeyboardAwareFlatList
          ListHeaderComponent={HeaderView()}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
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
              return (
                <View
                  style={{ width: oneFourthOfScreen, height: oneFourthOfScreen }}>
                  <View style={{ margin: 5, flex: 1, borderRadius: 10, alignItems: "center", justifyContent: "center", }}>
                    <MyImage
                      source={{
                        uri: !!item?.thumbnail_1 ?
                          S3_URL + item?.thumbnail_1 :
                          item.uri
                      }}
                      style={{ height: "100%", width: '100%', }}
                      imageStyle={{ borderRadius: 10, }}
                    />

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
      </View>
      <View style={{ marginLeft: "70%", position: "absolute", bottom: 0, right: 15 }}>
        <MyButton title={!!msg ? "Update" : 'Send'} invert onPress={btn_send} />
      </View>


      <MyLoader enable={loader} />

      <ImageUploadModal
        isVisible={isImageModalVisible}
        onImagePicked={(image) => setImages([...images, ...image])}
        closeModal={() => setIsImageModalVisible(false)}
        multiple={true}
      />
    </RootView>
  )
}

export default TicketReply