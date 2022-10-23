import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import Products from '../../screens/ProductsScreen';
import DetailsScreen from '../../screens/DetailsScreen';
import CartScreen from '../../screens/CartScreen';
import WishListScreen from '../../screens/WishListScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import EditProfileScreen from '../../screens/ProfileScreen/components';
import FilterScreen from '../../screens/FilterScreen';
import ReviewsScreen from '../../screens/ReviewsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../constants/colors';
import FocusAwareStatusBar from '../../screens/components/FocusAwareStatusBar';
import {useNavigation} from '@react-navigation/native';
import {TransitionPresets} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';

const Tab = createBottomTabNavigator();
// const TopTab = createMaterialTopTabNavigator();
const MainStack = () => {
  const [cartData, setCartData] = useState([]);
  const userId = useSelector(state => state.login.currentUser.uid);
  useEffect(() => {
    const subscriber = firestore()
      .collection(`cart-${userId}`)
      .onSnapshot(querySnapshot => {
        const itemCart = [];
        querySnapshot.forEach(documentSnapshot => {
          itemCart.push({
            ...documentSnapshot.data(),
          });
        });
        setCartData(itemCart);
      });
    return () => subscriber();
  }, []);
  return (
    <>
      <FocusAwareStatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={{
          headerShadowVisible: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopWidth: 0,
            height: Platform.OS === 'android' ? 60 : 80,
          },
        }}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStackScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View>
                <Ionicons
                  name="home"
                  style={[
                    styles.tabIconStyle,
                    [focused ? {color: colors.btnColor} : {color: '#000'}],
                  ]}
                />
                {focused ? (
                  <Text
                    style={[
                      styles.textStyle,
                      [focused ? {color: colors.btnColor} : {color: '#000'}],
                    ]}>
                    Home
                  </Text>
                ) : null}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="CartScreen"
          component={CartScreen}
          options={{
            title: 'My Cart',
            headerTitleAlign: 'center',
            tabBarBadge:
              cartData?.length > 0
                ? cartData.reduce((p, c) => p + c.quantity, 0)
                : null,
            tabBarBadgeStyle: {
              // color: colors.btnColor,
              // backgroundColor: 'transparent',
            },
            tabBarIcon: ({focused}) => (
              <View>
                <Ionicons
                  name="cart"
                  style={[
                    styles.tabIconStyle,
                    [focused ? {color: colors.btnColor} : {color: '#000'}],
                  ]}
                />
                {focused ? (
                  <Text
                    style={[
                      styles.textStyle,
                      [focused ? {color: colors.btnColor} : {color: '#000'}],
                    ]}>
                    Cart
                  </Text>
                ) : null}
              </View>
            ),
          }}
        />
        {/* <Tab.Screen
          name="WishListScreen"
          component={WishListScreen}
          options={{
            title: 'Favourites',
            headerTitleAlign: 'center',
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View>
                <Ionicons
                  name="heart"
                  style={[
                    styles.tabIconStyle,
                    [focused ? {color: colors.btnColor} : {color: '#000'}],
                  ]}
                />
                {focused ? (
                  <Text
                    style={[
                      styles.textStyle,
                      [focused ? {color: colors.btnColor} : {color: '#000'}],
                    ]}>
                    Favourites
                  </Text>
                ) : null}
              </View>
            ),
          }}
        /> */}
        <Tab.Screen
          name="WishListStackScreen"
          component={WishListStackScreen}
          options={{
            title: 'Favourites',
            headerTitleAlign: 'center',
            headerShown: false,
            // headerRight: () => {
            //   return (
            //     // <View>
            //     //   {/* <FontAwesome.Button
            //     //     underlayColor="#fff"
            //     //     // name="filter"
            //     //     style={{
            //     //       marginLeft: -5,
            //     //       justifyContent: 'center',
            //     //       alignItems: 'center',
            //     //     }}
            //     //     size={Platform.OS === 'ios' ? 22 : 20}
            //     //     color="#333"
            //     //     backgroundColor={'#fff'}
            //     //     onPress={() => {
            //     //       alert('heeh');
            //     //     }}
            //     //   /> */}
            //     //   <TouchableOpacity
            //     //     style={{
            //     //       marginLeft: -5,
            //     //       justifyContent: 'center',
            //     //       alignItems: 'center',
            //     //     }}>
            //     //     <Text>Edit</Text>
            //     //   </TouchableOpacity>
            //     // </View>
            //     <Edit
            //       onPress={() => {
            //         alert('hehe');
            //       }}
            //     />
            //   );
            // },
            tabBarIcon: ({focused}) => (
              <View>
                <Ionicons
                  name="heart"
                  style={[
                    styles.tabIconStyle,
                    [focused ? {color: colors.btnColor} : {color: '#000'}],
                  ]}
                />
                {focused ? (
                  <Text
                    style={[
                      styles.textStyle,
                      [focused ? {color: colors.btnColor} : {color: '#000'}],
                    ]}>
                    Favourites
                  </Text>
                ) : null}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStackScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View>
                <Ionicons
                  name="person"
                  style={[
                    styles.tabIconStyle,
                    [focused ? {color: colors.btnColor} : {color: '#000'}],
                  ]}
                />
                {focused ? (
                  <Text
                    style={[
                      styles.textStyle,
                      [focused ? {color: colors.btnColor} : {color: '#000'}],
                    ]}>
                    User
                  </Text>
                ) : null}
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default MainStack;

const ProfileStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const WishListStack = createNativeStackNavigator();

const ProfileStackScreen = ({navigation}) => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        headerBackTitleVisible: false,
        headerTintColor: '#000',
      }}>
      <ProfileStack.Screen
        options={{
          headerShown: false,
        }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
      <ProfileStack.Screen
        options={{
          title: 'Edit Profile',
          headerTitleAlign: 'center',
          headerLeft: () => {
            return (
              <View>
                <FontAwesome.Button
                  underlayColor="#fff"
                  name="long-arrow-left"
                  size={Platform.OS === 'ios' ? 25 : 22}
                  color="#333"
                  backgroundColor={'#fff'}
                  onPress={() => {
                    navigation.navigate('ProfileScreen');
                  }}
                />
              </View>
            );
          },
        }}
        name="EditProfileScreen"
        component={EditProfileScreen}
      />
    </ProfileStack.Navigator>
  );
};

const HomeStackScreen = ({navigation}) => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        // cardOverlayEnabled: true,
        // ...TransitionPresets.ModalPresentationIOS,
      }}>
      <HomeStack.Screen
        options={{
          headerShown: false,
        }}
        name="HomeScreen"
        component={HomeScreen}
      />
      <HomeStack.Screen
        options={{
          presentation: 'transparentModal',
          headerShown: false,
        }}
        name="FilterScreen"
        component={FilterScreen}
      />

      <HomeStack.Screen
        name="Products"
        component={Products}
        options={({route}) => ({
          title: route.params.item['catName'],
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTintColor: '#292444',
          headerLeft: () => {
            return (
              <View>
                <FontAwesome.Button
                  underlayColor="#fff"
                  name="long-arrow-left"
                  style={{
                    marginLeft: -5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  size={Platform.OS === 'ios' ? 25 : 22}
                  color="#333"
                  backgroundColor={'#fff'}
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              </View>
            );
          },
          headerRight: () => {
            return (
              <View>
                <FontAwesome.Button
                  underlayColor="#fff"
                  name="filter"
                  style={{
                    marginLeft: -5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  size={Platform.OS === 'ios' ? 22 : 20}
                  color="#333"
                  backgroundColor={'#fff'}
                  onPress={() => {
                    navigation.navigate('FilterScreen');
                  }}
                />
              </View>
            );
          },
        })}
      />
      <HomeStack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={({route}) => ({
          title: route.params.titleHeader,
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTintColor: '#292444',
          headerTitleStyle: {
            fontWeight: '300',
            fontSize: 14,
            fontFamily: 'Poppins-Light',
          },
          headerLeft: () => {
            return (
              <View>
                <FontAwesome.Button
                  name="long-arrow-left"
                  style={{marginLeft: -5}}
                  size={Platform.OS === 'ios' ? 25 : 22}
                  color="#333"
                  backgroundColor={'#fff'}
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              </View>
            );
          },
        })}
      />
      <HomeStack.Screen
        name="ReviewsScreen"
        component={ReviewsScreen}
        options={({route}) => ({
          title: 'Reviews',
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTintColor: '#292444',
          headerTitleStyle: {
            fontWeight: '300',
            fontSize: 16,
            fontFamily: 'Poppins-Light',
          },
          headerLeft: () => {
            return (
              <View>
                <FontAwesome.Button
                  name="long-arrow-left"
                  style={{marginLeft: -5}}
                  size={Platform.OS === 'ios' ? 25 : 22}
                  color="#333"
                  backgroundColor={'#fff'}
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              </View>
            );
          },
        })}
      />
    </HomeStack.Navigator>
  );
};

const WishListStackScreen = ({navigation}) => {
  return (
    <WishListStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        headerBackTitleVisible: false,
        headerTintColor: '#000',
      }}>
      <WishListStack.Screen
        name="WishListScreen"
        component={WishListScreen}
        options={{
          title: 'Favourites',
          headerTitleAlign: 'center',
          headerShown: false,
          // headerRight: () => {
          //   return (
          //     // <View>
          //     //   {/* <FontAwesome.Button
          //     //     underlayColor="#fff"
          //     //     // name="filter"
          //     //     style={{
          //     //       marginLeft: -5,
          //     //       justifyContent: 'center',
          //     //       alignItems: 'center',
          //     //     }}
          //     //     size={Platform.OS === 'ios' ? 22 : 20}
          //     //     color="#333"
          //     //     backgroundColor={'#fff'}
          //     //     onPress={() => {
          //     //       alert('heeh');
          //     //     }}
          //     //   /> */}
          //     //   <TouchableOpacity
          //     //     style={{
          //     //       marginLeft: -5,
          //     //       justifyContent: 'center',
          //     //       alignItems: 'center',
          //     //     }}>
          //     //     <Text>Edit</Text>
          //     //   </TouchableOpacity>
          //     // </View>
          //     <Edit
          //       onPress={() => {
          //         alert('hehe');
          //       }}
          //     />
          //   );
          // },
          tabBarIcon: ({focused}) => (
            <View>
              <Ionicons
                name="heart"
                style={[
                  styles.tabIconStyle,
                  [focused ? {color: colors.btnColor} : {color: '#000'}],
                ]}
              />
              {focused ? (
                <Text
                  style={[
                    styles.textStyle,
                    [focused ? {color: colors.btnColor} : {color: '#000'}],
                  ]}>
                  Favourites
                </Text>
              ) : null}
            </View>
          ),
        }}
      />

      <WishListStack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={({route}) => ({
          title: route.params.titleHeader,
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTintColor: '#292444',
          headerTitleStyle: {
            fontWeight: '300',
            fontSize: 14,
            fontFamily: 'Poppins-Light',
          },
          headerLeft: () => {
            return (
              <View>
                <FontAwesome.Button
                  name="long-arrow-left"
                  style={{marginLeft: -5}}
                  size={Platform.OS === 'ios' ? 25 : 22}
                  color="#333"
                  backgroundColor={'#fff'}
                  onPress={() => {
                    navigation.navigate('WishListScreen');
                  }}
                />
              </View>
            );
          },
        })}
      />
    </WishListStack.Navigator>
  );
};
const styles = StyleSheet.create({
  iconStyle: {
    color: '#000',
    marginLeft: 14,
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    alignSelf: 'center',
  },
  tabIconStyle: {
    alignSelf: 'center',
    marginLeft: 14,
    color: '#000',
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textStyle: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
  },
});
