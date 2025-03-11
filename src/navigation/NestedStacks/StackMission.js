import { View, Text } from "react-native"
import routes from "../routes"
import { colors } from '../../utilities/colors'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import Mission from "../../screens/Mission"
import List from "../../screens/Mission/List.js"
import Schedule from "../../screens/Mission/Schedule.js"
import Detail from "../../screens/Mission/Detail.js"
import Filter from "../../screens/Mission/Filter.js"
import FeedDetail from "../../screens/Feed/Detail"
import MemberList from "../../screens/Mission/MemberList"
import { defaultScreens } from "./defaultScreens"

const MissionStack = createNativeStackNavigator()

const StackMission = ({ route }) => {
	return (
		<View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
			<MissionStack.Navigator
				// initialRouteName={routes.missionSchedule}
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
					name={routes.missionFilter}
					component={Filter}
				/>
				<MissionStack.Screen
					initialParams={routes.params}
					name={routes.missionMemberList}
					component={MemberList}
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

				<MissionStack.Screen
					name={routes.feedDetailScreen}
					component={FeedDetail}
				/>

				{/* ye extra screens hoti hain jo har jaga se call ki jaye */}

				{defaultScreens.map((x, i) => (
					<MissionStack.Screen key={x.name} name={x.name} component={x.component} />
				))}

			</MissionStack.Navigator>
		</View>
	)
}

export default StackMission
