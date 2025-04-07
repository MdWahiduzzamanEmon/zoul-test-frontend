// import { StyleSheet, Text, View } from "react-native";
// import React from "react";
// import { colors } from "../../styles/theme";
// import { perfectSize, responsiveScale } from "../../styles/mixins";
// import { Dropdown } from "react-native-element-dropdown";
// import LanguageIcon from "../../assets/appImages/svgImages/LanguageIcon";
// import DownArrow from "../../assets/appImages/svgImages/DownArrow";

// const CustomDropDown = ({
//   dropdownRef,
//   data,
//   defaultValue,
//   value,
//   onChange,
// }) => {
//   // Custom render item for dropdown
//   const renderDropdownItem = (item) => {
//     return (
//       <View style={styles.itemContainer}>
//         <Text
//           style={[
//             styles.itemText,
//             { fontSize: responsiveScale(11) },
//           ]}
//         >
//           {item.label}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <>
//       <Dropdown
//         ref={dropdownRef}
//         style={styles.dropdown}
//         containerStyle={styles.containerStyle}
//         placeholderStyle={[
//           styles.placeholderStyle,
//           { fontSize: responsiveScale(11) },
//         ]}
//         selectedTextStyle={[
//           styles.selectedTextStyle,
//           { fontSize: responsiveScale(11) },
//         ]}
//         iconStyle={styles.iconStyle}
//         data={data}
//         search={false}
//         maxHeight={300}
//         labelField="label"
//         valueField="value"
//         placeholder={null}
//         defaultValue={defaultValue}
//         value={value}
//         onChange={(item) => {
//           onChange(item);
//         }}
//         renderItem={renderDropdownItem} // Use custom render function
//         renderLeftIcon={() => <LanguageIcon height={18} width={18} />}
//         renderRightIcon={() => <DownArrow height={15} width={15} />}
//       />
//     </>
//   );
// };

// export default CustomDropDown;

// const styles = StyleSheet.create({
//   dropdown: {
//     backgroundColor: "transparent",
//     borderColor: colors.white,
//     borderWidth: 1,
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     width: 115,
//   },
//   containerStyle: {
//     backgroundColor: "transparent",
//     borderRadius: perfectSize(8),
//     marginTop: perfectSize(10),
//     paddingVertical: perfectSize(10),
//     borderWidth: 1,
//     borderColor: colors.white,
//   },
//   placeholderStyle: {
//     color: colors.white,
//   },
//   selectedTextStyle: {
//     color: colors.white,
//     marginLeft: 5,
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   itemContainer: {
//     padding: perfectSize(10),
//   },
//   itemText: {
//     color: colors.black,
//   },
// });

// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Dropdown } from "react-native-element-dropdown";
// import { StyleSheet, Text, View } from "react-native";
// import { colors } from "../../styles/theme";
// import { perfectSize, responsiveScale } from "../../styles/mixins";
// import LanguageIcon from "../../assets/appImages/svgImages/LanguageIcon";
// import DownArrow from "../../assets/appImages/svgImages/DownArrow";
// import { setLanguage } from "../../store/auth";

// const data = [
//   { label: "English", value: "en" },
//   { label: "Spanish", value: "es" },
//   { label: "French", value: "fr" },
//   { label: "German", value: "de" },
//   { label: "Chinese", value: "zh" },
//   { label: "Hindi", value: "hi" },
//   { label: "Russian", value: "ru" },
//   { label: "Arabic", value: "ar" },
//   { label: "Portuguese", value: "pt" },
//   { label: "Italian", value: "it" },
//   { label: "Japanese", value: "ja" },
//   { label: "Korean", value: "ko" },
//   { label: "Dutch", value: "nl" },
//   { label: "Swedish", value: "sv" },
//   { label: "Turkish", value: "tr" },
//   { label: "Thai", value: "th" },
//   { label: "Greek", value: "el" },
// ];

// const CustomDropDown = ({ dropdownRef, onChange }) => {
//   const dispatch = useDispatch();
//   const selectedLanguage = useSelector(
//     (state) => state.language.selectedLanguage
//   );
//   const renderDropdownItem = (item) => {
//     return (
//       <View style={styles.itemContainer}>
//         <Text style={[styles.itemText, { fontSize: responsiveScale(11) }]}>
//           {item.label}
//         </Text>
//       </View>
//     );
//   };

//   const handleChange = (item) => {
//     dispatch(setLanguage(item.value));
//     if (onChange) {
//       onChange(item.value);
//     }
//   };

//   return (
//     <Dropdown
//       ref={dropdownRef}
//       style={styles.dropdown}
//       containerStyle={styles.containerStyle}
//       placeholderStyle={[
//         styles.placeholderStyle,
//         { fontSize: responsiveScale(11) },
//       ]}
//       selectedTextStyle={[
//         styles.selectedTextStyle,
//         { fontSize: responsiveScale(11) },
//       ]}
//       iconStyle={styles.iconStyle}
//       data={data}
//       search={false}
//       maxHeight={300}
//       labelField="label"
//       valueField="value"
//       placeholder={null}
//       value={selectedLanguage}
//       onChange={handleChange}
//       renderItem={renderDropdownItem}
//       renderLeftIcon={() => <LanguageIcon height={18} width={18} />}
//       renderRightIcon={() => <DownArrow height={15} width={15} />}
//     />
//   );
// };

// export default CustomDropDown;

// const styles = StyleSheet.create({
//   dropdown: {
//     backgroundColor: "transparent",
//     borderColor: colors.white,
//     borderWidth: 1,
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     width: 115,
//   },
//   containerStyle: {
//     backgroundColor: "transparent",
//     borderRadius: perfectSize(8),
//     marginTop: perfectSize(10),
//     paddingVertical: perfectSize(10),
//     borderWidth: 1,
//     borderColor: colors.white,
//   },
//   placeholderStyle: {
//     color: colors.white,
//   },
//   selectedTextStyle: {
//     color: colors.white,
//     marginLeft: 5,
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   itemContainer: {
//     padding: perfectSize(10),
//   },
//   itemText: {
//     color: colors.black,
//   },
// });
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet, Text, View } from "react-native";
import { colors, font } from "../../styles/theme";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import LanguageIcon from "../../assets/appImages/svgImages/LanguageIcon";
import DownArrow from "../../assets/appImages/svgImages/DownArrow";
import { setLanguage } from "../../store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfile } from "../../resources/baseServices/auth";
import { ErrorDialog } from "../modal/Modal";
import { useModal } from "../../context/ModalContext";
import { useLocale } from "../../context/LocaleProvider";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";

const data = [
  { label: "English", value: "en" }, // English
  { label: "Thai", value: "th" }, // Thai
  { label: "French", value: "fr" }, // French
  { label: "Italian", value: "it" }, // Italian
  { label: "Korean", value: "ko" }, // Korean
  { label: "Dutch", value: "nl" }, // Dutch
  { label: "Portuguese", value: "pt" }, // Portuguese
  { label: "Indonesian", value: "id" }, // Indonesian
  { label: "Chinese", value: "zh" }, // Chinese
  { label: "Russian", value: "ru" }, // Russian
  { label: "Ukrainian", value: "uk" }, // Ukrainian
  { label: "Spanish", value: "es" }, // Spanish
  { label: "Hebrew", value: "he" }, // Hebrew
  { label: "Japanese", value: "ja" }, // Japanese
  { label: "German", value: "de" }, // German
  { label: "Arabic", value: "ar" }, // Arabic
  { label: "Hindi", value: "hi" }, // Arabic
];

const APP_LANGUAGE = "@app_language";

const CustomDropDown = ({ dropdownRef, onChange, isDisable = false }) => {
  const dispatch = useDispatch();
  const modal = useModal();
  const { changeLocale } = useLocale();
  const selectedLanguage = useSelector(
    (state) => state.language.selectedLanguage
  );
  const user = useSelector((state) => state?.userReducer?.userProfile);

  const [currentLanguage, setCurrentLanguage] = useState(selectedLanguage);

  // useEffect(() => {
  //   setCurrentLanguage(selectedLanguage);
  // }, [selectedLanguage]);

  // Load language from AsyncStorage on component mount
  useEffect(() => {
    const loadStoredLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(APP_LANGUAGE);
        if (storedLanguage) {
          setCurrentLanguage(
            user?.preferred_language?.toLowerCase() ?? storedLanguage
          );
          dispatch(
            setLanguage(
              user?.preferred_language?.toLowerCase() ?? storedLanguage
            )
          );
        }
      } catch (error) {
        console.error("Failed to load language from AsyncStorage", error);
      }
    };

    loadStoredLanguage();
  }, [dispatch, user?.preferred_language]);

  const renderDropdownItem = (item) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={[styles.itemText, { fontSize: responsiveScale(11) }]}>
          {item.label}
        </Text>
      </View>
    );
  };

  const handleDropdownChange = async (language) => {
    try {
      const data = { preferred_language: language?.toUpperCase() };
      const res = await updateProfile(data);
      if (res?.data?.status === "success") {
        // changeLanguageAndHandleEffects(language, dispatch, changeLocale);
      }
    } catch (error) {
      console.error("error handleDropdownChange =--->", error?.response?.data);
      modal.show(ErrorDialog, {
        messageTitle:
          error?.response?.data?.errorTitle ??
          ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
        message:
          error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    } finally {
      console.log("LNG changed successfully");
    }
  };

  const handleChange = async (item) => {
    try {
      await handleDropdownChange(item.value); // Call the function to update the profile
      dispatch(setLanguage(item.value));
      setCurrentLanguage(item.value);
      await AsyncStorage.setItem(APP_LANGUAGE, item.value);
      changeLocale(item.value);
      if (onChange) {
        onChange(item.value);
      }
    } catch (error) {
      console.error("error handleChange =--->", error);
    }
  };

  return (
    <Dropdown
      ref={dropdownRef}
      style={styles.dropdown}
      disable={isDisable}
      containerStyle={styles.containerStyle}
      placeholderStyle={[styles.placeholderStyle, { fontSize: scaleSize(11) }]}
      selectedTextStyle={[
        styles.selectedTextStyle,
        { fontSize: scaleSize(11) },
      ]}
      iconStyle={styles.iconStyle}
      data={data}
      search={false}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={null}
      value={currentLanguage}
      onChange={handleChange}
      renderItem={renderDropdownItem}
      renderLeftIcon={() => <LanguageIcon height={18} width={18} />}
      renderRightIcon={() => <DownArrow height={15} width={15} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CustomDropDown;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "rgba(115, 3, 19, 0.1)",
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    width: perfectSize(130),
  },
  containerStyle: {
    backgroundColor: colors.white,
    borderRadius: perfectSize(8),
    marginTop: perfectSize(10),
    paddingVertical: perfectSize(10),
    borderWidth: 1,
    borderColor: colors.white,
  },
  placeholderStyle: {
    color: colors.white,
  },
  selectedTextStyle: {
    color: colors.white,
    marginLeft: 5,
    fontFamily: font.medium,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemContainer: {
    padding: perfectSize(10),
  },
  itemText: {
    color: colors.black,
  },
});
