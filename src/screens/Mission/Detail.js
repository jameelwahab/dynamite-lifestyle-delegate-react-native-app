import { View, Text, StyleSheet, FlatList, Image, Pressable } from "react-native"
import TitleView from "../../components/TitleView"
import RootView from "../../components/RootView"
import MyLoader from "../../components/MyLoader"
import EmptyView from '../../components/EmptyView'
import Tabs from "../../components/Tabs"
import utilities from "../../utilities"
import MyText from "../../components/MyText"
import VimeoWithPip from "../../components/VimeoWithPip"
import Contributor from "../../components/Contributor"
import MyWebview from "../../components/MyWebview"
import WebPlayer from "../../components/WebPlayer"
import { fonts } from "../../utilities/fonts"
import { colors } from "../../utilities/colors"
import { icons } from "../../utilities/icons"
import { GET_MISSION_DETAIL, GET_MISSION_INFO } from "../../DAL"
import { selectUser } from '../../redux/reducers/userSlice'
import LiveChat from "../../components/LiveChat"
import { useSelector } from 'react-redux'
import { useEffect, useCallback } from "react"
import MissionRewardView from "../../components/MissionRewardView"
import MyRefreshControl from "../../components/MyRefreshControl"
import { useState, useRef } from "react"
import routes from "../../navigation/routes"
import { useNavigation } from "@react-navigation/native"
import FeedScreen from "../Feed/FeedScreen"

const List = (props) => {
	return (
		<RootView hideSubHeader hideHeader>
			<MissionDetail {...props} />
		</RootView>
	)
}

const MissionDetail = ({ navigation, route }) => {
	const { token, user } = useSelector(selectUser);
	const [tab, setTab] = useState(0)
	const [showChat,setShowChat] = useState(false)
	const tab_list = [
		{ title: "Mission Overview" },
		{ title: "Community" },
		{ title: "Completed"},
		route.params.type !="quest" && 
		{ title: "In Progress" },
	]

	return (
		<View style={__styles.container}>
		    <LiveChat
			isVisible={showChat}
			closeModal={()=> setShowChat(false)}
			eventId={route.params.id}
			token={token}
			user={user}
			type={route.params.type}
			naivgation={navigation}
		    />
		    <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:'center'}}>
			<View style={{flex:0.95}}>
			    <TitleView title={route.params.heading || "The Source Code"} />
			</View>
			{ route.params.type=="quest" && 
			    <Pressable onPress={()=> setShowChat(true)}>
				{icons.chat(colors.primary, 23)}
			    </Pressable>
			}
		    </View>

			<Tabs
				list={tab_list}
				tab={tab}
				style={{ zIndex: 10 }}
				changeTab={(e) => setTab(e)}
			/>
			{tab == 0 && <Overview 
					token={token}
					navigation={navigation}
					id={route.params.id}
					type={route.params.type}
				    />}
			{tab == 1 && <Community route={route} navigation={navigation}/>}
			{tab > 1 && <MissionContributor token={token} navigation={navigation} id={route.params.id} tab={tab} />}
		</View>
	)

}

const TrackerList = ({ res, type }) => {
	const nav = useNavigation()
	const handlePress = (item) => nav.navigate(routes.missionSchedule, { id: item._id, type:type })
	return (
		<FlatList
			scrollEnabled={false}
			style={__styles.card}
			showsVerticalScrollIndicator={false}
			data={res?.mission_schedules}
			ListHeaderComponent={
				<Text style={__styles.heading}>{res.content_settings.schedule_heading}</Text>
			}
			ListHeaderComponentStyle={{ marginBottom: 10 }}
			KeyExtraction={(_, index) => index.toString()}
			ItemSeparatorComponent={<View style={{ height: 20 }} />}
			renderItem={({ item }) =>
				<Pressable onPress={() => handlePress(item)}>
					<View style={__styles.card_container}>
						<Text style={__styles.card_heading}>{item.main_heading}</Text>
						<Text style={{ color: "white" }}>{item.short_description}</Text>
					</View>
				</Pressable>
			}
		/>
	)
}


const Header = ({ res, show }) => {
	return  (
		<>
			{res?.video_url.includes("vimeo") ?
			    <VimeoWithPip url={res?.video_url} focused={true} id={res?._id} /> :
			    <WebPlayer width={utilities?.screenWidth() - 20} url={res?.video_url} />
			}
			<View style={{ height: 10 }} />
			{show && 
			    <MissionRewardView
				duration={res?.mission_duration}
				acheivedCoins={res?.rewarded_coins}
				badgesEarned={res?.badge_configration}
			    />}
			{show && !!res?.detailed_description &&
				<MyWebview fullWidth html={res?.detailed_description?.toString()} />}
		</>
	)
}

const Overview = ({ token, navigation, id, type }) => {
	const [res, setResult] = useState([])
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)

	const getMissionDetail = async (loader) => {
		setLoading(loader)
		const res = await GET_MISSION_DETAIL({
			token, navigation, id
		})
		if (res.code == 200) {
			setResult(res.mission)
			setLoading(false)
			setRefreshing(false);
		}
		else{
			setResult([])
			setLoading(false)
			setRefreshing(false);
		}
	}


	useEffect(() => {
		getMissionDetail(true)
	}, [])

	const onRefresh = () => {
		setRefreshing(true);
		getMissionDetail(false)
	}


	if (loading) return <MyLoader enable={loading} />
	return (
		<FlatList
			style={{ marginTop: 10 }}
			showsVerticalScrollIndicator={false}
			data={[1]}
			ListEmptyComponent={!loading && <EmptyView />}
			ListHeaderComponent={
				<Header res={res} show={type=="mission"} />
			}
			refreshControl={<MyRefreshControl
				refreshing={refreshing}
				onRefresh={onRefresh}
			/>}
			ListHeaderComponentStyle={{ marginBottom: 20 }}
			keyExtraction={(_, index) => index.toString()}
			renderItem={({ _ }) =>
				 res?.mission_schedules?.length !=0 &&  <TrackerList res={res} type={type} /> 
			}
		/>
	)
}

const Community = ({ navigation, route }) => {
	return (
		<View style={{ flex: 1, }}>
			<FeedScreen
				hideTabs
				navigation={navigation}
				route={{
					...route,
					params: {
						...route?.params,
						feedFor: "mission",
						eventId: route?.params?.id
					}
				}}
			/>
		</View>
	)
}

const MissionContributor = ({ token, tab, navigation, id }) => {
	const [res, setResult] = useState([])
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)

	const getList = async (loader) => {
		setLoading(loader)
		const res = await GET_MISSION_INFO({
			token, navigation, id
		})
		if (res.code == 200) {
			setResult(tab == 2 ? res.streak_leader_board_stats : res.coins_leader_board_stats)
			setLoading(false)
			setRefreshing(false);
		}
	}


	useEffect(() => {
		if (tab > 1) getList(true)
	}, [tab])


	const onRefresh = () => {
		setRefreshing(true);
		getList(false)
	}

	if (loading) return <MyLoader enable={loading} />
	return (
		<>
			<FlatList
				data={res}
				keyExtraction={(_, index) => index.toString()}
				showsVerticalScrollIndicator={false}
				ItemSeparatorComponent={<View style={{ height: 10 }} />}
				ListEmptyComponent={!loading && <EmptyView />}
				refreshControl={<MyRefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>}
				renderItem={({ item, index }) =>
					<Contributor
						secondaryText={tab == 3 ? `${item?.completed_mission_days}/${item?.mission_duration}` : ""}
						num={index + 1}
						name={`${item.user_info.first_name} ${item.user_info.last_name}`}
						user={item?.user_info}
						img={item.user_info.profile_image}
						points={item.mission_attracted_coins} />
				} />
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
