import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {memo} from 'react';
import Heart from '../../components/Heart';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute, StackActions} from '@react-navigation/native';
import colors from '../../../constants/colors';
const ListSearchProducts = props => {
  const userId = useSelector(state => state.login.currentUser.uid);
  const {imgProducts, subCategory, name, price, favorite, key} = props.list;
  const {index} = props;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DetailsScreen', {
          item: props.list,
          titleHeader: name,
          imgProducts: imgProducts,
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
            if (favorite === undefined || favorite.length < 0) {
              await firestore()
                .collection(`products`)
                .doc(`${key}`)
                .set(
                  {
                    favorite: firestore.FieldValue.arrayUnion(
                      ...[{isLike: true, userId: userId}],
                    ),
                  },
                  {merge: true},
                )
                .then(() => {
                  alert('Product added to wishlist');
                })
                .catch(err => {
                  console.log(err.code);
                });
            } else {
              const exist = favorite.find(x => x.userId === userId);
              if (exist) {
                firestore()
                  .collection(`products`)
                  .doc(`${key}`)
                  .set(
                    {
                      favorite: firestore.FieldValue.arrayRemove(
                        ...[{isLike: true, userId: userId}],
                      ),
                    },
                    {merge: true},
                  )
                  .then(() => {
                    alert('Product removed from wishlist');
                  })
                  .catch(err => {
                    console.log(err.code);
                  });
              } else {
                console.log('vc');
                firestore()
                  .collection(`products`)
                  .doc(`${key}`)
                  .set(
                    {
                      favorite: firestore.FieldValue.arrayUnion(
                        ...[{isLike: true, userId: userId}],
                      ),
                    },
                    {merge: true},
                  )
                  .then(() => {
                    alert('Product added to wishlist');
                  })
                  .catch(err => {
                    console.log(err.code);
                  });
              }
            }
          }}
          isLike={favorite}
          userId={userId}
        />
        <Image source={{uri: imgProducts[0]}} style={styles.img_Product} />
      </View>
      <View style={styles.view_infoProduct}>
        <Text style={styles.text_infoProduct}>{name}</Text>
        <Text style={styles.text_infoCategory}>{subCategory}</Text>
        <Text style={styles.text_infoProduct}>${price}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ListSearchProducts);

const styles = StyleSheet.create({
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
