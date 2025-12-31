import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import MyText from '../../../components/MyText';
import {colors} from '../../../utilities/colors';
import routes from '../../../navigation/routes';

export const TicketCountView = ({item, navigation}) => {
  const ticketCount = item?.tickets.length || 0;
  const handlePress = () => {
    if (ticketCount > 0) {
      navigation.navigate(routes.memberTickets, {
        transactionId: item?._id,
        memberId: item?.member_id || item?.user_id,
        ticketCount: ticketCount,
      });
    }
  };

  if (ticketCount === 0) {
    return (
      <MyText fontSize={12} type="medium">
        0
      </MyText>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.ticketButton}
      hitSlop={{left: 5, top: 5, bottom: 5, right: 5}}>
      <MyText fontSize={12} type="medium" color={colors.black}>
        {ticketCount}
      </MyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ticketButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    borderRadius: 999,
  },
});
