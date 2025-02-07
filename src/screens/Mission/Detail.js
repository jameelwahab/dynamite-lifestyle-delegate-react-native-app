import {View, Text, StyleSheet,FlatList, Image,Pressable} from "react-native"
import TitleView from "../../components/TitleView"
import RootView from "../../components/RootView"
import MyLoader from "../../components/MyLoader"
import EmptyView from '../../components/EmptyView'
import Tabs from "../../components/Tabs"
import MyText from "../../components/MyText"
import VimeoIFrame from"../../components/VimeoIFrame" 
import Contributor from  "../../components/Contributor"
import MyWebview from "../../components/MyWebview"
import {fonts} from "../../utilities/fonts"
import {colors} from "../../utilities/colors"
import { GET_MISSION_DETAIL, GET_MISSION_INFO } from "../../DAL"
import { selectUser } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import {useEffect,useCallback} from "react"
import MissionRewardView from "../../components/MissionRewardView"
import FooterLoader from "../../components/FooterLoader"
import MyRefreshControl from "../../components/MyRefreshControl"
import {useState, useRef} from "react"
import routes from "../../navigation/routes"
import {useNavigation} from "@react-navigation/native"

const List = (props) =>{
    return (
	<RootView hideSubHeader>
	    <MissionDetail {...props} />
	</RootView>
    )
}

const MissionDetail = ({navigation, route}) => {
    const { token } = useSelector(selectUser);
    const [tab, setTab] = useState(0)

    const tab_list = [
	{title:"Mission Overview",tab:0},
	{title:"Community",tab:1},
	{title:"Completed", tab:2},
	{title:"Progress", tab:3},
    ]

    return ( 
	<View style={__styles.container}> 
	    <Tabs 
		list={tab_list}
		tab={tab}
		style={{zIndex:10}}
		changeTab={(e)=> setTab(e)}
	    />
	{tab==0  && <Overview token={token} navigation={navigation} id={route.params.id} /> }
	{tab==1 && <Community />}
	{tab > 1  && 
		<MissionContributor token={token} navigation={navigation} id={route.params.id} tab={tab}/>}
	</View>
    )

}

const TrackerList = ({res}) => {
    const nav = useNavigation()
    const handlePress= (item) => nav.navigate(routes.missionSchedule, {id: item._id})
	return(
	    <FlatList
		scrollEnabled={false}
		style={__styles.card}
		showsVerticalScrollIndicator={false}
		data={res.mission_schedules}
		ListHeaderComponent={
		    <>
			<Text style={__styles.heading}>{res.content_settings.schedule_heading}</Text>
		    </>
		}
		ListHeaderComponentStyle={{marginBottom:10}}
		KeyExtraction={(_,index)=> index.toString()}
		ItemSeparatorComponent={<View style={{height:20}}/>}
		renderItem={({item})=>
		    <Pressable onPress={()=>handlePress(item)}>
		    <View  style={__styles.card_container}>
			<Text style={__styles.card_heading}>{item.main_heading}</Text>
			<Text style={{color:"white"}}>{item.short_description}</Text>
		    </View> 
		    </Pressable>
		}
	    />
	)
    }


const Header = ({res})=>{
	return res!=null &&(
	    <>
		<VimeoIFrame url={res.video_url} />
		<View style={{height:10}}/>
		<MissionRewardView 
		    duration={res.mission_duration}
		    acheivedCoins={res.rewarded_coins}
		    badgesEarned={res.badge_configration}
		/>
		<MyWebview fullWidth html={res?.detailed_description?.toString()} />
	    </>
	)
    }

const Overview = ({token,navigation,id}) => {
    const [res, setResult] = useState([])
    const [loading,setLoading] = useState(true)
    const [refreshing, setRefreshing]=useState(false)

    const getMissionDetail = async (loader) => {
	setLoading(loader)
	const res = await GET_MISSION_DETAIL({
	    token, navigation, id
	})
	if(res.code == 200){
	    setResult(res.mission)
	    setLoading(false)
	    setRefreshing(false);
	}
    }
    useEffect(()=>{
	getMissionDetail(true)
    },[])
    const onRefresh = () => {
	setRefreshing(true);
	getMissionDetail(false)
    }
    if(loading) return <MyLoader enable={loading} />
    return  (
	<FlatList 
	style={{marginTop:10}}
	showsVerticalScrollIndicator={false}
	data={[1]}
	ListEmptyComponent={!loading && <EmptyView />}
	ListHeaderComponent={
	    <Header res={res}/>
	}
	refreshControl={<MyRefreshControl
	    refreshing={refreshing}
	    onRefresh={onRefresh}
	    />}
	ListHeaderComponentStyle={{marginBottom:20}}
	keyExtraction={(_,index)=> index.toString()}
	renderItem={({_})=> 
	    <TrackerList res={res}/>
	}
	/>
    )
}

const Community = () => {
    return (
	<MyText 
	fontSize={16} color={colors.primary}
	style={{fontFamily:fonts.bold}}
	>Hello from Revel</MyText>
    )
}

const MissionContributor = ({token,tab, navigation,id}) =>{
    const [res, setResult] = useState([])
    const [loading,setLoading] = useState(true)
    const [refreshing, setRefreshing]=useState(false)

    const getList = async (loader) => {
	setLoading(loader)
	const res = await GET_MISSION_INFO({
	    token, navigation, id
	})
	if(res.code==200){
	    setResult(tab==2 ? res.streak_leader_board_stats : res.coins_leader_board_stats)
	    setLoading(false)
	    setRefreshing(false);
	}
    }
    useEffect(()=>{
	if(tab > 1) getList(true)
    },[tab])
    const onRefresh = () => {
	setRefreshing(true);
	getList(false)
    }
    
    if(loading) return <MyLoader enable={loading} />
    return(
	<>
	<FlatList 
	    data={res}
	    keyExtraction={(_,index)=> index.toString()}
	    showsVerticalScrollIndicator={false}
	    ItemSeparatorComponent={<View style={{height:10}}/>}
	    ListEmptyComponent={!loading && <EmptyView />}
	    refreshControl={<MyRefreshControl
		refreshing={refreshing}
		onRefresh={onRefresh}
		/>}
	    renderItem={({item,index})=> 
		<Contributor 
		num={index+1}
		name={`${item.user_info.first_name} ${item.user_info.last_name}`} 
		img={item.user_info.profile_image}
		points={item.mission_attracted_coins}/>
	    }/>
	</>
    );
}
const __styles = StyleSheet.create({
    container:{
	flex:1,
	paddingVertical:10,
    },
    card:{
	backgroundColor:colors.secondary,
	padding:10,
	borderRadius:10,
    },
    heading:{
	textAlign:"center",
	color:colors.primary,
	fontSize:16,
	fontFamily: fonts.bold
    },
    card_container:{
	paddingVertical:5,
	paddingHorizontal:10,
	borderWidth:1,
	borderColor:colors.border,
	borderRadius:10,
    },
    card_heading:{
	color:colors.primary,
	fontSize:14,
	fontFamily: fonts.bold
    },
    

})

export default List
