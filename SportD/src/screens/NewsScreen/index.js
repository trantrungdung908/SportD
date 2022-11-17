import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import colors from '../../constants/colors';
const windowWeight = Dimensions.get('window').width;
const NewsScreen = () => {
  const route = useRoute();
  const {params} = route;
  const newsItem = params.item;
  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.viewHeader}>
          <Text style={styles.headerTitle}>{newsItem.title}</Text>
        </View>
        <Image
          source={{uri: newsItem.imageNews}}
          style={{
            width: windowWeight,
            height: 500,
            marginBottom: 10,
          }}
        />
        <View style={{marginHorizontal: 20, marginBottom: 20}}>
          <Text style={styles.textDes}>{newsItem.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewHeader: {marginVertical: 10, marginHorizontal: 10},
  headerTitle: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: 26,
    color: colors.primaryColor,
  },
  textDes: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 26,
    color: colors.primaryColor,
  },
});
