import {View, Text} from 'react-native';
import React, {useRef} from 'react';
import MyText from '../MyText';
import {PieChart} from 'react-native-gifted-charts';
import {colors} from '../../utilities/colors';
import {fonts} from '../../utilities/fonts';
import MyWebview from '../MyWebview';
import InfoModal from '../InfoModal';

const PieGraph = ({data}) => {
  const ref_infoModal = useRef();

  const renderFooter = () => {
    return (
      <View style={{marginTop: 10}}>
        {data?.options.map((x, i) => (
          <View
            key={x.color + i}
            style={{flexDirection: 'row', marginTop: 5, paddingHorizontal: 10}}>
            <View
              style={{
                height: 10,
                width: 10,
                marginTop: 5,
                borderRadius: 3,
                backgroundColor: x?.color,
              }}
            />
            <View style={{flex: 1, marginLeft: 10}}>
              <MyText style={{}}>{x?.option_value}</MyText>
            </View>
          </View>
        ))}
      </View>
    );
  };
  const percentToValue = percentage => {
    return (Number(percentage) / 100) * 360;
  };
  const renderPieGraph = () => {
    let arr = data.options.map(item => ({
      option: item?.option_value,
      value: percentToValue(item?.percentage) / 100,
      color: item?.color,
      text: item?.percentage + '%',
      shiftTextX: -20,
      font: fonts.medium,
    }));
    return (
      <View style={{alignItems: 'center', paddingVertical: 10}}>
        <PieChart
          onPress={item =>
            ref_infoModal?.current?.openModal(
              `${item?.option}`,
              `Value: ${item?.value}\nAnswer: ${item?.text}`,
            )
          }
          showText
          // shiftTextX={-20}
          strokeWidth={1 / 2}
          strokeColor={colors.lightText2}
          textColor={colors.lightText}
          radius={150}
          textSize={16}
          // showValuesAsLabels
          labelsPosition="mid"
          // showExternalLabels
          externalLabelComponent={item => <Text style={{}}>{item.value}</Text>}
          // showTextBackground
          // textBackgroundRadius={26}
          data={arr}
          isAnimated={true}
        />
      </View>
    );
  };

  return (
    <View style={{width: '100%'}}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[{}, {color: colors.primary, fontFamily: fonts.medium}]}>
          Q.{' '}
        </Text>
        <View style={{flex: 1, marginTop: 1}}>
          {!!data?.question_statement && (
            <MyWebview html={data?.question_statement} />
          )}
        </View>
      </View>
      {renderPieGraph()}
      {renderFooter()}
      <InfoModal ref={ref_infoModal} />
    </View>
  );
};

export default PieGraph;
