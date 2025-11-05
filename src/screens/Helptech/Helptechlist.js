import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RootView from '../../components/RootView';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/reducers/userSlice';
import { GET_TECH_CATEGORY_LIST } from '../../DAL';
import MyLoader from '../../components/MyLoader';
import { dateTimeFormat } from '../../utilities/constants';
import { colors } from '../../utilities/colors';
import routes from '../../navigation/routes';
import MyChip from '../../components/MyChip';
import { Flex, Row } from '../../UIComponents/FlexViews';
import { icons } from '../../utilities/icons';
import TitleView from '../../components/TitleView';
import Filter from './components/Filter';
import isArray from '../../functions/isArray';
import moment from 'moment';
import MyRefreshControl from '../../components/MyRefreshControl';
import EmptyView from '../../components/EmptyView';
import SearchView from '../../components/SearchView';
import LessonView2 from '../../components/LessonView2';
import FooterLoader from '../../components/FooterLoader';

const Helptechlist = ({ navigation, route }) => {
  const paging = useRef({ page: 0, canLoadMore: false })?.current;
  const categoryId = route?.params?.categoryId;
  const { token } = useSelector(selectUser);
  const ref_filterModal = useRef();
  const [title] = useState(route?.params?.title || '');
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoadingMore, setisLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState({
    departments: [],
    from: '',
    to: '',
  });

  const removeFromArrayFilter = (index, type) => {
    if (appliedFilter[type]) {
      appliedFilter[type].splice(index, 1);
      setAppliedFilter({ ...appliedFilter });
    }
  };

  const removeFromDateFilter = () => {
    setAppliedFilter({ ...appliedFilter, to: '', from: '' });
  };

  const applyFilter = filters => {
    setAppliedFilter({ ...filters });
  };

  const getDataFromServer = async () => {
    let res = await GET_TECH_CATEGORY_LIST({
      navigation,
      token,
      page: paging?.page,
      searchText: searchText,
      category: categoryId,
      departments: appliedFilter?.departments.map(x => x?._id),
      endDate: appliedFilter?.to ? appliedFilter?.to : undefined,
      startDate: appliedFilter?.from ? appliedFilter?.from : undefined,
    });
    if (res.code == 200) {
      let nlist =
        paging?.page == 0 ? res?.help_videos : [...list, ...res?.help_videos];
      setList(nlist);
      if (nlist.length < res?.totalCount) {
        paging.page++;
        paging.canLoadMore = true;
      } else {
        paging.canLoadMore = false;
      }

      setLoader(false);
      setisLoadingMore(false);
      setSearching(false);
      setRefreshing(false);
    } else {
      setLoader(false);
      setisLoadingMore(false);
      setSearching(false);
      setRefreshing(false);
    }
  };

  const onSearchPress = () => {
    paging.page = 0;
    paging.canLoadMore = false;
    setSearching(true);
    getDataFromServer();
  };

  const onRefresh = () => {
    paging.page = 0;
    paging.canLoadMore = false;
    setRefreshing(true);
    getDataFromServer();
  };

  const onLoadMore = () => {
    if (paging.canLoadMore) {
      paging.canLoadMore = false;
      setisLoadingMore(true);
      getDataFromServer();
    }
  };

  const callAPI = () => {
    paging.page = 0;
    paging.canLoadMore = false;
    setLoader(true);
    getDataFromServer();
  };

  useEffect(() => {
    callAPI();
  }, [JSON.stringify(appliedFilter)]);

  const onHelpTechDetailScreen = item => {
    navigation.navigate(routes.helptechDetailScreen, {
      category: item,
    });
  };

  const descView = (item, index) => {
    if (isArray(item?.help_video_departments)) {
      return (
        <View style={{ marginTop: 'auto', marginTop: 5 }}>
          <Row flexWrap="wrap">
            {item?.help_video_departments.map((x, i) => {
              return <MyChip title={x?.title} />;
            })}
          </Row>
        </View>
      );
    } else return null;
  };

  const renderTutorials = ({ item, index }) => {
    return (
      <View style={{ flex: 1 / 2 }}>
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
            heading={item.title}
            numberOfTitleLines={3}
            durationText={moment(item?.createdAt,"DD-MM-YYYY").format('DD MMM, YYYY')}
            descView={() => descView(item, index)}
            image={item.image.thumbnail_1}
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

  const headerComponent = () => {
    return (
      <View style={{ paddingTop: 5, backgroundColor: colors.darkSecondary }}>
        <Row flexWrap="wrap">
          {/* {isArray(appliedFilter?.categories) &&
            appliedFilter?.categories.map((x, i) => (
              <MyChip
                title={x?.title}
                onPress={() => removeFromArrayFilter(i, 'categories')}
              />
            ))} */}
          {isArray(appliedFilter?.departments) &&
            appliedFilter?.departments.map((x, i) => (
              <MyChip
                title={x?.title}
                onPress={() => removeFromArrayFilter(i, 'departments')}
              />
            ))}
          {appliedFilter.from && appliedFilter.to && (
            <MyChip
              title={`From ${moment(appliedFilter.from).format(
                dateTimeFormat.date,
              )} to ${moment(appliedFilter.to).format(dateTimeFormat.date)}`}
              onPress={() => removeFromDateFilter()}
            />
          )}
        </Row>
        {mySearchView()}
      </View>
    );
  };

  const mySearchView = () => {
    return (
      <View style={{ paddingBottom: 5 }}>
        <SearchView
          loader={searching}
          search={searchText}
          onChangeText={text => setSearchText(text)}
          onSearchPress={onSearchPress}
        />
      </View>
    );
  };

  const titleView = () => {
    return (
      <View>
        <Row paddingHorizontal={10}>
          <Flex flex={1}>
            <TitleView
              hideBackBottomButton
              title={title}
            //   subTitle={`Total : ${list.reduce(
            //     (count, category) => count + category.help_videos.length,
            //     0,
            //   )}`}
            />
          </Flex>
          <TouchableOpacity
            onPress={() => ref_filterModal?.current?.openModal(appliedFilter)}>
            {icons.filterCircle(colors.primary, 30)}
          </TouchableOpacity>
        </Row>
      </View>
    );
  };

  return (
    <RootView titleView={titleView}>
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={headerComponent()}
          stickyHeaderIndices={[0]}
          numColumns={2}
          stickyHeaderHiddenOnScroll={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={item => item?._id}
          ListFooterComponent={<FooterLoader isVisible={isLoadingMore} />}
          ListEmptyComponent={!loader && <EmptyView />}
          data={list}
          // renderSectionHeader={sectionHeader}
          renderItem={renderTutorials}
          onEndReached={onLoadMore}
        />
      </View>
      <MyLoader enable={loader} />
      <Filter ref={ref_filterModal} applyFilter={applyFilter} />
    </RootView>
  );
};

export default Helptechlist;

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
