import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Pressable } from "react-native"
import RootView from "../../components/RootView"
import MyLoader from "../../components/MyLoader"
import EmptyView from '../../components/EmptyView'
import FooterLoader from '../../components/FooterLoader'
import utilities from "../../utilities"
import MyText from "../../components/MyText"
import VimeoWithPip from "../../components/VimeoWithPip"
import LessonView from "../../components/LessonView"
import Contributor from "../../components/Contributor"
import MyWebview from "../../components/MyWebview"
import WebPlayer from "../../components/WebPlayer"
import MyImage from "../../components/MyImage"
import {MyButton2} from "../../components/MyButton"
import { fonts } from "../../utilities/fonts"
import { colors } from "../../utilities/colors"
import { icons } from "../../utilities/icons"
import { S3_URL } from "../../utilities/constants"
import { textSize } from "../../utilities/styles"
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
import Dashboard from "react-native-vector-icons/MaterialCommunityIcons"
import Casino from "./Casino"
import Feather from "react-native-vector-icons/Feather"

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
	const [showChat, setShowChat] = useState(false)
	const tab_list = [
		{ title: <Dashboard name="view-dashboard-outline" size={23} color={tab== 0 ? colors.primary : colors.white} /> },
		{ title: <Feather name="target" size={23} color={tab== 1 ? colors.primary : colors.white} /> },
		{ title: <Feather name="users" size={23} color={tab== 2 ? colors.primary : colors.white} /> },
		{ title: tab==3 ? icons.casinoPrimary(23) : icons.casinoWhite(23),},
	]

	return (
		<View style={{ flex: 1 }}>
			{tab < 2 && <LiveChat
				flex={0.59}
				isVisible={showChat}
				closeModal={() => setShowChat(false)}
				eventId={route.params.id}
				token={token}
				user={user}
				type={route.params.type}
				naivgation={navigation}
			/>}
			<View style={__styles.container}>
				<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
					<View style={{ flexDirection: 'row', alignItems: "center" }}>
						<Pressable
							onPress={() => navigation.goBack()} >
							{icons.backMajor(colors.primary, 26)}
						</Pressable>
						<View style={{ width: 5 }} />
						<MyText type="bold" fontSize={textSize.title} color={colors.primary}> {route.params.heading || "The Source Code"} </MyText>
					</View>
					{(tab < 2 && route.params.type == "quest") ?
						<Pressable onPress={() => setShowChat(true)}>
							{icons.chat(colors.primary, 23)}
						</Pressable> : <View />
					}
				</View>

				<Tabs
					list={tab_list}
					tab={tab}
					style={{ marginTop:15,marginBottom:10,  borderBottomWidth:0.5, borderColor:colors.border }}
					changeTab={(e) => setTab(e)}
				/>
				{tab < 2 && <Overview
					token={token}
					navigation={navigation}
					id={route.params.id}
					type={route.params.type}
				/>}
				{tab == 2 && <Community route={route} navigation={navigation} />}
				{tab == 3 && <MissionContributor token={token} navigation={navigation} type={route.params.type} id={route.params.id} tab={tab} />}
			</View>
		</View>
	)

}

const Tabs = ({list, tab, style, changeTab})=> {
    return (
	<View style={[{flexDirection:"row", paddingHorizontal:5, justifyContent:"space-between"}, style]}>
	    
	    {list.map((el,index)=> 
		<TouchableOpacity
		    onPress={ ()=> changeTab(index) }
		    key={index}
		    style={{alignItems:"center"}}
		    >
			{el.title}
		    <View style={{height:5}} />
		    <View style={{width:50, height:3,borderRadius:10, backgroundColor:index == tab ? colors.primary : colors.transparent }}/>
		</TouchableOpacity>
	    )}
	</View>
    )
}

const TrackerList = ({ res, type }) => {
	const nav = useNavigation()
	const handlePress = (item) => nav.navigate(routes.missionSchedule, { id: item._id, type: type })
	return (
		<FlatList
			scrollEnabled={false}
			// style={__styles.card}
			showsVerticalScrollIndicator={false}
			data={res?.mission_schedules}
			ListHeaderComponent={
				<Text style={__styles.heading}>{res.content_settings.schedule_heading}</Text>
			}
			ListHeaderComponentStyle={{ marginBottom: 10 }}
			KeyExtraction={(_, index) => index.toString()}
			ItemSeparatorComponent={<View style={{ height: 20 }} />}
			renderItem={({ item }) =>
				// <View style={__styles.card_container}>
					<LessonView
						style={type != "quest" && {paddingHorizontal:10, paddingVertical:5}}
						image={type == "quest" ? item?.image?.thumbnail_1 : ""}
						txtlen={type == "quest" ? 30 : 55}
						heading={item.main_heading}
						desc={item.short_description}
						handlePress={() => handlePress(item)}
					/>
				// </View>
			}
		/>
	)
}


const Header = ({ res, show }) => {
	return (
		<>
			{res.video_url != "" ?
				<>
					{res?.video_url.includes("vimeo") ?
						<VimeoWithPip url={res?.video_url} focused={true} id={res?._id} /> :
						<WebPlayer width={utilities?.screenWidth() - 20} url={res?.video_url} />
					}
				</> :
				<MyImage source={{ uri: S3_URL + res.image?.thumbnail_1 }}
					style={{ width: "100%", height: 250 }} />
			}
			<View style={{ height: 10 }} />
			{show &&
				<MissionRewardView
					duration={res?.mission_duration}
					totalCoins={res?.rewarded_coins}
					badges={res?.badge_configration}
					showEarnedBadges={false}
					showBadgesEarned={false}
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
		else {
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
				<Header res={res} show={type == "mission"} />
			}
			refreshControl={<MyRefreshControl
				refreshing={refreshing}
				onRefresh={onRefresh}
			/>}
			ListHeaderComponentStyle={{ marginBottom: 20 }}
			keyExtraction={(_, index) => index.toString()}
			renderItem={({ _ }) =>
				res?.mission_schedules?.length != 0 && <TrackerList res={res} type={type} />
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

const MissionContributor = ({ token, tab, navigation, id,type }) => {
	const [res, setResult] = useState([])
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
	const [page, setPage] = useState(0)
	const [canLoadMore, setCanLoadMore] = useState(true)
	const [enablePagination, setEnablePagination]=useState(true)

	const getList = async ({loader=false, pageToLoad}) => {
		setLoading(loader)
		const resu = await GET_MISSION_INFO({
			token, navigation, id, page:pageToLoad,limit:15, type: "mission_leaderboard" 
		})
		if (resu.code == 200) {
			const result =  resu.streak_leader_board_stats
			if(pageToLoad!=0 && enablePagination)
			    setResult([...res, ...result])
			else if(!enablePagination)  setResult(result)
			else  setResult(result)

			setLoading(false)
			setRefreshing(false);
			setCanLoadMore(resu.streak_load_more != "")
		}
	}


	useEffect(() => {
		setPage(0)
		if (tab > 1) getList({loader:true, pageToLoad:0})
	}, [tab])


	const onRefresh = () => {
		setRefreshing(true);
		getList({loader:false, pageToLoad:0})
		setPage(0)
	}
	const handleReachEnd = () =>{
	   if(canLoadMore && enablePagination){
	       getList({loader:false, pageToLoad:page+1})
	       setPage(page+1)
	   } 
	} 
	if (loading) return <MyLoader enable={loading} />
	const Heading = () => {
	    return (
		<View style={{flexDirection:"row", justifyContent:"space-between", marginVertical:8}}>
		    <MyText type="bold" color={colors.primary} fontSize={textSize.title}>Quest Members</MyText>
		    <MyButton2
			title={ `View ${enablePagination ? "Less" : "More"}`}
			onPress={()=> setEnablePagination(!enablePagination) || (enablePagination && (setResult(res.slice(0,15)) || setPage(0) ) )}
		    />
		</View>
	    )
	}
	return (
		<>
			<FlatList
				data={res}
				keyExtraction={(_, index) => index.toString()}
				showsVerticalScrollIndicator={false}
				ItemSeparatorComponent={<View style={{ height: 10 }} />}
				ListEmptyComponent={!loading && <EmptyView />}
				ListFooterComponent={<FooterLoader isVisible={canLoadMore && enablePagination} />}
				ListHeaderComponent={<Heading />}
				onEndReached={handleReachEnd}
				refreshControl={<MyRefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>}
				renderItem={({ item, index }) =>
					<Contributor
						secondaryText={type=="mission" ? `${item?.completed_mission_days}/${item?.mission_duration}` : ""}
						num={index + 1}
						showBadge={false}
						name={`${item.user_info.first_name} ${item.user_info.last_name}`}
						user={item?.user_info}
						img={item.user_info.profile_image}
						points={type == "mission" ? item.mission_attracted_coins : ""} />
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
		// paddingVertical: 5,
		// paddingHorizontal: 10,
		// borderWidth: 1,
		// borderColor: colors.border,
		// borderRadius: 10,
	},
	card_heading: {
		color: colors.primary,
		fontSize: 14,
		fontFamily: fonts.bold
	},


})

export default List
