import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import {colors} from '../../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
const EditProfileScreen = () => {
  const route = useRoute();
  const {params} = route;
  // console.log('PARAMS', params.info);
  const [transferred, setTransferred] = useState(0);
  const [localState, setLocalState] = useState(params.info);
  const [email, setEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [phone, setPhone] = useState(null);

  const [address, setAddress] = useState(null);
  const [image, setImage] = useState(localState.userImg);
  //handle updateUser
  const updateUser = async () => {
    let imgUrl = await uploadImage();

    let stringUser = await AsyncStorage.getItem('user');
    let myUserId = JSON.parse(stringUser).uid;
    if (imgUrl === false && localState.userImg) {
      imgUrl = localState.userImg;

      const newFields = {
        email: email || localState.email,
        displayName: userName || localState.displayName,
        phone: phone || localState.phone,
        address: address || localState.address,
        userImg: localState.userImg,
        userId: myUserId,
      };
      firestore()
        .collection('users')
        .doc(myUserId)
        .update(newFields)
        .then(() => {
          Alert.alert(
            'Profile Updated!',
            'Your profile has been updated successfully',
          );
        })
        .catch(error => {
          console.log('ERROR', error);
        });
    } else {
      const newFieldsWithUrl = {
        email: email || localState.email,
        displayName: userName || localState.displayName,
        phone: phone || localState.phone,
        address: address || localState.address,
        userImg: imgUrl,
        userId: myUserId,
      };
      firestore()
        .collection('users')
        .doc(myUserId)
        .update(newFieldsWithUrl)
        .then(() => {
          Alert.alert(
            'Profile Updated!',
            'Your profile has been updated successfully1',
          );
        })
        .catch(error => {
          console.log('ERROR', error);
        });
    }
  };
  // handle takePhoto
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        setImage(image.path);
        bs.current.snapTo(1);
      })
      .catch(error => {
        const errorCode = error.code;
        if (errorCode === 'E_PICKER_CANCELLED') {
          return false;
        }
      });
  };
  // handle choosePhoto
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        setImage(image.path);
        bs.current.snapTo(1);
      })
      .catch(error => {
        const errorCode = error.code;
        if (errorCode === 'E_PICKER_CANCELLED') {
          return false;
        }
      });
  };

  // handle upload
  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setTransferred(0);

    const storageRef = storage().ref(`usersPhoto/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setImage(null);

      return url;
    } catch (error) {
      const errorCode = error.code;

      if (errorCode === 'storage/file-not-found') {
        return false;
      }
      return null;
    }
  };

  // UI bottomSheet
  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {
          takePhotoFromCamera();
        }}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {
          choosePhotoFromLibrary();
        }}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  bs = React.createRef();
  fall = new Animated.Value(1);

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bs}
        snapPoints={[330, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {image !== null ? (
                <ImageBackground
                  source={{
                    uri: image,
                    // uri: image
                    //   ? image
                    //   : localState
                    //   ? localState.userImg ||
                    //     'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'
                    //   : 'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg',
                  }}
                  style={{height: 100, width: 100}}
                  imageStyle={{borderRadius: 15}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="camera"
                      size={35}
                      color="#fff"
                      style={{
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#fff',
                        borderRadius: 10,
                      }}
                    />
                  </View>
                </ImageBackground>
              ) : (
                <ImageBackground
                  source={{
                    uri: 'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg',
                    // uri: image
                    //   ? image
                    //   : localState
                    //   ? localState.userImg ||
                    //     'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'
                    //   : 'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg',
                  }}
                  style={{height: 100, width: 100}}
                  imageStyle={{borderRadius: 15}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="camera"
                      size={35}
                      color="#fff"
                      style={{
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#fff',
                        borderRadius: 10,
                      }}
                    />
                  </View>
                </ImageBackground>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.action}>
          <Feather name="user" color={'#000'} size={20} />
          <TextInput
            onChangeText={text => {
              setUserName(text);
            }}
            placeholder="Username"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: '#000',
              },
            ]}>
            {localState.displayName}
          </TextInput>
        </View>
        <View style={styles.action}>
          <Feather name="phone" color={'#000'} size={20} />
          <TextInput
            onChangeText={e => {
              setPhone(e);
            }}
            placeholder="Phone"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: '#000',
              },
            ]}>
            {localState.phone}
          </TextInput>
        </View>
        <View style={styles.action}>
          <FontAwesome name="envelope-o" color={'#000'} size={20} />
          <TextInput
            onChangeText={text => {
              setEmail(text);
            }}
            placeholder="Email"
            placeholderTextColor="#666666"
            keyboardType="email-address"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: '#000',
              },
            ]}>
            {localState.email}
          </TextInput>
        </View>

        <View style={styles.action}>
          <Icon name="map-marker-outline" color={'#000'} size={20} />
          <TextInput
            onChangeText={text => {
              setAddress(text);
            }}
            placeholder="Address"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: '#000',
              },
            ]}>
            {localState.address}
          </TextInput>
        </View>
        <TouchableOpacity
          style={styles.commandButton}
          onPress={() => {
            updateUser();
          }}>
          <Text style={styles.panelButtonTitle}>Submit</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#5956E9',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.1,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    color: '#000',
    fontSize: 27,
    height: 35,
    fontFamily: 'Poppins-Regular',
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    // backgroundColor: '#FF6347',
    backgroundColor: '#5956E9',

    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});
