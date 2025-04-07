import analytics from "@react-native-firebase/analytics";

export const googleEvent = async (name, data = {}) => {
  console.log(`Attempting to log event:${name}`, data);
  try {
    await analytics().logEvent(name, data);
    console.log(`Successfully logged event: ${name}`, data);
  } catch (error) {
    console.error(`Error logging event: ${name}`, error);
  }
};
