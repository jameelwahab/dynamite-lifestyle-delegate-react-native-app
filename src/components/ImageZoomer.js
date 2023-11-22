import {
  View,
  Pressable,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import { S3_URL } from '../utilities/constants';
import { icons } from '../utilities/icons';
import { colors } from '../utilities/colors';

const ImageZoomer = ({
  visible,
  closeModal,
  color="",
  list,
  index = 0,
  url,
  noUrl = false,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={() => closeModal()}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      backdropOpacity={0}
      animationIn="zoomIn"
      animationOut={'zoomOut'}
      style={{
        margin: 0,
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: !!color ? color : colors.secondary,
          // backgroundColor:"#000000DD",
          justifyContent: 'center',
        }}>
        <Pressable
          onPress={() => closeModal()}
          style={{
            top: Platform.OS == 'ios' ? 50 : 10,
            right: Platform.OS == 'ios' ? 10 : 10,
            position: 'absolute',
            zIndex: 999,
          }}>
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 50,
              backgroundColor:colors.black,
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
            }}>
            {icons.crosssWithCircle()}
          </View>
        </Pressable>
        {!!visible && (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ImageViewer
              style={{
                width: Dimensions.get('screen').width,
                // width:200,
                // height:200
                // aspectRatio: 1,
              }}
              // doubleClickInterval={1}
              backgroundColor={'transparent'}
              loadingRender={() => (
                <ActivityIndicator color={colors.golden} size={'large'} />
              )}
              saveToLocalByLongPress={false}
              imageUrls={!!list ? list : [
                { url: noUrl ? url : S3_URL + url },
              ]}
              index={!!index ? index : 0}
              useNativeDriver={true}
              renderIndicator={() => <></>}
            />

            {/* <CustomImage
            resizeMode={'contain'}
            source={{uri: fileURL + url}}
            style={{width: '100%', height: undefined, aspectRatio: 1}}
          /> */}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ImageZoomer;
