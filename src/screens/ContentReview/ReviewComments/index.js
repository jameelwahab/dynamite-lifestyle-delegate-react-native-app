import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import Modal from 'react-native-modal';
import MyLoader from '../../../components/MyLoader';
import EmptyView from '../../../components/EmptyView';
import UserImage from '../../../components/UserImage';
import StatView from '../../../components/StatView';
import OptionModal2 from '../../../components/OptionModal2';
import MyRefreshControl from '../../../components/MyRefreshControl';
import FooterLoader from '../../../components/FooterLoader';
import {MyButton2} from '../../../components/MyButton';
import {colors} from '../../../utilities/colors';
import {dateTimeFormat} from '../../../utilities/constants';
import {textSize} from '../../../utilities/styles';
import {
  GET_COMMENT_REVIEW,
  APPROVE_COMMENT_REVIEW,
  DELETE_COMMNET_REVIEW,
} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {useState, useEffect, useRef} from 'react';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Pressable,
  Keyboard,
} from 'react-native';
import {icons} from '../../../utilities/icons';
import moment from 'moment';
import {onChatScreen} from '../../../functions/onChatScreen';
import {MenuButton} from '../../../components/MyButton';
import MemberView from '../../../components/MemberView';
import ConfirmationModal2 from '../../../components/ConfirmationModal2';
import showToast from '../../../functions/showToast';
import AddPost from '../../Feed/FeedScreen/AddPost';
import SearchView from '../../../components/SearchView';

const ReviewComments = ({navigation}) => {
  const {user, token, access} = useSelector(selectUser);
  const ref_confirmModal = useRef();
  const paging = useRef({page: 0, canLoadMore: false})?.current;
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefresh] = useState(false);
  const [showFooterLoader, setShowFooterLoader] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [content, setContent] = useState({title: '', desc: ''});

  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [total, setTotal] = useState(0);

  const getFeeds = async () => {
    const res = await GET_COMMENT_REVIEW({
      token,
      navigation,
      limit: 20,
      page: paging?.page,
      search_text: searchText,
    });
    if (res.code == 200) {
      setResult(
        paging?.page == 0 ? res?.comments : [...result, ...res?.comments],
      );
      let length =
        paging?.page == 0
          ? res?.comments.length
          : result.length + res?.comments.length;
      if (length < res?.total_count) {
        paging.page++;
        paging.canLoadMore = true;
      } else {
        paging.canLoadMore = false;
      }
      setLoading(false);
      setRefresh(false);
      setSearching(false);
      setShowFooterLoader(false);
      setTotal(res?.total_count);
    } else {
      setShowFooterLoader(false);
      setSearching(false);
      setLoading(false);
      setRefresh(false);
    }
  };

  useEffect(() => {
    paging.canLoadMore = false;
    paging.page = 0;
    setLoading(true);
    getFeeds();
  }, []);

  const onRefresh = () => {
    paging.canLoadMore = false;
    paging.page = 0;
    setRefresh(true);
    getFeeds();
  };
  const ref = useRef(null);

  const handleClick = id => ref.current.openModal?.(id);

  const handleSelect = (opt, item) => {
    if (opt.key == 'msg') {
      onChatScreen(
        item?.user_info_action_for?.action_id,
        token,
        navigation,
        user?._id,
        item?.user_info_action_for?.badge_level_info?.color_code,
      );
    } else if (opt.key == 'del') {
      ref_confirmModal?.current?.openModal({
        title: `Are you sure you want to delete this comment?`,
        agreeFunc: () => handleDelete(item?._id),
      });
    } else if (opt.key == 'ap') {
      ref_confirmModal?.current?.openModal({
        title: `Are you sure you want to approve this comment?`,
        agreeFunc: () => handleAgree(item?._id),
      });
    }
  };

  const handleDelete = async id => {
    setLoading(true);
    let res = await DELETE_COMMNET_REVIEW({token, navigation, id});
    if (res.code == 200) {
      showToast({body: res?.message, type: 'success'});
      setLoading(false);
      setResult(result.filter(el => el._id !== id && el));
    } else {
      setLoading(false);
    }
  };

  const handleAgree = async id => {
    setLoading(true);
    let res = await APPROVE_COMMENT_REVIEW({token, navigation, id});
    if (res.code == 200) {
      showToast({body: res?.message, type: 'success'});
      setLoading(false);
      setResult(result.filter(el => el._id !== id && el));
    } else {
      setLoading(false);
    }
  };

  const handleEndReach = () => {
    if (paging?.canLoadMore) {
      paging.canLoadMore = false;
      setShowFooterLoader(true);
      getFeeds();
    }
  };

  const filterOptions = () => {
    return optionsList.slice().filter(item => {
      if (item.key == 'del' || item.key == 'edit') {
        return access?.edit_delete_option_in_source_all_source_feeds;
      } else if (item.key == 'msg') {
        return access?.is_chat_allowed;
      } else {
        return true;
      }
    });
  };

  const headerView = () => {
    return (
      <View style={{backgroundColor: colors.darkSecondary}}>
        <SearchView
          search={searchText}
          onChangeText={text => setSearchText(text)}
          onSearchPress={onSearch}
          loader={searching}
        />
      </View>
    );
  };

  const onSearch = () => {
    Keyboard.dismiss();
    paging.page = 0;
    paging.canLoadMore = false;
    setSearching(true);
    getFeeds();
  };

  return (
    <RootView
      hideBackBottomButton
      title="Review Comments"
      subTitle={`Showing ${result?.length} of ${total}`}>
      <CustomModal
        isVisible={showComment}
        content={content}
        closeModal={() => setShowComment(false)}
      />
      <View style={{flex: 1}}>
        <FlatList
          data={result}
          stickyHeaderHiddenOnScroll={true}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={headerView()}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loading && <EmptyView />}
          ListFooterComponent={
            !loading && <FooterLoader isVisible={showFooterLoader} />
          }
          onEndReached={handleEndReach}
          refreshControl={
            <MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderPosts
              feed={item}
              index={index}
              handleClick={() => handleClick(item)}
              setShowComment={() => setShowComment(true)}
              setContent={() =>
                setContent({
                  title: item.message,
                  desc: item?.review_info?.reason,
                })
              }
            />
          )}
        />
      </View>
      <MyLoader enable={loading} />

      <OptionModal2
        ref={ref}
        onSelected={handleSelect}
        optionList={filterOptions()}
      />
      <ConfirmationModal2 ref={ref_confirmModal} />
    </RootView>
  );
};

const CustomModal = ({isVisible, closeModal, content}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationInTiming={300}
      animationOutTiming={300}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      hideModalContentWhileAnimating={true}>
      <View
        style={{
          padding: 15,
          backgroundColor: colors.secondaryVariant,
          borderRadius: 10,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{maxHeight: 700}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 10,
              borderBottomWidth: 1,
              borderBottomColor: colors.lightText,
            }}>
            <View />
            <MyText fontSize={textSize.title} type="bold">
              Review Comment
            </MyText>
            <MyButton2
              icon={() => icons.crosss(colors.primary, 16)}
              onPress={closeModal}
            />
          </View>
          <View
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: colors.lightText,
            }}>
            <MyText>{content.title}</MyText>
          </View>
          <View style={{paddingVertical: 10}}>
            <MyText style={textSize.title} type="bold" color={colors.primary}>
              Review Reason
            </MyText>
            <View style={{height: 6}} />
            <MyText>{content.desc}</MyText>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const RenderPosts = ({
  feed,
  index,
  handleClick,
  setShowComment,
  setContent,
}) => {
  return (
    <>
      <View
        style={{
          marginTop: 10,
          backgroundColor: colors.secondary,
          padding: 10,
          borderRadius: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            aligItems: 'center',
            justifyContent: 'space-between',
          }}>
          <MemberView
            borderColor={
              feed?.user_info_action_for?.badge_level_info?.color_code
            }
            member={feed?.user_info_action_for}
            hideEmail
          />
          <MenuButton marginHorizontal={0} onPress={handleClick} size={20} />
        </View>
        <View style={{height: 10}} />
        <StatView
          title="Description"
          original
          numberOfLinesValues={2}
          value={feed?.message}
        />
        <StatView
          title="Created For"
          value={
            feed?.feed_created_for === 'general'
              ? 'The Source Code'
              : feed?.feed_created_for
          }
        />
        <StatView
          title="Created At"
          value={moment(new Date(feed?.createdAt)).format(
            dateTimeFormat.dateTime,
          )}
        />
        <StatView
          title="Reason"
          numberOfLinesValues={2}
          original
          value={feed?.review_info?.reason}
        />
        <View style={{height: 10}} />
        <TouchableOpacity
          activeOpacity={0.5}
          style={{alignItems: 'flex-end'}}
          onPress={() => setShowComment() || setContent()}>
          <MyText fontSize={12} underlined color={colors.primary}>
            View Detail
          </MyText>
        </TouchableOpacity>
      </View>
    </>
  );
};

const optionsList = [
  {
    title: 'Approve',
    key: 'ap',
    icon: () => icons.check_circle(colors.primary, 17),
  },
  {
    title: 'Delete',
    key: 'del',
    icon: icons.trash,
  },
  // {
  // 	title: "Edit",
  // 	key: "edit",
  // 	icon: icons.edit,
  // },
  {
    title: 'Message',
    key: 'msg',
    icon: icons.share,
  },
];
export default ReviewComments;
