import {
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {colors} from '../../../utilities/colors';
import utilities from '../../../utilities';
import Modal from 'react-native-modal';
import MyText from '../../../components/MyText';
import {communityLevelWithAllObj} from '../../../utilities/constants';
const LevelModal = forwardRef(
  ({feedLevel, selectFeedlevel, isCosmos, cosmosLevelList}, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    useImperativeHandle(
      ref,
      () => {
        return {
          openLvlModal,
        };
      },
      [],
    );
    const closeModal = () => {
      setIsVisible(false);
    };

    const openLvlModal = () => {
      setIsVisible(true);
    };

    const optionView = ({item, index}) => {
      return (
        <Pressable
          onPress={() => {
            setIsVisible(false);
            setTimeout(() => {
              selectFeedlevel(item);
            }, 300);
          }}
          style={[
            styles.optionItem,
            {
              backgroundColor:
                feedLevel == item ? colors.secondarySelect : undefined,
            },
          ]}>
          {isCosmos ? (
            <MyText
              align="center"
              style={{
                textTransform: item == 'pta' ? 'uppercase' : 'capitalize',
              }}
              type="medium">
              {`${item.split('_').join(' ')}${
                item == 'marketing' ? ' Team' : ''
              }`}
            </MyText>
          ) : (
            <MyText align="center" type="medium">
              {communityLevelWithAllObj[item]}
            </MyText>
          )}
        </Pressable>
      );
    };

    const modalLvl = () => {
      return (
        <Modal
          isVisible={isVisible}
          onBackdropPress={closeModal}
          onBackButtonPress={closeModal}
          useNativeDriverForBackdrop={true}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={300}
          animationOutTiming={300}
          hideModalContentWhileAnimating={true}
          style={styles.modal}>
          <SafeAreaView style={styles.safeAreaTop}>
            <View
              style={[
                styles.container,
                {maxHeight: utilities.windowHeight() * 0.7},
              ]}>
              <FlatList
                data={isCosmos ? cosmosLevelList : sourceOptions}
                renderItem={optionView}
                keyExtractor={item => item}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </SafeAreaView>
          <SafeAreaView style={styles.safeAreaBottom} />
        </Modal>
      );
    };

    return <View>{modalLvl()}</View>;
  },
);

const options = ['all', 'delegate', 'consultnant'];
const sourceOptions = ['all', 'dynamite', 'pta', 'elite', 'mastery'];

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  safeAreaTop: {
    marginTop: 'auto',
  },
  container: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  safeAreaBottom: {
    flex: 0,
    backgroundColor: colors.secondary,
  },
  optionItem: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default LevelModal;
