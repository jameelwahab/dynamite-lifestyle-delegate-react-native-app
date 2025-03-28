import RootView from "../../components/RootView"
import { GET_AFFILAITE_LINK } from "../../DAL"
import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList, TouchableOpacity, Pressable } from "react-native"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import MyLoader from "../../components/MyLoader"
import MyText from "../../components/MyText"
import MyRefreshControl from "../../components/MyRefreshControl"
import StatView from "../../components/StatView"
import {colors} from "../../utilities/colors"
import {icons} from "../../utilities/icons"
import {MyClearButton} from "../../components/MyButton"
import copyText from "../../functions/copyText"
import TitleView from "../../components/TitleView"
import openUrl from "../../functions/openUrl"



const Affiliates = ({navigation, route}) =>{

		const { token, user } = useSelector(selectUser);
		const [list, setList] =useState([])
		const [loading, setLoading] = useState(false)
		const [refreshing, setRefreshing] = useState(false)

		const getList = async () => {
				const res = await GET_AFFILAITE_LINK({token,navigation})
				setLoading(false)
				setRefreshing(false)
				if(res.code==200) {
						setList(res?.data)
				}
		}

		console.log()

		useEffect(()=>{
				setLoading(true)
				getList()
		},[])

		const renderView = (item, index)=>{
				const affiliateLink = `${item.url}?affliate_url_name=${user.affiliate_url_name}`
				const copy= () => copyText(affiliateLink, "Url copied to clipboard")

				const copyLinkView = ()=> {
						return (
								<TouchableOpacity
										onPress={copy}
										style={{width:100,flexDirection:"row", alignItems:"center"}}>
										{icons.copy()}
										<MyText
												underlined
												color={colors.primary}
												style={{fontStyle:"italic", marginLeft:10}}
												>Copy Url</MyText>
								</TouchableOpacity>
						) }

				const openPreview = ()=> {
						return (
								<TouchableOpacity
										onPress={()=>openUrl(affiliateLink)}
										style={{width:100,flexDirection:"row", alignItems:"center"}}>
										{icons.goto()}
								<MyText 
										 fontSize={13} style={{ fontStyle:"italic", marginLeft:10 }} color={colors.primary} type='medium' >{"Preview"}</MyText>
								</TouchableOpacity>
						) }

				return(
						<View style={__styles.itemView}>
								<MyText>{index + 1})</MyText>
								<StatView 
										title={"Name"}
										value={item?.name}
										/>
								<StatView 
										title={"Type"}
										value={item?.type}
										/>
								<StatView 
										title={"Copy Link"}
										value={"Yoko so"}
										view={copyLinkView}
										/>
								<StatView 
										title={"URL"}
										view={openPreview}
										/>
						</View>
				)
		}

		const onRefresh = () => {
				setRefreshing(true)
				getList()
		}

		const titleView = () => {
				return (
						<TitleView  customStyle={{marginHorizontal:0}} title="Campaigns URL" original hideBackBottomButton />
				)
		}

		return (
				<RootView titleView={titleView} hideBackBottomButton>
						<FlatList 
								data={list}
								contentContainerStyle={{paddingBottom:40}}
								showsVerticalScrollIndicator={false}
								refreshControl={<MyRefreshControl
										refreshing={refreshing}
										onRefresh={onRefresh}
								/>}
								KeyExtractor={item=> item?._id}
								renderItem={({item, index})=> renderView(item,index)}
						/>
						<MyLoader enable={loading}/>
				</RootView>
		)
}

const __styles = StyleSheet.create({
		itemView:{
				backgroundColor: colors.secondary,
				borderRadius: 10,
				padding: 10,
				marginTop: 10
		}
})

export default Affiliates

