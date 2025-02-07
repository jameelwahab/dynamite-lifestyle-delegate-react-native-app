import { View, Text } from "react-native"
import routes from "../routes"
import { colors } from '../../utilities/colors'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import Mission from "../../screens/Mission"
import List from "../../screens/Mission/List.js"
import Schedule from "../../screens/Mission/Schedule.js"
import Detail from "../../screens/Mission/Detail.js"

const MissionStack = createNativeStackNavigator()

const StackMission = ({ route }) => {
	return (
		<MissionStack.Navigator
		    initialRouteName={routes.missionSchedule}
			screenOptions={{ headerShown: false }}
		>
			<MissionStack.Screen
				initialParams={routes.params}
				name={routes.missionLevel}
				component={Mission}
			/>
			<MissionStack.Screen
				initialParams={routes.params}
				name={routes.missionList}
				component={List}
			/>
			<MissionStack.Screen
				initialParams={routes.params}
				name={routes.missionDetail}
				component={Detail}
			/>
			<MissionStack.Screen
				initialParams={routes.params}
				name={routes.missionSchedule}
				component={Schedule}
			/>
		</MissionStack.Navigator>
	)
}

export default StackMission
