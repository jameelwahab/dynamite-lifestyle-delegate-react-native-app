import RootView from "../../components/RootView"
import MyLoader from "../../components/MyLoader"
import { useState, useEffect } from "react" 
import { GET_PAYMENT_LIST } from "../../DAL"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'

const TemplatePaymentPlan = ({ navigation, route}) => {
		const { item } = route.params
		const { token } = useSelector(selectUser);
		const [list, setList] = useState()
		const [loader, setLoader] = useState(false);
		const [searching, setSearching] = useState(false);
		const [refreshing, setRefresh] = useState(false);

		const getList = async ()=> {
				const result = await GET_PAYMENT_LIST({token, navigation, id:item?._id})
				if(result.code == 200){
						setList(result.payment_plan)
						setLoader(false)
						setSearching(false)
						setRefresh(false)
				}else{
						setLoader(false)
						setSearching(false)
						setRefresh(false)
				}
		}

		useEffect(()=>{
				setLoader(true)
				getList()
		},[])

		return (
				<RootView title="Payment Plans">
						<MyLoader enable={loader} />
				</RootView>
		)
}

export default TemplatePaymentPlan
