import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {colors, images} from '../../constants';
import {isValidEmail} from '../../ultilies/Validate';
import {auth, sendPasswordResetEmail} from '../../../firebase/config';
import Feather from 'react-native-vector-icons/Feather';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import {useNavigation} from '@react-navigation/native';

import ModalError from '../components/ModalError';
import ModalSuccess from '../components/ModalSuccess';
const ForgetSceen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [errorMess, setErrorMess] = useState('');
  const [successMess, setSuccessMess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);

  const isValid = () => {
    return isValidEmail(email) && email.length > 0;
  };
  const handleForget = () => {
    setIsLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccessMess('Check your email to change your password');
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          setErrorMess('Your email address is invaild! Please try again');
        }
        setDisplayModal(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleOverlay = () => {
    setDisplayModal(!displayModal);
  };
  return (
    <View style={styles.container}>
      <FocusAwareStatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <View style={styles.view_Forget}>
        <Image source={images.forgetPass} style={styles.img_Forget} />
        <Text style={styles.text_Forget}>Forgot your password?</Text>
        <View
          style={{
            width: 250,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-Light',
              color: colors.grayColor,
              lineHeight: 24,
            }}>
            Enter your email address to retrieve your pasword
          </Text>
        </View>
        <View style={styles.action}>
          <Feather name="mail" color="#000" size={20} />
          <TextInput
            cursorColor="#000"
            selectionColor={'#000'}
            style={styles.textInput}
            placeholder="Your email"
            autoCapitalize="none"
            value={email}
            onChangeText={value => {
              setEmail(value);
            }}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.btn_Submit,
            {
              backgroundColor: isValid() === true ? '#000' : '#Ebebe4',
            },
          ]}
          disabled={!isValid()}
          onPress={() => {
            handleForget();
          }}>
          <Text style={styles.text_Submit}>Submit</Text>
        </TouchableOpacity>
        {/* Check */}
        {displayModal === true ? (
          <ModalError errorMess={errorMess} hideModal={handleOverlay} />
        ) : null}

        {isLoading === true ? (
          <ModalSuccess />
        ) : successMess === 'Check your email to change your password' ? (
          <ModalSuccess
            successMess={successMess}
            navigate={() => {
              navigation.navigate('LoginScreen');
            }}
          />
        ) : null}
      </View>
    </View>
  );
};

export default ForgetSceen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  view_Forget: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  text_Forget: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  img_Forget: {width: 150, height: 150, marginBottom: 10},
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  textInput: {
    flex: 1,
    padding: 5,
    color: '#000',
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    fontFamily: 'Poppins-Light',
  },
  btn_Submit: {
    marginTop: 20,
    width: 200,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_Submit: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});
