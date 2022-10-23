import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  LogBox,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LoginScreen from '../screens/LoginScreen';
import SignUp from '../screens/SignUpScreen';
import ForgetScreen from '../screens/ForgetScreen';
import MainStack from './MainStack';
import {NavigationContainer} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
const Stack = createNativeStackNavigator();
const RootStack = props => {
  const user = useSelector(state => state.login);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: 'Poppins-Bold',
            fontSize: Platform.OS === 'ios' ? 18 : 16,
          },
        }}>
        {user.currentUser === null ? (
          <>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SignUpScreen"
              component={SignUp}
              options={({navigation}) => ({
                headerTransparent: true,
                title: '',
                headerLeft: () => {
                  return (
                    <View>
                      <FontAwesome.Button
                        style={{marginLeft: -5}}
                        underlayColor="transparent"
                        name="long-arrow-left"
                        size={Platform.OS === 'ios' ? 25 : 22}
                        color="#fff"
                        backgroundColor={'transparent'}
                        onPress={() => {
                          navigation.goBack();
                        }}
                      />
                    </View>
                  );
                },
              })}
            />
            <Stack.Screen
              name="ForgetScreen"
              component={ForgetScreen}
              options={({navigation}) => ({
                title: 'Forgot Password',
                headerBackTitleVisible: false,
                headerTintColor: '#000',
                headerLeft: () => {
                  return (
                    <View>
                      <FontAwesome.Button
                        style={{marginLeft: -5}}
                        underlayColor="transparent"
                        name="long-arrow-left"
                        size={Platform.OS === 'ios' ? 25 : 22}
                        color="#333"
                        backgroundColor={'transparent'}
                        onPress={() => {
                          navigation.goBack();
                        }}
                      />
                    </View>
                  );
                },
              })}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="MainStack"
              component={MainStack}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
