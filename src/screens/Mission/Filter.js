import { View } from "react-native"
import MyInputs from '../../components/MyInputs'
import RootView from "../../components/RootView"
import MyChip from "../../components/MyChip"
import showToast from "../../functions/showToast"
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
	const ref_status = useRef(null);
	const ref_badges = useRef(null);
	const ref_badge_type = useRef(null);
	const ref_calendar = useRef(null)
	const ref_coinList = useRef(null);
	const { access } = useSelector(selectUser);

	const [showStart, setShowStart] = useState(!!route.params.filters?.from_start_date)
	const [showEnd, setShowEnd] = useState(!!route.params.filters?.to_end_date)
	const [showAttract, setShowAttract] = useState(!!route.params.filters?.coins_from)
	const [badges, setBadges] = useState(!!route.params.filters?.badges ? route.params.filters?.badges : [])
	const [filter, setFilter] = useState(route.params.filters)
	const [coins, setCoins] = useState({ from: route.params.filters?.coins_from || "0", to: route.params.filters?.coins_to || "0" })

	const optionStatus = () => ref_status.current.openModal()
	const optionBadges = () => ref_badges.current.openModal()
	const optionBadgeType = () => ref_badge_type.current.openModal()

	const handleSelect = (item) => item.key != 'all' ? setFilter({ ...filter, mission_status: item.key, status: item.title }) : setFilter({ ...filter, mission_status: null, status: null })

	const handleSelect2 = (item) => {
		if (badges.length != access.badge_levels.length) {
			setBadges(badges.length == 0 ? [item] : [...badges, item])
		}
	}

	const handleSelect3 = (item) => setFilter({ ...filter, badge_type: item.key, filter_member_title: item.title });

	const handleSelect4 = (item) => {
		if (item.key == "none") {
			let obj = { ...filter }
			delete obj?.sort_by_coins
			setFilter({ ...obj })
		} else {
			setFilter({ ...filter, sort_by_coins: item.key })
		}
	}

	const filterList = () => {
		if (badges.length == access.badge_levels.length) {
			return [{ title: "No options" }]
		}
		else if (badges.length == 0) { return [...access?.badge_levels] }
		else {
			return access?.badge_levels.filter(el =>
				badges.findIndex(x => x._id == el._id) < 0 && el)
		}
	}
	useEffect(() => {
		setFilter(route.params.filters)
	}, [route])

	useEffect(() => {
		console.log(filter)
	}, [filter])

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
					label='Sort coins by'
					value={!!filter?.sort_by_coins ? (filter?.sort_by_coins === "ascending" ? "Low to high" : "High to low") : ""}
					icon={() => icons.down()}
					onPress={() => ref_coinList?.current.openModal()}
				/>

				<MyTouchableInput
					label='Filter Member by Badge Level*'
					value={filter?.filter_member_title || ""}
					icon={() => icons.down()}
					onPress={optionBadgeType}
				/>

				<MyTouchableInput
					label={filter?.badge_type == "accept_time" && filter?.filter_member_title || "Current User Badge level"}
					iconOnPress={optionBadges}
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
						setFilter({ ...filter, from_start_date: null, to_start_date: null })
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
						value={filter?.to_start_date || ""}
						icon={() => icons.calendar(colors.primary)}
						onPress={() => ref_calendar?.current?.openModal(filter?.from_end_date, "to_start_date")}
					/>
				</Collapsible>

				{route.params.item.type == "quest" &&
					<>
						<MyCheckBox
							title="Search By End Date"
							onPress={() => {
								setShowEnd(!showEnd)
								setFilter({ ...filter, from_end_date: null, to_end_date: null })
							}}
							value={showEnd}
						/>

						<Collapsible collapsed={!showEnd}>
							<MyTouchableInput
								label='Start Date From'
								value={filter?.from_end_date || ""}
								icon={() => icons.calendar(colors.primary)}
								onPress={() => ref_calendar?.current?.openModal(filter?.to_start_date, "from_end_date")}
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
								value={coins.from}
								onChangeText={(text) => setCoins({ ...coins, from: text })}
								keyboardType='number-pad'
							/>
						</View>
						<View style={{ flex: 1, marginLeft: 10 }}>
							<MyInputs
								label='Coin To*'
								value={coins.to}
								onChangeText={(text) => setCoins({ ...coins, to: text })}
								keyboardType='number-pad'
							/>
						</View>
					</View>
				</Collapsible>

				<OptionModal2
					ref={ref_status}
					onSelected={handleSelect}
					optionList={statusList}
				/>

				<OptionModal2
					ref={ref_badges}
					onSelected={handleSelect2}
					filterTheList={filterList}
				/>

				<OptionModal2
					ref={ref_badge_type}
					onSelected={handleSelect3}
					optionList={filterMember}
				/>

				<OptionModal2
					ref={ref_coinList}
					onSelected={handleSelect4}
					optionList={coinsList}
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
						onPress={() => {
							if ((!!filter?.badge_type && badges.length == 0) || (badges.length != 0 && !!filter?.badge_type == false)) {
								showToast({ body: "Please Select the Filter Member by Badge Type", title: "Filter Badege Level Not Selected" })
							} else {
								nav.navigate(routes.missionMemberList, {
									filter: {
										...filter,
										badge_levels: [...badges.map(el => el._id)],
										badges,
										coins_from: showAttract ? coins.from : null,
										coins_to: showAttract ? coins.to : null
									},
									item: route.params.item
								})

							}
						}}
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

const coinsList = [
	{
		title: "None",
		key: "none"
	},
	{
		title: "High to low",
		key: "descending",
	},
	{
		title: "Low to high",
		key: "ascending",
	}
]

const filterMember = [
	{
		title: "Member's Current Badge Level",
		key: "current",
	},
	{
		title: "Acceptance Time User Badge Level",
		key: "accept_time",
	}
]

export default Filter
