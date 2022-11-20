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
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import colors from '../../constants/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';

const windowWeight = Dimensions.get('window').width;
const DetailsScreen = props => {
  const navigation = useNavigation();
  const userId = useSelector(state => state.login.currentUser.uid);
  const route = useRoute();
  const {params} = route;
  const detailsItem = params.item;
  const [detailsData, setDetailsData] = useState(detailsItem);

  const [itemInCart, setItemInCart] = useState([]);
  // console.log('itemInCart', itemInCart);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSelected, setIsSelected] = useState();
  const [selectSize, setSelectSize] = useState();
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState([]);
  const averageRating =
    review?.reduce((total, next) => total + next.rating, 0) / review?.length;
  //handle indexSlide
  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / windowWeight);
    setCurrentSlideIndex(currentIndex);
  };
  //3 DOT
  const Dot = () => {
    return (
      <View style={styles.view3Dot}>
        <View style={styles.flexDot}>
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
    setLoading(true);
    const exist = itemInCart.find(a => a.size === selectSize);
    if (!exist) {
      if (selectSize === undefined) {
        alert('Please choose your size');
        setLoading(false);
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
            setSelectSize();
            setIsSelected();
            setTimeout(() => {
              alert('Product added to cart');
            }, 200);
          })
          .catch(err => {
            console.log(err.code);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      if (exist.name !== detailsData.name) {
        setLoading(true);
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
            setSelectSize();
            setIsSelected();
            setTimeout(() => {
              alert('Product added to cart');
            }, 200);
          })
          .catch(err => {
            console.log(err.code);
          })
          .finally(() => {
            setLoading(false);
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
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };
  const handleAddAccess = async () => {
    setLoading(true);
    const exist = itemInCart.find(a => a.name === detailsData.name);
    if (!exist) {
      firestore()
        .collection(`cart-${userId}`)
        .add({
          idProduct: detailsData.idProduct,
          imgProduct: detailsData.imgProducts[0],
          name: detailsData.name,
          price: detailsData.price,
          quantity: 1,
          addTime: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
          setSelectSize();
          setIsSelected();
          setTimeout(() => {
            alert('Product added to cart');
          }, 200);
        })
        .catch(err => {
          console.log(err.code);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (exist.name !== detailsData.name) {
        setLoading(true);
        firestore()
          .collection(`cart-${userId}`)
          .add({
            idProduct: detailsData.idProduct,
            imgProduct: detailsData.imgProducts[0],
            name: detailsData.name,
            price: detailsData.price,
            quantity: 1,
            addTime: firestore.Timestamp.fromDate(new Date()),
          })
          .then(() => {
            setSelectSize();
            setIsSelected();
            setTimeout(() => {
              alert('Product added to cart');
            }, 200);
          })
          .catch(err => {
            console.log(err.code);
          })
          .finally(() => {
            setLoading(false);
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
          })
          .finally(() => {
            setLoading(false);
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

  useEffect(() => {
    const subscriber = firestore()
      .collection(`review`)
      .where('idProduct', '==', `${detailsData?.key}`)
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
      <FocusAwareStatusBar backgroundColor="#fff" barStyle="dark-content" />
      {/* Carousel */}
      <View style={styles.container}>
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
        <View style={styles.flexSpace}>
          <Text style={styles.textCategory}>{detailsData.subCategory}</Text>
          {review?.length > 0 ? (
            <Text style={styles.textRating}>
              {Math.floor(averageRating) +
                (Math.round(averageRating - Math.floor(averageRating))
                  ? 0.5
                  : 0.0)}{' '}
              ⭐️ ({review.length})
            </Text>
          ) : (
            <Text style={styles.textRating}>0 ⭐️ ({review.length})</Text>
          )}
        </View>

        <Text style={styles.textName}>{detailsData.name}</Text>
        <Text style={styles.textPrice}>${detailsData.price}</Text>
        <Text style={styles.textDesc}>{detailsData.description}</Text>
        {/* Sizes */}
        {detailsData.subCategory === 'Equipment' ? null : (
          <Text style={styles.textSize}>Select your size</Text>
        )}
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
        <View style={styles.flexSpace}>
          <Text style={styles.textReviews}>Reviews ({review?.length})</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ReviewsScreen', {
                item: detailsData,
              });
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
            detailsData.subCategory === 'Equipment'
              ? handleAddAccess()
              : handleAddToCart();
          }}>
          {loading === true ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Text style={styles.textAdd}>Add To Cart</Text>
          )}
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
  view3Dot: {
    position: 'absolute',
    bottom: 0,
    transform: [{translateY: -20}],
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexDot: {
    flexDirection: 'row',
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
  flexSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textCategory: {
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    color: colors.primaryColor,
  },
  textRating: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
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
