import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import colors from '../../constants/colors';
import images from '../../constants/images';
import {useNavigation, StackActions} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

const OrderHistoryScreen = () => {
  const userId = useSelector(state => state.login.currentUser.uid);
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [isSelected, setIsSelected] = useState();
  useEffect(() => {
    const subscriber = firestore()
      .collection(`orders`)
      .where('orderUserId', '==', `${userId}`)
      .onSnapshot(querySnapshot => {
        const ordersData = [];
        querySnapshot.forEach(documentSnapshot => {
          ordersData.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setOrders(ordersData);
      });
    return () => subscriber();
  }, []);
  return (
    <ScrollView style={styles.container}>
      {orders.length > 0 ? (
        orders
          .sort((a, b) => b.orderDate.seconds - a.orderDate.seconds)
          .map((item, index) => {
            return (
              <View
                key={item.orderId}
                style={{
                  backgroundColor: colors.grayLightColor,
                  borderRadius: 5,
                  height: 'auto',
                  padding: 10,
                  marginBottom: 10,
                  marginHorizontal: 20,
                }}>
                <View style={styles.viewRow}>
                  <Text style={styles.text}>Id:</Text>
                  <Text style={styles.text}>#{item.orderId}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={styles.text}>Order Date:</Text>
                  <Text style={styles.text}>
                    {moment(item.orderDate.toDate()).format(
                      'MMMM Do YYYY, h:mm:ss',
                    )}
                  </Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={styles.text}>Status:</Text>
                  <Text style={styles.text}>{item.orderDeliveryStatus} </Text>
                </View>
                <TouchableOpacity
                  style={styles.btnDetails}
                  onPress={() => {
                    setShowDetails(prev => !prev);
                    setIsSelected(index);
                  }}>
                  {index === isSelected && showDetails ? (
                    <Text style={styles.textDetails}>Hide details</Text>
                  ) : (
                    <Text style={styles.textDetails}>Show details</Text>
                  )}
                </TouchableOpacity>
                {showDetails && index === isSelected ? (
                  <View>
                    <View style={styles.viewRow}>
                      <Text style={styles.text}>Reciever:</Text>
                      <Text style={styles.text}>{item.orderName}</Text>
                    </View>
                    <View style={styles.viewRow}>
                      <Text style={styles.text}>Address:</Text>
                      <Text style={styles.text}>{item.orderAddress}</Text>
                    </View>
                    <View style={styles.viewRow}>
                      <Text style={styles.text}>Phone:</Text>
                      <Text style={styles.text}>{item.orderPhone}</Text>
                    </View>
                    <View style={styles.viewRow}>
                      <Text style={styles.text}>Payment Method:</Text>
                      <Text style={styles.text}>{item.orderPayment}</Text>
                    </View>
                    <Text style={styles.text}>Products:</Text>
                    {item.orderData.map(itemProduct => {
                      return (
                        <View
                          key={itemProduct.key}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 10,
                          }}>
                          <Image
                            source={{uri: itemProduct.imgProduct}}
                            style={{
                              width: 100,
                              height: 100,
                              borderRadius: 10,
                            }}
                          />
                          <View
                            style={{
                              justifyContent: 'space-between',
                              width: 150,
                            }}>
                            <Text numberOfLines={2} style={styles.text}>
                              {itemProduct.name}
                            </Text>
                            <Text style={styles.text}>
                              Size:{itemProduct.size}
                            </Text>
                            <Text style={styles.text}>
                              x {itemProduct.quantity}
                            </Text>
                          </View>
                          <View style={{alignSelf: 'flex-end'}}>
                            <Text style={styles.text}>
                              ${itemProduct.price}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                    <View style={styles.viewRow}>
                      <Text style={styles.text}>Total:</Text>
                      <Text style={styles.text}>${item.orderCost}</Text>
                    </View>
                  </View>
                ) : (
                  <View />
                )}
                {/* <DetailsButton index={index} /> */}
              </View>
            );
          })
      ) : (
        <View style={styles.container}>
          <Image
            source={images.noHistoryOrder}
            style={{
              width: 250,
              height: 250,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontFamily: 'Poppins-Regular',
              fontSize: 28,
              color: colors.primaryColor,
            }}>
            No history yet
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontFamily: 'Poppins-Regular',
              fontSize: 16,
              color: colors.primaryColor,
              width: 200,
              alignSelf: 'center',
            }}>
            Hit the button down below to shopping
          </Text>
          <TouchableOpacity
            style={styles.btn_Shopping}
            onPress={() => {
              navigation.dispatch(StackActions.popToTop());
              navigation.navigate('HomeScreen');
            }}>
            <Text style={styles.text_Shopping}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
    fontSize: 16,
  },
  btnDetails: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5956E9',
    borderRadius: 5,
    alignSelf: 'center',
    // width: 250,
  },
  textDetails: {
    color: '#F6F6F9',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  btn_Shopping: {
    marginTop: 20,
    backgroundColor: '#5956E9',
    width: 200,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  text_Shopping: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});
