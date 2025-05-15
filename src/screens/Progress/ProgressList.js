import { View, Text, FlatList, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { selectUser } from '../../redux/reducers/userSlice'
import { PROGRESS_DELETE, PROGRESS_LIST } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import { colors } from '../../utilities/colors'
import MemberView from '../../components/MemberView'
import { MenuButton } from '../../components/MyButton'
import StatView from '../Members/Components/StatView'
import moment from 'moment'
import { S3_URL, dateTimeFormat } from '../../utilities/constants'
import FooterLoader from '../../components/FooterLoader'
import EmptyView from '../../components/EmptyView'
import MyRefreshControl from '../../components/MyRefreshControl'
import FAB from '../../components/FAB'
import routes from '../../navigation/routes'
import TitleView from '../../components/TitleView'
import { icons } from '../../utilities/icons'
import MyChip from '../../components/MyChip'
import SearchView from '../../components/SearchView'
import OptionModal from '../../components/OptionModal'
import ConfirmationModal from '../../components/ConfirmationModal'
import UserImage from '../../components/UserImage'
import MyWebview from '../../components/MyWebview'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import ImageZoomer from '../../components/ImageZoomer'
import utilities from '../../utilities'
import ResponsiveImage from '../../components/ResponsiveImage'
import MyImage from '../../components/MyImage'





let page = 0;
let canLoadMore = false;
const ProgressList = ({ navigation, route }) => {
  const { value } = route.params
  const { navbar } = useSelector(selectNavbar);
  const { user, token } = useSelector(selectUser);
  const [title] = useState(navbar?.find(x => x.value == value)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [optionModal, setOptionModal] = useState({ isVisible: false, item: null, list: [] });
  const [confirmModal, setConfirmModal] = useState({ isVisible: false, item: null });
  const [imageForZoom, setImageForZoom] = useState("")
  const [filters, setFilters] = useState({
    end_date: undefined,
    start_date: undefined,
    progress_category: undefined,
    filter_by: "all",
    filterByDate: false
  })



  useEffect(() => {
    callAPi()
  }, [JSON.stringify(filters)])

  useEffect(() => {
    if (route?.params?.filters) {
      setFilters(route?.params?.filters);
    } else if (route?.params?.callList) {
      callAPi()
    }
  }, [route])

  const onSelected = (opt) => {
    let { item } = optionModal;
    setOptionModal({ isVisible: false, item: null, list: [] })
    if (opt.key == "delete") {
      setTimeout(() => {
        setConfirmModal({ isVisible: true, item: item });
      }, 500);
    } else if (opt.key == "edit") {
      navigation.navigate(routes.progresssAddEdit, {
        editableItem: item,
        type: "edit",
      })
    }
  }

  const openOptions = (item) => {
    setOptionModal({ isVisible: true, item: item, })
  }

  const onConfirmPress = (opt) => {
    let { item } = confirmModal;
    setConfirmModal({ isVisible: false, item: null })
    deleteBookingFromServer(item?._id)
  }

  const onAddScreen = () => {
    navigation.navigate(routes.progresssAddEdit, { editableItem: undefined, type: "add" })
  }

  const onFilterScreen = () => {
    navigation.navigate(routes.progresssFilter, {
      filters
    })
  }

  const onNotes = (item) => {
    navigation.navigate(routes.progresssNotesList, {
      reportId: item?._id,
      list: item?.internal_note,
      userInfo: item?.user_info
    })
  }




  const clearFilter = () => {
    setFilters({
      end_date: undefined,
      start_date: undefined,
      filterByDate: false,
      progress_category: undefined,
      filter_by: "all",
    })
  }

  const isFilterApplied = () => {
    return (!!filters.progress_category || filters?.filter_by != "all" || (filters?.filterByDate && (!!filters?.start_date || !!filters?.end_date)));
  }

  const callAPi = () => {
    canLoadMore = false;
    page = 0;
    setList([])
    setLoader(true);
    getBookingsFromServer(true)
  }

  const loadMore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      getBookingsFromServer()
    }
  }

  const onRefresh = () => {
    page = 0;
    canLoadMore = false;
    setRefreshing(true)
    getBookingsFromServer(true)
  }

  const getBookingsFromServer = async (newArray = false) => {
    let appliedfilters = {
      end_date: filters?.filterByDate ? !!filters?.end_date ? moment(filters?.end_date).format("YYYY-MM-DD") : !!filters?.start_date ? moment(filters?.start_date).format("YYYY-MM-DD") : undefined : undefined,
      start_date: filters?.filterByDate ? !!filters?.start_date ? moment(filters?.start_date).format("YYYY-MM-DD") : !!filters?.end_date ? moment(filters?.end_date).format("YYYY-MM-DD") : undefined : undefined,
      progress_category: !!filters?.progress_category ? filters?.progress_category?._id : undefined,
      filter_by: filters?.filter_by,
    };

    let res = await PROGRESS_LIST({
      navigation, token, page, filters: appliedfilters,
    })
    if (res.code == 200) {
      let length = newArray ? res?.progress_report.length : list.length + res?.progress_report.length;
      if (length < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setTotal(res?.total_count)
      setList(newArray ? res?.progress_report : [...list, ...res?.progress_report]);
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);

    } else {
      setLoader(false)
      setFooterLoader(false);
      setRefreshing(false);
    }
  }

  const deleteBookingFromServer = async (id) => {
    setLoader(true)
    let res = await PROGRESS_DELETE({ navigation, token, id })
    if (res.code == 200) {
      let nlist = list.slice().filter(x => x._id != id)
      setList([...nlist])
      setLoader(false)
    } else {
      setLoader(false)
    }
  }



  const renderProgress = useCallback(({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <View style={__styles.headerView}>
          <UserImage
            size={35}
            image={item?.user_info?.image}
            name={item?.user_info?.first_name}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <MyText color={colors.primary} type='medium' fontSize={14} >
              {item?.user_info?.first_name + " " + item?.user_info?.last_name}
            </MyText>
            <View style={{ marginTop: 2 }}>
              <MyText fontSize={12} type='medium' capitalize color={colors.lightText2} >
                {item?.report_type} ({moment(item?.start_date).format(dateTimeFormat.date)}{item?.report_type != 'daily' ?
                  " - " + moment(item?.end_date).format(dateTimeFormat.date) : ""})</MyText>
            </View>

          </View>
          <View style={__styles.headerView}>
            <TouchableOpacity
              onPress={() => onNotes(item)}
              style={{ marginRight: 5 }}>
              {icons.message()}
              {!!item?.internal_note &&
                <View style={__styles.badgeView} >
                  <MyText color={colors.black} fontSize={10} >{item?.internal_note.length > 9 ? "+9" : item?.internal_note.length}</MyText>
                </View>}

            </TouchableOpacity>
            {item?.user_info?._id == user?._id &&
              <MenuButton
                touchgap={5}
                onPress={() => openOptions(item, index)}
              />}
          </View>
        </View>
        {!!item?.description &&
          <View style={{ marginTop: 10 }}>
            <MyWebview html={item?.description} />
          </View>}



        {!!item?.image?.thumbnail_1 &&
          <Pressable style={__styles.imageView}
            onPress={() => setImageForZoom(item?.image?.thumbnail_1)} >
            <MyImage
              source={{ uri: S3_URL + item?.image?.thumbnail_1 }}
              style={{ height: "100%", width: "100%" }}
            />
          </Pressable>}


      </View>
    )
  }, [JSON.stringify(list)])

  const topView = () => {
    return (
      <View>
        <View style={__styles.topView}>
          <TitleView
            title={title}
            hideBackBottomButton
            subTitle={`Showing ${list.length} of ${total}`}
          />
          <View style={__styles.topBtnsView}>

            <TouchableOpacity onPress={onFilterScreen}>
              {icons.filterCircle(colors.primary, 25)}
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }


  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>
        {isFilterApplied() &&
          <View style={{ flexDirection: "row", flexWrap: "wrap", paddingBottom: 5 }}>
            {!!filters?.filter_by && filters?.filter_by != "all" &&
              <MyChip
                isCapitalize
                title={filters?.filter_by}
                onPress={() => setFilters({ ...filters, filter_by: 'all' })} />}

            {!!filters?.progress_category &&
              <MyChip title={filters?.progress_category?.title}
                onPress={() => setFilters({ ...filters, progress_category: undefined })} />}

            {filters?.filterByDate && (!!filters?.start_date || !!filters?.end_date) &&
              <MyChip title={`${!!filters?.start_date ? moment(filters?.start_date).format(dateTimeFormat.date) : moment(filters?.end_date).format(dateTimeFormat.date)} -  ${!!filters.end_date ? moment(filters?.end_date).format(dateTimeFormat.date) : moment(filters?.start_date).format(dateTimeFormat.date)} `}
                onPress={() => setFilters({ ...filters, end_date: undefined, start_date: undefined, filterByDate: false, })} />}




            <TouchableOpacity
              onPress={clearFilter}
              style={{ marginRight: 10, borderWidth: 1, borderColor: colors.primary, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.primary + "22", alignSelf: "flex-end",marginLeft:5 }}>
              <MyText color={colors.primary}>{"Clear Filter"}</MyText>
            </TouchableOpacity>


          </View>}


      </View>
    )
  }

  return (
    <RootView hideSubHeader>
      {topView()}
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={headerView()}
          stickyHeaderIndices={[0]}
          keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 70 }}
          data={list}
          renderItem={renderProgress}
          onEndReached={loadMore}
          ListEmptyComponent={!loader && !refreshing && <EmptyView label={'No Progess Report Found'} />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          refreshControl={<MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
      <FAB onPress={onAddScreen} />
      <MyLoader enable={loader} />

      <OptionModal
        isVisible={optionModal?.isVisible}
        onSelected={onSelected}
        optionList={optionsList}
        closeModal={() => setOptionModal({ isVisible: false, item: null, list: [] })}
      />

      <ConfirmationModal
        isVisible={confirmModal?.isVisible}
        closeModal={() => setConfirmModal({ isVisible: false, item: null })}
        onAgree={onConfirmPress}
        title={"Are you sure you want to delete this report?"}
      />

      <ImageZoomer
        closeModal={() => setImageForZoom("")}
        url={imageForZoom}
        visible={!!imageForZoom}
      />
    </RootView>
  )
}

export default ProgressList
const optionsList = [

  {
    title: "Edit",
    key: "edit",
    icon: icons.edit
  },
  {
    title: "Delete",
    key: "delete",
    icon: icons.trash
  },


]



const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center"
  },
  badgeView: {
    height: 18,
    width: 18,
    borderRadius: 18 / 2,
    backgroundColor: colors.primary,
    position: "absolute",
    top: -10,
    right: -10,
    alignItems: "center",
    justifyContent: "center",

  },
  statusView: {
    // paddingVertical: 5,
    // paddingHorizontal: 15,
    height: 25,
    paddingHorizontal: 10,
    // minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    alignSelf: "flex-start"
  },

  topView: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.darkSecondary, paddingBottom: 5
  },
  topBtnsView: { flexDirection: "row", alignItems: "flex-end", },

  sortBtn: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: "center",
    marginLeft: 5
  },
  imageView: { height: 80, width: 80, borderRadius: 10, marginTop: 10, overflow: "hidden" }
})