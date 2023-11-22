import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, SafeAreaView, TouchableHighlight, Pressable, Dimensions, Platform, Text } from 'react-native'
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import MyInputs from '../../../components/MyInputs';
import { icons } from '../../../utilities/icons';
import Modal from 'react-native-modal'
import routes from '../../../navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { CHANGE_DEPARTMENT_OF_TICKET, SUPPORT_TCIKETS_LIST_BY_TYPE } from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import { S3_URL } from '../../../utilities/constants';
import moment from 'moment';
import EmptyView from '../../../components/EmptyView';
import MyImage from '../../../components/MyImage';
import ImageZoomer from '../../../components/ImageZoomer';

const ListView = ({ isLoading, list, active, route, departmentList, token, refresh, user }) => {
  const [isOptionModalShown, setIsOptionModal] = useState({ isVisible: false, for: "" })
  const [isDepartmentModalShown, setIsDepartmentModalShown] = useState(false);
  const navigation = useNavigation();

  //? Actions functions

  const ticketActions = (option) => {
    console.log(option, "option")
    if (option?.key == "change-department") {
      console.log(isOptionModalShown, "isOptionModalShown")
      setIsOptionModal({ ...isOptionModalShown, isVisible: false, })
      setTimeout(() => {
        setIsDepartmentModalShown(true)
      }, 1000);
    } else {
      setIsOptionModal({ isVisible: false, for: "" })
    }
  }

  const updateDepartment = async (department) => {
    setIsDepartmentModalShown(false)
    let res = await CHANGE_DEPARTMENT_OF_TICKET({
      ticketId: isOptionModalShown.for?._id,
      navigation, token,
      body: {
        department: department?._id
      }
    });
    setIsOptionModal({ ...isOptionModalShown, for: "" })
    if (res.code == 200) {
      refresh?.()
    }
  }

  //? Modals

  const optionsModal = () => {
    return (
      <Modal
        isVisible={isOptionModalShown.isVisible}
        onBackdropPress={() => setIsOptionModal({ isVisible: false, for: "" })}
        onBackButtonPress={() => setIsOptionModal({ isVisible: false, for: "" })}
        useNativeDriverForBackdrop={true}
        style={{ margin: 0 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, marginTop: "auto", borderTopLeftRadius: 10, borderTopRightRadius: 10, }} >
          <FlatList
            data={options}
            scrollEnabled={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item, index }) => {
              if (item.routes[route]) {
                return (
                  <TouchableHighlight
                    onPress={() => ticketActions(item)}
                    underlayColor={colors.secondary} >
                    <View style={{ paddingVertical: 10, flexDirection: "row", alignItems: "center", paddingLeft: 20 }}>
                      {typeof (item.icon) == "function" ? item.icon() :
                        <Image source={item.icon} style={{ height: 25, width: 25, tintColor: colors.primary }} />}
                      <View style={{ marginLeft: 10 }}>
                        <MyText fontSize={16} >{item.title}</MyText>
                      </View>
                    </View>
                  </TouchableHighlight>
                )
              } else return null
            }
            }
          />
        </SafeAreaView>
      </Modal>)
  }

  const departmentModal = () => {
    return (
      <Modal
        isVisible={isDepartmentModalShown}
        onBackdropPress={() => setIsDepartmentModalShown(false)}
        onBackButtonPress={() => setIsDepartmentModalShown(false)}
        useNativeDriverForBackdrop={true}
        style={{ margin: 0 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, marginTop: "auto", borderTopLeftRadius: 10, borderTopRightRadius: 10, maxHeight: 500 }} >
          <FlatList
            data={departmentList}
            contentContainerStyle={{ paddingVertical: 10 }}
            indicatorStyle='white'
            renderItem={({ item, index }) => {
              return (
                <TouchableHighlight
                  onPress={() => updateDepartment(item)}
                  underlayColor={colors.secondary} >
                  <View style={{ paddingVertical: 10, paddingLeft: 20, backgroundColor: isOptionModalShown.for?.department?._id == item?._id ? "#FFFFFF11" : colors.transparent }}>
                    <MyText fontSize={16} >{item?.title}</MyText>
                  </View>
                </TouchableHighlight>
              )
            }
            }
          />
        </SafeAreaView>
      </Modal>)
  }

  //? list

  const renderList = ({ item, index }) => {
    return (
      <Pressable
        underlayColor={colors.secondary}
        delayLongPress={Platform.OS == "android" ? 1500 : undefined}
        onLongPress={() => setIsOptionModal({ isVisible: true, for: item })}
        onPress={() => {
          navigation.navigate(routes.supportTicketDeatail, {
            ticket: item
          })
        }}
        style={{ padding: 20, flexDirection: "row" }} >
        <>
          <View style={{ width: 35, height: 35, borderRadius: 35 / 2, overflow: "hidden", borderWidth: 1 / 2, borderColor: colors.white }}>
            <MyImage
              source={!!item?.member?.profile_image ? { uri: S3_URL + item?.member?.profile_image } : icons.dummyUser}
              style={{ height: '100%', width: "100%" }} />
          </View>
          <View style={{ flex: 1, marginHorizontal: 10, }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <MyText fontSize={14} type='medium' >{!!item?.member?.first_name ? item?.member?.first_name + " " + item?.member?.last_name : "N/A"}</MyText>
              <MyText fontSize={10} type='light'>{moment(item.last_action_date).fromNow()}
              </MyText>

            </View>
            <MyText style={{ marginTop: 3 }} fontSize={12} >{item?.subject}</MyText>
            <MyText style={{ marginTop: 3 }} numberOfLines={1} color={colors.lightText} fontSize={12} >
              {item?.description.slice(0, 30)}
            </MyText>
          </View>
        </>
      </Pressable>)
  }

  //? main

  return (
    <View style={{ flex: 1 }}>
      {optionsModal()}
      {departmentModal()}
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
    </View>
  );
};

export default ListView;

const options = [{
  title: "Detail",
  icon: icons.threeLinesMenu,
  routes: {
    waiting: true,
    answered: true,
    need_fixes: true,
    needs_to_attention: true,
    reminder: true,
    ready_to_close: true,
    solved: true,
    trash: true,
  }
},
{
  title: "Internal Notes",
  icon: icons.threeLinesMenu,
  routes: {
    waiting: true,
    answered: true,
    need_fixes: true,
    needs_to_attention: true,
    reminder: true,
    ready_to_close: true,
    solved: false,
    trash: false,
  }
},
{
  title: "Mark Resolve",
  icon: icons.tick,
  routes: {
    waiting: true,
    answered: true,
    need_fixes: false,
    needs_to_attention: false,
    reminder: false,
    ready_to_close: true,
    solved: false,
    trash: false,
  }
},
{
  title: "Attended",
  icon: icons.refresh,
  routes: {
    waiting: false,
    answered: false,
    need_fixes: false,
    needs_to_attention: true,
    reminder: false,
    ready_to_close: false,
    solved: false,
    trash: false,
  }
},
{
  title: "Fixed",
  icon: icons.refresh,
  routes: {
    waiting: false,
    answered: false,
    need_fixes: true,
    needs_to_attention: false,
    reminder: false,
    ready_to_close: false,
    solved: false,
    trash: false,
  }
},
{
  title: "Change Department",
  key: "change-department",
  icon: icons.refresh,
  routes: {
    waiting: true,
    answered: true,
    need_fixes: true,
    needs_to_attention: true,
    reminder: false,
    ready_to_close: false,
    solved: false,
    trash: false,
  }
},
{
  title: "Move To Needs Fixes",
  icon: icons.refresh,
  routes: {
    waiting: true,
    answered: true,
    need_fixes: false,
    needs_to_attention: false,
    reminder: false,
    ready_to_close: false,
    solved: false,
    trash: false,
  }
},
{
  title: "Move to Needs Attention",
  icon: icons.refresh,
  routes: {
    waiting: true,
    answered: true,
    need_fixes: false,
    needs_to_attention: false,
    reminder: false,
    ready_to_close: false,
    solved: false,
    trash: false,
  }
},
{
  title: "Send Reminder",
  icon: icons.send,
  routes: {
    waiting: false,
    answered: false,
    need_fixes: false,
    needs_to_attention: false,
    reminder: true,
    ready_to_close: false,
    solved: false,
    trash: false,
  }
}]

