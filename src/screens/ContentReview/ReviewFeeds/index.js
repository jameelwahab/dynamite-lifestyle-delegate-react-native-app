import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import Modal from 'react-native-modal';
import MyLoader from '../../../components/MyLoader'
import EmptyView from '../../../components/EmptyView'
import StatView from '../../../components/StatView'
import OptionModal2 from '../../../components/OptionModal2'
import MyRefreshControl from '../../../components/MyRefreshControl'
import FooterLoader from '../../../components/FooterLoader'
import { colors } from "../../../utilities/colors"
import { textSize } from "../../../utilities/styles"
import { dateTimeFormat } from "../../../utilities/constants"
import { GET_REVIEW_FEEDS, APPROVE_REVIEW_FEEDS, DELETE_REVIEW_FEEDS } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { useState, useEffect, useRef } from "react"
import { Text, FlatList, View, TouchableOpacity, SafeAreaView, Pressable, Keyboard } from "react-native"
import moment from 'moment'
import { MenuButton } from '../../../components/MyButton';
import routes from '../../../navigation/routes';
import MemberView from '../../../components/MemberView';
import { icons } from '../../../utilities/icons';
import { onChatScreen } from '../../../functions/onChatScreen';
import ConfirmationModal2 from '../../../components/ConfirmationModal2';
import showToast from '../../../functions/showToast';
import AddPost from '../../Feed/FeedScreen/AddPost';
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice';
import SearchView from '../../../components/SearchView';

const ReviewFeeds = ({ navigation, route }) => {
	const ref = useRef(null)
	const ref_confirmModal = useRef()
	const addPostRef = useRef()
	const timezone = useSelector(selectTimeZone)
	const paging = useRef({ page: 0, canLoadMore: false })?.current;
	const { token, access, user } = useSelector(selectUser);
	const [result, setResult] = useState([])
	const [loading, setLoading] = useState(false)
	const [refreshing, setRefresh] = useState(false)
	const [showFooterLoader, setShowFooterLoader] = useState(false)
	const [searching, setSearching] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [totle, setTotal] = useState(0)


	const getFeeds = async () => {
		const res = await GET_REVIEW_FEEDS({ token, navigation, limit: 20, page: paging?.page, search_text: searchText })
		if (res.code == 200) {
			setResult(paging?.page == 0 ? res?.feeds : [...result, ...res?.feeds])
			let length = paging?.page == 0 ? res?.feeds.length : (result.length + res?.feeds.length);
			if (length < res?.total_count) {
				paging.page++;
				paging.canLoadMore = true;
			} else {
				paging.canLoadMore = false;
			}
			setTotal(res?.total_count)
			setLoading(false)
			setRefresh(false)
			setSearching(false)
			setShowFooterLoader(false)
		}
		else {
			setShowFooterLoader(false)
			setSearching(false)
			setLoading(false)
			setRefresh(false)
		}
	}



	const onRefresh = () => {
		paging.canLoadMore = false;
		paging.page = 0;
		setRefresh(true)
		getFeeds()
	}




	const handleClick = (item) => {
		ref.current.openModal?.(item);
	}



	const handleSelect = (opt, item) => {
		if (opt.key == "msg") {
			onChatScreen(item?.action_info?.action_id, token, navigation, user?._id, item?.badge_level_info?.color_code)
		} else if (opt.key == "edit") {
			setTimeout(() => {
				// console.log(item, "item")
				addPostRef?.current?.selectItemForEdit?.(item)
			}, 500);
		} else if (opt.key == "ap") {
			ref_confirmModal?.current?.openModal({
				title: `Are you sure you want to approve this post?`,
				agreeFunc: () => handleAgree(item?._id)
			})
		} else if (opt.key == "del") {
			ref_confirmModal?.current?.openModal({
				title: `Are you sure you want to delete this post?`,
				agreeFunc: () => handleDelete(item?._id)
			})
		}
	}
	const handleDelete = async (id) => {
		setLoading(true)
		let res = await DELETE_REVIEW_FEEDS({ token, navigation, id });
		if (res.code == 200) {
			showToast({ title: res?.message, type: "success" })
			setLoading(false)
			setResult(result.filter(el => el._id !== id && el))
		} else {
			setLoading(false)
		}
	}
	const handleAgree = async (id) => {
		setLoading(true)
		let res = await APPROVE_REVIEW_FEEDS({ token, navigation, id });
		if (res.code == 200) {
			setLoading(false)
			showToast({ title: res?.message, type: "success" })
			setResult(result.filter(el => el._id !== id && el))
		}
		else {
			setLoading(false)
		}
	}

	const removeFromList = (id) => {
		setResult((list) => list.filter(el => el._id !== id))
	}


	const onDetail = (feed) => {
		navigation.navigate(routes?.feedDetailScreen, {
			feedId: feed?._id,
			feedFor: feed?.feed_created_for == "general" ? "all_source" : feed?.feed_created_for,
			reviewCallback: removeFromList
		})

	}

	const handleEndReach = () => {
		if (paging?.canLoadMore) {
			setShowFooterLoader(true)
			getFeeds()
		}
	}

	const filterOptions = (feed) => {
		if (feed) {
			return optionsList.slice().filter(item => {
				if (item.key == "del" || item.key == "edit") {
					if (feed?.feed_type == "poll" || feed?.feed_type == "survey") {
						return false
					} else {
						return access?.edit_delete_option_in_source_all_source_feeds
					}
				} else if (item.key == 'msg') {
					return !access?.is_chat_allowed
				} else {
					return true
				}

			})
		} else return []
	}

	const onSearch = () => {
		Keyboard.dismiss()
		paging.page = 0;
		paging.canLoadMore = false;
		setSearching(true)
		getFeeds()
	}

	useEffect(() => {
		paging.canLoadMore = false;
		paging.page = 0;
		setLoading(true)
		getFeeds()
	}, [])



	const headerView = () => {
		return (
			<View style={{ backgroundColor: colors.darkSecondary }}>
				<SearchView
					search={searchText}
					onChangeText={(text) => setSearchText(text)}
					onSearchPress={onSearch}
					loader={searching}
				/>
			</View>
		)
	}




	return (
		<RootView
			hideBackBottomButton
			title="Review Posts"
			subTitle={`Showing ${result?.length} of ${totle}`}>

			<View style={{ flex: 1 }}>
				<FlatList
					keyboardShouldPersistTaps="handled"
					data={result}
					showsVerticalScrollIndicator={false}
					stickyHeaderHiddenOnScroll={true}
					stickyHeaderIndices={[0]}
					ListHeaderComponent={headerView()}
					ListEmptyComponent={!loading && <EmptyView />}
					ListFooterComponent={!loading && <FooterLoader isVisible={showFooterLoader} />}
					onEndReached={handleEndReach}
					refreshControl={<MyRefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>}
					keyExtractor={(item) => item?._id.toString()}
					renderItem={({ item, index }) =>
						renderPosts({
							feed: item, index,
							handleClick: () => handleClick(item),
							onDetail: () => onDetail(item),
						})}
				/>
			</View>

			<ConfirmationModal2
				ref={ref_confirmModal}
			/>


			<OptionModal2
				ref={ref}
				onSelected={handleSelect}
				filterTheList={filterOptions}
			/>

			<MyLoader enable={loading} />

			<AddPost
				ref={addPostRef}
				user={user}
				token={token}
				navigation={navigation}
				updateFeedItem={(newFeed) => setResult(feeds => {
					let index = feeds.findIndex(feed => feed._id === newFeed?._id);
					if (index !== -1) {
						feeds.splice(index, 1, newFeed);
					}
					return [...feeds];
				})}
				hideAddView={true}
				isCosmos={false}
				isScheduledFeed={false}
				timezone={timezone}
				hideLevelView={true}
				showEventOption={false}
				selectLevelOptionOnAddPostForCosmos={false}
				isPollAllowed={access?.enable_poll_feed}
				isSurveyAllowed={access?.enable_survey_feed}
				isFeedFilterAllowed={false}
			/>
		</RootView>
	)
}


const renderPosts = ({ feed, index, handleClick, onDetail }) => {

	const getFeedType = (feed) => {
		if (feed?.feed_created_for == "general") {
			return "The Source"
		} else if (feed?.feed_created_for == "mission") {
			return `${feed?.feed_created_for} (${feed?.mission?.title})`
		} else if (feed?.feed_created_for == "event") {
			return `${feed?.feed_created_for} (${feed?.dynamite_event?.title})`
		} else if (feed?.feed_created_for == "program") {
			return `${feed?.feed_created_for} (${feed?.program_id?.title})`
		} else {
			return `${feed?.feed_created_for}`
		}

	}
	return (
		<View style={{ marginTop: 10, backgroundColor: colors.secondary, padding: 10, borderRadius: 10 }} key={index}>
			<View style={{ flexDirection: "row", aligItems: "center", justifyContent: "space-between" }}>
				<MemberView
					borderColor={feed?.badge_level_info?.color_code}
					member={feed.action_info}
					hideEmail
				/>
				<MenuButton
					marginHorizontal={0}
					onPress={handleClick}
					size={20}
				/>
			</View>
			<View style={{ height: 10 }} />
			<StatView title="Description" original={true} value={feed?.description} numberOfLinesValues={2} />
			<StatView title="Created For" value={getFeedType(feed)} />
			<StatView title="Feed Type" value={feed?.feed_appear_by} />
			<StatView
				original
				title="Created At"
				value={moment(feed?.createdAt).format(dateTimeFormat.dateTime)}
			/>
			<StatView title="Reason" value={feed?.review_info.reason} original={true} numberOfLinesValues={2} />
			<View style={{ height: 10 }} />
			<TouchableOpacity
				onPress={onDetail} style={{ alignSelf: "flex-end" }}>
				<MyText underlined fontSize={12} color={colors.primary}>View Detail</MyText>
			</TouchableOpacity>
		</View>
	)
}

export default ReviewFeeds

const optionsList = [
	{
		title: "Approve",
		key: "ap",
		icon: () => icons.check_circle(colors.primary, 17),
	},
	{
		title: "Delete",
		key: "del",
		icon: icons.trash,
	},
	{
		title: "Edit",
		key: "edit",
		icon: icons.edit,
	},
	{
		title: "Message",
		key: "msg",
		icon: icons.share,
	}

]
