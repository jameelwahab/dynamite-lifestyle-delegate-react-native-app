import { View } from "react-native"
import MyInputs from '../../components/MyInputs'
import RootView from "../../components/RootView"
import MyKeyboardAvoidingView from '../../components/MyKeyboardAvoidingView'
import MyTouchableInput from '../../components/MyTouchableInput'
import OptionModal2 from '../../components/OptionModal2'
import routes from '../../navigation/routes'
import CalendarModal from "../../components/CalendarModal"
import { MyClearButton, MyButton } from '../../components/MyButton.js'
import Collapsible from 'react-native-collapsible'
import {icons} from '../../utilities/icons'
import {colors} from '../../utilities/colors'
import { dateTimeFormat } from '../../utilities/constants'
import { useRef, useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import moment from "moment"

import MyCheckBox from "../../components/MyCheckBox"

const Filter = ({route, navigation}) => {
		const nav = useNavigation()
		const ref = useRef(null);
		const ref_calendar =useRef(null)

		const [status, setStatus] = useState({title: statusList[0].title, key:statusList[0].key});

		const [showStart, setShowStart] = useState(!!route.params.filters?.from_start_date)
		const [showEnd, setShowEnd] = useState(!!route.params.filters?.to_start_date)
		const [showAttract, setShowAttract] = useState(!!route.params.filters?.coins_from)

		const optionStatus = () => ref.current.openModal()
		const handleSelect= (item) => item.key!='all' && setFilter({...filter, mission_status:item.key, status: item.title})
		const [filter, setFilter] = useState(route.params.filters)
		const toUpper = (txt) => txt[0].toUpperCase() + txt.slice(1,txt.length) 
		useEffect(()=>{
				console.log(route.params.filters)
				setFilter(route.params.filters)
		},[route])
		return (
		<RootView title={"Members Filter"}>
				<MyKeyboardAvoidingView
						style={{ paddingHorizontal: 10 }}
						showsVerticalScrollIndicator={false} >

						<MyTouchableInput
								label='Status'
								value={filter?.status || "All"}
								icon={() => icons.down(colors.primary)}
								onPress={optionStatus}
						/>

						<MyCheckBox 
								title="Search By Start Date"
								value={showStart}
								onPress={()=> {
										setShowStart(!showStart)
										setFilter({ ...filter, from_start_date: null, from_end_date: null })
								} }
						/>
						<Collapsible collapsed={!showStart}>
								<MyTouchableInput
								label='Start Date From'
								value={filter?.from_start_date || ""}
								icon={() => icons.calendar(colors.primary)}
								onPress={() => ref_calendar?.current?.openModal(filter?.from_start_date, "from_start_date")}
						/>
						<MyTouchableInput
								label='End Date From'
								value={filter?.from_end_date || ""}
								icon={() => icons.calendar(colors.primary)}
								onPress={() => ref_calendar?.current?.openModal(filter?.from_end_date, "from_end_date")}
						/>
						</Collapsible>

				{route.params.item.type=="quest" && 
								<>
								<MyCheckBox 
										title="Search By End Date"
										onPress={()=> {
												setShowEnd(!showEnd)
												setFilter({ ...filter, to_start_date: null, to_end_date: null })
										}}
										value={showEnd}
								/>

						<Collapsible collapsed={!showEnd}>
								<MyTouchableInput
										label='Start Date From'
										value={filter?.to_start_date || ""}
										icon={() => icons.calendar(colors.primary)}
										onPress={() => ref_calendar?.current?.openModal(filter?.to_start_date, "to_start_date")}
								/>
								<MyTouchableInput
										label='End Date From'
										value={filter?.to_end_date || ""}
										icon={() => icons.calendar(colors.primary)}
										onPress={() => ref_calendar?.current?.openModal(filter?.to_end_date, "to_end_date")}
								/>
						</Collapsible>
						</> }

						<MyCheckBox 
								title="Search By Attracted Coins"
								value={showAttract}
								onPress={()=> {
										setShowAttract(!showAttract)
										setFilter({...filter, coins_from:null, coins_to:null })
								}}
						/>		
						<Collapsible collapsed={!showAttract}>
								<View style={{ flexDirection: "row", marginTop: 10 }}>
								<View style={{ flex: 1 }}>
								<MyInputs
                label='Coin From*'
                value={filter?.coins_from || 0}
                onChangeText={(text) => setFilter({...filter, coins_from:text })}
                keyboardType='number-pad'
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <MyInputs
                label='Coin To*'
                value={filter?.coins_to || 0}
                onChangeText={(text) => setFilter({...filter, coins_to:text })}
                keyboardType='number-pad'
              />
            </View>
          </View>
        </Collapsible>
						
				<OptionModal2
						ref={ref}
						onSelected={handleSelect}
						optionList={statusList}
				/>

				<View style={{ flexDirection: "row", marginTop: 10 }}>
          <MyClearButton
            style={{ flex: 1, marginRight: 10 }}
            title='Clear Filter'
            onPress={()=>{
								setFilter({})
								setShowStart(false)
								setShowEnd(false)
								setShowAttract(false)
						}}
          />
          <MyButton
            style={{ flex: 1 }}
            title='Submit'
            onPress={()=> nav.navigate(routes.missionMemberList, {filter, item:route.params.item })}
          />

        </View>
						
				<CalendarModal
						ref={ref_calendar}
						onDateSelected={(date,type) => {
								if(type?.includes("date")) setFilter({...filter, [type]:
										moment(date).format(dateTimeFormat.date2) })
								else setFilter({...filter, [type]: date })
						}}
				/>
				</MyKeyboardAvoidingView>
		</RootView>
		)
}

const statusList = [
		{
				title:"All",
				key:"all",
		},
		{
				title:"Completed",
				key:"completed",
		},
		{
				title:"In Progress",
				key:"in_progress",
		}
]

export default Filter
