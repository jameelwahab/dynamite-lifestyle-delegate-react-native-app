import {View, Text } from "react-native"
import MyInputs from '../../components/MyInputs'
import RootView from "../../components/RootView"
import MyKeyboardAvoidingView from '../../components/MyKeyboardAvoidingView'
import MyTouchableInput from '../../components/MyTouchableInput'
import OptionModal2 from '../../components/OptionModal2'
import CalendarModal from "../../components/CalendarModal"
import { MyClearButton, MyButton } from '../../components/MyButton.js'
import Collapsible from 'react-native-collapsible'
import {icons} from '../../utilities/icons'
import {colors} from '../../utilities/colors'
import { useRef, useState, useEffect } from "react"
import MyCheckBox from "../../components/MyCheckBox"

const Filter = ({route, navigation}) => {
		const ref = useRef(null);
		const ref_calendar =useRef(null)
		const [status, setStatus] = useState({title: statusList[0].title, key:statusList[0].key});
		const [showStart, setShowStart] = useState(false)
		const [showEnd, setShowEnd] = useState(false)
		const [showAttract, setShowAttract] = useState(false)
		const optionStatus = () => ref.current.openModal()
		const handleSelect= (item) => setStatus({title:item.title, key:item.key})

		return (
		<RootView title={route?.params?.item?.type + " Members Filter"}>
				<MyKeyboardAvoidingView
						style={{ paddingHorizontal: 10 }}
						showsVerticalScrollIndicator={false} >

						<MyTouchableInput
								label='Status'
								value={status.title}
								icon={() => icons.down(colors.primary)}
								onPress={optionStatus}
						/>

						<MyCheckBox 
								title="Search By Start Date"
								value={showStart}
								onPress={()=> setShowStart(!showStart)}
						/>
						<Collapsible collapsed={!showStart}>
								<MyTouchableInput
								label='Start Date From'
								value={""}
								icon={() => icons.calendar(colors.primary)}
								onPress={() => ref_calendar?.current?.openModal({}, "end_date")}
						/>
						<MyTouchableInput
								label='End Date From'
								value={""}
								icon={() => icons.calendar(colors.primary)}
								onPress={() => ref_calendar?.current?.openModal({}, "end_date")}
						/>
						</Collapsible>

				{route.params.item.type=="quest" && 
								<>
								<MyCheckBox 
										title="Search By End Date"
										onPress={()=> setShowEnd(!showEnd)}
										value={showEnd}
								/>

						<Collapsible collapsed={!showEnd}>
								<MyTouchableInput
										label='Start Date From'
										value={""}
										icon={() => icons.calendar(colors.primary)}
										onPress={() => ref_calendar?.current?.openModal({}, "end_date")}
								/>
								<MyTouchableInput
										label='End Date From'
										value={""}
										icon={() => icons.calendar(colors.primary)}
										onPress={() => ref_calendar?.current?.openModal({}, "end_date")}
								/>
						</Collapsible>
						</> }

						<MyCheckBox 
								title="Search By Attracted Coins"
								value={showAttract}
								onPress={()=> setShowAttract(!showAttract)}
						/>		
						<Collapsible collapsed={!showAttract}>
								<View style={{ flexDirection: "row", marginTop: 10 }}>
								<View style={{ flex: 1 }}>
								<MyInputs
                label='Coin From*'
                value={0}
                onChangeText={(text) => console.log(text)}
                keyboardType='number-pad'
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <MyInputs
                label='Coin To*'
                value={0}
                onChangeText={(text) => console.log(text)}
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
            onPress={()=> console.log("Yoko so")}
          />
          <MyButton
            style={{ flex: 1 }}
            title='Submit'
            onPress={()=> console.log("Yoko so")}
          />

        </View>


						
				<CalendarModal
						ref={ref_calendar}
						onDateSelected={(date, type) => console.log(data,type)}
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
				title:"Complete",
				key:"complete",
		},
		{
				title:"In Progress",
				key:"in_progress",
		}
]

export default Filter
