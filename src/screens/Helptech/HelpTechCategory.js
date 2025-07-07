import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import RootView from '../../components/RootView';
import {useSelector} from 'react-redux';
import {selectUser} from '../../redux/reducers/userSlice';
import {selectNavbar} from '../../redux/reducers/navbarSlice';
import {GET_HELPTECH_CATEGORIES, GET_TECH_CATEGORY_LIST} from '../../DAL';
import MyLoader from '../../components/MyLoader';
import utilities from '../../utilities';
import {dateTimeFormat} from '../../utilities/constants';
import {colors} from '../../utilities/colors';
import routes from '../../navigation/routes';
import {main} from '../../utilities/styles';
import MyChip from '../../components/MyChip';
import {Flex, Row} from '../../UIComponents/FlexViews';
import {icons} from '../../utilities/icons';
import TitleView from '../../components/TitleView';
import Filter from './components/Filter';
import isArray from '../../functions/isArray';
import moment from 'moment';
import MyRefreshControl from '../../components/MyRefreshControl';
import EmptyView from '../../components/EmptyView';
import SearchView from '../../components/SearchView';
import LessonView2 from '../../components/LessonView2';
import LessonView from '../../components/LessonView';

const HelpTechCategory = ({navigation, route}) => {
  const {token} = useSelector(selectUser);
  const {value, parentValue} = route?.params;
  console.log(value, parentValue, 'value, parentValue');
  const {navbar} = useSelector(selectNavbar);
  const [title] = useState(
    navbar
      ?.find(x => x.value == parentValue)
      ?.child_options?.find(y => y.value == value)?.title,
  );
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setLoader(true);
    getDataFromServer();
  }, []);

  const filterBySearch = data => {
    return data
      .slice('')
      .filter(category => category.title.toLowerCase().includes(searchText.toLowerCase()));
  };

  const getDataFromServer = async () => {
    let res = await GET_HELPTECH_CATEGORIES({navigation, token});
    if (res.code == 200) {
      setList(res?.help_video_category);
      setLoader(false);
      setRefreshing(false);
    } else {
      setRefreshing(false);
      setLoader(false);
    }
  };

  const onHelpTechDetailScreen = (item) => {
	navigation.navigate(routes.helptechListScreen, {
		categoryId: item?._id,
		title:item?.title
	})
}

  const renderTutorials = ({item, index}) => {
    return (
      <View style={{flex: 1 / 2}}>
        <View
          style={[
            {
              marginTop: 10,
              marginLeft: index % 2 != 0 ? 5 : 0,
              marginRight: index % 2 == 0 ? 5 : 0,
              borderWidth: 1,
              borderColor: colors.white + '22',
              borderRadius: 10,
              flex: 1,
              backgroundColor: colors.secondary,
            },
            {},
          ]}>
          <LessonView2
            handlePress={() => onHelpTechDetailScreen(item)}
            heading={item?.title}
            numberOfTitleLines={3}
            // durationText={moment(item?.createdAt).format("DD MMM, YYYY")}
            // descView={() => descView(item, index)}
            image={item?.icon?.thumbnail_1}
          />
        </View>
      </View>
    );
    // return (
    //   <Pressable onPress={() => onHelpTechDetailScreen(item)}
    //     style={[__styles.itemView, { marginBottom: index == (section.data.length - 1) ? 20 : 0 }]} >
    //     <ResponsiveImage2
    //       uri={S3_URL + item.image.thumbnail_1}
    //       width={width - 20}
    //     />
    //     <View style={{ padding: 10 }} >
    //       <MyText isHeading>{item.title}</MyText>
    //       {!!item?.short_description &&
    //         <MyText >
    //           {item?.short_description}
    //         </MyText>}
    //     </View>
    //   </Pressable>)
  };

  const sectionHeader = ({item}) => {
    return (
      <View style={[__styles.header, {}]}>
        <View style={{alignSelf: 'flex-start', paddingBottom: 5}}>
          <Text style={main.heading}>{item?.title}</Text>
          <View
            style={{
              marginTop: 2,
              // borderBottomColor: colors.primary,
              // borderBottomWidth: 1,
              height: 2,
              borderRadius: 10,
              // paddingBottom:10,

              backgroundColor: colors.primary,
            }}
          />
        </View>
        {/* <FlatList
					data={item?.help_videos}
					renderItem={renderTutorials}
					scrollEnabled={false}
					showsVerticalScrollIndicator={false}
					numColumns={2}
				/> */}
        {/* {item?.help_videos.map((x, i) => renderTutorials({ item: x, index: i }))} */}
      </View>
    );
  };

  const headerComponent = () => {
    return (
      <View style={{paddingTop: 5, backgroundColor: colors.darkSecondary}}>
        {mySearchView()}
      </View>
    );
  };

  const mySearchView = () => {
    return (
      <View style={{paddingBottom: 5}}>
        <SearchView
          hideBtn
          search={searchText}
          onChangeText={text => setSearchText(text)}
        />
      </View>
    );
  };

  return (
    <RootView
      title={title}
      subTitle={`Total : ${list.length}`}
      hideBackBottomButton>
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={headerComponent()}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 30}}
			 numColumns={2}
          refreshControl={
            <MyRefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                getDataFromServer();
              }}
            />
          }
          ListEmptyComponent={!loader && <EmptyView />}
          data={filterBySearch(list)}
          renderItem={renderTutorials}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  );
};

export default HelpTechCategory;

const __styles = StyleSheet.create({
  itemView: {
    // marginTop: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: colors.darkSecondary,
    // paddingVertical: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
