import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  SectionList,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import {useSelector} from 'react-redux';
import {selectUser} from '../../redux/reducers/userSlice';
import {selectNavbar} from '../../redux/reducers/navbarSlice';
import {GET_ASSETS_CATEGORY_LIST, GET_TECH_CATEGORY_LIST} from '../../DAL';
import MyLoader from '../../components/MyLoader';
import utilities from '../../utilities';
import {colors} from '../../utilities/colors';
import ResponsiveImage2 from '../../components/ResponsiveImage2';
import routes from '../../navigation/routes';
import WebPlayer from '../../components/WebPlayer';
import MyWebview from '../../components/MyWebview';
import isArray from '../../functions/isArray';
import {Row} from '../../UIComponents/FlexViews';
import MyChip from '../../components/MyChip';

const HelptechDetail = ({navigation, route}) => {
  const {S3_URL} = useSelector(selectUser);
  const {category} = route?.params;
  const [width] = useState(utilities.screenWidth());

  const renderTutorials = ({item, index}) => {
    return (
      <Pressable
        onPress={() => onHelpTechDetailScreen(item)}
        style={__styles.itemView}>
        <ResponsiveImage2
          uri={S3_URL + item.image.thumbnail_1}
          width={width - 20}
        />
        <View style={{padding: 10}}>
          <MyText isHeading>{item.title}</MyText>
          {!!item?.short_description && (
            <MyText>{item?.short_description}</MyText>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <RootView title={category?.title} subTitle={category?.short_description}>
      <View style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!!category?.video_url && (
            <View style={{marginTop: 10}}>
              <WebPlayer
                width={width - 20}
                url={category?.video_url}
                height={250}
              />
            </View>
          )}

          {isArray(category?.help_video_departments) && (
            <View style={{marginTop: 10}}>
              <Row flexWrap="wrap">
                {category?.help_video_departments.map((x, i) => {
                  return <MyChip title={x?.title} />;
                })}
              </Row>
            </View>
          )}

          {!!category?.detailed_description && (
            <View style={{marginTop: 10}}>
              <MyWebview
                width={width - 20}
                html={category?.detailed_description}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </RootView>
  );
};

export default HelptechDetail;

const __styles = StyleSheet.create({
  itemView: {
    marginTop: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: colors.darkSecondary,
    paddingBottom: 5,
  },
});
