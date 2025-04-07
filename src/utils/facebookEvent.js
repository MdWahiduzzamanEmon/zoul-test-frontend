import { AppEventsLogger } from 'react-native-fbsdk-next';

export const facebookEvent = async (name, data = {}) => {
    console.log(`Attempting to log event:${name}`, data);
    try {
        AppEventsLogger.logEvent(name, data);
      console.log(`Successfully logged event on facebook: ${name}`, data);
    } catch (error) {
      console.error(`Error logging event: ${name}`, error);
    }
  };
  