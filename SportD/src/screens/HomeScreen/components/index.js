import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../constants/colors';

const ListItem = props => {
  const {data, title} = props;

  const navigation = useNavigation();
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={item.key}
        onPress={() => {
          navigation.navigate('DetailsScreen', {
            item: item,
            titleHeader: item.name,
            imgProducts: item.imgProducts,
          });
        }}
        style={{}}>
        <View
          style={{
            width: 300,
            height: 300,
            marginRight: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e8e8e8',
          }}>
          <View>
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
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{marginHorizontal: 20, marginTop: 10}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 20,
            color: colors.primaryColor,
          }}>
          {title}
        </Text>
        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate('Products', {});
          }}>
          <Text>See more</Text>
        </TouchableOpacity> */}
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={data}
        horizontal
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  img_Product: {
    width: '100%',
    height: 200,
    borderRadius: 10,
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
});
