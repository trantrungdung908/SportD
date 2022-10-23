import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import colors from '../../constants/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {v4 as uuidv4} from 'uuid';

const windowWeight = Dimensions.get('window').width;
const DetailsScreen = props => {
  const navigation = useNavigation();
  const userId = useSelector(state => state.login.currentUser.uid);
  const route = useRoute();
  const {params} = route;
  const detailsItem = params.item;

  const [detailsData, setDetailsData] = useState(detailsItem);
  const [itemInCart, setItemInCart] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSelected, setIsSelected] = useState();
  const [selectSize, setSelectSize] = useState();

  //handle indexSlide
  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / windowWeight);
    setCurrentSlideIndex(currentIndex);
  };
  //3 DOT
  const Dot = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          transform: [{translateY: -20}],
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {detailsData.imgProducts.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlideIndex == index && {
                  backgroundColor: colors.primaryColor,
                },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };
  //handle addtoCart
  const handleAddToCart = async () => {
    const exist = itemInCart.find(a => a.size === selectSize);
    if (!exist) {
      if (selectSize === undefined) {
        alert('Please choose your size');
        return;
      } else {
        firestore()
          .collection(`cart-${userId}`)
          .add({
            idProduct: detailsData.idProduct,
            imgProduct: detailsData.imgProducts[0],
            name: detailsData.name,
            price: detailsData.price,
            size: selectSize,
            quantity: 1,
            addTime: firestore.Timestamp.fromDate(new Date()),
          })
          .then(() => {
            alert('Product added to cart');
            setSelectSize();
            setIsSelected();
          })
          .catch(err => {
            console.log(err.code);
          });
      }
    } else {
      if (exist.name !== detailsData.name) {
        firestore()
          .collection(`cart-${userId}`)
          .add({
            idProduct: detailsData.idProduct,
            imgProduct: detailsData.imgProducts[0],
            name: detailsData.name,
            price: detailsData.price,
            size: selectSize,
            quantity: 1,
            addTime: firestore.Timestamp.fromDate(new Date()),
          })
          .then(() => {
            // setTimeout(() => {
            //   Alert.alert('Success', 'Product added to cart');
            // }, 100);
            alert('Product added to cart');
            setSelectSize();
            setIsSelected();
          })
          .catch(err => {
            console.log(err.code);
          });
      } else {
        firestore()
          .collection(`cart-${userId}`)
          .doc(exist.key)
          .update({
            quantity: exist.quantity + 1,
          })
          .then(() => {
            setSelectSize();
            setIsSelected();
          });
      }
    }
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection(`cart-${userId}`)
      .onSnapshot(querySnapshot => {
        const cartData = [];
        querySnapshot.forEach(documentSnapshot => {
          cartData.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setItemInCart(cartData);
      });
    return () => subscriber();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <FocusAwareStatusBar backgroundColor="#fff" barStyle="dark-content" />
      {/* Carousel */}
      <View style={{flex: 1}}>
        <ScrollView
          onMomentumScrollEnd={updateCurrentSlideIndex}
          pagingEnabled
          scrollEventThrottle={16}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {detailsData.imgProducts.map(item => {
            return (
              <Image key={item} source={{uri: item}} style={styles.imgSlide} />
            );
          })}
        </ScrollView>
        <Dot />
      </View>
      {/* details product */}
      <View style={styles.view_Details}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.textCategory}>{detailsData.subCategory}</Text>
          <Text style={styles.textCategory}>5 🌟</Text>
        </View>

        <Text style={styles.textName}>{detailsData.name}</Text>
        <Text style={styles.textPrice}>${detailsData.price}</Text>
        <Text style={styles.textDesc}>{detailsData.description}</Text>
        {/* Sizes */}
        <Text style={styles.textSize}>Select your size</Text>
        <View style={styles.viewSizes}>
          {detailsData.sizes.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setIsSelected(index);
                  setSelectSize(item);
                }}
                style={[
                  styles.btnSizes,
                  {
                    backgroundColor: index === isSelected ? '#E1E1E1' : '#FFF',
                  },
                ]}
                key={item}>
                <Text style={styles.textNumber}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Reviews */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textReviews}>Reviews</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ReviewsScreen');
            }}>
            <Text style={styles.textReviews}>View all</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Add to cart */}
      <View style={styles.viewBtn}>
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={() => {
            handleAddToCart();
          }}>
          <Text style={styles.textAdd}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imgSlide: {
    height: 500,
    width: windowWeight,
  },
  dot: {
    marginHorizontal: 4,
    width: 26,
    height: 4,
    backgroundColor: colors.grayColor,
    borderRadius: 20,
  },
  view_Details: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  textCategory: {
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    color: colors.primaryColor,
  },
  textName: {
    fontWeight: Platform.OS === 'ios' ? '400' : '600',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
    marginVertical: 5,
  },
  textPrice: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
    fontWeight: Platform.OS === 'ios' ? '400' : '600',
  },
  textDesc: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
  },
  textSize: {
    marginTop: 20,
    fontWeight: Platform.OS === 'ios' ? '400' : '600',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.primaryColor,
  },
  viewSizes: {flexDirection: 'row', marginTop: 5},
  textReviews: {
    marginTop: 5,
    fontWeight: Platform.OS === 'ios' ? '400' : '600',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.primaryColor,
  },
  btnSizes: {
    borderRadius: 50,
    borderColor: '#F3F2F7',
    borderWidth: 1,
    // backgroundColor: isSelected ? '#E1E1E1' : null,
    width: 50,
    height: 50,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textNumber: {
    color: '#5543CB',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  viewBtn: {marginVertical: 20, flex: 1},
  btnAdd: {
    padding: 20,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colors.primaryColor,
    backgroundColor: '#5956E9',
    borderRadius: 15,
  },
  textAdd: {color: '#F6F6F9', fontFamily: 'Poppins-Regular', fontSize: 16},
});
