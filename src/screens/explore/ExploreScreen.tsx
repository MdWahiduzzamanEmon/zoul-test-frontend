import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  View,
  SafeAreaView,
  Text as TextView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import SearchButton from "../../assets/appImages/svgImages/SearchButton";
import Categories from "../../components/categories/Categories";
import CustomDropDown from "../../components/customDropDown/CustomDropDown";
import ListEmptyComponent from "../../components/emptyComponent/EmptyComponent";
import FreeAudios from "../../components/freeAudios/FreeAudios";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import {
  getDailyWisdomToday,
  getGlobalContentExplore,
  getHoroscopeToday,
  getSubCategories,
} from "../../resources/baseServices/app";
import { setSubCategoriesData } from "../../store/storeAppData/categories";
import {
  perfectSize,
  responsiveScale,
  scaleFont,
  scaleSize,
} from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import {
  buildShortLinkForDailyWisdom,
  handleLanguageChange,
  setLastApiCallDate,
  sortDataByOrder,
} from "../../helpers/app";
import i18n from "../../translations/i18n";
import ExploreSkeleton from "../../components/skeletonPlaceholder/ExploreSkeleton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocale } from "../../context/LocaleProvider";
import DailyWisdom from "../../components/dailyWisdom/DailyWisdom";
import { Backgrounds } from "../../data/background";
import {
  testimonialSlides,
  whoWeAreSlides,
  zoulIntroSlides,
} from "../../utils/utils";
import { setIsDailyWisdom } from "../../store/audio-category/audioLink";
import Share from "react-native-share";
import RNRestart from "react-native-restart";
import {
  COMING_SOON,
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
  NEW_AUDIOS_COMING_SOON,
} from "../../constants/errors";
import HoroscopeView from "../../components/horoscopeView/HoroscopeView";
import useDynamicLinkHandler from "../../hooks/useDynamicLinkHandler";
import { getUserProfile } from "../../resources/baseServices/auth";
import { setUserProfile } from "../../store/user/user";
import { ErrorDialog } from "../../components/modal/Modal";
import { useModal } from "../../context/ModalContext";
import { useFocusEffect } from "@react-navigation/native";
import {
  persistHoroscopeData,
  setDailyWisdomData,
} from "../../store/storeAppData/dailyWisdom";
import { formatDateISO } from "../../constants/languages";
import { storeLanguage } from "../../helpers/auth";
import { useNetInfoInstance } from "@react-native-community/netinfo";
import LogoIcon from "../../components/common/SvgIcons/LogoIcon";
import { LandingLogo } from "../../icons/landing/landing-logo";
import NetworkModal from "../../components/modal/NetworkModal";

const ExploreScreen = ({ navigation }) => {
  const modal = useModal();
  const scrollViewRef = useRef(null); // Ref for the ScrollView
  // const dailyWisdomRef = useRef(null);
  const [categoriesData, setCategoriestsData] = useState([]);
  const [extraPlaylistData, setExtraPlaylistData] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [masterPlayListData, setMasterPlayListData] = useState([]);
  const [isGlobalContentLoading, setIsGlobalContentLoading] = useState(false);
  const [isSubCategoriesLoading, setIsSubCategoriesLoading] = useState(false);
  const [dailyWisdomPosition, setDailyWisdomPosition] = useState(null);
  const [allAudio, setAllAudio] = useState({});
  const [allCategoryAudio, setAllCategoryAudio] = useState({});
  const [goalsData, setGoalsData] = useState([]);
  const [goalsData1, setGoalsData1] = useState([]);
  const [goalsData2, setGoalsData2] = useState([]);
  const dispatch = useDispatch();
  const { changeLocale } = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const { top } = useSafeAreaInsets();
  const { horoscopeData, fetchHoroscopeData } = useDynamicLinkHandler({});
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const user = useSelector((state) => state?.userReducer?.userProfile);

  const isDailyWisdomLink = useSelector(
    (state) => state?.audioLinkReducer?.isDailyWisdom
  );

  const recentlyPlayedAudios = useSelector(
    (state) => state?.recentlyPlayedAudiosReducer?.recentlyPlayedAudios
  );

  const getDailyWisdomData = useSelector(
    (state) => state?.dailyWisdomReducer?.getDailyWisdomData
  );

  const { recentlyPlayedPlaylistsBannerImage } = useSelector(
    (state) => state?.playlistsReducer
  );

  const horoscopeReminder = useSelector(
    (state) => state?.settingReducer?.userHoroscopeReminders
  );

  const isHoroscopeDeeplink = useSelector(
    (state) => state?.audioLinkReducer?.isHoroscopeDeeplink
  );
  const isUserSubscribed = useSelector(
    (state) => state?.subscription?.isUserSubscribed
  );

  useEffect(() => {
    if (isDailyWisdomLink && dailyWisdomPosition > 0) {
      scrollViewRef.current?.scrollTo({
        y: dailyWisdomPosition,
        animated: true,
      });
      setTimeout(() => {
        dispatch(setIsDailyWisdom(false));
      }, 500);
    }
  }, [dailyWisdomPosition, isDailyWisdomLink]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchExploreData(), fetchSubCategories()]);
      } catch (error) {
        console.log("Error in fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchHoroscope = async () => {
      try {
        if (isHoroscopeDeeplink && Object.keys(user).length > 0) {
          await fetchHoroscopeData();
        }
      } catch (error) {
        console.error("error fetchAudio =---> Home", error);
      }
    };
    fetchHoroscope();
  }, [isHoroscopeDeeplink, user]);

  const fetchDailyWisdomToday = async (user) => {
    try {
      const res = await getDailyWisdomToday();
      dispatch(setDailyWisdomData(res?.data));
      if (user?.zodiacSign) {
        const horoscopeRes = await getHoroscopeToday(formatDateISO(new Date()));
        dispatch(persistHoroscopeData(horoscopeRes.data[0][user?.zodiacSign]));
      }
      setLastApiCallDate(new Date().toISOString());
    } catch (error) {
      console.log("error fetchDailyWisdomToday =--->", error);
    } finally {
      console.log("Done: fetchDailyWisdomToday");
    }
  };

  const handleUserProfile = useCallback(async () => {
    try {
      const res = await getUserProfile();
      if (res?.status == 200) {
        dispatch(setUserProfile(res?.data));
        fetchDailyWisdomToday(res?.data);
      }
    } catch (error) {
      console.error("error handleUserProfile =--->", error);
      modal.show(ErrorDialog, {
        messageTitle:
          error?.response?.data?.errorTitle ??
          ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
        message:
          error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleUserProfile();
    }, [handleUserProfile])
  );

  const fetchExploreData = async () => {
    setIsGlobalContentLoading(true);
    try {
      const res = await getGlobalContentExplore();
      const sortedCategories = sortDataByOrder(res?.data?.categories);
      setCategoriestsData(sortedCategories);
      setExtraPlaylistData(res?.data?.extraPlaylist);
      setMasterPlayListData(res?.data?.masterChoicePlaylist);
      const sortedGoals = sortDataByOrder(res?.data?.goals);
      setAllAudio(res?.data?.allgoalAudios);
      setAllCategoryAudio(res?.data?.allCategoriesAudios);
      setGoalsData(sortedGoals);
      const length = sortedGoals.length;

      // Ensure firstHalfSize is always even
      let firstHalfSize = Math.floor(length / 2);
      if (firstHalfSize % 2 !== 0) {
        firstHalfSize += 1; // Make it even
      }

      const firstHalf = sortedGoals.slice(0, firstHalfSize);
      const secondHalf = sortedGoals.slice(firstHalfSize);

      setGoalsData1(firstHalf);
      setGoalsData2(secondHalf);
    } catch (error) {
      console.log("error fetchExploreData =--->", error);
    } finally {
      setIsGlobalContentLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    setIsSubCategoriesLoading(true);
    try {
      const res = await getSubCategories();
      dispatch(setSubCategoriesData(res?.data?.response));
    } catch (error) {
      console.log("error fetchSubCategories =--->", error);
    } finally {
      setIsSubCategoriesLoading(false);
    }
  };

  const selectedLanguage = useSelector(
    (state) => state?.language?.selectedLanguage
  );

  const handleHoroscopeReadNow = () => {
    try {
      user?.birthDate
        ? navigation.navigate("HoroscopeDetailScreen")
        : navigation.navigate("BirthDayDetail", {
            isExplore: true,
            birthday: user?.birthDate,
            horoscopeReminder: horoscopeReminder,
          });
    } catch (error) {
      console.error("Error handleHoroscopeReadNow", error);
    }
  };

  useEffect(() => {
    if (horoscopeData !== null && horoscopeData !== undefined) {
      handleHoroscopeReadNow();
    }
  }, [horoscopeData]);

  const shareImage = async () => {
    try {
      setIsSharing(true);

      // Define a local path for the image in the Document Directory
      // const localImagePath = `${RNFS.DocumentDirectoryPath}/ZoulWisdom.png`;

      // URL of the image to be downloaded
      const imageUrl = getDailyWisdomData?.image;

      const shareLink = await buildShortLinkForDailyWisdom(
        "Daily Wisdom",
        imageUrl
      );

      const shareOptions = {
        message: shareLink,
      };

      // const dynamicUrl = "https://zoul.page.link/6BG2?isDailyWisdom=true";

      // Download the image to the local path
      // const downloadResult = await RNFS.downloadFile({
      //   fromUrl: imageUrl,
      //   toFile: localImagePath,
      // }).promise;
      // console.log("Image downloaded to local path:", localImagePath);

      const result = await Share.open(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }

      // if (downloadResult.statusCode === 200) {
      //   // Read the image file as a base64 string
      //   const imageBase64 = await RNFS.readFile(localImagePath, "base64");

      //   // Share the image
      //   const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      //   await Share.open({
      //     url: `data:image/png;base64,${imageBase64}`,
      //     type: "image/png",
      //     filename: `DailyWisdom_${currentDate}`,
      //     message: `Check out today's wisdom: ${dynamicUrl}`,
      //   });
      // } else {
      //   console.error(
      //     "Failed to download image, status code:",
      //     downloadResult.statusCode
      //   );
      // }
    } catch (error) {
      console.error("Error sharing image: ", error);
    } finally {
      setIsSharing(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <Categories
      label={
        item[`name_${selectedLanguage?.toUpperCase()}`] ||
        item?.name_EN ||
        item?.name
      }
      image={item.coverImage}
      index={index}
      browseByGoal={true}
      browseByGoalOnPress={() => {
        navigation.navigate("CategoriesScreen", {
          isManageBrowseByGoal: true,
          browseByGoalItem: item,
        });
      }}
    />
  );

  const renderCategories = ({ item, index }) => (
    <Categories
      label={
        item[`name_${selectedLanguage?.toUpperCase()}`] ||
        item?.name_EN ||
        item?.name
      }
      image={item.coverImage}
      index={index}
      // browseByGoal={true}
      onPress={() => {
        navigation.navigate("CategoriesScreen", {
          categorieItemId: item?.id,
          browseByGoalItem: item,
        });
      }}
    />
  );

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
    // isConnected?
    <Block flex={1}>
      {isLoading ? (
        <Block flex={1} style={{ paddingTop: top }}>
          <ExploreSkeleton />
        </Block>
      ) : (
        <Block flex={1}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <ImageBackground
            source={require("../../assets/appImages/ExploreBackgroundImageNew.png")}
            resizeMode="stretch"
            style={[styles.bgImage, { paddingTop: top }]}
          >
            <Block
              flex={1}
              paddingHorizontal={perfectSize(20)}
              paddingTop={perfectSize(19)}
            >
              {/* header View */}
              <Block flex={false}>
                <Block
                  flex={false}
                  row
                  between
                  style={{
                    paddingRight: perfectSize(20),
                    paddingLeft: perfectSize(14),
                    justtifyContent: "space-between",
                    alignItems: "center",
                  }}
                  center
                >
                  <TouchableOpacity
                    style={{ height: 32, width: 32 }}
                    disabled={true}
                    // onPress={() => navigation.goBack()}
                  >
                    {/* <BackIcon height={32} width={32} /> */}
                  </TouchableOpacity>

                  {/* <LogoIcon height={23} width={26} /> */}

                  <Block
                    flex={false}
                    style={{
                      marginLeft: 12,
                    }}
                  >
                    <LandingLogo
                      color={colors.logoColor}
                      height={perfectSize(60)}
                      width={perfectSize(100)}
                    />
                  </Block>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SearchScreen")}
                  >
                    <SearchButton height={48} width={48} />
                  </TouchableOpacity>
                </Block>
                <Block flex={false} row between style={styles.headerContainer}>
                  <Text
                    width={"60%"}
                    regular
                    size={responsiveScale(36)}
                    weight={400}
                    style={{ letterSpacing: -1 }}
                    color={colors.white}
                  >
                    {i18n.t("Explore")}
                  </Text>

                  <Block flex={false} center middle marginTop={perfectSize(12)}>
                    <CustomDropDown
                      onChange={async (lg: any) => {
                        await storeLanguage("SET", lg);
                        handleLanguageChange(lg, dispatch, changeLocale);
                        RNRestart.Restart();
                      }}
                    />
                  </Block>
                </Block>
              </Block>
              <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: perfectSize(30),
                }}
              >
                {goalsData?.length > 0 ? (
                  <Block
                    row
                    between
                    flex={false}
                    style={{ alignItems: "center" }}
                    marginTop={perfectSize(23)}
                  >
                    <Text
                      regular
                      size={scaleSize(24)}
                      weight={400}
                      color={colors.white}
                      numberOfLines={2}
                      style={{ width: SCREEN_WIDTH * 0.6 }}
                    >
                      {i18n.t("Browse by Goal")}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("CategoriesScreen", {
                          isManageBrowseByGoal: false,
                          browseByGoalItem: allAudio,
                          isAllAudio: true,
                        });
                      }}
                    >
                      <Text
                        size={scaleSize(18)}
                        color={colors.white}
                        numberOfLines={2}
                        style={{
                          width: SCREEN_WIDTH * 0.25,
                          textAlign: "right",
                        }}
                      >
                        {i18n.t("View All")}
                      </Text>
                    </TouchableOpacity>
                  </Block>
                ) : null}
                <Block flex={false}>
                  {isSubCategoriesLoading ? (
                    <Block flex={1} center middle margin={[perfectSize(40)]}>
                      <ActivityIndicator size="large" color={colors.white} />
                    </Block>
                  ) : goalsData?.length > 0 ? (
                    <>
                      <FlatList
                        data={goalsData1}
                        numColumns={2}
                        renderItem={renderItem}
                        keyExtractor={(item) => item?.id}
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoriesList}
                        ListEmptyComponent={() => (
                          <ListEmptyComponent message={COMING_SOON} />
                        )}
                        ListFooterComponent={() => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate("CategoriesScreen", {
                                  isManageBrowseByGoal: false,
                                  browseByGoalItem: allAudio,
                                  isAllAudio: true,
                                });
                              }}
                              style={{
                                width: "100%",
                                height: responsiveScale(70),
                                borderRadius: responsiveScale(8),
                              }}
                            >
                              <ImageBackground
                                source={Backgrounds.viewAllImg}
                                resizeMode="stretch"
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  medium
                                  size={scaleSize(20)}
                                  color={colors.white}
                                  numberOfLines={2}
                                  style={{ width: SCREEN_WIDTH * 0.3 }}
                                >
                                  {i18n.t("View All")}
                                </Text>
                              </ImageBackground>
                            </TouchableOpacity>
                          );
                        }}
                      />
                      <FlatList
                        data={goalsData2}
                        numColumns={2}
                        renderItem={renderItem}
                        keyExtractor={(item) => item?.id}
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoriesList}
                        ListEmptyComponent={() => (
                          <ListEmptyComponent message={COMING_SOON} />
                        )}
                      />
                    </>
                  ) : null}
                </Block>
                <Block flex={false} style={[styles.divider]} />
                {/* Categories View */}
                {categoriesData?.length > 0 ? (
                  <Block flex={false} style={styles.categoriesContainer}>
                    {categoriesData?.length > 0 ? (
                      <Block
                        row
                        between
                        flex={false}
                        style={{ alignItems: "center" }}
                      >
                        <Text
                          regular
                          size={scaleSize(24)}
                          color={colors.white}
                          numberOfLines={2}
                          style={{ width: SCREEN_WIDTH * 0.6 }}
                        >
                          {i18n.t("Browse by Categories")}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("CategoriesScreen", {
                              isManageBrowseByGoal: false,
                              browseByGoalItem: allCategoryAudio,
                              isAllAudio: true,
                            });
                          }}
                        >
                          <Text
                            size={scaleSize(18)}
                            color={colors.white}
                            numberOfLines={2}
                            style={{
                              width: SCREEN_WIDTH * 0.25,
                              textAlign: "right",
                            }}
                          >
                            {i18n.t("View All")}
                          </Text>
                        </TouchableOpacity>
                      </Block>
                    ) : null}

                    {isGlobalContentLoading ? (
                      <Block flex={1} center middle margin={[perfectSize(40)]}>
                        <ActivityIndicator size="large" color={colors.white} />
                      </Block>
                    ) : categoriesData?.length > 0 ? (
                      <>
                        <FlatList
                          data={categoriesData}
                          numColumns={2}
                          renderItem={renderCategories}
                          keyExtractor={(item) => item?.id}
                          showsHorizontalScrollIndicator={false}
                          style={styles.categoriesList}
                          ListEmptyComponent={() => (
                            <ListEmptyComponent message={COMING_SOON} />
                          )}
                          ListFooterComponent={() => {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate("CategoriesScreen", {
                                    isManageBrowseByGoal: false,
                                    browseByGoalItem: allCategoryAudio,
                                    isAllAudio: true,
                                  });
                                }}
                                style={{
                                  width: "100%",
                                  height: responsiveScale(70),
                                  borderRadius: responsiveScale(8),
                                }}
                              >
                                <ImageBackground
                                  source={Backgrounds.viewAllImg}
                                  resizeMode="stretch"
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Text
                                    medium
                                    size={scaleSize(20)}
                                    color={colors.white}
                                  >
                                    {i18n.t("View All")}
                                  </Text>
                                </ImageBackground>
                              </TouchableOpacity>
                            );
                          }}
                        />
                        <Block flex={false} style={[styles.divider]} />
                      </>
                    ) : null}
                  </Block>
                ) : null}
                {/* Master Choice Playlists */}
                {masterPlayListData?.length > 0 ? (
                  <Block
                    flex={false}
                    // marginTop={scaleSize(15)}
                    marginTop={scaleSize(26)}
                    // paddingHorizontal={perfectSize(8)}
                    // style={{}}
                  >
                    {masterPlayListData?.length > 0 ? (
                      <>
                        <Block
                          flex={false}
                          row
                          center
                          // gap={7}
                          // paddingHorizontal={perfectSize(28)}
                        >
                          <Block
                            // flex={false}
                            row
                            center
                            gap={7}
                            // paddingHorizontal={perfectSize(28)}
                          >
                            <LogoIcon height={23} width={26} />
                            <Text
                              regular
                              size={responsiveScale(20)}
                              color={colors.white}
                              style={[
                                styles.masterText,
                                { width: SCREEN_WIDTH * 0.8 },
                              ]}
                              numberOfLines={2}
                            >
                              {i18n.t("Goal-Based Playlists")}
                              {/* {i18n.t("Master Choice Playlists")} */}
                            </Text>
                          </Block>
                        </Block>
                      </>
                    ) : null}
                    {isGlobalContentLoading ? (
                      <Block flex={1} center middle margin={[perfectSize(40)]}>
                        <ActivityIndicator size="large" color={colors.white} />
                      </Block>
                    ) : masterPlayListData?.length > 0 ? (
                      <>
                        <FlatList
                          data={masterPlayListData}
                          style={{
                            marginTop: perfectSize(20),
                            // position: "absolute",
                          }}
                          ItemSeparatorComponent={
                            <View style={{ height: perfectSize(15) }} />
                          }
                          renderItem={({ item }) => {
                            const title =
                              item?.[
                                `title_${selectedLanguage?.toUpperCase()}`
                              ] ||
                              item?.title_EN ||
                              item?.title;

                            const description =
                              item?.[
                                `description_${selectedLanguage?.toUpperCase()}`
                              ] ||
                              item?.description_EN ||
                              item?.description;
                            // console.log("My item in explore:", item);
                            return (
                              <FreeAudios
                                title={title}
                                image={item?.coverImage}
                                isDescription={true}
                                isPremium={!isUserSubscribed}
                                description={description}
                                onPress={() => {
                                  navigation.navigate("GettingOverplaylist", {
                                    item,
                                    isExploreMasterChoice: true,
                                  });
                                }}
                                extraMainViewStyle={{
                                  // marginBottom: perfectSize(30),
                                  paddingLeft: perfectSize(10),
                                }}
                                extraplaylistContainerStyle={{
                                  marginTop: perfectSize(0),
                                }}
                                extraTitleStyle={{
                                  fontSize: scaleSize(20),
                                  // lineHeight: scaleSize(20),
                                }}
                                numberOfLines={3}
                                fromExplore={true}
                              />
                            );
                          }}
                          keyExtractor={(item) => item?.id}
                          showsHorizontalScrollIndicator={false}
                          ListEmptyComponent={() => (
                            <ListEmptyComponent message={COMING_SOON} />
                          )}
                        />
                        <Block flex={false} style={[styles.divider]} />
                      </>
                    ) : null}
                  </Block>
                ) : null}

                {/* <Block flex={false} style={[styles.divider]} /> */}

                {/* Divider View */}

                <DailyWisdom
                  // ref={dailyWisdomRef}
                  getDailyWisdomData={getDailyWisdomData}
                  isSharing={isSharing}
                  shareImage={shareImage}
                  onLayout={(event) => {
                    const { y } = event.nativeEvent.layout; // Capture position
                    setDailyWisdomPosition(y);
                  }}
                />

                <Block flex={false} style={[styles.divider]} />

                {/* extra playlists */}
                {extraPlaylistData?.length > 0 && (
                  <>
                    <Block flex={false} paddingHorizontal={perfectSize(8)}>
                      <FlatList
                        data={extraPlaylistData}
                        ItemSeparatorComponent={
                          <View style={{ height: perfectSize(15) }} />
                        }
                        renderItem={({ item }) => {
                          const title =
                            item?.[
                              `title_${selectedLanguage?.toUpperCase()}`
                            ] ||
                            item?.title_EN ||
                            item?.title;

                          // const description =
                          //   item?.[
                          //     `description_${selectedLanguage?.toUpperCase()}`
                          //   ] ||
                          //   item?.description_EN ||
                          //   item?.description;
                          return (
                            <FreeAudios
                              title={title}
                              numberOfLines={3}
                              isDescription={false}
                              // description={description}
                              image={item.image}
                              extraplaylistContainerStyle={{
                                marginTop: perfectSize(0),
                              }}
                              extraTitleStyle={{
                                fontSize: scaleSize(20),
                                // lineHeight: scaleSize(20),
                              }}
                              onPress={() => {
                                // if (isUserSubscribed) {
                                navigation.navigate("GettingOverplaylist", {
                                  item,
                                });
                                // } else {
                                //   setOpenSubscriptionModal(true);
                                // }
                              }}
                            />
                          );
                        }}
                        keyExtractor={(item) => item?.id}
                        showsHorizontalScrollIndicator={false}
                      />
                    </Block>
                    <Block flex={false} style={[styles.divider]} />
                  </>
                )}

                {/* <LineDivider gapUnder={false} /> */}
                {/* Recently Played View*/}
                {recentlyPlayedAudios?.audios?.length > 0 && (
                  <>
                    {/* <Block style={styles.recentlyPlayedContainer}> */}
                    <FreeAudios
                      title={i18n.t("Recently Played")}
                      image={
                        recentlyPlayedPlaylistsBannerImage ??
                        recentlyPlayedAudios?.audios[0]?.bannerImage
                      }
                      isDescription={false}
                      noPlayIcon={true}
                      extraplaylistContainerStyle={{
                        width: "100%",
                        borderRadius: 0,
                      }}
                      extraTitleStyle={{
                        fontSize: scaleSize(20),
                        // lineHeight: scaleSize(20),
                      }}
                      extraMainViewStyle={{
                        marginTop: perfectSize(25),
                        // borderRadius: perfectSize(10),
                      }}
                      onPress={() => {
                        // if (isUserSubscribed) {
                        navigation.navigate("GettingOverplaylist", {
                          isRecentlyPlayed: true,
                        });
                        // } else {
                        //   setOpenSubscriptionModal(true);
                        // }
                      }}
                    />
                    {/* </Block> */}
                    <Block flex={false} style={[styles.divider]} />
                  </>
                )}

                {/* <HoroscopeView user={user} onRead={handleHoroscopeReadNow} /> */}

                {/* <Block flex={false} style={[styles.divider]} /> */}

                <TouchableOpacity
                  style={{
                    marginTop: scaleSize(24),
                    width: SCREEN_WIDTH * 0.9,
                  }}
                  onPress={() =>
                    navigation.navigate("Testimonial", {
                      separatedSlides: testimonialSlides,
                    })
                  }
                >
                  {/* <Text
                    regular
                    color={colors.white}
                    style={{ marginBottom: scaleSize(20) }}
                    size={responsiveScale(24)}
                  >
                    What Users Say
                  </Text> */}
                  <ImageBackground
                    source={Backgrounds.What_User_Say}
                    style={{
                      aspectRatio: 16 / 12,
                      width: SCREEN_WIDTH * 0.9,
                      borderRadius: 8,
                      overflow: "hidden",
                      padding: scaleSize(15),
                      paddingTop: scaleSize(17),
                      justifyContent: "center",
                    }}
                    resizeMode="contain"
                  >
                    <Text
                      regular
                      color={colors.white}
                      style={{ marginBottom: scaleSize(20) }}
                      size={responsiveScale(20)}
                    >
                      {i18n.t("What Users Say")}
                    </Text>
                    {/* <Text
                      light
                      color={colors.white}
                      style={{
                        marginBottom: scaleSize(20),
                        maxWidth: "80%",
                        alignSelf: "centre",
                      }}
                      size={responsiveScale(13)}
                    >
                      {i18n.t("I left it on all")}
                    </Text> */}
                    <TextView
                      style={{
                        fontSize: scaleSize(15),
                        // alignSelf:"center",
                        maxWidth: "85%",
                        marginBottom: scaleSize(20),
                        color: colors.white,
                      }}
                      numberOfLines={6}
                    >
                      {i18n.t("I left it on all")}
                    </TextView>
                    <Text
                      italic
                      color={colors.white}
                      style={{ marginBottom: scaleSize(20), maxWidth: "80%" }}
                      size={responsiveScale(11)}
                    >
                      {i18n.t("Fahad")}
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>

                <Block
                  flex={false}
                  row
                  // style={{ paddingHorizontal: perfectSize(28) }}
                  style={{
                    width: SCREEN_WIDTH * 0.9,
                    justifyContent: "space-between",
                    marginTop: scaleSize(9),
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Testimonial", {
                        separatedSlides: zoulIntroSlides,
                      })
                    }
                    // style={{
                    //   borderWidth: 2,
                    //   borderColor: "rgba(255, 255, 255, 0.8)",
                    //   borderRadius: 100,
                    //   paddingVertical: perfectSize(10),
                    //   marginTop: perfectSize(24),
                    // }}
                    style={{
                      width: SCREEN_WIDTH * 0.44,
                      height: scaleSize(49),
                      borderRadius: scaleSize(6),
                    }}
                  >
                    <ImageBackground
                      source={Backgrounds.What_Zoul_is}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: scaleSize(6),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      resizeMode="cover"
                    >
                      <TextView
                        style={{
                          fontSize: scaleSize(20),
                          color: colors.white,
                          textAlign: "center",
                          fontFamily: font.regular,
                          // flexWrap:"wrap"
                          // alignSelf:"center"
                          maxWidth: "85%",
                        }}
                        adjustsFontSizeToFit={true}
                      >
                        {i18n.t("What Zoul Is")}
                      </TextView>
                    </ImageBackground>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Testimonial", {
                        separatedSlides: whoWeAreSlides,
                      })
                    }
                    // style={{
                    //   borderWidth: 2,
                    //   borderColor: "rgba(255, 255, 255, 0.8)",
                    //   borderRadius: 100,
                    //   paddingVertical: perfectSize(10),
                    //   marginTop: perfectSize(24),
                    // }}
                    style={{
                      width: SCREEN_WIDTH * 0.44,
                      height: scaleSize(49),
                      borderRadius: scaleSize(6),
                    }}
                  >
                    <ImageBackground
                      source={Backgrounds.Who_we_are}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: scaleSize(6),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      resizeMode="cover"
                    >
                      <TextView
                        style={{
                          fontSize: scaleSize(20),
                          color: colors.white,
                          textAlign: "center",
                          fontFamily: font.regular,
                          // flexWrap:"wrap"
                          // alignSelf:"center"
                          maxWidth: "85%",
                        }}
                        adjustsFontSizeToFit={true}
                      >
                        {i18n.t("Who we are")}
                      </TextView>
                    </ImageBackground>
                  </TouchableOpacity>
                </Block>

                {/* <Block flex={false} height={perfectSize(80)} /> */}
              </ScrollView>
            </Block>
          </ImageBackground>
        </Block>
      )}

      {/* {openSubscriptionModal && (
        <SubscriptionModal
          isVisible={openSubscriptionModal}
          hideModal={() => {
            setOpenSubscriptionModal(false);
          }}
        />
      )} */}

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
    // :
    //  (
    //   <View style={{ flex: 1 }}>
    //     <StatusBar
    //       translucent
    //       backgroundColor="#00000099"
    //       barStyle="light-content"
    //     />
    //     <ImageBackground
    //       source={require("../../assets/appImages/ExploreBackgroundImageWithIcon.png")}
    //       resizeMode="stretch"
    //       style={[styles.bgImage, { paddingTop: top }]}
    //     >
    //       <SafeAreaView style={{ flex: 1 }}>
    //         <ImageBackground
    //           style={{ height: "100%", width: "100%" }}
    //           source={Backgrounds.NoNetworkBg2}
    //         >
    //           <View
    //             style={{
    //               height: "100%",
    //               width: "100%",
    //               alignItems: "center",
    //               justifyContent: "flex-end",
    //               backgroundColor: "#00000099",
    //             }}
    //           >
    //             <View
    //               style={{
    //                 height: 200,
    //                 width: "100%",
    //                 backgroundColor: "black",
    //                 alignItems: "flex-start",
    //                 justifyContent: "space-evenly",
    //                 borderTopLeftRadius: scaleSize(30),
    //                 borderTopRightRadius: scaleSize(30),
    //                 paddingHorizontal: scaleSize(20),
    //                 //  marginBottom:scaleSize(50),
    //               }}
    //             >
    //               <Text color={"white"} bold size={scaleSize(20)}>
    //                 Connect to the internet{" "}
    //               </Text>
    //               <Text color={"white"} regular size={scaleSize(14)}>
    //                 You're offline. Check your connection{" "}
    //               </Text>
    //               <TouchableOpacity
    //               onPress={()=>{refresh()}}
    //                 style={{
    //                   width: SCREEN_WIDTH * 0.8,
    //                   alignSelf: "center",
    //                   alignItems: "center",
    //                   justifyContent: "center",
    //                   borderRadius: scaleSize(25),
    //                   height: scaleSize(50),
    //                   backgroundColor: "white",
    //                 }}
    //               >
    //                 <Text color={"black"} semibold size={scaleSize(16)}>
    //                   Retry
    //                 </Text>
    //               </TouchableOpacity>
    //             </View>
    //           </View>
    //         </ImageBackground>
    //       </SafeAreaView>
    //     </ImageBackground>
    //   </View>
    // )
  );
};
export default ExploreScreen;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: perfectSize(4),
  },
  categoriesContainer: {
    marginTop: scaleSize(25),
  },
  categoriesList: {
    marginTop: perfectSize(20),
  },
  divider: {
    width: "100%",
    height: perfectSize(1),
    marginTop: scaleSize(24),
    alignSelf: "center",
    backgroundColor: colors.white,
  },
  recentlyPlayedContainer: {
    // paddingHorizontal: perfectSize(8),
  },
  searchBtnView: {
    paddingHorizontal: perfectSize(20),
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
  },
  tipImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: perfectSize(23),
    marginRight: perfectSize(22),
    marginTop: scaleSize(20),
    overflow: "hidden",
  },
  tipImage: {
    width: "100%",
    aspectRatio: 1,
    height: undefined,
    borderRadius: 8,
  },
});
