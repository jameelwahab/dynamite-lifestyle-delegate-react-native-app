import RootView from "../../components/RootView"
import MyLoader from "../../components/MyLoader"
import StatView from "../../components/StatView"
import MyText from "../../components/MyText"
import StatusView from "../../components/StatusView"
import EmptyView from '../../components/EmptyView'
import UserImage from "../../components/UserImage"
import SearchView from "../../components/SearchView"
import OptionModal2 from '../../components/OptionModal2'
import MyRefreshControl from "../../components/MyRefreshControl"
import routes from "../../navigation/routes"
import prependCurency from "../../functions/prependCurency"
import { MenuButton } from "../../components/MyButton"
import { colors } from "../../utilities/colors" 
import { icons } from "../../utilities/icons"
import {  websiteBaseUrl } from "../../utilities/constants" 
import { useState, useEffect, useRef } from "react" 
import { FlatList, View, StyleSheet, Keyboard } from "react-native"
import { GET_PAYMENT_LIST } from "../../DAL"
import  copyText  from "../../functions/copyText"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'

const TemplatePaymentPlan = ({ navigation, route}) => {
		const { item } = route.params
		const { token, user } = useSelector(selectUser);
		const [list, setList] = useState()
		const [loader, setLoader] = useState(false);
		const [searching, setSearching] = useState(false);
		const [refreshing, setRefresh] = useState(false);
		const [searchText, setSearchText] = useState("")
		const ref = useRef(null)

		const getList = async ()=> {
				const result = await GET_PAYMENT_LIST({token, navigation, id:item?._id})
				if(result.code == 200){
						setList(result.payment_plan)
						setLoader(false)
						setSearching(false)
						setRefresh(false)
				}else{
						setLoader(false)
						setSearching(false)
						setRefresh(false)
				}
		}

		const onSearch = ()=> {
				Keyboard.dismiss()
		}

		const onRefresh = () => {
				setRefresh(true)
				getList()
		}
		

		const handleModulePress = (opt, index) => {
				if(opt?.key=="manage"){
						navigation.navigate(routes.templatePaymentManagePlan, 
								{item:list[index]})
				}
				else if(opt?.key=="copy"){
						const url = websiteBaseUrl + item?.sale_page_title_slug + "/payment/" +
								list[index]?.plan_slug + "/" + user?.affiliate_url_name 
						copyText(url)
				}
		}
 
		useEffect(()=>{
				setLoader(true)
				getList()
		},[])

		const headerComponent = () => {
				return (
						<View style={{ backgroundColor: colors.darkSecondary }}>
								<SearchView
										search={searchText}
										onChangeText={(text) => setSearchText(text)}
										onSearchPress={onSearch}
										loader={searching}
								/>
						</View>
				) }

		const renderList = (item, index) => {
				const statusView = () => {
						const value = item?.plan_status
						return (
								<View style={[{ backgroundColor: value ? colors.green + "33" : colors.delete + "33" }, __styles.badge_container ]}>
										<MyText type='medium' color={value ? colors.green : colors.delete} >{value ? "Active" : "Inactive"}</MyText>
								</View> )
				}

				const plan = item.is_plan_free == true
						? "Free"
						: `Paid ( ${
								item.payment_access === "recursion"
										? "Recurring"
										: item.payment_access
						} ${
								item.payment_access == "onetime"
										? ""
										: item.product?.name
										? `| ${item.product.name} `
										: ""
						})`

				return (
						<View style={__styles.itemView}>
								<View style={__styles.menu_btn}>
										<UserImage
												image={item?.plan_image || undefined}  
												name={item?.plan_title} 
												size={30} 
										/>
										<MenuButton
												marginHorizontal={0}
												onPress={()=> ref?.current?.openModal(index)}
												size={20}
										/>
								</View>
								<StatView 
										title={"Title"}
										original
										value={item?.plan_title}
										/>
								<StatView 
										title={"Plan"}
										value={plan}
										/>
								<StatView 
										title={"Plan Price"}
										value={prependCurency(item?.plan_currency || "gbp") + (item?.plan_price || "0")}
										/>
								<StatView 
										title={"Time Period Interval"}
										value={item?.time_period_interval + ` ${item.payment_access == "recursion" && item.plan_type
														? item.plan_type : ""}`
												}
										/>
								<StatView 
										title={"Status"}
										view={statusView}
										/>
						</View>
				)
		}

		return (
				<RootView title="Payment Plans">
						<FlatList 
								data={list}
								KeyExtractor={(_,index)=> index.toString()}
								renderItem={({item,index})=> renderList(item,index)}
								ListHeaderComponent={headerComponent}
								ListEmptyComponent={!loader && <EmptyView />}
								stickyHeaderHiddenOnScroll={true}
								showsVerticalScrollIndicator={false}
								keyboardShouldPersistTaps="handled"
								ItemSeparatorComponent={<View style={{height:15}}/>}
								stickyHeaderIndices={[0]}
								refreshControl={<MyRefreshControl
										refreshing={refreshing}
										onRefresh={onRefresh}
								/>}
								/>
						<MyLoader enable={loader} />
						<OptionModal2 
								ref={ref}
								optionList={listOptions}
								onSelected={handleModulePress}
								/>
				</RootView>
		)
}

const listOptions = [
		{
				title: "Manage Event Access",
				key: "manage",
				icon: icons.members2,
		},
		{
				title: "Copy Url",
				key: "copy",
				icon: () => icons.copy(colors.primary, 17),
		},
]

const __styles = StyleSheet.create({
		itemView:{
				backgroundColor: colors.secondary,
				borderRadius: 10,
				padding: 10,
				marginTop: 10
		},
		badge_container:{
				paddingHorizontal: 10,
				paddingVertical: 2,
				alignSelf: "flex-start",
				borderRadius: 10
		},
		menu_btn:{
				flexDirection: "row",
				alignItems:"center",
				justifyContent:"space-between"
		}
})

export default TemplatePaymentPlan
