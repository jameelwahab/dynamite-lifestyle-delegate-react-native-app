import RootView from "../../../components/RootView"
import MyTouchableInput from "../../../components/MyTouchableInput"
import OptionModal2  from "../../../components/OptionModal2"
import OptionModalWithSearch  from "../../../components/OptionModalWithSearch"
import MyLoader from "../../../components/MyLoader"
import MyChip from "../../../components/MyChip"
import showToast from "../../../functions/showToast"
import routes from '../../../navigation/routes'
import Collapsible from 'react-native-collapsible'
import { GET_PROGRAMMES_EVENTS_SALEPAGES_LIST_FOR_CALENDAR_GROUP } from "../../../DAL"
import {MyButton, MyClearButton} from "../../../components/MyButton"
import { icons } from "../../../utilities/icons"
import { View, StyleSheet } from "react-native"
import { useRef, useState, useEffect } from "react"
import isArray from "../../../functions/isArray"
const GroupFilter = ({navigation, route })=>{
		const ref_group_by = useRef(null)
		const ref_badge_level = useRef(null);
		const {token, filter } = route.params
		const [visiSearch, setVisiSearch] = useState(false)
		const [groupBy, setGroupBy] = useState(false)
		const [list, setList] = useState({ data:[], badges: [{title:"No Options", key:"no"}] });
		const [loading, setLoading] =useState(false);
		const [selectedGroup, setSelectedGroup]=useState()
		const [badges, setBadges] = useState([])
		const [groupList, setGroupList] = useState([])


		const fetchList = async ()=>{
				setLoading(true)
				const res = await GET_PROGRAMMES_EVENTS_SALEPAGES_LIST_FOR_CALENDAR_GROUP({
						token, navigation, type:groupBy?.key
				})
				if(res.code==200){
						setLoading(false)
								setList({data:res.data, badges:res.badge_levels })
				}
				else{
						setLoading(false)
				}
		}

		useEffect(()=>{
				setGroupList([])
				if(!!groupBy.key){
						fetchList()
				}
		},[groupBy])

		useEffect(()=>{
				setTimeout(()=>{
						if(isArray(filter?.badges)) setBadges(filter?.badges)
						if(!!filter?.group && filter?.group.key!="") setGroupBy(filter?.group)
						if(!!filter?.list && filter?.list.length!=0) setGroupList(filter.list)
				},400)	
		},[route])

		const handleBadgePress = (item)=> {
				if(item.key=="no") return;
				if(badges.length==0) setBadges([item])
				else setBadges([...badges, item])
		}
		const filterBadgeList=(list)=>{
				
				if(!!list && badges.length == list.length) return [{title:"No options", key:"no"}]
				if(badges.length ==0) return list
				else{
						return list.filter(el=> badges.findIndex(x=> x._id == el._id) < 0 && el  )
				}
					
		}

		const handleSalesListSelect = (item)=>{
				if(salesList.length == 0 )return[item]
				else setSalesList([...badges, item])
		}
   const filterGroupList = ()=>{
			 if(groupList.length == 0 ) return list.data;
			 else{
					 return list.data.filter(el=> groupList.findIndex(x => x._id == el._id) < 0 && el )
			 }
	 }

		return (
				<RootView title="Filter">
						<MyTouchableInput
								label='Group by'
								value={groupBy?.title || ""}
								icon={() => icons.down()}
								onPress={()=> ref_group_by?.current?.openModal()}
						/>

						<Collapsible collapsed={list.data.length==0} >
								<MyTouchableInput
										label={groupBy.title || ""}
										value={""}
										iconOnPress={() => setVisiSearch(true) }
										view={()=> 
												<View style={{ flexDirection: "row", flex: 1, alignItems: "center", flexWrap: "wrap", paddingVertical: 2 }}>
										{groupList.map((el,index)=> 
												<View style={{ flexWrap: "wrap", position: "relative", zIndex: 10 }} key={index}>
														<MyChip title={groupBy.key=='sale_page'  ? el.sale_page_title : el.title}
																index={index}
																onPress={() => {
																		setGroupList(groupList.filter(ele=> ele._id != el._id))
														}} />
												</View>
										) }
										</View>

										}
										/>
						</Collapsible>

						<MyTouchableInput
								label='Badge Level'
								value={""}
								iconOnPress={() => ref_badge_level.current.openModal()}
								view={()=> 
										<View style={{ flexDirection: "row", flex: 1, alignItems: "center", flexWrap: "wrap", paddingVertical: 2 }}>
										{badges.map((el,index)=> 
												<View style={{ flexWrap: "wrap", position: "relative", zIndex: 10 }} key={index}>
														<MyChip title={el.title}
														onPress={() => {
																setBadges(badges.filter(ele => ele._id != el._id))
														}} />
												</View>
										) }
										</View>
								}

						/>

				<View style={__styles.btn_container}>
					<MyClearButton
						style={{ flex: 1, marginRight: 10 }}
						title='Clear Filter'
						onPress={() => {
								navigation.navigate(routes.calendarGroupList, {filter:{}} )
						}}
					/>
					<MyButton
						style={{ flex: 1 }}
						title='Submit'
						onPress={() => {
								if(groupBy?.key){
										navigation.navigate(routes.calendarGroupList, {
												filter:{
														group: groupBy,
														badges,
														list: groupList
												}									
										})
								}
								else{
										showToast({title:"info", body:"Please Select The Group Type"})
								}

						} }
					/>
				</View>
		
				
				<OptionModal2
						ref={ref_group_by}
						optionList={grpByTypeList}
						onSelected={(item)=> item.key!="no" && setGroupBy(item)}
				/>	

				<OptionModal2
						ref={ref_badge_level}
						optionList={filterBadgeList(list.badges)}
						onSelected={(item)=>handleBadgePress(item)}
				/>	

				<OptionModalWithSearch 
						isVisible={visiSearch}
						closeModal={()=> setVisiSearch(false)}
						titleKey={groupBy.key == "sale_page" ? "sale_page_title" : "title"}
						optionList={filterGroupList()}
						onSelected={(item)=> {
								setVisiSearch(false)
								if(groupList.length == 0 ) setGroupList([item])
								else setGroupList([...groupList, item])
						}}
				/>
				<MyLoader enable={loading} />
				</RootView>
		)
}

const __styles = StyleSheet.create({
		btn_container:{
				flexDirection: "row",
				marginTop: 10 
		}
})

const grpByTypeList = [
   {
    title: "Programmme",
    key: "program"
  },
   {
    title: "Event",
    key: "event"
  },
   {
    title: "Sale Page",
    key: "sale_page"
  },
		{
    title: "Missions \\ Quests",
    key: "mission"
  },
]

export default GroupFilter;
