import {View, Text, TouchableOpacity, FlatList, StyleSheet} from "react-native"
import LessonView from "../../components/LessonView.js"
import TitleView from "../../components/TitleView"
import MyRefreshControl from "../../components/MyRefreshControl"
import MyLoader from "../../components/MyLoader"
import MyWebview from "../../components/MyWebview"
import {colors} from "../../utilities/colors"
import {fonts} from "../../utilities/fonts"
import {GET_MISSION_LIST_ID} from "../../DAL"
import { selectUser } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import routes from "../../navigation/routes"
import {useNavigation} from "@react-navigation/native"
import {useEffect, useState}from "react"
import RootView from "../../components/RootView"


const List = (props) =>{
    return (
	<RootView hideSubHeader>
	    <MissionList {...props} />
	</RootView>
    )
}


export default List

const MissionList = ({navigation, route}) => {
    const nav = useNavigation()
    const { token } = useSelector(selectUser);
    const [res, setResult] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const getMissionList = async (loader) => {
	setLoading(loader)
	let res = await GET_MISSION_LIST_ID({
	    token,
	    navigation,
	    id:route.params.id
	})
	if(res.code ==200){
	    setResult(res)
	    setRefreshing(false)
	    setLoading(false)
	}
    }

    useEffect(()=>{
	getMissionList(true)
    },[])
    const onRefresh = ()=>{
	setRefreshing(true)
	getMissionList(false)
    }

    const Header = () => (
	<>
	<TitleView 
	    hideBackBottomButton
	    title={res?.badge_level?.title}
	    titleIcon={route.params.icon}
	    customStyle={{borderBottomWidth:1, borderColor: colors.border, marginBottom:10,marginHorizontal: 0, }}/>
	<MyWebview 
	    fullWidth
	    html={res?.badge_level?.detailed_description?.toString()}
	    />
	</>
    )

    if(loading) return <MyLoader enable={loading}/>
    return  (
	<>
	    <FlatList 
	    style={__styles.container}
	    data={res.missions}
	    ListHeaderComponent={<Header />}
	    keyExtraction={(_,index)=>index.toString()}
	    ListHeaderComponentStyle={{marginBottom:20}}
	    ItemSeparatorComponent={()=> <View style={{height:20}}/>}
	    refreshControl={<MyRefreshControl
		refreshing={refreshing}
		onRefresh={onRefresh}
	    />}
	    renderItem={({item})=>
		 <LessonView
		    handlePress={()=> nav.navigate(routes.missionDetail, {id:item._id})}
		    heading={item.title}
		    image={item.image.thumbnail_1}
		    desc={item.short_description}
		    duration={item.mission_duration}
		/>}
	    />
	</>
    )
}

const __styles = StyleSheet.create({
    container:{
	flex:1,
    },
    heading:{
	fontSize:18,
	color: colors.primary,
	fontFamily: fonts.bold,
    },
    para:{
	color:"white",
	fontFamily: fonts.medium,
    }
})

