import { View, FlatList, } from 'react-native'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyLoader from '../../../components/MyLoader'
import { QUESTIONS_LIST } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import EmptyView from '../../../components/EmptyView'
import MemberView from '../../../components/MemberView'
import QuestionComponent from '../../Questions/Components/QuestionComponent'
import ReplyModal from '../components/ReplyModal'


const QuestionView = ({ hideRepliesCheckBox = false, disableReplies = false, list, loader, onShowReplyPress, member, refresh }) => {
  const ref_replyModal = useRef();

  const [sIndex, setSIndex] = useState(-1);
  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          renderItem={({ item, index }) => <QuestionComponent
            hideRepliesCheckBox={hideRepliesCheckBox}
            item={item}
            index={index}
            showRepliesbtns={true}
            onShowReplyPress={onShowReplyPress}
            onRelpyBtnPress={() => {
              setSIndex(index)
              ref_replyModal?.current?.open(index)
            }}
          />}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id}
          ListEmptyComponent={!loader && <EmptyView />}
        />
      </View>

      <ReplyModal
        disableReplies={disableReplies}
        ref={ref_replyModal}
        member={member}
        refresh={refresh}
        question={list[sIndex]}
        onClose={() => setSIndex(-1)}
      />
    </View>
  )
}

export default QuestionView