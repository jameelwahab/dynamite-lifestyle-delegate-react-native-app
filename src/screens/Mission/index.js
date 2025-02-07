import RootView from "../../components/RootView"
import TitleView from "../../components/TitleView.js"
import LessonView from "../../components/LessonView.js"
import MyLoader from "../../components/MyLoader"
import MyRefreshControl from '../../components/MyRefreshControl'
import { selectUser } from '../../redux/reducers/userSlice'
import {View, FlatList, Text, StyleSheet, TouchableWithoutFeedback} from "react-native"
import { useSelector } from 'react-redux'
import {GET_MISSION_LIST} from "../../DAL"
import {colors} from "../../utilities/colors"
import {fonts} from "../../utilities/fonts"
import routes from "../../navigation/routes"
import {useNavigation} from "@react-navigation/native"
import {useEffect, useState} from "react"

const Mission = (props) =>{
    return (
	<RootView hideSubHeader>
	    <MissionLevel {...props}/>
	</RootView>
    )
}
const MissionLevel =  ({navigation}) => {
    const nav = useNavigation()
    const { token } = useSelector(selectUser);
    const [res, setResult] = useState([])
    const [loading,setLoading] = useState(false)
    const [refreshing,setRefreshing] = useState(false)
    const getMission = async (loader) => {
	setLoading(loader)
	let res = await GET_MISSION_LIST({token, navigation})
	if(res.code == 200){
	    setResult(res)
	    setLoading(false)
	    setRefreshing(false)
	}
    }
    useEffect(()=>{
	getMission(true)
    },[])
    const onRefresh = ()=>{
	setRefreshing(true)
	getMission(false)
    }
    return (
	<View style={__styles.container}>
	    <FlatList 
	    showsVerticalScrollIndicator={false}
	    ListHeaderComponent={()=> 
		 <TitleView title="Mission Levels" hideBackBottomButton/>
	    }
	    ListHeaderComponentStyle={{marginBottom:10}}
	    data={res.level_badges}
	    keyExtraction={item=> item}
	    ItemSeparatorComponent={()=> <View style={{height:20}}/>}
	    refreshControl={<MyRefreshControl
		refreshing={refreshing}
		onRefresh={onRefresh}
	    />}
	    renderItem={({item})=>
		    <LessonView
		handlePress={()=>nav.navigate(routes.missionList,
		    {
			id:item._id,
			icon: item.icon.thumbnail_1,
		    })}
			title={item.title}
			heading={item.tagline}
			image={item.image.thumbnail_1}
			icon={item.icon.thumbnail_1}
			desc={item.short_description}
		    />
	    } />
	    <MyLoader enable={loading} />
	</View>
    )
}

const __styles= StyleSheet.create({
    container:{
	flex:1,
    },
    tagline:{
	color: colors.primary,
	fontFamily: fonts.medium,
	fontSize:13,
    }
})


export default Mission
