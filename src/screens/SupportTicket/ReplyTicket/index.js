import { View, Text, TouchableOpacity, ScrollView, FlatList, Pressable, Image } from 'react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
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



const oneFourthOfScreen = (utilities.windowWidth() - 20) / 4;

const TicketReply = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([{ type: "button" }]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  


  // console.log(color, "intial color")
  const removeImage = (index) => {
    images.splice(index, 1);
    setImages([...images]);
  }

  // const updateColor = (h) => {
  //   console.log(color, "color")
  //   console.log({ ...color, h }, "Ammar")
  //   setColor({ ...color, h })
  // }

  const EditorView = useCallback(() => {
    return (
      <Editor
        initialValue={content}
        onChange={(text) => setContent(text)}
      />
    )
  }, [content])




  const HeaderView = () => {
    return (
      <View>
        {EditorView()}
        <View style={{ paddingVertical: 10 }}>
          <MyText color={colors.primary} fontSize={16} type='medium' >Upload Images
            <MyText color={colors.primary} fontSize={12}> (1000x670)</MyText>
          </MyText>
        </View>
      </View>
    )
  }

  return (
    <RootView title='Your Reply'>
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
                    <Image
                      source={{ uri: item.uri }} style={{ height: "100%", width: '100%', borderRadius: 10, }} />

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
        <MyButton title='Send' invert />
      </View>


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