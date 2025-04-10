import RootView from "../../components/RootView"
import MyRefreshControl from '../../components/MyRefreshControl'
import MyWebView from "../../components/MyWebview"
import MyLoader from "../../components/MyLoader"
import EmptyView from '../../components/EmptyView'
import OptionModal2 from "../../components/OptionModal2"
import MyChip from "../../components/MyChip"
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from "react-native"
import { dateTimeFormat } from "../../utilities/constants"
import { useEffect, useState, useRef, useCallback } from "react"
import MyText from "../../components/MyText"
import routes from "../../navigation/routes"
import { icons } from "../../utilities/icons"
import { colors } from "../../utilities/colors"
import { fonts } from "../../utilities/fonts"
import { GET_UPDATES_LIST } from "../../DAL"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import moment from "moment"
import UpdatesModal from "./UpdateModal" 


const Updates = ({route,navigation}) => {

		const { token } = useSelector(selectUser);
		const [filters, setFilters]=useState(route?.params?.filters)
		const [list, setList] = useState([])
		const [titleList, setTitleList] = useState([])
		const ref = useRef(null)
		const [refreshing , setRefreshing ] = useState(false)
		const [loading, setLoading] =useState(false)

		const getList = async ()=>{
				const res = await GET_UPDATES_LIST({token, navigation, body:filters})
				setRefreshing(false)
				setLoading(false)
				if(res.code == 200){
						setList(res?.portal_updates)
						setTitleList(
								res?.portal_updates?.map(el=> {
										const res = {title: el.title, key: el.title.toLowerCase().replace(/ /g, "_") }
										return res 
								}) || [] )
				}
		}

		useEffect(()=>{
				setList([])
				setLoading(true)
				getList()
		},[filters])


		useEffect(()=>{
				if(!!route.params?.filters){
						const {start_date,  end_date} =  route?.params?.filters
						setFilters({
								start_date: !!start_date 
								? moment(start_date).format("YYYY-MM-DD"): null,
								end_date: !!end_date 
								? moment(end_date).format("YYYY-MM-DD"): null,
						})
				}
		},[route])

		

		const onRefresh = () => {
				setRefreshing(true)
				getList()
		}

   const titleView = () => {

			 const handleMenuPress = () => {
					 setTimeout(()=>{
							 ref?.current?.openModal()
					 },200)
			 }

			 const handleFilterPress = () => {
					 navigation.navigate(routes.updatesFilter, {filters}) 
			 }

    return (
      <View style={__styles.heading_container}>
        <Text style={__styles.heading_font} >
				{"Updates"} 
        </Text>
				<View style={{flexDirection:"row"}}>

        <TouchableOpacity
          onPress={handleFilterPress}
          style={__styles.filterButton}
          hitSlop={{ bottom: 5, top: 5, left: 5, right: 5 }}>
          {icons.filterCircle(colors.primary, 30)}
        </TouchableOpacity>
				</View>
      </View>

    )
  }

		const headerView = () => {
				const handlePress = () => setFilters({})
				return (
						<View>
								{
								  !!filters?.start_date && !!filters?.end_date &&
										<View style={__styles.topHeaderView}>
												<MyText>Filter By: </MyText>
												<MyChip
														title={"From " + moment(filters?.start_date).format(dateTimeFormat.date)}
														onPress={handlePress}
												/>
												<MyChip
														title={"To "+ moment(filters?.end_date).format(dateTimeFormat.date)}
														onPress={handlePress}
												/>
										</View>
								}
						</View>
				)
		}

		const renderList = (item, index)=>{
				return (
						<TouchableOpacity 
								onPress={()=> navigation.navigate(routes.updatesDetail, { list, index } )}
								style={{padding:15, borderRadius:10, backgroundColor: colors.secondary }}>
								<View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
								<MyText
										fontSize={16}
										color={colors.primary}
										type="bold"

										>{item?.title}</MyText>
								<MyText style={{opacity:0.5}} type="semi">
										{moment(item?.date).format(dateTimeFormat.date)}
								</MyText>
								</View>
						</TouchableOpacity>
				)
		}

		return (
				<RootView hideBackBottomButton titleView={titleView}>
						<FlatList 
								refreshControl={<MyRefreshControl
										refreshing={refreshing}
										onRefresh={onRefresh}
								/>}
								data={list}
								showsVerticalScrollIndicator={false}
								ListHeaderComponent={headerView()}
								ListHeaderComponentStyle={{marginTop:10}}
								KeyExtractor={(item)=> item?._id}
								ItemSeparatorComponent={<View style={{height:15}}/>}
								renderItem={({item, index})=> renderList(item, index)}
								stickyHeaderIndices={[0]}
								ListEmptyComponent={!loading && <EmptyView />}
								stickyHeaderHiddenOnScroll={true}
						/>	
						<MyLoader enable={loading} />
				</RootView>
		)
}

const __styles = StyleSheet.create({
		heading_container: {
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				backgroundColor: colors.darkSecondary,
				marginHorizontal: 15
		},
  heading_font: {
    color: colors.primary,
    // fontFamily: fonts.semiBold,
    fontSize: 18,
    includeFontPadding: false,
    textTransform: "capitalize",
    fontFamily: fonts.bold,
    includeFontPadding: false
  },
  filterButton: {
    height: "100%",
    justifyContent: "center",
    // width: 50,
    alignItems: "center",
    flexDirection: "row",
    // borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    // paddingHorizontal: 15,
    // paddingVertical: 8
  },

		topHeaderView: {
    backgroundColor: colors.darkSecondary,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
		paddingBottom:10
  },
})


export default Updates 
