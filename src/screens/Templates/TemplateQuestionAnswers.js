import RootView from "../../components/RootView"
import MyLoader from "../../components/MyLoader"
import MemberView from "../../components/MemberView"
import StatView from "../../components/StatView"
import { MenuButton } from '../../components/MyButton';
import MyText from '../../components/MyText';
import SearchView from "../../components/SearchView"
import MyRefreshControl from '../../components/MyRefreshControl'
import FooterLoader from "../../components/FooterLoader";
import EmptyView from "../../components/EmptyView"
import { colors } from "../../utilities/colors"
import routes from "../../navigation/routes"
import { GET_USER_LISTING_WHO_ASNWERED_BY_MODULE } from "../../DAL"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { useEffect, useState, useRef } from "react"
import { dateTimeFormat } from "../../utilities/constants"
import moment from "moment"
import { FlatList, StyleSheet, View, TouchableOpacity, Keyboard } from "react-native"

const TemplateQuestionAnswer = ({navigation, route}) => {
		const {item} = route.params
		const { token } = useSelector(selectUser);
		const [loader, setLoader] = useState(false);
		const [searching,setSearching] = useState(false)
		const paging = useRef({ page: 0, canLoadMore: false })?.current;
		const [list, setList] = useState([]);
		const [refreshing, setRefresh] = useState(false)
		const [searchText, setSearchText] = useState("");
		const [showFooterLoader,setShowFooterLoader] = useState(false);
		const [total, setTotal] = useState(0)
	 	
		const getList = async () => {
				const result = await GET_USER_LISTING_WHO_ASNWERED_BY_MODULE({
						token, navigation, created_for:"page",
						created_for_id:item?._id, search_text:searchText, page:paging.page,
				})
				if(result.code == 200){
						setList(paging?.page == 0 
								? result.members : [...list, ...result.members])
						setTotal(result?.toal_count)

						let length = paging?.page == 0 ? result?.members.length : (list.length + result?.members.length);
						if (length < result?.total_count) {
								paging.page++;
								paging.canLoadMore = true;
						} else {
								paging.canLoadMore = false;
						}
						setLoader(false)
						setSearching(false)
						setRefresh(false)
				} else {
						setLoader(false)
						setSearching(false)
						setRefresh(false)
				}
		}

		const onRefresh = () => {
				paging.canLoadMore = false;
				paging.page = 0;
				setRefresh(true)
				getList()
		}

		const onSearch = () => {
				Keyboard.dismiss()
				paging.page = 0;
				paging.canLoadMore = false;
				setSearching(true)
				getList()
		}

		useEffect(()=> {
				getList()
		}, [paging.page])

		const renderList = (item,index) => {
				const handlePress = () => navigation.navigate(routes.templateAnswersDetails, {item} );
				return (
						<TouchableOpacity 
								onPress={handlePress}
								style={__styles.member_container}>
								<View style={__styles.member_sub_container}>
										<MyText style={{marginRight:5}}>{index+1})</MyText>
										<MemberView member={item} />
								</View>
								<MyText isLabel fontSize={12}>{moment(item?.createdAt).format(dateTimeFormat.date)}</MyText>
						</TouchableOpacity>
				)
		}

		const headerView = () => {
				return (
				<View style={{ backgroundColor: colors.darkSecondary }}>
						<SearchView
								search={searchText}
								onChangeText={(text) => setSearchText(text)}
								onSearchPress={onSearch}
								loader={searching}
						/>
			</View>
				)
		}

		const handleEndReach = () => {
		if (paging?.canLoadMore) {
			setShowFooterLoader(true)
			getList()
		}
	}

		return (
				<RootView 
						title="Questions Answers List"
						subTitle={`Showing ${list?.length} of ${total}`}>

						<FlatList 
								data={list}
								ListHeaderComponent={headerView()}
								contentContainerStyle={{ paddingBottom: 30 }}
								ItemSeparateComponent={<View style={{height:5}}/>}
								refreshControl={<MyRefreshControl
										refreshing={refreshing}
										onRefresh={onRefresh}
										/>}
								showsVerticalScrollIndicator={false}
								stickyHeaderHiddenOnScroll={true}
								stickyHeaderIndices={[0]}
								keyExtractor={(_,index)=>index.toString()}
								onEndReached={handleEndReach}
								ListEmptyComponent={!loader && <EmptyView />}
								ListFooterComponent={!loader && <FooterLoader isVisible={showFooterLoader} />}
								renderItem={({item,index})=> renderList(item,index)}
						/>
						<MyLoader enable={loader}/>
				</RootView>
		)
}

const __styles = StyleSheet.create({
		member_container:{
				marginTop: 10,
				backgroundColor: colors.secondary,
				padding: 10,
				borderRadius: 10,
				flexDirection:"row",
				alignItems:"center",
				justifyContent:'space-between'
		},
		member_sub_container:{
				flexDirection:"row",
				alignItems:"center",
				justifyContent:'space-between'
		}
})

export default TemplateQuestionAnswer
