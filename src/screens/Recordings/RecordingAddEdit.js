import { View, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyInputs from '../../components/MyInputs'
import MyTouchableInput from '../../components/MyTouchableInput'
import { icons } from '../../utilities/icons'
import { colors } from '../../utilities/colors'
import UploadAudio from '../../components/UploadAudio'
import UploadFileInput from '../../components/UploadFileInput'
import Editor from '../../components/Editor'
import { MyButton } from '../../components/MyButton'
import MyCheckBox from '../../components/MyCheckBox'
import moment from 'moment'
import CalendarModal from '../../components/CalendarModal'
import OptionModal from '../../components/OptionModal'
import { RECORDING_ADD, RECORDING_PROGRAMMES_AND_CATEGORY, RECORDING_REMOVE_AUDIO, RECORDING_UPDATE } from '../../DAL'
import { dateTimeFormat } from '../../utilities/constants'
import routes from '../../navigation/routes'
import MyLoader from '../../components/MyLoader'
import showToast from '../../functions/showToast'
import isArray from '../../functions/isArray'
import MyChip from '../../components/MyChip'

const RecordingAddEdit = ({ navigation, route }) => {
	const { token } = useSelector(selectUser);
	const { item } = route?.params;
	const ref_calendar = useRef();
	const [loader, setLoader] = useState(false)
	const [optionModal, setOptionModal] = useState({ isVisible: false, type: "", list: [], key: "" });
	const [programmes, setProgrammes] = useState([]);
	const [listMission, setListMission] = useState([])
	const [categories, setCategories] = useState([]);
	const [data, updateData] = useState({
		title: !!item?.title ? item?.title : "",
		date: !!item?.recording_date ? moment(item?.recording_date, "DD MMM, YYYY") : moment(),
		videoUrl: !!item?.video_url ? item?.video_url : "",
		status: typeof (item?.status) == "boolean" ? item?.status : true,
		programme: !!item?.programs ? item?.programs : null,
		missions: !!item?.missions ? item?.missions : null,
		category: !!item?.vault_category ? item?.vault_category : null,
		audio: !!item?.audio_recording ? item?.audio_recording : null,
		image: !!item?.recording_image?.thumbnail_1 ? item?.recording_image?.thumbnail_1 : "",
		shortDesc: !!item?.short_description ? item?.short_description : ""
	})
	const { title, date, videoUrl, status, programme, category, audio, image, missions, shortDesc } = data;
	const setData = (updation) => updateData((old) => ({ ...old, ...updation }));


	useEffect(() => {
		getDataFromServer()
	}, [])

	//* Functions

	const onSubmitPress = () => {
		if (!isArray(missions) && !category && !isArray(programme)) {
			showToast({ body: "In programme, missions / question and vault categories, one must be selected", title: "Error", type: "error" })
			setLoader(false)
			return
		}
		let fd = new FormData();
		fd.append("title", title?.trim());
		fd.append("short_description", shortDesc);
		fd.append("status", status);
		fd.append("video_url", videoUrl);
		fd.append("recording_date", moment(date).format("YYYY-MM-DD"));

		if (isArray(programme))
			fd.append("programs", isArray(programme) ? JSON.stringify(programme) : "");

		if (isArray(missions))
			fd.append("missions", isArray(missions) ? JSON.stringify(missions) : "")

		if (!!category)
			fd.append("vault_category_slug", !!category ? category?.vault_slug : "");

		if (image?.uri) {
			fd.append("image", image);
		}
		if (audio?.uri) {
			fd.append("audio_file", audio);
		}
		if (!!item) {
			upadte_recording_to_server(fd)
		} else {
			add_recording_to_server(fd)
		}
	}


	//! APIs
	const getDataFromServer = async () => {
		setLoader(true)
		let res = await RECORDING_PROGRAMMES_AND_CATEGORY({ navigation, token });
		if (res.code == 200) {
			setProgrammes(res?.programs);
			setCategories(res?.vault_category);
			setListMission(res?.missions)
			setLoader(false)
		} else {
			setLoader(false)
		}
	}

	const removeAudioFromServer = async () => {
		setLoader(true)
		let res = await RECORDING_REMOVE_AUDIO({ navigation, token, slug: item?.recording_slug });
		if (res.code == 200) {
			showToast({ title: res?.message, type: "success" })
			setData({ audio: null })
			setLoader(false)
		} else {
			setLoader(false)
		}
	}
	const add_recording_to_server = async (fd) => {
		setLoader(true)
		let res = await RECORDING_ADD({ navigation, token, formdata: fd });
		if (res.code == 200) {
			navigation.navigate(routes?.myRecordingsList);
			setLoader(false)
		} else {
			setLoader(false)
		}
	}

	const upadte_recording_to_server = async (fd) => {
		setLoader(true)
		let res = await RECORDING_UPDATE({ navigation, token, formdata: fd, slug: item?.recording_slug });
		if (res.code == 200) {
			showToast({ title: res?.message, type: "success" })
			navigation.navigate(routes?.myRecordingsList);
			setLoader(false)
		} else {
			setLoader(false)
		}
	}

	return (
		<RootView title={!!item ? 'Edit Recording' : 'Add Recording'} >
			<View style={{ flex: 1 }}>
				<KeyboardAwareScrollView
					enableResetScrollToCoords={false}
					contentContainerStyle={{ paddingBottom: 50 }}
					showsVerticalScrollIndicator={false}>

					<MyInputs
						label='Recording Title *'
						value={title}
						onChangeText={(text) => setData({ title: text })}
					/>

					<MyTouchableInput
						label='Recording Date'
						value={moment(date).format(dateTimeFormat.date)}
						icon={() => icons.calendar(colors.primary)}
						onPress={() => ref_calendar?.current?.openModal(date)}
					/>

					<MyInputs
						label='Video Url *'
						value={videoUrl}
						onChangeText={(text) => setData({ videoUrl: text })}
					/>

					<View style={__styles.radioRootView}>
						<MyText isLabel>Recording Status</MyText>
						<View style={__styles.radioView}>
							<View style={__styles.radioItem}>
								<MyCheckBox
									title='Active'
									onPress={() => setData({ status: true })}
									value={status}
								/>
							</View>
							<View style={__styles.radioItem}>
								<MyCheckBox
									title='Inactive'
									onPress={() => setData({ status: false })}
									value={!status}
								/>
							</View>
						</View>
					</View>

					<MyTouchableInput
						label='Programme'
						iconOnPress={() => setOptionModal({
							isVisible: true,
							list: isArray(programme) ? programmes.filter(el => programme.findIndex(i => i._id == el._id) < 0) : programmes,
							type: "programme",
							key: "title",
						})}
						view={() =>
							<View style={{ flexDirection: "row", flex: 1, alignItems: "center", flexWrap: "wrap", paddingVertical: 2 }}>
								{isArray(programme) != 0 && programme?.map((el, index) =>
									<View style={{ flexWrap: "wrap", position: "relative", zIndex: 10 }} key={index}>
										<MyChip title={el.title}
											onPress={() => {
												setData({ programme: programme.filter(ele => ele._id != el._id) })
											}} />
									</View>
								)}
							</View>
						}
					/>


					<MyTouchableInput
						label='Missions'
						iconOnPress={() => setOptionModal({
							isVisible: true,
							list: isArray(missions) ? listMission.filter(el => missions.findIndex(i => i._id == el._id) < 0) : listMission,
							type: "missions",
							key: "title",
						})}
						view={() =>
							<View style={{ flexDirection: "row", flex: 1, alignItems: "center", flexWrap: "wrap", paddingVertical: 2 }}>
								{isArray(missions) != 0 && missions?.map((el, index) =>
									<View style={{ flexWrap: "wrap", position: "relative", zIndex: 10 }} key={index}>
										<MyChip title={el.title}
											onPress={() => {
												setData({ missions: missions.filter(ele => ele._id != el._id) })
											}} />
									</View>
								)}
							</View>
						}

					/>

					<MyTouchableInput
						label='Vault Category'
						onPress={() => setOptionModal({ isVisible: true, list: categories, type: "category", key: "vault_title" })}
						clearbutton={!!category}
						value={category?.vault_title || ""}
						onClearButtonPress={() => setData({ category: null })}
					/>

					<UploadAudio
						label='Upload Audio'
						subLabel='Audio mp3 (max 200mb)'
						onAudioPicked={(audio) => setData({ audio: audio })}
						selectedAudio={audio}
						onRemoveBtnPress={() => {
							if (!!audio && !!audio.uri == false) {
								removeAudioFromServer()
							} else {
								setData({ audio: null })
							}
						}}
					/>


					<UploadFileInput
						label='Upload Image *'
						subLabel='Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")'
						onImagePicked={(img) => setData({ image: img })}
						selectedImage={image}
						hideRemoveButton
					/>

					<Editor
						label='Short Description *'
						height={150}
						initialValue={data.shortDesc}
						onChange={(desc) => setData({ shortDesc: desc })}
					/>

					<View style={{ marginTop: -5, marginLeft: 5, marginBottom: 20 }}>
						<MyText color={colors.lightText} fontSize={12}>Maximum limit 500 characters</MyText>
					</View>
					<View>
						<MyButton
							title='Submit'
							onPress={onSubmitPress}
						/>
					</View>

				</KeyboardAwareScrollView>
			</View>
			<MyLoader enable={loader} />
			<CalendarModal ref={ref_calendar} onDateSelected={(date) => setData({ date })} />
			<OptionModal
				isVisible={optionModal?.isVisible}
				optionList={optionModal?.list}
				titleKey={optionModal.key}
				checkSelected={(selected) => [optionModal?.type]._id == selected?._id}
				noIcon
				closeModal={() => setOptionModal({ isVisible: false, list: [], type: '' })}
				onSelected={(opt) => {
					if (optionModal.type == "programme") {
						setData({ programme: isArray(programme) ? [...programme, opt] : [opt] })
					}
					else if (optionModal.type == "missions") {
						setData({ missions: isArray(missions) ? [...missions, opt] : [opt] })
					}
					else {
						setData({ [optionModal.type]: opt })
					}

					setOptionModal({ isVisible: false, list: [], type: '' })
				}}
			/>
		</RootView>
	)
}

export default RecordingAddEdit


const __styles = StyleSheet.create({
	radioRootView: {
		marginBottom: 15
	},
	radioView: {
		flexDirection: "row",
		borderWidth: 1,
		borderColor: colors.lightText,
		borderRadius: 5,
		// padding: 2
		paddingHorizontal: 10,
		paddingTop: 10,
	},
	radioItem: {
		flex: 1,

	},
})
