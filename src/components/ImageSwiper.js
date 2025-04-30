import { View, Text, FlatList, Pressable, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import MyImage from './MyImage'
import SwiperFlatList from 'react-native-swiper-flatlist'
import { colors } from '../utilities/colors'
import ImageZoomer from './ImageZoomer'
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/reducers/userSlice'

const ImageSwiper = ({ list = [] }) => {
  const [selectedIndex, setIndex] = useState(0);
  const { S3_URL } = useSelector(selectUser)
  const [imageForZoom, setImageForZoom] = useState("");
  const swiperRef = useRef();

  const swiperView = () => {
    return (
      <View>
        <View>
          <SwiperFlatList
            ref={swiperRef}
            autoplay={!imageForZoom}
            // index={selectedIndex}
            autoplayDelay={3}
            autoplayLoop
            data={list}
            pagingEnabled={false}
            onChangeIndex={(change) => {
              setIndex(change?.index);
            }}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => setImageForZoom(item?.thumbnail_1)}
                style={{ width: Dimensions.get('window').width, height: 400 }}>
                <MyImage
                  source={{ uri: S3_URL + item?.thumbnail_1 }}
                  style={{ height: "100%", width: "100%" }}
                  resizeMode="contain"
                />
              </Pressable>
            )}
          />
        </View>
        {imagesList()}
      </View>)
  }

  const imagesList = () => {
    return (
      <View style={{ marginTop: 10 }} >
        <FlatList
          data={list}
          horizontal={true}
          keyExtractor={(item) => item?.thumbnail_1}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => {
                swiperRef?.current.scrollToIndex({ index: index, animated: true });
                setIndex(index);
              }}
              style={{ width: 70, height: 70, borderWidth: 5, borderColor: index == selectedIndex ? colors.primary : colors.transparent }}>
              <MyImage
                source={{ uri: S3_URL + item?.thumbnail_2 }}
                style={{ height: "100%", width: "100%" }}
                resizeMode="contain"
              />
            </Pressable>
          )}
        />
      </View>
    )
  }


  return (
    <View style={{ marginTop: 10 }}>
      {swiperView()}
      <ImageZoomer
        closeModal={() => setImageForZoom("")}
        visible={!!imageForZoom}
        url={imageForZoom}
      />

    </View>
  )
}

export default ImageSwiper
