import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addAudioToRecentlyPlayed,
  fetchRecentlyPlayedAudios,
} from "../resources/baseServices/app";
import { setAudioToRecentlyPlayed } from "../store/storeAppData/actions/recentlyPlayedAudiosAction";
import { setLanguage } from "../store/auth";
import i18n, { changeLanguage } from "../translations/i18n";
import { I18nManager } from "react-native";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import RNFS from "react-native-fs";
import { setDownloadAudioListsData } from "../store/storeAppData/playlists";
import moment, { duration } from "moment";
import _ from "lodash";
import RNRestart from "react-native-restart";

export const handleRecentlyPlayedAudios = (dispatch, audioID) => {
  try {
    addAudioToRecentlyPlayed(audioID)
      .then((res) => {
        fetchRecentlyPlayedAudios()
          .then((res) => {
            dispatch(setAudioToRecentlyPlayed(res.data));
          })
          .catch((error) => {
            console.error("error API: getRecentlyPlayedAudios", error);
          });
      })
      .catch((error) => {
        console.error("error API: addAudioToRecentlyPlayed", error);
      });
  } catch (error) {
    console.error("error: handle Recently Played Audios =--->", error);
  }
};

export const sortDataByOrder = (data) => {
  return data.sort((a, b) => a.order - b.order);
};

export const getLastApiCallDate = async () => {
  return await AsyncStorage.getItem("lastApiCallDate");
};

export const setLastApiCallDate = async (date) => {
  await AsyncStorage.setItem("lastApiCallDate", date);
};

export const isToday = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  return today.toDateString() === date.toDateString();
};

export const handleLanguageChange = async (
  language,
  dispatch,
  changeLocale,
  isFromIntro
) => {
  dispatch(setLanguage(language));
  await changeLanguage(language);
  I18nManager.forceRTL(language === "ar");
  changeLocale(language);
  if (!isFromIntro && isFromIntro != undefined) {
    RNRestart.Restart();
  }
  // RNRestart.Restart();
};
export async function promoCodeLink() {
  // const link = `https://zoul.page.link/?promocode=Zoul`;
  const link = `https://zoul.page.link/?promocode=TEST-D9R2DW`; // --- redeemable promo code

  const shortLink = await dynamicLinks().buildShortLink(
    {
      link,
      domainUriPrefix: `https://zoul.page.link`,
      android: {
        packageName: "com.zoul.app",
      },
      ios: {
        bundleId: "com.zoul.app",
        appStoreId: "6502774439",
      },
      social: {
        title: "Zoul App Promo Code",
      },
    },
    dynamicLinks.ShortLinkType.DEFAULT
  );
  return shortLink;
}
export async function buildShortLink(
  title,
  imageUrl,
  audioID,
  selectedLanguage
) {
  // First ensure the imageUrl is HTTPS
  const secureImageUrl = imageUrl?.toLowerCase().startsWith("https://")
    ? imageUrl
    : null; // You might want to provide a default HTTPS image URL here

  const link = `https://zoul.page.link/?audioID=${audioID}&language=${selectedLanguage}`;
  try {
    const shortLink = await dynamicLinks().buildShortLink(
      {
        link: link,
        domainUriPrefix: "https://zoul.page.link",
        android: {
          packageName: "com.zoul.app",
          fallbackUrl: link, // Fallback URL if app isn't installed
        },
        ios: {
          bundleId: "com.zoul.app",
          appStoreId: "6502774439",
          fallbackUrl: link, // Fallback URL if app isn't installed
        },
        social: {
          title: title,
          descriptionText: title, // Adding description can help
          imageUrl: secureImageUrl,
        },
        // Use navigation info for better handling
        navigation: {
          forcedRedirectEnabled: true,
        },
      },
      dynamicLinks.ShortLinkType.DEFAULT
    );

    return shortLink;
  } catch (error) {
    console.error("Error creating dynamic link:", error);
    return null;
  }
}

export async function buildShortLinkForHoroscope(title) {
  const link = `https://zoul.page.link/?isHoroscope=true`;

  const shortLink = await dynamicLinks().buildShortLink(
    {
      link,
      domainUriPrefix: `https://zoul.page.link`,
      android: {
        packageName: "com.zoul.app",
      },
      ios: {
        bundleId: "com.zoul.app",
        appStoreId: "6502774439",
      },
      social: {
        title: title,
      },
    },
    dynamicLinks.ShortLinkType.DEFAULT
  );

  const link1 = await dynamicLinks().buildShortLink({
    link: `https://zoul.page.link/play-audio?url=${encodeURIComponent(
      "https://zoul-prod-assets.s3.eu-west-2.amazonaws.com/audios/c8d97cef-6414-41c1-a60b-ac1a0d9af4a6/Happy_Default_playlist_1_20_23_03_25.mp3"
    )}`,
    domainUriPrefix: `https://zoul.page.link`,
    android: {
      packageName: "com.zoul.app",
      fallbackUrl: "https://play.google.com/store/apps/details?id=com.yourapp",
    },
    ios: {
      bundleId: "com.zoul.app",
      appStoreId: "6502774439",
      fallbackUrl: "https://apps.apple.com/app/id123456789",
    },
    social: {
      title: "🎵 Listen to this audio!",
      description: "Click to play this amazing audio now!",
      imageUrl:
        "https://zoul-prod-assets.s3.eu-west-2.amazonaws.com/audios/c8d97cef-6414-41c1-a60b-ac1a0d9af4a6/portrait_happy_smiling_young_woman_listening_music_headphones.jpg", // Optional thumbnail
    },
  });
  console.log("Link1", link1);
  return shortLink;
}

export async function buildShortLinkForDailyWisdom(title, imageUrl) {
  const secureImageUrl = imageUrl?.toLowerCase().startsWith("https://")
    ? imageUrl
    : null;

  const link = `https://zoul.page.link/?isDailyWisdom=true`;

  const shortLink = await dynamicLinks().buildShortLink(
    {
      link: link,
      domainUriPrefix: `https://zoul.page.link`,
      android: {
        packageName: "com.zoul.app",
        fallbackUrl: link,
      },
      ios: {
        bundleId: "com.zoul.app",
        appStoreId: "6502774439",
        fallbackUrl: link,
      },
      social: {
        title: title,
        descriptionText: title,
        imageUrl: secureImageUrl,
      },
      // Use navigation info for better handling
      navigation: {
        forcedRedirectEnabled: true,
      },
    },
    dynamicLinks.ShortLinkType.DEFAULT
  );

  return shortLink;
}

async function downloadFile(url, destination, setDownloads = () => {}, id) {
  const options = {
    fromUrl: url,
    toFile: destination,
    background: true,
    begin: (res) => {
      console.log("contentLength:", res.contentLength / (1024 * 1024), "MB");
    },
    progress: (res) => {
      const percentage = (res.bytesWritten / res.contentLength) * 100;
      console.log("progress:", Math.round(percentage), "%");
      setDownloads(id, Math.round(percentage));
    },
  };

  try {
    const result = await RNFS.downloadFile(options).promise;
    console.log("downloadFile result:", result);
    return result;
  } catch (error) {
    console.error("downloadFile error:", error);
  }
}

export const setLocalizedData = async (
  data,
  selectedLanguage,
  dispatch,
  setDownloads
) => {
  const timestamp = Date.now();
  let isDownloadComplete = false;
  const bannerImageDestination =
    RNFS.DocumentDirectoryPath + `/${timestamp}_bannerImage.png`;
  const IMG = data?.bannerImage
    ? data?.bannerImage
    : data?.coverFull
    ? data?.coverFull
    : null;
  const AUDIO = data?.link ? data?.link : data?.url ? data?.url : null;
  if (IMG !== null) {
    await downloadFile(IMG, bannerImageDestination);
  }

  const linkDestination = RNFS.DocumentDirectoryPath + `/${timestamp}_link.mp3`;
  if (AUDIO !== null) {
    await downloadFile(AUDIO, linkDestination, setDownloads, data?.id);
  }
  const localizedData = {
    id: data.id,
    bannerImage: IMG !== null ? bannerImageDestination : null,
    title: data?.title,
    description: data?.description,
    duration: data?.duration,
    premium: data?.premium,
    link: AUDIO !== null ? linkDestination : null,
  };

  const jsonFilePath = RNFS.DocumentDirectoryPath + "/localizedData.json";
  let existingData;
  try {
    existingData = await RNFS.readFile(jsonFilePath, "utf8");
  } catch (error) {
    console.error("readFile error for get DATA:", error);
    existingData = "[]";
  }
  const dataArray = JSON.parse(existingData);
  const existingObject = dataArray?.find(
    (data) => data.id === localizedData?.id
  );

  // If no such object exists, push localizedData to the array
  if (!existingObject) {
    dataArray.push(localizedData);
    isDownloadComplete = true;
  }

  RNFS.writeFile(jsonFilePath, JSON.stringify(dataArray), "utf8")
    .then(() => {
      console.log("JSON file created at:", jsonFilePath);
    })
    .catch((error) => {
      console.error("writeFile error:", error);
    })
    .finally(() => {
      dispatch(setDownloadAudioListsData(dataArray));
    });
  if (isDownloadComplete) {
    return { isDownloadComplete: true };
  }
};

export async function getLocalizedDataFromFile(dispatch) {
  const jsonFilePath = RNFS.DocumentDirectoryPath + "/localizedData.json";
  try {
    const fileContent = await RNFS.readFile(jsonFilePath, "utf8");
    const data = JSON.parse(fileContent);
    dispatch(setDownloadAudioListsData(data));
    return data;
  } catch (error) {
    console.error("readFile error:", error);
    dispatch(setDownloadAudioListsData([]));
    return null;
  }
}

export const deleteLocalDataFile = async () => {
  const path = RNFS.DocumentDirectoryPath + "/localizedData.json"; // Path to the file you want to delete

  try {
    // Check if the file exists
    const fileExists = await RNFS.exists(path);
    if (fileExists) {
      // Delete the file
      await RNFS.unlink(path);
      console.log("File deleted successfully");
    } else {
      console.log("File does not exist");
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export function formatTime(ms) {
  const seconds = Math.floor(Math.abs(ms / 1000));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  const t = [h, m > 9 ? m : h ? "0" + m : "0" + m || "00", s > 9 ? s : "0" + s]
    .filter(Boolean)
    .join(":");
  return ms < 0 && seconds ? `-${t}` : t;
}

export const getTitleByLanguage = (audioData, selectedLanguage) => {
  try {
    // Fetch info for selected language
    const title =
      audioData[`title_${selectedLanguage.toUpperCase()}`] ??
      audioData.title_EN;
    const description =
      audioData[`description_${selectedLanguage.toUpperCase()}`] ||
      audioData.description_EN;
    const duration =
      audioData[`duration_${selectedLanguage.toUpperCase()}`] ||
      audioData.duration_EN ||
      0;
    const link =
      audioData[`link_${selectedLanguage.toUpperCase()}`] || audioData.link_EN;
    return {
      title,
      description,
      duration,
      link,
      bannerImage: audioData.bannerImage,
      excelAudioId: audioData.excel_audio_id,
      premium: audioData.premium,
      id: audioData.id,
    };
  } catch (error) {
    console.error("error getTitleByLanguage =--->", error);
  }
};

export const getGreeting = () => {
  // Get current hour
  const currentHour = moment().hour();

  // Determine the greeting using lodash's _.inRange
  if (_.inRange(currentHour, 5, 12)) {
    return i18n.t("Good Morning,");
  } else if (_.inRange(currentHour, 12, 17)) {
    return i18n.t("Good Afternoon");
  } else if (_.inRange(currentHour, 17, 21)) {
    return i18n.t("Good Evening");
  } else {
    return i18n.t("Good Night");
  }
};

export function transformData(data) {
  // Initialize the response object with required fields
  const transformedData = {
    id: data?.id,
    authorName: data?.authorName || null,
    bannerImage: data?.bannerImage || null,
    description: "",
    title: "",
    link: "",
    duration: null,
    premium: data?.premium || false,
    tags: data?.tags || null,
  };

  // Dynamically find `title` and `link` fields with values
  for (const [key, value] of Object?.entries(data)) {
    if (key?.startsWith("title_") && value) {
      transformedData.title = value;
    }
    if (key?.startsWith("link_") && value) {
      transformedData.link = value;
    }
    if (key?.startsWith("description_") && value) {
      transformedData.description = value;
    }
    if (key?.startsWith("duration_") && value) {
      transformedData.duration = value;
    }
  }

  return transformedData;
}
