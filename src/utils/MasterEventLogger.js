import { facebookEvent } from "./facebookEvent"
import { googleEvent } from "./googleEvent";
import { callApiPost } from "../resources/baseServices/baseApi";
import API from "../constants/baseApi";
import { envConfig } from "../config/config";


const logEvent=async({name,data,userId})=>{
   try {
      const response = await callApiPost({
        url: API.LOG_EVENT,
        data:{
         user_id:userId,
         event_name:name,
         event_object:data,
        },
      });
      return response;
    } catch (error) {
      console.log('response',error)
      throw error;
    }
}
const sendPixelEvent = async ({name,data,userId}) => {
   try {
      const response=await fetch("https://business-api.tiktok.com/open_api/v1.3/pixel/track/", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           "Access-Token":envConfig.PIXEL_ACCESS_TOKEN,
         },
         body: JSON.stringify({
          pixel_code:envConfig.PIXEL_CODE,
          request_id: "20250217102714FD31B8E6FD59048D4768",
           event: name,
           event_time: Math.floor(Date.now() / 1000),
           user: {
             external_id: userId,
           },
           properties: data,
          //  test_event_code:'TEST38282',//only for event testing
         }),
       });
       return response;
   } catch (error) {
         console.log('Error logging pixel data->',error);
   }
 };
export default MasterEventLogger=async({name,data={},userId})=>{
   await facebookEvent(name,data);
   await googleEvent(name,data);
   await sendPixelEvent({name,data,userId})
   await logEvent({name,data,userId});
}