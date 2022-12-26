import {StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {images} from '../../constants';
import {Overlay} from '@rneui/base';

const ModalError = props => {
  const {hideModal} = props;
  return (
    <Overlay
      overlayStyle={styles.Overlay}
      isVisible={true}
      onBackdropPress={hideModal}>
      <Image source={images.checkFail} style={styles.imgSuccess} />
      <Text
        style={{
          marginVertical: 10,
          fontSize: 18,
          fontFamily: 'Poppins-Light',
          textAlign: 'center',
          color: '#000',
          lineHeight: 26,
        }}>
        {props.errorMess}
      </Text>
      <TouchableOpacity style={styles.view_Button} onPress={hideModal}>
        <Text style={styles.text_Next}>Try again</Text>
      </TouchableOpacity>
    </Overlay>
  );
};

export default ModalError;

const styles = StyleSheet.create({
  Overlay: {
    width: '90%',
    height: 300,
    backgroundColor: '#fff',
    alignItems: 'center',
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
