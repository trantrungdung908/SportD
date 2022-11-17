import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Feather from 'react-native-vector-icons/Feather';
import React, {useState, useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {RadioButton} from 'react-native-paper';
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
  const [name, setName] = useState('');
  const [locate, setLocate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(null);
  const route = useRoute();
  const {params} = route;
  const ref = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const totalItems = params?.cartData.reduce((p, c) => p + c.quantity, 0);
  const [checked, setChecked] = useState('Cash on Delivery');
  const [showGateway, setShowGateway] = useState(false);
  const [prog, setProg] = useState(false);
  const [progClr, setProgClr] = useState('#000');
  function onMessage(e) {
    let data = e.nativeEvent.data;
    setShowGateway(false);
    console.log(data);
    let payment = JSON.parse(data);
    if (payment.status === 'COMPLETED') {
      alert('PAYMENT SUCCESSFULLY YOU CAN GO NEXT TO SUCCESS ORDER!');
    } else {
      alert('PAYMENT FAILED!!!PLEASE TRY AGAIN OR TRY OTHER PAYMENT METHOD');
    }
  }
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
        orderAddress: locate || user?.address,
        orderPhone: phoneNumber || user.phone,
        orderName: name || user.displayName,
        orderPayment: checked,
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
  const handleWebView = () => {
    setChecked('Paypal');
    setShowGateway(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewWrap}>
        <View>
          <View style={styles.viewAddress}>
            <View>
              <Text style={styles.textTitle}>Delivery Address</Text>
            </View>
            <View style={styles.styleMargin}>
              <View style={styles.viewRow}>
                <Ionicons name="person" style={styles.styleIcon} />
                <TextInput
                  onChangeText={text => setName(text)}
                  ref={ref}
                  style={[styles.textInfo, {flex: 1}]}>
                  {user?.displayName}
                </TextInput>
                <TouchableOpacity
                  onPress={() => {
                    ref.current.focus();
                  }}
                  style={styles.paddingPencil}>
                  <Ionicons name="pencil-outline" style={styles.styleIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.viewRow}>
                <MaterialCommunityIcons
                  name="map-marker-radius-outline"
                  style={styles.styleIcon}
                />

                <TextInput
                  ref={ref1}
                  onChangeText={text => setLocate(text)}
                  style={[styles.textInfo, {flex: 1}]}>
                  {user?.address}
                </TextInput>
                <TouchableOpacity
                  onPress={() => {
                    ref1.current.focus();
                  }}
                  style={styles.paddingPencil}>
                  <Ionicons name="pencil-outline" style={styles.styleIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.viewRow}>
                <FontAwesome5 name="phone-alt" style={styles.styleIcon} />
                <TextInput
                  onChangeText={num => setPhoneNumber(num)}
                  keyboardType="number-pad"
                  ref={ref2}
                  style={[styles.textInfo, {flex: 1}]}>
                  {user?.phone}
                </TextInput>
                <TouchableOpacity
                  onPress={() => {
                    ref2.current.focus();
                  }}
                  style={styles.paddingPencil}>
                  <Ionicons name="pencil-outline" style={styles.styleIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.viewAddress}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.textTitle}>Order Bills</Text>
            </View>
            <View style={styles.styleMargin}>
              <View style={styles.viewSpacing}>
                <Text style={styles.textInfo}>Products</Text>

                <Text style={styles.textInfo}>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
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
            <View>
              <Text style={styles.textTitle}>Payment Method</Text>
            </View>
            <View style={styles.styleMargin}>
              <View style={styles.viewRow}>
                <RadioButton
                  value="Cash on Delivery"
                  status={
                    checked === 'Cash on Delivery' ? 'checked' : 'unchecked'
                  }
                  onPress={() => setChecked('Cash on Delivery')}
                />
                <Text style={styles.textMethod}>Cash on Delivery</Text>
              </View>
              <View style={styles.viewRow}>
                <RadioButton
                  value="Paypal"
                  status={checked === 'Paypal' ? 'checked' : 'unchecked'}
                  onPress={() => handleWebView()}
                />
                <Text style={styles.textMethod}>Paypal</Text>
              </View>
            </View>
          </View>
        </View>
        {Platform.OS === 'ios' ? (
          <View style={{flex: 1, backgroundColor: '#fff', height: 10}}></View>
        ) : null}

        <View style={{flex: 1}}>
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
        <View style={styles.loadingPay}>
          <Loading />
        </View>
      ) : (
        <></>
      )}
      {showGateway ? (
        <Modal
          visible={showGateway}
          onDismiss={() => setShowGateway(false)}
          onRequestClose={() => setShowGateway(false)}
          animationType={'fade'}
          transparent>
          <SafeAreaView style={styles.webViewCon}>
            <View style={styles.wbHead}>
              <TouchableOpacity
                style={{padding: 13}}
                onPress={() => setShowGateway(false)}>
                <Feather name={'x'} size={24} />
              </TouchableOpacity>
              <Text style={styles.textGateway}>PayPal GateWay</Text>
              <View style={{padding: 13, opacity: prog ? 1 : 0}}>
                <ActivityIndicator size={24} color={'#00457C'} />
              </View>
            </View>
            <WebView
              source={{
                uri: 'https://my-pay-cc87e.web.app/static/js/main.1f1b4f27.js.map',
              }}
              style={{flex: 1}}
              onLoadStart={() => {
                setProg(true);
                setProgClr('#000');
              }}
              onLoadProgress={() => {
                setProg(true);
                setProgClr('#00457C');
              }}
              onLoadEnd={() => {
                setProg(false);
              }}
              onLoad={() => {
                setProg(false);
              }}
              onMessage={onMessage}
            />
          </SafeAreaView>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
};

export default CheckOutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewWrap: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  viewAddress: {
    backgroundColor: colors.grayLightColor,
    borderRadius: 5,
    height: 'auto',
    padding: 10,
    marginBottom: 10,
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInfo: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  textMethod: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.primaryColor,
  },
  textTitle: {
    color: colors.primaryColor,
    fontFamily: 'Poppins-Regular',
    fontWeight: '700',
    fontSize: Platform.OS === 'android' ? 16 : 14,
  },
  viewSpacing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Platform.OS === 'android' ? 5 : 10,
  },
  styleIcon: {
    color: colors.primaryColor,
    fontSize: 18,
    marginRight: 10,
  },
  btnPay: {
    flex: 1,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5956E9',
    borderRadius: 15,
  },
  textPay: {color: '#F6F6F9', fontFamily: 'Poppins-Regular', fontSize: 16},
  styleMargin: {
    marginTop: 10,
  },
  paddingPencil: {
    padding: 10,
  },
  loadingPay: {
    backgroundColor: '#000',
    position: 'absolute',
    opacity: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  webViewCon: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    bottom: 0,
  },
  wbHead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    zIndex: 25,
    elevation: 2,
  },
  textGateway: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    color: '#00457C',
  },
});
