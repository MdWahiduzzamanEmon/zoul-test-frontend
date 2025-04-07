import React, { useCallback, useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Backgrounds } from "../../data/background";
import Block from "../../components/utilities/Block";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../../components/utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import { BackIcon } from "../../icons/back-icon/BackIcon";
import CheckIcon from "../../assets/icons/check-icon.svg";
import ZoulIcon from "../../assets/icons/zoul-icon.svg";
import { languages } from "./LanguageData";
import { updateProfile } from "../../resources/baseServices/auth";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import { handleLanguageChange } from "../../helpers/app";
import { useDispatch } from "react-redux";
import { useLocale } from "../../context/LocaleProvider";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import i18n from "../../translations/i18n";

const LanguageSelectionScreen = ({ navigation, route }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [payloadLanguage, setPayloadLanguage] = useState("EN");
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();
  const dispatch = useDispatch();
  const { changeLocale } = useLocale();

  const isFromIntro = route?.params?.isFromIntro;
  const isFromSetting = route?.params?.isSetting;
  const language = route?.params?.language;

  useEffect(() => {
    if (isFromSetting) {
      const findSelectedLanguage = languages.find(
        (lang) => lang.language === language
      );
      if (findSelectedLanguage) {
        setSelectedLanguage(findSelectedLanguage?.name);
        setPayloadLanguage(findSelectedLanguage?.language);
      }
    }
  }, [isFromSetting]);

  const handleChooseLanguageBtn = useCallback(async () => {
    setIsLoading(true);
    const data = {
      preferred_language: payloadLanguage,
    };
    try {
      const res = await updateProfile(data);
      if (res?.data?.status === "success") {
        await handleLanguageChange(
          payloadLanguage?.toLowerCase(),
          dispatch,
          changeLocale,
          false
        );
        navigation.goBack();
      }
    } catch (error) {
      modal.show(ErrorDialog, {
        messageTitle:
          error?.response?.data?.errorTitle ??
          ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
        message:
          error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [payloadLanguage]);

  const handleSetLanguage = async () => {
    if (isFromIntro) {
      await handleLanguageChange(
        payloadLanguage?.toLowerCase(),
        dispatch,
        changeLocale,
        isFromIntro
      );
      navigation.navigate("Testimonial");
    } else {
      await handleChooseLanguageBtn();
    }
  };

  const renderLanguageItem = ({ item }) => {
    const isSelected = selectedLanguage === item.name;
    return (
      <TouchableOpacity
        style={[
          styles.languageSelectionButton,
          {
            backgroundColor: isSelected
              ? colors.white
              : "rgba(255,255,255,0.3)",
          },
        ]}
        onPress={() => {
          setPayloadLanguage(item.language);
          setSelectedLanguage(item.name);
        }}
      >
        <Text
          size={scaleSize(16)}
          regular
          weight={400}
          color={isSelected ? colors.black : colors.white}
        >
          {item.name}
        </Text>
        <Text
          style={{
            textAlign:
              item?.language == "AR" || item?.language == "HE"
                ? "right"
                : "left",
          }}
          size={scaleSize(12)}
          regular
          weight={400}
          color={isSelected ? colors.black : colors.white}
        >
          {item.native}
        </Text>
      </TouchableOpacity>
    );
  };

  const { top, bottom } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={Backgrounds.chooseLanguageBackground}
      style={styles.background}
    >
      <Block
        flex={1}
        style={{
          paddingTop: top,
          paddingBottom: bottom,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <Block flex={1} margin={[scaleSize(20)]}>
          <Block flex={false}>
            <Block flex={false} row between>
              <Block flex={false} width={"10%"}>
                {isFromIntro ? null : (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon size={perfectSize(22)} />
                  </TouchableOpacity>
                )}
              </Block>
              {!isFromSetting && (
                <Text
                  size={responsiveScale(18)}
                  regular
                  weight={400}
                  color={colors.kPinkRose}
                  onPress={async () => {
                    await handleSetLanguage();
                  }}
                >
                  {i18n.t("Skip")}
                </Text>
              )}
            </Block>
          </Block>
          {/* <Block> */}
          <Block flex={false} margin={[scaleSize(13), 0, 0, 0]}>
            <ZoulIcon />
          </Block>
          <Block flex={false} margin={[scaleSize(16), 0, 0, 0]}>
            <Text size={responsiveScale(28)} bold color={colors.white}>
              {i18n.t("Language")}
            </Text>
          </Block>
          <Block flex={false} margin={[scaleSize(12), 0, 0, 0]}>
            <Text
              size={responsiveScale(18)}
              regular
              weight={300}
              color={colors.white}
            >
              English will be the default language.
            </Text>
            <Text
              size={responsiveScale(18)}
              regular
              weight={300}
              color={colors.white}
            >
              Please select one additional language you prefer.
            </Text>
          </Block>
          {/* </Block> */}
          <Block flex={false} margin={[scaleSize(24), 0, 0, 0]}>
            <TouchableOpacity disabled={true} style={[styles.languageButton]}>
              <Text
                size={responsiveScale(16)}
                regular
                weight={300}
                color={colors.white}
              >
                {selectedLanguage === "English"
                  ? "English (Default)"
                  : selectedLanguage}
              </Text>
              <CheckIcon />
            </TouchableOpacity>
          </Block>
          <Block flex={1} margin={[scaleSize(24), 0, 0, 0]}>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              contentContainerStyle={styles.languageGrid}
            />
          </Block>
          <Block flex={0.1} margin={[scaleSize(20), 0]} center>
            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  backgroundColor: colors.buttonBgColor,
                },
              ]}
              onPress={async () => {
                await handleSetLanguage();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Block flex={false}>
                  <ActivityIndicator size={25} color={colors.white} />
                </Block>
              ) : (
                <Text
                  size={responsiveScale(14)}
                  weight={500}
                  regular
                  color={colors.white}
                >
                  {i18n.t("Save")}
                </Text>
              )}
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  languageButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.white,
  },
  languageSelectionButton: {
    // backgroundColor: "rgba(255,255,255,0.3)",
    // padding: perfectSize(10),
    paddingVertical: perfectSize(8),
    paddingHorizontal: perfectSize(8),
    borderRadius: perfectSize(10),
    margin: perfectSize(6),
    width: "30%", // Adjust to make it flexible within the grid
  },
  continueButton: {
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(50),
    borderRadius: perfectSize(8),
    width: "100%",
  },
});

export default LanguageSelectionScreen;
