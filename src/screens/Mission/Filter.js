import { View } from "react-native"
import MyInputs from '../../components/MyInputs'
import RootView from "../../components/RootView"
import MyChip from "../../components/MyChip"
import MyKeyboardAvoidingView from '../../components/MyKeyboardAvoidingView'
import MyTouchableInput from '../../components/MyTouchableInput'
import OptionModal2 from '../../components/OptionModal2'
import routes from '../../navigation/routes'
import CalendarModal from "../../components/CalendarModal"
import { MyClearButton, MyButton } from '../../components/MyButton.js'
import Collapsible from 'react-native-collapsible'
import { icons } from '../../utilities/icons'
import { colors } from '../../utilities/colors'
import { dateTimeFormat } from '../../utilities/constants'
import { useRef, useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import moment from "moment"

import MyCheckBox from "../../components/MyCheckBox"

const Filter = ({ route, navigation }) => {
	const nav = useNavigation()
	const ref = useRef(null);
	const ref2 = useRef(null);
	const ref_calendar = useRef(null)
	const { access } = useSelector(selectUser);

	const [status, setStatus] = useState({ title: statusList[0].title, key: statusList[0].key });

	const [showStart, setShowStart] = useState(!!route.params.filters?.from_start_date)
	const [showEnd, setShowEnd] = useState(!!route.params.filters?.to_start_date)
	const [showAttract, setShowAttract] = useState(!!route.params.filters?.coins_from)
	const [badges, setBadges] = useState(!!route.params.filters?.badges ? route.params.filters?.badges : [])

	const optionStatus = () => ref.current.openModal()
	const optionStatus2 = () => ref2.current.openModal()
	const handleSelect = (item) => item.key != 'all' && setFilter({ ...filter, mission_status: item.key, status: item.title })

	const handleSelect2 = (item) => setBadges(badges.length == 0 ? [item] : [...badges, item])
	const [filter, setFilter] = useState(route.params.filters)
	const toUpper = (txt) => txt[0].toUpperCase() + txt.slice(1, txt.length)

	const filterList = () => {
		return badges.length == 0 ? [...access?.badge_levels] : access?.badge_levels.filter(el =>
			badges.findIndex(x => x._id == el._id) < 0 && el
		)
	}
	useEffect(() => {

		setFilter(route.params.filters)
	}, [route])

	const ListBadge = () => {
		return (
			<FlatList
				data={filter.badge_level}
				KeyExtraction
			/>
		)
	}

	return (
		<RootView title={"Filter"}>
			<MyKeyboardAvoidingView
				style={{ paddingHorizontal: 10 }}
				showsVerticalScrollIndicator={false} >

				<MyTouchableInput
					label='Status'
					value={filter?.status || "All"}
					icon={() => icons.down()}
					onPress={optionStatus}
				/>

				<MyTouchableInput
					label='Badge Level'
					iconOnPress={optionStatus2}
					view={() =>
						<View style={{ flexDirection: "row", flex: 1, alignItems: "center", flexWrap: "wrap", paddingVertical: 2 }}>
							{!!badges && badges?.length != 0 && badges?.map((el, index) =>
								<View style={{ flexWrap: "wrap", position: "relative", zIndex: 10 }} key={index}>
									<MyChip title={el.title}
										onPress={() => {
											setBadges(badges.filter(ele => ele._id != el._id))
										}} />
								</View>
							)}
						</View>
					}
				/>

				<MyCheckBox
					title="Search By Start Date"
					value={showStart}
					onPress={() => {
						setShowStart(!showStart)
						setFilter({ ...filter, from_start_date: null, from_end_date: null })
					}}
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

				{route.params.item.type == "quest" &&
					<>
						<MyCheckBox
							title="Search By End Date"
							onPress={() => {
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
					</>}

				<MyCheckBox
					title="Search By Attracted Coins"
					value={showAttract}
					onPress={() => {
						setShowAttract(!showAttract)
						setFilter({ ...filter, coins_from: null, coins_to: null })
					}}
				/>
				<Collapsible collapsed={!showAttract}>
					<View style={{ flexDirection: "row", marginTop: 10 }}>
						<View style={{ flex: 1 }}>
							<MyInputs
								label='Coin From*'
								value={!!filter?.coins_from  ? filter?.coins_from : 0}
								onChangeText={(text) => setFilter({ ...filter, coins_from: text })}
								keyboardType='number-pad'
							/>
						</View>
						<View style={{ flex: 1, marginLeft: 10 }}>
							<MyInputs
								label='Coin To*'
								value={!!filter?.coins_to ? filter?.coins_to : 0}
								onChangeText={(text) => setFilter({ ...filter, coins_to: text })}
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

				<OptionModal2
					ref={ref2}
					onSelected={handleSelect2}
					filterTheList={filterList}
				/>

				<View style={{ flexDirection: "row", marginTop: 10 }}>
					<MyClearButton
						style={{ flex: 1, marginRight: 10 }}
						title='Clear Filter'
						onPress={() => {
							setFilter({})
							setShowStart(false)
							setShowEnd(false)
							setShowAttract(false)
							nav.navigate(routes.missionMemberList, { filter: {}, item: route.params.item })
						}}
					/>
					<MyButton
						style={{ flex: 1 }}
						title='Submit'
						onPress={() => nav.navigate(routes.missionMemberList, {
							filter: {
								...filter,
								badge_levels: [...badges.map(el => el._id)],
								badges,
							},
							item: route.params.item
						})}
					/>

				</View>

				<CalendarModal
					ref={ref_calendar}
					onDateSelected={(date, type) => {
						if (type?.includes("date")) setFilter({
							...filter, [type]:
								moment(date).format(dateTimeFormat.date2)
						})
						else setFilter({ ...filter, [type]: date })
					}}
				/>
			</MyKeyboardAvoidingView>
		</RootView>
	)
}

const statusList = [
	{
		title: "All",
		key: "all",
	},
	{
		title: "Completed",
		key: "completed",
	},
	{
		title: "In Progress",
		key: "in_progress",
	}
]

export default Filter
