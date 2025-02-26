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
import {GET_COMMENT_REVIEW, APPROVE_COMMENT_REVIEW, DELETE_COMMNET_REVIEW} from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { useState, useEffect, useRef } from "react"
import {Text, FlatList, View, TouchableOpacity} from "react-native"
import moment from 'moment'

const ReviewComments = ({navigation}) => {
    const { token } = useSelector(selectUser);
    const [result, setResult] = useState()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefresh] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showFooterLoader,setShowFooterLoader] = useState(false)
    const [page, setPage] =useState(0)
    const getFeeds = async ({load=false, pageCount}) => {
	setLoading(load)
	const res = await GET_COMMENT_REVIEW({token, navigation, limit:10, page:pageCount})
	if(res.code == 200){
	    if(pageCount==0) setResult(res?.comments)
	    else setResult([...result, ...res?.comments])
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
	getFeeds({load:false, pageCount:0})
    }
    const ref = useRef(null)
    const closeModal = () => setShowModal(false)
    const handleClick = (id)=> ref.current.openModal?.(id);
    const modalTitle = [{title:"Approved", key:"ap"},{title:"Delete", key: "del"}]
    const handleSelect=(opt, id)=> {
	if(opt.key=="ap")  APPROVE_COMMENT_REVIEW({token, navigation, id}).then(()=> setResult(result.filter(el=> el._id !== id && el))) 
	else if(opt.key=="del") DELETE_COMMNET_REVIEW({token, navigation, id}).then(()=> setResult(result.filter(el=> el._id !== id && el))) 
    }
    const handleEndReach = () => {
	if(!loading){
	    setShowFooterLoader(true)
	    setPage(page+1)
	    getFeeds({load:false})
	}
    } 
    return (
	<RootView hideBackBottomButton title="Review Comments">
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
		    renderPosts({feed:item,index, handleClick:()=>handleClick(item._id) })}
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
		<UserImage size={30} image={feed.user_info_action_for.profile_image}/>
		<View style={{width:10}}/>
		<MyText
		    fontSize={14}
		    type='bold'>{feed?.user_info_action_for?.name}</MyText>
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
	    <StatView title="Description" value={feed?.message}/>
	    <StatView title="Created For" value={feed?.feed_created_for === "general" ? "The Source Code": feed?.feed_created_for}/>
	    <StatView
		title="Created At"
		value={moment(new Date(feed?.createdAt))
		    .format(dateTimeFormat.conversion)}
		/>
	    <StatView title="Reason" value={feed?.review_info.reason}/>
	    <View style={{height:10}}/>
	    <TouchableOpacity activeOpacity={0.5} style={{alignItems:"flex-end"}}>
		<MyText fontSize={12} color={colors.primary}>View more ...</MyText>
	    </TouchableOpacity>
	</View>
    )
}
export default ReviewComments
