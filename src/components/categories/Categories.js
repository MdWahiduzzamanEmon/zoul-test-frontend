// import React from "react";
// import { Image, StyleSheet, TouchableOpacity } from "react-native";
// import FastImage from "react-native-fast-image";
// import Block from "../utilities/Block";
// import Text from "../utilities/Text";
// import {
//   hp,
//   perfectSize,
//   responsiveScale,
//   scaleSize,
// } from "../../styles/mixins";
// import { colors } from "../../styles/theme";
// import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";

// const Categories = ({
//   label,
//   image,
//   browseByGoal = false,
//   onPress = () => {},
//   browseByGoalOnPress = () => {},
// }) => {
//   const imageOpacity = label ? 0.85 : 1;
//   return (
//     <TouchableOpacity
//       style={browseByGoal ? styles.browseByGoalItem : styles.categoryItem}
//       onPress={() => (browseByGoal ? browseByGoalOnPress() : onPress())}
//     >
//       <FastImage
//         source={{ uri: image}}
//         style={
//           browseByGoal
//             ? [styles.browseByGoalImage, { opacity: imageOpacity }]
//             : [styles.categoryImage, { opacity: imageOpacity }]
//         }
//         resizeMode="cover"
//       />
//       <Text
//         regular
//         size={browseByGoal ? perfectSize(16) : perfectSize(20)}
//         color={browseByGoal ? colors.white : colors.black}
//         style={browseByGoal ? styles.browseByGoalText : styles.categoryText}
//         weight={400}
//       >
//         {label}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// export default Categories;

// const styles = StyleSheet.create({
//   categoryItem: {
//     marginBottom: perfectSize(16),
//     justifyContent: "center",
//     width: "47.5%",
//     overflow: "hidden",
//     borderRadius: perfectSize(8),
//     marginRight: perfectSize(16),
//   },

//   browseByGoalItem: {
//     marginBottom: perfectSize(16),
//     justifyContent: "center",
//     width: "47.5%",
//     overflow: "hidden",
//     borderRadius: perfectSize(8),
//     marginRight: perfectSize(16),
//   },
//   categoryImage: {
//     justifyContent: "center",
//     width: "100%",
//     height: perfectSize(145),
//   },
//   categoryText: {
//     position: "absolute",
//     alignSelf: "center",
//     textAlign: "center",
//   },
//   browseByGoalText: {
//     position: "absolute",
//     bottom: perfectSize(8),
//     left: perfectSize(8),
//     right: perfectSize(10),
//   },
//   browseByGoalImage: {
//     justifyContent: "center",
//     width: "100%", // Fixed width for consistency
//     height: 94, // Fixed height for 16:9 aspect ratio
//     overflow: "hidden",
//     borderRadius: perfectSize(8),
//     // aspectRatio: 16 / 8.5,
//   },
// });
import React from "react";
import { Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import {
  hp,
  perfectSize,
  responsiveScale,
  scaleFont,
  scaleSize,
} from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import { getTransformedUrl } from "../../utils/ImageService";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Categories = ({
  label,
  image,
  browseByGoal = false,
  onPress = () => {},
  browseByGoalOnPress = () => {},
}) => {
  const imageOpacity = label ? 0.85 : 1;

  return (
    <TouchableOpacity
      style={browseByGoal ? styles.browseByGoalItem : styles.categoryItem}
      onPress={() => (browseByGoal ? browseByGoalOnPress() : onPress())}
    >
      <Image
        source={{ uri: getTransformedUrl(image) }}
        style={
          browseByGoal
            ? [styles.browseByGoalImage, { opacity: imageOpacity }]
            : [styles.categoryImage, { opacity: imageOpacity }]
        }
        resizeMode="cover"
      />
      <Text
        medium
        size={browseByGoal ? scaleSize(20) : scaleSize(16)}
        color={colors.white}
        style={browseByGoal ? styles.browseByGoalText : styles.categoryText}
        // weight={400}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Categories;

const styles = StyleSheet.create({
  categoryItem: {
    marginBottom: perfectSize(16),
    justifyContent: "center",
    width: SCREEN_WIDTH * 0.426, // Use 47.5% of screen width
    overflow: "hidden",
    borderRadius: perfectSize(8),
    marginRight: perfectSize(16),
  },
  browseByGoalItem: {
    marginBottom: perfectSize(16),
    justifyContent: "center",
    width: SCREEN_WIDTH * 0.426, // Use 47.5% of screen width
    overflow: "hidden",
    borderRadius: perfectSize(8),
    marginRight: perfectSize(16),
    aspectRatio: 1.6,
  },
  categoryImage: {
    justifyContent: "center",
    width: "100%",
    height: SCREEN_WIDTH * 0.213, // Set height relative to the width (adjust ratio as needed)
  },
  categoryText: {
    // position: "absolute",
    // alignSelf: "flex-end",
    // textAlign: "center",
    position: "absolute",
    bottom: perfectSize(8),
    left: perfectSize(8),
    right: perfectSize(10),
    fontFamily: font.medium,
  },
  browseByGoalText: {
    position: "absolute",
    bottom: perfectSize(8),
    left: perfectSize(8),
    right: perfectSize(10),
    fontFamily: font.medium,
  },
  browseByGoalImage: {
    justifyContent: "center",
    width: "100%",
    height: "100%", // Maintain aspect ratio for responsive height
    overflow: "hidden",
    borderRadius: perfectSize(8),
  },
});
