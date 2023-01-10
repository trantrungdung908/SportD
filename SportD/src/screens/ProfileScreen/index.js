import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useState, memo} from 'react';
import {useNavigation} from '@react-navigation/native';
import colors from '../../constants/colors';
import {logout} from '../LoginScreen/action';
import {
  auth,
  collection,
  databaseStore,
  doc,
  getDoc,
  getDocs,
} from '../../../firebase/config';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // state info user
  const [userInfor, setUserInfor] = useState([]);
  const [loading, setLoading] = useState(true);

  const alertLogOut = () => {
    Alert.alert(
      'Are you sure?',
      "You'll need to login again to keep using the application",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: () => {
            auth
              .signOut()
              .then(() => {
                dispatch(logout());
              })
              .catch(error => {});
          },
        },
      ],
    );
  };
  //getData from firestore
  const getUser = async () => {
    let stringUser = await AsyncStorage.getItem('user');
    let myUserId = JSON.parse(stringUser).uid;
    await firestore()
      .collection('users')
      .doc(myUserId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserInfor(documentSnapshot.data());
        }
      })
      .catch(error => {});
  };

  useEffect(() => {
    getUser();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            borderBottomWidth: 1,
            borderColor: '#f2f2f2',
          }}>
          <View style={[styles.viewRowIos, {marginTop: 20}]}>
            <Image
              style={styles.imgAva}
              source={{
                uri: userInfor
                  ? userInfor.userImg ||
                    'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'
                  : 'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg',
              }}
            />
            <Text style={styles.textName}>{userInfor?.displayName}</Text>
          </View>
          {userInfor?.address != '' ? (
            <View style={[styles.viewRowIos, {marginTop: 20}]}>
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                style={styles.styleIcon}
              />
              <Text style={styles.textInfo}>{userInfor?.address}</Text>
            </View>
          ) : (
            <View style={[styles.viewRowIos, {marginTop: 20}]}>
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                style={styles.styleIcon}
              />
            </View>
          )}

          <View
            style={
              Platform.OS === 'ios'
                ? [styles.viewRowIos, {marginTop: 20}]
                : [styles.viewRowIos, {marginBottom: 10, marginTop: 5}]
            }>
            <Ionicons name="mail" style={styles.styleIcon} />
            <Text style={styles.textInfo}>{userInfor?.email}</Text>
          </View>
        </View>
        <View style={{flex: 2}}>
          <View
            style={{
              marginHorizontal: 20,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditProfileScreen', {
                  info: userInfor,
                });
              }}
              style={styles.btnAll}>
              <Ionicons name="pencil-outline" style={styles.iconBtn} />
              <Text style={styles.textBtn}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAll}
              onPress={() => {
                navigation.navigate('WishListStackScreen');
              }}>
              <Ionicons name="heart-outline" style={styles.iconBtn} />
              <Text style={styles.textBtn}>Favourites</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAll}
              onPress={() => {
                navigation.navigate('OrderHistoryScreen');
              }}>
              <FontAwesome5 name="box-open" style={styles.iconBtn} />
              <Text style={styles.textBtn}>Orders history</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAll}
              onPress={() => {
                navigation.navigate('SettingsScreen');
              }}>
              <Ionicons name="settings-outline" style={styles.iconBtn} />
              <Text style={styles.textBtn}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                alertLogOut();
              }}
              style={styles.btnAll}>
              <Ionicons
                name="log-out-outline"
                style={[styles.iconBtn, {color: colors.warningColor}]}
              />
              <Text style={[styles.textBtn, {color: colors.warningColor}]}>
                Log out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewRowIos: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 20,
    // backgroundColor: 'red',
  },

  imgAva: {width: 100, height: 100, borderRadius: 50},
  textName: {
    fontSize: 22,
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
    marginLeft: 10,
    marginRight: 35,
  },
  styleIcon: {fontSize: 20, color: '#777777'},
  textInfo: {
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#777777',
  },
  btnAll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  iconBtn: {fontSize: 24, color: colors.primaryColor},
  textBtn: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
  },
});
