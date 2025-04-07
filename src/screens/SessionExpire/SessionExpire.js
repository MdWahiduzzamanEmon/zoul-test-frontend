import { ErrorDialog } from "../../components/modal/Modal";
import { ImageBackground, StatusBar, StyleSheet } from "react-native";
import Block from "../../components/utilities/Block";
import { usePlayer } from "../../modules/player";
import { useEffect } from "react";

const SessionExpire = ({ route }) => {
  const { statusCode, message } = route?.params;
  const player = usePlayer();
  useEffect(() => {
    player?.reset();
  }, []);

  return (
    <Block flex={1}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require("../../assets/appImages/ExploreBackgroundImageWithIcon.png")}
        resizeMode="stretch"
        style={[styles.bgImage]}
      >
        <ErrorDialog statusCode={statusCode} message={message} />
      </ImageBackground>
    </Block>
  );
};

export default SessionExpire;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
});
