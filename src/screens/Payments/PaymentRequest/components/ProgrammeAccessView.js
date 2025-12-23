import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {Flex, Row} from '../../../../UIComponents/FlexViews';
import MyText from '../../../../components/MyText';
import {__manageProgrammeAccessStyles} from '../__style';
import MyCheckBox from '../../../../components/MyCheckBox';
import UserImage from '../../../../components/UserImage';
import StatView from '../../../../components/StatView';
import {colors} from '../../../../utilities/colors';
import {STRINGS} from '../../../../utilities/strings';

const ProgrammeAccessView = ({
  item,
  isSelected,
  onToggle,
  onChangeField,
  selectedObject,
}) => {
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
          title={STRINGS.MANAGE_PROGRAMME_ACCESS.programmeTitle}
          value={!!item?.title ? item?.title : STRINGS.GENERIC.N_A}
          noFontTransform
        />
        <StatView
          title={STRINGS.GENERIC.STATUS}
          view={() => (
            <PaidView
              value={item?.status}
              text={
                item?.status ? STRINGS.GENERIC.ACTIVE : STRINGS.GENERIC.INACTIVE
              }
            />
          )}
        />
        <StatView
          title={STRINGS.MANAGE_PROGRAMME_ACCESS.noOfStartDays}
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
          title={STRINGS.MANAGE_PROGRAMME_ACCESS.noOfEndDays}
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
