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
import {TextInput} from 'react-native-gesture-handler';

const CheckOutScreen = () => {
  const userId = useSelector(state => state.login.currentUser.uid);
  // console.log('USER', userInfor);
  const [user, setUser] = useState(null);
  // console.log('USER', user?.displayName);
  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .where('userId', '==', `${userId}`)
      .onSnapshot(querySnapshot => {
        // const users = [];
        querySnapshot.forEach(documentSnapshot => {
          setUser(documentSnapshot.data());
        });
        // setUser(users);
      });
    return () => subscriber();
  }, []);

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
        <View
          style={{
            marginTop: 10,
          }}>
          <Text>{user?.displayName}</Text>
          <Text>
            {user?.city},{user?.country}
          </Text>
          <Text>{user?.phone}</Text>
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
