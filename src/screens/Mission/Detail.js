import { View, Text, StyleSheet, FlatList, Image } from "react-native"
import TitleView from "../../components/TitleView"
import RootView from "../../components/RootView"
import MyLoader from "../../components/MyLoader"
import Tabs from "../../components/Tabs"
import MyText from "../../components/MyText"
import Contributor from "../../components/Contributor"
import MyWebview from "../../components/MyWebview"
import { fonts } from "../../utilities/fonts"
import { colors } from "../../utilities/colors"
import { GET_MISSION_DETAIL, GET_MISSION_INFO } from "../../DAL"
import { selectUser } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import { useEffect, useCallback } from "react"
import MissionRewardView from "../../components/MissionRewardView"
import FooterLoader from "../../components/FooterLoader"
import { useState, useRef } from "react"
import FeedScreen from "../Feed/FeedScreen"

const List = (props) => {
	return (
		<RootView hideSubHeader>
			<MissionDetail {...props} />
		</RootView>
	)
}

const MissionDetail = ({ navigation, route }) => {
	const { token } = useSelector(selectUser);
	const [tab, setTab] = useState(0)
	const tab_list = [
		{ title: "Mission Overview", tab: 0 },
		{ title: "Community", tab: 1 },
		{ title: "Completed", tab: 2 },
		{ title: "Progress", tab: 3 },
	]


	return (
		<View style={__styles.container}>
			<Tabs
				list={tab_list}
				tab={tab}
				style={{ zIndex: 10 }}
				changeTab={(e) => setTab(e)}

			/>
			{tab == 0 && <Overview token={token} navigation={navigation} id={route.params.id} />}
			{tab == 1 && <Community navigation={navigation} route={route} id={route.params.id} />}
			{tab > 1 && <MissionContributor
				tab={tab}
				token={token}
				navigation={navigation}
				id={route.params.id}
			/>
			}
		</View>
	)

}

const TrackerList = ({ res }) => {
	return (
		<FlatList
			scrollEnabled={false}
			style={__styles.card}
			showsVerticalScrollIndicator={false}
			data={res.mission_schedules}
			ListHeaderComponent={
				<>
					<Text style={__styles.heading}>{res.content_settings.schedule_heading}</Text>
				</>
			}
			ListHeaderComponentStyle={{ marginBottom: 10 }}
			KeyExtraction={(_, index) => index.toString()}
			ItemSeparatorComponent={<View style={{ height: 20 }} />}
			renderItem={({ item }) =>
				<View style={__styles.card_container}>
					<Text style={__styles.card_heading}>{item.main_heading}</Text>
					<Text style={{ color: "white" }}>{item.short_description}</Text>
				</View>
			}
		/>
	)
}


const Header = ({ res }) => {
	return (
		<>
			<MyWebview fullWidth html={`<iframe src=\"https://player.vimeo.com/video/1048341542\" width=\"640\" height=\"360\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"></iframe>`} />
			<View style={{ height: 10 }} />
			<MissionRewardView
				duration={res.mission_duration}
				acheivedCoins={res.rewarded_coins}
				badgesEarned={res.badge_configration}
			/>
			<MyWebview fullWidth html={res.detailed_description.toString()} />
		</>
	)
}

const Overview = ({ token, navigation, id }) => {
	const [res, setResult] = useState([])
	const [loading, setLoading] = useState(true);
	const getMissionDetail = useCallback(async (tab) => {
		setLoading(true)
		const res = await GET_MISSION_DETAIL({
			token, navigation, id
		})
		setResult(res.mission)
		setLoading(false)
	})
	useEffect(() => {
		getMissionDetail()
	}, [])
	if (loading) return <MyLoader enable={loading} />
	return (
		<FlatList
			style={{ marginTop: 10 }}
			showsVerticalScrollIndicator={false}
			ListHeaderComponent={<Header res={res} />}
			data={[1]}
			ListHeaderComponentStyle={{ marginBottom: 20 }}
			keyExtraction={(_, index) => index.toString()}
			renderItem={({ item }) => <TrackerList res={res} />}
		/>
	)
}

const Community = ({ token, navigation, id, route }) => {
	return (
		<View style={{ flex: 1, }}>
			<FeedScreen
				isScheduleFeedTabAllowed={false}
				hideTabs
				navigation={navigation}
				route={{
					...route,
					params: {
						...route?.params,
						feedFor: "mission",
						eventId: id
					}
				}}
			/>
		</View>
	)
}

const MissionContributor = ({ token, navigation, id, tab }) => {
	const [res, setResult] = useState([])
	const [loading, setLoading] = useState(true)
	const [footerLoader, setFooterLoader] = useState(false)
	let pagination = useRef({ page: 0, canLoadMore: false })
	const getList = async () => {
		setLoading(true)
		const res = await GET_MISSION_INFO({
			token, navigation, id
		})
		setResult(tab == 2 ? res.streak_leader_board_stats : res.coins_leader_board_stats)
		setLoading(false)
	}
	useEffect(() => {
		setResult([])
		pagination.current = { canLoadMore: false, page: 0 }
		getList()
	}, [tab])
	const loadMore = () => {
		setFooterLoader(true)
	}
	return (
		<>
			<FlatList
				data={res}
				keyExtraction={(_, index) => index.toString()}
				ListHeaderComponentStyle={{ marginVertical: 10 }}
				showsVerticalScrollIndicator={false}
				ItemSeparatorComponent={<View style={{ height: 10 }} />}
				onEndReached={loadMore}

				ListFooterComponent={<FooterLoader isVisible={footerLoader && !loading} />}
				renderItem={({ item, index }) =>
					<Contributor
						num={index + 1}
						name={`${item.user_info.first_name} ${item.user_info.last_name}`}
						img={item.user_info.profile_image}
						points={item.mission_attracted_coins} />
				}
			/>
			<MyLoader enable={loading} />
		</>
	);
}
const __styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 10,
	},
	card: {
		backgroundColor: colors.secondary,
		padding: 10,
		borderRadius: 10,
	},
	heading: {
		textAlign: "center",
		color: colors.primary,
		fontSize: 16,
		fontFamily: fonts.bold
	},
	card_container: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
	},
	card_heading: {
		color: colors.primary,
		fontSize: 14,
		fontFamily: fonts.bold
	},


})

export default List
