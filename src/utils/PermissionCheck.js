import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

const PLATFORM_CAMERA_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
};

const PLATFORM_GALLERY_PERMISSIONS = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
};

const PLATFORM_LOCATION_PERMISSIONS = {
  ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

const PLATFORM_LOCATION_WHEN_IN_USE = {
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

const PLATFORM_CONTACT_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CONTACTS,
  android: PERMISSIONS.ANDROID.READ_CONTACTS,
};

const PLATFORM_NOTIFICATION_PERMISSIONS = {
  ios: "",
  android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
};

const REQUEST_PERMISSION_TYPE = {
  camera: PLATFORM_CAMERA_PERMISSIONS,
  gallery: PLATFORM_GALLERY_PERMISSIONS,
  location: PLATFORM_LOCATION_PERMISSIONS,
  locationWhenInUse: PLATFORM_LOCATION_WHEN_IN_USE,
  contact: PLATFORM_CONTACT_PERMISSIONS,
  androidNotification: PLATFORM_NOTIFICATION_PERMISSIONS,
};

const PERMISSION_TYPE = {
  camera: 'camera',
  gallery: 'gallery',
  location: 'location',
  locationWhenInUse: 'locationWhenInUse',
  contact: 'contact',
  androidNotification: 'androidNOtification',

};

class AppPermission {
  checkPermission = async (type): Promise<boolean> => {
    const permission = REQUEST_PERMISSION_TYPE[type][Platform.OS];

    if (!permission) {
      return true;
    }
    try {
      const result = await check(permission);
      if (result === RESULTS.GRANTED) {
        return true;
        // return this.requestPermission(permission)
      } else {
        return this.requestPermission(permission); // here requesting for permission
      }
    } catch (error) {
      return false;
    }
  };

  requestPermission = async (permission): Promise<boolean> => {
    try {
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  };
}

const PermissionCheck = new AppPermission();
export { PermissionCheck, PERMISSION_TYPE };
