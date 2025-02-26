import { View, Text, TouchableOpacity, SectionList, StyleSheet } from "react-native"
import LessonView from "../../components/LessonView.js"
import TitleView from "../../components/TitleView"
import MyText from "../../components/MyText"
import MyRefreshControl from "../../components/MyRefreshControl"
import MyLoader from "../../components/MyLoader"
import MyWebview from "../../components/MyWebview"
import EmptyView from '../../components/EmptyView'
import { colors } from "../../utilities/colors"
import { fonts } from "../../utilities/fonts"
import { textSize } from "../../utilities/styles"
import { GET_MISSION_LIST_ID } from "../../DAL"
import { selectUser } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
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

	useEffect(() => {
		getMissionList(true)
	}, [])

	const onRefresh = () => {
		setRefreshing(true)
		getMissionList(false)
	}

	const Header = () => (
		<>
			<View style={{height:5}}/>	
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

	return (
		<RootView hideSubHeader hideHeader>
		    {!loading && <View style={{height:40, justifyContent:"center"}}>
			<TitleView
			    title={res?.badge_level?.title}
			    titleIcon={route.params.icon}
			    />
			</View> 
		    }
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
					ItemSeparatorComponent={()=><View style={{height:10}}/>}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) =>
						<LessonView
							handlePress={() => nav.navigate(routes.missionDetail, {
								id: item._id,
								heading: item.title,
								type: res.quests.length != 0 ? "quest" : "mission"
							})}
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

