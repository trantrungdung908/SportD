import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {images} from '../../../constants';
import Feather from 'react-native-vector-icons/Feather';
import {
  auth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from '../../../../firebase/config';
import ModalError from '../../components/ModalError';
import ModalSuccess from '../../components/ModalSuccess';
import Loading from '../../components/Loading';
import {useNavigation} from '@react-navigation/native';

const ChangePass = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [errorMess, setErrorMess] = useState('');
  const [successMess, setSuccessMess] = useState('');
  const user = auth?.currentUser;
  const credential = EmailAuthProvider.credential(user?.email, currentPassword);

  const handleChange = () => {
    setIsLoading(true);
    if (currentPassword === newPassword) {
      setErrorMess(
        'Your new password cannot be the same as your current password ',
      );
      setDisplayModal(true);
      setIsLoading(false);
    } else {
      reauthenticateWithCredential(user, credential)
        .then(() => {
          updatePassword(user, newPassword)
            .then(() => {
              setCurrentPassword('');
              setNewPassword('');
              setSuccessMess('Your account has been changed password.');
            })
            .catch(error => {
              if (error.code === 'auth/weak-password') {
                setErrorMess('Weak password !!!');
              }
              setDisplayModal(true);
            });
        })
        .catch(error => {
          console.log('ERRORCODE', error.code);
          // if (error.code === 'auth') {
          //   setErrorMess('');
          // }
          // if (error.code === 'auth/too-many-requests') {
          //   setErrorMess(
          //     'Your new password cannot be the same as your current password !!!',
          //   );
          // }
          if (error.code === 'auth/wrong-password') {
            setErrorMess('Your current password is wrong !!!');
          }
          setDisplayModal(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const handleOverlay = () => {
    setDisplayModal(!displayModal);
  };
  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <Image
        source={images.resetPass}
        style={{
          alignSelf: 'center',
          width: 150,
          height: 150,
          marginTop: 20,
        }}
      />
      <View style={styles.action}>
        <Feather name="lock" color="#000" size={20} />
        <TextInput
          cursorColor="#000"
          selectionColor={'#000'}
          style={styles.textInput}
          placeholder="Current Password"
          autoCapitalize="none"
          value={currentPassword}
          onChangeText={value => {
            setCurrentPassword(value);
          }}
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
      <View style={styles.action}>
        <Feather name="lock" color="#000" size={20} />
        <TextInput
          cursorColor="#000"
          selectionColor={'#000'}
          style={styles.textInput}
          placeholder="New Password"
          autoCapitalize="none"
          value={newPassword}
          onChangeText={value => {
            setNewPassword(value);
          }}
          secureTextEntry={show == true ? false : true}
        />
        <TouchableOpacity
          onPress={() => {
            setShow(!show);
          }}>
          {show == true ? (
            <Feather name="eye-off" color="#000" size={20} />
          ) : (
            <Feather name="eye" color="#000" size={20} />
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.btn_Submit,
          {
            backgroundColor: '#000',
          },
        ]}
        onPress={() => {
          handleChange();
        }}>
        <Text style={styles.text_Submit}>Submit</Text>
      </TouchableOpacity>
      {isLoading ? (
        <View
          style={{
            backgroundColor: '#000',
            position: 'absolute',
            opacity: 0.6,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}>
          <Loading />
        </View>
      ) : (
        <></>
      )}
      {displayModal === true ? (
        <ModalError errorMess={errorMess} hideModal={handleOverlay} />
      ) : null}

      {isLoading === true ? (
        <ModalSuccess />
      ) : successMess === 'Your account has been changed password.' ? (
        <ModalSuccess
          successMess={successMess}
          navigate={() => {
            navigation.goBack();
          }}
        />
      ) : null}
    </View>
  );
};

export default ChangePass;

const styles = StyleSheet.create({
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
    alignSelf: 'center',
  },
  text_Submit: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});
