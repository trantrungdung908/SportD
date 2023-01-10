import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState, memo} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import Heart from '../../../components/Heart';
import colors from '../../../../constants/colors';
const SubScreen = props => {
  const navigation = useNavigation();
  const {data, page} = props;
  const userId = useSelector(state => state.login.currentUser.uid);
  const newData = data.filter(item => item.subCategory === page);

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={item.name}
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
              if (item.favorite === undefined || item.favorite.length < 0) {
                await firestore()
                  .collection(`products`)
                  .doc(`${item.key}`)
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
                  .catch(err => {});
              } else {
                const exist = item.favorite.find(x => x.userId === userId);
                if (exist) {
                  firestore()
                    .collection(`products`)
                    .doc(`${item.key}`)
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
                    .catch(err => {});
                } else {
                  firestore()
                    .collection(`products`)
                    .doc(`${item.key}`)
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
                    .catch(err => {});
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

export default memo(SubScreen);

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
