import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {memo} from 'react';
import {colors, images} from '../../constants';
import {useNavigation, StackActions} from '@react-navigation/native';

const windowWeight = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const OrderSuccess = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{marginTop: 20}}>
        <Image
          style={{
            width: 350,
            height: 350,
            alignSelf: 'center',
          }}
          source={images.successOrder}
        />
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Poppins-Bold',
            fontSize: 20,
            color: colors.primaryColor,
          }}>
          Your order was successful !
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Poppins-Light',
            fontSize: 16,
            color: colors.primaryColor,
            marginTop: 10,
          }}>
          Thanks for your order
        </Text>
        <View
          style={{
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              navigation.dispatch(StackActions.popToTop());
              navigation.navigate('ProfileStackScreen', {
                screen: 'OrderHistoryScreen',
              });
            }}>
            <Text style={styles.text}>Track My Order</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, {marginTop: 10}]}
            onPress={() => {
              navigation.dispatch(StackActions.popToTop());
              navigation.navigate('HomeScreen');
            }}>
            <Text style={styles.text}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(OrderSuccess);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  btn: {
    // marginTop: 20,
    backgroundColor: '#5956E9',
    width: 200,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});
