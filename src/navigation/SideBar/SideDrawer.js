import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SideBar from '.';
import {colors} from '../../utilities/colors';
import {ChildComponents, ParentComponents} from './List';
import {useSelector} from 'react-redux';
import {selectNavbar} from '../../redux/reducers/navbarSlice';
import {ModuleListByClient} from './ModuleListByClient';

const Drawer = createDrawerNavigator();

const SideDrawer = () => {
  const {navbar} = useSelector(selectNavbar);

  return (
    <Drawer.Navigator
      backBehavior="firstRoute"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {backgroundColor: colors.secondary},
        drawerActiveTintColor: colors.primary,
        unmountOnBlur: true,
      }}
      initialRouteName={ParentComponents[navbar[0]?.value]?.key}
      // initialRouteName={routes.missionNavigator}
      drawerContent={props => <SideBar {...props} />}>
      {Object.keys(ParentComponents).map(x => {
        if (!!ParentComponents[x].key && !!ModuleListByClient[x]) {
          return (
            <Drawer.Screen
              key={ParentComponents[x].key}
              name={ParentComponents[x].key}
              component={ParentComponents[x].component}
              initialParams={ParentComponents[x].params}
            />
          );
        }
      })}
      {Object.keys(ChildComponents).map(x => {
        if (!!ChildComponents[x].key) {
          return (
            <Drawer.Screen
              key={ChildComponents[x].key}
              name={ChildComponents[x].key}
              component={ChildComponents[x].component}
              initialParams={ChildComponents[x].params}
            />
          );
        }
      })}
    </Drawer.Navigator>
  );
};

export default SideDrawer;
