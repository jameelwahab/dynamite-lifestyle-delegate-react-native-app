import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyLoader from '../../../components/MyLoader'
import { GET_FEED_LIST } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import FeedView from './FeedView'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import { selectSettings } from '../../../redux/reducers/settingSlice'
import CommentModal from './CommentModal'
import { GET_COMMENT_LIST } from '../../../DAL/Feed'

const FeedScreen = ({ navigation }) => {
  const { token, user } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const { settings } = useSelector(selectSettings);
  const [feed, setFeed] = useState([]);
  const [comments, setComments] = useState({
    modalVisibility: false,
    list: [],
    loader: false,
    focus: false
  });
  const [loader, setLoader] = useState(true);




  const getComments = async (fd) => {
    let res = await GET_COMMENT_LIST({ navigation, token, body: fd });
    if (res.code == 200) {
      setComments({
        modalVisibility: true,
        list: res?.comment,
        loader: false
      })
    } else {
    }
  }

  const openComments = (id,focus) => {
    setComments({
      list: [],
      modalVisibility: true,
      loader: true,
      focus: focus
    });
    let fd = new FormData();
    fd.append("feed_id", id);
    getComments(fd);
  }


  const getFeed = async () => {
    let res = await GET_FEED_LIST({ navigation, token, type: "the_cosmos", level: "all" });
    if (res.code == 200) {
      setFeed(res?.feeds)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  useEffect(() => {
    getFeed()
  }, [])


  return (
    <RootView hideSubHeader>
      <View style={{ flex: 1 }}>
        <FlatList
          data={feed}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) =>
            <FeedView
              item={item}
              index={index}
              timezone={timezone}
              user={user}
              token={token}
              settings={settings}
              openComments={openComments}
            />}
        />
      </View>
      <CommentModal
        isVisible={comments?.modalVisibility}
        timezone={timezone}
        closeModal={() =>
          setComments({
            modalVisibility: false,
            list: [],
            loader: false
          })}
        comments={comments?.list}
        user={user}
        loader={comments?.loader}
        focus={comments?.focus}
      />
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default FeedScreen