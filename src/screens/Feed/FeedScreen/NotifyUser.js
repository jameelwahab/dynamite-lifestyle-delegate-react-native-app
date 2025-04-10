import Modal from 'react-native-modal'
import { forwardRef, useState, useImperativeHandle, useRef, useEffect } from "react"
import { StyleSheet, TextInput, View, SafeAreaView, Text, Pressable, useWindowDimensions } from "react-native";
import { colors } from '../../../utilities/colors'
import { fonts } from '../../../utilities/fonts'
import { icons } from '../../../utilities/icons'
import Collapsible from 'react-native-collapsible'
import { NOITFY_USERS } from "../../../DAL"
import breakReference from '../../../functions/breakReference'
import showToast from '../../../functions/showToast'
import MyText from '../../../components/MyText'
import { MyButton } from '../../../components/MyButton'
import MyInputs from '../../../components/MyInputs';
import { Flex, Row } from '../../../UIComponents/FlexViews';
import Toast from 'react-native-toast-message';

const NotifyUser = forwardRef(({ navigation, token }, ref) => {

	const [isVisible, setIsVisible] = useState(false);
	const [notify, setNotify] = useState({ state: "", desc: "", id: "" })
	const ref_input = useRef(null)
	const [inputHeight, setInputHeight] = useState(0)
	const { height, width } = useWindowDimensions();
	const [mentionList, setMentionList] = useState([]);
	const [loading, setLoading] = useState(false)


	const openModal = (id) => {
		setNotify({ ...notify, id })
		setIsVisible(true)
	}

	const closeModal = () => {
		setNotify({ state: "", desc: "", id: "" })
		setIsVisible(false)
		setLoading(false);
	}

	useImperativeHandle(ref, () => {
		return {
			openModal
		}
	}, [])


	const handlePress = async () => {
		if (notify.state == "" || notify.desc == "") {
			showToast({ title: "info", body: "Notication statement and Notication description should be not be empty" })
		}
		else {
			setLoading(true)
			const result = await NOITFY_USERS({
				token, navigation, id: notify.id,
				notify_state: notify.state,
				notify_desc: notify.desc,
			})

			if (result.code == 200) {
				setLoading(false);
				closeModal()
			}
			else {
				setLoading(false)
			}
		}
	}


	const replaceAndHighlight = str => {
		let parts = [];
		let lastIndex = 0;
		mentionList.forEach(user => {
			let startIndex = user?.offset;
			let endIndex = user?.offset + user?.length
			if (lastIndex < startIndex) {
				parts.push(str.slice(lastIndex, startIndex));
			}
			parts.push(<Text style={__style.mentionUserText} >{str.substring(startIndex, endIndex)}</Text>);
			lastIndex = endIndex;
		});

		if (lastIndex < str?.length) {
			parts.push(str.slice(lastIndex));
		}

		return parts
	}

	return (
		<Modal
			isVisible={isVisible}
			onBackdropPress={closeModal}
			onBackButtonPress={closeModal}
			useNativeDriverForBackdrop={true}
			animationIn="slideInUp"
			animationOut="slideOutDown"
			animationInTiming={300}
			animationOutTiming={300}
			hideModalContentWhileAnimating={true}
			style={{ margin: 0, }}
			avoidKeyboard={true}>
			<View style={__styles.modalRootView}>
				<Row>
					<Flex flex={1}>
						<MyText fontSize={20} type="bold">Notify Users</MyText>
					</Flex>
					<Pressable
						style={{ backgroundColor: colors.secondary,height:25,width:25,  borderRadius: 25/2,alignItems:"center",justifyContent:"center" }}
						onPress={closeModal}>
						{icons.crosss(colors.white, 17)}
					</Pressable>
				</Row>

				<View style={{height:1,backgroundColor:colors.border,marginVertical:10}} />

				<View style={{}}>

					<MyInputs
						label='Notification Statement*'
						value={notify?.state}
						onChangeText={(text) => setNotify({ ...notify, state: text })}

					/>

					<MyInputs
						label='Notification Description*'
						value={notify?.desc}
						onChangeText={(text) => setNotify({ ...notify, desc: text })}
						multiline={true}
					/>

				</View>

				<View style={{  }}>
					<MyButton
						loading={loading}
						onPress={handlePress}
						invert={true} title={loading ? 'Post...' : 'POST'} />
				</View>

			</View>
			{isVisible && <Toast/>}
		</Modal>
	)
})

const __styles = StyleSheet.create({
	modalRootView: {
		backgroundColor: colors.secondaryVariant,
		borderRadius: 15,
		paddingHorizontal: 15,
		paddingVertical:20,
		marginHorizontal:10,
		
		// paddingVertical: 10,
		// paddingHorizontal: 20
	},
	heading_container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		// paddingVertical: 10,
		// paddingHorizontal: 15,
		borderColor: colors.border,
		borderBottomWidth: 1,
		// marginBottom: 10,
	},
	modalInput: {
		// minHeight: 70,
		// maxHeight: 150,
		// borderRadius: 10,
		// marginTop: 10,
		// padding: 10,
		// paddingTop: 10,
		// color: colors.lightText

	},
})

export default NotifyUser
