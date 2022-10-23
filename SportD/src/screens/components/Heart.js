import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Heart = props => {
  const {onPress, isLike, userId} = props;
  if (isLike && isLike.length > 0) {
    const exist = isLike.find(item => item.userId === userId);
    if (exist) {
      return (
        <TouchableOpacity
          onPress={onPress}
          style={{
            backgroundColor: '#fff',
            position: 'absolute',
            borderRadius: 20,
            zIndex: 1,
            right: 10,
            top: 10,
            padding: 10,
          }}>
          <Ionicons
            style={{fontSize: 20, color: '#000'}}
            // name={isLike === true ? 'heart' : 'heart-outline'}
            name={'heart'}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={onPress}
          style={{
            backgroundColor: '#fff',
            position: 'absolute',
            borderRadius: 20,
            zIndex: 1,
            right: 10,
            top: 10,
            padding: 10,
          }}>
          <Ionicons
            style={{fontSize: 20, color: '#000'}}
            // name={isLike === true ? 'heart' : 'heart-outline'}
            name={'heart-outline'}
          />
        </TouchableOpacity>
      );
    }
  } else {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: '#fff',
          position: 'absolute',
          borderRadius: 20,
          zIndex: 1,
          right: 10,
          top: 10,
          padding: 10,
        }}>
        <Ionicons
          style={{fontSize: 20, color: '#000'}}
          // name={isLike === true ? 'heart' : 'heart-outline'}
          name={'heart-outline'}
        />
      </TouchableOpacity>
    );
  }

  // return (
  //   <TouchableOpacity
  //     onPress={onPress}
  //     style={{
  //       backgroundColor: '#fff',
  //       position: 'absolute',
  //       borderRadius: 20,
  //       zIndex: 1,
  //       right: 10,
  //       top: 10,
  //       padding: 10,
  //     }}>
  //     <Ionicons
  //       style={{fontSize: 20, color: '#000'}}
  //       // name={isLike === true ? 'heart' : 'heart-outline'}
  //       name={'heart-outline'}
  //     />
  //   </TouchableOpacity>
  // );
};

export default Heart;

const styles = StyleSheet.create({});
