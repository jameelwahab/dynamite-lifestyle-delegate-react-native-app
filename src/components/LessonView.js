import {Pressable, StyleSheet, Text, View} from 'react-native';
import {fonts} from '../utilities/fonts';
import {colors} from '../utilities/colors';
import {useState} from 'react';
import MyImage from './MyImage';
import {MenuButton} from './MyButton';
import MyText from './MyText';
import ResponsiveImage3 from './ResponsiveImage3';
import {main, textSize} from '../utilities/styles';
import CollapseText from './CollapseText';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/reducers/userSlice';

const LessonView = ({
  title,
  style,
  heading,
  icon,
  missionDetail = false,
  desc,
  descView,
  handleClick,
  image,
  handlePress,
  duration,
  durationText,
  numberOfTitleLines = 2,
  showMenu = false,
}) => {
  const {S3_URL} = useSelector(selectUser);
  const [dynamicNumberOfTitleLines, setDynamicNumberOfTitleLines] = useState(1);
  return (
    <>
      {icon && (
        <View style={styles.icon_container}>
          <MyImage
            source={{uri: S3_URL + icon}}
            style={styles.icon}
            resizeMode="contain"
          />
          <View style={styles.iconTextWrapper}>
            <Text style={[main.title, styles.titleUppercase]}>{title}</Text>
          </View>
        </View>
      )}
      <Pressable onPress={handlePress}>
        <View
          style={[
            styles.container,
            style,
            !missionDetail && styles.containerSecondary,
          ]}>
          <View style={styles.imageWrapper}>
            {image && (
              <View>
                <ResponsiveImage3
                  width={150}
                  source={{uri: S3_URL + image}}
                  defaultSize={{width: 150, height: 85}}
                  style={styles.responsiveImage}
                />
                {(duration || durationText) && (
                  <View style={styles.imgTag}>
                    <MyText fontSize={10} type="medium" color={colors.black}>
                      {durationText ? durationText : duration + ' Days'}
                    </MyText>
                  </View>
                )}
              </View>
            )}
          </View>

          <View
            style={[
              styles.contentWrapper,
              image ? styles.contentWithImage : styles.contentWithoutImage,
            ]}>
            <View
              style={[
                styles.headingRow,
                showMenu
                  ? styles.headingRowWithMenu
                  : styles.headingRowWithoutMenu,
              ]}>
              {!!heading && (
                <Text
                  onTextLayout={({nativeEvent: {lines}}) => {
                    setDynamicNumberOfTitleLines(lines.length);
                  }}
                  numberOfLines={numberOfTitleLines}
                  style={[main.title]}>
                  {heading}
                </Text>
              )}
              {!!showMenu && (
                <MenuButton
                  marginHorizontal={0}
                  onPress={handleClick}
                  size={20}
                />
              )}
            </View>
            {descView ? (
              descView()
            ) : desc ? (
              <View style={styles.descWrapper}>
                <CollapseText
                  numOfLines={
                    !missionDetail
                      ? dynamicNumberOfTitleLines > 1
                        ? 2
                        : 3
                      : 100
                  }
                  disable={missionDetail}
                  desc={desc}
                  style={main.miniDesc}
                />
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
  },
  containerSecondary: {
    backgroundColor: colors.secondary,
  },
  icon_container: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  iconTextWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  titleUppercase: {
    textTransform: 'uppercase',
  },
  icon: {
    width: 22,
    height: 22,
  },
  imageWrapper: {
    overflow: 'hidden',
    position: 'relative',
  },
  responsiveImage: {
    width: '100%',
  },
  img: {
    width: 140,
    height: 100,
  },
  imgTag: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: colors.lightText2,
  },
  imgTitle: {
    fontSize: 10,
    color: 'black',
  },
  contentWrapper: {
    width: '100%',
    paddingVertical: 1,
    flex: 1,
  },
  contentWithImage: {
    paddingHorizontal: 5,
  },
  contentWithoutImage: {
    paddingHorizontal: 0,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  headingRowWithMenu: {
    paddingVertical: 5,
  },
  headingRowWithoutMenu: {
    paddingVertical: 0,
  },
  descWrapper: {
    marginVertical: 2,
  },
  sub_container: {
    flex: 1,
    padding: 4,
  },
  heading: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: textSize.title,
  },
  desc: {
    marginTop: 2,
    fontSize: 12,
    color: colors.lightText2,
    // opacity: 0.8,
    fontFamily: fonts.medium,
  },
  showText: {
    marginTop: 2,
    width: 80,
    color: colors.primary,
    fontFamily: fonts.medium,
    fontSize: 11,
    textDecorationLine: 'underline',
    opacity: 0.8,
  },
});

export default LessonView;
