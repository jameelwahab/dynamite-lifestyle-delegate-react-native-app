import RootView from "../../components/RootView"
import MyText from "../../components/MyText"
import MyWebview from "../../components/MyWebview"
import TitleView from "../../components/TitleView"
import EmptyView from "../../components/EmptyView"
import MyCheckBox from"../../components/MyCheckBox" 
import extractTextFromHtml from "../../functions/extractTextFromHTML.js"
import {colors} from "../../utilities/colors"
import {fonts} from "../../utilities/fonts"
import { GET_MISSION_SCHEDULE } from "../../DAL"
import {useState} from "react"
import { selectUser } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import {useEffect} from "react"
import {View,FlatList, Image,StyleSheet} from "react-native"
import MyLoader from "../../components/MyLoader"
const Schedule = (props) => {
    return (
	<RootView hideSubHeader>
	    <Scheduler {...props}/>
	</RootView>
    )
}
const Scheduler = ({navigation, route})=> {
    const [loading, setLoading] = useState(false)
    const { token } = useSelector(selectUser);
    const [res, setResult] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const getResult = async(loader) => {
	setLoading(loader)
	GET_MISSION_SCHEDULE({
	    token, navigation, id:"66b4b985269b5455d39d6f27"
	}).then(res=> {
	    setResult(res)
	    setLoading(false)
	})
    }
    useEffect(()=>{
	getResult(true)
    },[])
    if(loading) return <MyLoader enable={loading} />
    if(!loading && res.length==0) return <EmptyView />
    return(
	<View style={__styles.container}>
	    <FlatList 
		ListHeaderComponent={
		    <>
		    <View style={{height:15}}/>
		    <Video url={res.mission.video_url}/>
		    <View style={{height:15}}/>
		    <Overview res={res}/>
		    </>
		}
		data={[1]}
		showsVerticalScrollIndicator={false}
		renderItem={({_})=>
		    <>
		    <View style={{height:15}}/>
		    <QNASection res={res}  />
		    <View style={{height:15}}/>
		    <QNASection res={res} content/>
		    </>
		}
	    />
	</View>
    )
}

const Overview = ({res}) => {
    return (
	<View style={__styles.schedule_container}>
		<MyText
		    fontSize={16}
		    color={colors.primary}
		    style={{fontFamily:fonts.bold}}
		    >Schedule Overview
		</MyText>
		<View style={{height:5}}/>
		<MyWebview
		    fullWidth
		    html={res.mission_schedule.detailed_description || ""} />
		<View style={{height:10}}/>
		<View style={__styles.sched_img_container}>
		    <Badge 
			img={require("../../assets/icons/calendar.png")}
			context={`${res.mission_schedule.total_number_of_days} day`} 
			/>
		    <Badge 
			img={require("../../assets/icons/coin.png")}
			context={`${res.mission_schedule.reward_coins} Reward Coins`} 
		/>
		</View>
	</View>
    )
}

const Badge = ({img, context}) => {
    return (
	<View style={__styles.badge}>
	    <Image style={__styles.schedule_img} source={img}  />
		<View style={{width:5}}/>
	    <MyText>{context}</MyText>
	</View>
    )
}

const Video = ({url}) => {
    return(
	<MyWebview
	    fullWidth
	    html={`<iframe src=\"https://player.vimeo.com/video/${url.split('/')[3]}\" width=\"640\" height=\"360\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"></iframe>`} />)
}

const QNASection = ({res, content=false}) => {
    return (
	<View style={__styles.qna_container}>
	    <FlatList 
		data={res.mission_schedule.schedule_questions}
		scrollEnabled={false}
		ListHeaderComponentStyle={{paddingBottom:10}}
		ListHeaderComponent={
		<MyText 
		    fontSize={16}
		    style={{fontFamily: fonts.bold}}
		    color={colors.primary}>
		    {content ? "Content Question" : "Interactive Learning Experience"}
		</MyText>
		}
		showsVerticalScrollIndicator={false}
		ItemSeparatorComponent={<View style={{height:10}}/>}
		keyExtraction={(_,index)=> index.toString()}
		renderItem={({item})=> content == item.show_in_graph &&
		    <>
			<MyText style={__styles.qna_ques_text}>
			{extractTextFromHtml(item.question_statement)}
			</MyText>
			<View style={{height:10}}/>
			<Options list={item.options} />
		    {item.question_type=="scaling" && <Scaling />}
		    </>
		}
	    />
	</View>
	)
}
const Scaling = ({max,min}) => {
    return (
	<View>
	    <FlatList 
		data={[...Array(10)]}
		keyExtraction={(_,index)=> index.toString()}
		horizontal
		renderItem={({_})=>
		    <MyCheckBox circle/>
		}
	    />
	</View>
    )
}

const Options = ({list}) =>{
    return (
	<FlatList 
	    data={list}
	    scrollEnabled={false}
	    showsVerticalScrollIndicator={false}
	    ItemSeparatorComponent={<View style={{height:5}}/>}
	    keyExtraction={(_,index)=> index.toString()}
	    renderItem={({item})=>
		<View style={__styles.radio_container}>	
		    <MyCheckBox circle color={colors.border}/>
		    <View style={{width:10}}/>
		    <MyText>
			{item} 
		    </MyText>
		</View>	
	    }
	/>
    )
}


const __styles=StyleSheet.create({
    container:{
	flex:1
    },
    schedule_container:{
	padding:15,
	borderWidth:1,
	borderColor: colors.border,
	borderRadius:10
    },
    sched_img_container:{
	flexDirection:"row",
	justifyContent:"space-between"
    },
    schedule_img:{
	width:25,
	height:25,
    },
    badge:{
	flexDirection:'row',
	alignItems:"center",
	backgroundColor:colors.secondarySelect,
	paddingHorizontal:10,
	paddingVertical:6,
	borderRadius:30,
	opacity:0.8
    },
    qna_container:{
	padding:10,
	backgroundColor:colors.secondary,
	borderRadius:10,
    },
    qna_ques_text:{
	flex:1,
	padding:10,
	backgroundColor:colors.secondaryVariant,
	borderRadius:10,
    },
    radio_container:{
	flexDirection:"row"
    }
})


export default Schedule
