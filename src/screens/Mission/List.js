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
import { GET_MISSION_LIST_ID } from "../../DAL"
import { selectUser } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import routes from "../../navigation/routes"
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import RootView from "../../components/RootView"


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
		else{
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
		    <View style={{height:10}} />
			<TitleView
				title={res?.badge_level?.title}
				titleIcon={route.params.icon}
				/>
		    <View style={{height:5}} />
				{!!res?.badge_level?.detailed_description &&
				<MyWebview
					fullWidth
					html={res?.badge_level?.detailed_description?.toString()}
				/>}
		</>
	)
	return (
		<RootView hideSubHeader hideHeader>
			{loading ?  <MyLoader enable={loading} /> :
			<SectionList
				style={__styles.container}
				sections={[
				    {
					title:"Questss",
					data: res.quests
				    },
				    {
					title:"Missionss",
					data: res.missions
				    },
				]}
				refreshControl={<MyRefreshControl
				    refreshing={refreshing}
				    onRefresh={onRefresh}
				/>}
				ListHeaderComponent={
				    <>
				    <Header />
				    <View style={{height:10}} />
				    <MyText 
					color={colors.primary}
					fontSize={16}
					style={{fontFamily:fonts.bold}}
					>
					{(res.quests.length!=0 && "Quest") || (res.missions.length!=0 && "Missions")}
				    </MyText>
				    </>
				}
				keyExtractor={(item) => item?._id}
				ListHeaderComponentStyle={{ marginBottom: 10 }}
				ListEmptyComponent={<EmptyView />}
				stickySectionHeadersEnabled={false}
				showsVerticalScrollIndicator={false}
				ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
				refreshControl={<MyRefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>}
				renderItem={({ item }) =>
					<LessonView
						handlePress={() => nav.navigate(routes.missionDetail,
							{ 
							    id: item._id,
							    heading:item.title,
							    type: res.quests.length!=0 ? "quest" : "mission"
							})}
						heading={item.title}
						image={item.image.thumbnail_1}
						desc={item.short_description}
						duration={item.mission_duration}
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

