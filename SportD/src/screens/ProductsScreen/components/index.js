import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../../constants/colors';
import firestore from '@react-native-firebase/firestore';

const SubCategory = props => {
  const {page, setPage, title} = props;

  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('categories')
      .where('catName', '==', `${title}`)
      .onSnapshot(querySnapshot => {
        const dataSub = [];
        querySnapshot.forEach(documentSnapshot => {
          dataSub.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setSubCategories(dataSub);
      });

    return () => subscriber();
  }, []);

  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View style={styles.flexRow}>
        <TouchableOpacity
          style={[
            styles.btn_Product,
            {
              borderBottomWidth: page === 'All' ? 2 : 0,
            },
          ]}
          onPress={() => {
            setPage('All');
          }}>
          <Text style={styles.text_subCategory}>All</Text>
        </TouchableOpacity>
        {subCategories.map(item => {
          return (
            <View
              key={item.key}
              style={{
                flex: 0.5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {item.subCat.map(name => {
                return (
                  <TouchableOpacity
                    key={name}
                    // key={item}
                    style={[
                      styles.btn_Product,

                      {
                        // borderBottomWidth: page === item.subCategory ? 2 : 0,
                        borderBottomWidth: page === name ? 2 : 0,
                      },
                    ]}
                    onPress={() => {
                      // setPage(item.subCategory);
                      setPage(name);
                    }}>
                    <Text style={styles.text_subCategory}>{name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default SubCategory;

const styles = StyleSheet.create({
  btn_Product: {
    padding: 10,
    borderBottomColor: colors.primaryColor,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  text_subCategory: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.primaryColor,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
