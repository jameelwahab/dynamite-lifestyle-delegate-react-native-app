import MyImage from "./MyImage"
import MyText from "./MyText"
import {View} from "react-native"
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/reducers/userSlice'

const ImgAndTxt =({img,txt}) => {
		const { S3_URL } = useSelector(selectUser)
				return (
						<View style={{flexDirection:"row", alignItems:'center'}}>
								<MyImage source={{uri: S3_URL + img }} style={{width:17, height:17,marginRight:12}}/>
								<MyText>{txt}</MyText>
						</View>
				)
}

export default ImgAndTxt;
