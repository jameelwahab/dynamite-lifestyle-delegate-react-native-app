import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import Modal from 'react-native-modal';
import MyLoader from '../../../components/MyLoader'
import EmptyView from '../../../components/EmptyView'
import UserImage from '../../../components/UserImage'
import StatView from '../../../components/StatView'
import OptionModal2 from '../../../components/OptionModal2'
import MyRefreshControl from '../../../components/MyRefreshControl'
import FooterLoader from '../../../components/FooterLoader'
import { colors } from "../../../utilities/colors"
import { dateTimeFormat } from "../../../utilities/constants"
import { GET_REVIEW_FEEDS, APPROVE_REVIEW_FEEDS, DELETE_REVIEW_FEEDS } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { useState, useEffect, useRef } from "react"
import { Text, FlatList, View, TouchableOpacity } from "react-native"
import moment from 'moment'
import { MenuButton } from '../../../components/MyButton';
import routes from '../../../navigation/routes';
import MemberView from '../../../components/MemberView';
import { icons } from '../../../utilities/icons';

const ReviewFeeds = ({ navigation, route }) => {
	const ref = useRef(null)
	const { token, access } = useSelector(selectUser);
	const [result, setResult] = useState()
	const [loading, setLoading] = useState(false)
	const [refreshing, setRefresh] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [showFooterLoader, setShowFooterLoader] = useState(false)
	const [page, setPage] = useState(0)


	const getFeeds = async ({ load = false, pageCount }) => {
		setLoading(load)
		const res = await GET_REVIEW_FEEDS({ token, navigation, limit: 20, page: pageCount })
		if (res.code == 200) {
			if (pageCount == 0 || result.length === 0) setResult(res?.feeds)
			else setResult([...result, ...res?.feeds])
			setLoading(false)
			setRefresh(false)
			setShowFooterLoader(false)
		}
		else {
			setResult([])
			setPage(0)
			setLoading(false)
			setRefresh(false)
		}
	}


	
	const onRefresh = () => {
		setRefresh(true)
		getFeeds({ load: false, pageCount: page + 1 })
	}



	const closeModal = () => {
		setShowModal(false)
	}

	const handleClick = (id) => {
		ref.current.openModal?.(id);
	}



	const handleSelect = (opt, id) => {
		if (opt.key == "ap") {
			APPROVE_REVIEW_FEEDS({ token, navigation, id }).then(() => setResult(result.filter(el => el._id !== id && el)))
		} else if (opt.key == "del") {
			DELETE_REVIEW_FEEDS({ token, navigation, id }).then(() => setResult(result.filter(el => el._id !== id && el)))
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
		if (!loading) {
			setShowFooterLoader(true)
			setPage(page + 1)
			getFeeds({ load: false })
		}
	}

	const filterOptions = () => {
		return optionsList.slice().filter(item => {
			if (item.key == "del") {
				return access?.edit_delete_option_in_source_all_source_feeds
			} else {
				return true
			}
		})
	}

	useEffect(() => {
		setPage(0)
		getFeeds({ load: true, pageCount: 0 })
	}, [])




	return (
		<RootView hideBackBottomButton title="Review Posts">

			<View style={{ flex: 1 }}>
				<FlatList
					data={result}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={!loading && <EmptyView />}
					ItemSeparatorComponent={<View style={{ height: 12 }} />}
					ListFooterComponent={!loading && <FooterLoader isVisible={showFooterLoader} />}
					onEndReached={handleEndReach}
					refreshControl={<MyRefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>}
					keyExtractor={(_,index) => index.toString()}
					renderItem={({ item, index }) =>
						renderPosts({
							feed: item, index,
							handleClick: () => handleClick(item._id),
							onDetail: () => onDetail(item),
						})}
				/>
			</View>

			<OptionModal2
				ref={ref}
				onSelected={handleSelect}
				optionList={filterOptions()}
			/>
			<MyLoader enable={loading} />
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
		<View style={{ backgroundColor: colors.secondary, padding: 10, borderRadius: 10 }} key={index}>
			<View style={{ flexDirection: "row", aligItems: "center", justifyContent: "space-between" }}>
				<MemberView
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
			<StatView title="Description" value={feed?.description} numberOfLinesValues={2} />
			<StatView title="Created For" value={getFeedType(feed)} />
			<StatView
				title="Created At"
				value={moment(feed?.createdAt).format(dateTimeFormat.conversion)}
			/>
			<StatView title="Appear by" value={feed?.feed_appear_by} />
			<StatView title="Reason" value={feed?.review_info.reason} numberOfLinesValues={2} />
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
		title: "Approved",
		key: "ap",
		icon: () => icons.check_circle(colors.primary, 17),
	},
	{
		title: "Delete",
		key: "del",
		icon: icons.trash,
	},

]
