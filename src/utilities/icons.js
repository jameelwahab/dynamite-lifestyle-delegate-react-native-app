
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


export const icons = {
  logo: require("../assets/logo/dd-consultant-logo.png"),
  missionControl: require("../assets/logo/mission-control.jpeg"),
  handPromise: require("../assets/icons/Support.webp"),
  dummyUser: require("../assets/icons/dummy-user.png"),
  dummyUser2: require("../assets/icons/dummy-user-2.png"),
  threeLinesMenu: require("../assets/icons/threeBarsMenu.png"),
  photo: require("../assets/icons/photo.png"),
  refresh: require('../assets/icons/reload.png'),
  send: require('../assets/icons/send.png'),
  tick: require('../assets/icons/tick.png'),
  emptyBox: require('../assets/icons/empty-box.png'),

  user: () => { return (<FontAwesome6 name="user-large" color={colors.primary} size={17} />) },
  copy: () => { return (<Ionicons name="copy" color={colors.primary} size={17} />) },
  lock: () => { return (<Fontisto name="locked" color={colors.primary} size={17} />) },
  gear: () => { return (<Ionicons name="settings" color={colors.primary} size={17} />) },
  forwardArrow: (size = 20, color = colors.primary) => { return (<Ionicons name="chevron-forward" color={color} size={size} />) },
  backwardArrow: (size = 20, color = colors.primary) => { return (<Ionicons name="chevron-back" color={color} size={size} />) },
  image: () => { return (<Ionicons name="image" color={colors.primary} size={25} />) },
  images: () => { return (<Ionicons name="images" color={colors.primary} size={20} />) },
  camera: (color = colors.primary, size = 20) => { return (<Fontisto name="camera" color={color} size={size} />) },
  crosssWithCircle: () => { return (<MaterialIcons name="cancel" color={colors.white} size={30} />) },
  crosssWithCircle_20: () => { return (<MaterialIcons name="cancel" color={colors.white} size={20} />) },
  noIcon: () => { return (<MaterialIcons name="cancel" color={colors.transparent} size={20} />) },
  crosss: (color = colors.white, size = 20) => { return (<Ionicons name="close" color={color} size={size} />) },
  plus: (color = colors.white, size = 20) => { return (<Octicons name="plus" color={color} size={size} />) },
  search: () => { return (<Feather name="search" color={colors.white} size={17} />) },
  down: () => { return (<Ionicons name="caret-down" color={colors.white} size={17} />) },
  threeDots: () => { return (<Entypo name="dots-three-vertical" color={colors.primary} size={12} />) },
  download: (color = colors.primary, size = 17) => { return (<Feather name="download" color={color} size={size} />) },
  edit: () => { return (<Feather name="edit" color={colors.primary} size={17} />) },
  trash: () => { return (<Feather name="trash" color={colors.primary} size={17} />) },
  trashFilled: () => { return (<Fontisto name="trash" color={colors.primary} size={17} />) },
  reply: () => { return (<Octicons name="reply" color={colors.primary} size={17} />) },
  upload: () => { return (<FontAwesome name="cloud-upload" color={colors.primary} size={25} />) },
  clock: () => { return (<Octicons name="clock" color={colors.primary} size={17} />) },
  minusCircle: () => { return (<Feather name="minus-circle" color={colors.primary} size={25} />) },
  plusCircle: () => { return (<Feather name="plus-circle" color={colors.primary} size={25} />) },
  back: (color = colors.white, size = 20) => { return (<MaterialIcons name="arrow-back" color={color} size={size} />) },
  info: (color = colors.white, size = 20) => { return (<FontAwesome6 name="info" color={color} size={size} />) },
  upward: (color = colors.white, size = 20) => { return (<Ionicons name="caret-up" color={color} size={size} />) },
  downward: (color = colors.white, size = 20) => { return (<Ionicons name="caret-down" color={color} size={size} />) },
  mic: (color = colors.white, size = 20) => { return (<Ionicons name="mic" color={color} size={size} />) },
  playCircle: (color = colors.white, size = 20) => { return (<Ionicons name="play-circle" color={color} size={size} />) },
  filterCircle: (color = colors.white, size = 20) => { return (<Ionicons name="filter-circle" color={color} size={size} />) },

}