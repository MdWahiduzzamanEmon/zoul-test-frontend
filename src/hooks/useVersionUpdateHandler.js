import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import DeviceInfo from "react-native-device-info";
import { getVersion } from "../resources/baseServices/app";

const useVersionUpdateHandler = () => {
  // const minVersion = "1.0.47";
  const [unSupportedVersion, setUnSupportedVersion] = useState(false);
  const [currentVersion, setCurrentVersion] = useState("");
  const [updatedVersionModalMessage, setUpdatedVersionModalMessage] = useState({
    message: null,
    buttonText: null,
  });
  useEffect(() => {
    const checkCurrentVersion = async () => {
      try {
        const currentVersion = DeviceInfo.getVersion();
        const version = await getVersion();
        
        function isVersionUnsupported(currentVersion, requiredVersion) {
          const [currentMajor, currentMinor, currentPatch] = currentVersion
            .split(".")
            .map(Number);
          const [requiredMajor, requiredMinor, requiredPatch] = requiredVersion
            .split(".")
            .map(Number);

          if (currentMajor !== requiredMajor) {
            return currentMajor < requiredMajor;
          }
          if (currentMinor !== requiredMinor) {
            return currentMinor < requiredMinor;
          }
          return currentPatch < requiredPatch;
        }

        setUnSupportedVersion(
          isVersionUnsupported(currentVersion, version.data.value.minVersion)
        );

        setUpdatedVersionModalMessage({
          message: version.data.value.message || null,
          buttonText: version.data.value.buttonText || null,
        });
        setCurrentVersion(currentVersion);
      } catch (error) {
        console.error("error checkCurrentVersion =--->", error);
      }
    };
    checkCurrentVersion();
  }, []);
  return { unSupportedVersion, currentVersion, updatedVersionModalMessage };
};

export default useVersionUpdateHandler;
