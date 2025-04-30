import { View, Text, Dimensions, Pressable } from 'react-native'
import React, { createRef, useState } from 'react'
import ImageZoomer from '../../../components/ImageZoomer'
import ResponsiveImage2 from '../../../components/ResponsiveImage2'
import SwiperFlatList from 'react-native-swiper-flatlist'
import utilities from '../../../utilities'
import MyImage from '../../../components/MyImage'
import { fonts } from '../../../utilities/fonts'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'


const ImagesForFeed = ({ index, list, swiper }) => {

  const swiperRef = createRef();
  const listRef = createRef();
  const { S3_URL } = useSelector(selectUser)

  const [state, updateState] = useState({
    modalImages: [],
    selectedIndex: 0,
    index: !!index ? index : 0,
  })

  const setState = (update) => updateState({ ...state, ...update });


  const openImageZoomer = (ImageIndex) => {
    setState({ modalImages: list, selectedIndex: ImageIndex })
  }

  const swiperView = () => {
    return (
      <View>
        <View>
          <SwiperFlatList
            ref={this.swiperRef}
            autoplay={false}
            autoplayDelay={4}
            autoplayLoop
            index={index}
            data={list}
            pagingEnabled={false}
            onChangeIndex={this.onChangeIndex}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => openImageZoomer(index)}
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
      <View >
        <FlatList
          ref={listRef}
          data={list}
          horizontal={true}
          keyExtractor={(item) => item?.thumbnail_1}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => selectImage(index)}
              style={{ width: 100, height: 100, borderWidth: state.index == index ? 5 : 0, borderColor: colors.silver }}>
              <MyImage
                source={{ uri: S3_URL + item?.thumbnail_1 }}
                style={{ height: "100%", width: "100%" }}
                resizeMode="contain"
              />
            </Pressable>
          )}
        />
      </View>
    )
  }


  const length = list.length;
  return (
    <View style={{ width: "100%" }} >
      <ImageZoomer
        closeModal={() => setState({ modalImages: [], selectedIndex: 0 })}
        visible={state.modalImages.length > 0}
        list={state.modalImages}
        index={state.selectedIndex}
      />
      {length == 1 ? (
        <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(0)}>
          <ResponsiveImage2
            width={utilities.screenWidth() - 40}
            uri={S3_URL + list[0]?.thumbnail_1}
            style={{ alignSelf: "center" }}
          />
        </PressableWrapper>
      ) : length == 2 ? (
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(0)}>
            <ResponsiveImage2
              width={(utilities.screenWidth() - 45) / 2}
              uri={S3_URL + list[0]?.thumbnail_1}
            />
          </PressableWrapper>
          <View style={{ width: 10 }} />
          <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(1)}>
            <ResponsiveImage2
              width={(utilities.screenWidth() - 45) / 2}
              uri={S3_URL + list[1]?.thumbnail_1}
            />
          </PressableWrapper>
        </View>
      ) : length == 3 ? (
        <View >
          <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(0)}>
            <ResponsiveImage2
              width={Dimensions.get('window').width - 40}
              uri={S3_URL + list[0]?.thumbnail_1}
              style={{ alignSelf: "center" }}
            />
          </PressableWrapper>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 10 }}>
            <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(1)}>
              <ResponsiveImage2
                width={(utilities.screenWidth() - 45) / 2}
                uri={S3_URL + list[1]?.thumbnail_1}
              />
            </PressableWrapper>
            <View style={{ width: 10 }} />
            <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(2)}>
              <ResponsiveImage2
                width={(utilities.screenWidth() - 45) / 2}
                uri={S3_URL + list[2]?.thumbnail_1}

              />
            </PressableWrapper>
          </View>
        </View>
      ) : !!swiper == false ?
        length == 4 ? (
          < >
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
              <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(0)}>
                <MyImage
                  style={{ width: (utilities.screenWidth() - 45) / 2, aspectRatio: 1 }}
                  source={{ uri: S3_URL + list[0]?.thumbnail_1 }}
                />
              </PressableWrapper>
              <View style={{ width: 10 }} />
              <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(1)}>
                <MyImage
                  style={{ width: (utilities.screenWidth() - 45) / 2, aspectRatio: 1 }}
                  source={{ uri: S3_URL + list[1]?.thumbnail_1 }}
                />
              </PressableWrapper>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 5 }}>
              <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(2)}>
                <MyImage
                  style={{ width: (utilities.screenWidth() - 45) / 2, aspectRatio: 1 }}
                  source={{ uri: S3_URL + list[2]?.thumbnail_1 }}
                />
              </PressableWrapper>
              <View style={{ width: 10 }} />
              <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(0)}>
                <MyImage
                  style={{ width: (utilities.screenWidth() - 45) / 2, aspectRatio: 1 }}
                  source={{ uri: S3_URL + list[3]?.thumbnail_1 }}
                />
              </PressableWrapper>
            </View>
          </>
        )
          : length == 5 ? (
            <View>
              <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(0)}>
                <ResponsiveImage2
                  width={Dimensions.get('window').width - 40}
                  uri={S3_URL + list[0]?.thumbnail_1}
                  style={{ alignSelf: "center" }}
                />
              </PressableWrapper>
              <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 10, marginHorizontal: -10 }}>
                {list.map((x, i) => {
                  if (i != 0)
                    if (!!x?.thumbnail_1) {
                      return (
                        <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(i)}>
                          {/* <ResponsiveImage2
                            width={(utilities.screenWidth() - 40 )/ (length)}
                            uri={S3_URL + x.thumbnail_1}
                            style={{ aspectRatio: 1 }}
                          /> */}
                          <View style={{ width: utilities.screenWidth() / length, aspectRatio: 1, overflow: "hidden" }} >
                            <MyImage
                              source={{ uri: S3_URL + x.thumbnail_1 }}
                              style={{ aspectRatio: 1, width: "100%" }}
                            />
                          </View>
                        </PressableWrapper>
                      )
                    } else return null
                })}

              </View>
            </View>
          )
            : (
              <View >
                <PressableWrapper  >
                  <ResponsiveImage2
                    width={Dimensions.get('window').width - 40}
                    uri={S3_URL + list[0]?.thumbnail_1}
                    style={{ alignSelf: "center" }}
                  />
                </PressableWrapper>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 10 }}>
                  {list.map((x, i) => {
                    if (i != 0 && i <= 4) {
                      if (!!x?.thumbnail_1) {
                        return (
                          <PressableWrapper onPress={() => openImageZoomer(i)}  >
                            <View style={{ width: (Dimensions.get('window').width) / length, aspectRatio: 1, overflow: "hidden" }} >
                              <MyImage
                                source={{ uri: S3_URL + x.thumbnail_1 }}
                                style={{ aspectRatio: 1, width: "100%" }}
                              />
                              {i == 4 && (
                                <View style={{ backgroundColor: "#000000AA", position: "absolute", height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }} >
                                  <MyText>{`${(length - i)}+`}</MyText>
                                </View >
                              )}
                            </View>
                          </PressableWrapper>
                        )
                      }
                      else return null
                    }
                  })}
                </View>
              </View>
            )
        : swiperView()
      }

    </View>
  )
}

export default ImagesForFeed



const PressableWrapper = ({ swiper, children, onPress }) => {
  if (!!swiper) {
    return (
      <Pressable onPress={onPress} style={{ borderRadius: 10, overflow: "hidden" }}>
        {children}
      </Pressable>
    )
  }
  else {
    return (
      <Pressable onPress={onPress} style={{ borderRadius: 10, overflow: "hidden" }}>
        {children}
      </Pressable>
    )
  }
}
