import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import {useSelector} from 'react-redux';
import {selectUser} from '../../redux/reducers/userSlice';
import MyWebview from '../../components/MyWebview';
import WebPlayer from '../../components/WebPlayer';
import utilities from '../../utilities';
import AudioPlayer from '../../components/AudioPlayer';
import {MyButton} from '../../components/MyButton';
import isArray from '../../functions/isArray';
import {Row} from '../../UIComponents/FlexViews';

const RecordingDetail = ({navigation, route}) => {
  const {recording} = route?.params;
  return (
    <RootView title={recording?.title}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {!!recording?.title && <MyWebview html={recording?.title} />}

        {!!recording?.video_url && (
          <View style={{margin: 10, alignItems: 'center'}}>
            <WebPlayer
              height={230}
              url={recording?.video_url}
              width={utilities.windowWidth() - 20}
            />
          </View>
        )}

        {!!recording?.audio_recording && (
          <View style={{margin: 10, alignItems: 'center'}}>
            <AudioPlayer url={recording?.audio_recording} />
          </View>
        )}

      {isArray(recording?.programs) &&
        <Row flexWrap="wrap">
          {recording?.programs.map((program, index) => (
            <View
              key={index + 'pragrams'}
              style={{marginTop: 10, alignSelf: 'flex-start'}}>
              <MyButton
              disable={true}
                title={program?.title}
                invert
                style={{paddingHorizontal: 20, height: 35}}
              />
            </View>
          ))}
        </Row>}
      </ScrollView>
    </RootView>
  );
};

export default RecordingDetail;
