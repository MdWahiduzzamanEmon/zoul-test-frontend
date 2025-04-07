import axios from "axios";
import GetLocation from 'react-native-get-location'
const { envConfig } = require("../config/config");
export const getLocation = async () => {
    try {
        const location = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        });
        return location;
    } catch (error) {
        const { code, message } = error;
        console.warn(code, message);
    }
};

export const getLocationName = async (latitude,longitude) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: latitude + "," + longitude,
            key:"AIzaSyAprzMq5C9ksuX1p4rp1NFP4WiOSrryEt0" ,
          },
        }
      );
      return response.data.results[0].formatted_address;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to be caught by the caller
    }
  };