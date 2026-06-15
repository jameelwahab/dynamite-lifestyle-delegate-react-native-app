import {View, Pressable, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import MyTouchableInput from '../../../components/MyTouchableInput';
import {
  CREATE_NEW_BROADCAST_CHAT,
  POD_GROUPS_AND_MEMBERS,
  UPDATE_NEW_BROADCAST_CHAT,
} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import MyLoader from '../../../components/MyLoader';
import showToast from '../../../functions/showToast';
import MyInputs from '../../../components/MyInputs';
import {MyButton} from '../../../components/MyButton';
import OptionModal from '../../../components/OptionModal';
import MyChip from '../../../components/MyChip';
import OptionModalWithSearch from '../../../components/OptionModalWithSearch';
import routes from '../../../navigation/routes';
import {STRINGS} from '../../../utilities/strings';

const StartNewChat = ({navigation, route}) => {
  const {resetCountToZero, refresh} = route?.params;
  const broadcast = route?.params?.broadcast;

  const {token, user} = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState(
    !!broadcast?.broadcast_title ? broadcast?.broadcast_title : '',
  );
  const [selectedGrps, setSelectedGrps] = useState(
    !!broadcast?.group ? broadcast?.group : [],
  );
  const [selectedMembers, setSelectedMembers] = useState(
    !!broadcast?.member ? broadcast?.member : [],
  );
  const [grpList, setGrpList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [isGrpModalVisible, setIsGrpModalVisible] = useState(false);
  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);

  useEffect(() => {
    getMembersAndGroupsFromServer();
  }, []);

  const filterList = (list, selectedArr) => {
    return list.slice().filter(x => {
      return !selectedArr.some(y => y?._id == x?._id);
    });
  };

  const getMembersAndGroupsFromServer = async () => {
    let res = await POD_GROUPS_AND_MEMBERS({navigation, token});
    if (res.code == 200) {
      setMembersList(res?.members);
      setGrpList(res?.groups);
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  const onSavePress = () => {
    if (title.trim() == '') {
      showToast({
        title: STRINGS.BROADCAST_START_NEW_CHAT.alert,
        body: STRINGS.BROADCAST_START_NEW_CHAT.pleaseEnterTitle,
        type: 'info',
      });
    } else if (selectedGrps.length == 0 && selectedMembers.length == 0) {
      showToast({
        title: STRINGS.BROADCAST_START_NEW_CHAT.alert,
        body: STRINGS.BROADCAST_START_NEW_CHAT.pleaseSelectAtleastOne,
        type: 'info',
      });
    } else {
      setLoader(true);
      if (!!broadcast) {
        updateBroadcastChat();
      } else {
        addBroadcastChat();
      }
    }
  };
  const updateBroadcastChat = async () => {
    let res = await UPDATE_NEW_BROADCAST_CHAT({
      navigation,
      token,
      body: {
        broadcast_title: title.trim(),
        group: selectedGrps,
        member: selectedMembers,
      },
      chatId: broadcast?._id,
    });
    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
      route?.params?.setChatName?.(res?.broadcast?.broadcast_title);
      navigation.navigate(routes.broadcastDetail, {
        chatId: broadcast?._id,
      });
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  const addBroadcastChat = async () => {
    let res = await CREATE_NEW_BROADCAST_CHAT({
      navigation,
      token,
      body: {
        broadcast_title: title.trim(),
        group: selectedGrps,
        member: selectedMembers,
      },
    });
    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
      route?.params?.refresh?.();
      navigation.navigate(routes.broadcastChatMessageList, {
        chatName: res?.broadcast?.broadcast_title,
        chatId: res?.broadcast?._id,
      });
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  return (
    <RootView
      hideChatIcon
      title={
        !!broadcast
          ? STRINGS.BROADCAST_START_NEW_CHAT.editBroadcast
          : STRINGS.BROADCAST_START_NEW_CHAT.newBroadcast
      }>
      <View style={__style.container}>
        <MyInputs
          label={STRINGS.BROADCAST_START_NEW_CHAT.titleLabel}
          value={title}
          onChangeText={text => setTitle(text)}
        />

        <MyTouchableInput
          label={STRINGS.BROADCAST_START_NEW_CHAT.groupLabel}
          iconOnPress={() => setIsGrpModalVisible(true)}
          view={() => (
            <Pressable
              onPress={() => setIsGrpModalVisible(true)}
              style={__style.chipContainer}>
              {selectedGrps.map((grp, index) => (
                <MyChip
                  label={'grp' + index}
                  title={grp.title}
                  onPress={() => {
                    selectedGrps.splice(index, 1);
                    setSelectedGrps([...selectedGrps]);
                  }}
                />
              ))}
            </Pressable>
          )}
        />

        <MyTouchableInput
          label={STRINGS.BROADCAST_START_NEW_CHAT.memberLabel}
          iconOnPress={() => setIsMemberModalVisible(true)}
          view={() => (
            <Pressable
              onPress={() => setIsMemberModalVisible(true)}
              style={__style.chipContainer}>
              {selectedMembers.map((member, index) => (
                <MyChip
                  label={'membre' + index}
                  title={`${member.first_name} ${member.last_name} (${member?.email})`}
                  onPress={() => {
                    selectedMembers.splice(index, 1);
                    setSelectedMembers([...selectedMembers]);
                  }}
                />
              ))}
            </Pressable>
          )}
        />

        <MyButton
          title={STRINGS.BROADCAST_START_NEW_CHAT.save}
          onPress={onSavePress}
        />
      </View>

      <MyLoader enable={loader} />

      <OptionModal
        optionList={grpList}
        isVisible={isGrpModalVisible}
        closeModal={() => setIsGrpModalVisible(false)}
        checkSelected={item => !!selectedGrps.find(x => x._id === item._id)}
        multiple
        multipleLabel={STRINGS.BROADCAST_START_NEW_CHAT.groupsList}
        onSelected={item => {
          let index = selectedGrps.findIndex(x => x._id === item._id);
          if (index <= -1) {
            selectedGrps.push(item);
          } else {
            selectedGrps.splice(index, 1);
          }
          setSelectedGrps([...selectedGrps]);
        }}
      />

      <OptionModalWithSearch
        optionList={filterList(membersList, selectedMembers)}
        filterTheList={(list, searchText) => {
          let text = searchText.trim().toLowerCase();
          return list
            .slice()
            .filter(
              x =>
                x.first_name.toLowerCase().includes(text) ||
                x.last_name.toLowerCase().includes(text) ||
                x.email.toLowerCase().includes(text),
            );
        }}
        isVisible={isMemberModalVisible}
        closeModal={() => setIsMemberModalVisible(false)}
        renderText={({item: member}) => (
          <MyText>{`${member.first_name} ${member.last_name} (${member?.email})`}</MyText>
        )}
        onSelected={item => {
          selectedMembers.push(item);
          setSelectedMembers([...selectedMembers]);
          setIsMemberModalVisible(false);
        }}
        title={STRINGS.BROADCAST_START_NEW_CHAT.member}
      />
    </RootView>
  );
};

const __style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    paddingVertical: 5,
  },
});

export default StartNewChat;
let noneObj = {
  _id: '',
  title: 'None',
};

const tabs = [
  {key: 'online', title: 'Online', index: 0},
  {key: 'offline', title: 'Offline', index: 1},
];
