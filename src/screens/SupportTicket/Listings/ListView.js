import React, { useState } from 'react';
import { View, FlatList, Image, SafeAreaView, TouchableHighlight } from 'react-native'
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import MyInputs from '../../../components/MyInputs';
import { icons } from '../../../utilities/icons';
import Modal from 'react-native-modal'
import routes from '../../../navigation/routes';
import { useNavigation } from '@react-navigation/native';

const ListView = (props) => {
  const [isOptionModalShown, setIsOptionModalShown] = useState(false)
  const navigation = useNavigation()

  const optionsModal = () => {
    return (
      <Modal
        isVisible={isOptionModalShown}
        onBackdropPress={() => setIsOptionModalShown(false)}
        onBackButtonPress={() => setIsOptionModalShown(false)}
        useNativeDriverForBackdrop={true}
        style={{ margin: 0 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, marginTop: "auto", borderTopLeftRadius: 10, borderTopRightRadius: 10, }} >
          <FlatList
            data={options}
            scrollEnabled={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item, index }) => (
              <TouchableHighlight
                onPress={() => setIsOptionModalShown(false)}
                underlayColor={colors.secondary} >
                <View style={{ paddingVertical: 10, flexDirection: "row", alignItems: "center", paddingLeft: 20 }}>
                  {typeof (item.icon) == "function" ? item.icon() :
                    <Image source={item.icon} style={{ height: 25, width: 25, tintColor: colors.primary }} />}
                  <View style={{ marginLeft: 10 }}>
                    <MyText fontSize={16} >{item.title}</MyText>
                  </View>
                </View>
              </TouchableHighlight>
            )}
          />
        </SafeAreaView>
      </Modal>)
  }

  return (
    <>
      {optionsModal()}
      <View style={{ flex: 1, marginHorizontal: -10, borderRadius: 20 }}>

        <FlatList
          data={data}
          indicatorStyle="white"
          renderItem={({ item, index }) => {
            return (
              <TouchableHighlight
                underlayColor={colors.secondary}
                onLongPress={() => setIsOptionModalShown(true)}
                onPress={() =>
                  navigation.navigate(routes.supportTicketDeatail, {
                    ticket: item
                  })}
                style={{ padding: 20, flexDirection: "row" }} >
                <>
                  <View style={{ width: 35, height: 35, borderRadius: 35 / 2, overflow: "hidden" }}>
                    <Image
                      source={!!item?.image ? { uri: item?.image } : icons.dummyUser}
                      style={{ height: '100%', width: "100%" }} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 10, }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <MyText fontSize={14} type='medium' >{item.name}</MyText>
                      <MyText fontSize={10} type='light' >{item.responded}</MyText>
                    </View>
                    <MyText style={{ marginTop: 3 }} fontSize={12} >{item.subject}</MyText>
                    <MyText style={{ marginTop: 3 }} numberOfLines={1} color={colors.lightText} fontSize={12} >{item.describtion}</MyText>
                  </View>
                </>
              </TouchableHighlight>)
          }}
        />
      </View>
    </>
  );
};

export default ListView;

const options = [{
  title: "Detail",
  icon: icons.threeLinesMenu
},
{
  title: "Internal Notes",
  icon: icons.threeLinesMenu
},
{
  title: "Mark Resolve",
  icon: icons.tick
},
{
  title: "Attended",
  icon: icons.refresh
},
{
  title: "Fixed",
  icon: icons.refresh
},
{
  title: "Change Department",
  icon: icons.refresh
},
{
  title: "Move To Needs Fixes",
  icon: icons.refresh
},
{
  title: "Move to Needs Attention",
  icon: icons.refresh
},
{
  title: "Send Reminder",
  icon: icons.send
}]

const data = [
  {
    name: 'Matthew K. Noon',
    subject: 'I want to change my subscrption',
    describtion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    department: "test",
    created: "23 Apr",
    responded: "23 Apr",
  },

  {
    name: 'John H. Fair',
    subject: 'My Profile image is not showing even upadating it',
    describtion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    department: "test",
    created: "23 Sep",
    responded: "23 Sep",
    image: "https://picsum.photos/id/220/200/300"
  },



  {
    name: 'Christopher M. Moore',
    subject: 'My chat not working',
    describtion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    department: "test",
    created: "10 May",
    responded: "10 May",
    image: "https://picsum.photos/id/210/200/300"
  },


  {
    name: 'Travis E. Broadnax',
    subject: 'I bought programs but it shoing locked.',
    describtion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    department: "test",
    created: "10 May",
    responded: "10 May",
    image: "https://picsum.photos/id/280/200/300"
  },



  {
    name: 'John H. Fair',
    subject: 'My Profile image is not showing even upadating it',
    describtion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    department: "test",
    created: "23 Sep",
    responded: "23 Sep",
    image: "https://picsum.photos/id/190/200/300"
  },


  {
    name: 'Matthew K. Noon',
    subject: 'I want to chnage my subscrption',
    describtion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    department: "test",
    created: "23 Apr",
    responded: "23 Apr",
  },


  {
    name: 'Christopher M. Moore',
    subject: 'My chat not working',
    describtion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    department: "test",
    created: "10 May",
    responded: "10 May",
    image: "https://picsum.photos/id/890/200/300"
  },

]