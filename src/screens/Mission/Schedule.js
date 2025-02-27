import RootView from "../../components/RootView"
import MyText from "../../components/MyText"
import MyWebview from "../../components/MyWebview"
import MyRefreshControl from "../../components/MyRefreshControl"
import TitleView from "../../components/TitleView"
import isArray from '../../functions/isArray';
import EmptyView from "../../components/EmptyView"
import MyCheckBox from "../../components/MyCheckBox"
import AudioPlayer from "../../components/AudioPlayer"
import ScheduleView from "../../components/Mission/ScheduleView"
import ResponsiveImage from "../../components/ResponsiveImage"
import LiveChat from "../../components/LiveChat"
import { S3_URL, dateTimeFormat, months } from "../../utilities/constants"
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
import { useEffect } from "react"
import { View, FlatList, Image, StyleSheet, Text, Pressable } from "react-native"
import moment from "moment"
import ItemCountView from "../../components/ItemCountView"

const Schedule = (props) => {
	return (
		<RootView hideSubHeader hideHeader>
			<Scheduler {...props} />
		</RootView>
	)
}
const Scheduler = ({ navigation, route }) => {
	const [loading, setLoading] = useState(false)
	const { token, user } = useSelector(selectUser);
	const [res, setResult] = useState([])
	const [refreshing, setRefreshing] = useState(false)
	const [showChat, setShowChat] = useState(false)
	const getResult = async (loader) => {
		setLoading(loader)
		const res = await GET_MISSION_SCHEDULE({
			token, navigation, id: route.params.id
		})
		if (res.code === 200) {
			setResult(res)
			setLoading(false)
			setRefreshing(false)
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

	if (loading) return <MyLoader enable={loading} />
	return (
		<View style={__styles.container}>
			<LiveChat
				user={user}
				flex={0.63}
				isVisible={showChat}
				closeModal={() => setShowChat(false)}
				eventId={route.params.id}
				token={token}
				naivgation={navigation}
			/>
			<FlatList
				ListHeaderComponent={
					<>
						<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
							<View style={{ flex: 0.95 }}>
								<TitleView title={res?.mission_schedule?.main_heading || "The Source Code"} />
							</View>
						{route.params.type == "quest" && <Pressable onPress={() => setShowChat(true)}>
								{icons.chat(colors.primary, 23)}
							</Pressable> }
						</View>
						<View style={{ height: 15 }} />

						{res?.mission_schedule?.video_url != "" ?
							(res?.mission_schedule?.video_url.includes("vimeo") ?
								<VimeoWithPip
									url={res?.mission_schedule?.video_url}
									focused={true} id={res?.mission?._id}
								/> :
								<WebPlayer width={utilities.screenWidth() - 20} url={res?.mission_schedule?.video_url} />
							) :
							<ResponsiveImage
								uri={S3_URL + res?.mission_schedule?.image?.thumbnail_1}
							/>
						}

						{res?.mission_schedule?.audio_url != "" && <AudioPlayer url={res?.mission_schedule?.audio_url} />}
						<View style={{ height: 15 }} />
						<Overview res={res} />
					</>
				}
				data={[res]}
				refreshControl={<MyRefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>}
				ListEmptyComponent={!loading && <EmptyView />}
				showsVerticalScrollIndicator={false}
				renderItem={({ item, index }) =>
					<>
						<ScheduleView
							schedule={res?.mission_schedule}
							index={index}
						/>
					</>
				} />
		</View>
	)
}

const Overview = ({ res }) => {
    const formatDate = (date)=> {
	const result = moment(date).format(dateTimeFormat.date).split('-')
	console.log(result)
	return  `${result[0]} ${months[result[1]-1].short2}, ${result[2]}`
    }
	return (
		<View style={__styles.schedule_container}>
			<MyText
				fontSize={16}
				color={colors.primary}
				style={{ fontFamily: fonts.bold }}
			>Schedule Overview
			</MyText>
			<View style={{ height: 5 }} />
			<MyWebview
				fullWidth
				html={res?.mission_schedule?.detailed_description || ""} />
			<View style={{ height: 10 }} />
			<View style={__styles.sched_img_container}>
				<ItemCountView
				    text1={formatDate(res?.mission_schedule?.createdAt)}
				    backgroundColor={colors.secondary}
				    text2={"Create Date"}
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

const Badge = ({ img, context }) => {
	return (
		<View style={__styles.badge}>
			<Image style={__styles.schedule_img} source={img} />
			<View style={{ width: 5 }} />
			<MyText>{context}</MyText>
		</View>
	)
}

const Options = ({ list }) => {
	return (
		<FlatList
			data={list}
			scrollEnabled={false}
			showsVerticalScrollIndicator={false}
			ItemSeparatorComponent={<View style={{ height: 5 }} />}
			keyExtraction={(_, index) => index.toString()}
			renderItem={({ item }) =>
				<View style={__styles.radio_container}>
					<MyCheckBox circle color={colors.border} />
					<View style={{ width: 10 }} />
					<MyText>
						{item}
					</MyText>
				</View>
			}
		/>
	)
}


const __styles = StyleSheet.create({
	container: {
		flex: 1
	},
	schedule_container: {
		padding: 15,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10
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
})


export default Schedule
