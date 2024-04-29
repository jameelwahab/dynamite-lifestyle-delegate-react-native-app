import { View, Text, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import Ratinglist from './components/Ratinglist'
import { colors } from '../../utilities/colors'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import MemberView from '../../components/MemberView'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { selectTimeZone } from '../../redux/reducers/timezoneSlice'
import { dateTimeFormat } from '../../utilities/constants'
import { convertTimezone } from '../../functions/convertTime'
import { icons } from '../../utilities/icons'
import { MenuButton } from '../../components/MyButton'
import OptionModal from '../../components/OptionModal'
import routes from '../../navigation/routes'

const AssessmentDetail = ({ navigation, route }) => {
  const { item } = route?.params;
  const layout = useWindowDimensions();
  const timezone = useSelector(selectTimeZone)
  const [myTabs] = useState(tabs);
  const [index, setIndex] = useState(0);
  const [optionModalVisibility, setOptionModalVisibility] = useState(false)


  const onSelected = (opt) => {
    setOptionModalVisibility(false);
    if (opt.key == "notes") {
      navigation.navigate(routes.assessmentNotesList, {
        type: myTabs[index].key,
        assessmentId: item?._id
      })
    }
  }

  const renderTabBar = props => (

    <TabBar
      {...props}
      scrollEnabled={true}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{
        backgroundColor: colors.darkSecondary,
        shadowColor: colors.lightText2,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
      }}
      tabStyle={{ width: "auto", }}
      renderLabel={({ route, focused, color }) => {
        return (
          <MyText color={focused ? colors.primary : colors.lightText} type='medium' >
            {route.title}
          </MyText>
        )
      }}
      gap={10}
    />
  );

  const renderScene = ({ route, }) => {
    switch (route.key) {
      case 'thought':
        return <Ratinglist list={item?.assessment_results?.thought_result} />
      case 'feeling':
        return <Ratinglist list={item?.assessment_results?.feeling_result} />
      case 'action':
        return <Ratinglist list={item?.assessment_results?.action_result} />
    }
  }

  const topView = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <MyText isHeading>Assessment History</MyText>
        </View>
        <MenuButton onPress={() => setOptionModalVisibility(true)} />
      </View>
    )
  }

  return (
    <RootView titleView={topView}>
      <MemberView
        member={item?.member}
      />
      {!!item?.activity_date_time &&
        <View style={{ marginTop: 10 }}>
          <MyText color={colors.primary} type='bold' >{"Completed Date: "}
            <MyText type='medium'>({convertTimezone(item?.activity_date_time, timezone).format(dateTimeFormat.dateTime)})</MyText>
          </MyText>
        </View>}
      <View style={{ flex: 1, marginHorizontal: -10 }}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes: myTabs }}
          renderScene={renderScene}
          onIndexChange={(index) => {
            setIndex(index);
          }}
          initialLayout={{ width: layout.width }}
        />
      </View>

      <OptionModal
        optionList={optionsList}
        isVisible={optionModalVisibility}
        onSelected={onSelected}
        closeModal={() => setOptionModalVisibility(false)}
      />
    </RootView>
  )
}

export default AssessmentDetail

const optionsList = [{
  title: "Client Notes",
  key: "notes",
  icon: icons.notes
},
]

const tabs = [
  { key: 'thought', title: 'THOUGHTS', index: 0 },
  { key: 'feeling', title: 'FEELINGS', index: 1 },
  { key: 'action', title: 'ACTIONS', index: 2 },
]