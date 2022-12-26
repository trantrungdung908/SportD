import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  SafeAreaView,
} from 'react-native';
import React, {useCallback, useEffect, useState, memo} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';
import images from '../../constants/images';
import firestore from '@react-native-firebase/firestore';
import Heart from '../components/Heart';
import {useSelector} from 'react-redux';

const WishListScreen = () => {
  const navigation = useNavigation();
  const userId = useSelector(state => state.login.currentUser.uid);
  const [dataFavorite, setDataFavorite] = useState([]);
  const [isHidden, setIsHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        disabled={isHidden === true ? false : true}
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
            marginRight: 2.5,
            marginLeft: 2.5,
          },
        ]}>
        <View>
          {isHidden === true ? null : (
            <Heart
              onPress={async () => {
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
                      setIsLoading(false);
                    })
                    .catch(err => {
                      console.log(err.code);
                    });
                }
              }}
              isLike={item?.favorite}
              userId={userId}
            />
          )}
          <Image
            source={{
              uri: item?.imgProducts[0],
            }}
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

  const handleEdit = useCallback(() => {
    navigation.addListener('focus', () => {
      setIsHidden(true);
    });
    setIsHidden(!isHidden);
  }, [isHidden, navigation]);
  useEffect(() => {
    const subscriber = firestore()
      .collection('products')
      // .where('favorite', 'array-contains', userId)
      .where('favorite', 'array-contains', {isLike: true, userId: userId})
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
          data.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setDataFavorite(data);
      });
    return () => subscriber();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {dataFavorite.length > 0 && dataFavorite ? (
        <View style={styles.container}>
          <View style={styles.view_Header}>
            <View style={styles.view_Text}>
              <Text style={styles.text_Favorite}>Favourites</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                handleEdit();
              }}
              style={styles.btn_Edit}>
              {isHidden === true ? (
                <Text style={styles.text_Edit}>Edit</Text>
              ) : (
                <Text style={styles.text_Done}>Done</Text>
              )}
            </TouchableOpacity>
          </View>
          <FlatList
            data={dataFavorite}
            renderItem={renderItem}
            numColumns={2}
          />
        </View>
      ) : (
        <View style={styles.view_NotData}>
          <Image source={images.empty} style={styles.img_NotData} />
          <Text style={styles.text_NotList}>Your wishlist is empty</Text>
          <Text style={styles.text_NotItem}>
            Items added to your wishlist will be saved here
          </Text>
          <TouchableOpacity
            style={styles.btn_Shopping}
            onPress={() => {
              navigation.navigate('HomeScreen');
            }}>
            <Text style={styles.text_Shopping}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default memo(WishListScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  view_NotData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  img_NotData: {width: 100, height: 100},
  text_NotList: {
    fontSize: 26,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
  },
  text_NotItem: {
    width: 220,
    textAlign: 'center',
    fontSize: 14,
    color: colors.grayColor,
    fontFamily: 'Poppins-Regular',
  },
  btn_Shopping: {
    marginTop: 20,
    backgroundColor: '#5956E9',
    width: 200,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_Shopping: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },

  //data
  view_infoProduct: {
    padding: 10,
  },
  view_Header: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view_Text: {
    flex: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_Favorite: {
    fontSize: Platform.OS === 'ios' ? 16 : 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginLeft: 100,
    fontWeight: 'bold',
    color: colors.primaryColor,
  },
  text_Edit: {
    color: '#000',
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    fontFamily: 'Poppins-Regular',
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
  text_Done: {
    color: '#000',
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    fontFamily: 'Poppins-Bold',
  },
  btn_Product: {
    flex: 0.5,
    marginBottom: 5,
    height: 300,
  },
  btn_Edit: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img_Product: {
    height: 200,
    width: '100%',
  },
});
