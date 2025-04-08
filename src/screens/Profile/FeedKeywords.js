import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RootView from '../../components/RootView'
import MyCheckBox from "../../components/MyCheckBox"
import MyInputs from "../../components/MyInputs"
import MyChip from "../../components/MyChip"
import MyLoader from "../../components/MyLoader"
import { GET_FEED_KEYWORDS_SETTINGS, UPDATE_FEED_KEYWORDS_SETTINGS } from "../../DAL"
import { colors } from '../../utilities/colors'
import { icons } from '../../utilities/icons'
import { MyButton, TransparentButton } from '../../components/MyButton.js'
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native"
import breakReference from '../../functions/breakReference'
import { useState, useEffect, useRef } from "react"
import NotificationModal from "../../components/ReminderModals/NotificationModal"
import EmailModal from '../../components/ReminderModals/EmailModal'
import MessageModal from '../../components/ReminderModals/MessageModal'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import showToast from '../../functions/showToast'
import isArray from '../../functions/isArray'
import { Flex, Row } from '../../UIComponents/FlexViews'
import MyText from '../../components/MyText'
import MyKeyboardAvoidingView from '../../components/MyKeyboardAvoidingView'

const FeedKeywords = ({ navigation }) => {
	const { token } = useSelector(selectUser);
	const ref_email_modal = useRef();
	const ref_message_modal = useRef();
	const ref_notification_modal = useRef();
	const [cc, setCc] = useState([""])
	const [feedKeywordSetting, setFeedKeywordSetting] = useState([])
	const [loader, setLoader] = useState(false);

	const notifcationTypeHandler = (el, index) => {
		if (!isNotifyPresent(index, el)) {
			setFeedKeywordSetting(feedKeywordSetting.map((e, i) => i == index ?
				{ ...feedKeywordSetting[i], notifications: [...feedKeywordSetting[i].notifications, { ...el }] } : e))
		}
		else {
			setFeedKeywordSetting(feedKeywordSetting.map((e, i) => i == index ?
				{ ...feedKeywordSetting[i], notifications: feedKeywordSetting[i].notifications.filter(e => e.name != el.name) } : e))
		}
	}

	const handleNotifyEdit = (el, index) => {
		if (el.name == "email_notification_access") {
			ref_email_modal.current.openModal(feedKeywordSetting[index].notifications.find(e => e.name == el.name).email_notification_info || {}, index)
		}
		else if (el.name == "push_notification_access") {
			ref_notification_modal.current.openModal(feedKeywordSetting[index].notifications.find(e => e.name == el.name).push_notification_info, index)
		}
		else if (el.name == "message_notification_access") {
			ref_message_modal.current.openModal(feedKeywordSetting[index].notifications.find(e => e.name == el.name).message_notification_info, index)
		}
	}

	const isNotifyPresent = (indexFeed, el) => {
		return feedKeywordSetting[indexFeed].notifications.findIndex(x => x.name == el.name) > -1;
	}


	const notifyDatHandler = (data, index, type) => {
		let iindex = feedKeywordSetting[index].notifications.findIndex(x => x.name == type);
		if (iindex > -1) {
			setFeedKeywordSetting(feedKeywordSetting.map((el, ind) => ind == index ?
				{
					...feedKeywordSetting[ind],
					notifications: feedKeywordSetting[ind].notifications.map((e, i) => e.name == type ? { ...e, ...data } : e)

				} : el))
		}
		else {
			console.log("not present")
		}
	}

	const removeCc = (indexFeed, index) => {
		setFeedKeywordSetting(feedKeywordSetting.map((el, ind) => indexFeed == ind ?
			{
				...feedKeywordSetting[ind], keywords: feedKeywordSetting[ind].keywords.filter((x, i) => i != index && x)
			} : el))
	}

	const ccView = (index) => {
		if (feedKeywordSetting[index].keywords.length > 0) {
			return (
				<View style={{ flexDirection: "row", flexWrap: "wrap", paddingBottom: 5 }}>
					{feedKeywordSetting[index].keywords.map((x, i) => <MyChip title={x.value} key={i} onPress={() => removeCc(index, i)} />)}
				</View>
			)
		} else return null
	}

	const addAndRemo = (txt, index) => {
		if (txt == "add") {
			setFeedKeywordSetting([...feedKeywordSetting, { keywords: [], notifications: [] }])
			setCc([...cc, ""])
		}
		else if (txt == "rm") {
			setFeedKeywordSetting(feedKeywordSetting.filter((_, ind) => ind != index))
			setCc(cc.filter((_, ind) => ind != index))
		}
	}

	const getFeedKeywordsSetting = async () => {
		const result = await GET_FEED_KEYWORDS_SETTINGS({ token, navigation })
		setLoader(false)
		if (result.code == 200) {
			if (isArray(result?.feed_keyword_setting)) {
				setFeedKeywordSetting(result?.feed_keyword_setting)
			} else {
				setFeedKeywordSetting([{ keywords: [], notifications: [] }])
			}
		}
	}

	useEffect(() => {
		setLoader(true)
		getFeedKeywordsSetting()
	}, [])

	const updateTheList = async () => {
		setLoader(true)
		const res = await UPDATE_FEED_KEYWORDS_SETTINGS({
			token, navigation, feed_keyword_setting: feedKeywordSetting
		})
		if (res.code == 200) {
			showToast({ type: "success", title: res?.message })
			setLoader(false)
			navigation.goBack()
		} else {
			setLoader(false)
		}
	}

	const __keywordConfigurationView = ({ item, index }) => {
		return (
			<View
				style={__styles.notificationView}>

				<Row alignItems="center">
					<Flex flex={1}>
						<MyText color={colors.lightText2} type='medium' >Keywords</MyText>
					</Flex>
					<View style={__styles.btnContainer}>
						{feedKeywordSetting.length != 1 && <TouchableOpacity
							onPress={() => addAndRemo("rm", index)}
							style={{ padding: 5 }}>
							{icons.minusCircle()}
						</TouchableOpacity>}

						<TouchableOpacity
							onPress={() => addAndRemo("add", index)}
							style={{ padding: 5 }}>
							{icons.plusCircle()}
						</TouchableOpacity>
					</View>
				</Row>
				<View>
					<MyInputs
						// style={{ marginTop: -5 }}
						// label='Feed Keywords'
						noLable
						value={cc[index]}
						customView={() => ccView(index)}
						onChangeText={(text) => {
							if (cc.length == feedKeywordSetting.length) {
								setCc(cc.map((el, ind) => ind == index ? text : el))
							}
							else {
								setCc([...cc, text])
							}
						}}
						rightIcon={cc[index] != "" ? () => icons.plus(colors.primary) : null}
						rightIconOnPress={() => {
							setFeedKeywordSetting(feedKeywordSetting.map((el, ind) => ind == index ?
								{ ...feedKeywordSetting[ind], keywords: [...feedKeywordSetting[ind].keywords, { value: cc[index] }] } : el))
							setCc(cc.map((x, ind) => ind != index ? x : ""))
						}}
					/>
				</View>

				{notify.map((el, i) => {
					let isPresent = isNotifyPresent(index, el)
					return (
						<View
							style={[__styles.notifyContainer]}
							key={i}>
							<View style={{ flex: 1, }}>
								<MyCheckBox
									pb={0}
									value={isPresent}
									onPress={() => notifcationTypeHandler(el, index)}
									title={el.label}
								/>
							</View>
							<TransparentButton
								disabled={!isPresent}
								onPress={() => handleNotifyEdit(el, index)}
								icon={() => icons.editpencil(isPresent ? colors.primary : colors.transparent)} />
						</View>
					)
				}
				)}
			</View>
		)
	}


	return (
		<RootView
			hideChatIcon
			hideProfile
			hideNotificaitonIcon
			title="Feed Keywords Settings">
			<Flex flex={1}>
				<MyKeyboardAvoidingView noScrollView>
					<Flex flex={1}>
						<FlatList
							data={feedKeywordSetting}
							showsVerticalScrollIndicator={false}
							ListFooterComponentStyle={{ marginTop: 10 }}
							contentContainerStyle={{ paddingBottom: 50 }}
							KeyExtractor={(_, index) => index.toString()}
							renderItem={__keywordConfigurationView}
						/>
					</Flex>
				</MyKeyboardAvoidingView>
				{isArray(feedKeywordSetting) &&
					<MyButton title="Update" onPress={updateTheList} />}
			</Flex>

			<NotificationModal
				ref={ref_notification_modal}
				onReminderSavePress={(data, index) => {
					notifyDatHandler(data, index, "push_notification_access")
				}}
			/>

			<MessageModal
				ref={ref_message_modal}
				onReminderSavePress={(data, index) => {
					notifyDatHandler(data, index, "message_notification_access")
				}}
			/>

			<EmailModal
				ref={ref_email_modal}
				onReminderSavePress={(data, index) => {
					notifyDatHandler({ ...data, show_preview: true }, index, "email_notification_access")
				}}
			/>
			<MyLoader enable={loader} />
		</RootView>
	);
}



const notify = [
	{
		label: "Notification",
		name: "push_notification_access"
	},
	{
		label: "Message",
		name: "message_notification_access"
	},
	{
		label: "Email",
		name: "email_notification_access",
	},

]


const __styles = StyleSheet.create({
	notificationView: {
		marginVertical: 10,
		backgroundColor: colors.secondary,
		borderRadius: 10,
		padding: 10
	},
	notifyContainer: {
		// paddingVertical: 4,
		flexDirection: 'row',
		alignItems: "center",
		justifyContent: "space-between"
	},
	btnContainer: {
		flexDirection: "row",
		justifyContent: "flex-end"
	}
})

export default FeedKeywords;