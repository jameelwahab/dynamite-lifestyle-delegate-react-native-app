import { View,Text } from "react-native"
import routes from "../routes"
import { colors } from '../../utilities/colors'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import { defaultScreens } from "./defaultScreens"
import Updates from "../../screens/Updates"
import UpdatesFilter from "../../screens/Updates/UpdatesFilter"

const UpdatesStack = createNativeStackNavigator();

const StackUpdates = ({ route }) => {
		return (
				<View style={{flex:1, backgroundColor: colors.darkSecondary }}>
						<UpdatesStack.Navigator 
								screenOptions={{headerShown: false}}>
								
								<UpdatesStack.Screen
										name={routes.updatesMain}
										component={Updates}
										initialParams={routes.params}
										/>

								<UpdatesStack.Screen
										name={routes.updatesFilter}
										component={UpdatesFilter}
										initialParams={routes.params}
										/>
				
								{defaultScreens.map((x, i) => (
										<UpdatesStack.Screen key={x.name} name={x.name} component={x.component} />
								))}

						</UpdatesStack.Navigator>
				</View>
		)
}

export default StackUpdates
