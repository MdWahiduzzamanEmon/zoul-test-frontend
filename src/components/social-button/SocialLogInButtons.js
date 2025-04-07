import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SocialButton } from "../social-button/SocialButton";
import Block from "../utilities/Block";
import { useSocialAuthentication } from "./useSocialAuthentication";
import { getConfigData } from "../../resources/baseServices/auth";
import { consoleLog } from "../../styles/mixins";

export const SocialLoginIButtons = ({ uuid, promocode }) => {
  const [configData, setConfigData] = useState({});
  const { onGoogleAuth, onAppleAuth, onFacebookAuth } =
    useSocialAuthentication();

  useEffect(() => {
    const handleUserProfile = async () => {
      try {
        const res = await getConfigData();
        consoleLog("res--->", res.data);
        if (res?.data) {
          setConfigData(res?.data);
        }
      } catch (error) {
        console.error("error fetch config data =--->", error);
      }
    };
    handleUserProfile();
  }, []);

  const SOCIAL_BUTTON_ITEMS = [
    {
      id: "apple",
      onPress: async () => onAppleAuth(uuid, promocode),
    },
    {
      id: "google",
      onPress: async () => onGoogleAuth(uuid, promocode),
    },
    {
      id: "facebook",
      onPress: async () => onFacebookAuth(uuid, promocode),
    },
  ];

  return (
    <Block flex={false} row middle style={styles.container}>
      {SOCIAL_BUTTON_ITEMS.map((b, index) => (
        <SocialButton
          {...b}
          key={b.id + index}
          configValue={configData?.value}
        />
      ))}
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
});
