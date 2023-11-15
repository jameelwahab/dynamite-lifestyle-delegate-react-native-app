import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
import { colors } from '../utilities/colors';
const MyImage = createImageProgress(FastImage);
MyImage.defaultProps.indicatorProps = { color: colors.white }
export default MyImage;

