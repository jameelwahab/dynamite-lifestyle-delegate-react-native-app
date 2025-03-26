import RootView from "../../components/RootView"
import MyRefreshControl from '../../components/MyRefreshControl'
import MyWebView from "../../components/MyWebview"
import MyLoader from "../../components/MyLoader"
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
		const ref_flatList = useRef(null)
		const [refreshing , setRefreshing ] = useState(false)
		const [loading, setLoading] =useState(false)
		const [currIndex, setCurrIndex] = useState(0);
		const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })

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

		const handleSelect = (index) => {
				setCurrIndex(index)
				ref_flatList?.current.scrollToIndex({ animated: true, index: index })
		}

		const onRefresh = () => {
				setRefreshing(true)
				getList()
		}

		const onViewCallBack = useCallback((viewableItems:any)=> {
            viewableItems.changed.map(el=>{
								if(el.isViewable) setCurrIndex(el.index)
						})
		}, [])

   const titleView = () => {
    return (
      <View style={__styles.heading_container}>
        <Text style={__styles.heading_font} >
				{"Updates"} 
        </Text>
				<View style={{flexDirection:"row"}}>
        <TouchableOpacity
          onPress={()=>ref?.current?.openModal()}
          style={[__styles.filterButton, {marginRight:10}]}
          hitSlop={{ bottom: 5, top: 5, left: 5, right: 5 }}>
          {icons.menuCircle(colors.primary, 30)}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate(routes.updatesFilter, {filters}) }
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

		const renderList = (item)=>{
				return (
						<View style={{padding:15, borderRadius:10, backgroundColor: colors.secondary }}>
								<MyText
										fontSize={20}
										color={colors.primary}
										type="bold"
										>{item?.title}</MyText>
								<MyWebView 
										html={item?.fixed_issues_description}
										style={__webViewStyle}
								/>
						</View>
				)
		}

		return (
				<RootView hideBackBottomButton titleView={titleView}>
						<FlatList 
								ref={ref_flatList}
								refreshControl={<MyRefreshControl
										refreshing={refreshing}
										onRefresh={onRefresh}
								/>}
								data={list}
								showsVerticalScrollIndicator={false}
								ListHeaderComponent={headerView()}
								KeyExtractor={(item)=> item?._id}
								ItemSeparatorComponent={<View style={{height:20}}/>}
								renderItem={({item})=> renderList(item)}
								stickyHeaderIndices={[0]}
								stickyHeaderHiddenOnScroll={true}
						/>	
						<MyLoader enable={loading} />

						<UpdatesModal
								list={titleList}
								currIndex={currIndex}
								onChangeIndex={handleSelect}
								ref={ref}
								/>
				</RootView>
		)
}

								// onViewableItemsChanged={onViewCallBack}
								// viewabilityConfig={viewConfigRef?.current}

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

const __webViewStyle = StyleSheet.create({
  
		div: {
				color: colors.white,
				fontFamily: fonts.regular,
				marginTop:5
		},
		h3:{
				color: colors.primary,
				fontSize:14,
				margin: 0,
				fontWeight: "500",
		},
		b:{
				color: colors.primary,
				fontSize:14,
				margin: 0,
				fontWeight: "500",
		},
		strong:{
				color: colors.lightText2
		}
})

export default Updates 
