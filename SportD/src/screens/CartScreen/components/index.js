import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useCallback, memo} from 'react';
import colors from '../../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
const CartItem = props => {
  const {itemData, setTotalPrice} = props;
  const [quantity, setQuantity] = useState(itemData.quantity);
  const [cartData, setCartData] = useState([]);
  // console.log('ITEM', cartData);

  // handleQuantity
  const handleQuantity = useCallback(
    async type => {
      let stringUser = await AsyncStorage.getItem('user');
      let myUserId = JSON.parse(stringUser).uid;
      if (type === 'desc') {
        quantity > 1 && setQuantity(quantity - 1);
        await firestore()
          .collection(`cart-${myUserId}`)
          .doc(itemData.key)
          .update({
            quantity: quantity - 1,
          })
          .then(() => {})
          .catch(error => {});
      } else {
        setQuantity(quantity + 1);
        await firestore()
          .collection(`cart-${myUserId}`)
          .doc(itemData.key)
          .update({
            quantity: quantity + 1,
          })
          .then(() => {})
          .catch(error => {});
      }
    },
    [quantity],
  );
  // handleDelete
  const handleDeleteCartItem = useCallback(async () => {
    let stringUser = await AsyncStorage.getItem('user');
    let myUserId = JSON.parse(stringUser).uid;
    await firestore()
      .collection(`cart-${myUserId}`)
      .doc(itemData.key)
      .delete()
      .then(() => {});
  }, [itemData]);

  const alertDelete = useCallback(() => {
    Alert.alert(
      'Do you want to delete?',
      'You can cancel to keep this product.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            handleDeleteCartItem();
          },
        },
      ],
    );
  }, [itemData]);

  useEffect(() => {
    setQuantity(itemData.quantity);
  }, [itemData]);

  return (
    <View key={itemData.key} style={styles.container}>
      <View style={styles.view_Cart}>
        <Image style={styles.img_Product} source={{uri: itemData.imgProduct}} />
        <View style={styles.view_Info}>
          <Text style={styles.text_Info}>{itemData.name}</Text>
          {itemData.size !== undefined ? (
            <Text style={styles.text_Size}>{`Size:${itemData?.size}`}</Text>
          ) : (
            <View style={{marginTop: 10}} />
          )}
          <Text style={styles.text_Info}>{`$${itemData.price}`}</Text>
          <View style={styles.view_Qty}>
            <TouchableOpacity
              disabled={quantity === 1 ? true : false}
              style={styles.btn_Qty}
              onPress={() => {
                handleQuantity('desc');
              }}>
              <Text style={{fontSize: 18, color: '#000'}}>-</Text>
            </TouchableOpacity>
            <Text style={styles.text_Qty}>{quantity}</Text>
            <TouchableOpacity
              style={styles.btn_Qty}
              onPress={() => {
                handleQuantity('inc');
              }}>
              <Text style={{fontSize: 18, color: '#000'}}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn_Close}
              onPress={() => {
                alertDelete();
              }}>
              <Ionicons name="trash" style={{fontSize: 22, color: '#000'}} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(CartItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  view_Cart: {
    padding: 10,
    flexDirection: 'row',
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
});
