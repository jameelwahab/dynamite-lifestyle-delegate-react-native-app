import RootView from "../../components/RootView"
import MyLoader from "../../components/MyLoader"
import MyText from "../../components/MyText"
import UserImage from "../../components/UserImage"
import { colors } from "../../utilities/colors"
import MyRefreshControl from "../../components/MyRefreshControl"
import { MyButton } from "../../components/MyButton"
import CalendarModal from "../../components/CalendarModal"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import isArray from "../../functions/isArray"
import { icons } from "../../utilities/icons"
import { dateTimeFormat } from "../../utilities/constants"
import MyInputs from "../../components/MyInputs"
import MyTouchableInput from "../../components/MyTouchableInput"
import StatView from "../../components/StatView"
import MyCheckBox from "../../components/MyCheckBox"
import SearchView from "../../components/SearchView"
import OptionModal2 from "../../components/OptionModal2"
import { GET_TEMPLATE_PAYMENT_MANAGE_LIST } from "../../DAL"
import {useState, useEffect, useRef } from "react"
import { Flex, Row } from '../../UIComponents/FlexViews'
import { FlatList, View, Pressable, StyleSheet, Keyboard } from "react-native"
import MyKeyboardAvoidingView from '../../components/MyKeyboardAvoidingView'
import moment from "moment"

const  TemplateManageAccess = ({navigation, route}) => {
		const { item }  = route.params
		const { token } = useSelector(selectUser);
		const [list, setList] = useState([])
		const [loader, setLoader] = useState(false)
		const [refreshing, setRefresh] = useState(false)
		const ref_type = useRef(null)
		const ref_time = useRef(null)
		const ref_calendar = useRef(null)
		const inputRef = useRef(null)
		const [searchText, setSearchText] = useState("")
		const [isFree, setIsFree] = useState(false);

		const getList = async () => {
				const result = await GET_TEMPLATE_PAYMENT_MANAGE_LIST({
						token, navigation, id:item?._id})
				if(result.code == 200){
						setLoader(false);
						setRefresh(false);
						if(isArray(result?.payment_plan?.event))
						{
								setList(result?.events?.map(el=> {
										const ind = result?.payment_plan?.event.findIndex(x=> x?.event_id === el?._id)
										let obj= {}
										if(ind > -1) {
												obj = {...el, ...result?.payment_plan?.event[ind], enabled:true }
										}
										else {
												obj = {...el, enabled:false }
										}
										return obj
								} ))
						}
						else setList(result?.events);
						setIsFree(result?.payment_plan?.is_plan_free)

				}
				else {
						setLoader(false);
						setRefresh(false);
				}
		}

		const onRefresh = () => {
				setRefresh(true)
				getList()
		}

		const onSearch = ()=> {
				Keyboard.dismiss()
		}


		const handleModulePress = (opt,id) => {
				if(opt.key=="paid"){
						setList(list.map(el=> el?._id == id ?  {...el, access_type:"paid" } : el  ))
				}
				else if(opt.key=="free"){
						setList(list.map(el=> el?._id == id ? {...el, access_type:"free" } : el ))
				}
				else if(opt.key=="days") {
						setList(list.map(el=> el?._id == id ? {...el, type:"days" } : el ))
				}
				else if(opt.key=="date") {
						setList(list.map(el=> el?._id == id ? {...el, type:"date" } : el ))
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
								/>
						</View>
				) }

		const renderList = (data, index) => {
				const handleCheckBoxPress = () => {
						setList(list.map(el=> el?._id == data?._id ?  {...el, enabled:!el.enabled } : el  ))
				}

				const statusView = () => {
						const value = data?.status
						return (
								<View style={[{ backgroundColor: value ? colors.green + "33" : colors.delete + "33" }, __styles.badge_container ]}>
										<MyText type='medium' color={value ? colors.green : colors.delete} >{value ? "Active" : "Inactive"}</MyText>
								</View> )
				}

				const dropDownOpen = (ref,value, id) => {
						return (
								<Pressable 
										onPress={()=> ref?.current?.openModal(id)}
										style={__styles.drop_down}>
										<MyText type="semi" capitalize>{value}</MyText>
										{icons.down()}
								</Pressable>
						)
				}

				const CalenderView = (date) => {
						return (
						<MyTouchableInput
								value={moment(date).format(dateTimeFormat.date2)}
								icon={() => icons.calendar(colors.primary)}
								onPress={() => ref_calendar?.current?.openModal()}
							/>
						)
				}

				const noOfDays = (title)=>{
						const myRef = useRef(null)
						const handleSmallPress = () => {
								console.log("watashi was")
								myRef?.current?.focus()
						}
						return (
								<MyInputs 
										myref={myRef}
										rightIconOnPress={handleSmallPress}
										disableRightIconHighlight
										value={data?.no_of_days.toString() || ""}
										rightIcon={icons.editpencil}
										onChangeText={(text) => {
												setList(list.map(el=> el?._id == data?._id ?  {...el, no_of_days:text } : el  ))
										}}
										/>
						)
				}

				return (
						<View style={__styles.itemView}>
								<Row alignItems={"center"} justifyContent={"space-between"}>
										<UserImage 
										image={data?.images?.thumbnail_1}
										name={data?.title}
										/>
										<MyCheckBox 
												value={data?.enabled}
												onPress={handleCheckBoxPress}
												/>
								</Row>
								<StatView 
										title={"Title"}
										original
										value={data?.title}
										/>
								<StatView 
										title={"Status"}
										view={statusView}
										/>
								<StatView 
										title={"Accept Type"}
										view={()=>dropDownOpen(ref_type, data?.access_type || isFree ? "Free" : "Paid", data?._id)}
										/>
								<StatView 
										title={"Start Date"}
										view={()=>CalenderView(data?.start_date)}
										/>
								<StatView 
										title={"End Access Interval Type"}
										view={()=>dropDownOpen(ref_time, data?.type || "Days", data?._id)}
										/>
						{data?.type == "date" ? <StatView 
										title={"No of Days"}
										view={CalenderView}
										/> :
								<StatView 
										title={"No of Days"}
										view={noOfDays}
										/>}
						</View>
				)
		}

		return (
				<RootView title={item?.plan_title}>
				<MyKeyboardAvoidingView noScrollView>
					<Flex flex={1}>
						<FlatList 
								data={list}
								KeyExtractor={(_,index)=>index.toString()}
								renderItem={({item,index})=>renderList(item,index)}
								ListHeaderComponent={headerComponent}
								refreshControl={<MyRefreshControl
										refreshing={refreshing}
										onRefresh={onRefresh}
								/>}
								stickyHeaderIndices={[0]}
								stickyHeaderHiddenOnScroll={true}
								showsVerticalScrollIndicator={false}
						/>
					</Flex>
				</MyKeyboardAvoidingView>
							{isArray(list) &&
					<MyButton title="Update" onPress={()=>console.log()} />}
						<MyLoader enable={loader}/>

						<OptionModal2 
								ref={ref_type}
								optionList={listModal[0]}
								onSelected={handleModulePress}
								/>
						<OptionModal2 
								ref={ref_time}
								optionList={listModal[1]}
								onSelected={handleModulePress}
								/>
				<CalendarModal
						ref={ref_calendar}
						onDateSelected={(date, type) => 
								moment(date).format(dateTimeFormat.date2) }
						/>
				</RootView>
		)
}

const listModal=[
		[
				{title:"Paid", key:"paid"},
				{title:"Free", key:"free"},
		],
		[
				{title:"Days", key:"days"},
				{title:"Date", key:"date"}
		]
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
		drop_down:{
				flexDirection:"row",
				alignItems:"center",
				justifyContent:"space-between",
				borderWidth:1,
				borderColor: colors.border,
				borderRadius:10,
				paddingHorizontal:15,
				paddingVertical:10,
		}
})

export default TemplateManageAccess
