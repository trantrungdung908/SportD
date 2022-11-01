import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {colors, images} from '../../constants';
import {
  useNavigation,
  StackActions,
  CommonActions,
} from '@react-navigation/native';

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
          <TouchableOpacity>
            <Text>Track My Order</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginTop: 20}}
            onPress={() => {
              //   navigation.reset(
              //     {
              //         index:0,
              //         routeNames : ['']
              //     }
              //   )
            }}>
            <Text>Return Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OrderSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
