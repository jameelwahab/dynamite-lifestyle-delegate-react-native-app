import {View, Text, StyleSheet,FlatList, Image} from "react-native"
import TitleView from "../../components/TitleView"
import RootView from "../../components/RootView"
import MyLoader from "../../components/MyLoader"
import Tabs from "../../components/Tabs"
import MyText from "../../components/MyText"
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
    const [res, setResult] = useState([])
    const [loading,setLoading] = useState(true)
    const [footerLoader, setFooterLoader] = useState(false)
    const [refreshing, setRefreshing]=useState(false)

    const getMissionDetail = useCallback(async (tab) => {
	setLoading(true)
	const res = await GET_MISSION_DETAIL({
	    token, navigation, id:route.params.id
	})
	if(res.code == 200){
	    setResult(res.mission)
	    setRefreshing(false)
	    setLoading(false)
	}
    })
    const getList = async () => {
	setLoading(true)
	const res = await GET_MISSION_INFO({
	    token, navigation, id
	})
	setResult(tab==2 ? res.streak_leader_board_stats : res.coins_leader_board_stats)
	setLoading(false)
	setRefreshing(false);
    }
    useEffect(()=>{
	setRefreshing(false)
	if(tab==0) getMissionDetail()
	if(tab > 1) getList()
    },[tab])

    const tab_list = [
	{title:"Mission Overview",tab:0},
	{title:"Community",tab:1},
	{title:"Completed", tab:2},
	{title:"Progress", tab:3},
    ]
    const loadMore = () => {
	setFooterLoader(true)
    }
    return ( 
	<View style={__styles.container}> 
	    <FlatList 
		data={[1]}
		keyExtraction={(_,index)=> index.toString()}
		ListHeaderComponent={
		    <Tabs 
			list={tab_list}
			tab={tab}
			style={{zIndex:10}}
			changeTab={(e)=> setTab(e)}
		    />
		}
		refreshControl={<MyRefreshControl
		    refreshing={refreshing}
		    onRefresh={()=> setRefreshing(true)}
		/>}
		renderItem={({_})=>
		    (tab==0  && <Overview res={res} loading={loading}/>) ||
		    (tab==1 && <Community />) ||
		    (tab > 1  && 
			<MissionContributor 
			    res={res}
			    loading={loading}
			/>
		    )}
	/>	
	</View>
    )

}

const TrackerList = ({res}) => {
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
		    <View style={__styles.card_container}>
			<Text style={__styles.card_heading}>{item.main_heading}</Text>
			<Text style={{color:"white"}}>{item.short_description}</Text>
		    </View> 
		}
	    />
	)
    }


const Header = ({res})=>{
	return(
	    <>
		<MyWebview fullWidth html={`<iframe src=\"https://player.vimeo.com/video/1048341542\" width=\"640\" height=\"360\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"></iframe>`} />
		<View style={{height:10}}/>
		<MissionRewardView 
		    duration={res.mission_duration}
		    acheivedCoins={res.rewarded_coins}
		    badgesEarned={res.badge_configration}
		/>
		<MyWebview fullWidth html={res.detailed_description.toString()} />
	    </>
	)
    }

const Overview = ({res,loading}) => {
    if(loading) return <MyLoader enable={loading} />
	return  (
	    <FlatList 
		scrollEnabled={false}
		style={{marginTop:10}}
		showsVerticalScrollIndicator={false}
		ListHeaderComponent={<Header res={res}/>}
		data={[1]}
		ListHeaderComponentStyle={{marginBottom:20}}
		keyExtraction={(_,index)=> index.toString()}
		renderItem={({item})=> <TrackerList res={res}/>}
	    />
	    )
}

const Community = ({token, navigation,id}) => {
    return (
	<MyText 
	fontSize={16} color={colors.primary}
	style={{fontFamily:fonts.bold}}
	>Hello from Revel</MyText>
    )
}

const MissionContributor = ({res,loading, loadMore, footerLoad}) =>{
    if(loading) return <MyLoader enable={loading} />
    return(
	<>
	<FlatList 
	    data={res}
	    scrollEnabled={false}
	    keyExtraction={(_,index)=> index.toString()}
	    showsVerticalScrollIndicator={false}
	    ItemSeparatorComponent={<View style={{height:10}}/>}
	    onEndReached={loadMore}
	    ListFooterComponent={<FooterLoader isVisible={footerLoad} />}
	    renderItem={({item,index})=> 
		<Contributor 
		num={index+1}
		name={`${item.user_info.first_name} ${item.user_info.last_name}`} 
		img={item.user_info.profile_image}
		points={item.mission_attracted_coins}/>
	    }/>
	    <MyLoader enable={loading} />
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
