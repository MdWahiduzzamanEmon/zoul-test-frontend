import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackIcon from "../../assets/appImages/svgImages/BackIcon";
import CommonBottomSheet from "../../components/commonBottomSheet/CommonBottomSheet";
import CustomDropDown from "../../components/customDropDown/CustomDropDown";
import ListEmptyComponent from "../../components/emptyComponent/EmptyComponent";
import SuggestYourPlan from "../../components/suggestYourPlan/SuggestYourPlan";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import SearchButton from "../../assets/appImages/svgImages/SearchButton";
import {
  fetchSigleGoal,
  getOneCategorie,
} from "../../resources/baseServices/app";
import { setOneCategoriesData } from "../../store/storeAppData/categories";
import {
  consoleLog,
  perfectSize,
  responsiveScale,
  scaleSize,
} from "../../styles/mixins";
import { colors, deviceHeight, deviceWidth } from "../../styles/theme";
import i18n from "../../translations/i18n";
import { formatTime, handleLanguageChange } from "../../helpers/app";
import moment from "moment";
import { getLocalizedContent } from "../../helpers/audioGoalLocalization";
import {
  setAllCategoryAudioList,
  setSelectedAudioDetails,
  setSubCategoryDetail,
} from "../../store/audio-category/audioCategory";
import CategoriesSkeleton from "../../components/skeletonPlaceholder/CategoriesSkeleton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useModal } from "../../context/ModalContext";
import { MeditationSessionModal } from "../../modules/modals/MeditationSessionModal";
import SmallPlayer from "../../components/small-player/SmallPlayer";
import { useLocale } from "../../context/LocaleProvider";
import SubscriptionModal from "../../components/subscriptionModal/SubscriptionModal";
import Loader from "../../components/loader/Loader";
import { getTransformedUrl } from "../../utils/ImageService";
import CongratulationsIcon from "../../assets/appImages/svgImages/CongratulationsIcon.svg";
import RNRestart from "react-native-restart";
import { COMING_SOON, NEW_AUDIOS_COMING_SOON } from "../../constants/errors";
import { storeLanguage } from "../../helpers/auth";
import { YEARLY, YEARLY_PROMO } from "../../constants/InAppPurchase";
import CongratsModal from "../../components/subscriptionModal/CongratulationsModal";
import { Backgrounds } from "../../data/background";
import { useNetInfoInstance } from "@react-native-community/netinfo";
import { useFocusEffect } from "@react-navigation/native";
import NetworkModal from "../../components/modal/NetworkModal";

const CategoriesScreen = ({ navigation, route }) => {
  const modal = useModal();
  const dispatch = useDispatch();
  const { changeLocale } = useLocale();
  const { top } = useSafeAreaInsets();
  const isAllAudio = route?.params?.isAllAudio;
  const data = route?.params?.browseByGoalItem;
  const { categorieItemId, isManageBrowseByGoal, browseByGoalItem } =
    route.params;

  const selectedLanguage = useSelector(
    (state) => state.language.selectedLanguage
  );

  const getOneCategoriesData = useSelector(
    (state) => state?.categories?.getOneCategoriesData
  );
  const isUserSubscribed = useSelector(
    (state) => state?.subscription?.isUserSubscribed
  );
  const { subCategoryDetail, selectedAudioDetails, allCategoryAudioList } =
    useSelector((state) => state?.subCategoryAudioReducer);

  const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false);
  const [BGImg, setBGImg] = useState(
    require("../../assets/appImages/ExploreBackgroundImageNew.png")
  );
  const [selectedGoalId, setSelectedGoalId] = useState();
  const [selectedGoalTitle, setSelectedGoalTitle] = useState(
    categorieItemId?.goal?.[0]?.title
  );
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allCategoryAudioLists, setAllCategoryAudioLists] = useState({});
  useEffect(() => {
    // setIsLoading(true);
    if (isManageBrowseByGoal) {
      dispatch(setSelectedAudioDetails({}));
      fetchGolsData(browseByGoalItem?.id);
    } else {
      fetchOneCategorie();
    }
  }, [isManageBrowseByGoal, selectedLanguage]);

  const fetchGolsData = async (id) => {
    try {
      const res = await fetchSigleGoal(id);
      const updatedAudios = res?.data?.response?.audios
        ?.filter(
          (audio) =>
            audio[`title_${selectedLanguage?.toUpperCase()}`] &&
            audio[`link_${selectedLanguage?.toUpperCase()}`]
        )
        .map((audio) =>
          getLocalizedContent(audio, selectedLanguage?.toUpperCase())
        )
        .filter((audio) => audio?.link && audio?.title);
      const data = {
        ...res?.data?.response,
        audios: updatedAudios,
      };
      const IMG = res?.data?.response?.category?.backgroundImage
        ? {
            uri: getTransformedUrl(
              res?.data?.response?.category?.backgroundImage
            ),
          }
        : require("../../assets/appImages/ExploreBackgroundImageNew.png");
      setBGImg(IMG);

      dispatch(setSubCategoryDetail(data));
    } catch (error) {
      console.error("error fetchGolsData =--->", error);
    } finally {
      setIsLoading(false); // Ensure isLoading is set to false after data is fetched
    }
  };

  const fetchOneCategorie = async () => {
    dispatch(setSelectedAudioDetails({}));
    try {
      const res = await getOneCategorie(categorieItemId);
      setGoals(res?.data?.subCategories);
      setAllCategoryAudioLists(res?.data?.allCategoriesAudios);
      setSelectedGoalId(res?.data?.subCategories[0]?.id);
      fetchGolsData(res?.data?.subCategories[0]?.id);
      const subCatName =
        res?.data?.subCategories[0]?.name_selectedLanguage?.toUpperCase() ||
        res?.data?.subCategories[0]?.name_EN ||
        res?.data?.subCategories[0]?.name;
      setSelectedGoalTitle(subCatName);
      dispatch(setOneCategoriesData(res?.data));
      const IMG = res?.data?.backgroundImage
        ? { uri: getTransformedUrl(res?.data?.backgroundImage) }
        : require("../../assets/appImages/ExploreBackgroundImageNew.png");
      setBGImg(IMG);
      const allCategoryAudioList =
        res?.data?.subCategories?.flatMap((item) =>
          item?.audios
            ?.filter(
              (audio) =>
                audio[`title_${selectedLanguage?.toUpperCase()}`] &&
                audio[`link_${selectedLanguage?.toUpperCase()}`]
            )
            .map((audio) =>
              getLocalizedContent(audio, selectedLanguage?.toUpperCase())
            )
            .filter((audio) => audio?.link && audio?.title)
        ) || [];
      dispatch(setAllCategoryAudioList(allCategoryAudioList));
    } catch (error) {
      console.log("error fetchOneCategorie =--->", error);
    } finally {
      console.log("Done");
      setIsLoading(false);
    }
  };

  const handleGoalSelect = (item) => {
    const audios =
      item?.audios
        ?.filter(
          (audio) =>
            audio[`title_${selectedLanguage?.toUpperCase()}`] &&
            audio[`link_${selectedLanguage?.toUpperCase()}`]
        )
        .map((audio) =>
          getLocalizedContent(audio, selectedLanguage?.toUpperCase())
        )
        .filter((audio) => audio?.link && audio?.title) || [];
    setSelectedGoalId(item?.id);
    setSelectedGoalTitle(
      item[`name_${selectedLanguage.toUpperCase()}`] ||
        item?.name_EN ||
        item?.name
    );
    dispatch(setSubCategoryDetail({ ...item, audios }));
  };

  // function convertData(inputData, selectedLanguage) {
  //   // Validate that selectedLanguage is not undefined and is a valid string
  //   const languageCode = selectedLanguage
  //     ? selectedLanguage.toUpperCase()
  //     : "EN";

  //   return inputData.map((item) => {
  //     // Accessing properties and applying fallback for missing data
  //     return {
  //       authorName: item?.authorName || "", // Fallback to empty string if undefined
  //       bannerImage: item?.bannerImage || "", // Fallback to empty string if undefined
  //       description: null, // As per your original logic, it's always null
  //       duration: item?.[`duration_${languageCode}`] || "", // If duration for selected language is not available, fallback to empty string
  //       id: item?.id || "", // Fallback to empty string if undefined
  //       link: item?.[`link_${languageCode}`] || "", // If link for selected language is not available, fallback to empty string
  //       premium: item?.premium || false, // If premium is missing, default to false
  //       tags: item?.tags || [], // Default to empty array if tags is undefined
  //       title: item?.[`title_${languageCode}`] || "", // If title for selected language is not available, fallback to empty string
  //     };
  //   });
  // }
  function convertData(inputData) {
    // Validate that selectedLanguage is not undefined and is a valid string
    const languageCode = selectedLanguage.toUpperCase();

    return inputData
      .map((item) => {
        // Build the object dynamically
        const duration = item?.[`duration_${languageCode}`];
        const link = item?.[`link_${languageCode}`];
        const title = item?.[`title_${languageCode}`];
        // If either duration or link is not valid, return null to discard this item
        if (!duration || !link || !title) {
          return null;
        }
        // Only include properties when valid (duration and link are required)
        return {
          authorName: item?.authorName || "", // Fallback to empty string if undefined
          bannerImage: item?.bannerImage || "", // Fallback to empty string if undefined
          description: null, // As per your original logic, it's always null
          duration: duration, // Valid duration for the selected language
          id: item?.id, // Fallback to empty string if undefined
          link: link, // Valid link for the selected language
          premium: item?.premium || false, // If premium is missing, default to false
          tags: item?.tags || [], // Default to empty array if tags is undefined
          title: item?.[`title_${languageCode}`] || "", // If title for selected language is not available, fallback to empty string
        };
      })
      .filter((item) => item !== null); // Remove any null values (objects that didn't pass the validation)
  }

  const manageBrowseByGoalOnPress = (item) => {
    try {
      if (!isUserSubscribed && item?.premium) {
        setOpenSubscriptionModal(true);
        return;
      }

      const audioList = !isManageBrowseByGoal
        ? allCategoryAudioList ?? []
        : subCategoryDetail?.audios ?? [];

      const findIndex = audioList.findIndex(
        (audio) => audio?.link === item?.link
      );

      const selectedItem = audioList[findIndex];
      modal.show(MeditationSessionModal, {
        track: selectedItem,
        playlist: audioList,
      });
    } catch (error) {
      console.error("error manageBrowseByGoalOnPress =--->", error);
    }
  };
  const allAudioPress = (item) => {
    try {
      if (!isUserSubscribed) {
        setOpenSubscriptionModal(true);
        return;
      }

      const audioList = !isManageBrowseByGoal
        ? allCategoryAudioList ?? []
        : subCategoryDetail?.audios ?? [];

      const findIndex = audioList.findIndex(
        (audio) => audio?.link === item?.link
      );

      // const selectedItem = {
      //   authorName: item?.authorName,
      //   bannerImage: item?.bannerImage,
      //   description: null,
      //   duration: item?.[`duration_${selectedLanguage?.toUpperCase()}`],
      //   id: item?.id,
      //   link: item?.[`link_${selectedLanguage?.toUpperCase()}`]
      //     ? item?.[`link_${selectedLanguage?.toUpperCase()}`]
      //     : item?.["link_EN"],
      //   premium: item?.premium,
      //   tags: [],
      //   title: item?.[`title_${selectedLanguage?.toUpperCase()}`]
      //     ? item?.[`title_${selectedLanguage?.toUpperCase()}`]
      //     : item?.[`title_EN`],
      // };
      const selectedItem = {
        authorName: item?.authorName,
        bannerImage: item?.bannerImage,
        description: null,
        duration: item?.duration,
        id: item?.id,
        link: item?.link,
        premium: item?.premium,
        tags: [],
        title: item?.title,
      };
      // console.log('data',convertData(data))
      modal.show(MeditationSessionModal, {
        track: selectedItem,
        playlist: convertData(data),
      });
    } catch (error) {
      console.error("error manageBrowseByGoalOnPress =--->", error);
    }
  };

  const formatSecondsToMinutes = (seconds) => {
    // return moment.utc(seconds * 1000).format("mm:ss");
    return seconds >= 3600
      ? moment.utc(seconds * 1000).format("HH:mm:ss")
      : moment.utc(seconds * 1000).format("mm:ss");
  };

  const [NetworkModalVisible, setNetworkModalvisible] = useState(true);
  const {
    netInfo: { type, isConnected },
    refresh,
  } = useNetInfoInstance();

  useFocusEffect(
    useCallback(() => {
      setNetworkModalvisible(true);
    }, [])
  );
  return (
    <Block flex={1}>
      {isLoading ? (
        <Block flex={1} style={{ paddingTop: top }}>
          <CategoriesSkeleton />
        </Block>
      ) : (
        <Block flex={1}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          <ImageBackground
            source={BGImg}
            resizeMode="stretch"
            style={[styles.bgImage, { paddingTop: top }]}
          >
            <Block flex={1} style={styles.mainView}>
              <Block
                row
                flex={false}
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <BackIcon height={32} width={32} />
                </TouchableOpacity>
                <Image
                  source={Backgrounds.nameLogo}
                  style={{
                    height: scaleSize(40),
                    width: scaleSize(51),
                    // alignSelf: "center",
                    marginBottom: 5,
                  }}
                />
                <TouchableOpacity
                  style={{
                    paddingHorizontal: perfectSize(20),
                    justifyContent: "center",
                    alignItems: "center",
                    width: 48,
                    height: 48,
                  }}
                  onPress={() => navigation.navigate("SearchScreen")}
                >
                  <SearchButton height={48} width={48} />
                </TouchableOpacity>
              </Block>
              {/* header View */}
              <Block
                flex={false}
                row
                between
                style={[
                  styles.headerContainer,
                  { marginBottom: isManageBrowseByGoal && scaleSize(5) },
                ]}
                center
              >
                <Text
                  medium
                  size={responsiveScale(32)}
                  style={{ letterSpacing: -1 }}
                  color={colors.white}
                  width={"60%"}
                  numberOfLines={1}
                >
                  {isManageBrowseByGoal
                    ? subCategoryDetail[
                        `name_${selectedLanguage.toUpperCase()}`
                      ] ||
                      subCategoryDetail?.name_EN ||
                      subCategoryDetail?.name
                    : browseByGoalItem[
                        `name_${selectedLanguage.toUpperCase()}`
                      ] ||
                      browseByGoalItem?.name_EN ||
                      browseByGoalItem?.name ||
                      "All Audios"}
                </Text>
                <Block flex={false}>
                  <CustomDropDown
                    onChange={async (lg) => {
                      await storeLanguage("SET", lg);
                      handleLanguageChange(lg, dispatch, changeLocale);
                      RNRestart.Restart();
                    }}
                  />
                </Block>
              </Block>
              {!isManageBrowseByGoal && (
                <Block
                  flex={false}
                  row
                  center
                  style={{
                    marginTop: isAllAudio ? scaleSize(0) : scaleSize(27),
                    marginBottom: isAllAudio ? scaleSize(0) : scaleSize(24),
                  }}
                >
                  <Block flex={false}>
                    {/* <Text
                      medium
                      size={responsiveScale(24)}
                      style={{ letterSpacing: -1 }}
                      color={colors.white}
                    >
                      {i18n.t("Explore")}
                    </Text> */}
                    {!isAllAudio && (
                      <TouchableOpacity
                        style={[
                          styles.goalItem,
                          {
                            backgroundColor:
                              selectedGoalId === -1
                                ? colors.white
                                : "#FFFFFF1A",
                          },
                        ]}
                        onPress={() =>
                          handleGoalSelect({
                            id: -1,
                            name: "All",
                            audios: allCategoryAudioLists,
                          })
                        }
                      >
                        <Text
                          medium
                          size={responsiveScale(24)}
                          style={{ letterSpacing: -1 }}
                          color={
                            selectedGoalId === -1 ? colors.black : colors.white
                          }
                        >
                          All
                        </Text>
                      </TouchableOpacity>
                    )}
                  </Block>
                  <FlatList
                    data={goals}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleGoalSelect(item)}>
                        <Block
                          flex={false}
                          style={[
                            styles.goalItem,
                            {
                              backgroundColor:
                                selectedGoalId === item?.id
                                  ? colors.white
                                  : "#FFFFFF1A",
                            },
                          ]}
                        >
                          <Text
                            center
                            medium
                            size={responsiveScale(18)}
                            color={
                              selectedGoalId === item?.id
                                ? colors.black
                                : colors.white
                            }
                          >
                            {item[`name_${selectedLanguage.toUpperCase()}`] ||
                              item?.name_EN ||
                              item?.name}
                          </Text>
                        </Block>
                      </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingLeft: perfectSize(10) }}
                  />
                </Block>
              )}
              {!isManageBrowseByGoal && !isAllAudio && (
                <Text regular size={responsiveScale(22)} color={colors.white}>
                  {i18n.t("Explore")} {selectedGoalTitle}
                </Text>
              )}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: perfectSize(30),
                }}
              >
                {isManageBrowseByGoal ? (
                  <Block flex={1} row center>
                    <FlatList
                      data={
                        isAllAudio
                          ? convertData(data)
                          : subCategoryDetail?.audios
                      }
                      scrollEnabled={false}
                      keyExtractor={(index) => index?.toString()}
                      numColumns={2}
                      columnWrapperStyle={styles.row}
                      renderItem={({ item }) => {
                        return (
                          <SuggestYourPlan
                            image={item?.bannerImage}
                            title={item?.title}
                            onPress={() => manageBrowseByGoalOnPress(item)}
                            duration={formatSecondsToMinutes(item?.duration)}
                            stylesProps={{
                              widthRatio: 0.43,
                              heightRatio: 1.42857,
                              textTitleSize: 15,
                            }}
                          />
                        );
                      }}
                      ListEmptyComponent={() => (
                        <ListEmptyComponent message={COMING_SOON} />
                      )}
                    />
                  </Block>
                ) : (
                  <Block flex={1} row center>
                    <FlatList
                      data={
                        isAllAudio
                          ? convertData(data)
                          : subCategoryDetail?.audios
                      }
                      keyExtractor={(item) => item?.title}
                      numColumns={2}
                      scrollEnabled={false}
                      columnWrapperStyle={styles.row}
                      renderItem={({ item }) => {
                        // console.log('item',item);
                        return (
                          <SuggestYourPlan
                            image={item?.bannerImage}
                            title={
                              // isAllAudio
                              //   ? item?.[
                              //       `title_${selectedLanguage?.toUpperCase()}`
                              //     ]
                              //   :
                              item?.title
                            }
                            isPremiumAudio={item?.premium}
                            onPress={() =>
                              isAllAudio
                                ? allAudioPress(item)
                                : manageBrowseByGoalOnPress(item)
                            }
                            duration={formatTime(
                              item?.duration * 1000
                              // (isAllAudio
                              //   ? item?.[
                              //       `duration_${selectedLanguage?.toUpperCase()}`
                              //     ]
                              //   :
                              //   item?.duration || 0) * 1000
                            )}
                            stylesProps={{
                              widthRatio: 0.43,
                              heightRatio: 1.42857,
                              textTitleSize: 15,
                            }}
                          />
                        );
                      }}
                      ListEmptyComponent={() => (
                        <ListEmptyComponent message={COMING_SOON} />
                      )}
                      ListFooterComponent={() => {
                        return <Block flex={false} height={perfectSize(80)} />;
                      }}
                    />
                  </Block>
                )}
              </ScrollView>
            </Block>
          </ImageBackground>
          {openSubscriptionModal && (
            <SubscriptionModal
              isVisible={openSubscriptionModal}
              hideModal={() => {
                setOpenSubscriptionModal(false);
              }}
              onSubscribedUser={(plan) => {
                setOpenSubscriptionModal(false);
                setTimeout(() => {
                  modal.show(CongratsModal, {
                    message:
                      plan == YEARLY || plan == YEARLY_PROMO
                        ? i18n.t("Year Plan Update")
                        : i18n.t("Month Plan Update"),
                    btnTitle: "Ok",
                  });
                }, 1000);
              }}
            />
          )}
        </Block>
      )}
      <SmallPlayer />

      <NetworkModal
        // isVisible={isConnected&&(!NetworkModalVisible)}
        isVisible={isConnected == false && NetworkModalVisible}
        refresh={refresh}
        onPress={() => {
          navigation.navigate("GettingOverplaylist", {
            showDownloadIcon: true,
          });
          setNetworkModalvisible(false);
        }}
      />
    </Block>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  mainView: {
    paddingTop: perfectSize(19),
    paddingHorizontal: perfectSize(20),
  },
  bgImage: {
    flex: 1,
  },
  headerContainer: {
    marginTop: perfectSize(15),
  },
  goalItem: {
    borderRadius: perfectSize(8),
    marginRight: perfectSize(10),
    paddingHorizontal: perfectSize(20),
    paddingVertical: perfectSize(10),
  },
  row: {
    justifyContent: "space-between",
    marginTop: perfectSize(25),
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: perfectSize(20),
  },
  bgImagemodel: { height: perfectSize(290), width: "100%" },

  modalView: {
    padding: perfectSize(20),
  },
  confettiContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },

  button: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: perfectSize(20),
  },
});
