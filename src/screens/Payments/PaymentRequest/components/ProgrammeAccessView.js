import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Flex, Row} from '../../../../UIComponents/FlexViews';
import MyText from '../../../../components/MyText';
import {__manageProgrammeAccessStyles} from '../__style';
import MemberView from '../../../../components/MemberView';
import MyCheckBox from '../../../../components/MyCheckBox';
import UserImage from '../../../../components/UserImage';
import StatView from '../../../../components/StatView';
import {colors} from '../../../../utilities/colors';
import MyInputs from '../../../../components/MyInputs';

const ProgrammeAccessView = ({
  item,
  isSelected,
  onToggle,
  onChangeField,
  selectedObject,
}) => {
  // console.log(selectedObject, 'selectedObject in programme access view');
  const PaidView = ({value, text}) => {
    return (
      <View
        style={[
          __manageProgrammeAccessStyles.statusView,
          {
            backgroundColor: value ? colors.green : colors.delete,
          },
        ]}>
        <MyText
          color={colors.white}
          style={__manageProgrammeAccessStyles.statusText}>
          {text}
        </MyText>
      </View>
    );
  };

  return (
    <Flex style={__manageProgrammeAccessStyles.card}>
      <Row alignItems="center">
        <Flex flex={1}>
          <UserImage image={item?.program_images?.thumbnail_3} />
        </Flex>
        <Flex>
          <MyCheckBox value={isSelected} onPress={() => onToggle(item._id)} />
        </Flex>
      </Row>
      <View>
        <StatView
          title={'Programme Title'}
          value={!!item?.title ? item?.title : 'N/A'}
          noFontTransform
        />
        <StatView
          title={'Status'}
          view={() => (
            <PaidView
              value={item?.status}
              text={item?.status ? 'ACTIVE' : 'INACTIVE'}
            />
          )}
        />
        <StatView
          title={'No of Start Days'}
          noFontTransform
          view={() =>
            item?.program_access_type === 'limited' && (
              <TextInput
                style={__manageProgrammeAccessStyles.statInputStyle}
                keyboardType="numeric"
                value={String(
                  isSelected
                    ? selectedObject?.no_of_start_days
                    : item?.no_of_start_days ?? '',
                )}
                onChangeText={text =>
                  onChangeField(item._id, 'no_of_start_days', text)
                }
              />
            )
          }
        />
        <StatView
          title={'No of End Days'}
          view={() =>
            item?.program_access_type === 'limited' && (
              <TextInput
                style={__manageProgrammeAccessStyles.statInputStyle}
                keyboardType="numeric"
                value={String(
                  isSelected
                    ? selectedObject?.no_of_limited_days
                    : item?.no_of_limited_days ?? '',
                )}
                onChangeText={text =>
                  onChangeField(item._id, 'no_of_limited_days', text)
                }
              />
            )
          }
          noFontTransform
        />
      </View>
    </Flex>
  );
};

export default ProgrammeAccessView;

const styles = StyleSheet.create({});
