import {
	View, Text, StyleSheet, FlatList,
	ScrollView, TouchableOpacity,
	SafeAreaView, Pressable,
	TextInput,
} from "react-native"
import Modal from 'react-native-modal'
import { MyButton, MyClearButton } from '../../../components/MyButton'
import { useState, useEffect } from "react"
import { GET_MISSION_FILTER_LIST } from "../../../DAL"
import { colors } from '../../../utilities/colors'
import { icons } from '../../../utilities/icons'
import { fonts } from '../../../utilities/fonts'
import Icon from "react-native-vector-icons/AntDesign"
import { dateTimeFormat } from '../../../utilities/constants'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import RootView from '../../../components/RootView'
import MyLoader from '../../../components/MyLoader'
import MyText from '../../../components/MyText'
import routes from "../../../navigation/routes"
import OptionModalWithSearch from "../../../components/OptionModalWithSearch"

const FilterScreen = ({ navigation, route }) => {
	const [isCalendarModalVisible, setCalendarModalVisiblity] = useState(false)
	const { token } = useSelector(selectUser);
	const [duration, setDuration] = useState({ from: "", to: "" })
	const [select, setSelected] = useState({
		title: "", from: 0, to: 0, _id: "",
		end_limit: 0,
	})
	const [list, setList] = useState([])

	const getList = async () => {
		const res = await GET_MISSION_FILTER_LIST({ token, navigation })
		if (res.code == 200) {
			setList(res.missions)
		}
		else {
			navigation.goBack()
		}
	}

	useEffect(() => {
		getList()
	}, [])
	
	useEffect(() => {
		setSelected(route.params.filter)
		setDuration({ from: route?.params?.filter?.from || "", to: route?.params?.filter?.end_limit || "" })
	}, [route])

	const handleSubmit = () => {
		navigation.navigate(routes.missionMembers, { filter: { ...select, end_limit: duration.to } })
	}
	const filterTheList = (items, text) => {
	    if (text.trim() == "") {
		return items
	    } else {
		    return items.filter(x=> {
			return filterTxtForSearch(x.title).includes(filterTxtForSearch(text)) &&  x
		    })
	    }
	}
	const filterTxtForSearch = (txt)=> txt.toLowerCase().split('').filter(e=> e.trim().length).join('')
	const CalendarModal = () => {
		return (
		    <OptionModalWithSearch
			    isVisible={isCalendarModalVisible}
			    closeModal={()=>setCalendarModalVisiblity(false)}
			    filterTheList={filterTheList}
			    onSelected={(item)=>{
-				setCalendarModalVisiblity(false)
-				setSelected({ _id: item?._id, title: item?.title, from: 1, to: item?.mission_duration })
-				setDuration({ from: 1, to: item?.mission_duration })
			    }}
			    optionList={list}
			    
			>
		    </OptionModalWithSearch>
		)
	}
	return (
		<RootView title='Filter' >
			{CalendarModal()}
			<View style={{ flex: 1 }}>
				<ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
					<View style={{ height: 10 }} />
					<Pressable onPress={() => setCalendarModalVisiblity(true)} style={__style.top_view_con}>
						<View
							style={{ flex: 0.8 }} >
							<MyText>{select?.title || "Missions"}</MyText>
						</View>
						<View style={{ flexDirection: 'row' }}>
							{select?.title &&
								<Pressable style={__style.icons_container} onPress={() => setSelected({ title: "", from: 0, to: 0 })}>
									<Icon name="close" size={15} color={colors.lightText} />
								</Pressable>
							}
							<View style={{ width: 15 }} />
							<Pressable
								style={__style.icons_container}
								onPress={() => setCalendarModalVisiblity(true)}>
								<Icon name="caretdown" size={12} color={colors.primary} />
							</Pressable>
						</View>
					</Pressable>
					<View style={{ height: 25 }} />
					{select?.title &&
						<>
							<MyText color={colors.primary}>Duration from {duration.from} to {duration.to}</MyText>
							<View style={{ height: 10 }} />
							<View style={__style.date_form_con}>
								<MyInputs
									handleTextChange={(txt) =>
										txt < duration.to
										&&
										setSelected({ ...select, from: txt })
									}
									label='From*'
									max_length={select.to.toString().length}
									placeholder={"1"}
									keyboardType="phone-pad"
									icon={() => icons.calendar(colors.primary, 20)}
									value={select.from}
								/>
								<View style={{ width: 10 }} />
								<MyInputs
									label='To*'
									max_length={2}
									handleTextChange={(txt) =>
										txt <= duration.to
										&&
										setSelected({ ...select, to: txt })
									}
									placeholder={"7"}
									icon={() => icons.calendar(colors.primary, 20)}
									value={select.to}
								/>
							</View>
						</>
					}

					<View style={{ height: 10 }} />

					<View style={{ flexDirection: "row", marginTop: 10 }}>
						<MyClearButton
							onPress={() => setSelected({
								title: "", from: 0, to: 0, _id: "",
								end_limit: 0,
							})}
							style={{ flex: 1, marginRight: 10 }}
							title='Clear Filter'
						/>
						<View style={{ flex: 1 }}>
							<MyButton
								onPress={handleSubmit}
								title='Submit'
							/>
						</View>

					</View>

				</ScrollView>
			</View>

		</RootView>
	);
}

const MyInputs = ({ placeholder, label, handleTextChange, value, max_length = 1 }) => {
	const [isFocused, setFocused] = useState(false)
	const [val, setVal] = useState(value)
	useEffect(() => {
		setVal(value)
	}, [value])
	return (
		<View style={{ flexDirection: "column", flex: 1, }}>
			<MyText color={isFocused ? colors.primary : colors.lightText} style={{ marginLeft: 5, marginBottom: 10 }}>{label}</MyText>
			<TextInput
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				maxLength={max_length}
				keyboardType="phone-pad"
				placeholderTextColor={colors.placeholder}
				value={val.toString()}
				onChangeText={handleTextChange}
				style={[__style.input, { borderColor: isFocused ? colors.primary : colors.lightText }]}
			/>
		</View>
	);
}
// Don't try to read it. Just rewrite the code i am too lazy to add variables


const __style = StyleSheet.create({
	date_form_con: {
		flex: 1,
		alignItem: "center",
		flexDirection: "row",
		justifyContent: "space-between"
	},
	top_view_con: {
		height: 50,
		flexDirection: "row",
		alignItems: 'center',
		justifyContent: "space-between",
		borderWidth: 1,
		padding: 10,
		borderColor: colors.lightText,
		borderRadius: 5,
	},
	list_sub_container: {
		padding: 10
	},
	input: {
		height: 45,
		fontFamily: fonts.regular,
		includeFontPadding: false,
		flex: 1,
		paddingHorizontal: 10,
		color: colors.text,
		borderWidth: 1,
		borderRadius: 5
	},
	icons_container: {
		height: 45,
		justifyContent: 'center'
	}
})

export default FilterScreen
