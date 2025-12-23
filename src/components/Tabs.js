import React, {useRef} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import MyText from './MyText';
import {colors} from '../utilities/colors';
import {Flex, Row} from '../UIComponents/FlexViews';
import TitleView from './TitleView';
import {icons} from '../utilities/icons';

const Tabs = ({list, changeTab, tab, style, downloadPDF}) => {
  const menuRef = useRef();

  const downloadPDFView = () => {
    return (
      <TouchableOpacity
        onPress={downloadPDF}
        style={{
          marginRight: 10,
          borderWidth: 1,
          padding: 5,
          borderRadius: 5,
          borderColor: colors.primary,
        }}>
        <Row style={{gap: 5}} alignItems="center">
          <Text style={{color: colors.primary}}>Download PDF</Text>
          {icons.download()}
        </Row>
      </TouchableOpacity>
    );
  };
  return (
    <View style={[{marginHorizontal: -10}, style]}>
      <Row
        style={{
          height: 50,
        }}
        alignItems="center">
        <FlatList
          // contentContainerStyle={{ paddingHorizontal: 10 }}
          data={list}
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={menuRef}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  menuRef?.current?.scrollToIndex({
                    index: index,
                    animated: true,
                    viewPosition: 0.5,
                  });
                  // setTimeout(() => {
                  changeTab(index);
                  // }, 100);
                }}
                style={{justifyContent: 'center', paddingHorizontal: 10}}>
                <MyText
                  fontSize={15}
                  type={index == tab ? 'medium' : 'regular'}
                  color={index == tab ? colors.primary2 : colors.lightText}>
                  {item?.title}
                </MyText>

                <View
                  style={{
                    borderRadius: 10,
                    marginTop: 3,
                    height: 3,
                    backgroundColor:
                      index == tab ? colors.primary : colors.transparent,
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />
        {tab == 1 && downloadPDFView()}
      </Row>
    </View>
  );
};

export default Tabs;
