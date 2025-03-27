import moment from "moment"
import { useRef, useState, useEffect } from "react"
import { dateTimeFormat } from "../../utilities/constants"
import RootView from "../../components/RootView"
import {View, Text, StyleSheet} from "react-native"
import routes from "../../navigation/routes"
import MyTouchableInput from '../../components/MyTouchableInput'
import { MyButton, MyClearButton } from '../../components/MyButton'
import CalendarModal from '../../components/CalendarModal'
import { icons } from "../../utilities/icons"
import { colors } from "../../utilities/colors"
import showToast from "../../functions/showToast"


const UpdatesFilter = ({route,navigation}) => {
		const ref_calendar = useRef(null)
		const [filters, updateFilter] = useState(route?.params?.filters);

		const setFilters = (update)=>{
				updateFilter({...filters, ...update})
		}

		const  onSubmitButtonPress =() =>{
				if(!filters?.start_date || !filters?.end_date){
						showToast({ title: "Alert", body: "Please select both start and end date" })
				}
				else{
						navigation.navigate(routes.updatesMain, { filters } )
				}
		}

		const  onResetButtonPress =() => {
				setFilters({})
				navigation.navigate(routes.updatesMain)
		}


		useEffect(()=>console.log(filters),[filters])

		return (
				<RootView title="Filter"> 

						<MyTouchableInput
								label='Start Date'
								value={!!filters?.start_date ? moment(filters?.start_date).format(dateTimeFormat.date) : ""}
								icon={() => icons.calendar(colors.primary)}
								onPress={() => ref_calendar?.current?.openModal(filters?.start_date, "start_date")}
						/>

						<MyTouchableInput
								label='End Date'
								value={!!filters?.end_date ? moment(filters?.end_date).format(dateTimeFormat.date) : ""}
								icon={() => icons.calendar(colors.primary)}
								onPress={() => ref_calendar?.current?.openModal(filters?.start_date, "end_date")}
						/>

				<View style={{ flexDirection: "row", marginTop: 10 }}>

          <MyClearButton
            style={{ flex: 1, marginRight: 10 }}
            title='Clear Filter'
            onPress={onResetButtonPress}
          />

          <MyButton
            style={{ flex: 1 }}
            title='Submit'
            onPress={onSubmitButtonPress}
          />

        </View>

				<CalendarModal
						ref={ref_calendar}
						onDateSelected={(date, type) =>
								setFilters({ [type]: date || null } 
								)}
				/>

				</RootView>
		)
}

export default UpdatesFilter
