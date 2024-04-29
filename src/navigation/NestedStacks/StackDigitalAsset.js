
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import LinksList from '../../screens/Links/LinksList'
import CategoryList from '../../screens/DigitalAssets/CategoryList'
import ListByCategory from '../../screens/DigitalAssets/ListByCategory'





const DigitalAssetsStack = createNativeStackNavigator()

const StackDigitalAssets = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <DigitalAssetsStack.Navigator
        screenOptions={{ headerShown: false }}>
        <DigitalAssetsStack.Screen initialParams={route.params} name={routes.digitalAssetCategoryListScreen} component={CategoryList} />
        <DigitalAssetsStack.Screen name={routes.digitalAssetByCategoryScreen} component={ListByCategory} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <DigitalAssetsStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </DigitalAssetsStack.Navigator>
    </View>
  )
}
export default StackDigitalAssets