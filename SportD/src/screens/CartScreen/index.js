import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import colors from '../../constants/colors';
import images from '../../constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CartItem from './components';
import {useDispatch, useSelector} from 'react-redux';
const CartScreen = () => {
  const userId = useSelector(state => state.login.currentUser.uid);
  const navigation = useNavigation();
  const [cartData, setCartData] = useState([]);

  // const [deleted, setDeleted] = useState(false);
  // const [loading, setLoading] = useState(true);
  // const dispatch = useDispatch();
  // const getCartData = async () => {
  //   let stringUser = await AsyncStorage.getItem('user');
  //   let myUserId = JSON.parse(stringUser).uid;
  //   firestore()
  //     .collection(`cart-${myUserId}`)
  //     .orderBy('addTime', 'desc')
  //     .get()
  //     .then(querySnapshot => {
  //       const cartArray = [];
  //       querySnapshot.forEach(documentSnapshot => {
  //         cartArray.push({
  //           ...documentSnapshot.data(),
  //           key: documentSnapshot.id,
  //         });
  //       });
  //       setCartData(cartArray);
  //       dispatch(getCartSuccess(cartArray));
  //     })
  //     .catch(error => {
  //       console.log(error.code);
  //     });
  // };

  // useEffect(() => {
  //   getCartData();
  //   setDeleted(false);
  // navigation.addListener('focus', () => setLoading(!loading));
  // }, [deleted, navigation, loading]);
  let total = cartData?.reduce((p, item) => p + item.price * item.quantity, 0);

  useEffect(() => {
    const subscriber = firestore()
      .collection(`cart-${userId}`)
      .orderBy('addTime', 'desc')
      .onSnapshot(querySnapshot => {
        const cartArray = [];
        querySnapshot.forEach(documentSnapshot => {
          cartArray.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setCartData(cartArray);
      });
    // navigation.addListener('focus', () => setLoading(!loading));
    return () => subscriber();
  }, []);
  return (
    <View style={styles.container}>
      {cartData.length > 0 ? (
        <View style={styles.container}>
          <ScrollView>
            {cartData.map((item, index) => {
              return <CartItem key={item.key} itemData={item} />;
            })}
          </ScrollView>
          <View style={styles.viewBtn}>
            <View style={styles.view_Delivery}>
              <Text style={styles.text_Delivery}>Delivery</Text>
              <Text style={styles.text_Delivery}>Standard-Free</Text>
            </View>
            <View style={styles.view_Total}>
              <Text style={styles.text_Total}>Total</Text>
              <Text style={styles.text_Total}>${total}</Text>
            </View>
            <TouchableOpacity style={styles.btnCheck}>
              <Text style={styles.textCheck}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.view_NotData}>
          <Image source={images.emptyCart} style={styles.img_NotData} />
          <Text style={styles.text_NotData}>Your cart is empty</Text>
          <Text style={styles.text_NotItem}>
            You have no items in your cart at the moment
          </Text>
          <TouchableOpacity
            style={styles.btn_Shopping}
            onPress={() => {
              navigation.navigate('HomeScreen');
            }}>
            <Text style={styles.text_Shopping}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* {cartData.length > 0 || cartData != '' ? (
        <View style={styles.viewBtn}>
          <View style={styles.view_Total}>
            <Text style={styles.text_Total}>Total</Text>
            <Text style={styles.text_Total}>$100</Text>
          </View>
          <TouchableOpacity style={styles.btnCheck}>
            <Text style={styles.textCheck}>Checkout</Text>
          </TouchableOpacity>
        </View>
      ) : null} */}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  view_NotData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  img_NotData: {width: 100, height: 100},
  text_NotData: {
    fontSize: 26,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
  },
  text_NotItem: {
    width: 220,
    textAlign: 'center',
    fontSize: 14,
    color: colors.grayColor,
    fontFamily: 'Poppins-Regular',
  },
  btn_Shopping: {
    marginTop: 20,
    backgroundColor: '#5956E9',
    width: 200,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_Shopping: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  view_Cart: {
    padding: 10,
    flexDirection: 'row',
    // backgroundColor: 'red',
    flex: 1,
  },
  img_Product: {width: 160, height: 160, borderRadius: 10},
  view_Info: {
    flex: 1,
    width: 200,
    marginLeft: 10,
  },
  text_Info: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: colors.primaryColor,
  },
  text_Size: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.grayColor,
    marginVertical: 5,
  },
  view_Qty: {
    flexDirection: 'row',
    marginTop: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_Qty: {
    paddingHorizontal: 10,
    borderWidth: 2,
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_Qty: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
  },
  btn_Close: {
    marginLeft: 'auto',
    marginRight: 10,
    padding: 5,
  },
  view_Delivery: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  view_Total: {
    marginHorizontal: 20,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text_Delivery: {
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    color: colors.primaryColor,
  },
  text_Total: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.primaryColor,
  },
  viewBtn: {marginBottom: 5},
  btnCheck: {
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5956E9',
    borderRadius: 15,
  },
  textCheck: {color: '#F6F6F9', fontFamily: 'Poppins-Regular', fontSize: 16},
});
