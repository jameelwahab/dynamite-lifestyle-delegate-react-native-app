import {
  View,
  Pressable,
  Image,
  Dimensions,
  ActivityIndicator,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import { S3_URL } from '../utilities/constants';
import { icons } from '../utilities/icons';
import { colors } from '../utilities/colors';
import { SimpleLoader } from './MyLoader';
import List from '../screens/Notes/List';
import MyText from './MyText';
import downloadImage from '../functions/downloadImage';
import Toast from 'react-native-toast-message';

const ImageZoomer = ({
  visible,
  closeModal,
  color = "",
  list,
  index = 0,
  url,
  noUrl = false,
}) => {
  const [curIndex, setIndex] = useState(0);
  useEffect(() => {
    setIndex(index)
  }, [index])


  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={() => closeModal()}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      backdropOpacity={0}
      animationIn="zoomIn"
      animationOut={'zoomOut'}
      animationInTiming={300}
      animationOutTiming={300}
      style={{
        margin: 0,
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: !!color ? color : colors.secondary,
          justifyContent: 'center',

        }}>
        <View style={__styles.buttonRootView} >
          {!!url && !!noUrl == false ?
            <TouchableOpacity
              onPress={() => downloadImage(S3_URL + url)}>
              <View style={__styles.buttonView}>
                {icons.download(colors.black, 20)}
              </View>
            </TouchableOpacity> : <View />}
          <TouchableOpacity
            onPress={() => closeModal()}>
            <View style={__styles.buttonView}>
              {icons.crosss(colors.black, 20)}
            </View>
          </TouchableOpacity>
        </View>
        {!!visible && (
          <View style={{ flex: 1 }}>
            {!!list &&
              <View style={{ position: "absolute", bottom: Platform.OS == "ios" ? 30 : 0, alignItems: "center", left: 0, right: 0 }}>
                <MyText fontSize={18} color={colors.white} >{(curIndex + 1) + "/" + list.length}</MyText>
              </View>
            }
            <ImageViewer
              style={{
                width: Dimensions.get('screen').width,
              }}
              // doubleClickInterval={1}
              backgroundColor={'transparent'}
              loadingRender={() => (
                // <ActivityIndicator color={colors.golden} size={'large'} />
                <SimpleLoader />
              )}
              onChange={(index) => setIndex(index)}
              saveToLocalByLongPress={false}
              imageUrls={!!list ?
                list.map(x => ({ url: S3_URL + x?.thumbnail_1 })) :
                [
                  { url: noUrl ? url : S3_URL + url },
                ]}
              index={!!index ? index : 0}
              useNativeDriver={true}
              renderIndicator={() => <></>}
            // renderArrowLeft={(!!list && curIndex != 0) ? () => icons.backwardArrow(30, colors.white) : undefined}
            // renderArrowRight={(!!list && curIndex != list.length - 1) ? () => icons.forwardArrow(30, colors.white) : undefined}
            />

            {/* <CustomImage
            resizeMode={'contain'}
            source={{uri: fileURL + url}}
            style={{width: '100%', height: undefined, aspectRatio: 1}}
          /> */}
          </View>
        )}
      </View>
      {visible && <Toast />}
    </Modal>
  );
};

export default ImageZoomer;


const __styles = StyleSheet.create({
  buttonRootView: {
    top: Platform.OS == 'ios' ? 50 : 10,
    left: 10,
    right: 10,
    // right: Platform.OS == 'ios' ? 10 : 10,
    position: 'absolute',
    zIndex: 999,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"

  },


  buttonView: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
})