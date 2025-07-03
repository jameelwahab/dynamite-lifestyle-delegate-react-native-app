import { View, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import MyRefreshingControl from "../../components/MyRefreshControl"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { GET_VAULT_LIST } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import WebPlayer from '../../components/WebPlayer'
import VimeoIFrame from '../../components/VimeoIFrame'
import utilities from '../../utilities'
import AudioPlayerForList from '../../components/AudioPlayerForList'
import { colors } from '../../utilities/colors'
import { MyButton } from '../../components/MyButton'
import FooterLoader from '../../components/FooterLoader'


const VaultList = ({ navigation, route }) => {
	const { token } = useSelector(selectUser);
	const { value } = route?.params;
	const { navbar } = useSelector(selectNavbar)
	const pagination = useRef({ page: 0, canLoadMore: false })
	const [title] = useState(navbar?.find(x => x.value == value)?.title);
	const [list, setList] = useState([])
	const [loader, setLoader] = useState({
		overall: false,
		refreshing: false,
		pagination: false,
	})
	const [width] = useState(utilities.screenWidth())
	useEffect(() => {
		getDataFromServer()
	}, []);


	const getDataFromServer = async () => {
		let res = await GET_VAULT_LIST({ navigation, token, page: pagination.current.page });
		if (res.code == 200) {
			let length = list.length + res?.recording;
			setList(pagination.current.page == 0 ? res?.recording : [...list, res?.recording])
			// setList(res?.recording)

			if (length < res.total_recordings) {
				pagination.current.page++;
				pagination.current.canLoadMore = true;
			}

			setLoader({ refreshing: false, overall: false, pagination: false })

		} else {
			setLoader({ refreshing: false, overall: false, pagination: false })
		}
	}

	async function loadMore() {
		if (pagination.current.canLoadMore && pagination.current.page != 0) {
			pagination.current.canLoadMore = false;
			setLoader({ ...loader, pagination: true })
			getDataFromServer()
		}
	}

	async function onRefresh() {
		pagination.current.page = 0;
		pagination.current.canLoadMore = false;
		setLoader({ ...loader, refreshing: true })
		getDataFromServer()
	}

	const renderRecordings = ({ item, index }) => {
		return (
			<View style={__styles.itemView}>
				<View style={__styles.header}>
					<View>
						<MyText fontSize={16} type='bold' >{item.title}</MyText>
					</View>
					<View style={{ alignItems: "flex-end" }}>
						<MyText color={colors.lightText} type='medium' >{item?.recording_date}</MyText>
						{/* <MyText>{moment(item.recording_date).format(dateTimeFormat.date)}</MyText> */}
					</View>
				</View>
				{item?.video_url.includes("vimeo") ?
					<VimeoIFrame url={item?.video_url} /> :
					<WebPlayer url={item?.video_url} width={width - 20} />}

				{!!item?.audio_recording &&
					<View style={__styles.subView}>
						<AudioPlayerForList
							url={item?.audio_recording}
							id={item?._id} />
					</View>}

				{!!item?.short_description &&
					<View style={__styles.subView}>
						<MyText>{item?.short_description}</MyText>
					</View>
				}

				{!!item?.program_info &&
					<View style={[__styles.subView, { alignSelf: "flex-start" }]}>
						<MyButton
							disable
							title={item?.program_info?.title}
							style={{ paddingHorizontal: 20 }}
							invert
						/>
					</View>
				}

				<View style={__styles.subView} />


			</View>
		)
	}

	return (
		<RootView
			title={title}
			subTitle={`Total : ${list.length}`}
			hideBackBottomButton
		>
			<View style={{ flex: 1 }} >


				<FlatList
					data={list}
					renderItem={renderRecordings}
					refreshControl={<MyRefreshingControl
						refreshing={loader.refreshing}
						onRefresh={onRefresh}
					/>
					}
					ListFooterComponent={<FooterLoader isVisible={loader?.pagination} />}
					onEndReached={loadMore}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 80 }}
				/>

			</View>
			<MyLoader enable={loader.overall && !loader.refreshing} />
		</RootView>
	)
}

export default VaultList;

const __styles = StyleSheet.create({
	itemView: {
		marginTop: 10,
		backgroundColor: colors.secondary,
		borderRadius: 10
	},
	header: {
		padding: 10
	},
	subView: {
		marginTop: 10,
		paddingHorizontal: 10
	}

})
