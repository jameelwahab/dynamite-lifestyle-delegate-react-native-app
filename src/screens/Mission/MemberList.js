import RootView from "../../components/RootView"
import TitleView from "../../components/TitleView"
import MyText from "../../components/MyText"
import MyChip from "../../components/MyChip"
import MyImage from "../../components/MyImage"
import FooterLoader from '../../components/FooterLoader'
import MyRefreshControl from "../../components/MyRefreshControl"
import MyLoader from "../../components/MyLoader"
import MemberView from '../../components/MemberView'
import StatView from '../../components/StatView'
import ImgAndTxt from '../../components/ImgAndTxt'
import SearchView from "../../components/SearchView"
import StatusView from "../../components/StatusView"
import { StyleSheet, View, TouchableOpacity, FlatList, Keyboard, Pressable} from "react-native"
import { GET_MISSION_MEMBER_LIST } from "../../DAL"
import EmptyView from "../../components/EmptyView"
import { useState, useEffect, useRef } from "react"
import routes from "../../navigation/routes"
import { colors } from "../../utilities/colors"
import { dateTimeFormat, S3_URL } from "../../utilities/constants"
import { selectUser } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import { icons } from "../../utilities/icons"
import breakReference from '../../functions/breakReference'
import numFormatter from "../../functions/numFormatter"
import moment from "moment"

const MemberList = ({ route, navigation }) => {
	const { item } = route?.params
	const [filters, setFilters] = useState(route.params.filter)
	const { token, access } = useSelector(selectUser);
	const pagination = useRef({ page: 0, canLoadMore: false })
	const [total, setTotal] = useState(0)
	const [searchText, setSearchText] = useState("")
	const [result, setResult] = useState([])
	const [loaders, updateLoaders] = useState({
		overall: true,
		pagination: false,
		refreshing: false,
		searching: false,
	})


	const setLoader = (type) => {
		let loadersObj = breakReference(loaders);
		for (const key in loadersObj) {
			if (key == type) {
				loadersObj[key] = true
			} else {
				loadersObj[key] = false
			}
		}
		updateLoaders(loadersObj)
	}
	

	const getMemberList = async () => {
		const res = await GET_MISSION_MEMBER_LIST({
			token,
			navigation,
			mission_id: item?._id,
			page: pagination?.current?.page,
			body: filters,

		})
		if (res.code == 200) {
			setResult((pagination.current.page == 0) ? res.users_list : [...result, ...res.users_list])
			setTotal(res?.total_count)
			setLoader("")
			let length = pagination?.current?.page == 0 ?
				res?.users_list.length : (result.length + res?.users_list.length);
			if (length < res?.total_count) {
				pagination.current.page++;
				pagination.current.canLoadMore = true;
			} else {
				pagination.current.canLoadMore = false;
			}

		} else {
			setResult([])
			setLoader("")
		}
	}



	useEffect(() => {
		pagination.current.canLoadMore = false
		pagination.current.page = 0
		setResult([])
		setLoader("overall")
		getMemberList()
	}, [filters])


	useEffect(() => {
		setFilters(route.params.filter)
	}, [route])


	const onRefresh = () => {
		pagination.current.page = 0
		pagination.current.canLoadMore = false
		setLoader("refreshing")
		getMemberList()
	}


	const onEndReach = () => {
		if (pagination.current.canLoadMore) {
			pagination.current.canLoadMore = false;
			setLoader("pagination")
			getMemberList()
		}
	}



	const onSearch = () => {
		Keyboard.dismiss()
		pagination.current.page = 0
		pagination.current.canLoadMore = false
		setLoader("search")
		setFilters({ ...filters, search_text: searchText })
	}
	

	const topView = () => {
		return (
			<View style={__styles.topView}>
				<TitleView
					hideBackBottomButton
					title={item?.title + "'s Members"}
					subTitle={`Showing ${result?.length} of ${total}`}
				/>
				<View style={__styles.topBtnsView}>
					<TouchableOpacity onPress={() => navigation.navigate(routes.missionFilter, { filters, item: item })}>
						{icons.filterCircle(colors.primary, 25)}
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	const headerView = () => {
		return (
			<View style={__styles.topViewBg} >
				<View style={__styles.filterChipsView} >
						{
						  (  (filters?.mission_status && filters.mission_status) ||
								(!!filters?.badge_levels && filters?.badge_levels.length!=0) ||
								(filters?.from_start_date && filters.to_start_date) ||
								(filters?.from_end_date && filters.to_end_date) ||
								(filters?.coins_from && filters.coins_to) ) &&
								<MyText>Filter by: </MyText>
						}
					{filters?.mission_status && filters.mission_status &&
						<MyChip title={`${filters?.mission_status == "in_progress" && "In Pogress" || filters?.mission_status == "completed" && "Completed"}`}
							onPress={() => setFilters({ ...filters, mission_status: null, status: null })} />
					}
					{!!filters?.badge_levels && filters?.badge_levels.length!=0  &&
						<>
									{!!filters.badge_type &&
										<MyChip title={filters?.badge_type == "accept_time" && "Accept Time" || filters?.badge_type == "current" && "Current"}
												onPress={() => setFilters({ ...filters, badge_levels:null, badge_type: null, badges:null, filter_member_title:null })} />
									}
							{filters?.badges?.map((el, index) =>
									<MyChip
												title={el.title}
												key={index}
										onPress={() => {
											setFilters({
												...filters, badge_levels:
													[...filters.badge_levels.filter(val => val!=el._id )],
												badges:
													[...filters.badges.filter(val => val._id != el._id)]
												})
										}} />
							)}
						</>
					}
					{filters?.from_start_date && filters.to_start_date &&
						<MyChip title={`Start from ${filters?.from_start_date} to ${filters?.to_start_date}`}
							onPress={() => setFilters({ ...filters, from_start_date: null, to_start_date: null })} />
					}

					{filters?.from_end_date && filters.to_end_date &&
						<MyChip title={`End Date from ${filters?.from_end_date} to ${filters?.to_end_date}`}
							onPress={() => setFilters({ ...filters, from_end_date: null, to_end_date: null })} />
					}

					{filters?.coins_from && filters.coins_to &&
						<MyChip title={`Coins Attract from ${filters?.coins_from} to ${filters?.coins_to}`}
							onPress={() => setFilters({ ...filters, coins_from: null, coins_to: null })} />
					}
				{
						  (  (filters?.mission_status && filters.mission_status) ||
								(!!filters?.badge_levels && filters?.badge_levels.length!=0) ||
								(filters?.from_start_date && filters.to_start_date) ||
								(filters?.from_end_date && filters.to_end_date) ||
								(filters?.coins_from && filters.coins_to) ) &&
								<TouchableOpacity
												onPress={() => setFilters({})}
										style={{ marginLeft: 5, marginTop: 5, marginRight: 10, borderWidth: 1, borderColor: colors.primary, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.primary + "33" }}>
								<MyText color={colors.primary}>{"Clear Filter"}</MyText>
            </TouchableOpacity>
						}
				</View>
				{/* search engine */}
				<View>
				<SearchView
					search={searchText}
					onChangeText={(text) => setSearchText(text)}
					onSearchPress={onSearch}
					loader={loaders.searching}
				/>
				</View>
			</View>)
	}


  const memberListView = ({ item, index }) => {

		  const onMissionList = () => {
				navigation.navigate(routes.missionReportScreen, {
				missionId: item?.mission_info?._id,
				memberId: item?.user_info?._id,
				type: route.params.item?.type,
				} )
		}

	return (
		<Pressable
			onPress={onMissionList}
			style={__styles.itemView}>
			<View style={{ flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
				<MemberView
					borderColor={item?.current_badge_level?.color_code}
					member={item?.user_info}
					customImage={item?.user_info?.profile_image}
				/>
				<View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
						{icons.forwardArrow()}
				</View>
			</View>

			<View style={{ padding: 5 }}>
				<StatView title={"Start Date"} value={moment(item?.mission_start_date).format(dateTimeFormat.dateTime.split(' ')[0])} />
			{route?.params?.item?.type=="quest" && <StatView title={"End Date"} value={moment(item?.mission_end_date).format(dateTimeFormat.dateTime.split(' ')[0] )} />}
			{route?.params?.item?.type=="mission" && <StatView title={"Completed Days"} value={item?.completed_mission_days} />}
        <StatView title={"Accept Time Badge"} view={()=> <ImgAndTxt img={item?.accept_time_badge_details?.icon?.thumbnail_1} txt={item?.accept_time_badge_details?.title} />} />
        <StatView title={"Current Badge"} view={()=> <ImgAndTxt img={item?.current_badge_level?.icon?.thumbnail_1} txt={item?.current_badge_level?.title} /> } />
				<StatView title={"Coins Attracted"} value={numFormatter(item?.attracted_coins, 1)} />
				<StatView title={"Target Coins"} value={numFormatter(item?.target_coins, 1)} />
				<StatView title={"Status"} view={()=><StatusView
						bgColor={item?.mission_status == "completed" ? colors.green + "33" : colors.delete + "33"}
						txtColor={item?.mission_status == "completed" ? colors.green : colors.delete}
						value={item?.mission_status.replace(/_/gm, " ")} />}
				/>
			</View>
		</Pressable>
	)
}

	return (
		<RootView
			titleView={topView}>
			<FlatList
				ListHeaderComponent={headerView()}
				refreshControl={<MyRefreshControl
					refreshing={loaders?.refreshing}
					onRefresh={onRefresh}
				/>}
				ListEmptyComponent={!loaders.overall && <EmptyView />}
				onEndReached={onEndReach}
				stickyHeaderIndices={[0]}
				stickyHeaderHiddenOnScroll={true}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={<FooterLoader isVisible={loaders?.pagination} />}
				data={result}
				keyExtractor={(item) => item?._id.toString()}
				renderItem={memberListView}
			/>
			<MyLoader enable={loaders.overall} />
		</RootView>
	)
}



const __styles = StyleSheet.create({
	filterChipsView: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems:"center",
	},
	topViewBg: {
		backgroundColor: colors.darkSecondary,
	},
	topView: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.darkSecondary,
		paddingBottom: 5,
		paddingRight: 5
	},
	itemView: {
		backgroundColor: colors.secondary,
		borderRadius: 10,
		padding: 5,
		marginTop: 10

	},
	icon: {
		width: 18,
		height: 18,
		marginRight:5
	}
})

export default MemberList
