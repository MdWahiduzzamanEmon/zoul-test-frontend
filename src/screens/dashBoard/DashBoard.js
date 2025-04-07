import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch } from 'react-redux';
import { removeAuthTokenAction } from '../../store/auth';
import { notify } from '../../store/notifications';
import useApiErrorsHandler from '../../hooks/useApiErrorHandler';
import { clearAsyncStorage } from '../../helpers/auth';
import { logError } from '../../helpers/logging';
import { getUsersPostDetails } from '../../resources/baseServices/auth';
import Block from '../../components/utilities/Block';
import Text from '../../components/utilities/Text';
import PostDetailsItem from './component/PostDetailsItem';
import { consoleLog, responsiveScale } from '../../styles/mixins';
import { colors } from '../../styles/theme';
import { WHITE_TRANSPERANT_10 } from '../../components/functional/NotificationsControl';

const DashBoard = ({ navigation }) => {
  const handleApiError = useApiErrorsHandler();
  const dispatch = useDispatch();

  const [getPostDetails, setGetPostDetails] = useState([]);

  const getUsersDetails = async () => {
    try {
      const res = await getUsersPostDetails();
      setGetPostDetails(res?.data?.data);
    } catch (error) {
      dispatch(
        notify({
          title: error?.response?.data,
          type: 'warning',
        }),
      );
      handleApiError(error);
      consoleLog(error);
    }
  };

  const handleLogoutBtn = async () => {
    try {
      dispatch(removeAuthTokenAction());
      await clearAsyncStorage();
    } catch (err) {
      logError(err, '[SettingsScreen] logOut Error');
    }
  };

  // Custom Header
  const setNavigationBar = () => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.viewBackgroundColor,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        shadowColor: WHITE_TRANSPERANT_10,
      },
      headerLeft: props => <></>,
      headerTitle: props => (
        <Text medium style={styles.headerTitleText}>
          DashBoard
        </Text>
      ),
      headerRight: props => (
        <Text bold size={responsiveScale(14)} onPress={() => handleLogoutBtn()}>
          Logout
        </Text>
      ),
    });
  };

  useEffect(() => {
    // getUsersDetails();
    setNavigationBar();
    // SplashScreen.hide();
    setTimeout(() => {
          SplashScreen.hide();
          // 2 sec 
        }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Block flex={1} color={colors.viewBackgroundColor}>
      <Block flex={false} margin={[0, 15]}>
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          data={getPostDetails}
          keyExtractor={(item, index) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => <PostDetailsItem item={item} />}
        />
      </Block>
    </Block>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
  headerTitleText: {
    fontSize: responsiveScale(16),
    fontWeight: '500',
  },
});
