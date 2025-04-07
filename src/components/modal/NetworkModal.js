// // import { SCREEN_WIDTH, TouchableOpacity } from "@gorhom/bottom-sheet";
// // import { ImageBackground, Modal, StatusBar, StyleSheet, View } from "react-native";
// // import { perfectSize, scaleSize } from "../../styles/mixins";
// // import { SafeAreaView } from "react-native";
// // import { Backgrounds } from "../../data/background";
// // import { usePlayer } from "../../modules/player";
// // import Text from "../../components/utilities/Text";
// // import { useNavigation } from "@react-navigation/native";
// // export default NetworkModal = ({
// //   label = "Network Not Available",
// //   isVisible = false,
// //   refresh,
// //   onPress,
// // }) => {
// //   const player=usePlayer();
// //   if(isVisible)
// //   {
// //     player.pause();
// //   }
// //   const navigation = useNavigation();
// //   return (
// //     <Modal visible={isVisible} transparent>
// //        <View style={{ flex: 1 }}>
// //       <StatusBar
// //         translucent
// //         backgroundColor="#00000099"
// //         barStyle="light-content"
// //       />
// //       <ImageBackground
// //         source={require("../../assets/appImages/ExploreBackgroundImageWithIcon.png")}
// //         resizeMode="stretch"
// //         style={[styles.bgImage]}
// //       >
// //         <SafeAreaView style={{ flex: 1 }}>
// //           <ImageBackground
// //             style={{ height: "100%", width: "100%" }}
// //             source={Backgrounds.NoNwtworkBg1}
// //           >
// //             <View
// //               style={{
// //                 height: "100%",
// //                 width: "100%",
// //                 alignItems: "center",
// //                 justifyContent: "flex-end",
// //                 backgroundColor: "#00000099",
// //               }}
// //             >
// //               <View
// //                 style={{
// //                   height: 200,
// //                   width: "100%",
// //                   backgroundColor: "black",
// //                   alignItems: "flex-start",
// //                   justifyContent: "space-evenly",
// //                   borderTopLeftRadius: scaleSize(30),
// //                   borderTopRightRadius: scaleSize(30),
// //                   paddingHorizontal: scaleSize(20),
// //                   //  marginBottom:scaleSize(50),
// //                 }}
// //               >
// //                 <Text color={"white"} bold size={scaleSize(20)}>
// //                   Connect to the internet{" "}
// //                 </Text>
// //                 <Text color={"white"} regular size={scaleSize(14)}>
// //                   You're offline. Check your connection{" "}
// //                 </Text>
// //                 <TouchableOpacity
// //                 onPress={()=>{refresh();console.log('pressed')}}
// //                   style={{
// //                     width: SCREEN_WIDTH * 0.9,
// //                     alignSelf: "center",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                     borderRadius: scaleSize(25),
// //                     height: scaleSize(50),
// //                     backgroundColor: "white",
// //                   }}
// //                 >
// //                   <Text color={"black"} semibold size={scaleSize(16)}>
// //                     Retry
// //                   </Text>
// //                 </TouchableOpacity>

// //                 <TouchableOpacity
// //                 onPress={onPress}
// //                   style={{
// //                     width: SCREEN_WIDTH * 0.9,
// //                     alignSelf: "center",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                     borderRadius: scaleSize(25),
// //                     height: scaleSize(50),
// //                     backgroundColor: "white",
// //                   }}
// //                 >
// //                   <Text color={"black"} semibold size={scaleSize(16)}>
// //                     Go to Downloads
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           </ImageBackground>
// //         </SafeAreaView>
// //       </ImageBackground>
// //     </View>
// //     </Modal>
// //   );
// // };
// // const styles = StyleSheet.create({
// //   bgImage: {
// //     flex: 1,
// //   },
// // });
// import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
// import { ImageBackground, Modal, StatusBar, StyleSheet, View } from "react-native";
// import { perfectSize, scaleSize } from "../../styles/mixins";
// import { SafeAreaView } from "react-native";
// import { Backgrounds } from "../../data/background";
// import { usePlayer } from "../../modules/player";
// import Text from "../../components/utilities/Text";
// import { useNavigation } from "@react-navigation/native";
// import { Pressable } from "react-native"; // Use Pressable instead of TouchableOpacity
// import { colors } from "../../styles/theme";

// export default NetworkModal = ({
//   label = "Network Not Available",
//   isVisible = false,
//   refresh,
//   onPress,
// }) => {
//   const player = usePlayer();
//   if (isVisible) {
//     player.pause();
//   }

//   const navigation = useNavigation();

//   return (
//     <Modal visible={isVisible} transparent>
//       <View style={{ flex: 1 }}>
//         <StatusBar
//           translucent
//           backgroundColor="#00000099"
//           barStyle="light-content"
//         />
//         <ImageBackground
//           source={require("../../assets/appImages/ExploreBackgroundImageWithIcon.png")}
//           resizeMode="stretch"
//           style={[styles.bgImage]}
//         >
//           <SafeAreaView style={{ flex: 1 }}>
//             <ImageBackground
//               style={{ height: "100%", width: "100%" }}
//               source={Backgrounds.NoNwtworkBg1}
//             >
//               <View
//                 style={{
//                   height: "100%",
//                   width: "100%",
//                   alignItems: "center",
//                   justifyContent: "flex-end",
//                   backgroundColor: "#00000099",
//                 }}
//               >
//                 <View
//                   style={{
//                     height: 200,
//                     width: "100%",
//                     backgroundColor: colors.darkRed,
//                     alignItems: "flex-start",
//                     justifyContent: "space-evenly",
//                     borderTopLeftRadius: scaleSize(30),
//                     borderTopRightRadius: scaleSize(30),
//                     paddingHorizontal: scaleSize(20),
//                     //  marginBottom:scaleSize(50),
//                   }}
//                 >
//                   <Text color={"white"} bold size={scaleSize(20)}>
//                     Connect to the internet
//                   </Text>
//                   <Text color={"white"} regular size={scaleSize(14)}>
//                     You're offline. Check your connection
//                   </Text>

//                   {/* Retry Button */}
//                   <Pressable
//                     onPress={() => {
//                       refresh();
//                     }}
//                     style={{
//                       width: SCREEN_WIDTH * 0.9,
//                       alignSelf: "center",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       borderRadius: scaleSize(25),
//                       height: scaleSize(50),
//                       backgroundColor: "white",
//                     }}
//                   >
//                     <Text color={"black"} semibold size={scaleSize(16)}>
//                       Retry
//                     </Text>
//                   </Pressable>

//                   {/* Go to Downloads Button */}
//                   <Pressable
//                     onPress={onPress}
//                     style={{
//                       width: SCREEN_WIDTH * 0.9,
//                       alignSelf: "center",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       borderRadius: scaleSize(25),
//                       height: scaleSize(50),
//                       backgroundColor: "white",
//                     }}
//                   >
//                     <Text color={"black"} semibold size={scaleSize(16)}>
//                       Go to Downloads
//                     </Text>
//                   </Pressable>
//                 </View>
//               </View>
//             </ImageBackground>
//           </SafeAreaView>
//         </ImageBackground>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   bgImage: {
//     flex: 1,
//   },
// });
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import {
  ImageBackground,
  Modal,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { perfectSize, scaleSize } from "../../styles/mixins";
import { SafeAreaView } from "react-native";
import { Backgrounds } from "../../data/background";
import { usePlayer } from "../../modules/player";
import Text from "../../components/utilities/Text";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native"; // Use Pressable instead of TouchableOpacity
import { colors } from "../../styles/theme";
import i18n from "../../translations/i18n";

export default NetworkModal = ({
  label = "Network Not Available",
  isVisible = false,
  refresh,
  onPress,
}) => {
  const player = usePlayer();
  if (isVisible) {
    // player.pause();
  }

  const navigation = useNavigation();

  return (
    <Modal visible={isVisible} transparent>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* <ImageBackground
            style={{ height: "100%", width: "100%" }}
            source={require("../../assets/appImages/NoNetworkImage.png")}
          >
            
          </ImageBackground> */}
          <View
            style={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-end",
              backgroundColor: "#00000099",
            }}
          >
            <View
              style={{
                height: 200,
                width: "100%",
                backgroundColor: colors.marron,
                alignItems: "flex-start",
                justifyContent: "space-evenly",
                borderTopLeftRadius: scaleSize(30),
                borderTopRightRadius: scaleSize(30),
                paddingHorizontal: scaleSize(20),
                //  marginBottom:scaleSize(50),
              }}
            >
              <Text color={"white"} bold size={scaleSize(20)}>
                Connect to the internet
              </Text>
              <Text color={"white"} regular size={scaleSize(14)}>
                You're offline. Check your connection
              </Text>

              {/* Retry Button */}
              <Pressable
                onPress={() => {
                  refresh();
                  console.log("pressed");
                }}
                style={{
                  width: SCREEN_WIDTH * 0.9,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: scaleSize(25),
                  height: scaleSize(50),
                  backgroundColor: "white",
                  marginVertical: scaleSize(10),
                }}
              >
                <Text color={"black"} semibold size={scaleSize(16)}>
                  Retry
                </Text>
              </Pressable>

              {/* Go to Downloads Button */}
              <Pressable
                onPress={() => {
                  onPress(navigation);
                }}
                style={{
                  width: SCREEN_WIDTH * 0.9,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: scaleSize(25),
                  height: scaleSize(50),
                  backgroundColor: "white",
                }}
              >
                <Text color={"black"} semibold size={scaleSize(16)}>
                  Go to Downloads
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
        <View
          style={{ backgroundColor: colors.marron, height: scaleSize(40) }}
        ></View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
});
