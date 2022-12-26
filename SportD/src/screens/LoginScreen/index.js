import {
  StyleSheet,
  Text,
  View,
  // StatusBar,
  TextInput,
  Platform,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import React, {useState, memo} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {images} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import {auth, signInWithEmailAndPassword} from '../../../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginFail, loginStart, loginSuccess} from './action';
import {useDispatch, useSelector} from 'react-redux';
import ModalError from '../components/ModalError';
const LoginScreen = props => {
  const navigation = useNavigation();
  const [isShow, setIsShow] = useState(false);
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [displayModal, setDisplayModal] = useState(false);
  const [errorMess, setErrorMess] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector(state => state.login.loading);

  const handleLogin = async () => {
    dispatch(loginStart());
    await signInWithEmailAndPassword(auth, username, pass)
      .then(userCredential => {
        const user = userCredential.user;
        if (user) {
          dispatch(loginSuccess(user));
        }
        AsyncStorage.setItem('user', JSON.stringify(user));
      })
      .catch(error => {
        const errorCode = error.code;
        if (errorCode === 'auth/network-request-failed') {
          setErrorMess(
            'No internet connection!!! Check your internet connection and try again',
          );
        }
        if (errorCode === 'auth/user-not-found') {
          setErrorMess('Your email address is invaild! Please try again');
        }
        if (errorCode === 'auth/invalid-email') {
          setErrorMess('Wrong Email!!! Please try again');
        }
        if (errorCode === 'auth/wrong-password') {
          setErrorMess(
            'Incorrect password! Please try again or use Forgot Password',
          );
        }
        setDisplayModal(true);
        dispatch(loginFail());
      });
  };
  const handleOverlay = () => {
    setDisplayModal(!displayModal);
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground source={images.bgImg} style={styles.image}>
            <FocusAwareStatusBar
              barStyle="light-content"
              backgroundColor="transparent"
              translucent={true}
            />
            <View style={styles.header}></View>
            <View style={styles.footer}>
              <Text style={styles.text_footer}>E-mail</Text>
              <View style={styles.action}>
                <Feather name="mail" color="#000" size={20} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Your email"
                  placeholderTextColor={'#BDBDBD'}
                  autoCapitalize="none"
                  value={username}
                  onChangeText={value => {
                    setUsername(value);
                  }}
                />
              </View>
              <View style={styles.view_Pass}>
                <Text style={styles.text_footer}>Password</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ForgetScreen');
                  }}>
                  <Text style={styles.text_forget}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.action}>
                <Feather name="lock" color="#000" size={20} />
                <TextInput
                  value={pass}
                  onChangeText={password => {
                    setPass(password);
                  }}
                  style={styles.textInput}
                  placeholder="Your password"
                  placeholderTextColor={'#BDBDBD'}
                  autoCapitalize="none"
                  secureTextEntry={isShow == true ? false : true}
                />
                <TouchableOpacity
                  onPress={() => {
                    setIsShow(!isShow);
                  }}>
                  {isShow == true ? (
                    <Feather name="eye-off" color="#000" size={20} />
                  ) : (
                    <Feather name="eye" color="#000" size={20} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.button_SignIn}>
                <TouchableOpacity
                  style={styles.signIn}
                  onPress={() => {
                    handleLogin();
                  }}>
                  {loading === true ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                  ) : (
                    <Text style={styles.textSign}>Sign In</Text>
                  )}
                </TouchableOpacity>
              </View>
              <View style={[styles.view_Button]}>
                <Text style={styles.text_Quest}>Don't have an account?</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SignUpScreen');
                  }}
                  style={styles.button_Create}>
                  <Text style={styles.text_Create}> Create new account</Text>
                </TouchableOpacity>
              </View>
            </View>
            {displayModal === true ? (
              <ModalError errorMess={errorMess} hideModal={handleOverlay} />
            ) : null}
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default memo(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flex: 1,
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_footer: {
    color: '#000',
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: -10,
  },
  text_forget: {
    color: '#000',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-Regular',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    // marginTop: Platform.OS === 'ios' ? 0 : -12,
    padding: 5,
    // paddingLeft: 5,
    color: '#000',
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    fontFamily: 'Poppins-Light',
  },
  view_Button: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  button_SignIn: {
    alignItems: 'center',
    marginTop: 40,
  },
  button_Create: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  view_Pass: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
    alignItems: 'center',
  },
  signIn: {
    backgroundColor: '#000',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Bold',
  },
  text_Quest: {
    fontSize: Platform.OS === 'ios' ? 14 : 12,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  text_Create: {
    fontFamily: 'Poppins-Bold',
    fontSize: Platform.OS === 'ios' ? 14 : 12,
    color: '#000',
    fontWeight: '600',
  },
});
