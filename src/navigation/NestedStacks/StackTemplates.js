import { View, Text } from "react-native";
import routes from "../routes";
import { colors } from '../../utilities/colors';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { defaultScreens } from "./defaultScreens";
import Templates from "../../screens/Templates"

const TemplatesStack  = createNativeStackNavigator();

const StackTemplates = ({ route }) => {
		return (
				<View style={{flex:1, backgroundColor: colors.darkSecondary }}>
						<TemplatesStack.Navigator 
								screenOptions={{headerShown: false}}>
								<TemplatesStack.Screen
										name={routes.templatesMain}
								 		component={Templates}
								 		initialParams={route.params}
								 		/>
						
				
								{defaultScreens.map((x, i) => (
										<TemplatesStack.Screen key={x.name} name={x.name} component={x.component} />
								))}

						</TemplatesStack.Navigator>
				</View>
		)
}

export default StackTemplates;
