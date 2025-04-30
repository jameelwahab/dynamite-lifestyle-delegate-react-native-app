import RootView from "../../components/RootView"
import { Flex, Row } from "../../UIComponents/FlexViews"
import MyText from "../../components/MyText"
import MyLoader from "../../components/MyLoader"
import MyCheckBox from "../../components/MyCheckBox"
import MyTouchableInput from "../../components/MyTouchableInput"
import OptionModalWithSearch from "../../components/OptionModalWithSearch"
import { MyButton, TransparentButton } from '../../components/MyButton.js'
import MyChip from "../../components/MyChip"
import { colors } from '../../utilities/colors'
import { icons } from '../../utilities/icons'
import showToast from "../../functions/showToast"
import isArray from "../../functions/isArray"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { GET_GROUP_LIST } from "../../DAL"
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native"
import { useRef, useState, useEffect } from "react"
import MyKeyboardAvoidingView from "../../components/MyKeyboardAvoidingView"

const ScheduleNotifications = ({ navigation }) => {
		const { token } = useSelector(selectUser);
		const [modalSelect, setModalSelect] = useState({isVisible:false, index:undefined})
		const ref_email_modal = useRef();
		const ref_message_modal = useRef();
		const ref_notification_modal = useRef();
		const [list, setList] = useState([{groups:[], notifications:[] }])
		const [groupList,setGroupList] = useState([])
		const [loader, setLoader] = useState(false);

		const updateTheList = () => {
		}

		const getList = async () => {
				const result = await GET_GROUP_LIST({token, navigation})
				if(result.code == 200){
						setGroupList(result?.groups)
						setLoader(false)
				}
				else{
						setLoader(false)
				}
		}
		
		const handleNotifyEdit = (el,index) => {
		}

		const addAndRemo = (txt, index) => {
				if (txt == "add") {
						setList([...list, { groups: [], notifications: [] }])
						// setCc([...cc, ""])
				} else if (txt == "rm") {
						setList(list.filter((_, ind) => ind != index ))

						// setCc(cc.filter((_, ind) => ind != index))
				}
		}

		const notifcationTypeHandler = (el,index) => {
				if(!isNotifyPresent(el,index)){
						setList(list.map((e, i) => i == index ?
								{ ...list[i], notifications: [...list[i].notifications, { ...el }] } : e ))
				}
				else{
						setList(list.map((e, i) => i == index ?
								{ ...list[i], notifications: list[i].notifications.filter(e => e.name != el.name) } : e))
				}

		}
		const isNotifyPresent = (el,indexNotify) => {
				return list[indexNotify]?.notifications?.findIndex(x => x.name == el.name) > -1;
		}

		const handleSelect = (data)=>{
				setList(list.map((el,index)=> index===modalSelect.index ? {notifications:[...list[index].notifications], groups:[...list[index].groups, data ] } : el ))
				setModalSelect({index:undefined, isVisible:false})
		}

		const filterTheList = (data, text) => {
				if (text.trim() == "") {
						return data 
				} else {
						return data.slice().filter(x => 
								x.title.toLowerCase().includes(text.toLowerCase().trim()))
				}
		}

		const filteredGroupList = (index)=>{
				return groupList.filter(el=> !(list[index]?.groups?.findIndex(x=> x?._id == el?._id ) > -1)) 
		} 

		useEffect(()=>{
				getList()
		},[])

		const groupChips = (index) => {
				
				return(
						<View style={__styles.viewContainer}>
								{list[index]?.groups?.map((el,i)=> 
										<View 
												key={i}
												style={__styles.viewCards}>
												<MyChip title={el.title}
														onPress={() => {
						setList(list.map((el,ind)=> ind == index 
								? {notifications:[...list[ind].notifications],
										groups: list[ind].groups.filter((x,number)=> number != i ) } 
								: el ))
																// console.log()
														}} />
										</View>
								)}
						</View>
				)
		}

		const __notifyListRender = ({item,index}) =>{
				return (
						<View style={__styles.notificationView}>
								<Row alignItems="center">
										<Flex flex={1}>
												<MyText
														color={colors.lightText2} 
														type='medium' >
														Notifications
												</MyText>
										</Flex>
										<View style={__styles.btnContainer}>
										{list.length != 1 && 
												<TouchableOpacity
														onPress={() => addAndRemo("rm", index)}
														style={{ padding: 5 }}>
														{icons.minusCircle()}
												</TouchableOpacity>
										}
										<TouchableOpacity
												onPress={() => addAndRemo("add", index)}
												style={{ padding: 5 }}>
												{icons.plusCircle()}
										</TouchableOpacity>
								</View>
						</Row>

						<View>

								<MyTouchableInput
										label='Membership level*'
										view={()=>groupChips(index)}
										icon={() => icons.down()}
										iconOnPress={()=> setModalSelect({isVisible:true, index})}
								/>

								<MyTouchableInput
										label='Action Type*'
										view={()=>groupChips(index)}
										icon={() => icons.down()}
										iconOnPress={()=> setModalSelect({isVisible:true, index})}
								/>

								<MyTouchableInput
										label='Date type'
										view={()=>groupChips(index)}
										icon={() => icons.down()}
										iconOnPress={()=> setModalSelect({isVisible:true, index})}
								/>
						
						</View>

				</View>
				)
		} 

		return (
				<RootView 
						hideChatIcon
						hideProfile
						hideNotificaitonIcon
				title="Schedule Notifications Settings">
			<Flex flex={1}>
				<MyKeyboardAvoidingView noScrollView>
					<Flex flex={1}>
						<FlatList
							data={list}
							showsVerticalScrollIndicator={false}
							ListFooterComponentStyle={{ marginTop: 10 }}
							contentContainerStyle={{ paddingBottom: 50 }}
							KeyExtractor={(_, index) => index.toString()}
							renderItem={__notifyListRender}
						/>
					</Flex>
				{isArray(list) &&
					<MyButton title="Update" onPress={updateTheList} />}
				</MyKeyboardAvoidingView>
				</Flex>
				<MyLoader enable={false} />

				<OptionModalWithSearch
						isVisible={modalSelect.isVisible}
						closeModal={()=> setModalSelect({ isVisible:false, index:undefined })}
						onSelected={handleSelect}
						optionList={filteredGroupList(modalSelect.index)}
						filterTheList={filterTheList}
				/>

				</RootView>
		)
}


const __styles = StyleSheet.create({
		notificationView: {
				marginVertical: 10,
				backgroundColor: colors.secondary,
				borderRadius: 10,
				padding: 10
		},
		btnContainer: {
				flexDirection: "row",
				justifyContent: "flex-end"
		},
	notifyContainer: {
		// paddingVertical: 4,
		flexDirection: 'row',
		alignItems: "center",
		justifyContent: "space-between"
	},
		viewContainer:{
				flexDirection: "row",
				flex: 1, alignItems: "center",
				flexWrap: "wrap",
				paddingVertical: 2,
		},
		viewCards:{
				flexWrap: "wrap",
				position: "relative",
				zIndex: 10 
		}
})

export default ScheduleNotifications
