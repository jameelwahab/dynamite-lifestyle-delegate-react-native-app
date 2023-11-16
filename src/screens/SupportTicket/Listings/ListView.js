import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, SafeAreaView, TouchableHighlight, Pressable } from 'react-native'
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import MyInputs from '../../../components/MyInputs';
import { icons } from '../../../utilities/icons';
import Modal from 'react-native-modal'
import routes from '../../../navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { SUPPORT_TCIKETS_LIST_BY_TYPE } from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import { S3_URL } from '../../../utilities/constants';
import moment from 'moment';
import EmptyView from '../../../components/EmptyView';

const ListView = ({ isLoading, list, active, }) => {
  const [isOptionModalShown, setIsOptionModalShown] = useState(false)
  const navigation = useNavigation();


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
  
  const renderList = ({ item, index }) => {
    return (
      <Pressable
        underlayColor={colors.secondary}
        onLongPress={() => setIsOptionModalShown(true)}
        onPress={() => {
          console.log(navigation.getParent(), "parent")
          navigation.navigate(routes.supportTicketDeatail, {
            ticket: item
          })
        }
        }

        style={{ padding: 20, flexDirection: "row" }} >
        <>
          <View style={{ width: 35, height: 35, borderRadius: 35 / 2, overflow: "hidden" }}>
            <Image
              source={!!item?.member?.profile_image ? { uri: S3_URL + item?.member?.profile_image } : icons.dummyUser}
              style={{ height: '100%', width: "100%" }} />
          </View>
          <View style={{ flex: 1, marginHorizontal: 10, }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <MyText fontSize={14} type='medium' >{item?.member?.first_name + " " + item?.member?.last_name}</MyText>
              <MyText fontSize={10} type='light' >{
                moment(item.last_action_date).fromNow().includes("days") ?
                  moment(item.last_action_date).format("DD MMM YY") :
                  moment(item.last_action_date).fromNow()}
              </MyText>
            </View>
            <MyText style={{ marginTop: 3 }} fontSize={12} >{item?.subject}</MyText>
            <MyText style={{ marginTop: 3 }} numberOfLines={1} color={colors.lightText} fontSize={12} >{item?.description}</MyText>
          </View>
        </>
      </Pressable>)
  }

  return (
    <>
      {optionsModal()}
      <View style={{ flex: 1, marginHorizontal: -10, borderRadius: 20 }}>

        <FlatList
          data={list}
          indicatorStyle="white"
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderList}
          ListEmptyComponent={!isLoading && active && <EmptyView />}
        />
      </View>
      <MyLoader enable={isLoading} />
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