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
import React, {useEffect, useState, memo} from 'react';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import Loading from '../components/Loading';
import colors from '../../constants/colors';
import firestore from '@react-native-firebase/firestore';
import ListItem from './components';
import ToastService from '../../services/ToastService';
import {useSelector} from 'react-redux';

const windowWeight = Dimensions.get('window').width;
const HomeScreen = props => {
  const navigation = useNavigation();
  const user = useSelector(state => state.login.currentUser);
  // const route = useRoute();
  const [categories, setCategories] = useState([]);
  const [dataProducts, setDataProducts] = useState([]);
  const [dataNews, setDataNews] = useState([]);
  const [loading, setLoading] = useState(true);

  function limit(c) {
    return this.filter((x, i) => {
      if (i <= c - 1) {
        return true;
      }
    });
  }

  Array.prototype.limit = limit;
  //

  // useEffect(() => {
  //   ToastService.show('Đăng nhập thành công');
  // }, []);

  useEffect(() => {
    const subscriber = firestore()
      .collection('categories')
      .onSnapshot(querySnapshot => {
        const categories = [];
        querySnapshot.forEach(documentSnapshot => {
          categories.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setCategories(
          categories.sort((a, b) => a.catName.localeCompare(b.catName)),
        );
        setLoading(false);
      });
    return () => subscriber();
  }, []);

  useEffect(() => {
    const subscriber = firestore()
      .collection('products')
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
    const subscriber = firestore()
      .collection('news')
      .onSnapshot(querySnapshot => {
        const newsArray = [];
        querySnapshot.forEach(documentSnapshot => {
          newsArray.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setDataNews(newsArray);
        setLoading(false);
      });
    return () => subscriber();
  }, []);

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

          <ListItem
            data={[...dataProducts].sort(() => Math.random() - 0.5).limit(10)}
            title={'Featured Product'}
          />
          {/* <ListItem data={shirtData} title={'Featured Product'} /> */}
          <View style={styles.view_Intro}>
            <Text
              style={{
                marginLeft: 10,
                fontFamily: 'Poppins-Regular',
                fontSize: 20,
                marginBottom: 10,
                color: colors.primaryColor,
              }}>
              What's News
            </Text>
            {dataNews.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewsScreen', {
                      item: item,
                    });
                  }}
                  key={item.newsId}
                  style={{
                    marginHorizontal: 10,
                  }}>
                  <Image
                    style={styles.img_Intro}
                    source={{
                      uri: item.imageNews,
                    }}
                  />
                  <Text style={styles.text_Intro}>{item.title}</Text>

                  <Text style={styles.text_Read}>Read more</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <Loading />
      )}
    </SafeAreaView>
  );
};

export default memo(HomeScreen);

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
    marginHorizontal: 10,
    marginTop: 10,
  },
  img_Intro: {
    borderRadius: 8,
    overflow: 'hidden',
    width: windowWeight - 40,
    height: 450,
    marginBottom: 10,
  },
  text_Intro: {
    position: 'absolute',
    bottom: 80,
    left: 10,
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: '#fff',
  },
  text_Read: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    backgroundColor: '#fff',
    // padding: 10,
    borderRadius: 15,
    // padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    overflow: 'hidden',
    color: '#000',
  },
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
