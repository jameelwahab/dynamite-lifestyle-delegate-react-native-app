import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RootView from '../../components/RootView'
import MyCheckBox from "../../components/MyCheckBox"
import MyInputs from "../../components/MyInputs"
import MyChip from "../../components/MyChip"
import { colors } from '../../utilities/colors'
import { icons } from '../../utilities/icons'
import { MyButton, TransparentButton } from '../../components/MyButton.js'
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native"
import breakReference from '../../functions/breakReference'
import { useState, useEffect, useRef } from "react"
import NotificationModal from "../../components/ReminderModals/NotificationModal"
import EmailModal from '../../components/ReminderModals/EmailModal'
import MessageModal from '../../components/ReminderModals/MessageModal'

const FeedKeywords = ({ navigation }) => {
	const ref_email_modal = useRef();
	const ref_message_modal = useRef();
	const ref_notification_modal = useRef();
	const [cc, setCc] = useState([""])
	const [feedKeywordSetting, setFeedKeywordSetting] = useState([{ keywords: [], notifications: [] }])

	const notifcationTypeHandler = (el) => {
		if (!isNotifyPresent(el)) {
			setnotifications({ ...notifications, notification_send_type: [...notifications.notification_send_type, el] })
		} else {
			setnotifications({ ...notifications, notification_send_type: notifications.notification_send_type.filter(x => x.name != el.name) })
		}
	}

	const handleNotifyEdit = (el, index) => {
		if (el.name == "email_notification_access") {
			ref_email_modal.current.openModal(el, index)
		}
		else if (el.name == "push_notification_access") {
			ref_notification_modal.current.openModal(el, index)
		}
		else if (el.name == "message_notification_access") {
			ref_message_modal.current.openModal(el, index)
		}
	}

	const isNotifyPresent = (el) => {
		return notifications.notification_send_type.findIndex(x => x.name == el.name) >= 0
	}


	const notifyDatHandler = (data, index, type) => {
		let iindex = notifications.notifications.findIndex(x => x.name == type);
		const el = notifications.notification_send_type.filter(x => x.name == type)
		if (iindex > -1) {
			setnotifications({ ...notifications, notifications: notifications.notifications.filter(x => x.name != type ? x : { ...x, ...data }) })
		}
		else {
			setnotifications({ ...notifications, notifications: [...notifications.notifications, { ...el[0], ...data }] })
		}
	}

	const removeCc = (indexFeed, index) => {
		setFeedKeywordSetting(feedKeywordSetting.map((el, ind) => indexFeed == ind ?
			{
				...feedKeywordSetting[ind], keywords: feedKeywordSetting[ind].keywords.filter((x, i) => i != index && x)
			} : feedKeywordSetting))
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

	const __configurationView = ({ item, index }) => {
		return (<View
			style={__styles.notificationView}>
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
			<View>
				<MyInputs
					label='Feed Keywords'
					value={cc[index]}
					customView={() => ccView(index)}
					onChangeText={(text) => setCc(cc.map((el, ind) => ind == index ? text : el))}
					rightIcon={cc[index] != "" ? () => icons.plus(colors.primary) : null}
					rightIconOnPress={() => {
						setFeedKeywordSetting(feedKeywordSetting.map((el, ind) => ind == index ?
							{ ...feedKeywordSetting[ind], keywords: [...feedKeywordSetting[ind].keywords, { value: cc[index] }] } : feedKeywordSetting))

						setCc(cc.map((x, ind) => ind != index ? x : ""))
					}}
				/>
			</View>

			{notify.map((el, index) =>
				<View
					style={__styles.notifyContainer}
					key={index}>
					<View style={{ flex: 1 }}>
						<MyCheckBox
							value={true}
							onPress={() => notifcationTypeHandler(el, index)}
							title={el.label}
						/>
					</View>
					{true &&
						<TransparentButton
							onPress={() => handleNotifyEdit(el, index)}
							icon={() => icons.editpencil()} />
					}
				</View>
			)}


		</View>)
	}


	return (
		<RootView
			hideChatIcon
			hideProfile
			hideNotificaitonIcon
			title="Feed Keywords Settings">
			<FlatList
				data={feedKeywordSetting}
				showsVerticalScrollIndicator={false}
				ListFooterComponentStyle={{ marginTop: 10 }}
				contentContainerStyle={{ paddingBottom: 50 }}
				ListFooterComponent={
					<MyButton title="Update" onPress={() => console.log("Oki ro")} />
				}
				KeyExtractor={(_, index) => index.toString()}
				renderItem={__configurationView}

			/>


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
		paddingVertical: 4,
		flexDirection: 'row',
		justifyContent: "space-between"
	},
	btnContainer: {
		flexDirection: "row",
		justifyContent: "flex-end"
	}
})

export default FeedKeywords;
