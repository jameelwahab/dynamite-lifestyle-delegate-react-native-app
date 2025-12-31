import {View, Dimensions, Pressable, StyleSheet, FlatList} from 'react-native';
import React, {createRef, useState} from 'react';
import ImageZoomer from '../../../components/ImageZoomer';
import ResponsiveImage2 from '../../../components/ResponsiveImage2';
import SwiperFlatList from 'react-native-swiper-flatlist';
import utilities from '../../../utilities';
import MyImage from '../../../components/MyImage';
import MyText from '../../../components/MyText';
import {colors} from '../../../utilities/colors';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';

const ImagesForFeed = ({index, list, swiper}) => {
  const listRef = createRef();
  const {S3_URL} = useSelector(selectUser);

  const [state, updateState] = useState({
    modalImages: [],
    selectedIndex: 0,
    index: !!index ? index : 0,
  });

  const setState = update => updateState({...state, ...update});

  const openImageZoomer = ImageIndex => {
    setState({modalImages: list, selectedIndex: ImageIndex});
  };

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
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => openImageZoomer(index)}
                style={styles.swiperImageContainer}>
                <MyImage
                  source={{uri: S3_URL + item?.thumbnail_1}}
                  style={styles.fullSize}
                  resizeMode="contain"
                />
              </Pressable>
            )}
          />
        </View>
        {imagesList()}
      </View>
    );
  };

  const imagesList = () => {
    return (
      <View>
        <FlatList
          ref={listRef}
          data={list}
          horizontal={true}
          keyExtractor={item => item?.thumbnail_1}
          renderItem={({item, index}) => (
            <Pressable
              onPress={() => selectImage(index)}
              style={[
                styles.thumbnailItem,
                {borderWidth: state.index == index ? 5 : 0},
              ]}>
              <MyImage
                source={{uri: S3_URL + item?.thumbnail_1}}
                style={styles.fullSize}
                resizeMode="contain"
              />
            </Pressable>
          )}
        />
      </View>
    );
  };

  const length = list.length;
  return (
    <View style={styles.fullWidth}>
      <ImageZoomer
        closeModal={() => setState({modalImages: [], selectedIndex: 0})}
        visible={state.modalImages.length > 0}
        list={state.modalImages}
        index={state.selectedIndex}
      />
      {length == 1 ? (
        <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(0)}>
          <ResponsiveImage2
            width={utilities.screenWidth() - 40}
            uri={S3_URL + list[0]?.thumbnail_1}
            style={styles.alignCenter}
          />
        </PressableWrapper>
      ) : length == 2 ? (
        <View style={styles.rowSpaceEvenly}>
          <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(0)}>
            <ResponsiveImage2
              width={(utilities.screenWidth() - 45) / 2}
              uri={S3_URL + list[0]?.thumbnail_1}
            />
          </PressableWrapper>
          <View style={styles.spacer10} />
          <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(1)}>
            <ResponsiveImage2
              width={(utilities.screenWidth() - 45) / 2}
              uri={S3_URL + list[1]?.thumbnail_1}
            />
          </PressableWrapper>
        </View>
      ) : length == 3 ? (
        <View>
          <PressableWrapper swiper={swiper} onPress={() => openImageZoomer(0)}>
            <ResponsiveImage2
              width={Dimensions.get('window').width - 40}
              uri={S3_URL + list[0]?.thumbnail_1}
              style={styles.alignCenter}
            />
          </PressableWrapper>
          <View style={styles.rowSpaceEvenlyMarginTop10}>
            <PressableWrapper
              swiper={swiper}
              onPress={() => openImageZoomer(1)}>
              <ResponsiveImage2
                width={(utilities.screenWidth() - 45) / 2}
                uri={S3_URL + list[1]?.thumbnail_1}
              />
            </PressableWrapper>
            <View style={styles.spacer10} />
            <PressableWrapper
              swiper={swiper}
              onPress={() => openImageZoomer(2)}>
              <ResponsiveImage2
                width={(utilities.screenWidth() - 45) / 2}
                uri={S3_URL + list[2]?.thumbnail_1}
              />
            </PressableWrapper>
          </View>
        </View>
      ) : !!swiper == false ? (
        length == 4 ? (
          <>
            <View style={styles.rowSpaceEvenly}>
              <PressableWrapper
                swiper={swiper}
                onPress={() => openImageZoomer(0)}>
                <MyImage
                  style={[
                    styles.halfWidthAspectRatio,
                    {width: (utilities.screenWidth() - 45) / 2},
                  ]}
                  source={{uri: S3_URL + list[0]?.thumbnail_1}}
                />
              </PressableWrapper>
              <View style={styles.spacer10} />
              <PressableWrapper
                swiper={swiper}
                onPress={() => openImageZoomer(1)}>
                <MyImage
                  style={[
                    styles.halfWidthAspectRatio,
                    {width: (utilities.screenWidth() - 45) / 2},
                  ]}
                  source={{uri: S3_URL + list[1]?.thumbnail_1}}
                />
              </PressableWrapper>
            </View>
            <View style={styles.rowSpaceEvenlyMarginTop5}>
              <PressableWrapper
                swiper={swiper}
                onPress={() => openImageZoomer(2)}>
                <MyImage
                  style={[
                    styles.halfWidthAspectRatio,
                    {width: (utilities.screenWidth() - 45) / 2},
                  ]}
                  source={{uri: S3_URL + list[2]?.thumbnail_1}}
                />
              </PressableWrapper>
              <View style={styles.spacer10} />
              <PressableWrapper
                swiper={swiper}
                onPress={() => openImageZoomer(0)}>
                <MyImage
                  style={[
                    styles.halfWidthAspectRatio,
                    {width: (utilities.screenWidth() - 45) / 2},
                  ]}
                  source={{uri: S3_URL + list[3]?.thumbnail_1}}
                />
              </PressableWrapper>
            </View>
          </>
        ) : length == 5 ? (
          <View>
            <PressableWrapper
              swiper={swiper}
              onPress={() => openImageZoomer(0)}>
              <ResponsiveImage2
                width={Dimensions.get('window').width - 40}
                uri={S3_URL + list[0]?.thumbnail_1}
                style={styles.alignCenter}
              />
            </PressableWrapper>
            <View style={styles.rowSpaceEvenlyMarginTopNegativeMargin}>
              {list.map((x, i) => {
                if (i != 0)
                  if (!!x?.thumbnail_1) {
                    return (
                      <PressableWrapper
                        swiper={swiper}
                        onPress={() => openImageZoomer(i)}>
                        {/* <ResponsiveImage2
                            width={(utilities.screenWidth() - 40 )/ (length)}
                            uri={S3_URL + x.thumbnail_1}
                            style={{ aspectRatio: 1 }}
                          /> */}
                        <View
                          style={[
                            styles.gridImageContainer,
                            {width: utilities.screenWidth() / length},
                          ]}>
                          <MyImage
                            source={{uri: S3_URL + x.thumbnail_1}}
                            style={styles.aspectRatioFullWidth}
                          />
                        </View>
                      </PressableWrapper>
                    );
                  } else return null;
              })}
            </View>
          </View>
        ) : (
          <View>
            <PressableWrapper>
              <ResponsiveImage2
                width={Dimensions.get('window').width - 40}
                uri={S3_URL + list[0]?.thumbnail_1}
                style={styles.alignCenter}
              />
            </PressableWrapper>
            <View style={styles.rowSpaceEvenlyMarginTop10}>
              {list.map((x, i) => {
                if (i != 0 && i <= 4) {
                  if (!!x?.thumbnail_1) {
                    return (
                      <PressableWrapper onPress={() => openImageZoomer(i)}>
                        <View
                          style={[
                            styles.gridImageContainer,
                            {width: Dimensions.get('window').width / length},
                          ]}>
                          <MyImage
                            source={{uri: S3_URL + x.thumbnail_1}}
                            style={styles.aspectRatioFullWidth}
                          />
                          {i == 4 && (
                            <View style={styles.imageOverlay}>
                              <MyText>{`${length - i}+`}</MyText>
                            </View>
                          )}
                        </View>
                      </PressableWrapper>
                    );
                  } else return null;
                }
              })}
            </View>
          </View>
        )
      ) : (
        swiperView()
      )}
    </View>
  );
};

export default ImagesForFeed;

const PressableWrapper = ({swiper, children, onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.pressableWrapper}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  fullSize: {
    height: '100%',
    width: '100%',
  },
  swiperImageContainer: {
    width: Dimensions.get('window').width,
    height: 400,
  },
  thumbnailItem: {
    width: 100,
    height: 100,
    borderColor: colors.silver,
  },
  alignCenter: {
    alignSelf: 'center',
  },
  rowSpaceEvenly: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  rowSpaceEvenlyMarginTop10: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  rowSpaceEvenlyMarginTop5: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 5,
  },
  rowSpaceEvenlyMarginTopNegativeMargin: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    marginHorizontal: -10,
  },
  spacer10: {
    width: 10,
  },
  halfWidthAspectRatio: {
    aspectRatio: 1,
  },
  gridImageContainer: {
    aspectRatio: 1,
    overflow: 'hidden',
  },
  aspectRatioFullWidth: {
    aspectRatio: 1,
    width: '100%',
  },
  imageOverlay: {
    backgroundColor: '#000000AA',
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressableWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});
