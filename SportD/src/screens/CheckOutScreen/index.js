import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import colors from '../../constants/colors';

const CheckOutScreen = () => {
  const userInfor = useSelector(state => state.login.currentUser.uid);
  console.log('USER', userInfor);
  // const [user, setUser] = useState([]);
  // console.log('USER', user);
  // useEffect(() => {
  //   const subscriber = firestore()
  //     .collection('users')
  //     .where('userId', '==', `${userId}`)
  //     .onSnapshot(querySnapshot => {
  //       const user = [];
  //       querySnapshot.forEach(documentSnapshot => {
  //         user.push({
  //           ...documentSnapshot.data(),
  //         });
  //       });
  //       setUser(user);
  //     });
  //   return () => subscriber();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{marginHorizontal: 20, marginTop: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              color: colors.primaryColor,
              fontFamily: 'Poppins-Regular',
              fontWeight: '700',
              fontSize: Platform.OS === 'android' ? 16 : 14,
            }}>
            Delivery Address
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                // fontSize: Platform.OS === 'android' ? 16 : 14,
                fontSize: 14,
                color: colors.primaryColor,
                fontFamily: 'Poppins-Regular',
                fontWeight: '400',
              }}>
              Change
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text>{}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckOutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
