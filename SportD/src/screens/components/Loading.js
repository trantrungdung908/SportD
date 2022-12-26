import {StyleSheet, ActivityIndicator, SafeAreaView} from 'react-native';
import React from 'react';

const Loading = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </SafeAreaView>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
