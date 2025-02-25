import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import Modal from 'react-native-modal';
import MyLoader from '../../../components/MyLoader'
import EmptyView from '../../../components/EmptyView'
import UserImage from '../../../components/UserImage'
import StatView from '../../../components/StatView'
import OptionModal2 from '../../../components/OptionModal2'
import MyRefreshControl from '../../../components/MyRefreshControl'
import FooterLoader from '../../../components/FooterLoader'
import {colors} from "../../../utilities/colors"
import { dateTimeFormat } from "../../../utilities/constants"
import {GET_REVIEW_FEEDS} from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { useState, useEffect, useRef } from "react"
import {Text, FlatList, View, TouchableOpacity} from "react-native"
import moment from 'moment'

const ReviewFeeds = ({navigation, route}) => {
    const { token } = useSelector(selectUser);
    const [result, setResult] = useState()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefresh] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showFooterLoader,setShowFooterLoader] = useState(false)
    const [page, setPage] =useState(0)
    const getFeeds = async ({load=false, pageCount}) => {
	setLoading(load)
	const res = await GET_REVIEW_FEEDS({token, navigation, limit:5, page:pageCount})
	if(res.code == 200){
	    if(pageCount==0 || result.length===0) setResult(res?.feeds)
	    else setResult([...result, ...res?.feeds])
	    setLoading(false)
	    setRefresh(false)
	    setShowFooterLoader(false)
	}
	else{
	    setResult([])
	    setPage(0)
	    setLoading(false)
	    setRefresh(false)
	}
    }

    useEffect(()=>{
	setPage(0)
	getFeeds({load:true,pageCount:0})
    },[])

    const onRefresh = () => {
	setRefresh(true)
	getFeeds({load:false, pageCount:page+1})
    }
    const ref = useRef(null)
    const closeModal = () => setShowModal(false)
    const handleClick = ()=> ref.current.openModal?.(["Approved", "Disapprove"]);
    const modalTitle = [{title:"Approved", key:"ap"},{title:"Disapprove", key: "dis"}]
    const handleSelect=(opt)=> {
	if(opt.key=="ap") console.log("approved")
	else if(opt.key=="dis") console.log("disapproved")
    }
    const handleEndReach = () => {
	if(!loading){
	    setShowFooterLoader(true)
	    setPage(page+1)
	    getFeeds({load:false})
	}
    } 
    return (
	<RootView hideBackBottomButton title="Review Posts">
	    <OptionModal2
		ref={ref}
		onSelected={handleSelect}
		optionList={modalTitle}
		/>
	    <FlatList 
		data={result}
		showsVerticalScrollIndicator={false}
		ListEmptyComponent={!loading && <EmptyView />}
		ItemSeparatorComponent={<View style={{height:12}}/>}
		ListFooterComponent={!loading && <FooterLoader isVisible={showFooterLoader}/>}
		onEndReached={handleEndReach}
		refreshControl = {<MyRefreshControl 
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>}
		keyExtractor={(_,index)=> index.toString()}
		renderItem={({item,index})=> 
		    renderPosts({feed:item,index, handleClick})}
	    />
	    <MyLoader enable={loading}/>
	</RootView>
    )
}

const renderPosts = ({feed, index, handleClick}) => {
    return (
	<View style={{backgroundColor:colors.secondary, padding:10, borderRadius:10}}>
	    <View style={{flexDirection:"row", aligItems:"center", justifyContent:"space-between"}}>
		<View style={{flexDirection:"row", alignItems:'center'}}>
		<UserImage size={30} image={feed.action_info.profile_image}/>
		<View style={{width:10}}/>
		<MyText
		    fontSize={14}
		    type='bold'>{feed.action_info.name}</MyText>
		</View>
		<TouchableOpacity
		    onPress={handleClick}
		    activeOpacity={0.5} style={{backgroundColor:colors.border, width:24.5, height: 24.5,borderRadius:33, alignItems:"center", justifyContent:"center"}}>
		    {[...Array(3)].map((el,index)=> 
			<View key={index} style={{width:3, height:3, borderRadius:30, backgroundColor:colors.primary, marginTop:index== 0 ? 0 : 2.5}}/>
		    )}
		</TouchableOpacity>
	    </View>
	    <View style={{height:10}}/>
	    <StatView title="Description" value={feed?.description}/>
	    <StatView title="Created For" value={feed?.feed_created_for === "general" ? "The Source Code": feed?.feed_created_for}/>
	    <StatView
		title="Created At"
		value={moment(new Date(feed?.createdAt))
		    .format(dateTimeFormat.conversion)}
		/>
	    <StatView title="Appear by" value={feed?.feed_appear_by}/>
	    <StatView title="Reason" value={feed?.review_info.reason}/>
	</View>
    )
}



export default ReviewFeeds
