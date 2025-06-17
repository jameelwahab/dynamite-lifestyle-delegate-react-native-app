import { View, Text, TouchableOpacity, SectionList, StyleSheet, Dimensions } from "react-native"
import LessonView from "../../components/LessonView.js"
import TitleView from "../../components/TitleView"
import MyText from "../../components/MyText"
import MyRefreshControl from "../../components/MyRefreshControl"
import MyLoader from "../../components/MyLoader"
import MyWebview from "../../components/MyWebview"
import OptionModal2 from '../../components/OptionModal2'
import EmptyView from '../../components/EmptyView'
import { colors } from "../../utilities/colors"
import { fonts } from "../../utilities/fonts"
import { textSize } from "../../utilities/styles"
import { icons } from "../../utilities/icons"
import copyText from "../../functions/copyText"
import { GET_MISSION_LIST_ID, GET_MISSION_APP_LINK } from "../../DAL"
import { selectUser } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import { useRef } from "react"
import routes from "../../navigation/routes"
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import RootView from "../../components/RootView"
import isArray from "../../functions/isArray.js"


const List = ({ navigation, route }) => {
	const nav = useNavigation()
	const { token } = useSelector(selectUser);
	const [res, setResult] = useState([])
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
	const ref = useRef(null)

	const getMissionList = async (loader) => {
		setLoading(loader)
		let res = await GET_MISSION_LIST_ID({
			token,
			navigation,
			id: route.params.id
		})
		if (res.code == 200) {
			setResult(res)
			setRefreshing(false)
			setLoading(false)
		}
		else {
			setResult([])
			setLoading(false)
			setRefreshing(false)
		}
	}
	const handleCopyMethod = (link, mission_id, type) => {
		if (link) {
			copyText(link, `${type == "quest" ? "Quest" : "Mission"} link copied successfully`)
		}
		else {
			GET_MISSION_APP_LINK({ token, navigation, mission_id, type }).
				then(res => {
					if (res.code == 200) {
						copyText(res.url, `${type == "quest" ? "Quest" : "Mission"} link copied successfully`)
					}
				})
		}
	}

	useEffect(() => {
		getMissionList(true)
	}, [])

	const onRefresh = () => {
		setRefreshing(true)
		getMissionList(false)
	}

	const Header = () => (
		<>
			<View style={{ height: 5 }} />
			{!!res?.badge_level?.detailed_description &&
				<MyWebview
					fullWidth
					html={res?.badge_level?.detailed_description?.toString()}
				/>}
		</>
	)

	sectionHeader = ({ section }) => {
		if (isArray(section?.data)) {
			return (
				<View style={{ marginTop: 15, marginBottom: 10 }} >
					<MyText
						color={colors.primary}
						fontSize={textSize.title}
						style={{ fontFamily: fonts.bold }} >{section?.title}</MyText>
				</View>
			)
		}
		else return null
	}
	const handlePress = (item) => ref.current.openModal?.(item)

	const handleSelect = (opt, item) => {
		if (opt.key == "copy") {
			handleCopyMethod(item?.app_branch_url, item?._id, item?.type)
		} else if (opt.key == "member") {
			nav.navigate(routes.missionMemberList, { item })
		} else if (opt.key == "auto-grp") {
			nav.navigate(routes.automatedGrpList, {
				item: {
					title: item?.title,
					_id: item?._id,
					type: "mission"
				}
			})
		}
	}


	const filterList = (item) => {
		if (item?.type == "mission") {
			return [optionList[0], optionList[2], optionList[3]]
		}
		else if (item?.type == "quest") {
			return [optionList[0], optionList[1], optionList[3]]
		}
	}
	return (
		<RootView hideHeader>
			<OptionModal2
				ref={ref}
				onSelected={handleSelect}
				filterTheList={filterList}
			/>
			{!loading && <View style={{ height: 40, justifyContent: "center" }}>
				<TitleView
					title={res?.badge_level?.title}
					titleIcon={route.params.icon}
					customStyle={{ borderBottomWidth: 0.5, borderColor: colors.border, width: Dimensions.get('screen').width }}
				/>
			</View>}
			{loading ? <MyLoader enable={loading} /> :
				<SectionList
					style={__styles.container}
					renderSectionHeader={sectionHeader}
					sections={[
						{
							title: "Quests",
							data: res?.quests
						},
						{
							title: "Missions",
							data: res?.missions
						},
					]}
					refreshControl={<MyRefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>}
					stickySectionHeadersEnabled={false}
					ListHeaderComponent={<Header />}
					keyExtractor={(item) => item?._id}
					ListEmptyComponent={<EmptyView />}
					ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) =>
						<LessonView
							handlePress={() => nav.navigate(routes.missionDetail, {
								id: item._id,
								heading: item.title,
								type: item.type
							})}
							showMenu={true}
							handleClick={() => handlePress(item)}
							heading={item?.title}
							image={item?.image?.thumbnail_1}
							desc={item?.short_description}
							duration={item?.mission_duration}
						/>}
				/>}
		</RootView>
	)
}

export default List

const __styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	heading: {
		fontSize: 18,
		color: colors.primary,
		fontFamily: fonts.bold,
	},
	para: {
		color: "white",
		fontFamily: fonts.medium,
	}
})


const optionList = [
	{
		title: "Copy App Link",
		key: "copy",
		icon: () => icons.copy(colors.primary, 17),
	},
	{
		title: "Quest Members",
		key: "member",
		icon: icons.members2,
	},
	{
		title: "Mission Members",
		key: "member",
		icon: icons.members2,
	},
	{
		title: "Automated Group",
		key: "auto-grp",
		icon: icons.group,
	},
]
