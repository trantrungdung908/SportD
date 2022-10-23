import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  LogBox,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {images} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import ModalSuccess from '../components/ModalSuccess';
import ModalError from '../components/ModalError';
import React, {useState, useEffect} from 'react';
import {
  isValidPasswordLength,
  isValidPasswordUpper,
  isValidPasswordLower,
  isValidPasswordNumber,
  isValidEmail,
  isValidUser,
  isValidPasswordSpecial,
} from '../../ultilies/Validate';
import {
  auth,
  firebaseData,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  ref,
  set,
  // firestore
  databaseStore,
  collection,
  addDoc,
  setDoc,
  doc,
} from '../../../firebase/config';
LogBox.ignoreLogs([
  'Warning: Async Storage has been extracted from react-native core',
]);
const SignUp = props => {
  const navigation = useNavigation();
  const [isShow, setIsShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMess, setErrorMess] = useState('');
  const [successMess, setSuccessMess] = useState('');
  const [displayModal, setDisplayModal] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  const [pass, setPass] = useState('');
  const [checkUsername, setCheckUsername] = useState('');
  const handleRegister = () => {
    setIsLoading(true);
    //register with Email & password
    createUserWithEmailAndPassword(auth, email, pass, username)
      .then(userCredential => {
        const user = userCredential.user;
        if (user) {
          updateProfile(auth.currentUser, {
            displayName: username,
          })
            .then(() => {
              let users = {
                email: user.email,
                emailVerified: user.emailVerified,
                accessToken: user.accessToken,
                displayName: user.displayName,
                phone: '',
                country: '',
                city: '',
                userImg: null,
              };
              // Save to FB
              // set(ref(firebaseData, `users/${user.uid}`), users);
              // Save to Firestore
              setDoc(doc(databaseStore, 'users', `${user.uid}`), users)
                // addDoc(collection(databaseStore, 'products'), users)
                .then(() => {
                  console.log('SUCCESS');
                })
                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {
              console.log('error', error);
            });
        }
        // sendEmailVerification(user).then(() => {
        //   // alert('You can check your spam mail to verify account');
        // });
        setSuccessMess('Your account has been created.');
      })
      .catch(error => {
        console.log('ERRORCODE', error.code);
        if (error.code === 'auth/network-request-failed') {
          setErrorMess('No internet connection!!! ');
        }
        if (error.code === 'auth/email-already-in-use') {
          setErrorMess(
            'The email address is already in use by another account!!!',
          );
        }
        setDisplayModal(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const isValid = () => {
    return (
      email.length > 0 &&
      isValidUser(username) &&
      isValidEmail(email) &&
      isValidPasswordLength(pass) &&
      isValidPasswordUpper(pass) &&
      isValidPasswordLower(pass) &&
      isValidPasswordNumber(pass) &&
      isValidPasswordSpecial(pass)
    );
  };
  const handleOverlay = () => {
    setDisplayModal(!displayModal);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground source={images.bgImg} style={styles.image}>
          <FocusAwareStatusBar
            barStyle="light-content"
            backgroundColor="#171717"
          />
          <SafeAreaView style={styles.header}>
            <Text style={styles.text_header}>Create an account!</Text>
          </SafeAreaView>
          <View style={styles.footer}>
            <Text style={styles.text_footer}>
              Email<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.action}>
              <Feather name="mail" color="#000" size={20} />
              <TextInput
                value={email}
                style={styles.textInput}
                placeholder="example@gmail.com"
                autoCapitalize="none"
                onChangeText={text => {
                  setEmail(text);
                }}
              />
              {email != '' && !isValidEmail(email) ? (
                <Feather name="x" color="#FF0000" size={20} />
              ) : null}
              {isValidEmail(email) && (
                <Feather name="check" color="#35AC5E" size={20} />
              )}
            </View>

            <Text style={[styles.text_footer, {marginTop: 25}]}>
              Username<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.action}>
              <Feather name="user" color="#000" size={20} />
              <TextInput
                value={username}
                style={styles.textInput}
                placeholder="Your username"
                autoCapitalize="none"
                onChangeText={text => {
                  setCheckUsername(
                    isValidUser(text) === true
                      ? ''
                      : 'Username must have at least 6 characters!!!',
                  );
                  setUsername(text);
                }}
              />
            </View>
            {/* User */}
            {username != '' && !isValidUser(username) ? (
              <Text style={styles.text_warning}>{checkUsername}</Text>
            ) : null}

            {/* Phone */}
            {/* <Text style={[styles.text_footer, {marginTop: 25}]}>
              Phone number
            </Text>
            <View style={styles.action}>
              <Feather name="phone" color="#000" size={20} />
              <TextInput
                value={phone}
                style={styles.textInput}
                placeholder="Your number"
                keyboardType="number-pad"
                autoCapitalize="none"
                onChangeText={value => {
                  setPhone(value);
                }}
              />
            </View> */}

            <Text style={[styles.text_footer, {marginTop: 25}]}>
              Password<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.action}>
              <Feather name="lock" color="#000" size={20} />
              <TextInput
                value={pass}
                style={styles.textInput}
                placeholder="Your password"
                autoCapitalize="none"
                secureTextEntry={isShow == true ? false : true}
                onChangeText={value => {
                  setPass(value);
                }}
              />
              {/* Pass */}
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

            {/* Check valid pass */}
            {pass.length > 0 ? (
              <View style={styles.view_Check}>
                <View>
                  {isValidPasswordUpper(pass) ? (
                    <View style={styles.flex_Pass}>
                      <Feather name="check" color="#35AC5E" size={20} />
                      <Text style={styles.success_Pass}>
                        1 uppercase letter
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.flex_Pass}>
                      <Feather name="x" color="#FF0000" size={20} />
                      <Text style={styles.danger_Pass}>1 uppercase letter</Text>
                    </View>
                  )}
                  <View style={{flexDirection: 'row'}}>
                    {isValidPasswordLower(pass) ? (
                      <View style={styles.flex_Pass}>
                        <Feather name="check" color="#35AC5E" size={20} />
                        <Text style={styles.success_Pass}>
                          1 lowercase letter
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.flex_Pass}>
                        <Feather name="x" color="#FF0000" size={20} />
                        <Text style={styles.danger_Pass}>
                          1 lowercase letter
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    {isValidPasswordNumber(pass) ? (
                      <View style={styles.flex_Pass}>
                        <Feather name="check" color="#35AC5E" size={20} />
                        <Text style={styles.success_Pass}>1 number </Text>
                      </View>
                    ) : (
                      <View style={styles.flex_Pass}>
                        <Feather name="x" color="#FF0000" size={20} />
                        <Text style={styles.danger_Pass}>1 number </Text>
                      </View>
                    )}
                  </View>
                </View>
                <View>
                  {isValidPasswordLength(pass) ? (
                    <View style={styles.flex_Pass}>
                      <Feather name="check" color="#35AC5E" size={20} />
                      <Text style={styles.success_Pass}>
                        Minimum 8 characters
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.flex_Pass}>
                      <Feather name="x" color="#FF0000" size={20} />
                      <Text style={styles.danger_Pass}>
                        Minimum 8 characters
                      </Text>
                    </View>
                  )}
                  <View style={{flexDirection: 'row'}}>
                    {isValidPasswordSpecial(pass) ? (
                      <View style={styles.flex_Pass}>
                        <Feather name="check" color="#35AC5E" size={20} />
                        <Text style={styles.success_Pass}>
                          1 special character
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.flex_Pass}>
                        <Feather name="x" color="#FF0000" size={20} />
                        <Text style={styles.danger_Pass}>
                          1 special character
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ) : null}

            <View style={styles.button_SignUp}>
              <TouchableOpacity
                disabled={!isValid()}
                style={[
                  styles.signUp,
                  {
                    backgroundColor: isValid() === true ? '#000' : '#Ebebe4',
                    borderWidth: 1,
                    borderColor: '#fff',
                  },
                ]}
                onPress={() => {
                  handleRegister();
                }}>
                <Text style={styles.textSign}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.view_Button]}>
              <Text style={styles.text_Quest}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={styles.button_Login}>
                <Text style={styles.text_Log}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
          {displayModal === true ? (
            <ModalError errorMess={errorMess} hideModal={handleOverlay} />
          ) : null}

          {isLoading === true ? (
            <ModalSuccess />
          ) : successMess === 'Your account has been created.' ? (
            <ModalSuccess
              successMess={successMess}
              navigate={() => {
                navigation.navigate('LoginScreen');
              }}
            />
          ) : null}
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flex: 0.5,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#000000c0',
    // backgroundColor: 'green',
  },
  footer: {
    flex: 2,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
    // backgroundColor: '#000000c0',
  },
  text_footer: {
    color: '#000',
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: -10,
  },
  text_header: {
    textAlign: 'center',
    fontSize: Platform.OS === 'ios' ? 26 : 24,
    fontFamily: 'Poppins-Bold',
    // fontFamily: 'Poppins-Regular',
    color: '#fff',
    fontWeight: '600',
    marginTop: Platform.OS === 'android' ? 50 : 20,
    // marginTop: 20,
  },
  text_warning: {
    color: '#FE5655',
    marginTop: 5,
    fontSize: 16,
    fontWeight: '700',
  },
  flex_Pass: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  success_Pass: {
    color: '#35AC5E',
    fontFamily: 'Poppins-Light',
  },
  danger_Pass: {
    color: '#FF0000',
    fontFamily: 'Poppins-Light',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    // marginTop: Platform.OS === 'ios' ? -4 : -12,
    // backgroundColor: 'red',
    fontFamily: 'Poppins-Light',
    // paddingLeft: 5,
    padding: 5,
    color: '#000',
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view_Button: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  button_SignUp: {
    alignItems: 'center',
    marginTop: 40,
  },
  button_Login: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  signUp: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  textSign: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  view_Check: {
    marginTop: 15,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
  },
  text_Quest: {
    fontSize: Platform.OS === 'ios' ? 14 : 12,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  text_Log: {
    fontFamily: 'Poppins-Bold',
    fontSize: Platform.OS === 'ios' ? 14 : 12,
    color: '#000',
    fontWeight: '600',
  },
});
