import RootView from "../../components/RootView"
import React from "react"
import MyText from "../../components/MyText"
import MyWebview from "../../components/MyWebview"
import MyRefreshControl from "../../components/MyRefreshControl"
import TitleView from "../../components/TitleView"
import isArray from '../../functions/isArray';
import EmptyView from "../../components/EmptyView"
import MyCheckBox from "../../components/MyCheckBox"
import AudioPlayer from "../../components/AudioPlayer"
import ScheduleView from "../../components/Mission/ScheduleView"
import ResponsiveImage2 from "../../components/ResponsiveImage2"
import LiveChat from "../../components/LiveChat"
import VimeoWithPip from "../../components/VimeoWithPip"
import WebPlayer from "../../components/WebPlayer"
import MyLoader from "../../components/MyLoader"
import extractTextFromHtml from "../../functions/extractTextFromHTML.js"
import utilities from "../../utilities"
import { colors } from "../../utilities/colors"
import { fonts } from "../../utilities/fonts"
import { GET_MISSION_SCHEDULE } from "../../DAL"
import { icons } from '../../utilities/icons'
import { useState } from "react"
import { selectUser } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import { textSize } from "../../utilities/styles"
import { useEffect, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { View, FlatList, Image, StyleSheet, Text, Pressable, } from "react-native"
import ItemCountView from "../../components/ItemCountView"
import Header from "../../components/Header"

const Schedule = (props) => {
	return (
		<RootView hideSubHeader hideHeader>
			<Scheduler {...props} />
		</RootView>
	)
}
const Scheduler = ({ navigation, route }) => {
	const [loading, setLoading] = useState(false)
	const { token, user, access, S3_URL } = useSelector(selectUser);
	const [res, setResult] = useState([])
	const [refreshing, setRefreshing] = useState(false)
	const [showChat, setShowChat] = useState(true)
	const [enableChat, setEnableChat] = useState(false)


		console.log("here is the type", route.params.type)
	const getResult = async (loader) => {
		setLoading(loader)
		const res = await GET_MISSION_SCHEDULE({
			token, navigation, id: route.params.id
		})
		if (res.code === 200) {
			setResult(res)
			setLoading(false)
			setRefreshing(false)
			setEnableChat(res?.mission_schedule?.is_chat_enabled)
		}
		else {
			setResult([])
			setLoading(false)
			setRefreshing(false)
		}
	}

	useEffect(() => {
		getResult(true)
	}, [])

	const onRefresh = () => {
		setRefreshing(true)
		getResult(false)
	}

	const [isFocused, setIsFocused] = useState(false);

	useFocusEffect(useCallback(() => {
		setIsFocused(true);
		return () => {
			setIsFocused(false);
		}
	}, []))


	return (
		<View style={__styles.container}>
			<View style={__styles.heading_container}>
				<View style={{ flexDirection: 'row', alignItems: "center",paddingVeritcal:10, flex:1}}>

					<Pressable
						onPress={() => navigation.goBack()} >
						{icons.backMajor(colors.primary, 26)}
					</Pressable>
					<View style={{ width: 10, }} />
					<MyText
						type="bold"
						style={{flex:0.95}}
						fontSize={textSize.title}
						color={colors.primary}>
						{res?.mission_schedule?.main_heading || route?.params?.heading || "The Source Code"}
					</MyText>
				</View>

				{(route.params.type == "quest" && enableChat) && <Pressable onPress={() => setShowChat(true)}>
					{icons.chat(colors.primary, 23)}
				</Pressable>}
			</View>
			<View style={{ height: 5 }} />
			{(route.params.type == "quest" && enableChat) &&
				<LiveChat
					user={user}
					flex={0.63}
					isVisible={showChat}
					closeModal={() => setShowChat(false)}
					eventId={route.params.id}
					token={token}
					access={access}
					navigation={navigation}
				/>
			}
			<FlatList
				style={{ paddingTop: 10 }}
				ListHeaderComponent={!loading &&
					<>
						{HeaderView({
							type: route.params.type,
							embed_code: res?.mission_schedule?.embed_code,
							video_url: res?.mission_schedule?.video_url,
							mission_id: res?.mission?._id,
							audio_url: res?.mission_schedule?.audio_url,
							img_url: res?.mission_schedule?.image?.thumbnail_1,
							title: res?.mission_schedule?.audio_title,
							desc: res?.mission_schedule?.audio_description,
							focuse: isFocused

						})}
						<View style={{ height: 10 }} />
						<Overview res={res} />
						<View style={{ height: 5 }} />
					</>
				}
				data={[res]}
				refreshControl={<MyRefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>}
				ListEmptyComponent={!loading && <EmptyView />}
				keyExtractor={(_, index) => index.toString()}
				ListFooterComponent={<View style={{ height: 50 }} />}
				showsVerticalScrollIndicator={false}
				renderItem={({ item, index }) => !loading &&
					<>
						<ScheduleView
							schedule={res?.mission_schedule}
							index={index}
						/>
					</>
				} />
			<MyLoader enable={loading} />
		</View>
	)
}

export const HeaderView = ({ type = "", embed_code = "", video_url = "", mission_id = "", audio_url = "", img_url = "", title = "", desc = "", focuse = true }) => {

	if (type == "quest" && !!embed_code) {
		return (
			<MyWebview
				width={utilities.screenWidth() - 20}
				html={embed_code || ""} />
		)
	} else if (!!video_url) {
		return video_url?.includes("vimeo") ?
			<VimeoWithPip
				url={video_url}
				focused={focuse} id={mission_id}
			/> :
			<WebPlayer width={utilities.screenWidth() - 20} url={video_url}

				height={230}
			/>

	} else if (!!audio_url) {
		return (
			<AudioPlayer
				url={audio_url}
				mission={type == "mission"}
				title={title}
				desc={desc}
			/>
		)
	}
	else if (img_url != "") {
		return (<ResponsiveImage2
			uri={S3_URL + img_url}
		/>)
	}
}

const Overview = ({ res }) => {
	return (
		<View>
			{!!res?.mission_schedule?.detailed_description &&
				<MyWebview
					fullWidth
					html={res?.mission_schedule?.detailed_description || ""} />}
			<View style={{ height: 25 }} />
			<View style={__styles.sched_img_container}>
				<ItemCountView
					text1={`${res?.mission_schedule?.total_number_of_days} day`}
					backgroundColor={colors.secondary}
					text2={"Schedule"}
					img={require("../../assets/icons/calendar.png")}
				/>
				<ItemCountView
					text1={`${res?.mission_schedule?.reward_coins}`}
					backgroundColor={colors.secondary}
					text2={"Coins Rewards"}
					img={require("../../assets/icons/coin.png")}
				/>
			</View>
		</View>
	)
}


const __styles = StyleSheet.create({
	container: {
		flex: 1
	},
	sched_img_container: {
		flexDirection: "row",
		justifyContent: "space-between"
	},
	schedule_img: {
		width: 20,
		height: 20,
	},
	badge: {
		flexDirection: 'row',
		alignItems: "center",
		backgroundColor: colors.secondarySelect,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 30,
		opacity: 0.8
	},
		heading_container:{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: 'center',
				marginTop:10,
				backgroundColor: colors.darkSecondary, 
				zIndex:10 
		},
})


export default Schedule
