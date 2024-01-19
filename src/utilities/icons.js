
import { colors } from './colors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export const icons = {
  logo: require("../assets/logo/dd-consultant-logo.png"),
  missionControl: require("../assets/logo/mission-control.jpeg"),
  dummyUser: require("../assets/icons/dummy-user.png"),
  dummyUser2: require("../assets/icons/dummy-user-2.png"),
  threeLinesMenu: require("../assets/icons/threeBarsMenu.png"),
  photo: require("../assets/icons/photo.png"),
  refresh: require('../assets/icons/reload.png'),
  send: require('../assets/icons/send.png'),
  tick: require('../assets/icons/tick.png'),
  emptyBox: require('../assets/icons/empty-box.png'),
  textEdit: require('../assets/icons/textEdit.png'),
  addImage: require('../assets/icons/addImage.png'),
  schedule: require('../assets/icons/scheduled.png'),
  wheelOfLife: require('../assets/icons/wheel-icon.webp'),
  //todo:   sideBar Icons

  sidebar: {
    handPromise: require("../assets/sidebarIcons/Support.webp"),
    help: require("../assets/sidebarIcons/help.png"),
    dashboard: require("../assets/sidebarIcons/dashbaord.webp"),
    cosmos: require("../assets/sidebarIcons/cosmos.webp"),
    member: require("../assets/sidebarIcons/member.webp"),
  },

  user: () => { return (<FontAwesome6 name="user-large" color={colors.primary} size={17} />) },
  copy: () => { return (<Ionicons name="copy" color={colors.primary} size={17} />) },
  copyOulined: (size = 20, color = colors.primary) => { return (<Ionicons name="copy-outline" color={color} size={size} />) },
  lock: () => { return (<Fontisto name="locked" color={colors.primary} size={17} />) },
  gear: () => { return (<Ionicons name="settings" color={colors.primary} size={17} />) },
  forwardArrow: (size = 20, color = colors.primary) => { return (<Ionicons name="chevron-forward" color={color} size={size} />) },
  backwardArrow: (size = 20, color = colors.primary) => { return (<Ionicons name="chevron-back" color={color} size={size} />) },
  upwardArrow: (size = 20, color = colors.primary) => { return (<Ionicons name="chevron-up" color={color} size={size} />) },
  downwardArrow: (size = 20, color = colors.primary) => { return (<Ionicons name="chevron-down" color={color} size={size} />) },
  image: () => { return (<Ionicons name="image" color={colors.primary} size={25} />) },
  images: () => { return (<Ionicons name="images" color={colors.primary} size={20} />) },
  camera: (color = colors.primary, size = 20) => { return (<Fontisto name="camera" color={color} size={size} />) },
  crosssWithCircle: (color = colors.white, size = 30) => { return (<MaterialIcons name="cancel" color={color} size={size} />) },
  crosssWithCircle_20: (color = colors.white, size = 20) => { return (<MaterialIcons name="cancel" color={color} size={size} />) },
  noIcon: () => { return (<MaterialIcons name="cancel" color={colors.transparent} size={20} />) },
  crosss: (color = colors.white, size = 20) => { return (<Ionicons name="close" color={color} size={size} />) },
  plus: (color = colors.white, size = 20) => { return (<Octicons name="plus" color={color} size={size} />) },
  search: (color = colors.white, size = 17) => { return (<Feather name="search" color={color} size={size} />) },
  down: (color = colors.white, size = 17) => { return (<Ionicons name="caret-down" color={color} size={size} />) },
  threeDots: (color = colors.primary, size = 12) => { return (<Entypo name="dots-three-vertical" color={color} size={size} />) },
  download: (color = colors.primary, size = 17) => { return (<Feather name="download" color={color} size={size} />) },
  edit: (color = colors.primary, size = 17) => { return (<Feather name="edit" color={color} size={size} />) },
  trash: () => { return (<Feather name="trash" color={colors.primary} size={17} />) },
  trashFilled: () => { return (<Fontisto name="trash" color={colors.primary} size={17} />) },
  reply: () => { return (<Octicons name="reply" color={colors.primary} size={17} />) },
  upload: () => { return (<FontAwesome name="cloud-upload" color={colors.primary} size={25} />) },
  clock: (color = colors.primary, size = 17) => { return (<Octicons name="clock" color={color} size={size} />) },
  minusCircle: () => { return (<Feather name="minus-circle" color={colors.primary} size={25} />) },
  plusCircle: () => { return (<Feather name="plus-circle" color={colors.primary} size={25} />) },
  back: (color = colors.white, size = 20) => { return (<MaterialIcons name="arrow-back" color={color} size={size} />) },
  info: (color = colors.white, size = 20) => { return (<FontAwesome6 name="info" color={color} size={size} />) },
  upward: (color = colors.white, size = 20) => { return (<Ionicons name="caret-up" color={color} size={size} />) },
  downward: (color = colors.white, size = 20) => { return (<Ionicons name="caret-down" color={color} size={size} />) },
  mic: (color = colors.white, size = 20) => { return (<Ionicons name="mic" color={color} size={size} />) },
  playCircle: (color = colors.white, size = 20) => { return (<Ionicons name="play-circle" color={color} size={size} />) },
  filterCircle: (color = colors.white, size = 20) => { return (<Ionicons name="filter-circle" color={color} size={size} />) },
  filter: (color = colors.white, size = 20) => { return (<Octicons name="filter" color={color} size={size} />) },
  bold: (color = colors.white, size = 20) => { return (<Octicons name="bold" color={color} size={size} />) },
  italic: (color = colors.white, size = 20) => { return (<Octicons name="italic" color={color} size={size} />) },
  link: (color = colors.white, size = 20) => { return (<Ionicons name="link" color={color} size={size} />) },
  pause: (color = colors.white, size = 20) => { return (<Feather name="pause" color={color} size={size} />) },
  play: (color = colors.white, size = 20) => { return (<Feather name="play" color={color} size={size} />) },
  send: (color = colors.white, size = 20) => { return (<Ionicons name="send" color={color} size={size} />) },
  seen: (color = colors.white, size = 20) => { return (<Ionicons name="checkmark-done" color={color} size={size} />) },
  sent: (color = colors.white, size = 20) => { return (<Ionicons name="checkmark" color={color} size={size} />) },
  pound: (color = colors.white, size = 20) => { return (<MaterialIcons name="currency-pound" color={color} size={size} />) },
  calendar: (color = colors.white, size = 20) => { return (<Ionicons name="calendar-outline" color={color} size={size} />) },
  calendarTick: (color = colors.white, size = 20) => { return (<MaterialCommunityIcons name="calendar-check" color={color} size={size} />) },
  heartUnfilled: (color = colors.white, size = 20) => { return (<MaterialCommunityIcons name="heart-outline" color={color} size={size} />) },
  heartFilled: (color = colors.white, size = 20) => { return (<MaterialCommunityIcons name="heart" color={color} size={size} />) },
  comment: (color = colors.white, size = 20) => { return (<MaterialCommunityIcons name="message-outline" color={color} size={size} />) },
  pin: (color = colors.primary, size = 17) => { return (<Octicons name="pin" color={color} size={size} />) },
  video: (color = colors.primary, size = 17) => { return (<Ionicons name="videocam" color={color} size={size} />) },
  code: (color = colors.primary, size = 17) => { return (<Ionicons name="code-slash" color={color} size={size} />) },
  goto: (color = colors.primary, size = 17) => { return (<Ionicons name="open-outline" color={color} size={size} />) },
  message: (color = colors.primary, size = 17) => { return (<MaterialIcons name="message" color={color} size={size} />) },
  history: (color = colors.primary, size = 17) => { return (<FontAwesome5 name="history" color={color} size={size} />) },
  editpencil: (color = colors.primary, size = 17) => { return (<MaterialIcons name="mode-edit" color={color} size={size} />) },
  sort: (color = colors.primary, size = 17) => { return (<Octicons name="sort-desc" color={color} size={size} />) },


}