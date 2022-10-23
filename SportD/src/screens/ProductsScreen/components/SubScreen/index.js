import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import Heart from '../../../components/Heart';
import colors from '../../../../constants/colors';
const SubScreen = props => {
  const navigation = useNavigation();
  const {data, page} = props;
  const userId = useSelector(state => state.login.currentUser.uid);
  // const [newData, setNewData] = useState(data);
  const newData = data.filter(item => item.subCategory === page);
  // useEffect(() => {
  //   setNewData(data.filter(item => item.subCategory === page));
  // }, []);

  //  newData = data.filter(item => item.subCategory === page);
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DetailsScreen', {
            item: item,
            titleHeader: item.name,
            imgProducts: item.imgProducts,
          });
        }}
        style={[
          styles.btn_Product,
          {
            marginRight: index % 2 === 0 ? 2.5 : 0,
            marginLeft: index % 2 !== 0 ? 2.5 : 0,
          },
        ]}>
        <View>
          <Heart
            onPress={async () => {
              // setIsSelected(!isSelected);
              // let newProducts = dataProducts.map(eachProduct => {
              //   if (item.name === eachProduct.name) {
              //     return {
              //       ...eachProduct,
              //       isSelected:
              //         eachProduct.isSelected === false ||
              //         eachProduct.isSelected === undefined
              //           ? true
              //           : false,
              //     };
              //   }
              //   return eachProduct;
              // });
              // setDataProducts(newProducts);

              if (item.favorite === undefined || item.favorite.length < 0) {
                await firestore()
                  .collection(`products`)
                  .doc(`${item.key}`)
                  .set(
                    {
                      favorite: firestore.FieldValue.arrayUnion(
                        ...[{isLike: true, userId: userId}],
                        // ...[userId],
                      ),
                    },
                    {merge: true},
                  )
                  .then(() => {
                    alert('Product added to wishlist');
                    // setIsLike(true);

                    // setIsSelected(!isSelected);
                  })
                  .catch(err => {
                    console.log(err.code);
                  });
              } else {
                const exist = item.favorite.find(x => x.userId === userId);
                if (exist) {
                  firestore()
                    .collection(`products`)
                    .doc(`${item.key}`)
                    .set(
                      {
                        // favorite: firestore.FieldValue.arrayRemove(
                        //   ...[{isLike: true, userId: userId}],
                        // ),
                        favorite: firestore.FieldValue.arrayRemove(
                          ...[{isLike: true, userId: userId}],
                        ),
                      },
                      {merge: true},
                    )
                    .then(() => {
                      alert('Product removed from wishlist');
                      // setIsLike(false);
                    })
                    .catch(err => {
                      console.log(err.code);
                    });
                } else {
                  console.log('vc');
                  firestore()
                    .collection(`products`)
                    .doc(`${item.key}`)
                    .set(
                      {
                        // favorite: [...userId],
                        // favorite: firestore.FieldValue.arrayUnion(...[userId]),
                        favorite: firestore.FieldValue.arrayUnion(
                          ...[{isLike: true, userId: userId}],
                        ),
                      },
                      {merge: true},
                    )
                    .then(() => {
                      alert('Product added to wishlist');
                      // setIsSelected(!isSelected);
                      // setIsLike(true);
                    })
                    .catch(err => {
                      console.log(err.code);
                    });
                }
              }
            }}
            isLike={item?.favorite}
            userId={userId}
          />
          <Image
            source={{uri: item.imgProducts[0]}}
            style={styles.img_Product}
          />
        </View>
        <View style={styles.view_infoProduct}>
          <Text style={styles.text_infoProduct}>{item.name}</Text>
          <Text style={styles.text_infoCategory}>{item.subCategory}</Text>
          <Text style={styles.text_infoProduct}>${item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return <FlatList data={newData} renderItem={renderItem} numColumns={2} />;
};

export default SubScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  view_infoProduct: {
    padding: 10,
  },
  text_infoProduct: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: colors.primaryColor,
  },
  text_infoCategory: {
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    color: colors.grayColor,
    marginVertical: 2.5,
  },
  btn_Product: {
    flex: 0.5,
    marginBottom: 5,
    height: 300,
  },
  img_Product: {
    height: 200,
    width: '100%',
  },
});
