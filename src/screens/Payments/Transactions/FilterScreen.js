import {View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import RootView from '../../../components/RootView';
import MyTouchableInput from '../../../components/MyTouchableInput';
import {MyButton} from '../../../components/MyButton';
import {STRINGS} from '../../../utilities/strings';
import OptionModal from '../../../components/OptionModal';
import {Flex} from '../../../UIComponents/FlexViews';
import {__transactionFilterStyles} from './__styles';

const FilterScreen = ({navigation, route}) => {
  const {title, changeMode, mode} = route?.params;
  const [selectedMode, setSelectedMode] = useState(!!mode ? mode : list[0]);
  const [optionModal, setOptionModal] = useState(false);

  const onClearPress = () => {
    setSelectedMode(null);
    changeMode?.(list[0]);
    navigation.goBack();
  };
  const onFilterPress = () => {
    changeMode?.(selectedMode);
    navigation.goBack();
  };

  return (
    <RootView title={STRINGS.TRANSACTION_FILTER.filter + ' ' + title}>
      <Flex flex={1}>
        <ScrollView
          contentContainerStyle={__transactionFilterStyles.scrollContent}
          style={__transactionFilterStyles.scrollView}
          showsVerticalScrollIndicator={false}>
          <MyTouchableInput
            label={STRINGS.TRANSACTION_FILTER.transactionMode}
            onPress={() => setOptionModal(true)}
            value={!!selectedMode ? selectedMode?.title : ''}
          />

          <View style={__transactionFilterStyles.buttonContainer}>
            <View>
              <MyButton
                onPress={onClearPress}
                style={__transactionFilterStyles.btn}
                invert
                title={STRINGS.TRANSACTION_FILTER.clear}
              />
            </View>
            <View style={__transactionFilterStyles.buttonSpacing}>
              <MyButton
                onPress={onFilterPress}
                style={__transactionFilterStyles.btn}
                textStyle={__transactionFilterStyles.filterButtonText}
                title={STRINGS.TRANSACTION_FILTER.filterButton}
              />
            </View>
          </View>
        </ScrollView>
      </Flex>
      <OptionModal
        isVisible={optionModal}
        closeModal={() => setOptionModal(false)}
        optionList={list}
        noIcon
        onSelected={opt => {
          setSelectedMode(opt);
          setOptionModal(false);
        }}
      />
    </RootView>
  );
};

export default FilterScreen;

const list = [
  {
    key: 'all',
    title: STRINGS.TRANSACTION_FILTER.all,
  },
  {
    key: 'sandBox',
    title: STRINGS.TRANSACTION_FILTER.sandBox,
  },
  {
    key: 'live',
    title: STRINGS.TRANSACTION_FILTER.live,
  },
];
