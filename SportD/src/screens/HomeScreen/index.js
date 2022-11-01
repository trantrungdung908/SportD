import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import Loading from '../components/Loading';
import colors from '../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import ListItem from './components';

const windowWeight = Dimensions.get('window').width;
const HomeScreen = props => {
  const dataIntro = [
    {
      id: 1,
      name: "Let's see socks",
      img: 'https://images.unsplash.com/photo-1616531758364-731625b1f273?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTd8fHNvY2t8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60',
    },
    {
      id: 2,
      name: 'XYZ',
      img: 'https://images.unsplash.com/photo-1616531758364-731625b1f273?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTd8fHNvY2t8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60',
    },
  ];

  const userId = useSelector(state => state.login.currentUser.uid);
  const navigation = useNavigation();
  const route = useRoute();
  const {params} = route;
  const [categories, setCategories] = useState([]);
  const [dataProducts, setDataProducts] = useState([]);
  const [shoesData, setShoesData] = useState([]);
  const [shirtData, setShirtData] = useState([]);
  // console.log('SHOES', shoesData);
  const [loading, setLoading] = useState(true);
  //
  // useEffect(() => {
  //   firestore()
  //     .collection('products')
  //     .get()
  //     .then(querySnapshot => {
  //       const dataAll = [];
  //       querySnapshot.forEach(documentSnapshot => {
  //         dataAll.push({...documentSnapshot.data(), key: documentSnapshot.id});
  //       });
  //       setDataApp(dataAll);
  //       setLoading(false);
  //     })
  //     .catch(error => {
  //       console.log(error.code);
  //     });

  //   // const subscriber = firestore()
  //   //   .collection('products')
  //   //   .onSnapshot(querySnapshot => {
  //   //     const dataAll = [];
  //   //     querySnapshot.forEach(documentSnapshot => {
  //   //       dataAll.push({...documentSnapshot.data(), key: documentSnapshot.id});
  //   //     });
  //   //     setDataApp(dataAll);
  //   //     setLoading(false);
  //   //   });
  //   // return () => subscriber();
  // }, []);

  useEffect(() => {
    let isMounted = true;
    firestore()
      .collection('categories')
      .get()
      .then(querySnapshot => {
        const categories = [];
        querySnapshot.forEach(documentSnapshot => {
          categories.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        if (isMounted) {
          setCategories(categories);
          setLoading(false);
        }
      })
      .catch(error => {
        console.log('abc');
        console.log(error.code);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // firestore()
    //   .collection('products')
    //   // .where('category', '==')
    //   .get()
    //   .then(querySnapshot => {
    //     const dataCategory = [];
    //     querySnapshot.forEach(documentSnapshot => {
    //       dataCategory.push({
    //         ...documentSnapshot.data(),
    //         key: documentSnapshot.id,
    //       });
    //     });
    //     setDataProducts(dataCategory);
    //     setLoading(false);
    //   })
    //   .catch(error => {
    //     console.log('error.code', error.code);
    //   });
    // }, []);
    const subscriber = firestore()
      .collection('products')
      .limit(20)
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
    return () => subscriber();
  }, []);
  useEffect(() => {
    setShoesData(dataProducts.filter(item => item.category === 'Shoes'));
    setShirtData(dataProducts.filter(item => item.category === 'T-Shirts'));
  }, [dataProducts]);

  // Flatlist horizontal
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Products', {
            item: item,
          });
        }}
        style={styles.btn_List}>
        <Image source={{uri: item.thumbnail}} style={styles.img_Equip} />
        <Text style={styles.text_Equip}>{item.catName}</Text>
      </TouchableOpacity>
    );
  };

  // const renderData = ({item, index}) => {
  //   return (
  //     <TouchableOpacity
  //       onPress={() => {
  //         navigation.navigate('DetailsScreen', {
  //           item: item,
  //           titleHeader: item.name,
  //           imgProducts: item.imgProducts,
  //         });
  //       }}
  //       style={[
  //         styles.btn_Product,
  //         {
  //           marginRight: index % 2 === 0 ? 2.5 : 0,
  //           marginLeft: index % 2 !== 0 ? 2.5 : 0,
  //         },
  //       ]}>
  //       <View>
  //         <Image
  //           source={{uri: item.imgProducts[0]}}
  //           style={styles.img_Product}
  //         />
  //       </View>
  //       <View style={styles.view_infoProduct}>
  //         <Text style={styles.text_infoProduct}>{item.name}</Text>
  //         <Text style={styles.text_infoCategory}>{item.subCategory}</Text>
  //         <Text style={styles.text_infoProduct}>${item.price}</Text>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };
  return (
    <SafeAreaView style={styles.container}>
      {/* Status bar */}
      <FocusAwareStatusBar backgroundColor="#FFF" barStyle="dark-content" />
      {loading === false && categories.length > 0 ? (
        <ScrollView style={styles.container}>
          {/* Search */}
          <View style={styles.view_Line}>
            <View style={styles.view_Search}>
              <Ionicons name="search-outline" style={styles.icon_Search} />
              {Platform.OS === 'ios' ? (
                <TextInput
                  placeholder="Search"
                  placeholderTextColor={'#C9C9C9'}
                  selectionColor={Platform.OS === 'ios' ? '#000' : '#fff'}
                  style={styles.input_Search}
                />
              ) : (
                <TextInput
                  placeholder="Search"
                  placeholderTextColor={'#C9C9C9'}
                  cursorColor={Platform.OS === 'android' ? '#000' : '#fff'}
                  style={styles.input_Search}
                />
              )}
            </View>
            <View style={styles.view_Header}>
              <Text style={styles.text_Header}>Find your best equipment</Text>
            </View>
            {/* List categories */}
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 5,
              }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={categories}
                horizontal
                renderItem={renderItem}
                keyExtractor={item => item.categoryId}
              />
            </View>
          </View>

          {/* Intro */}
          {/* <View style={styles.view_Intro}>
            {dataIntro.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    // navigation.navigate('Products');
                  }}
                  key={item.id}
                  style={{
                    marginHorizontal: 10,
                  }}>
                  <Image
                    style={styles.img_Intro}
                    source={{
                      uri: item.img,
                    }}
                  />
                  <Text style={styles.text_Intro}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View> */}
          <ListItem data={shoesData} title={'Featured Product'} />
          <ListItem data={shirtData} title={'Featured Product'} />
        </ScrollView>
      ) : (
        <Loading />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  view_Line: {
    flex: 1,
    borderBottomColor: '#E6E5E5',
    borderBottomWidth: 1,
  },
  view_Search: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon_Search: {
    fontSize: 22,
    color: '#000',
    position: 'absolute',
    right: 85,
    top: 15,
  },
  input_Search: {
    width: 250,
    height: 45,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingEnd: 45,
    borderColor: '#C9C9C9',
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    color: '#292444',
  },
  view_Header: {marginTop: 15, marginHorizontal: 20, width: windowWeight - 50},
  text_Header: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#292444',
    // color: '#4c4c96',
  },
  btn_List: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  view_Intro: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // alignItems: 'flex-start',
    // marginTop: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  // img_Intro: {
  //   borderRadius: 8,
  //   overflow: 'hidden',
  //   width: '100%',
  //   height: 350,
  //   marginBottom: 10,
  // },
  // text_Intro: {
  //   position: 'absolute',
  //   bottom: 20,
  //   left: 10,
  //   fontFamily: 'Poppins-Bold',
  //   fontSize: 20,
  //   color: '#fff',
  // },
  img_Equip: {
    width: 55,
    height: 55,
    borderRadius: 100,
  },
  text_Equip: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#292444',
  },

  // flat list bottom

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
    // flex: 0.5,
    // width: '48%',
    // marginBottom: 5,
    // height: 300,
    // backgroundColor: 'red',
    // width: windowWeight,
  },
  img_Product: {
    height: 200,
    borderRadius: 8,
  },
});
