import RootView from "../../components/RootView"
import MyLoader from "../../components/MyLoader"
import MyText from "../../components/MyText"
import UserImage from "../../components/UserImage"
import { colors } from "../../utilities/colors"
import MyRefreshControl from "../../components/MyRefreshControl"
import { MyButton } from "../../components/MyButton"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import isArray from "../../functions/isArray"
import { icons } from "../../utilities/icons"
import StatView from "../../components/StatView"
import { GET_TEMPLATE_PAYMENT_MANAGE_LIST } from "../../DAL"
import {useState, useEffect} from "react"
import { FlatList, View, Pressable, StyleSheet } from "react-native"

const  TemplateManageAccess = ({navigation, route}) => {
		const { item }  = route.params
		const { token } = useSelector(selectUser);
		const [list, setList] = useState([])
		const [loader, setLoader] = useState(false)
		const [refreshing, setRefresh] = useState(false)

		const getList = async () => {
				const result = await GET_TEMPLATE_PAYMENT_MANAGE_LIST({
						token, navigation, id:item?._id})
				if(result.code == 200){
						setLoader(false);
						setRefresh(false);
						setList(result?.events)
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

		useEffect(()=>{
				setLoader(true)
				getList()
		},[])

		const renderList = (data, index) => {

				const statusView = () => {
						const value = data?.status
						return (
								<View style={[{ backgroundColor: value ? colors.green + "33" : colors.delete + "33" }, __styles.badge_container ]}>
										<MyText type='medium' color={value ? colors.green : colors.delete} >{value ? "Active" : "Inactive"}</MyText>
								</View> )
				}

				const dropDownOpen = (ref) => {
						return (
								<Pressable 
										onPress={()=> ref?.current?.openModal()}
										style={__styles.drop_down}>
										<MyText type="semi">Hello</MyText>
										{icons.down()}
								</Pressable>
						)
				}

				return (
						<View style={__styles.itemView}>
								<UserImage 
										image={data?.images?.thumbnail_1}
										name={data?.title}
										/>
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
										view={dropDownOpen}
										/>
								<StatView 
										title={"End Access Interval Type"}
										view={dropDownOpen}
										/>
						</View>
				)
		}

		return (
				<RootView title={item?.plan_title}>
						<FlatList 
								data={list}
								KeyExtractor={(_,index)=>index.toString()}
								renderItem={({item,index})=>renderList(item,index)}
								refreshControl={<MyRefreshControl
										refreshing={refreshing}
										onRefresh={onRefresh}
								/>}
								stickyHeaderIndices={[0]}
								stickyHeaderHiddenOnScroll={true}
								showsVerticalScrollIndicator={false}
						/>
							{isArray(list) &&
					<MyButton title="Update" onPress={()=>console.log()} />}
						<MyLoader enable={loader}/>
				</RootView>
		)
}

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
				maxWidth:200,
		}
})

export default TemplateManageAccess
