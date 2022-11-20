import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  VirtualizedList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import Heart from '../components/Heart';
import colors from '../../constants/colors';
import SubCategory from './components';
import SubScreen from './components/SubScreen';
import Loading from '../components/Loading';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';

const Products = () => {
  const userId = useSelector(state => state.login.currentUser.uid);
  const navigation = useNavigation();
  const route = useRoute();
  const {params} = route;
  const [dataProducts, setDataProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('All');
  useEffect(() => {
    const subscriber = firestore()
      .collection('products')
      .where('category', '==', `${params.item?.catName}`)
      // .where('subCategory', '==', `Football Shoes`)
      .onSnapshot(querySnapshot => {
        const dataCategory = [];
        querySnapshot.forEach(documentSnapshot => {
          dataCategory.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setDataProducts(dataCategory);
        setLoading(false);
      });
    // .catch(error => {
    //   console.log('error.code', error.code);
    // });
    // }, []);
    // const subscriber = firestore()
    //   .collection('products')
    //   .where('category', '==', `${params.item?.catName}`)
    //   .onSnapshot(querySnapshot => {
    //     const dataCategory = [];
    //     querySnapshot.forEach(documentSnapshot => {
    //       dataCategory.push({
    //         ...documentSnapshot.data(),
    //         key: documentSnapshot.id,
    //       });
    //     });
    //     setDataProducts(dataCategory);
    //     setLoading(false);
    //   });

    return () => subscriber();
  }, []);
  // const getItem = (data, index) => ({
  //   id: Math.random().toString(10).substring(0),
  //   title: `Item ${index + 1}`,
  // });

  // const getItemCount = data => 50;
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
                  firestore()
                    .collection(`products`)
                    .doc(`${item.key}`)
                    .set(
                      {
                        favorite: firestore.FieldValue.arrayUnion(...[userId]),
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
  return loading === false && dataProducts.length > 0 ? (
    <View style={styles.container}>
      <FocusAwareStatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View>
        <SubCategory
          // data={dataProducts}
          page={page}
          setPage={setPage}
          title={params.item?.catName}
        />
      </View>

      {page === 'All' ? (
        <FlatList
          data={[...dataProducts].sort(
            (a, b) => b.addOn.seconds - a.addOn.seconds,
          )}
          initialNumToRender={4}
          renderItem={renderItem}
          numColumns={2}
          // getItem={getItem}
          // getItemCount={getItemCount}
        />
      ) : (
        <SubScreen data={dataProducts} page={page} />
      )}
    </View>
  ) : (
    <Loading />
  );
};

export default Products;

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
