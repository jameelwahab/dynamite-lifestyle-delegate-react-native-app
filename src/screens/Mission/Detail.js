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
import { HeaderView } from "./Schedule.js"
import moment from 'moment'
import { dateTimeFormat, months } from "../../utilities/constants"
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
	const [showChat, setShowChat] = useState(true)
  const [enableChat, setEnableChat] = useState(false)
  const [chatID, setChatID] = useState(route.params.id)
 useEffect(()=> {console.log({enableChat, showChat})},[enableChat, showChat])
	const tab_quest = [
		{ title: <Dashboard name="view-dashboard-outline" size={20} color={tab== 0 ? colors.primary : colors.lightText} /> } ,
		{ title: <Feather name="target" size={20} color={tab== 1 ? colors.primary : colors.lightText} /> },
		{ title: <Feather name="users" size={20} color={tab== 2 ? colors.primary : colors.lightText} /> },
	]

	const tab_mission = [
		{ title: <Feather name="target" size={20} color={tab== 0 ? colors.primary : colors.lightText} /> },
		{ title: <Feather name="users" size={20} color={tab== 1 ? colors.primary : colors.lightText} /> },
	]
	    return (
		<View style={{ flex: 1 }}>
			{(tab == 0 && route.params.type=="quest" && enableChat)  && <LiveChat
				flex={0.59}
				isVisible={showChat}
				closeModal={() => setShowChat(false)}
				eventId={chatID}
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
					{(tab == 0 && route.params.type=="quest" && enableChat) ?
						<Pressable onPress={() => setShowChat(true)}>
							{icons.chat(colors.primary, 23)}
						</Pressable> : <View />
					}
				</View>

				<Tabs
					list={ route.params.type=="mission" ? tab_mission : tab_quest }
					tab={tab}
					style={{ marginTop:15, borderBottomWidth:0.5, borderColor:colors.border, }}
					changeTab={(e) => setTab(e)}
				/>
				{ ( (route.params.type == "quest" && tab < 2) || (route.params.type == "mission" && tab == 0) ) && <Overview
				  setEnableChat={setEnableChat}
				  setChatID={setChatID}
					token={token}
					navigation={navigation}
					id={route.params.id}
					showBadges={tab == 1}
					type={route.params.type}
				/>}
				{ ( (route.params.type=="quest" && tab == 2) || (route.params.type == "mission" && tab==1) ) && <Community route={route} navigation={navigation} />}
			</View>
		</View>
	)

}

const Tabs = ({list, tab, style, changeTab})=> {
	    return (
		<View style={[{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}, style]}>
		     {list.map((el,index)=>
			<TouchableOpacity
			    onPress={ ()=> changeTab(index) }
			    key={index}
			    style={ {alignItems:"center",  paddingHorizontal:list.length==2 ? 55: 35} }
			    >
				{el.title}
			    <View style={{height:3}} />
			    <View style={{width:50, height:3,borderRadius:10, backgroundColor:index == tab ? colors.primary : colors.transparent }}/>
			</TouchableOpacity>
	    )}
	</View>
    )
}


const TrackerList = ({ res, type }) => {
	const nav = useNavigation()
	const handlePress = (item) => nav.navigate(routes.missionSchedule, { id: item._id, type: type, heading:item?.main_heading  })
	return (
		<FlatList
			scrollEnabled={false}
			// style={__styles.card}
			showsVerticalScrollIndicator={false}
			data={res?.mission_schedules}
			ListHeaderComponent={
				<MyText color={colors.primary} type="bold" fontSize={textSize.title}>{res?.content_settings?.schedule_heading}</MyText>
			}
			ListHeaderComponentStyle={{ marginBottom: 15 }}
			KeyExtractor={(_, index) => index.toString()}
			ItemSeparatorComponent={<View style={{ height: 10 }} />}
			renderItem={({ item }) =>
					<LessonView
						missionDetail={true}
						txtlen={type == "quest" ? 30 : 55}
						heading={item.main_heading}
						desc={item.short_description}
						handlePress={() => handlePress(item)}
					/>
			}
		/>
	)
}


const Header = ({ res, show, showBadges, quest='', daysOn="" }) => {
    
	const startDate =  `${moment(res?.start_date).format(dateTimeFormat.date).split('-')[0]} ${months[Number(moment(res?.start_date).format(dateTimeFormat.date).split('-')[1])-1].short2}`
	const endDate =  `${moment(res?.end_date).format(dateTimeFormat.date).split('-')[0]} ${months[Number(moment(res?.end_date).format(dateTimeFormat.date).split('-')[1])-1].short2}`
		const [schedule,setSchedules] = useState(res)	
		useEffect(()=> {
				if(daysOn!=""){
						setSchedules(res?.mission_schedules.find(el=> el._id==daysOn))
				}
		},[daysOn])
		useEffect(()=>{
						console.log(schedule?.image?.thumbnail_1)
		},[schedule])
	return (
		<>
			{
				// 	res.video_url != "" ?
				// <>
				// 	{res?.video_url?.includes("vimeo") ?
				// 		<VimeoWithPip url={res?.video_url} focused={true} id={res?._id} /> :
				// 		<WebPlayer width={utilities?.screenWidth() - 20} url={res?.video_url} />
				// 	}
				// </> :
				// <MyImage source={{ uri: S3_URL + res.image?.thumbnail_1 }}
				// 	style={{ width: "100%", height: 250 }} />
				HeaderView({
						type: quest,
						embed_code: daysOn != "" ? schedule?.embed_code : res?.embed_code,
						video_url: daysOn != "" ? schedule?.video_url : res?.video_url,
						mission_id: daysOn != "" ? schedule?._id : res?._id,
						audio_url:  daysOn != "" ? schedule?.audio_url : res?.audio_url,
						img_url: daysOn != "" ? schedule?.image?.thumbnail_1 : res?.image?.thumbnail_1,
						title: daysOn != "" ? schedule?.audio_title : res?.title,
						desc:  daysOn != "" ? schedule?.audio_description : res?.audio_description ,

				})
			}
			<View style={{ height: 10 }} />
			{showBadges &&
				<MissionRewardView
					duration={res?.mission_duration}
					totalCoins={res?.rewarded_coins}
					badges={res?.badge_configration}
					questReplayAccessDays={res.replay_days}
					dateString={`${startDate} - ${endDate}`}
					isQuest={quest}
					showEarnedBadges={false}
					// showBadgesEarned={false}
				/>}
			{show && !!res?.detailed_description &&
				<MyWebview fullWidth html={res?.detailed_description?.toString()} />}
		</>
	)
}

const Overview = ({ token, navigation, id, type, showBadges, setEnableChat, setChatID }) => {
	const [res, setResult] = useState([])
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
  const [daysOn, setDaysOn] = useState("")

	const getMissionDetail = async (loader) => {
		setLoading(loader)
		const res = await GET_MISSION_DETAIL({
			token, navigation, id
		})
		if (res.code == 200) {
			setResult(res.mission)
			setLoading(false)
			setRefreshing(false);
		  setEnableChat(res?.mission?.is_chat_enabled)
		  setDaysOn(res?.mission?.show_day_on_dashboard || "")
		  if(res?.mission?.show_day_on_dashboard){
					setChatID(res?.mission?.mission_schedules.find(el=> el._id==res?.mission?.show_day_on_dashboard)?._id)
					setEnableChat(res?.mission?.mission_schedules.find(el=> el._id==res?.mission?.show_day_on_dashboard)?.is_chat_enabled)
			}
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
			style={{ paddingTop: 15 }}
			showsVerticalScrollIndicator={false}
			data={[1]}
			ListEmptyComponent={!loading && <EmptyView />}
			ListFooterComponent={<View style={{height:100}}/>}
			ListHeaderComponent={
				<Header res={res} show={type == "mission" } quest={type=="quest"} daysOn={daysOn} showBadges={showBadges || type=="mission"}/>
			}
			refreshControl={<MyRefreshControl
				refreshing={refreshing}
				onRefresh={onRefresh}
			/>}
			ListHeaderComponentStyle={{ marginBottom: 20 }}
			keyExtractor={(_, index) => index.toString()}
			renderItem={({ _ }) =>
				 <TrackerList res={res} type={type} />
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
	card_heading: {
		color: colors.primary,
		fontSize: 14,
		fontFamily: fonts.bold
	},


})

export default List
