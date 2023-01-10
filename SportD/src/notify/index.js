import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

async function getToken() {
  const deviceToken = await messaging().getToken();
}
const Notification = () => {
  useEffect(() => {
    const handleNotify = async () => {
      await requestUserPermission();
      await getToken();
    };
    handleNotify();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text>Notification</Text>
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({});
