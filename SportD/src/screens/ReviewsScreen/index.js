import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useCallback, memo, useMemo} from 'react';
import colors from '../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const windowHeight = Dimensions.get('window').height;

const ReviewsScreen = () => {
  const userName = useSelector(state => state.login.currentUser.displayName);
  const userId = useSelector(state => state.login.currentUser.uid);
  const route = useRoute();
  const {params} = route;
  const itemData = params.item;
  const [modalVisible, setModalVisible] = useState(false);
  const [defaultValue, setDefaultValue] = useState(5);
  const [maxValue, setMaxValue] = useState([1, 2, 3, 4, 5]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [review, setReview] = useState([]);

  // const averageRating = review?.reduce((total, next) => total + next.rating, 0) / review?.length;

  const averageRating = useMemo(() => {
    return (
      review?.reduce((total, next) => total + next.rating, 0) / review?.length
    );
  }, [review]);
  const CustomRating = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15,
        }}>
        {maxValue.map(item => {
          return (
            <TouchableOpacity key={item} onPress={() => setDefaultValue(item)}>
              {item <= defaultValue ? (
                <Text style={{fontSize: 30}}>⭐️</Text>
              ) : (
                <Text style={{fontSize: 30}}>✩</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  const handleSubmit = useCallback(async () => {
    if (title === '' || message === '') {
      alert('You must fill this before submit');
    } else {
      await firestore()
        .collection('review')
        .add({
          message: message,
          reviewAt: firestore.Timestamp.fromDate(new Date()),
          rating: defaultValue,
          title: title,
          name: userName,
          idProduct: itemData.key,
          idUser: userId,
        })
        .then(() => {
          setTitle('');
          setMessage('');
          setDefaultValue(5);
          setModalVisible(false);
        })
        .catch(err => {
          console.log(err.code);
        });
    }
  }, [title, message, defaultValue]);

  useEffect(() => {
    const subscriber = firestore()
      .collection(`review`)
      .where('idProduct', '==', `${itemData?.key}`)
      .onSnapshot(querySnapshot => {
        const reviewData = [];
        querySnapshot.forEach(documentSnapshot => {
          reviewData.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setReview(reviewData);
      });
    return () => subscriber();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.viewWithBorder}>
          <Image
            style={styles.imgProduct}
            source={{uri: itemData.imgProducts[0]}}
          />
          <Text style={styles.textProduct}>{itemData.name}</Text>
          {review?.length > 0 ? (
            <Text style={styles.textRating}>
              {Math.floor(averageRating) +
                (Math.round(averageRating - Math.floor(averageRating))
                  ? 0.5
                  : 0.0)}{' '}
              ⭐️
            </Text>
          ) : (
            <Text style={styles.textRating}>0 ⭐️</Text>
          )}
          <Text style={styles.textBasedOn}>
            Based on {review?.length} reviews
          </Text>

          <TouchableOpacity
            style={styles.btnWrite}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.textWrite}>Write a Review</Text>
          </TouchableOpacity>
        </View>
        {review?.length > 0 ? (
          <View style={styles.viewReviews}>
            {review
              .sort((a, b) => b.reviewAt.seconds - a.reviewAt.seconds)
              .map(item => {
                return (
                  <View key={item.key} style={styles.viewBorderReviews}>
                    <View style={styles.viewWrapAllReviews}>
                      <Text style={styles.textIconStar}>{item.rating}⭐️</Text>
                      <Text style={styles.textUser}>{item.name}</Text>
                    </View>
                    <Text style={styles.textTitleReviews}>{item.title}</Text>
                    <Text style={styles.textMessReviews}>{item.message}</Text>
                  </View>
                );
              })}
          </View>
        ) : (
          <View style={styles.viewNoReviews}>
            <FontAwesome name="comments" style={{fontSize: 26}} />
            <Text style={styles.textNoReviews}>No reviews yet</Text>
          </View>
        )}
        {/* Modal */}
        <SafeAreaView style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <SafeAreaView style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.viewRowSpace}>
                  <TouchableOpacity
                    style={styles.buttonClose}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Ionicons
                      color={colors.primaryColor}
                      name="close"
                      style={{fontSize: 26}}
                    />
                  </TouchableOpacity>
                  <Text style={styles.textWriteReivew}>Write a Review</Text>
                  <View></View>
                </View>
                <View style={styles.viewMargin}>
                  <View style={styles.viewWrapHeader}>
                    <Text style={styles.textQuestion}>
                      How would you rate this item?
                    </Text>
                    <CustomRating />
                  </View>
                  <View style={styles.action}>
                    <TextInput
                      style={styles.textInput}
                      placeholderTextColor={'#ccc'}
                      onChangeText={title => {
                        setTitle(title);
                      }}
                      placeholder={'Title'}
                    />
                  </View>
                  <View style={styles.action}>
                    <TextInput
                      placeholderTextColor={'#ccc'}
                      onChangeText={value => {
                        setMessage(value);
                      }}
                      style={styles.textInput}
                      multiline={true}
                      placeholder={'Message'}
                    />
                  </View>
                  <View style={{marginTop: 20}}>
                    <TouchableOpacity
                      style={styles.btnWrite}
                      onPress={() => {
                        handleSubmit();
                      }}>
                      <Text style={styles.textWrite}>Submit a Review</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default memo(ReviewsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewWithBorder: {
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
  },
  centeredView: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  modalView: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    padding: 10,
  },
  textStyle: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
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
  btnWrite: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5956E9',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
    width: 250,
  },
  textWrite: {
    color: '#F6F6F9',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  imgProduct: {
    height: 180,
    width: 180,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textProduct: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
  },
  textRating: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
  },
  textBasedOn: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
    marginVertical: 5,
  },
  viewReviews: {flex: 1, marginHorizontal: 20, marginTop: 10},
  viewBorderReviews: {
    backgroundColor: colors.grayLightColor,
    borderRadius: 5,
    height: 'auto',
    flexGrow: 1,
    padding: 10,
    marginBottom: 10,
  },
  viewWrapAllReviews: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'center',
  },
  textIconStar: {color: colors.primaryColor, fontSize: 16},
  textUser: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.primaryColor,
  },
  textTitleReviews: {
    color: colors.primaryColor,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  textMessReviews: {
    color: colors.primaryColor,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  viewNoReviews: {
    alignItems: 'center',
    justifyContent: 'center',
    height: windowHeight - 450,
  },
  textNoReviews: {
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  viewRowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textWriteReivew: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
    marginRight: 30,
    justifyContent: 'center',
  },
  viewMargin: {
    flex: 1,
    marginHorizontal: 20,
  },
  viewWrapHeader: {
    height: 120,
  },
  textQuestion: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    color: colors.primaryColor,
  },
});
