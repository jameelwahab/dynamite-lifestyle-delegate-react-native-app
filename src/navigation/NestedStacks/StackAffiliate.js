import { View,Text } from "react-native"
import routes from "../routes"
import { colors } from '../../utilities/colors'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import { defaultScreens } from "./defaultScreens"
import Updates from "../../screens/Updates"
import UpdatesFilter from "../../screens/Updates/UpdatesFilter"
import Affiliates from "../../screens/Affiliates"

const AffiliateStack = createNativeStackNavigator();

const StackAffiliate = ({ route }) => {
		return (
				<View style={{flex:1, backgroundColor: colors.darkSecondary }}>
						<AffiliateStack.Navigator 
								screenOptions={{headerShown: false}}>
								
								<AffiliateStack.Screen
										name={routes.affiliateLinks}
										component={Affiliates}
										initialParams={routes.params}
										/>
				
								{defaultScreens.map((x, i) => (
										<AffiliateStack.Screen key={x.name} name={x.name} component={x.component} />
								))}

						</AffiliateStack.Navigator>
				</View>
		)
}

export default StackAffiliate
