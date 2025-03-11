import RootView from "../../components/RootView"
import TitleView from "../../components/TitleView"
import MyText from "../../components/MyText"
import MyChip from "../../components/MyChip"
import FooterLoader from '../../components/FooterLoader'
import MyRefreshControl from "../../components/MyRefreshControl"
import MyLoader from "../../components/MyLoader"
import MemberView from '../../components/MemberView'
import StatView from '../../components/StatView'
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native"
import {GET_MISSION_MEMBER_LIST} from "../../DAL"
import EmptyView from "../../components/EmptyView"
import { useState, useEffect, useRef } from "react"
import routes from "../../navigation/routes"
import {colors} from "../../utilities/colors"
import { selectUser } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import {icons} from "../../utilities/icons"
import breakReference from '../../functions/breakReference'

const MemberList = ({route, navigation}) => {
		const [filters, setFilters] = useState(route.params.filter)
		const { token } = useSelector(selectUser);
		const pagination = useRef({ page: 0, canLoadMore: false })
		const [total, setTotal] = useState(0)

		const [loaders, updateLoaders] = useState({
				overall:true,
				pagination:false,
				refreshing:false
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
		const [result, setResult] = useState([])	

		const getMemberList = async () => {
				const res = await GET_MISSION_MEMBER_LIST({token,
						navigation,
						mission_id:route.params.item?._id,
						body:filters,
						page: pagination?.current?.page,
						limit:50,
				})
				if(res.code==200){
						if(pagination.current.page==0) setResult(res.users_list)
						else setResult([ ...result, ...res.users_list])
						setTotal(res?.total_count)
						if(res.load_more_url){
								pagination.current.page++;
								pagination.current.canLoadMore=true;
						}
						setLoader("")
				} else {
						setResult([])
						setLoader("")
				}
		}

		useEffect(()=>{
				pagination.current.canLoadMore=false
				pagination.current.page=0
				setResult([])
				setLoader("overall")
				getMemberList()
		},[filters])

		useEffect(()=>{
				setFilters(route.params.filter)
		},[route])

		const  onRefresh = ()=>{
				pagination.current.page = 0
				pagination.current.canLoadMore = false
				setLoader("refreshing")
				getMemberList()
		}
		const onEndReach=()=>{
				if (pagination.current.canLoadMore) {
						pagination.current.canLoadMore = false;
						setLoader("pagination")
						getMemberList()
				}
		}

		const topView = () => {
				return (
						<View>
								<View style={__styles.topView}>
										<TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight:15}}>
														{icons.back(colors.primary, 25)}
										</TouchableOpacity>
										<TitleView
										title={route.params.item.type + " Members"}
										hideBackBottomButton
										subTitle={`Showing ${result?.length} of ${total}`}
										/>
										<View style={__styles.topBtnsView}>
												<TouchableOpacity onPress={() => navigation.navigate(routes.missionFilter, { filters, item:route.params.item })}>
														{icons.filterCircle(colors.primary, 25)}
												</TouchableOpacity>
										</View>
								</View>
						</View>
				)
		}
		
		const headerView = () => {
				return (
						<>
				{filters?.mission_status && filters.mission_status &&
						<View style={{flexWrap:"wrap"}}>
            <MyChip title={`${filters?.mission_status == "in_progress" && "In Pogress" || filters?.mission_status == "completed" && "Completed"}`}
              onPress={() => setFilters({ ...filters, mission_status: null, status:null })} />
						</View>
				}

				{filters?.from_start_date && filters.from_end_date &&
						<View style={{flexWrap:"wrap"}}>
            <MyChip title={`Commission Date from ${filters?.from_start_date} to ${filters?.from_end_date}`}
              onPress={() => setFilters({ ...filters, from_start_date: null, from_end_date: null })} />
						</View>
				}

				{filters?.to_start_date && filters.to_end_date &&
						<View style={{flexWrap:"wrap"}}>
            <MyChip title={`Commission Date to ${filters?.to_start_date} to ${filters?.to_end_date}`}
              onPress={() => setFilters({ ...filters, to_start_date: null, to_end_date: null })} />
						</View>
				}

				{filters?.coins_from && filters.coins_to &&
						<View style={{flexWrap:"wrap"}}>
            <MyChip title={`Coins Attract from ${filters?.coins_from} to ${filters?.coins_to}`}
              onPress={() => setFilters({ ...filters, coins_from: null, coins_to: null })} />
						</View>
				}

						</> ) }
		return (
				<RootView hideSubHeader>
						{topView()}
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
								keyExtractor={(_,index) => index.toString()}
								renderItem={memberListView}
						/>
						<MyLoader enable={loaders.overall} />
				</RootView>
		)
}

const memberListView = ({ item, index }) => {
  const statusView = (value) => {
    return (
      <View style={{ backgroundColor: value ? colors.green + "33" : colors.delete + "33", paddingHorizontal: 10, paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        <MyText type='medium' capitalize color={value=="completed" ? colors.green : colors.delete} >
          {value}
        </MyText>
      </View>)
  }
    return (
      <View style={__styles.itemView}>
        <View style={{ flex: 1 }}>
            <MemberView
						  borderColor={item?.user_info?.membership_level_badge_info?.membership_level_badge_color_code}
              member={item?.user_info}
              customImage={item?.user_info?.profile_image}
            />
        </View>
          
        <View style={{ padding: 5 }}>
          <StatView title={"Name"} value={item?.user_info?.first_name + " " + item?.user_info?.last_name} />
          <StatView title={"Start Date"} value={item?.mission_start_date} />
          <StatView title={"End Date"} value={item?.mission_end_date} />
          <StatView title={"Coins Attracted"} value={item?.attracted_coins} />
          <StatView title={"Target Coins"} value={item?.target_coins} />
          <StatView title={"Status"} value={statusView(item?.mission_status)} />
        </View>
      </View>
    )
  }


const __styles = StyleSheet.create({

  topView: {
    flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.darkSecondary,
		paddingBottom: 5
  },
  itemView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 5,
    marginTop: 10

  },
})

export default MemberList
