import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React from 'react';
import colors from '../../../constants/colors';

const SubCategory = props => {
  const {data, page, setPage} = props;
  // const renderItem = ({item}) => {
  //   return (
  //     <TouchableOpacity
  //       style={[
  //         styles.btn_Product,
  //         {
  //           borderBottomWidth: page === item.subCategory ? 2 : 0,
  //         },
  //       ]}
  //       onPress={() => {
  //         setPage(item.subCategory);
  //       }}>
  //       <Text style={styles.text_subCategory}>{item.subCategory}</Text>
  //     </TouchableOpacity>
  //   );
  // };
  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
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
        {data.map(item => {
          return (
            <View
              key={item.key}
              style={{
                flex: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.btn_Product,
                  {
                    borderBottomWidth: page === item.subCategory ? 2 : 0,
                  },
                ]}
                onPress={() => {
                  setPage(item.subCategory);
                }}>
                <Text style={styles.text_subCategory}>{item.subCategory}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      {/* <FlatList
        data={data}
        // horizontal
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      /> */}
    </ScrollView>
    // <TouchableOpacity
    //   disabled={page === title ? true : false}
    //   style={[
    //     styles.btn_Product,
    //     {
    //       borderBottomWidth: page === title ? 2 : 0,
    //     },
    //   ]}
    //   onPress={() => {
    //     setPage(title);
    //   }}>
    //   <Text style={styles.text_subCategory}>{title}</Text>
    // </TouchableOpacity>
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
});
