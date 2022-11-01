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
import Loading from '../components/Loading';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CheckOutScreen = () => {
  const userId = useSelector(state => state.login.currentUser.uid);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const {params} = route;

  const handlePay = async () => {
    setLoading(true);
    const docRef = firestore()
      .collection('orders')
      .doc(new Date().getTime().toString());
    await docRef
      .set({
        orderId: docRef.id,
        orderUserId: userId,
        orderData: params?.cartData,
        orderDeliveryStatus: 'Pending',
        orderDate: firestore.Timestamp.fromDate(new Date()),
        orderAddress: `${user.city}, ${user?.country}`,
        orderPhone: user.phone,
        orderName: user.displayName,
        orderPayment: 'Delivery',
        orderCost: params?.total,
      })
      .then(async () => {
        await firestore()
          .collection(`cart-${userId}`)
          .get()
          .then(res => {
            res.forEach(e => {
              e.ref.delete();
            });
          });
        setTimeout(() => {
          setLoading(false);
          navigation.navigate('OrderSuccess');
        }, 1500);
      })
      .catch(err => {
        console.log(err.code);
      });
  };

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: 20, marginTop: 10}}>
        <View style={styles.viewAddress}>
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
            <View style={styles.viewRow}>
              <Ionicons name="person" style={styles.styleIcon} />
              <Text style={styles.textInfo}>{user?.displayName}</Text>
            </View>
            <View style={styles.viewRow}>
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                style={styles.styleIcon}
              />
              <Text style={styles.textInfo}>
                {user?.city},{user?.country}
              </Text>
            </View>
            <View style={styles.viewRow}>
              <FontAwesome5 name="phone-alt" style={styles.styleIcon} />

              <Text style={styles.textInfo}>{user?.phone}</Text>
            </View>
          </View>
        </View>

        <View style={styles.viewAddress}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                color: colors.primaryColor,
                fontFamily: 'Poppins-Regular',
                fontWeight: '700',
                fontSize: Platform.OS === 'android' ? 16 : 14,
              }}>
              Order Bills
            </Text>
            <TouchableOpacity>
              <Text
                style={{
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
            <View style={styles.viewSpacing}>
              <Text style={styles.textInfo}>Products</Text>

              <Text style={styles.textInfo}>
                {params?.cartData.reduce((p, c) => p + c.quantity, 0)} items
              </Text>
            </View>
            <View style={styles.viewSpacing}>
              <Text style={styles.textInfo}>Price</Text>

              <Text style={styles.textInfo}>$ {params.total}</Text>
            </View>
            <View style={styles.viewSpacing}>
              <Text style={styles.textInfo}>Shipping Fee </Text>

              <Text style={styles.textInfo}>Free</Text>
            </View>
            <View style={styles.viewSpacing}>
              <Text
                style={[
                  styles.textInfo,
                  {fontWeight: '700', color: colors.primaryColor},
                ]}>
                Total Bill
              </Text>

              <Text
                style={[
                  styles.textInfo,
                  {fontWeight: '700', color: colors.primaryColor},
                ]}>
                $ {params.total}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.viewAddress}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                color: colors.primaryColor,
                fontFamily: 'Poppins-Regular',
                fontWeight: '700',
                fontSize: Platform.OS === 'android' ? 16 : 14,
              }}>
              Payment Method
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
            }}>
            <View style={styles.viewRow}>
              <Text style={styles.textInfo}>Cash on Delivery</Text>
            </View>
            <View style={styles.viewRow}>
              <Text style={styles.textInfo}>...</Text>
            </View>
          </View>
        </View>

        <View style={{}}>
          <TouchableOpacity
            style={styles.btnPay}
            onPress={() => {
              handlePay();
            }}>
            <Text style={styles.textPay}>Pay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {loading ? (
        <View
          style={{
            backgroundColor: 'black',
            position: 'absolute',
            opacity: 0.6,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}>
          <Loading />
        </View>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

export default CheckOutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewAddress: {
    backgroundColor: colors.grayLightColor,
    borderRadius: 5,
    height: 'auto',
    padding: 10,
    marginBottom: 10,
  },
  viewRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  textInfo: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  viewSpacing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  styleIcon: {
    color: colors.primaryColor,
    fontSize: 18,
    marginRight: 10,
  },
  btnPay: {
    // marginTop: 'auto',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5956E9',
    borderRadius: 15,
  },
  textPay: {color: '#F6F6F9', fontFamily: 'Poppins-Regular', fontSize: 16},
});
