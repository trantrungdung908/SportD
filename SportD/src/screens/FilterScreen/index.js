import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  TextInput,
  FlatList,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useEffect, useState, useMemo, memo} from 'react';
import colors from '../../constants/colors';
import images from '../../constants/images';
import firestore from '@react-native-firebase/firestore';
import ListSearchProducts from './components/ListSearchProducts';

const FilterScreen = ({navigation}) => {
  const [dataProducts, setDataProducts] = useState([]);
  const [searchText, setSearchText] = useState('');

  const filterProduct = useMemo(() => {
    return dataProducts.filter(
      lists =>
        lists.name.toLowerCase().includes(searchText.toLowerCase()) ||
        lists.subCategory.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText]);
  const renderItem = ({item, index}) => {
    return <ListSearchProducts list={item} index={index} />;
  };
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
      });
    return () => subscriber();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <>
        <View style={styles.wrapSearch}>
          <View style={styles.view_Search}>
            <Ionicons name="search-outline" style={styles.icon_Search} />
            {Platform.OS === 'ios' ? (
              <TextInput
                autoCapitalize="none"
                onChangeText={text => {
                  setSearchText(text);
                }}
                value={searchText}
                autoCorrect={false}
                autoFocus={true}
                placeholder="Search Product"
                placeholderTextColor={'#C9C9C9'}
                selectionColor={Platform.OS === 'ios' ? '#000' : '#fff'}
                style={styles.input_Search}
              />
            ) : (
              <TextInput
                autoCapitalize="none"
                onChangeText={text => {
                  setSearchText(text);
                }}
                value={searchText}
                autoCorrect={false}
                autoFocus={true}
                placeholder="Search Product"
                placeholderTextColor={'#C9C9C9'}
                cursorColor={Platform.OS === 'android' ? '#000' : '#fff'}
                style={styles.input_Search}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
              }}>
              <Ionicons name="close-outline" style={styles.icon_Search} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
            {filterProduct?.length > 0 && searchText?.length > 0 ? (
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginVertical: 10,
                    fontSize: 28,
                    fontFamily: 'Poppins-Regular',
                    color: colors.primaryColor,
                  }}>
                  Found {filterProduct?.length} results
                </Text>
                <FlatList
                  data={filterProduct}
                  numColumns={2}
                  renderItem={renderItem}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            ) : searchText?.length > 0 ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Image
                  source={images.searchNotFound}
                  style={{width: 150, height: 150, marginVertical: 20}}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: colors.primaryColor,
                    fontFamily: 'Poppins-Bold',
                    marginVertical: 10,
                  }}>
                  Product Not Found
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '300',
                    fontFamily: 'Poppins-Light',
                    color: colors.primaryColor,
                    textAlign: 'center',
                    width: 300,
                    lineHeight: 26,
                  }}>
                  Try a more generic search term or try looking for alternative
                  products.
                </Text>
              </View>
            ) : (
              <View></View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </>
    </SafeAreaView>
  );
};

export default memo(FilterScreen);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  view_Search: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapSearch: {
    borderColor: '#C9C9C9',
    borderBottomWidth: 1,
  },
  icon_Search: {
    fontSize: 22,
    color: '#000',
    padding: 10,
  },
  input_Search: {
    // width: 250,
    // borderWidth: 1,
    // borderRadius: 10,
    // paddingEnd: 45,
    // borderColor: '#C9C9C9',
    flex: 1,
    marginTop: 5,
    padding: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    color: '#292444',
  },
  textCancel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.primaryColor,
  },
});
