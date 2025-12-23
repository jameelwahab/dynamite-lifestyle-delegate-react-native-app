// import {View, Text, FlatList, StyleSheet} from 'react-native';
// import React from 'react';
// import MyText from '../../../components/MyText';
// import {colors} from '../../../utilities/colors';

// const Ratinglist = ({list}) => {
//   console.log(list, 'list_____');
//   const renderRating = ({item, index}) => {
//     return (
//       <View style={__styles.itemView}>
//         <MyText>{item?.question_statement}</MyText>
//         <View style={__styles.ratingRootView}>
//           {Array(item?.max - item?.min)
//             .fill(item?.max - item?.min)
//             .map((y, j) => {
//               return (
//                 <View
//                   style={[
//                     __styles.ratingView,
//                     {
//                       backgroundColor:
//                         j + 1 <= item?.answer
//                           ? colors.beige
//                           : colors.transparent,
//                     },
//                   ]}>
//                   <MyText
//                     color={j + 1 <= item?.answer ? colors.white : colors.beige}
//                     type="medium">
//                     {j + 1}
//                   </MyText>
//                 </View>
//               );
//             })}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={{flex: 1}}>
//       <FlatList
//         data={list}
//         showsVerticalScrollIndicator={false}
//         renderItem={renderRating}
//         keyExtractor={item => item?._id}
//       />
//     </View>
//   );
// };

// export default Ratinglist;

// const __styles = StyleSheet.create({
//   itemView: {
//     backgroundColor: colors.secondaryVariant,
//     borderWidth: 1,
//     borderColor: colors.lightText + '22',
//     borderRadius: 10,
//     marginTop: 10,
//     padding: 10,
//     marginHorizontal: 10,
//   },
//   ratingRootView: {
//     marginTop: 10,
//     flexDirection: 'row',
//   },
//   ratingView: {
//     height: 30,
//     width: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 30 / 2,
//     marginRight: 5,
//     borderWidth: 1,
//     borderColor: colors.beige,
//   },
// });
import {View, FlatList, StyleSheet} from 'react-native';
import React from 'react';
import MyText from '../../../components/MyText';
import {colors} from '../../../utilities/colors';
import {Flex} from '../../../UIComponents/FlexViews';
import {__assessmentComponentStyles} from '../__styles';

const Ratinglist = ({list}) => {
  const renderRating = ({item, index}) => {
    const min = item?.min || 1;
    const max = item?.max || 1;
    const count = Math.max(0, max - min + 1);

    if (count <= 0) {
      return null;
    }

    return (
      <View style={__assessmentComponentStyles.itemView}>
        <MyText>{item?.question_statement}</MyText>
        <View style={__assessmentComponentStyles.ratingRootView}>
          {Array.from({length: count}).map((_, j) => {
            const ratingValue = min + j;
            return (
              <View
                key={j}
                style={[
                  __assessmentComponentStyles.ratingView,
                  {
                    backgroundColor:
                      ratingValue <= item?.answer
                        ? colors.beige
                        : colors.transparent,
                  },
                ]}>
                <MyText
                  color={
                    ratingValue <= item?.answer ? colors.white : colors.beige
                  }
                  type="medium">
                  {ratingValue}
                </MyText>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Flex flex={1}>
      <FlatList
        data={list}
        showsVerticalScrollIndicator={false}
        renderItem={renderRating}
        keyExtractor={item => item?._id}
      />
    </Flex>
  );
};

export default Ratinglist;
