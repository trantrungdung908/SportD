import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {Overlay} from '@rneui/base';
import {images} from '../../constants';
const ModalSuccess = props => {
  const {navigate} = props;
  return props.successMess ? (
    <Overlay overlayStyle={styles.Overlay} isVisible={true}>
      <Image source={images.checkSuccess} style={styles.imgSuccess} />
      <Text
        style={{
          marginVertical: 10,
          fontSize: 18,
          fontFamily: 'Poppins-Bold',
          color: '#000',
        }}>
        Success!!!
      </Text>
      <Text
        style={{
          marginVertical: 10,
          fontSize: 18,
          fontFamily: 'Poppins-Light',
          color: '#000',
          textAlign: 'center',
        }}>
        {props.successMess}
      </Text>
      <TouchableOpacity
        style={styles.view_Button}
        onPress={() => {
          navigate();
        }}>
        <Text style={styles.text_Next}>Next</Text>
      </TouchableOpacity>
    </Overlay>
  ) : (
    <Overlay overlayStyle={styles.Overlay} isVisible={true}>
      <ActivityIndicator size={'large'} color={'#2FBBF0'} />
    </Overlay>
  );
};

export default ModalSuccess;

const styles = StyleSheet.create({
  Overlay: {
    width: '90%',
    height: 320,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgSuccess: {
    width: 90,
    height: 90,
  },
  view_Button: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#000',
    // marginTop: 'auto',
    // marginBottom: 20,
    marginTop: 20,
  },
  text_Next: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
});
