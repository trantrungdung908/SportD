import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React from 'react';

const FilterScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Text>SearchScreen</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Text>close</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({});
