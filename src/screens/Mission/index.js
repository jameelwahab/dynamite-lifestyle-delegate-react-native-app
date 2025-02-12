import RootView from "../../components/RootView"
import TitleView from "../../components/TitleView.js"
import LessonView from "../../components/LessonView.js"
import MyLoader from "../../components/MyLoader"
import EmptyView from '../../components/EmptyView'
import MyRefreshControl from '../../components/MyRefreshControl'
import { selectUser } from '../../redux/reducers/userSlice'
import { View, FlatList, Text, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { useSelector } from 'react-redux'
import { GET_MISSION_LIST } from "../../DAL"
import { colors } from "../../utilities/colors"
import { fonts } from "../../utilities/fonts"
import routes from "../../navigation/routes"
import { useEffect, useState } from "react"

const MissionLevel = ({ navigation }) => {

	const { token } = useSelector(selectUser);
	const [res, setResult] = useState([])
	const [loading, setLoading] = useState(false)
	const [refreshing, setRefreshing] = useState(false)

	const getMission = async () => {
		let res = await GET_MISSION_LIST({ token, navigation })
		if (res.code == 200) {
			setResult(res)
			setLoading(false)
			setRefreshing(false)
		}
		else{
			setResult([])
			setLoading(false)
			setRefreshing(false)
		}
	}

	const onRefresh = () => {
		setRefreshing(true)
		getMission()
	}


	useEffect(() => {
		setLoading(true)
		getMission()
	}, [])


	const onMissionList = (item) => {
		navigation.navigate(routes.missionList, {
			id: item._id,
			icon: item.icon.thumbnail_1,
		})
	}

	return (
		<RootView hideBackBottomButton title="Mission Levels">
			<View style={__styles.container}>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={res.level_badges}
					keyExtraction={item => item}
					ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
					ListEmptyComponent={!loading && <EmptyView />}
					refreshControl={<MyRefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>}
					renderItem={({ item }) =>
						<LessonView
							handlePress={() => onMissionList(item)}
							title={item.title}
							heading={item.tagline}
							image={item.image.thumbnail_1}
							icon={item.icon.thumbnail_1}
							desc={item.short_description}
						/>
					} />
				<MyLoader enable={loading} />
			</View>
		</RootView>
	)
}
export default MissionLevel

const __styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	tagline: {
		color: colors.primary,
		fontFamily: fonts.medium,
		fontSize: 13,
	}
})



