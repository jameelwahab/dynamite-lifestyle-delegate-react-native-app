import {View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../../utilities/colors';
import MyText from '../../../../components/MyText';
import numFormatter from '../../../../functions/numFormatter';
import {icons} from '../../../../utilities/icons';
import {__commissionCounterBoxStyle} from '../__styles';

const CounterBox = ({
  color,
  count,
  subTitle,
  icon = null,
  normal = false,
  style,
}) => {
  return (
    <View style={[__commissionCounterBoxStyle.box, style]}>
      <LinearGradient
        start={{x: 0.0, y: 0.25}}
        end={{x: 0.5, y: 1.0}}
        locations={[0, 0.4]}
        colors={[color + '55', color]}
        style={__commissionCounterBoxStyle.gradientBox}>
        {icon || icons.pound(colors.primary)}
      </LinearGradient>

      <MyText
        style={__commissionCounterBoxStyle.countText}
        fontSize={16}
        type="medium">
        {(normal ? '' : '£ ') + numFormatter(count, 2)}
      </MyText>
      <MyText
        adjustsFontSizeToFit={true}
        fontSize={10}
        style={__commissionCounterBoxStyle.subTitleText}>
        {subTitle}
      </MyText>
    </View>
  );
};

export default CounterBox;
