import {View, StyleSheet, Image, Pressable} from 'react-native';
import React from 'react';
import MyText from '../../../components/MyText';
import {icons} from '../../../utilities/icons';
import routes from '../../../navigation/routes';

const UserView = ({chatName, chatId, navigation, setChatName}) => {
  return (
    <View style={__style.userRootView}>
      <View>
        <Image
          source={icons.broadcast}
          style={{
            height: 40,
            width: 40,
          }}
        />
      </View>
      <Pressable
        onPress={() => {
          navigation.navigate(routes.broadcastDetail, {
            chatName,
            chatId,
            setChatName,
          });
        }}
        style={__style.userNameView}>
        <MyText type="medium" fontSize={16}>
          {chatName}
        </MyText>
        <View style={__style.infoIConView}>{icons.info('#775F30', 12)}</View>
      </Pressable>
    </View>
  );
};

export default UserView;

const __style = StyleSheet.create({
  userRootView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoIConView: {
    height: 18,
    width: 18,
    borderWidth: 1,
    borderColor: '#775F30',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18 / 2,
    marginLeft: 10,
  },
  userNameView: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastSeenView: {
    marginTop: 2,
  },
  status: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    position: 'absolute',
    right: -5,
    bottom: 0,
  },
});
